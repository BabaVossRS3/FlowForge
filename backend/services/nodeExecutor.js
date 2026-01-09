import Integration from "../models/Integration.js";
import nodemailer from "nodemailer";
import { evaluateCondition } from "./conditionEvaluator.js";
import { evaluateWithAI, evaluateSentiment } from "./aiConditionEvaluator.js";
import aiService from "./aiService.js";

function generateSampleTriggerData(triggerType, config) {
  switch (triggerType) {
    case 'chatMessage':
      return {
        message: 'This is approved',
        sender: '+1234567890',
        senderName: 'Test User',
        platform: config.chatMessage?.platform || 'whatsapp',
        channel: config.chatMessage?.channelOrPerson || 'Test Channel',
        timestamp: Date.now(),
        messageId: `msg-${Date.now()}`
      };
    case 'webhook':
      return {
        body: { test: 'data' },
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        path: '/webhook'
      };
    case 'schedule':
      return {
        executionTime: Date.now(),
        scheduleName: 'Test Schedule'
      };
    case 'manually':
      return {
        message: 'Manual trigger executed',
        timestamp: Date.now()
      };
    default:
      return {
        timestamp: Date.now()
      };
  }
}

export async function executeNode(node, nodeMap, edges, results, userId, triggerData = null) {
  const config = node.data?.config || {};
  
  switch (node.data.type) {
    case 'trigger':
      const triggerType = Object.keys(config)[0];
      const finalTriggerData = triggerData || generateSampleTriggerData(triggerType, config);
      results[node.id] = {
        type: 'trigger',
        status: 'completed',
        data: { 
          message: 'Trigger executed',
          triggerData: finalTriggerData
        }
      };
      triggerData = finalTriggerData;
      break;
      
    case 'action':
      await executeActionNode(node, config, results, userId);
      break;
      
    case 'condition':
      let conditionResult;
      let conditionData = { message: 'Condition evaluated', config: config };
      
      try {
        // Check if this is an AI condition
        if (config.ai) {
          const triggerNode = Object.values(results).find(r => r.type === 'trigger');
          const triggerData = triggerNode?.data?.triggerData;
          
          if (!triggerData) {
            throw new Error('No trigger data available for AI evaluation');
          }
          
          console.log('AI Condition Config:', {
            aiType: config.ai.aiType,
            prompt: config.ai.prompt?.substring(0, 100),
            messageContent: triggerData.message
          });
          
          const aiEvaluation = await evaluateWithAI(config.ai, triggerData);
          conditionResult = aiEvaluation.result;
          conditionData.aiEvaluation = aiEvaluation;
          conditionData.message = `AI condition evaluated: ${aiEvaluation.aiResponse}`;
          
          console.log('AI Condition Result:', {
            aiType: config.ai.aiType,
            result: conditionResult,
            aiResponse: aiEvaluation.aiResponse,
            messageAnalyzed: aiEvaluation.messageAnalyzed
          });
        } else {
          // Regular condition evaluation
          conditionResult = evaluateCondition(config, results);
        }
      } catch (error) {
        console.error('Error evaluating condition:', error);
        conditionResult = false;
        conditionData.error = error.message;
      }
      
      results[node.id] = {
        type: 'condition',
        status: 'completed',
        data: { 
          ...conditionData,
          result: conditionResult
        }
      };
      break;
      
    case 'notification':
      await executeNotificationNode(node, config, results, userId);
      break;
      
    default:
      results[node.id] = {
        type: node.data.type,
        status: 'completed',
        data: { message: 'Node executed' }
      };
  }

  const connectedEdges = edges.filter(edge => edge.source === node.id);
  
  if (node.data.type === 'condition') {
    const conditionResult = results[node.id]?.data?.result;
    for (const edge of connectedEdges) {
      const shouldExecute = conditionResult ? edge.label === 'true' : edge.label === 'false';
      if (shouldExecute) {
        const nextNode = nodeMap[edge.target];
        if (nextNode) {
          await executeNode(nextNode, nodeMap, edges, results, userId, triggerData);
        }
      }
    }
  } else {
    for (const edge of connectedEdges) {
      const nextNode = nodeMap[edge.target];
      if (nextNode) {
        await executeNode(nextNode, nodeMap, edges, results, userId, triggerData);
      }
    }
  }
}

