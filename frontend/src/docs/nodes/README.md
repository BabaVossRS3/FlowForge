# Node Components Documentation

Welcome to the FlowForge Node Components documentation. This directory contains comprehensive guides for all workflow node types.

## Quick Links

- **[Triggers Documentation](./TRIGGERS.md)** - When workflows execute
- **[Actions Documentation](./ACTIONS.md)** - What workflows do

## Overview

FlowForge workflows are built using two main types of nodes:

### Triggers
Define **when** a workflow should execute:
- **Manual**: Execute via button click
- **Webhook**: Execute via HTTP request
- **Schedule**: Execute on a schedule or at specific times
- **Chat Message**: Execute when messages arrive on chat platforms

### Actions
Define **what** the workflow does:
- **HTTP Request**: Call external APIs
- **Database**: Query or modify databases
- **Data Transform**: Manipulate and transform data
- **Email**: Send emails with attachments

## File Structure

```
src/components/nodes/
├── triggers/
│   ├── TriggerConfig.jsx
│   ├── ManualTrigger.jsx
│   ├── WebhookTrigger.jsx
│   ├── ScheduleTrigger.jsx
│   ├── ChatMessageTrigger.jsx
│   └── index.js
├── actions/
│   ├── ActionConfig.jsx
│   ├── HttpRequestAction.jsx
│   ├── DatabaseAction.jsx
│   ├── DataTransformAction.jsx
│   ├── EmailAction.jsx
│   └── index.js
├── conditions/        (Coming soon)
└── notifications/     (Coming soon)

src/docs/nodes/
├── README.md          (This file)
├── TRIGGERS.md        (Trigger documentation)
└── ACTIONS.md         (Action documentation)
```

## Architecture Pattern

Each node type follows the same architecture:

```
ConfigComponent (Parent)
├── Type1Component
├── Type2Component
├── Type3Component
└── Type4Component
```

**Benefits**:
- Clean separation of concerns
- Easy to add new node types
- Consistent UI/UX
- Reusable patterns

## Integration

Both Trigger and Action configs are integrated into `NodeConfig.jsx`:

```jsx
{node.data.type === 'trigger' ? (
  <TriggerConfig config={config} onChange={setConfig} />
) : node.data.type === 'action' ? (
  <ActionConfig config={config} onChange={setConfig} />
) : (
  // Other node types
)}
```

## Workflow Execution Flow

```
1. Trigger fires
   ↓
2. First action executes
   ↓
3. Output passed to next action
   ↓
4. Repeat until all actions complete
   ↓
5. Workflow finished
```

## Data Context

Actions can access:
- **Trigger data**: `{{trigger.payload}}`
- **Previous action output**: `{{previousAction.result}}`
- **Workflow variables**: `{{workflow.variable}}`

## Styling Standards

All components use:
- **Dark theme**: `#1a1a1a`, `#2a2a3e`
- **Primary color**: `#85409D` (purple)
- **Text**: `#e0e0e0` (light), `#999999` (muted)
- **Tailwind CSS** with `!` important flags

## Adding New Node Types

### Step 1: Create Component
```jsx
// src/components/nodes/{type}s/NewComponent.jsx
export default function NewComponent({ config, onChange }) {
  // Implementation
}

NewComponent.defaultConfig = { /* defaults */ }
```

### Step 2: Add to Parent Config
```jsx
// src/components/nodes/{type}s/{Type}Config.jsx
import NewComponent from './NewComponent'

const componentTypes = [
  // ... existing
  { value: 'new', label: 'New Type', component: NewComponent },
]
```

### Step 3: Export from Index
```jsx
// src/components/nodes/{type}s/index.js
export { default as NewComponent } from './NewComponent'
```

### Step 4: Update NodeConfig
```jsx
// src/components/NodeConfig.jsx
import { NewConfig } from './nodes/{type}s'

{node.data.type === '{type}' ? (
  <NewConfig config={config} onChange={setConfig} />
) : ...}
```

### Step 5: Document
Create `{TYPE}S.md` in `src/docs/nodes/` following the same format.

## Coming Soon

- **Condition Nodes**: Decision logic (if/else)
- **Notification Nodes**: Send alerts and notifications
- **Loop Nodes**: Iterate over arrays
- **Delay Nodes**: Pause execution
- **Custom Code Nodes**: Execute arbitrary code

## Best Practices

1. **Always provide defaults**: Every component should have `defaultConfig`
2. **Show configuration summary**: Help users understand what they configured
3. **Validate inputs**: Check URLs, emails, JSON syntax
4. **Provide examples**: Show users how to use features
5. **Use consistent styling**: Follow the dark theme standards
6. **Add help text**: Explain what each field does
7. **Handle errors gracefully**: Show user-friendly error messages

## Performance Tips

- Webhook URLs are generated client-side (no API call)
- Schedule validation happens on save
- Data transforms should be optimized for large datasets
- Database queries should use indexes
- Email attachments should be streamed, not buffered

## Security Guidelines

1. **Never log sensitive data**: API keys, passwords, tokens
2. **Encrypt connection strings**: Store securely on backend
3. **Validate all inputs**: Prevent injection attacks
4. **Sanitize HTML**: Prevent XSS in email content
5. **Use HTTPS**: All external requests should be encrypted
6. **Implement rate limiting**: Prevent abuse

## Testing Checklist

- [ ] Component renders without errors
- [ ] Config saves correctly
- [ ] Switching types initializes defaults
- [ ] All inputs are validated
- [ ] Configuration summary is accurate
- [ ] Styling matches theme
- [ ] Mobile responsive
- [ ] Accessibility (keyboard navigation, labels)

## Support

For questions or issues:
1. Check the relevant documentation file
2. Review component source code
3. Check browser console for errors
4. Test with sample data

## Version History

### v1.0 (Dec 27, 2025)
- Initial release
- Trigger nodes: Manual, Webhook, Schedule, Chat
- Action nodes: HTTP, Database, Transform, Email
- Full documentation
- NodeConfig integration

---

**Last Updated**: Dec 27, 2025
**Status**: Production Ready
