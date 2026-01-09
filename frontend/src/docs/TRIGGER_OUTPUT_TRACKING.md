# Trigger Output Tracking for Conditions

## Overview

This document describes the new trigger output tracking system that allows condition nodes to easily reference and use data from trigger nodes without manual variable path entry.

## Problem Solved

Previously, users had to manually enter variable paths like `trigger.message` or `trigger.userId` in condition nodes. This was error-prone and not user-friendly. The new system provides:

- **Visual trigger output selection** - Pick triggers and their fields from a dropdown
- **Type-safe field selection** - Only available fields are shown
- **Automatic path resolution** - No manual dot notation needed
- **Better UX** - Friendly interface for non-technical users

## Architecture

### Frontend Components

#### 1. TriggerOutputContext (`context/TriggerOutputContext.jsx`)

A React Context that manages trigger output schemas across the workflow.

**Key Functions:**
- `registerTriggerOutput(triggerId, outputSchema)` - Register a trigger's output schema
- `getTriggerOutput(triggerId)` - Get a specific trigger's output schema
- `getAllTriggerOutputs()` - Get all registered trigger outputs
- `removeTriggerOutput(triggerId)` - Remove a trigger's output schema

**Usage:**
```jsx
import { useTriggerOutputs } from '@/context/TriggerOutputContext'

function MyComponent() {
  const { registerTriggerOutput, getAllTriggerOutputs } = useTriggerOutputs()
  
  // Register when trigger is created
  registerTriggerOutput('trigger-1', {
    fields: [
      { path: 'message', type: 'string', description: 'The message text' },
      { path: 'sender', type: 'string', description: 'Who sent the message' },
      { path: 'timestamp', type: 'number', description: 'When it was sent' }
    ]
  })
}
```

#### 2. TriggerOutputSelector (`components/nodes/conditions/TriggerOutputSelector.jsx`)

A dropdown component that allows users to select trigger outputs.

**Props:**
- `onSelect(triggerId, fieldPath)` - Callback when selection changes
- `selectedTriggerId` - Currently selected trigger ID
- `selectedField` - Currently selected field path

**Features:**
- Lists all available triggers
- Shows available fields for selected trigger
- Displays field type and description
- Visual feedback for selection

#### 3. Updated CompareCondition (`components/nodes/conditions/CompareCondition.jsx`)

Enhanced to support trigger output selection as a value type.

**New Value Type:** `trigger`

**New Config Fields:**
- `leftTriggerId` - ID of trigger for left value
- `leftTriggerField` - Field path for left value
- `rightTriggerId` - ID of trigger for right value
- `rightTriggerField` - Field path for right value

**Example Config:**
```javascript
{
  compare: {
    leftType: 'trigger',
    leftTriggerId: 'trigger-1',
    leftTriggerField: 'message',
    operator: 'contains',
    rightType: 'string',
    rightValue: 'approved',
    caseSensitive: false
  }
}
```

### Backend Services

#### 1. Enhanced conditionEvaluator (`services/conditionEvaluator.js`)

Evaluates conditions with support for trigger output resolution.

**Key Functions:**

**`evaluateCondition(conditionConfig, executionResults)`**
- Main evaluation function
- Returns boolean result
- Handles all operator types

**`resolveTriggerOutput(triggerId, triggerField, executionResults)`**
- Resolves trigger output from execution results
- Extracts nested fields using dot notation
- Throws error if trigger not found

**`resolveVariable(variablePath, executionResults)`**
- Resolves workflow variables
- Supports dot notation for nested access
- Falls back to undefined if not found

**`evaluateBinaryOperator(left, operator, right, caseSensitive)`**
- Evaluates comparison operators: `==`, `!=`, `>`, `>=`, `<`, `<=`
- Evaluates string operators: `contains`, `startsWith`, `endsWith`, `matches`
- Supports case-sensitive/insensitive comparison

#### 2. Updated nodeExecutor (`services/nodeExecutor.js`)

Enhanced to:
- Import and use the condition evaluator
- Properly evaluate condition nodes with trigger data
- Route execution based on condition result (true/false branches)

