import express from "express";
import Workflow from "../models/Workflow.js";
import { executeNode } from "../services/nodeExecutor.js";

const router = express.Router();

router.post("/slack", async (req, res) => {
  try {
    const { event, challenge } = req.body;
    
    if (challenge) {
      return res.json({ challenge });
    }

    if (event && event.type === 'message') {
      const messageData = {
        platform: 'slack',
        channel: event.channel,
        user: event.user,
        text: event.text,
        timestamp: event.ts,
      };

      await processChatMessage(messageData);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Slack webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/whatsapp", (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'flowforge_webhook_token';
    
    console.log('WhatsApp webhook verification request received');
    console.log('Mode:', mode);
    console.log('Token received:', token);
    console.log('Expected token:', verifyToken);
    console.log('Challenge:', challenge);
    console.log('Token match:', token === verifyToken);
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('✅ WhatsApp webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.error('❌ WhatsApp webhook verification failed');
      console.error('Mode check:', mode === 'subscribe');
      console.error('Token check:', token === verifyToken);
      res.status(403).json({ error: 'Verification failed' });
    }
  } catch (error) {
    console.error('WhatsApp webhook verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/whatsapp", async (req, res) => {
  try {
    console.log('WhatsApp webhook received raw request body:', JSON.stringify(req.body, null, 2));
    
    // Meta sends messages in nested structure: entry[0].changes[0].value.messages
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    
    console.log('Parsed WhatsApp webhook - messages found:', messages?.length || 0);
    
    if (messages && messages.length > 0) {
      for (const message of messages) {
        // Only process text messages
        if (message.type !== 'text') {
          console.log('Skipping non-text message type:', message.type);
          continue;
        }
        
        console.log('Processing WhatsApp message:', {
          from: message.from,
          text: message.text?.body,
          timestamp: message.timestamp
        });
        
        const messageData = {
          platform: 'whatsapp',
          from: message.from,
          text: message.text?.body || '',
          timestamp: message.timestamp,
        };

        await processChatMessage(messageData);
      }
    } else {
      console.log('No messages found in webhook payload');
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/telegram", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (message) {
      const messageData = {
        platform: 'telegram',
        chat: message.chat?.id,
        user: message.from?.username,
        text: message.text || '',
        timestamp: message.date,
      };

      await processChatMessage(messageData);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/discord", async (req, res) => {
  try {
    const { channel_id, author, content } = req.body;
    
    if (content) {
      const messageData = {
        platform: 'discord',
        channel: channel_id,
        user: author?.username,
        text: content,
        timestamp: new Date().toISOString(),
      };

      await processChatMessage(messageData);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Discord webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/teams", async (req, res) => {
  try {
    const { text, from, channelId } = req.body;
    
    if (text) {
      const messageData = {
        platform: 'teams',
        channel: channelId,
        user: from?.name,
        text: text,
        timestamp: new Date().toISOString(),
      };

      await processChatMessage(messageData);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Teams webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

function normalizeTriggerData(messageData) {
  return {
    message: messageData.text || '',
    sender: messageData.from || messageData.user || messageData.chat || '',
    senderName: messageData.senderName || '',
    platform: messageData.platform || '',
    channel: messageData.channel || '',
    timestamp: messageData.timestamp || Date.now(),
    messageId: messageData.messageId || `msg-${Date.now()}`
  };
}

async function processChatMessage(messageData) {
  try {
    console.log('Processing chat message:', {
      platform: messageData.platform,
      from: messageData.from,
      text: messageData.text,
      channel: messageData.channel
    });
    
    const workflows = await Workflow.find({ isActive: true });
    console.log(`Found ${workflows.length} active workflows`);
    
    for (const workflow of workflows) {
      const triggerNode = workflow.nodes?.find(node => node.data?.type === 'trigger');
      if (!triggerNode) {
        console.log(`Workflow ${workflow._id}: No trigger node found`);
        continue;
      }
      
      const chatConfig = triggerNode.data?.config?.chatMessage;
      if (!chatConfig) {
        console.log(`Workflow ${workflow._id}: No chat config found`);
        continue;
      }
      
      console.log(`Workflow ${workflow._id}: Checking chat trigger`, {
        configPlatform: chatConfig.platform,
        messagePlatform: messageData.platform,
        keywords: chatConfig.keywords,
        matchType: chatConfig.matchType,
        channelOrPerson: chatConfig.channelOrPerson
      });
      
      // Check platform match
      if (chatConfig.platform !== messageData.platform) {
        console.log(`Workflow ${workflow._id}: Platform mismatch (${chatConfig.platform} !== ${messageData.platform})`);
        continue;
      }
      
      // Check channel/person match
      if (chatConfig.channelOrPerson && chatConfig.channelOrPerson.trim()) {
        // Normalize phone numbers by removing all non-digit characters for comparison
        const normalizePhone = (phone) => phone.replace(/\D/g, '');
        
        const targetChannel = normalizePhone(chatConfig.channelOrPerson);
        const messageChannel = normalizePhone(messageData.channel || messageData.from || messageData.user || '');
        
        console.log(`Workflow ${workflow._id}: Checking channel (${targetChannel} vs ${messageChannel})`);
        
        if (messageChannel !== targetChannel) {
          console.log(`Workflow ${workflow._id}: Channel mismatch`);
          continue;
        }
      }
      
      // Check keyword match
      const hasKeywords = chatConfig.keywords && chatConfig.keywords.trim();
      const matchType = chatConfig.matchType || 'contains';
      
      console.log(`Workflow ${workflow._id}: Keyword check - hasKeywords: ${hasKeywords}, matchType: ${matchType}`);
      
      if (hasKeywords && matchType !== 'any') {
        const keywords = chatConfig.keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
        const messageText = (messageData.text || '').toLowerCase();
        
        console.log(`Workflow ${workflow._id}: Keywords to match: ${keywords.join(', ')}, Message text: "${messageText}"`);
        
        if (keywords.length === 0) {
          console.log(`Workflow ${workflow._id}: No valid keywords after filtering`);
          continue;
        }
        
        let matched = false;
        
        switch (matchType) {
          case 'exact':
            matched = keywords.some(keyword => messageText === keyword);
            console.log(`Workflow ${workflow._id}: Exact match result: ${matched}`);
            break;
          case 'startsWith':
            matched = keywords.some(keyword => messageText.startsWith(keyword));
            console.log(`Workflow ${workflow._id}: StartsWith match result: ${matched}`);
            break;
          case 'contains':
          default:
            matched = keywords.some(keyword => messageText.includes(keyword));
            console.log(`Workflow ${workflow._id}: Contains match result: ${matched}`);
            break;
        }
        
        if (!matched) {
          console.log(`Workflow ${workflow._id}: Keyword match failed`);
          continue;
        }
      } else if (matchType === 'any') {
        console.log(`Workflow ${workflow._id}: Match type is 'any', triggering on any message`);
      }
      
      console.log(`✅ Chat trigger matched for workflow ${workflow._id} on ${messageData.platform}`);
      
      try {
        const executionResults = {};
        const nodeMap = {};
        workflow.nodes.forEach(node => {
          nodeMap[node.id] = node;
        });

        const triggerNodes = workflow.nodes.filter(node => 
          !workflow.edges.some(edge => edge.target === node.id)
        );

        console.log(`Executing ${triggerNodes.length} trigger nodes for workflow ${workflow._id}`);

        for (const triggerNode of triggerNodes) {
          console.log(`Executing node ${triggerNode.id} of type ${triggerNode.data?.type}`);
          const normalizedTriggerData = normalizeTriggerData(messageData);
          await executeNode(triggerNode, nodeMap, workflow.edges, executionResults, workflow.userId, normalizedTriggerData);
        }

        console.log(`Workflow ${workflow._id} execution completed. Results:`, executionResults);

        const log = {
          timestamp: new Date(),
          status: 'success',
          message: 'Chat message triggered workflow execution',
          results: executionResults,
          chatData: messageData,
        };

        workflow.executionLogs.push(log);
        await workflow.save();
        
        console.log(`✅ Workflow ${workflow._id} execution logged and saved`);
      } catch (executionError) {
        console.error(`Error executing workflow ${workflow._id}:`, executionError);
        
        const log = {
          timestamp: new Date(),
          status: 'error',
          message: 'Chat message workflow execution failed',
          error: executionError.message,
          chatData: messageData,
        };
        
        workflow.executionLogs.push(log);
        await workflow.save();
      }
    }
  } catch (error) {
    console.error('Error processing chat message:', error);
  }
}


export default router;
