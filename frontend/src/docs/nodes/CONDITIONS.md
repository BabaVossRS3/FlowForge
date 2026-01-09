# Condition Nodes Documentation

## Overview

Condition nodes enable **branching logic** in workflows. They evaluate expressions and direct the workflow down different paths based on whether the condition is true or false. This allows for dynamic, decision-based workflows.

## Architecture

```
ConditionConfig (Parent)
├── CompareCondition
├── LogicCondition
└── CustomCondition
```

### File Structure
```
src/components/nodes/conditions/
├── ConditionConfig.jsx          # Main orchestrator component
├── CompareCondition.jsx         # Value comparison conditions
├── LogicCondition.jsx           # AND/OR/NOT logic gates
├── CustomCondition.jsx          # JavaScript expressions
└── index.js                     # Barrel exports
```

---

## Branching System

Condition nodes have **two output handles**:

### True Branch (Green)
- **Color**: Green (`#22c55e`)
- **Position**: Top-right of node (30% from top)
- **Label**: "True"
- **Executes**: When condition evaluates to true

### False Branch (Red)
- **Color**: Red (`#ef4444`)
- **Position**: Bottom-right of node (70% from top)
- **Label**: "False"
- **Executes**: When condition evaluates to false

### Visual Indicators
```
┌─────────────────┐
│   Condition     │
│                 │──── True (Green)
│                 │
│                 │──── False (Red)
└─────────────────┘
```

---

## Components

### 1. ConditionConfig.jsx

**Purpose**: Parent component that manages all condition types and provides branching information.

**Key Features**:
- Dropdown selector for condition type selection
- Dynamic component rendering
- Config state management
- Branching logic explanation with visual indicators

**Props**:
- `config` (object): Current condition configuration
- `onChange` (function): Callback when config changes

**Usage**:
```jsx
import { ConditionConfig } from './nodes/conditions'

<ConditionConfig 
  config={nodeConfig}
  onChange={handleConfigChange}
/>
```

---

### 2. CompareCondition.jsx

**Purpose**: Compare two values using various operators.

**Operators Supported**:

#### Equality Operators
- `==` - Equals
- `!=` - Not Equals

#### Comparison Operators
- `>` - Greater Than
- `>=` - Greater or Equal
- `<` - Less Than
- `<=` - Less or Equal

#### String Operators
- `contains` - String/array contains value
- `startsWith` - String starts with value
- `endsWith` - String ends with value
- `matches` - String matches regex pattern

#### Existence Operators
- `isEmpty` - Value is empty/null/undefined
- `isNotEmpty` - Value exists and is not empty

**Value Types**:
- **Text**: Plain string values
- **Number**: Numeric values
- **Boolean**: true/false values
- **Variable**: Reference to workflow context

**Configuration Options**:

#### Left Value
- **Type**: Variable, String, Number, Boolean
- **Input**: Value or variable path
- **Example**: `trigger.userId`, `100`, `"active"`

#### Operator
- **Selection**: Choose from 12 operators
- **Description**: Each operator shows what it does

#### Right Value
- **Type**: Variable, String, Number, Boolean
- **Input**: Value or variable path
- **Conditional**: Not shown for isEmpty/isNotEmpty

#### Case Sensitive
- **Available for**: String operators (contains, startsWith, endsWith, matches)
- **Default**: True
- **Toggle**: Checkbox to enable/disable

**Default Config**:
```javascript
{
  leftValue: '',
  leftType: 'variable',
  operator: '==',
  rightValue: '',
  rightType: 'string',
  caseSensitive: true
}
```

**Features**:
- Type-aware input fields
- Conditional right value (hidden for isEmpty/isNotEmpty)
- Case sensitivity toggle for string operations
- Configuration summary with visual preview
- Example expressions

**Use Cases**:
- Check user status: `trigger.status == "active"`
- Validate numbers: `previousAction.count > 100`
- Email domain check: `workflow.email contains "@company.com"`
- Empty field validation: `trigger.name isNotEmpty`

**Example Configuration**:
```javascript
{
  leftValue: 'trigger.age',
  leftType: 'variable',
  operator: '>=',
  rightValue: '18',
  rightType: 'number',
  caseSensitive: true
}
```
*Result: True if user age is 18 or older*

---

### 3. LogicCondition.jsx

**Purpose**: Combine multiple conditions using logical operators.

**Logic Types**:

#### AND
- **Description**: All conditions must be true
- **Use Case**: User must meet multiple criteria
- **Example**: User is active AND has premium subscription

#### OR
- **Description**: At least one condition must be true
- **Use Case**: User meets any of several criteria
- **Example**: Payment failed OR subscription expired

#### NOT
- **Description**: Invert the result
- **Use Case**: Opposite of condition(s)
- **Example**: NOT (user is blocked)

**Condition Structure**:
Each condition has:
- **Field**: Variable path (e.g., `trigger.status`)
- **Operator**: Comparison operator (==, !=, >, <, etc.)
- **Value**: Value to compare against

