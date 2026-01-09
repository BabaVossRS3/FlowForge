# Chat Message Trigger Setup Guide

This guide covers setting up and configuring chat message triggers for all supported platforms: Slack, Microsoft Teams, Discord, Telegram, and WhatsApp.

## Overview

Chat message triggers allow workflows to be automatically executed when messages are received on configured chat platforms. You can filter by:
- **Platform**: Which chat service (Slack, Teams, Discord, Telegram, WhatsApp)
- **Channel/Person**: Specific channel or person to monitor
- **Keywords**: Words or phrases that trigger the workflow
- **Match Type**: How keywords should be matched (contains, exact, starts with, any message)

## Supported Platforms

### 1. Slack

**Webhook URL**: `https://your-domain.com/api/chat/slack`

**Setup Steps**:
1. Go to Slack App Management (https://api.slack.com/apps)
2. Create a new app or select existing one
3. Enable Event Subscriptions
4. Set Request URL to: `https://your-domain.com/api/chat/slack`
5. Subscribe to bot events: `message.channels`, `message.groups`, `message.im`
6. Install app to workspace
7. Copy Bot Token to FlowForge Integrations

**Configuration**:
- **Channel**: Enter channel name (e.g., `#general`, `#support`)
- **Keywords**: Comma-separated words to trigger (e.g., `help, urgent, support`)
- **Match Type**: 
  - `contains`: Message contains any keyword
  - `exact`: Message exactly matches keyword
  - `startsWith`: Message starts with keyword
  - `any`: Any message in channel triggers workflow

**Example Trigger**:
- Platform: Slack
- Channel: `#support`
- Keywords: `help, urgent`
- Match Type: contains
- Result: Workflow triggers when anyone posts "help" or "urgent" in #support channel

---

### 2. Microsoft Teams

**Webhook URL**: `https://your-domain.com/api/chat/teams`

**Setup Steps**:
1. Go to Teams Admin Center
2. Create incoming webhook for your team/channel
3. Copy webhook URL
4. Configure in FlowForge Integrations with webhook URL
5. Set up connector to post to webhook when messages arrive

**Configuration**:
- **Channel**: Enter channel name or user email
- **Keywords**: Comma-separated trigger words
- **Match Type**: Same as Slack

**Example Trigger**:
- Platform: Teams
- Channel: `general`
- Keywords: `bug, issue, problem`
- Match Type: contains

---

### 3. Discord

**Webhook URL**: `https://your-domain.com/api/chat/discord`

**Setup Steps**:
1. Create Discord bot at https://discord.com/developers/applications
2. Enable Message Content Intent
3. Add bot to your server with appropriate permissions
4. Configure bot to send webhook events to: `https://your-domain.com/api/chat/discord`
5. Copy Bot Token to FlowForge Integrations

**Configuration**:
- **Channel**: Enter channel name (e.g., `#announcements`, `#general`)
- **Keywords**: Comma-separated trigger words
- **Match Type**: Same as Slack

**Example Trigger**:
- Platform: Discord
- Channel: `#announcements`
- Keywords: `alert, warning, critical`
- Match Type: contains

---

### 4. Telegram

**Webhook URL**: `https://your-domain.com/api/chat/telegram`

**Setup Steps**:
1. Create bot with BotFather (@BotFather on Telegram)
2. Copy Bot Token
3. Set webhook: `https://your-domain.com/api/chat/telegram`
   ```
   curl -X POST https://api.telegram.org/bot<TOKEN>/setWebhook -d "url=https://your-domain.com/api/chat/telegram"
   ```
4. Add bot to group or start private chat
5. Save Bot Token in FlowForge Integrations

**Configuration**:
- **Chat/Person**: Enter username (e.g., `@username`) or chat ID
- **Keywords**: Comma-separated trigger words
- **Match Type**: Same as Slack

**Example Trigger**:
- Platform: Telegram
- Chat: `@mygroup`
- Keywords: `start, begin, go`
- Match Type: startsWith

---

### 5. WhatsApp

**Webhook URL**: `https://your-domain.com/api/chat/whatsapp`

**Setup Steps**:
1. Set up WhatsApp Business Account
2. Get WhatsApp API credentials
3. Configure webhook: `https://your-domain.com/api/chat/whatsapp`
4. Verify webhook token
5. Save credentials in FlowForge Integrations

**Configuration**:
- **Phone Number**: Enter phone number (e.g., `+1234567890`)
- **Keywords**: Comma-separated trigger words
- **Match Type**: Same as Slack

**Example Trigger**:
- Platform: WhatsApp
- Phone: `+1234567890`
- Keywords: `hello, hi, hey`
- Match Type: contains

---

## Workflow Configuration

### Step 1: Create Workflow
1. Create a new workflow in FlowForge
2. Add a Trigger node

### Step 2: Configure Chat Trigger
1. Select "Chat Message" as trigger type
2. Choose platform (Slack, Teams, Discord, Telegram, WhatsApp)
3. Enter channel/person to monitor
4. Enter keywords (optional - leave empty for any message)
5. Select match type

### Step 3: Add Actions
1. Connect action nodes (send email, HTTP request, etc.)
2. Configure notification nodes if needed
3. Save workflow

### Step 4: Activate Workflow
1. Click "Active" button to activate
2. Workflow will now respond to incoming chat messages

## Keyword Matching Examples

### Contains Match
- Keywords: `help, support`
- Message: "I need help with my account"
- Result: ✅ Triggers (contains "help")

### Exact Match
- Keywords: `help`
- Message: "help"
- Result: ✅ Triggers (exact match)
- Message: "I need help"
- Result: ❌ Does not trigger

### Starts With Match
- Keywords: `!command`
- Message: "!command start"
- Result: ✅ Triggers (starts with "!command")
- Message: "run !command"
- Result: ❌ Does not trigger

### Any Message Match
- Keywords: (empty)
- Match Type: `any`
- Result: ✅ Triggers on any message in channel

## Testing Chat Triggers

### Manual Testing

**Slack**:
```
1. Send message to configured channel
2. Check workflow execution logs
3. Verify actions were executed
```

**Teams**:
```
1. Post message in configured channel
2. Check workflow execution logs
3. Verify actions were executed
```

**Discord**:
```
1. Send message in configured channel
2. Check workflow execution logs
3. Verify actions were executed
```

**Telegram**:
```
1. Send message to bot or group
2. Check workflow execution logs
3. Verify actions were executed
```

**WhatsApp**:
```
1. Send message to configured number
2. Check workflow execution logs
3. Verify actions were executed
```

## Troubleshooting

### Workflow Not Triggering

**Check**:
1. ✅ Workflow is activated (Active button is green)
2. ✅ Platform matches exactly (case-sensitive)
3. ✅ Channel/person name matches exactly
4. ✅ Keywords match (if configured)
5. ✅ Integration credentials are saved
6. ✅ Bot has permission to read messages

**Debug**:
- Check server logs for "Chat trigger matched" messages
- Verify webhook URL is correct
- Test webhook with curl/Postman
- Check integration credentials in settings

### Messages Not Being Received

**Check**:
1. ✅ Webhook URL is correct and accessible
2. ✅ Bot token is valid and has correct permissions
3. ✅ Webhook is properly configured on platform
4. ✅ Firewall/network allows incoming requests

**Debug**:
- Test webhook endpoint with curl
- Check platform webhook delivery logs
- Verify bot is in correct channel/group
- Check bot permissions

### Keywords Not Matching

**Check**:
1. ✅ Keywords are lowercase (matching is case-insensitive)
2. ✅ No extra spaces in keywords
3. ✅ Match type is correct for your use case
4. ✅ Message contains exact keyword text

**Debug**:
- Check server logs for keyword matching details
- Test with simpler keywords
- Try "any message" match type to verify trigger works
- Check exact text being sent

## Best Practices

1. **Use Specific Channels**: Monitor specific channels rather than all messages
2. **Use Keywords**: Filter by keywords to reduce unnecessary executions
3. **Test First**: Test with "any message" match type before using keywords
4. **Monitor Logs**: Check execution logs to verify triggers are working
5. **Rate Limiting**: Be aware of platform rate limits for webhook delivery
6. **Error Handling**: Add error handling in workflow actions
7. **Permissions**: Ensure bot has necessary permissions on platform

## Platform-Specific Notes

### Slack
- Bot must be in channel to receive messages
- Use channel name without # in configuration
- Supports threaded messages

### Teams
- Webhook requires proper channel setup
- May have slight delay in message delivery
- Supports rich message formatting

### Discord
- Bot must have "Read Messages" permission
- Channel names are case-sensitive
- Supports message embeds and reactions

### Telegram
- Works with both groups and private chats
- Username must include @ symbol
- Supports inline keyboards and media

### WhatsApp
- Requires WhatsApp Business Account
- Phone numbers must be in E.164 format
- May have message delivery delays

## API Endpoints

All chat webhooks accept POST requests:

- Slack: `POST /api/chat/slack`
- Teams: `POST /api/chat/teams`
- Discord: `POST /api/chat/discord`
- Telegram: `POST /api/chat/telegram`
- WhatsApp: `POST /api/chat/whatsapp`

Each endpoint expects platform-specific JSON payloads as documented by the respective platforms.
