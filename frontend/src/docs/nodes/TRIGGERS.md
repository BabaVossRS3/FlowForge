# Trigger Nodes Documentation

## Overview

Trigger nodes are the starting point of any workflow. They define **when** and **how** a workflow should be executed. Every workflow must have at least one trigger node.

## Architecture

```
TriggerConfig (Parent)
├── ManualTrigger
├── WebhookTrigger
├── ScheduleTrigger
└── ChatMessageTrigger
```

### File Structure
```
src/components/nodes/triggers/
├── TriggerConfig.jsx          # Main orchestrator component
├── ManualTrigger.jsx          # Manual execution trigger
├── WebhookTrigger.jsx         # HTTP webhook trigger
├── ScheduleTrigger.jsx        # Time-based scheduling trigger
├── ChatMessageTrigger.jsx     # Chat platform trigger
└── index.js                   # Barrel exports
```

---

## Components

### 1. TriggerConfig.jsx

**Purpose**: Parent component that manages all trigger types and handles switching between them.

**Key Features**:
- Dropdown selector for trigger type selection
- Dynamic component rendering based on selected type
- Config state management and propagation
- Default config initialization when switching types

**Props**:
- `config` (object): Current trigger configuration
- `onChange` (function): Callback when config changes

**Usage**:
```jsx
import { TriggerConfig } from './nodes/triggers'

<TriggerConfig 
  config={nodeConfig}
  onChange={handleConfigChange}
/>
```

---

### 2. ManualTrigger.jsx

**Purpose**: Simple trigger that executes workflows manually via the Execute button.

**Configuration**:
- No user input required
- Just informational display

**Default Config**:
```javascript
{
  description: 'Trigger workflow manually'
}
```

**Use Cases**:
- Testing workflows
- On-demand execution
- Manual approval workflows

**UI Elements**:
- Info icon with description
- Explains execution via Execute button

---

### 3. WebhookTrigger.jsx

**Purpose**: Allows external systems to trigger workflows via HTTP requests.

**Configuration Options**:
- **URL**: Auto-generated unique webhook endpoint
- **Method**: HTTP method (GET, POST, PUT, DELETE, PATCH)
- **Copy Button**: Copy URL to clipboard
- **Regenerate Button**: Create new webhook URL

**Default Config**:
```javascript
{
  url: '',           // Auto-generated on first load
  method: 'POST'
}
```

**URL Generation**:
- Format: `{API_URL}/webhooks/{uniqueId}`
- Unique ID: `wh_{timestamp}_{randomString}`
- Example: `http://localhost:4000/api/webhooks/wh_1703766000000_abc123def`

**Features**:
- Auto-generates URL on component mount
- Shows example curl command
- Copy-to-clipboard with visual feedback
- URL regeneration for security

**Use Cases**:
- GitHub/GitLab webhooks
- Third-party service integrations
- External API triggers
- CI/CD pipeline integration

**Example Request**:
```bash
curl -X POST \
  http://localhost:4000/api/webhooks/wh_1703766000000_abc123def \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

---

### 4. ScheduleTrigger.jsx

**Purpose**: Execute workflows on a schedule or at specific times.

**Schedule Types**:

#### a) Recurring
- **Intervals**: 1m, 5m, 15m, 30m, 1h, 6h, 12h, 1d, 1w
- **Use Case**: Periodic tasks, polling, regular checks
- **Example**: "Run every 5 minutes"

#### b) Specific Date & Time
- **Date Picker**: Select execution date
- **Time Picker**: Select execution time
- **Use Case**: One-time scheduled tasks
- **Example**: "Run on 2025-12-31 at 23:59"

#### c) Cron Expression
- **Format**: `minute hour day month weekday`
- **Advanced scheduling** for complex patterns
- **Examples Provided**:
  - `0 * * * *` - Every hour
  - `*/15 * * * *` - Every 15 minutes
  - `0 9 * * 1-5` - 9 AM on weekdays

**Default Config**:
```javascript
{
  scheduleType: 'recurring',
  interval: '5m',
  timezone: 'UTC+2'
}
```

**Timezone Support**:
- UTC, UTC+1, UTC+2, UTC+3
- UTC-5 (EST), UTC-8 (PST)
- Extensible for more timezones

**Features**:
- Live configuration summary
- Timezone selection
- Cron expression examples
- Visual feedback on schedule type

**Use Cases**:
- Data synchronization
- Report generation
- Cleanup tasks
- Scheduled notifications
- Batch processing

---

### 5. ChatMessageTrigger.jsx

**Purpose**: Trigger workflows when messages are received on chat platforms.

**Supported Platforms**:
- Slack
- Microsoft Teams
- Discord
- Telegram
- WhatsApp

**Configuration Options**:
- **Platform**: Select chat platform
- **Channel/Person**: Target channel or user
  - Slack: `#channel-name`
  - Discord: `#channel-name`
  - WhatsApp: `+1234567890`
  - Telegram: `@username`
  - Teams: `channel-name` or `user@email.com`

