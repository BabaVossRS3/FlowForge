# Notification Nodes Documentation

## Overview

Notification nodes send **alerts, messages, and updates** to various communication channels. They are typically placed at the end of workflows or after important events to inform users, teams, or external systems about workflow outcomes.

## Architecture

```
NotificationConfig (Parent)
├── SlackNotification
├── EmailNotification
├── SMSNotification
├── PushNotification
└── WebhookNotification
```

### File Structure
```
src/components/nodes/notifications/
├── NotificationConfig.jsx          # Main orchestrator component
├── SlackNotification.jsx          # Slack message notifications
├── EmailNotification.jsx          # Email notifications
├── SMSNotification.jsx            # SMS text notifications
├── PushNotification.jsx           # Push notifications
├── WebhookNotification.jsx        # Webhook notifications
└── index.js                       # Barrel exports
```

---

## Components

### 1. NotificationConfig.jsx

**Purpose**: Parent component that manages all notification types.

**Key Features**:
- Dropdown selector for notification type selection
- Dynamic component rendering
- Config state management
- Default config initialization

**Props**:
- `config` (object): Current notification configuration
- `onChange` (function): Callback when config changes

**Usage**:
```jsx
import { NotificationConfig } from './nodes/notifications'

<NotificationConfig 
  config={nodeConfig}
  onChange={handleConfigChange}
/>
```

---

### 2. SlackNotification.jsx

**Purpose**: Send messages to Slack channels or users.

**Message Types**:
- **Channel**: Send to public/private channel
- **Direct Message**: Send to specific user

**Configuration Options**:

