# AI Chat Message Action Guide

## Overview

AI Chat Message Action automatically generates and sends intelligent replies directly on the platform where the message originated. Instead of sending emails or SMS, replies are sent via WhatsApp, Slack, Discord, Telegram, or Teams - maintaining the conversation on the user's preferred platform.

## Supported Platforms

- **WhatsApp** - Send replies to WhatsApp messages
- **Slack** - Reply in Slack channels and DMs
- **Discord** - Send replies in Discord channels
- **Telegram** - Reply to Telegram messages
- **Teams** - Send replies in Teams channels

## Key Features

✅ **Platform Detection** - Automatically detects which platform the message came from
✅ **Sender Tracking** - Remembers who sent the message and replies to them directly
✅ **AI Generation** - Creates contextual, natural responses
✅ **Tone Control** - Professional, Friendly, Empathetic, or Casual
✅ **Message Length** - Short, Medium, or Long responses
✅ **Emoji Support** - Optional emojis for engagement
✅ **Auto-Reply** - Immediate responses to incoming messages

## Use Cases

### 1. Customer Support on WhatsApp
**Scenario:** Customer sends support request via WhatsApp

**Workflow:**
```
WhatsApp Trigger
    ↓
AI Condition: Detect issue type
    ├─ Complaint → AI Chat (Empathetic tone)
    ├─ Question → AI Chat (Professional tone)
    └─ Feedback → AI Chat (Grateful tone)
```

**Result:** Customer gets immediate, contextual reply on WhatsApp

### 2. Slack Team Notifications
**Scenario:** Team member asks question in Slack

**Workflow:**
```
Slack Trigger
    ↓
AI Condition: Detect question type
    ├─ Technical → AI Chat (Professional)
    └─ General → AI Chat (Friendly)
```

**Result:** Automatic helpful response in Slack thread

### 3. Discord Community Support
**Scenario:** Community member posts in Discord

**Workflow:**
```
Discord Trigger
    ↓
AI Condition: Detect support request
    ├─ YES → AI Chat (Friendly, with emojis)
    └─ NO → Archive/Log
```

**Result:** Community gets instant support response

### 4. Telegram Bot Automation
**Scenario:** User sends message to Telegram bot

**Workflow:**
```
Telegram Trigger
    ↓
AI Condition: Detect intent
    ├─ Order Status → AI Chat (Friendly)
    ├─ Support → AI Chat (Empathetic)
    └─ General → AI Chat (Professional)
```

**Result:** Automated bot responses on Telegram

## Configuration

### Response Context Types

**Direct Response**
- Generic contextual reply to any message
- Best for: General conversations

**Complaint Response**
- Empathetic acknowledgment of issues
- Offers help and solutions
- Best for: Customer complaints, issues

**Approval Confirmation**
- Grateful confirmation of agreement
- Acknowledges positive feedback
- Best for: Orders, approvals, confirmations

**Inquiry Response**
- Helpful answer to questions
- Provides relevant information
- Best for: FAQ, support questions

**Feedback Response**
- Thanks user for feedback
- Acknowledges their input
- Best for: Reviews, suggestions, feedback

**Custom Message**
- Define your own context
- Full control over message generation
- Best for: Specific use cases

### Message Tone

**Professional**
- Formal, business-like language
- Clear and structured
- Best for: Support, official communications

**Friendly**
- Warm and approachable
- Conversational tone
- Best for: General inquiries, positive interactions

**Empathetic**
- Understanding and supportive
- Shows emotional intelligence
- Best for: Complaints, difficult situations

**Casual**
- Relaxed and conversational
- Natural, human-like
- Best for: Community, informal channels

### Message Length

**Short** (1-2 sentences)
- Quick acknowledgments
- Fast responses
- Best for: SMS-like brevity

**Medium** (2-3 sentences)
- Balanced responses
- Most common use case
- Best for: General replies

**Long** (3-5 sentences)
- Detailed explanations
- Comprehensive answers
- Best for: Complex questions

### Additional Options

**Include Emojis**
- Adds relevant emojis to messages
- Makes messages more engaging
- Platform-appropriate
- Default: Enabled

