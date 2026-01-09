# Node Components Structure

This directory contains organized components for different node types in FlowForge workflows.

## Folder Structure

```
nodes/
├── triggers/          # Trigger node configurations
│   ├── TriggerConfig.jsx
│   ├── ManualTrigger.jsx
│   ├── WebhookTrigger.jsx
│   ├── ScheduleTrigger.jsx
│   ├── ChatMessageTrigger.jsx
│   └── index.js
├── actions/           # Action node configurations (to be implemented)
├── conditions/        # Condition node configurations (to be implemented)
└── notifications/     # Notification node configurations (to be implemented)
```

## Trigger Types Implemented

### 1. Manual Trigger
- Simple manual execution
- Triggered via Execute button
- No additional configuration needed

### 2. Webhook Trigger
- Auto-generates unique webhook URLs
- Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Copy-to-clipboard functionality
- URL regeneration
- Example curl command provided

### 3. Schedule Trigger
- **Recurring**: Run at intervals (1m, 5m, 15m, 30m, 1h, 6h, 12h, 1d, 1w)
- **Specific Date/Time**: Run once at a specific date and time
- **Cron Expression**: Advanced scheduling with cron syntax
- Timezone support
- Visual examples and help text

### 4. Chat Message Trigger
- Platform support: Slack, Teams, Discord, Telegram, WhatsApp
- Channel/Person targeting
- Keyword matching (contains, exact, starts with, any)
- Platform-specific placeholders and help text

## Usage

Import the TriggerConfig component in NodeConfig:

```jsx
import { TriggerConfig } from './nodes/triggers'

// In your component
<TriggerConfig 
  config={config}
  onChange={setConfig}
/>
```

## Next Steps

- Implement action node configurations
- Implement condition node configurations
- Implement notification node configurations
- Add backend API endpoints for webhook handling
- Add backend scheduling service
- Add chat platform integrations
