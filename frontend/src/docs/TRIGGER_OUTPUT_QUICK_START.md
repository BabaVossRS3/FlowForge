# Trigger Output Tracking - Quick Start Guide

## What Changed?

You now have a **friendly, visual way** to use trigger outputs in conditions without manual variable path entry.

## How It Works

### Before (Manual)
```
Condition: message contains "approved"
Left Value: trigger.message  ← Had to type this manually
Operator: contains
Right Value: approved
```

### After (Visual)
```
Condition: message contains "approved"
Left Value: [Select Trigger] → [Select Field: message]  ← Dropdown UI
Operator: contains
Right Value: approved
```

## Step-by-Step Usage

### 1. Create a Trigger Node
- Add a **Chat Message Trigger** (or any trigger)
- Configure it (platform, keywords, etc.)
- The trigger automatically registers its available output fields

### 2. Create a Condition Node
- Add a **Condition** node after the trigger
- In the condition config, set **Left Value Type** to **"Trigger Output"**
- A dropdown appears showing all available triggers
- Select the trigger, then select the field you want to use

### 3. Complete the Condition
- Set the operator (contains, equals, etc.)
- Set the right value (what to compare against)
- Connect the true/false branches to your actions

## Example Workflow: WhatsApp Approval System

**Trigger:** WhatsApp Message
- Platform: WhatsApp
- Keywords: (any message)

**Condition:** Check if message contains "approved"
- Left Value Type: **Trigger Output**
- Select: **trigger-1** → **message**
- Operator: **contains**
- Right Value: **approved**

**True Branch:** Send approval email
**False Branch:** Send rejection email

## Available Trigger Output Fields

### Chat Message Trigger
- `message` - The message text
- `sender` - Sender phone/username
- `senderName` - Sender display name
- `platform` - Platform name (whatsapp, slack, etc)
- `channel` - Channel or group name
- `timestamp` - When message was sent
- `messageId` - Unique message ID

### Webhook Trigger (Coming Soon)
- `body` - Request body
- `headers` - Request headers
- `method` - HTTP method
- `path` - Request path

### Schedule Trigger (Coming Soon)
- `executionTime` - When it executed
- `scheduleName` - Schedule name

## Key Benefits

✅ **No Manual Path Entry** - Use dropdowns instead of typing `trigger.message`
✅ **Type-Safe** - Only valid fields are shown
✅ **Discoverable** - See all available fields at a glance
✅ **User-Friendly** - Non-technical users can build conditions easily
✅ **Error Prevention** - Can't mistype field names

## Technical Details

**Frontend:**
- `TriggerOutputContext` - Manages trigger output schemas
- `TriggerOutputSelector` - Dropdown component for selecting outputs
- `CompareCondition` - Updated to support trigger outputs

**Backend:**
- `conditionEvaluator.js` - Evaluates conditions with trigger data
- `nodeExecutor.js` - Routes execution based on condition results

## Troubleshooting

**Q: I don't see the trigger in the dropdown**
A: Make sure the trigger node is created before the condition node. The trigger must be registered first.

**Q: The field I want isn't showing**
A: Check the trigger type. Different triggers have different output fields. See "Available Trigger Output Fields" above.

**Q: Condition always returns false**
A: Check that the trigger data is being passed correctly. Look at execution logs to see the actual trigger output.

## Next Steps

1. Add more trigger types with their output schemas
2. Add field preview showing sample values
3. Add field type validation (e.g., can't use string operator on number)
4. Support nested object access in UI