**Condition Branching Logic:**
```javascript
if (node.data.type === 'condition') {
  const conditionResult = results[node.id]?.data?.result;
  for (const edge of connectedEdges) {
    const shouldExecute = conditionResult ? edge.label === 'true' : edge.label === 'false';
    if (shouldExecute) {
      // Execute next node
    }
  }
}
```

## Usage Example

### Scenario: WhatsApp Message Trigger with Condition

**Trigger Setup:**
1. Create a ChatMessageTrigger node (WhatsApp)
2. Register its output schema:
```javascript
{
  fields: [
    { path: 'message', type: 'string', description: 'Message text' },
    { path: 'sender', type: 'string', description: 'Sender phone number' },
    { path: 'timestamp', type: 'number', description: 'Message timestamp' }
  ]
}
```

**Condition Setup:**
1. Create a Condition node
2. Set Left Value Type to "Trigger Output"
3. Select trigger and field: `trigger-1.message`
4. Set Operator to "contains"
5. Set Right Value to "approved"
6. Connect True branch to approval action
7. Connect False branch to rejection action

**Execution:**
```
WhatsApp Message Received: "This is approved"
  ↓
Condition: message contains "approved"? → TRUE
  ↓
Execute approval action
```

## Trigger Output Schemas

Each trigger type should define its output schema when registered:

### ChatMessageTrigger
```javascript
{
  fields: [
    { path: 'message', type: 'string', description: 'The message text' },
    { path: 'sender', type: 'string', description: 'Sender identifier' },
    { path: 'platform', type: 'string', description: 'Platform (whatsapp, slack, etc)' },
    { path: 'timestamp', type: 'number', description: 'Unix timestamp' },
    { path: 'senderName', type: 'string', description: 'Sender display name' }
  ]
}
```

### WebhookTrigger
```javascript
{
  fields: [
    { path: 'body', type: 'object', description: 'Request body' },
    { path: 'headers', type: 'object', description: 'Request headers' },
    { path: 'method', type: 'string', description: 'HTTP method' },
    { path: 'path', type: 'string', description: 'Request path' }
  ]
}
```

### ScheduleTrigger
```javascript
{
  fields: [
    { path: 'executionTime', type: 'number', description: 'When it executed' },
    { path: 'scheduleName', type: 'string', description: 'Schedule name' }
  ]
}
```

## Integration Steps

### 1. Wrap App with TriggerOutputProvider

In your main App.jsx:
```jsx
import { TriggerOutputProvider } from '@/context/TriggerOutputContext'

export default function App() {
  return (
    <TriggerOutputProvider>
      {/* Your app content */}
    </TriggerOutputProvider>
  )
}
```

### 2. Register Trigger Outputs

When a trigger node is created or configured:
```jsx
import { useTriggerOutputs } from '@/context/TriggerOutputContext'

function ChatMessageTrigger({ config, onChange }) {
  const { registerTriggerOutput } = useTriggerOutputs()
  
  useEffect(() => {
    registerTriggerOutput('trigger-1', {
      fields: [
        { path: 'message', type: 'string', description: 'Message text' },
        { path: 'sender', type: 'string', description: 'Sender phone' }
      ]
    })
  }, [])
}
```

### 3. Use in Conditions

The CompareCondition component now supports trigger output selection automatically.

## Execution Flow

```
1. Workflow starts with trigger
   ↓
2. Trigger executes, stores triggerData in results[triggerId]
   ↓
3. Condition node evaluates:
   a. Resolves left value (from trigger or variable)
   b. Resolves right value (from trigger, variable, or literal)
   c. Applies operator
   d. Returns boolean result
   ↓
4. Based on result, routes to true/false branch
   ↓
5. Next node executes
```

## Error Handling

The condition evaluator includes robust error handling:

- **Missing trigger**: Throws error if trigger not found in results
- **Missing field**: Returns undefined if field doesn't exist
- **Invalid regex**: Catches regex errors and returns false
- **Type coercion**: Automatically converts types for comparison

## Future Enhancements

1. **Field autocomplete** - Show available fields as user types
2. **Field preview** - Show sample values from execution
3. **Nested object support** - Better UI for complex objects
4. **Field validation** - Validate field types match operator requirements
5. **Trigger output history** - Track outputs across multiple executions
