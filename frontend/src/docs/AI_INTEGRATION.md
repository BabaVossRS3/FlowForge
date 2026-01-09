# AI Integration Guide for FlowForge

## Overview

FlowForge now includes AI capabilities to enhance workflow automation with intelligent validation, email crafting, and user guidance features.

## AI Provider Options

### 1. **Google Gemini 1.5 Flash (Recommended - FREE)**
- **Cost**: FREE tier with 15 requests/minute, 1500 requests/day
- **Best for**: Workflow validation, email crafting, guidance
- **Setup**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 2. **OpenAI GPT-4o-mini (Fallback)**
- **Cost**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Best for**: High-quality responses when Gemini limits are reached
- **Setup**: Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. **Alternative Options**
- **Groq**: Free tier with Llama 3.1/Mixtral (ultra-fast)
- **Anthropic Claude**: Haiku model for structured tasks

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Add to your `.env` file:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Get API Keys

#### For Gemini (FREE):
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `.env`

#### For OpenAI (Optional):
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create account and add payment method
3. Create new API key
4. Copy and paste into `.env`

## API Endpoints

### 1. Workflow Validation
**POST** `/api/ai/validate-workflow`

Validates workflow for issues, overlaps, cycles, and invalid configurations.

```javascript
// Request
{
  "workflow": {
    "nodes": [...],
    "edges": [...],
    "triggers": [...]
  }
}

// Response
{
  "success": true,
  "validation": {
    "status": "VALID" | "INVALID",
    "issues": [
      {
        "type": "overlap|cycle|missing_connection|invalid_trigger",
        "severity": "HIGH|MEDIUM|LOW",
        "description": "Issue description",
        "nodeId": "node-id"
      }
    ],
    "suggestions": [
      {
        "description": "Improvement suggestion",
        "priority": "HIGH|MEDIUM|LOW"
      }
    ]
  }
}
```

### 2. Email Crafting
**POST** `/api/ai/craft-email`

Generates professional email responses based on context and conditions.

```javascript
// Request
{
  "emailContext": {
    "senderEmail": "customer@example.com",
    "subject": "Product inquiry",
    "body": "I'm interested in your product..."
  },
  "conditions": {
    "tone": "professional",
    "includeDiscount": true,
    "productCategory": "premium"
  }
}

// Response
{
  "success": true,
  "email": {
    "subject": "Re: Product inquiry",
    "body": "Dear Customer,\n\nThank you for...",
    "tone": "professional",
    "confidence": 0.95
  }
}
```

### 3. Workflow Guidance
**POST** `/api/ai/guidance`

Provides intelligent guidance and suggestions for workflow creation.

```javascript
// Request
{
  "query": "How do I create a workflow that sends emails when a form is submitted?",
  "workflowContext": {
    "existingNodes": [...],
    "userLevel": "beginner"
  }
}

// Response
{
  "success": true,
  "guidance": {
    "guidance": "To create an email workflow...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Email Data Extraction
**POST** `/api/ai/extract-email-data`

Extracts structured data from email content for automation.

```javascript
// Request
{
  "emailContent": "From: customer@example.com\nSubject: Urgent: Order issue..."
}

// Response
{
  "success": true,
  "data": {
    "sender": "customer@example.com",
    "subject": "Urgent: Order issue",
    "intent": "complaint",
    "keyPoints": ["Order not received", "Tracking number invalid"],
    "urgency": "HIGH",
    "requiresAction": true,
    "suggestedActions": ["Check order status", "Contact shipping"]
  }
}
```

## Cost Estimation

### Using Gemini (Recommended)
- **Cost**: $0/month (FREE tier)
- **Limits**: 1500 requests/day = 45,000/month
- **Sufficient for**: Most small to medium applications

### Using OpenAI GPT-4o-mini (Fallback)
- **Cost**: ~$5-15/month for moderate usage
- **Example**: 10,000 requests/month with avg 500 tokens = ~$3-5

### Optimization Tips
1. Cache common validation results
2. Batch email processing
3. Use Gemini for primary requests
4. Switch to OpenAI only when needed
5. Implement rate limiting on frontend

## Frontend Integration Example

```javascript
// Validate workflow before saving
const validateWorkflow = async (workflow) => {
  const response = await fetch('/api/ai/validate-workflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ workflow })
  });
  
  const result = await response.json();
  return result.validation;
};

// Craft email response
const craftEmail = async (emailContext, conditions) => {
  const response = await fetch('/api/ai/craft-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ emailContext, conditions })
  });
  
  const result = await response.json();
  return result.email;
};
```

## Use Cases

### 1. Workflow Validation
- Detect infinite loops
- Find missing connections
- Identify overlapping triggers
- Suggest optimizations

### 2. Email Automation
- Auto-reply to customer inquiries
- Generate personalized responses
- Extract action items from emails
- Classify email urgency

### 3. User Guidance
- Help beginners create workflows
- Suggest best practices
- Troubleshoot issues
- Provide step-by-step instructions

## Security Best Practices

1. **Never expose API keys in frontend**
2. **Use environment variables**
3. **Implement rate limiting**
4. **Add authentication to all AI endpoints**
5. **Validate and sanitize user inputs**
6. **Monitor API usage and costs**

## Switching Providers

To switch from Gemini to OpenAI:
```env
AI_PROVIDER=openai
```

To add Groq or other providers, extend `aiService.js` with new methods.

## Troubleshooting

### "No AI provider configured" error
- Check `.env` file has correct API keys
- Verify `AI_PROVIDER` is set to `gemini` or `openai`
- Restart server after changing `.env`

### Rate limit errors
- Gemini: Wait for rate limit reset (1 minute)
- Switch to OpenAI temporarily
- Implement caching for common requests

### Poor quality responses
- Adjust temperature in `aiService.js`
- Provide more context in prompts
- Try different AI provider

## Next Steps

1. Install dependencies: `npm install`
2. Get Gemini API key (FREE)
3. Add to `.env` file
4. Test endpoints with Postman/curl
5. Integrate into frontend components
6. Monitor usage and costs
