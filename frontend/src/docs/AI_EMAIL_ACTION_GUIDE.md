# AI Email Action Guide

## Overview

AI Email Action automatically generates and sends contextual email responses based on trigger messages and condition evaluations. Instead of writing static emails, AI creates personalized, intelligent responses that match the situation.

## Use Cases

### 1. Complaint Response Automation
**Scenario:** Customer sends a complaint via WhatsApp/email

**Workflow:**
- Trigger: Message received
- Condition: AI detects complaint
- Action: AI generates empathetic apology email → Sent to customer

**Result:** Customer receives a personalized apology addressing their specific complaint

### 2. Approval Confirmation
**Scenario:** Customer approves a proposal

**Workflow:**
- Trigger: Message received
- Condition: AI detects approval
- Action: AI generates grateful confirmation email → Sent to customer

**Result:** Customer receives confirmation with next steps

### 3. Inquiry Response
**Scenario:** Customer asks a question

**Workflow:**
- Trigger: Email received
- Condition: AI detects inquiry
- Action: AI generates helpful response email → Sent to customer

**Result:** Customer gets a personalized answer to their question

### 4. Feedback Acknowledgment
**Scenario:** Customer provides feedback

**Workflow:**
- Trigger: Message received
- Condition: AI detects feedback
- Action: AI generates thank you email → Sent to customer

**Result:** Customer feels heard and appreciated

## How It Works

1. **Trigger fires** - Message is received (WhatsApp, Email, Slack, etc.)
2. **Condition evaluates** - AI determines message type (complaint, approval, inquiry, etc.)
3. **AI generates email** - Based on:
   - Message content
   - Detected context type
   - Configured tone
   - Call to action settings
4. **Email is sent** - Automatically to the customer
5. **Logged** - Execution logged for audit trail

## Setup

### Prerequisites
- Email integration configured in FlowForge
- GEMINI_API_KEY set in backend `.env`
- Trigger node (WhatsApp, Email, etc.)
- Condition node (to detect message type)

### Configuration Steps

1. **Add Action Node**
   - Drag "Action" node to canvas
   - Select "AI Email Generation"

2. **Configure Context Type**
   - **Complaint Response** - For customer complaints
   - **Approval Confirmation** - For approvals/agreements
   - **Inquiry Response** - For questions
   - **Feedback Response** - For feedback
   - **Custom Context** - Define your own

3. **Select Email Tone**
   - **Professional** - Formal business tone
   - **Friendly** - Warm and approachable
   - **Empathetic** - Understanding and supportive
   - **Apologetic** - Regretful and solution-focused
   - **Grateful** - Thankful and appreciative

4. **Configure Recipients**
   - **Recipient Email** - Leave empty to auto-use trigger sender
   - **From Email** - Leave empty to use email integration default

5. **Add Call to Action** (Optional)
   - Enable/disable call to action
   - Customize the CTA text

## Example Workflow: Complaint Handling

### Setup
```
WhatsApp Trigger
    ↓
AI Condition: "Is this a complaint?"
    ├─ TRUE → AI Email Action (Complaint Response, Empathetic tone)
    └─ FALSE → AI Email Action (Thank you, Grateful tone)
```

### Incoming Message
```
"Your service is terrible! I've been waiting 3 days for a response!"
```

### AI Condition Result
**TRUE** - Detected as complaint

### AI Generated Email
```
Subject: We're Here to Help - Your Concern Matters to Us

Dear Customer,

Thank you for reaching out, and I sincerely apologize that you've had a frustrating experience with our service. A 3-day wait is unacceptable, and I understand your frustration.

I want to assure you that we take your concerns seriously. Our team is committed to providing timely and quality support, and we've clearly fallen short in your case.

I'm personally looking into your issue right now to ensure we resolve this quickly. You can expect a full response from our team within 24 hours.

Again, I apologize for the inconvenience. We value your business and want to make this right.

Best regards,
Support Team
```

## Email Context Types

### Complaint Response
- **Purpose:** Address customer dissatisfaction
- **Tone Recommendation:** Empathetic or Apologetic
- **AI Focus:** Acknowledge issue, offer solution, rebuild trust

### Approval Confirmation
- **Purpose:** Confirm customer agreement
- **Tone Recommendation:** Grateful or Professional
- **AI Focus:** Express appreciation, outline next steps

### Inquiry Response
- **Purpose:** Answer customer questions
- **Tone Recommendation:** Professional or Friendly
- **AI Focus:** Provide clear, helpful information

### Feedback Response
- **Purpose:** Acknowledge customer feedback
- **Tone Recommendation:** Grateful or Friendly
- **AI Focus:** Thank customer, show action on feedback

### Custom Context
- **Purpose:** Define your own scenario
- **Example:** "Customer is requesting a refund"
- **AI Focus:** Based on your description

