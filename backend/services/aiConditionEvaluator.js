import aiService from './aiService.js';

export async function evaluateWithAI(aiConfig, triggerData) {
  if (!aiConfig.prompt) {
    throw new Error('AI condition requires a prompt');
  }

  try {
    const messageContent = triggerData?.message || '';
    
    // Enhance prompt with explicit instructions for better AI responses
    let enhancedPrompt = aiConfig.prompt;
    
    // If the prompt is too generic or missing, use a smart default based on aiType
    if (!enhancedPrompt || enhancedPrompt.includes('Evaluate this message based on your criteria')) {
      // Use aiType to determine the best prompt
      switch (aiConfig.aiType) {
        case 'sentiment':
          enhancedPrompt = 'Analyze the sentiment of this message. Is it positive (satisfied, happy, pleased, grateful, approving)? Answer ONLY with "true" if positive, or "false" if negative/neutral.';
          break;
        case 'approval':
          enhancedPrompt = 'Does this message indicate approval, agreement, acceptance, or positive response (yes, approved, agreed, confirmed)? Answer ONLY with "true" if yes, or "false" if no.';
          break;
        case 'complaint':
          enhancedPrompt = 'Does this message indicate a complaint, issue, dissatisfaction, or negative feedback (angry, upset, problem, issue)? Answer ONLY with "true" if yes, or "false" if no.';
          break;
        default:
          // For custom, try to be smarter - assume it's about positive sentiment if not specified
          enhancedPrompt = 'Analyze if this message expresses satisfaction, approval, or positive sentiment. Answer with ONLY "true" or "false".';
      }
    }
    
    // Build the full prompt with explicit instructions
    const fullPrompt = `${enhancedPrompt}\n\nMessage to analyze: "${messageContent}"\n\nAnswer with ONLY the word "true" or "false". Nothing else.`;

    console.log('Sending AI evaluation request:', {
      promptLength: fullPrompt.length,
      messageContent: messageContent.substring(0, 100),
      prompt: enhancedPrompt.substring(0, 100),
      aiType: aiConfig.aiType
    });

    const aiResponse = await aiService.generateCompletion(fullPrompt, {
      maxTokens: 5,
      temperature: 0.1
    });
    
    const responseText = aiResponse.trim().toLowerCase();
    
    console.log('AI evaluation response:', responseText);
    console.log('Full AI response (raw):', aiResponse);

    // Parse the response as boolean - be more flexible with parsing
    let result = false;
    if (responseText.includes('true') || responseText === 'true' || responseText === 'yes' || responseText === '1') {
      result = true;
    } else if (responseText.includes('false') || responseText === 'false' || responseText === 'no' || responseText === '0') {
      result = false;
    } else {
      // If response is unclear, log it for debugging
      console.warn('Unclear AI response, defaulting to false:', responseText);
      result = false;
    }
    
    return {
      result,
      aiResponse: responseText,
      messageAnalyzed: messageContent,
      provider: process.env.AI_PROVIDER || 'gemini',
      aiType: aiConfig.aiType
    };
  } catch (error) {
    console.error('Error in AI condition evaluation:', error.message);
    throw new Error(`AI evaluation failed: ${error.message}`);
  }
}

export async function evaluateSentiment(message) {
  try {
    const prompt = `Analyze the sentiment of this message and respond with only one word: positive, negative, or neutral.\n\nMessage: "${message}"`;

    const aiResponse = await aiService.generateCompletion(prompt, {
      maxTokens: 10,
      temperature: 0.3
    });

    const sentiment = aiResponse.trim().toLowerCase();
    
    console.log('Sentiment analysis result:', sentiment);

    return {
      sentiment,
      isPositive: sentiment === 'positive',
      isNegative: sentiment === 'negative',
      isNeutral: sentiment === 'neutral'
    };
  } catch (error) {
    console.error('Error in sentiment analysis:', error.message);
    throw new Error(`Sentiment analysis failed: ${error.message}`);
  }
}

export default {
  evaluateWithAI,
  evaluateSentiment
};