**Configuration Options**:

#### Logic Type
- **Selection**: AND, OR, NOT
- **Description**: Explains how conditions are combined

#### Conditions Array
- **Add**: Plus button to add new condition
- **Remove**: Trash button to remove condition (minimum 1)
- **Fields**: Field, Operator, Value for each condition

**Default Config**:
```javascript
{
  logicType: 'AND',
  conditions: [
    { field: '', operator: '==', value: '' }
  ]
}
```

**Features**:
- Dynamic condition management
- Visual logic gate indicators between conditions
- Minimum 1 condition enforced
- Logic summary with formatted display
- Examples for each logic type

**Use Cases**:
- Multiple requirements: User is active AND verified AND has paid
- Alternative paths: Order is cancelled OR refunded OR expired
- Exclusion logic: NOT (user is suspended OR banned)

**Example Configuration**:
```javascript
{
  logicType: 'AND',
  conditions: [
    { field: 'trigger.status', operator: '==', value: 'active' },
    { field: 'trigger.balance', operator: '>', value: '0' },
    { field: 'trigger.verified', operator: '==', value: 'true' }
  ]
}
```
*Result: True only if user is active, has positive balance, and is verified*

---

### 4. CustomCondition.jsx

**Purpose**: Write custom JavaScript expressions for complex conditions.

**Configuration Options**:

#### Description
- **Optional**: Human-readable description
- **Purpose**: Explain what the condition checks
- **Example**: "Check if user is eligible for premium upgrade"

#### Expression
- **Language**: JavaScript
- **Return**: Must evaluate to boolean (true/false)
- **Size**: Large textarea for complex logic

**Available Context**:
- `trigger.*` - Data from the trigger
- `previousAction.*` - Output from previous action
- `workflow.*` - Workflow variables
- `Math.*` - Math functions
- `Date` - Date constructor
- Standard JavaScript operators and functions

**Default Config**:
```javascript
{
  expression: '',
  description: ''
}
```

**Features**:
- Full JavaScript expression support
- Example expressions with "Use" button
- Context variable reference
- Security note about sandboxing
- Configuration summary

**Example Expressions**:

#### Number Range Check
```javascript
trigger.age >= 18 && trigger.age <= 65
```

#### String Pattern Match
```javascript
trigger.email.endsWith("@company.com") && trigger.department === "engineering"
```

#### Array Contains
```javascript
trigger.tags.includes("premium") || trigger.tags.includes("vip")
```

#### Complex Logic
```javascript
(trigger.status === "active" && trigger.balance > 0) || trigger.role === "admin"
```

#### Date Comparison
```javascript
new Date(trigger.expiryDate) > new Date()
```

**Use Cases**:
- Complex business logic
- Date/time calculations
- Array operations
- String manipulation
- Mathematical calculations
- Multi-field validations

**Example Configuration**:
```javascript
{
  expression: '(trigger.orderTotal > 1000 && trigger.customerType === "premium") || trigger.vipStatus === true',
  description: 'Check if order qualifies for free shipping'
}
```

---

## Integration with NodeConfig

The `ConditionConfig` component is integrated into `NodeConfig.jsx`:

```jsx
{node.data.type === 'condition' ? (
  <div className="mb-4!">
    <ConditionConfig 
      config={config}
      onChange={setConfig}
    />
  </div>
) : ...}
```

When a user clicks a condition node:
1. NodeConfig modal opens
2. ConditionConfig component renders
3. User selects condition type
4. Specific condition component renders
5. User configures condition logic
6. Config is saved to node data

---

## Enhanced WorkflowNode

Condition nodes have special rendering in `WorkflowNode.jsx`:

### Visual Features
- **Two output handles**: True (green) and False (red)
- **Handle positioning**: 30% and 70% from top
- **Color coding**: Green for true, red for false
- **Labels**: "True" and "False" text labels
- **Larger handles**: 12px diameter for better visibility

### Connection Behavior
- Users can connect different nodes to each handle
- True branch executes when condition passes
- False branch executes when condition fails
- Both branches can have independent workflows

---

## Data Flow

```
Trigger fires
     ↓
Actions execute
     ↓
Condition node evaluates
     ↓
    / \
   /   \
True    False
  ↓      ↓
Green   Red
Branch  Branch
  ↓      ↓
Continue workflow
```

---

## Workflow Execution

### Condition Evaluation
1. Workflow reaches condition node
2. Condition expression is evaluated
3. Result is boolean (true/false)
4. Appropriate branch is selected
5. Connected nodes on that branch execute

### Branch Selection
- **True result**: Follow green handle connections
- **False result**: Follow red handle connections
- **No connection**: Branch ends, workflow continues with other branches

---

## Styling