## Email Tones

### Professional
- Formal business language
- Clear and structured
- Best for: Official communications, serious matters

### Friendly
- Warm and approachable
- Conversational tone
- Best for: General inquiries, positive interactions

### Empathetic
- Understanding and supportive
- Shows emotional intelligence
- Best for: Complaints, difficult situations

### Apologetic
- Regretful and solution-focused
- Takes responsibility
- Best for: Service failures, mistakes

### Grateful
- Thankful and appreciative
- Positive and encouraging
- Best for: Approvals, feedback, positive interactions

## Advanced Configuration

### Custom Call to Action
Instead of default CTA, customize it:
- "Please reply with your account number so we can expedite this"
- "Schedule a call with our team to discuss solutions"
- "Visit our help center for more information"

### Dynamic Recipient
Leave recipient email empty to automatically use:
- WhatsApp: Sender's phone number (converted to email format)
- Email: Sender's email address
- Slack: Sender's email from Slack profile

### Custom From Email
Override the default sender:
- Useful for support team email addresses
- Allows different departments to send emails
- Must be configured in email integration

## Best Practices

### 1. Pair with AI Condition
Always use AI Condition before AI Email Action:
```
AI Condition (detect type) → AI Email Action (generate response)
```

### 2. Use Appropriate Tone
Match tone to context:
- Complaint → Empathetic/Apologetic
- Approval → Grateful
- Inquiry → Professional/Friendly
- Feedback → Grateful

### 3. Test with Sample Messages
Before deploying, test with various message types:
- Actual complaints
- Approvals
- Questions
- Feedback

### 4. Monitor Generated Emails
Check execution logs to see:
- Generated subject lines
- Email tone used
- Recipients
- Any errors

### 5. Customize Call to Action
Make CTA relevant to your business:
- Support: "Please reply with details"
- Sales: "Schedule a demo"
- Feedback: "Tell us more"

## Troubleshooting

### Issue: Email not sent

**Check:**
1. Email integration is configured
2. Recipient email is valid
3. GEMINI_API_KEY is set
4. Execution logs show error details

### Issue: Generated email is too formal/casual

**Solution:**
1. Change the tone setting
2. Adjust custom context description
3. Test with different context types

### Issue: Email missing important information

**Solution:**
1. Refine the context description
2. Update call to action text
3. Check trigger message contains necessary info

### Issue: AI generates incorrect subject line

**Solution:**
1. Ensure condition correctly detected message type
2. Verify context type matches the message
3. Check trigger message is clear and complete

## Execution Logs

Each AI Email Action execution logs:
- **Status:** Success or failure
- **Recipient:** Who email was sent to
- **Subject:** Generated subject line
- **Context Type:** What type of email was generated
- **Tone:** Tone used
- **Preview:** First 100 chars of email
- **Error:** Any error message if failed

## Cost Considerations

**Completely FREE!**
- Uses Google Gemini (free tier)
- No cost per email generated
- Unlimited emails
- No hidden charges

## Limitations

1. **AI Quality** - Depends on message clarity
2. **Language** - Works best with English
3. **Context** - Only sees current message, not conversation history
4. **Customization** - Limited to predefined tones and contexts
5. **Latency** - Takes 1-2 seconds to generate email

## Future Enhancements

- [ ] Conversation history context
- [ ] Custom tone definitions
- [ ] Email template variables
- [ ] A/B testing different tones
- [ ] Sentiment-based tone selection
- [ ] Multi-language support
- [ ] Email scheduling
- [ ] Attachment support

## Example Workflows

### Workflow 1: Support Ticket Automation
```
Email Trigger
    ↓
AI Condition: Detect issue type
    ├─ Complaint → AI Email (Empathetic)
    ├─ Question → AI Email (Professional)
    └─ Feedback → AI Email (Grateful)
```

### Workflow 2: WhatsApp Customer Service
```
WhatsApp Trigger
    ↓
AI Condition: Detect sentiment
    ├─ Negative → AI Email (Apologetic)
    └─ Positive → AI Email (Grateful)
```

### Workflow 3: Sales Inquiry Response
```
Email Trigger
    ↓
AI Condition: Detect inquiry type
    ├─ Pricing Question → AI Email (Professional)
    ├─ Feature Question → AI Email (Friendly)
    └─ Demo Request → AI Email (Grateful)
```

## Security & Privacy

- Email content is not stored in logs (only preview)
- Recipient email is encrypted in database
- Uses secure SMTP connection
- No data sent to third parties except Gemini API
- Compliant with email security standards

## Support

For issues or questions:
1. Check execution logs for error details
2. Verify email integration is configured
3. Ensure GEMINI_API_KEY is valid
4. Test with simple messages first
5. Check backend console for detailed errors
