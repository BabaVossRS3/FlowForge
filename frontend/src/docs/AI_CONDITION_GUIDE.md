# AI-Powered Conditions Guide

## Overview

AI Conditions allow you to use artificial intelligence to intelligently evaluate incoming messages and make decisions in your workflows. Instead of simple text matching, AI can understand context, sentiment, intent, and nuance.

## Use Cases

### 1. Email Automation with Approval Detection
**Scenario:** You receive customer emails and need to route them based on whether they approve or reject something.

**Workflow:**
- Trigger: Email received
- Condition: AI evaluates if email contains approval
- True branch: Send confirmation email
- False branch: Send follow-up request

### 2. Customer Support Triage
**Scenario:** Incoming messages need to be routed based on urgency and sentiment.

**Workflow:**
- Trigger: WhatsApp/Slack message received
- Condition: AI detects if message is a complaint or urgent issue
- True branch: Escalate to support team
- False branch: Send automated response

### 3. Sentiment-Based Response
**Scenario:** Respond differently based on customer sentiment.

**Workflow:**
- Trigger: Customer feedback message
- Condition: AI analyzes sentiment
- True branch (positive): Add to testimonials, send thank you
- False branch (negative): Flag for review, send apology

### 4. Lead Qualification
**Scenario:** Automatically qualify leads based on message content.

**Workflow:**
- Trigger: Inquiry message received
- Condition: AI determines if lead is qualified
- True branch: Send sales materials
- False branch: Send general information

## Setup

### 1. Configure Google Gemini API Key

Add your Google Gemini API key to your backend environment:

```bash
export GEMINI_API_KEY="your-gemini-api-key"
export AI_PROVIDER="gemini"
```

Or add to `.env` file:
```
GEMINI_API_KEY=your-gemini-api-key
AI_PROVIDER=gemini
```

**Get a free Gemini API key:**
1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Create a new project or select existing
4. Copy your API key
5. Add to `.env` file

**Cost:** Completely FREE with generous rate limits!

### 2. Create a Condition Node

1. Add a **Condition** node to your workflow
2. Select **AI Evaluation** as the condition type
3. Choose an evaluation type or write a custom prompt

## Evaluation Types

### Sentiment Analysis
Evaluates if the message sentiment is positive.

**Default Prompt:**
```
Is the sentiment of this message positive? Respond with only "true" or "false".
```

**Use When:** You want to respond differently based on customer mood/tone.

### Approval Detection
Checks if the message indicates approval, agreement, or positive response.

**Default Prompt:**
```
Does this message indicate approval, agreement, or positive response? Respond with only "true" or "false".
```

**Use When:** You need to detect yes/no, approve/reject, or agreement responses.

### Complaint Detection
Checks if the message indicates a complaint, issue, or negative feedback.

**Default Prompt:**
```
Does this message indicate a complaint, issue, or negative feedback? Respond with only "true" or "false".
```

**Use When:** You need to identify and escalate problems.

### Custom Evaluation
Write your own evaluation criteria.

**Example Prompts:**

```
Does this message indicate the customer wants to cancel their subscription? 
Respond with only "true" or "false".
```

```
Is this message asking for a refund or money back? 
Respond with only "true" or "false".
```

```
Does this message contain a valid email address? 
Respond with only "true" or "false".
```

## How It Works

1. **Trigger fires** - Message is received (WhatsApp, Slack, Email, etc.)
2. **AI evaluates** - Message is sent to OpenAI with your evaluation prompt
3. **AI responds** - Returns "true" or "false"
4. **Branching** - Workflow routes to true or false branch based on result
5. **Actions execute** - Connected actions run on the appropriate branch

## Example Workflow: Email Approval System

**Setup:**
```
Email Trigger
    ↓
AI Condition: "Does this email indicate approval?"
    ├─ True → Send Confirmation Email
    └─ False → Send Follow-up Request
```

**Incoming Email 1:** "Yes, I approve this proposal"
- AI evaluates: **TRUE** ✓
- Executes: Send Confirmation Email

**Incoming Email 2:** "Can you send more details?"
- AI evaluates: **FALSE** ✗
- Executes: Send Follow-up Request

## Best Practices

### 1. Be Specific in Prompts
❌ Bad: "Is this good?"
✅ Good: "Does this message indicate the customer is satisfied with the product?"

### 2. Always Request True/False Response
Your prompt should always end with:
```
Respond with only "true" or "false".
```

### 3. Test with Sample Messages
Before deploying, test your workflow with various message examples to ensure AI evaluates correctly.

### 4. Use Clear Language
AI works best with clear, unambiguous criteria:
```
Does this message contain a request for a refund?
```

### 5. Consider Edge Cases
Think about messages that might be ambiguous:
- "I'm not sure if I approve" - Is this true or false?
- "Maybe later" - Is this a rejection?

## Troubleshooting

### Issue: AI always returns the same result

**Solution:** Your prompt might be too vague. Make it more specific:
- ❌ "Is this positive?"
- ✅ "Does this message express satisfaction with our service?"

### Issue: OpenAI API errors

**Solution:** Check that:
1. `OPENAI_API_KEY` is set in environment
2. Your API key is valid and has credits
3. You're not hitting rate limits

### Issue: Unexpected results

**Solution:** 
1. Check the execution logs to see what AI returned
2. Refine your prompt to be clearer
3. Test with the exact message that failed

## Cost Considerations

**Google Gemini is completely FREE!**

- **$0.00** per evaluation
- No credit card required for free tier
- Generous rate limits (1000+ requests per day)
- No hidden costs

This makes AI-powered conditions accessible to everyone without worrying about API costs.

## Advanced Prompts

### Multi-Criteria Evaluation
```
Evaluate this message for:
1. Is it a complaint?
2. Is it urgent?
Return "true" only if BOTH are true.
```

### Contextual Evaluation
```
Given this is a customer support message, does it indicate 
the customer needs immediate assistance? 
Respond with only "true" or "false".
```

### Tone Detection
```
Is the tone of this message professional and respectful?
Respond with only "true" or "false".
```

## Limitations

1. **AI is not perfect** - It can make mistakes, especially with sarcasm or context
2. **Language dependent** - Works best with English; other languages may have lower accuracy
3. **Cost** - Each evaluation costs money
4. **Latency** - AI evaluation takes 1-2 seconds per message
5. **Context limited** - AI only sees the current message, not conversation history

## Future Enhancements

- [ ] Support for conversation history/context
- [ ] Custom AI models
- [ ] Batch evaluation for cost savings
- [ ] AI confidence scores
- [ ] Multiple AI providers (Claude, Gemini, etc.)
- [ ] Local AI models for privacy

## Examples

### Example 1: Customer Feedback Routing
```
Prompt: "Is this customer feedback positive about our product?"

Message: "Your product is amazing! Best purchase ever!"
Result: TRUE → Send thank you email, add to testimonials

Message: "The product broke after one week"
Result: FALSE → Send apology, offer replacement
```

### Example 2: Lead Qualification
```
Prompt: "Is this person interested in purchasing our service?"

Message: "How much does your service cost?"
Result: TRUE → Send pricing and demo

Message: "Just browsing"
Result: FALSE → Send general information
```

### Example 3: Support Escalation
```
Prompt: "Does this message indicate an urgent or critical issue?"

Message: "The system is down and I can't access my account!"
Result: TRUE → Escalate to senior support

Message: "How do I change my password?"
Result: FALSE → Send FAQ link
```