All condition components use:
- **Dark theme**: `#1a1a1a`, `#2a2a3e` backgrounds
- **Purple accent**: `#85409D` primary color
- **Green**: `#22c55e` for true branch
- **Red**: `#ef4444` for false branch
- **Text colors**: `#e0e0e0` (light), `#999999` (muted), `#666666` (dim)
- **Tailwind CSS** with `!` important flags

---

## Adding New Condition Types

To add a new condition type:

1. **Create component** in `src/components/nodes/conditions/NewCondition.jsx`:
```jsx
export default function NewCondition({ config, onChange }) {
  // Component implementation
}

NewCondition.defaultConfig = {
  // Default configuration
}
```

2. **Add to ConditionConfig.jsx**:
```jsx
import NewCondition from './NewCondition'

const conditionTypes = [
  // ... existing types
  { value: 'newType', label: 'New Condition', component: NewCondition },
]
```

3. **Export from index.js**:
```jsx
export { default as NewCondition } from './NewCondition'
```

---

## Backend Integration (Future)

### Condition Evaluation
- **Compare**: Evaluate based on operator and values
- **Logic**: Combine multiple condition results
- **Custom**: Execute JavaScript in sandbox
- **Type Coercion**: Handle different value types
- **Error Handling**: Gracefully handle evaluation errors

### Branch Execution
- **True Branch**: Execute nodes connected to "true" handle
- **False Branch**: Execute nodes connected to "false" handle
- **Parallel Execution**: Both branches can run independently
- **Context Passing**: Pass workflow context to both branches

---

## Testing

### Compare Condition
- Set left value to workflow variable
- Choose operator
- Set right value
- Execute workflow with test data
- Verify correct branch is taken

### Logic Condition
- Add multiple conditions
- Set logic type (AND/OR/NOT)
- Execute with various data combinations
- Verify logic gate behavior

### Custom Condition
- Write JavaScript expression
- Test with sample workflow context
- Verify expression evaluates correctly
- Check error handling

---

## Best Practices

### Condition Design
1. **Keep conditions simple**: Complex logic should use Custom Condition
2. **Use descriptive names**: Add descriptions to explain logic
3. **Test both branches**: Ensure both true and false paths work
4. **Handle edge cases**: Consider null/undefined values
5. **Use appropriate types**: Match value types (number, string, etc.)

### Branching Strategy
1. **Default path**: Always connect false branch (fallback)
2. **Error handling**: Consider what happens if condition fails
3. **Branch convergence**: Branches can rejoin later in workflow
4. **Avoid deep nesting**: Too many conditions make workflows hard to follow

### Performance
1. **Simple comparisons first**: Faster than complex expressions
2. **Avoid heavy operations**: In custom expressions
3. **Cache results**: If same condition used multiple times
4. **Minimize conditions**: Combine related checks

---

## Common Patterns

### User Validation
```javascript
// Compare Condition
trigger.email isNotEmpty
trigger.age >= 18
```

### Status Checks
```javascript
// Logic Condition (OR)
trigger.status == "active" OR
trigger.status == "pending"
```

### Premium Features
```javascript
// Custom Condition
trigger.subscriptionTier === "premium" || 
(trigger.subscriptionTier === "basic" && trigger.credits > 100)
```

### Date Validation
```javascript
// Custom Condition
new Date(trigger.startDate) <= new Date() && 
new Date(trigger.endDate) >= new Date()
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Condition always true/false | Check operator and value types |
| Branch not executing | Verify connections to correct handle |
| Expression error | Check JavaScript syntax in custom condition |
| Type mismatch | Ensure left and right values are same type |
| Case sensitivity issues | Toggle case sensitive option |

---

## Security Considerations

1. **Expression Sandboxing**: Custom JavaScript runs in isolated context
2. **Input Validation**: Validate all user inputs before evaluation
3. **Type Safety**: Enforce type checking in comparisons
4. **Error Boundaries**: Catch and handle evaluation errors
5. **Access Control**: Limit available functions in custom expressions

---

## Performance Notes

- Compare conditions are fastest (simple comparison)
- Logic conditions scale with number of sub-conditions
- Custom expressions have overhead of JavaScript evaluation
- Condition evaluation is synchronous (blocks workflow)
- Cache condition results when possible

---

## Examples

### E-commerce Order Processing
```
Condition: order.total > 1000
├─ True: Apply free shipping
└─ False: Calculate shipping cost
```

### User Access Control
```
Condition: user.role === "admin" OR user.permissions.includes("edit")
├─ True: Allow edit
└─ False: Show read-only view
```

### Subscription Management
```
Condition: new Date(subscription.expiryDate) < new Date()
├─ True: Send renewal reminder
└─ False: Continue normal flow
```

---

## Version History

- **v1.0** (Dec 27, 2025): Initial implementation
  - Compare, Logic, Custom conditions
  - ConditionConfig orchestrator
  - Enhanced WorkflowNode with true/false branches
  - Full NodeConfig integration
  - Visual branch indicators