**Auto-Reply Immediately**
- Send reply as soon as condition is met
- No delay or approval needed
- Default: Enabled

## Complete Workflow Example

### Intelligent Customer Support System

```
WhatsApp Trigger (Chat Message)
    ↓
AI Data Transform: Extract customer info
    ├─ Name, Phone, Issue Type
    ↓
AI Condition: Analyze sentiment
    ├─ Positive → "Approval" context
    ├─ Negative → "Complaint" context
    └─ Neutral → "Inquiry" context
    ↓
AI Chat Message Reply
    ├─ Positive: Grateful tone, friendly
    ├─ Negative: Empathetic tone, professional
    └─ Neutral: Professional tone, helpful
    ↓
Database: Log interaction
    ↓
AI SMS: Send confirmation SMS
```

**Flow:**
1. Customer sends WhatsApp message
2. System extracts customer information
3. AI analyzes message sentiment
4. Appropriate response is generated
5. Reply sent immediately on WhatsApp
6. Interaction logged to database
7. Confirmation SMS sent

## Platform-Specific Details

### WhatsApp

**Requirements:**
- WhatsApp Business Account
- Meta Business Manager setup
- Phone Number ID
- Access Token

**Features:**
- Text messages
- Automatic sender detection (phone number)
- Maintains conversation thread
- Supports special characters

**Example:**
```
Customer: "I haven't received my order yet"
AI Reply: "I understand your concern! Let me check your order status. Your order #12345 is on the way and should arrive by tomorrow. You can track it here: [link] 📦"
```

### Slack

**Requirements:**
- Slack Bot Token
- Bot permissions configured
- Channel access

**Features:**
- Direct messages and channels
- Thread replies
- Emoji reactions
- User mentions

**Example:**
```
User: "How do I reset my password?"
AI Reply: "Great question! 🔐 You can reset your password by clicking 'Forgot Password' on the login page. You'll receive an email with reset instructions. If you don't see it, check your spam folder!"
```

### Discord

**Requirements:**
- Discord Bot Token
- Bot permissions in server
- Channel IDs

**Features:**
- Channel messages
- Thread replies
- Emoji support
- Mentions and formatting

**Example:**
```
User: "Is the server down?"
AI Reply: "Thanks for checking! 🎮 The server is running normally. If you're experiencing issues, try: 1) Restart your client 2) Clear cache 3) Check your connection. Let me know if this helps!"
```

### Telegram

**Requirements:**
- Telegram Bot Token
- Bot username
- Chat IDs

**Features:**
- Direct messages
- Group messages
- Inline keyboards
- File support

**Example:**
```
User: "What are your business hours?"
AI Reply: "We're open Monday-Friday 9AM-6PM EST, Saturday 10AM-4PM EST. Closed Sundays. How can I help you today? 😊"
```

### Teams

**Requirements:**
- Teams Webhook URL
- Channel configuration
- Connector setup

**Features:**
- Channel messages
- Adaptive cards
- Rich formatting
- Mentions

**Example:**
```
User: "Can we reschedule the meeting?"
AI Reply: "Of course! 📅 I can help reschedule. What time works best for you? Please provide your preferred date and time, and I'll send out updated invites."
```

## Best Practices

### 1. Match Tone to Platform
- **WhatsApp**: Friendly, conversational
- **Slack**: Professional, concise
- **Discord**: Casual, engaging
- **Telegram**: Direct, helpful
- **Teams**: Professional, formal

### 2. Use Appropriate Message Length
- **WhatsApp**: Medium (conversational)
- **Slack**: Short to Medium (quick)
- **Discord**: Medium to Long (detailed)
- **Telegram**: Short to Medium (concise)
- **Teams**: Medium (professional)

### 3. Emoji Usage
- **WhatsApp**: Yes (friendly)
- **Slack**: Moderate (professional)
- **Discord**: Yes (community)
- **Telegram**: Moderate (helpful)
- **Teams**: Minimal (formal)

### 4. Combine with AI Conditions
Always pair with AI Condition for intelligent routing:
```
AI Condition (detect type) → AI Chat Message (appropriate response)
```