async function executeActionNode(node, config, results, userId) {
  if (config.aiEmail) {
    await generateAndSendAIEmail(node, config.aiEmail, results, userId);
  } else if (config.aiChat) {
    await generateAndSendAIChatMessage(node, config.aiChat, results, userId);
  } else if (config.aiTransform) {
    await executeAIDataTransform(node, config.aiTransform, results, userId);
  } else if (config.email) {
    await sendEmail(node, config.email, results, userId, 'action');
  } else if (config.http) {
    await makeHttpRequest(node, config.http, results);
  } else if (config.database) {
    results[node.id] = {
      type: 'action',
      status: 'completed',
      data: { message: 'Database action executed', config: config.database }
    };
  } else {
    results[node.id] = {
      type: 'action',
      status: 'completed',
      data: { message: 'Action executed' }
    };
  }
}

async function executeNotificationNode(node, config, results, userId) {
  if (config.aiSms) {
    await generateAndSendAISMS(node, config.aiSms, results, userId);
  } else if (config.email) {
    await sendEmail(node, config.email, results, userId, 'notification');
  } else {
    results[node.id] = {
      type: 'notification',
      status: 'completed',
      data: { message: 'Notification sent' }
    };
  }
}

async function sendEmail(node, emailConfig, results, userId, nodeType) {
  try {
    const emailIntegration = await Integration.findOne({
      userId: userId,
      integrationId: 'email'
    });

    if (!emailIntegration) {
      results[node.id] = {
        type: nodeType,
        status: 'failed',
        data: { message: 'Email integration not configured', error: 'No SMTP credentials found' }
      };
      return;
    }

    const credentials = emailIntegration.getCredentials();
    
    const transporter = nodemailer.createTransport({
      host: credentials.smtpHost,
      port: parseInt(credentials.smtpPort),
      secure: credentials.smtpPort === '465',
      auth: {
        user: credentials.smtpUser,
        pass: credentials.smtpPassword
      }
    });

    const mailOptions = {
      from: credentials.smtpUser,
      to: emailConfig.to || credentials.smtpUser,
      subject: emailConfig.subject || `Workflow ${nodeType}`,
    };

    if (emailConfig.body) {
      mailOptions.text = emailConfig.body;
    } else {
      mailOptions.text = `${nodeType} from FlowForge workflow`;
    }

    if (emailConfig.cc) {
      mailOptions.cc = emailConfig.cc;
    }

    if (emailConfig.bcc) {
      mailOptions.bcc = emailConfig.bcc;
    }

    if (emailConfig.replyTo) {
      mailOptions.replyTo = emailConfig.replyTo;
    }

    if (emailConfig.isHtml) {
      mailOptions.html = emailConfig.body;
      delete mailOptions.text;
    }

    if (emailConfig.attachments && emailConfig.attachments.length > 0) {
      mailOptions.attachments = emailConfig.attachments.map(att => ({
        filename: att.name,
        path: att.url
      }));
    }

    await transporter.sendMail(mailOptions);

    results[node.id] = {
      type: nodeType,
      status: 'completed',
      data: { 
        message: `${nodeType} email sent successfully`,
        to: mailOptions.to,
        subject: mailOptions.subject
      }
    };
  } catch (error) {
    console.error(`${nodeType} email sending error:`, error);
    results[node.id] = {
      type: nodeType,
      status: 'failed',
      data: { message: `${nodeType} email sending failed`, error: error.message }
    };
  }
}

