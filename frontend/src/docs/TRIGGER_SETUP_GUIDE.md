# FlowForge Trigger Setup Guide

This guide explains how to configure and use all trigger types in FlowForge workflows.

## Trigger Types

### 1. Manual Trigger

**Description**: Execute workflows manually via the UI.

**Setup**:
- Select "Manual Trigger" as the trigger type
- No additional configuration required
- Click the "Execute" button in the workflow UI to run the workflow

**Use Cases**:
- Testing workflows
- On-demand execution
- User-initiated processes

---

### 2. Schedule Trigger

**Description**: Execute workflows automatically on a schedule.

**Setup**:
1. Select "Schedule" as the trigger type
2. Choose schedule type:
   - **Recurring**: Run at regular intervals (1m, 5m, 15m, 30m, 1h, 6h, 12h, 1d, 1w)
   - **Specific Date & Time**: Run once at a specific date and time
   - **Cron Expression**: Use custom cron patterns for advanced scheduling

**Configuration**:
- **Recurring**: Select interval from dropdown (uses cron for repeated execution)
- **Specific Date & Time**: Choose date and time (uses setTimeout for one-time execution)
- **Cron Expression**: Enter cron pattern (e.g., `0 9 * * 1-5` for 9 AM on weekdays)
- **Timezone**: Select your timezone (default: UTC+2)

**Important**:
- Workflow must be **activated** (set `isActive: true`) for schedules to run
- Schedules start immediately upon activation
- Deactivating a workflow stops all scheduled executions
- **Specific Date & Time**: 
  - Executes only once at the specified time
  - Must be scheduled within 24 days (JavaScript setTimeout limitation)
  - If the time is in the past, the workflow will not be scheduled
  - Check server logs to see when the workflow is scheduled to run

**Use Cases**:
- Daily reports
- Periodic data syncing
- Scheduled notifications
- Automated backups

---

### 3. Webhook Trigger

**Description**: Execute workflows when an HTTP request is received.

**Setup**:
1. Select "Webhook" as the trigger type
2. Choose HTTP method (GET, POST, PUT, DELETE, PATCH)
3. A unique webhook URL is automatically generated
4. Copy the webhook URL and use it in external services

**Webhook URL Format**:
```
http://localhost:4000/api/webhooks/{webhookId}
```

**Configuration**:
- **Method**: HTTP method to accept (default: POST)
- **URL**: Auto-generated unique webhook URL

**Testing**:
```bash
curl -X POST \
  http://localhost:4000/api/webhooks/wh_1234567890_abc123 \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

**Important**:
- Workflow must be **activated** for webhooks to work
- Webhook data (headers, body, query params) is passed to the workflow
- Supports all standard HTTP methods

**Use Cases**:
- GitHub webhooks (push, PR events)
- Payment notifications (Stripe, PayPal)
- Form submissions
- Third-party integrations

---

### 4. Chat Message Trigger

**Description**: Execute workflows when messages are received from chat platforms.

**Setup**:
1. Select "Chat Message" as the trigger type
2. Choose platform (Slack, Teams, Discord, Telegram, WhatsApp)
3. Configure channel/person filter (optional)
4. Set keywords to match (optional)
5. Choose match type (contains, exact, startsWith, any)

**Configuration**:
- **Platform**: Select chat platform
- **Channel/Person**: Filter by channel or user (optional)
- **Keywords**: Comma-separated trigger words (optional)
- **Match Type**:
  - `contains`: Message contains any keyword
  - `exact`: Message exactly matches keyword
  - `startsWith`: Message starts with keyword
  - `any`: Any message triggers workflow

**Platform-Specific Webhook URLs**:
- **Slack**: `http://localhost:4000/api/chat/slack`
- **WhatsApp**: `http://localhost:4000/api/chat/whatsapp`
- **Telegram**: `http://localhost:4000/api/chat/telegram`
- **Discord**: `http://localhost:4000/api/chat/discord`
- **Teams**: `http://localhost:4000/api/chat/teams`

**Platform Setup**:

#### Slack
1. Create a Slack app at https://api.slack.com/apps
2. Enable Event Subscriptions
3. Subscribe to `message.channels` event
4. Set Request URL to: `http://localhost:4000/api/chat/slack`
5. Install app to workspace

#### WhatsApp (Business API)
1. Set up WhatsApp Business API
2. Configure webhook URL: `http://localhost:4000/api/chat/whatsapp`
3. Subscribe to message events

#### Telegram
1. Create a bot via @BotFather
2. Set webhook: `https://api.telegram.org/bot<TOKEN>/setWebhook?url=http://localhost:4000/api/chat/telegram`

#### Discord
1. Create a Discord bot
2. Set up webhook integration
3. Configure webhook URL: `http://localhost:4000/api/chat/discord`

#### Microsoft Teams
1. Create a Teams app
2. Configure messaging webhook
3. Set URL to: `http://localhost:4000/api/chat/teams`

**Important**:
- Workflow must be **activated** for chat triggers to work
- Platform integrations must be configured in the Integrations settings
- Message data is passed to the workflow for use in subsequent nodes

**Use Cases**:
- Customer support automation
- Chatbot workflows
- Alert notifications
- Team collaboration automation

---

## Activating Workflows

For **Schedule**, **Webhook**, and **Chat Message** triggers to work, you must:

1. Save your workflow
2. Toggle the workflow to **Active** state
3. The backend will automatically:
   - Start scheduled jobs (for Schedule triggers)
   - Register webhook endpoints (for Webhook triggers)
   - Listen for chat messages (for Chat Message triggers)

## Execution Logs

All trigger executions are logged in the workflow's execution logs, including:
- Timestamp
- Status (success/failure)
- Trigger data (webhook payload, chat message, etc.)
- Execution results for all nodes

## Troubleshooting

### Schedule Trigger Not Running
- Verify workflow is activated (`isActive: true`)
- Check server logs for scheduler initialization
- Ensure cron expression is valid
- Verify server is running

### Webhook Not Responding
- Verify workflow is activated
- Check webhook URL matches the configured URL
- Ensure HTTP method matches
- Test with curl or Postman

### Chat Message Not Triggering
- Verify workflow is activated
- Check platform webhook is configured correctly
- Verify keywords match message content
- Check channel/person filter settings
- Review platform-specific setup requirements

## API Endpoints

- **Manual Execution**: `POST /api/workflows/:id/execute`
- **Webhooks**: `ALL /api/webhooks/:webhookId`
- **Chat Webhooks**:
  - Slack: `POST /api/chat/slack`
  - WhatsApp: `POST /api/chat/whatsapp`
  - Telegram: `POST /api/chat/telegram`
  - Discord: `POST /api/chat/discord`
  - Teams: `POST /api/chat/teams`