### 5. Track Sender Information
System automatically captures:
- Sender phone/ID
- Sender name
- Platform
- Message timestamp
- Original message content

### 6. Test with Real Messages
Before deploying:
- Test with actual messages from each platform
- Verify tone and length are appropriate
- Check emoji rendering
- Confirm sender detection works

## Execution Logs

Each AI Chat Message action logs:
- **Status**: Success or failure
- **Platform**: Which platform message was sent on
- **Recipient**: Who received the message
- **Message**: The generated reply
- **Context Type**: What type of response was generated
- **Tone**: Tone used for the message
- **Error**: Any error message if failed

## Error Handling

### Common Issues

**Issue: Integration not configured**
- **Solution**: Configure the platform integration (WhatsApp, Slack, etc.)
- **Check**: Verify credentials in integration settings

**Issue: Sender not detected**
- **Solution**: Ensure trigger data includes sender information
- **Check**: Verify trigger node is capturing sender details

**Issue: Message not sent**
- **Solution**: Check execution logs for specific error
- **Check**: Verify platform credentials are valid and up-to-date

**Issue: Wrong platform detected**
- **Solution**: Verify trigger data has correct platform field
- **Check**: Check trigger configuration for platform mapping

## Advanced Features

### Multi-Platform Workflows

Create a single workflow that handles multiple platforms:

```
Chat Trigger (Any Platform)
    ↓
AI Condition: Detect issue
    ↓
AI Chat Message Reply
    ├─ Automatically sends on WhatsApp if from WhatsApp
    ├─ Automatically sends on Slack if from Slack
    ├─ Automatically sends on Discord if from Discord
    └─ Etc...
```

### Conditional Routing

Route to different actions based on platform:

```
AI Chat Message Reply
    ├─ WhatsApp → Also send SMS confirmation
    ├─ Slack → Also create ticket
    ├─ Discord → Also log to database
    └─ Telegram → Also send follow-up
```

### Response Chaining

Chain multiple AI Chat actions:

```
AI Chat Message 1: Initial response
    ↓
AI Condition: Check if more info needed
    ├─ YES → AI Chat Message 2: Ask follow-up
    └─ NO → Done
```

## Cost Considerations

**Completely FREE!**
- Uses Google Gemini for AI generation (free)
- Platform API costs depend on your plan:
  - **WhatsApp**: Per-message cost (Meta Business)
  - **Slack**: Free (included in Slack plan)
  - **Discord**: Free
  - **Telegram**: Free
  - **Teams**: Free

## Limitations

1. **Message Length** - Platform-specific limits apply
2. **Formatting** - Some platforms have limited formatting
3. **Media** - Currently text-only (files not supported)
4. **Latency** - 1-2 seconds for AI generation + platform delivery
5. **Language** - Optimized for English
6. **Context** - Only sees current message, not full conversation history

## Future Enhancements

- [ ] Conversation history context
- [ ] Media file support (images, documents)
- [ ] Rich formatting (bold, italic, links)
- [ ] Scheduled message delivery
- [ ] A/B testing different tones
- [ ] Multi-language support
- [ ] Custom platform integrations
- [ ] Message threading/replies
- [ ] Reaction-based workflows
- [ ] Voice message transcription

## Security & Privacy

- Sender information encrypted in database
- Messages not stored permanently (only in logs)
- Uses secure API connections
- Compliant with platform terms of service
- No data shared with third parties except AI service
- Audit trail of all sent messages

## Support

For issues or questions:
1. Check execution logs for error details
2. Verify platform integration is configured
3. Ensure sender information is captured
4. Test with simple messages first
5. Check backend console for detailed errors

## Summary

AI Chat Message Action enables:
- ✅ Intelligent, contextual replies
- ✅ Multi-platform support
- ✅ Automatic sender tracking
- ✅ Tone and length customization
- ✅ Emoji support
- ✅ Immediate auto-replies
- ✅ Complete conversation maintenance

Create sophisticated, multi-platform customer support and automation workflows that respond intelligently on the user's preferred communication channel!