async function executeAIDataTransform(node, aiTransformConfig, results, userId) {
  try {
    const triggerNode = Object.values(results).find(r => r.type === 'trigger');
    const triggerData = triggerNode?.data?.triggerData;
    
    if (!triggerData) {
      throw new Error('No trigger data available for AI transformation');
    }

    let prompt = '';
    switch (aiTransformConfig.transformType) {
      case 'extract':
        prompt = `Extract structured data from this message and return as ${aiTransformConfig.outputFormat}:\n"${triggerData.message}"`;
        break;
      case 'summarize':
        prompt = `Create a concise summary of this message and return as ${aiTransformConfig.outputFormat}:\n"${triggerData.message}"`;
        break;
      case 'categorize':
        prompt = `Categorize this message and return as ${aiTransformConfig.outputFormat}:\n"${triggerData.message}"`;
        break;
      case 'translate':
        prompt = `Translate this message to English and return as ${aiTransformConfig.outputFormat}:\n"${triggerData.message}"`;
        break;
      case 'format':
        prompt = `Reformat this message data and return as ${aiTransformConfig.outputFormat}:\n"${triggerData.message}"`;
        break;
      case 'custom':
        prompt = `${aiTransformConfig.customPrompt}\n\nData: "${triggerData.message}"\n\nReturn as ${aiTransformConfig.outputFormat}`;
        break;
    }

    console.log('Executing AI data transformation:', aiTransformConfig.transformType);

    const aiResponse = await aiService.generateCompletion(prompt, {
      maxTokens: 1000,
      temperature: 0.3
    });

    let transformedData = aiResponse;
    if (aiTransformConfig.outputFormat === 'json') {
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        transformedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { result: aiResponse };
      } catch (e) {
        transformedData = { result: aiResponse };
      }
    }

    results[node.id] = {
      type: 'action',
      status: 'completed',
      data: {
        message: 'AI data transformation completed',
        transformType: aiTransformConfig.transformType,
        outputFormat: aiTransformConfig.outputFormat,
        transformedData: transformedData,
        variableName: aiTransformConfig.resultVariableName
      }
    };

    if (aiTransformConfig.storeResult) {
      results[aiTransformConfig.resultVariableName] = {
        type: 'variable',
        status: 'completed',
        data: transformedData
      };
    }

    console.log('✅ AI data transformation completed');
  } catch (error) {
    console.error('Error in AI data transformation:', error);
    results[node.id] = {
      type: 'action',
      status: 'failed',
      data: {
        message: 'AI data transformation failed',
        error: error.message
      }
    };
  }
}

async function generateAndSendAISMS(node, aiSmsConfig, results, userId) {
  try {
    const triggerNode = Object.values(results).find(r => r.type === 'trigger');
    const triggerData = triggerNode?.data?.triggerData;
    
    if (!triggerData) {
      throw new Error('No trigger data available for AI SMS generation');
    }

    let contextDescription = aiSmsConfig.customMessage || '';
    switch (aiSmsConfig.contextType) {
      case 'alert':
        contextDescription = 'Generate an urgent alert SMS message';
        break;
      case 'confirmation':
        contextDescription = 'Generate a confirmation SMS message';
        break;
      case 'reminder':
        contextDescription = 'Generate a reminder SMS message';
        break;
      case 'followup':
        contextDescription = 'Generate a follow-up SMS message';
        break;
    }

    const prompt = `${contextDescription}

Message context: "${triggerData.message}"
Character limit: ${aiSmsConfig.characterLimit} characters
${aiSmsConfig.includeLink ? `Include this link: ${aiSmsConfig.linkUrl}` : 'Do not include links'}

Generate a concise SMS message that fits within the character limit.`;

    console.log('Generating AI SMS for context:', aiSmsConfig.contextType);

    const aiResponse = await aiService.generateCompletion(prompt, {
      maxTokens: 200,
      temperature: 0.7
    });

    const smsMessage = aiResponse.trim().substring(0, aiSmsConfig.characterLimit);

    results[node.id] = {
      type: 'notification',
      status: 'completed',
      data: {
        message: 'AI SMS generated successfully',
        smsMessage: smsMessage,
        recipientPhone: aiSmsConfig.recipientPhone || triggerData.sender,
        contextType: aiSmsConfig.contextType,
        characterCount: smsMessage.length,
        characterLimit: aiSmsConfig.characterLimit
      }
    };

    console.log('✅ AI SMS generated:', smsMessage);
  } catch (error) {
    console.error('Error generating AI SMS:', error);
    results[node.id] = {
      type: 'notification',
      status: 'failed',
      data: {
        message: 'AI SMS generation failed',
        error: error.message
      }
    };
  }
}