#### Message Type
- **Channel**: Post to channel (e.g., #general)
- **User**: Direct message to user (e.g., @john.doe)

#### Target
- **Channel format**: `#channel-name`
- **User format**: `@username`
- **Dynamic**: Supports workflow variables

#### Message
- **Content**: Message text
- **Markdown**: Supports Slack markdown formatting
- **Variables**: Use `{{variable}}` for dynamic content
- **Size**: Large textarea for longer messages

#### Mentions (Optional)
- **Format**: Comma-separated list
- **Examples**: `@user1, @user2, @channel`
- **Purpose**: Notify specific users or groups

#### Thread ID (Optional)
- **Format**: Thread timestamp (e.g., `1234567890.123456`)
- **Purpose**: Reply to existing thread
- **Use Case**: Keep related messages together

**Default Config**:
```javascript
{
  messageType: 'channel',
  target: '',
  message: '',
  threadTs: '',
  mentions: ''
}
```

**Features**:
- Channel/DM toggle
- Slack markdown support
- Thread replies
- User mentions
- Configuration summary
- Integration note

**Use Cases**:
- Team notifications
- Alert messages
- Status updates
- Error notifications
- Approval requests

**Example Configuration**:
```javascript
{
  messageType: 'channel',
  target: '#alerts',
  message: '🚨 High priority alert: {{trigger.message}}\nUser: {{trigger.userId}}',
  mentions: '@oncall, @team-lead',
  threadTs: ''
}
```

---

### 3. EmailNotification.jsx

**Purpose**: Send email notifications to recipients.

**Configuration Options**:

#### Recipients (To)
- **Format**: Comma-separated email addresses
- **Dynamic**: Supports `{{variable}}` syntax
- **Example**: `user@example.com, admin@example.com`

#### Subject
- **Content**: Email subject line
- **Variables**: Dynamic subject with workflow data
- **Example**: `Notification: {{event.type}}`

#### Message Body
- **Format**: Plain text
- **Variables**: Workflow variable support
- **Size**: Large textarea

#### Priority
- **Options**: Low, Normal, High, Urgent
- **Default**: Normal
- **Purpose**: Email importance indicator

#### Reply-To (Optional)
- **Format**: Email address
- **Purpose**: Where replies should go
- **Example**: `noreply@example.com`

**Default Config**:
```javascript
{
  to: '',
  subject: '',
  body: '',
  priority: 'normal',
  replyTo: ''
}
```

**Features**:
- Multiple recipients
- Priority levels
- Reply-To configuration
- Variable interpolation
- Configuration summary
- SMTP integration note

**Use Cases**:
- User notifications
- Alert emails
- Report delivery
- Status updates
- System notifications

**Example Configuration**:
```javascript
{
  to: '{{trigger.userEmail}}',
  subject: 'Order Confirmation #{{order.id}}',
  body: 'Thank you for your order!\n\nOrder ID: {{order.id}}\nTotal: ${{order.total}}\nStatus: {{order.status}}',
  priority: 'normal',
  replyTo: 'support@example.com'
}
```

---

### 4. SMSNotification.jsx

**Purpose**: Send SMS text messages to phone numbers.

**Configuration Options**:

#### Phone Number
- **Format**: International format with country code
- **Example**: `+1234567890` (US), `+447123456789` (UK)
- **Required**: Must include country code

#### Sender ID (Optional)
- **Format**: Alphanumeric, max 11 characters
- **Example**: `FlowForge`, `MyApp`
- **Limitation**: Not supported in all countries

#### Message
- **Format**: Plain text only
- **Max Length**: 1600 characters
- **Segments**: Auto-calculated (160 chars per SMS)
- **Counter**: Shows character count and SMS count

**Default Config**:
```javascript
{
  phoneNumber: '',
  message: '',
  sender: ''
}
```

**Features**:
- International phone format
- Character counter
- SMS segment calculator
- Visual feedback for long messages
- Cost warning
- Service provider note

**SMS Segmentation**:
- **1-160 chars**: 1 SMS
- **161-320 chars**: 2 SMS
- **321-480 chars**: 3 SMS
- And so on...

**Use Cases**:
- Urgent alerts
- Two-factor authentication
- Delivery notifications
- Appointment reminders
- Critical system alerts

**Example Configuration**:
```javascript
{
  phoneNumber: '+1234567890',
  message: 'Alert: Your order #{{order.id}} has been shipped. Track: {{shipment.url}}',
  sender: 'FlowForge'
}
```

---

### 5. PushNotification.jsx

**Purpose**: Send push notifications to user devices.

**Platform Options**:
- **All Platforms**: iOS, Android, Web
- **iOS**: Apple devices only
- **Android**: Android devices only
- **Web**: Browser notifications

**Configuration Options**:

#### Target Platform
- **Selection**: All, iOS, Android, Web
- **Purpose**: Filter which devices receive notification

#### Title
- **Content**: Notification headline
- **Required**: Main text shown in notification
- **Example**: `New Message`

#### Message
- **Content**: Notification body text
- **Size**: Medium textarea
- **Example**: `You have a new message from John`

#### Icon URL (Optional)
- **Format**: Image URL
- **Purpose**: Custom notification icon
- **Example**: `https://example.com/icon.png`

#### Badge Count (Optional)
- **Format**: Number
- **Purpose**: App icon badge number
- **Example**: `5` (shows 5 on app icon)

#### Click Action URL (Optional)
- **Format**: URL
- **Purpose**: Where to navigate when clicked
- **Example**: `https://example.com/messages/123`

#### Sound
- **Options**: Default, None (Silent), Custom
- **Default**: Default system sound
- **Purpose**: Notification sound

**Default Config**:
```javascript
{
  platform: 'all',
  title: '',
  body: '',
  icon: '',
  url: '',
  badge: '',
  sound: 'default'
}
```

**Features**:
- Multi-platform support
- Custom icons
- Badge counts
- Click actions
- Sound options
- Configuration summary
- Service integration note

**Use Cases**:
- App notifications
- Real-time alerts
- Message notifications
- Update announcements
- Engagement reminders

**Example Configuration**:
```javascript
{
  platform: 'all',
  title: 'New Order Received',
  body: 'Order #{{order.id}} from {{customer.name}} - ${{order.total}}',
  icon: 'https://example.com/order-icon.png',
  url: 'https://example.com/orders/{{order.id}}',
  badge: '1',
  sound: 'default'
}
```

---

### 6. WebhookNotification.jsx

**Purpose**: Send HTTP requests to external webhook endpoints.

**Configuration Options**:

#### Webhook URL
- **Format**: Full URL with protocol
- **Example**: `https://api.example.com/webhook`
- **Required**: Destination endpoint

#### HTTP Method
- **Options**: GET, POST, PUT, PATCH, DELETE
- **Default**: POST
- **Purpose**: Request method

#### Timeout
- **Range**: 1-300 seconds
- **Default**: 30 seconds
- **Purpose**: Request timeout limit

#### Headers (Optional)
- **Format**: Key-value pairs
- **Management**: Add/remove headers
- **Examples**:
  - `Authorization: Bearer token123`
  - `Content-Type: application/json`

#### Request Body (POST/PUT/PATCH)
- **Format**: JSON
- **Variables**: Workflow variable support
- **Size**: Large textarea

**Default Config**:
```javascript
{
  url: '',
  method: 'POST',
  headers: [],
  body: '',
  timeout: 30
}
```

**Features**:
- All HTTP methods
- Custom headers
- JSON body
- Timeout configuration
- Configuration summary
- Use case note

**Use Cases**:
- External service integration
- Custom endpoints
- Third-party notifications
- Data synchronization
- Event forwarding

**Example Configuration**:
```javascript
{
  url: 'https://api.example.com/notifications',
  method: 'POST',
  headers: [
    { key: 'Authorization', value: 'Bearer {{workflow.apiKey}}' },
    { key: 'Content-Type', value: 'application/json' }
  ],
  body: '{"event": "workflow_complete", "workflowId": "{{workflow.id}}", "status": "success"}',
  timeout: 30
}
```

---

## Integration with NodeConfig

The `NotificationConfig` component is integrated into `NodeConfig.jsx`:

```jsx
{node.data.type === 'notification' ? (
  <div className="mb-4!">
    <NotificationConfig 
      config={config}
      onChange={setConfig}
    />
  </div>
) : ...}
```

When a user clicks a notification node:
1. NodeConfig modal opens
2. NotificationConfig component renders
3. User selects notification type
4. Specific notification component renders
5. User configures notification settings
6. Config is saved to node data

---

## Data Flow

```
Workflow executes
     ↓
Actions complete
     ↓
Notification node reached
     ↓
Notification sent
     ↓
External service receives
     ↓
User/System notified
```

---

## Styling

All notification components use:
- **Dark theme**: `#1a1a1a`, `#2a2a3e` backgrounds
- **Purple accent**: `#85409D` primary color
- **Text colors**: `#e0e0e0` (light), `#999999` (muted), `#666666` (dim)
- **Tailwind CSS** with `!` important flags

---

## Adding New Notification Types

To add a new notification type:

1. **Create component** in `src/components/nodes/notifications/NewNotification.jsx`:
```jsx
export default function NewNotification({ config, onChange }) {
  // Component implementation
}

NewNotification.defaultConfig = {
  // Default configuration
}
```

2. **Add to NotificationConfig.jsx**:
```jsx
import NewNotification from './NewNotification'

const notificationTypes = [
  // ... existing types
  { value: 'newType', label: 'New Notification', component: NewNotification },
]
```

3. **Export from index.js**:
```jsx
export { default as NewNotification } from './NewNotification'
```

---

## Backend Integration (Future)

### Slack Integration
- **API**: Slack Web API
- **Auth**: OAuth 2.0 or Bot Token
- **Endpoint**: `chat.postMessage`
- **Features**: Channels, DMs, threads, mentions

### Email Integration
- **Service**: SMTP or Email API (SendGrid, AWS SES)
- **Auth**: API keys or SMTP credentials
- **Features**: HTML/text, attachments, priority

### SMS Integration
- **Service**: Twilio, AWS SNS, Nexmo
- **Auth**: API keys
- **Cost**: Per-message billing
- **Features**: International, sender ID

### Push Notifications
- **Service**: Firebase, OneSignal, APNs, FCM
- **Auth**: Service credentials
- **Features**: Multi-platform, badges, sounds

### Webhook Integration
- **Method**: HTTP client (axios, fetch)
- **Auth**: Custom headers
- **Features**: Retries, timeouts, logging

---

## Testing

### Slack Notification
- Configure channel/user
- Set message content
- Execute workflow
- Check Slack for message

### Email Notification
- Set recipient email
- Configure subject and body
- Execute workflow
- Check email inbox

### SMS Notification
- Enter valid phone number
- Set message text
- Execute workflow
- Check phone for SMS

### Push Notification
- Configure platform and content
- Execute workflow
- Check device for notification

### Webhook Notification
- Set webhook URL
- Configure headers and body
- Execute workflow
- Verify webhook received request

---

## Best Practices

### Message Content
1. **Be concise**: Keep messages short and clear
2. **Use variables**: Dynamic content with workflow data
3. **Add context**: Include relevant information
4. **Format properly**: Use markdown/formatting when available
5. **Test first**: Send test notifications before production

### Error Handling
1. **Validate inputs**: Check phone numbers, emails, URLs
2. **Handle failures**: Implement retry logic
3. **Log errors**: Track failed notifications
4. **Fallback options**: Alternative notification methods
5. **User feedback**: Inform users of delivery status

### Performance
1. **Batch notifications**: Group similar notifications
2. **Rate limiting**: Respect API limits
3. **Async processing**: Don't block workflow
4. **Queue system**: Handle high volume
5. **Monitoring**: Track delivery rates

---

## Security Considerations

1. **API Keys**: Store securely, never expose in frontend
2. **Phone Numbers**: Validate format, prevent spam
3. **Email Addresses**: Validate, prevent injection
4. **Webhook URLs**: Verify endpoints, use HTTPS
5. **Message Content**: Sanitize user input
6. **Rate Limiting**: Prevent abuse
7. **Authentication**: Verify sender identity

---

## Cost Considerations

### SMS
- **Pricing**: Per message (varies by country)
- **Segments**: Multiple SMS for long messages
- **International**: Higher rates for international

### Email
- **Pricing**: Often free tier, then per-email
- **Volume**: Bulk pricing available
- **Features**: Additional cost for advanced features

### Push Notifications
- **Pricing**: Often free or very low cost
- **Volume**: Unlimited in many services
- **Features**: Advanced features may cost extra

### Webhooks
- **Pricing**: Usually free (HTTP requests)
- **Bandwidth**: May incur data transfer costs
- **Rate Limits**: May need paid tier for high volume

---

## Common Patterns

### Success Notification
```javascript
// Slack
{
  messageType: 'channel',
  target: '#notifications',
  message: '✅ Workflow completed successfully\nUser: {{trigger.userId}}\nDuration: {{workflow.duration}}s'
}
```

### Error Alert
```javascript
// Email
{
  to: 'admin@example.com',
  subject: '🚨 Workflow Error: {{workflow.name}}',
  body: 'Error: {{error.message}}\nWorkflow: {{workflow.id}}\nTime: {{workflow.timestamp}}',
  priority: 'urgent'
}
```

### User Notification
```javascript
// Push
{
  platform: 'all',
  title: 'Action Required',
  body: 'Please review your order #{{order.id}}',
  url: 'https://app.example.com/orders/{{order.id}}'
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Slack message not sent | Verify bot token and channel permissions |
| Email not delivered | Check SMTP config, spam folder |
| SMS not received | Verify phone format, check service status |
| Push not showing | Check device tokens, permissions |
| Webhook timeout | Increase timeout, check endpoint |

---

## Version History

- **v1.0** (Dec 27, 2025): Initial implementation
  - Slack, Email, SMS, Push, Webhook notifications
  - NotificationConfig orchestrator
  - Full NodeConfig integration
  - Variable interpolation support