- **Keywords**: Trigger words (comma-separated)
- **Match Type**:
  - `contains`: Message contains keyword
  - `exact`: Exact match
  - `startsWith`: Message starts with keyword
  - `any`: Trigger on any message

**Default Config**:
```javascript
{
  platform: 'whatsApp',
  channelOrPerson: '',
  keywords: '',
  matchType: 'contains'
}
```

**Features**:
- Platform-specific placeholders
- Keyword filtering with multiple match types
- Configuration summary
- Integration note for authorization

**Use Cases**:
- Customer support automation
- Alert notifications
- Message-based commands
- Chat-triggered workflows
- Notification routing

**Example Configuration**:
```javascript
{
  platform: 'slack',
  channelOrPerson: '#support',
  keywords: 'help,urgent,critical',
  matchType: 'contains'
}
```
*Triggers when messages containing "help", "urgent", or "critical" are posted in #support*

---

## Integration with NodeConfig

The `TriggerConfig` component is integrated into `NodeConfig.jsx`:

```jsx
{node.data.type === 'trigger' ? (
  <div className="mb-4!">
    <TriggerConfig 
      config={config}
      onChange={setConfig}
    />
  </div>
) : ...}
```

When a user clicks a trigger node:
1. NodeConfig modal opens
2. TriggerConfig component renders
3. User selects trigger type from dropdown
4. Specific trigger component renders
5. User configures trigger settings
6. Config is saved to node data

---

## Data Flow

```
User clicks trigger node
        ↓
NodeConfig modal opens
        ↓
TriggerConfig renders
        ↓
User selects trigger type
        ↓
Specific trigger component renders
        ↓
User configures settings
        ↓
onChange callback fires
        ↓
Config saved to node.data
        ↓
Workflow auto-saves
```

---

## Styling

All trigger components use:
- **Dark theme**: `#1a1a1a`, `#2a2a3e` backgrounds
- **Purple accent**: `#85409D` primary color
- **Text colors**: `#e0e0e0` (light), `#999999` (muted), `#666666` (dim)
- **Tailwind CSS** with `!` important flags for overrides

---

## Adding New Trigger Types

To add a new trigger type:

1. **Create component** in `src/components/nodes/triggers/NewTrigger.jsx`:
```jsx
export default function NewTrigger({ config, onChange }) {
  // Component implementation
}

NewTrigger.defaultConfig = {
  // Default configuration
}
```

2. **Add to TriggerConfig.jsx**:
```jsx
import NewTrigger from './NewTrigger'

const triggerTypes = [
  // ... existing types
  { value: 'newType', label: 'New Trigger', component: NewTrigger },
]
```

3. **Export from index.js**:
```jsx
export { default as NewTrigger } from './NewTrigger'
```

---

## Backend Integration (Future)

### Webhook Endpoint
- **Route**: `POST /api/webhooks/:webhookId`
- **Payload**: Any JSON data sent in request body
- **Response**: Trigger workflow execution

### Schedule Processing
- **Service**: Node-cron or similar scheduler
- **Execution**: Trigger workflow at scheduled time
- **Timezone**: Apply timezone conversion

### Chat Integration
- **OAuth**: Platform-specific authentication
- **Webhooks**: Receive message events from platforms
- **Filtering**: Apply keyword matching on server-side

---

## Testing

### Manual Trigger
- Click Execute button in sidebar or canvas header
- Workflow should execute immediately

### Webhook Trigger
- Copy generated URL
- Send HTTP request: `curl -X POST {url} -H "Content-Type: application/json" -d '{"test": true}'`
- Workflow should execute

### Schedule Trigger
- Set to run in 1 minute
- Wait for execution
- Check execution logs

### Chat Trigger
- Send message to configured channel/person
- Include configured keywords
- Workflow should execute

---

## Security Considerations

1. **Webhook URLs**: Unique per trigger, regenerable for security
2. **Chat Integration**: Requires OAuth authorization
3. **Sensitive Data**: Not stored in frontend config
4. **Timezone Handling**: Server-side execution respects timezone

---

## Performance Notes

- Webhook URLs are generated client-side (no API call)
- Schedule validation happens on save
- Chat platform checks happen on message receipt
- No polling required for any trigger type

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook not triggering | Verify URL is correct, check network requests |
| Schedule not executing | Verify timezone, check cron syntax |
| Chat trigger not firing | Verify platform authorization, check keywords |
| Config not saving | Check browser console for errors |

---

## Version History

- **v1.0** (Dec 27, 2025): Initial implementation
  - Manual, Webhook, Schedule, Chat triggers
  - TriggerConfig orchestrator
  - Full NodeConfig integration