async function generateAndSendAIChatMessage(node, aiChatConfig, results, userId) {
  try {
    const triggerNode = Object.values(results).find(r => r.type === 'trigger');
    const triggerData = triggerNode?.data?.triggerData;
    
    if (!triggerData) {
      throw new Error('No trigger data available for AI chat message generation');
    }

    // Build context for AI message generation
    const messageContext = {
      senderPhone: triggerData.sender || '',
      senderName: triggerData.senderName || 'User',
      originalMessage: triggerData.message || '',
      platform: triggerData.platform || 'unknown',
      timestamp: triggerData.timestamp || Date.now()
    };

    // Build AI prompt based on context type
    let contextDescription = aiChatConfig.customPrompt || '';
    switch (aiChatConfig.contextType) {
      case 'complaint':
        contextDescription = 'The user has expressed a complaint or issue. Generate an empathetic response acknowledging their concern and offering help.';
        break;
      case 'approval':
        contextDescription = 'The user has approved or agreed to something. Generate a grateful confirmation message.';
        break;
      case 'inquiry':
        contextDescription = 'The user is asking a question. Generate a helpful response answering their inquiry.';
        break;
      case 'feedback':
        contextDescription = 'The user has provided feedback. Generate a response thanking them and acknowledging their feedback.';
        break;
      case 'response':
        contextDescription = 'Generate a direct, contextual response to the user\'s message.';
        break;
    }

    const lengthGuidance = {
      short: '1-2 sentences',
      medium: '2-3 sentences',
      long: '3-5 sentences'
    };

    const prompt = `Generate a chat message reply with the following requirements:

Context: ${contextDescription}

Original Message: "${messageContext.originalMessage}"
User Name: ${messageContext.senderName}
Platform: ${messageContext.platform}

Tone: ${aiChatConfig.tone}
Length: ${lengthGuidance[aiChatConfig.messageLength] || 'medium'}
${aiChatConfig.includeEmoji ? 'Include relevant emojis to make the message engaging.' : 'Do not include emojis.'}

The reply MUST end with a complete sentence. Ensure the final character is '.', '!' or '?'. Do not end mid-sentence.

Generate a natural, conversational message that feels like a direct reply. Keep it concise and appropriate for the platform.`;

    console.log('Generating AI chat message for context:', aiChatConfig.contextType);

    const aiResponse = await aiService.generateCompletion(prompt, {
      maxTokens: 500,
      temperature: 0.7
    });

    let chatMessage = aiResponse.trim();

    // If the model returns a reply that ends mid-sentence, do a single repair pass.
    if (chatMessage && !/[.!?][\s\"'\)\]]*$/.test(chatMessage)) {
      const repairPrompt = `You wrote this chat reply but it appears to be cut off mid-sentence.

Return the FULL corrected reply (starting from the beginning) and ensure it ends with a complete sentence.

Original message to reply to: "${messageContext.originalMessage}"

Draft reply (cut off): "${chatMessage}"

Tone: ${aiChatConfig.tone}
Length: ${lengthGuidance[aiChatConfig.messageLength] || 'medium'}
${aiChatConfig.includeEmoji ? 'Include relevant emojis.' : 'Do not include emojis.'}

Output ONLY the final reply text.`;

      const repaired = await aiService.generateCompletion(repairPrompt, {
        maxTokens: 250,
        temperature: 0.4
      });

      const repairedText = repaired.trim();
      if (repairedText) {
        chatMessage = repairedText;
      }
    }

    // Send message based on platform
    await sendChatMessageByPlatform(messageContext.platform, messageContext.senderPhone, chatMessage, userId);

    results[node.id] = {
      type: 'action',
      status: 'completed',
      data: {
        message: 'AI chat message generated and sent successfully',
        platform: messageContext.platform,
        recipient: messageContext.senderPhone,
        recipientName: messageContext.senderName,
        chatMessage: chatMessage,
        contextType: aiChatConfig.contextType,
        tone: aiChatConfig.tone
      }
    };

    console.log('✅ AI chat message sent successfully on', messageContext.platform);
  } catch (error) {
    console.error('Error generating/sending AI chat message:', error);
    results[node.id] = {
      type: 'action',
      status: 'failed',
      data: {
        message: 'AI chat message generation/sending failed',
        error: error.message
      }
    };
  }
}

async function sendChatMessageByPlatform(platform, recipient, message, userId) {
  try {
    switch (platform?.toLowerCase()) {
      case 'whatsapp':
        await sendWhatsAppMessage(recipient, message, userId);
        break;
      case 'slack':
        await sendSlackMessage(recipient, message, userId);
        break;
      case 'discord':
        await sendDiscordMessage(recipient, message, userId);
        break;
      case 'telegram':
        await sendTelegramMessage(recipient, message, userId);
        break;
      case 'teams':
        await sendTeamsMessage(recipient, message, userId);
        break;
      default:
        console.warn(`Platform ${platform} not yet supported for chat replies`);
        throw new Error(`Platform ${platform} not supported for chat replies`);
    }
  } catch (error) {
    console.error(`Error sending message on ${platform}:`, error);
    throw error;
  }
}

async function sendWhatsAppMessage(phoneNumber, message, userId) {
  try {
    const integration = await Integration.findOne({
      userId: userId,
      integrationId: 'whatsapp'
    });

    if (!integration) {
      throw new Error('WhatsApp integration not configured for this user');
    }

    const credentials = integration.getCredentials();
    const phoneNumberId = String(credentials.phoneNumberId || '').trim();
    let accessToken = String(credentials.accessToken || '').trim();
    if ((accessToken.startsWith('"') && accessToken.endsWith('"')) || (accessToken.startsWith("'") && accessToken.endsWith("'"))) {
      accessToken = accessToken.slice(1, -1).trim();
    }

    if (!phoneNumberId || !accessToken) {
      console.error('WhatsApp credentials issue:', {
        hasPhoneNumberId: !!phoneNumberId,
        hasAccessToken: !!accessToken,
        phoneNumberIdLength: phoneNumberId?.length,
        accessTokenLength: accessToken?.length,
        credentialsKeys: Object.keys(credentials)
      });
      throw new Error('WhatsApp credentials incomplete - missing phoneNumberId or accessToken. Please update your WhatsApp integration settings.');
    }

    console.log('Sending WhatsApp message:', {
      to: phoneNumber,
      phoneNumberId: phoneNumberId.substring(0, 5) + '...',
      accessTokenLength: accessToken.length,
      messageLength: message.length
    });

    const requestBody = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: message }
    };

    console.log('WhatsApp API request:', {
      url: `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      phoneNumberId,
      to: phoneNumber,
      tokenLength: accessToken.length,
      tokenStart: accessToken.substring(0, 10) + '...'
    });

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    const responseText = await response.text();
    
    console.log('WhatsApp API raw response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

    if (!response.ok) {
      console.error('WhatsApp API error details:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      throw new Error(`WhatsApp API error (${response.status}): ${responseText}`);
    }

    console.log('✅ WhatsApp message sent to:', phoneNumber);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    throw error;
  }
}

async function sendSlackMessage(userId, message, workspaceUserId) {
  try {
    const integration = await Integration.findOne({
      userId: workspaceUserId,
      integrationId: 'slack'
    });

    if (!integration) {
      throw new Error('Slack integration not configured');
    }

    const credentials = integration.getCredentials();
    const botToken = credentials.botToken;

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: userId,
        text: message
      })
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    console.log('✅ Slack message sent to:', userId);
  } catch (error) {
    console.error('Error sending Slack message:', error);
    throw error;
  }
}

async function sendDiscordMessage(channelId, message, userId) {
  try {
    const integration = await Integration.findOne({
      userId: userId,
      integrationId: 'discord'
    });

    if (!integration) {
      throw new Error('Discord integration not configured');
    }

    const credentials = integration.getCredentials();
    const botToken = credentials.botToken;

    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${botToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: message
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }

    console.log('✅ Discord message sent to channel:', channelId);
  } catch (error) {
    console.error('Error sending Discord message:', error);
    throw error;
  }
}

async function sendTelegramMessage(chatId, message, userId) {
  try {
    const integration = await Integration.findOne({
      userId: userId,
      integrationId: 'telegram'
    });

    if (!integration) {
      throw new Error('Telegram integration not configured');
    }

    const credentials = integration.getCredentials();
    const botToken = credentials.botToken;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    console.log('✅ Telegram message sent to chat:', chatId);
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
}

async function sendTeamsMessage(channelId, message, userId) {
  try {
    const integration = await Integration.findOne({
      userId: userId,
      integrationId: 'teams'
    });

    if (!integration) {
      throw new Error('Teams integration not configured');
    }

    const credentials = integration.getCredentials();
    const webhookUrl = credentials.webhookUrl;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: message
      })
    });

    if (!response.ok) {
      throw new Error(`Teams API error: ${response.statusText}`);
    }

    console.log('✅ Teams message sent');
  } catch (error) {
    console.error('Error sending Teams message:', error);
    throw error;
  }
}

async function generateAndSendAIEmail(node, aiEmailConfig, results, userId) {
  try {
    const triggerNode = Object.values(results).find(r => r.type === 'trigger');
    const triggerData = triggerNode?.data?.triggerData;
    
    if (!triggerData) {
      throw new Error('No trigger data available for AI email generation');
    }

    // Build context for AI email generation
    const emailContext = {
      senderEmail: aiEmailConfig.recipientEmail || triggerData.sender || 'customer@example.com',
      senderName: triggerData.senderName || 'Customer',
      messageContent: triggerData.message || '',
      platform: triggerData.platform || 'unknown',
      timestamp: triggerData.timestamp || Date.now()
    };

    // Build AI prompt based on context type
    let contextDescription = aiEmailConfig.customContext || '';
    switch (aiEmailConfig.contextType) {
      case 'complaint':
        contextDescription = 'The customer has filed a complaint or expressed dissatisfaction. Write an empathetic response acknowledging their concern and offering a solution.';
        break;
      case 'approval':
        contextDescription = 'The customer has approved or agreed to something. Write a grateful confirmation email.';
        break;
      case 'inquiry':
        contextDescription = 'The customer is asking a question. Write a helpful response answering their inquiry.';
        break;
      case 'feedback':
        contextDescription = 'The customer has provided feedback. Write a response thanking them and addressing their feedback.';
        break;
    }

    const prompt = `Generate a professional email response with the following requirements:

Context: ${contextDescription}

Customer Message: "${emailContext.messageContent}"
Customer Name: ${emailContext.senderName}
Platform: ${emailContext.platform}

Tone: ${aiEmailConfig.tone}

${aiEmailConfig.includeCallToAction ? `Include this call to action: ${aiEmailConfig.callToActionText}` : 'Do not include a call to action.'}

Generate a complete email with:
1. Appropriate subject line
2. Professional greeting
3. Body that addresses the customer's message
4. Closing

Format your response as JSON:
{
  "subject": "email subject",
  "body": "email body text",
  "preview": "short preview of the email"
}`;

    console.log('Generating AI email for context:', aiEmailConfig.contextType);

    const aiResponse = await aiService.generateCompletion(prompt, {
      maxTokens: 1000,
      temperature: 0.7
    });

    let emailContent;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emailContent = JSON.parse(jsonMatch[0]);
      } else {
        emailContent = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response, using raw text:', parseError);
      emailContent = {
        subject: 'Response to your message',
        body: aiResponse,
        preview: aiResponse.substring(0, 100)
      };
    }

    // Get email integration
    const emailIntegration = await Integration.findOne({
      userId: userId,
      integrationId: 'email'
    });

    if (!emailIntegration) {
      throw new Error('Email integration not configured');
    }

    const credentials = emailIntegration.getCredentials();
    
    const transporter = nodemailer.createTransport({
      host: credentials.smtpHost,
      port: parseInt(credentials.smtpPort),
      secure: credentials.smtpPort === '465',
      auth: {
        user: credentials.smtpUser,
        pass: credentials.smtpPassword
      }
    });

    const mailOptions = {
      from: aiEmailConfig.fromEmail || credentials.smtpUser,
      to: emailContext.senderEmail,
      subject: emailContent.subject,
      text: emailContent.body
    };

    await transporter.sendMail(mailOptions);

    results[node.id] = {
      type: 'action',
      status: 'completed',
      data: {
        message: 'AI email generated and sent successfully',
        to: emailContext.senderEmail,
        subject: emailContent.subject,
        contextType: aiEmailConfig.contextType,
        tone: aiEmailConfig.tone,
        preview: emailContent.preview
      }
    };

    console.log('✅ AI email sent successfully to:', emailContext.senderEmail);
  } catch (error) {
    console.error('Error generating/sending AI email:', error);
    results[node.id] = {
      type: 'action',
      status: 'failed',
      data: {
        message: 'AI email generation/sending failed',
        error: error.message
      }
    };
  }
}

async function makeHttpRequest(node, httpConfig, results) {
  try {
    const response = await fetch(httpConfig.url, {
      method: httpConfig.method || 'GET',
      headers: httpConfig.headers || {},
      body: httpConfig.body ? JSON.stringify(httpConfig.body) : undefined
    });

    results[node.id] = {
      type: 'action',
      status: 'completed',
      data: { 
        message: 'HTTP request executed',
        statusCode: response.status,
        url: httpConfig.url
      }
    };
  } catch (error) {
    results[node.id] = {
      type: 'action',
      status: 'failed',
      data: { message: 'HTTP request failed', error: error.message }
    };
  }
}

export default {
  executeNode,
};
