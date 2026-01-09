# Action Nodes Documentation

## Overview

Action nodes perform **what** the workflow does. They execute tasks, manipulate data, send communications, or interact with external systems. Actions are executed sequentially based on the workflow's edge connections.

## Architecture

```
ActionConfig (Parent)
├── HttpRequestAction
├── DatabaseAction
├── DataTransformAction
└── EmailAction
```

### File Structure
```
src/components/nodes/actions/
├── ActionConfig.jsx              # Main orchestrator component
├── HttpRequestAction.jsx         # HTTP/API request action
├── DatabaseAction.jsx            # Database query action
├── DataTransformAction.jsx       # Data transformation action
├── EmailAction.jsx               # Email sending action
└── index.js                      # Barrel exports
```

---

## Components

### 1. ActionConfig.jsx

**Purpose**: Parent component that manages all action types and handles switching between them.

**Key Features**:
- Dropdown selector for action type selection
- Dynamic component rendering based on selected type
- Config state management and propagation
- Default config initialization when switching types

**Props**:
- `config` (object): Current action configuration
- `onChange` (function): Callback when config changes

**Usage**:
```jsx
import { ActionConfig } from './nodes/actions'

<ActionConfig 
  config={nodeConfig}
  onChange={handleConfigChange}
/>
```

---

### 2. HttpRequestAction.jsx

**Purpose**: Send HTTP requests to external APIs and services.

**Configuration Options**:

#### URL
- **Input**: Full URL of the endpoint
- **Example**: `https://api.example.com/users`
- **Supports**: Dynamic values from workflow context

#### HTTP Method
- **GET**: Retrieve data
- **POST**: Create/submit data
- **PUT**: Update entire resource
- **PATCH**: Partial update
- **DELETE**: Remove resource
- **HEAD**: Get headers only
- **OPTIONS**: Get available methods

#### Headers
- **Dynamic Management**: Add/remove headers
- **Key-Value Pairs**: Custom headers
- **Common Headers**:
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
  - `X-API-Key: {key}`

#### Request Body
- **Available for**: POST, PUT, PATCH
- **Format**: JSON
- **Example**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

#### Timeout
- **Range**: 1-300 seconds
- **Default**: 30 seconds
- **Purpose**: Prevent hanging requests

**Default Config**:
```javascript
{
  url: '',
  method: 'GET',
  headers: [],
  body: '',
  timeout: 30
}
```

**Features**:
- Multiple header management
- Conditional body editor (only for POST/PUT/PATCH)
- Configuration summary
- Timeout protection

**Use Cases**:
- REST API calls
- Webhook notifications
- Third-party service integration
- Data submission
- External system updates

**Example Configuration**:
```javascript
{
  url: 'https://api.example.com/users',
  method: 'POST',
  headers: [
    { key: 'Authorization', value: 'Bearer token123' },
    { key: 'Content-Type', value: 'application/json' }
  ],
  body: '{"name": "John", "email": "john@example.com"}',
  timeout: 30
}
```

---

### 3. DatabaseAction.jsx

**Purpose**: Query and manipulate data in databases.

**Supported Databases**:
- **MongoDB**: NoSQL document database
- **PostgreSQL**: Advanced relational database
- **MySQL**: Popular relational database
- **SQLite**: Lightweight embedded database
- **Redis**: In-memory data store

**Operations**:

#### Query / Find
- **MongoDB**: Filter documents
- **SQL**: SELECT statements
- **Returns**: Matching records

#### Insert
- **MongoDB**: Add new documents
- **SQL**: INSERT statements
- **Purpose**: Create new records

#### Update
- **MongoDB**: Modify existing documents
- **SQL**: UPDATE statements
- **Purpose**: Change existing records

#### Delete
- **MongoDB**: Remove documents
- **SQL**: DELETE statements
- **Purpose**: Remove records

**Configuration Options**:

#### Connection String
- **Format**: Database-specific connection URL
- **Security**: Show/hide toggle for sensitive data
- **Examples**:
  - MongoDB: `mongodb://user:pass@host:port/db`
  - PostgreSQL: `postgresql://user:pass@host:port/database`
  - MySQL: `mysql://user:pass@host:port/database`

#### Database Name
- **Purpose**: Specify target database
- **Example**: `my_database`

#### Collection/Table
- **MongoDB**: Collection name
- **SQL**: Table name
- **Example**: `users`

#### Query/Filter
- **MongoDB**: JSON filter
  - Example: `{ "status": "active" }`
- **SQL**: WHERE clause
  - Example: `SELECT * FROM users WHERE status = 'active'`

#### Data (Insert/Update)
- **MongoDB**: Document to insert/update
  - Example: `{ "name": "John", "age": 30 }`
- **SQL**: Column assignments
  - Example: `name = 'John', age = 30`

**Default Config**:
```javascript
{
  dbType: 'mongodb',
  operation: 'query',
  connectionString: '',
  database: '',
  collection: '',
  query: '',
  data: ''
}
```

**Features**:
- Context-aware placeholders
- Password field with show/hide toggle
- Multiple database type support
- Configuration summary
- Security warning about credential encryption

**Use Cases**:
- Data retrieval
- Record creation
- Data updates
- Data deletion
- Reporting queries
- Data synchronization

**Example Configuration**:
```javascript
{
  dbType: 'mongodb',
  operation: 'insert',
  connectionString: 'mongodb://user:pass@localhost:27017',
  database: 'myapp',
  collection: 'users',
  query: '',
  data: '{ "name": "Alice", "email": "alice@example.com", "created": new Date() }'
}
```

---

### 4. DataTransformAction.jsx

**Purpose**: Transform and manipulate data within the workflow.

**Transform Types**:

#### JavaScript Function
- **Purpose**: Custom code execution
- **Input**: Data from workflow context
- **Output**: Transformed result
- **Example**:
```javascript
function transform(input) {
  return {
    fullName: input.firstName + ' ' + input.lastName,
    email: input.email.toLowerCase(),
    timestamp: new Date().toISOString()
  }
}
```

#### JSON Path Extraction
- **Purpose**: Extract specific fields from nested JSON
- **Syntax**: JSONPath expressions
- **Examples**:
  - `$.user.profile.email` - Get nested email
  - `$.orders[*].total` - Get all order totals
  - `$.data.items[?(@.status == 'active')]` - Filter by condition

#### Template String
- **Purpose**: Build strings with variable interpolation
- **Syntax**: `{{variable.path}}` notation
- **Example**:
```
Hello {{user.name}},
Your order #{{order.id}} has been {{order.status}}.
Total: ${{order.total}}
```

#### Filter Array
- **Purpose**: Filter array items based on condition
- **Syntax**: JavaScript condition
- **Example**: `item.status === 'active' && item.price > 100`
- **Result**: New array with matching items

#### Map Array
- **Purpose**: Transform each item in an array
- **Syntax**: JavaScript object/expression
- **Example**:
```javascript
{
  id: item.id,
  name: item.name.toUpperCase(),
  price: item.price * 1.1
}
```

**Configuration Options**:

#### Input Path
- **Purpose**: Where to get data from workflow context
- **Default**: `data`
- **Example**: `trigger.payload` or `previousAction.result`

#### Output Path
- **Purpose**: Where to store transformed data
- **Default**: `result`
- **Example**: `transformed` or `output.processed`

#### Transform Script
- **Purpose**: The transformation logic
- **Language**: Depends on transform type
- **Size**: Large textarea for complex logic

**Default Config**:
```javascript
{
  transformType: 'javascript',
  script: 'function transform(input) { return input; }',
  inputPath: 'data',
  outputPath: 'result'
}
```

**Features**:
- 5 different transformation methods
- Input/output path configuration
- Large code editor with examples
- Type-specific help text
- Configuration summary

**Use Cases**:
- Data formatting
- Field extraction
- Array manipulation
- String building
- Data normalization
- Complex calculations
- Data validation

**Example Configuration**:
```javascript
{
  transformType: 'template',
  script: 'Order #{{order.id}}: {{order.items.length}} items for ${{order.total}}',
  inputPath: 'webhook.payload',
  outputPath: 'orderSummary'
}
```

---

### 5. EmailAction.jsx

**Purpose**: Send emails with customizable content and attachments.

**Configuration Options**:

#### Recipients
- **To**: Primary recipients (required)
- **CC**: Carbon copy recipients (optional)
- **BCC**: Blind carbon copy (optional)
- **Format**: Comma-separated email addresses
- **Example**: `user1@example.com, user2@example.com`

#### Subject
- **Purpose**: Email subject line
- **Example**: `Order Confirmation #12345`
- **Supports**: Dynamic values from workflow

#### Email Body
- **Plain Text**: Simple text format
- **HTML**: Rich formatted content
- **Toggle**: Switch between formats
- **Example HTML**:
```html
<h1>Welcome!</h1>
<p>Your account has been created.</p>
<a href="https://example.com/login">Login here</a>
```

#### Attachments
- **File Name**: Display name of attachment
- **URL**: Link to file to attach
- **Management**: Add/remove attachments
- **Example**:
  - Name: `invoice.pdf`
  - URL: `https://example.com/files/invoice.pdf`

**Default Config**:
```javascript
{
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  body: '',
  isHtml: false,
  attachments: []
}
```

**Features**:
- Multiple recipient support
- HTML/plain text toggle
- Dynamic attachment management
- Configuration summary
- Integration note for SMTP setup

**Use Cases**:
- Order confirmations
- User notifications
- Report delivery
- Alert emails
- Welcome emails
- Password resets
- Invoice sending

**Example Configuration**:
```javascript
{
  to: 'customer@example.com',
  cc: 'support@example.com',
  bcc: '',
  subject: 'Your Order #12345 Has Been Shipped',
  body: '<h2>Order Shipped</h2><p>Your order is on the way!</p><p>Tracking: {{shipment.trackingNumber}}</p>',
  isHtml: true,
  attachments: [
    { name: 'invoice.pdf', url: 'https://example.com/invoices/12345.pdf' }
  ]
}
```

---

## Integration with NodeConfig

The `ActionConfig` component is integrated into `NodeConfig.jsx`:

```jsx
{node.data.type === 'action' ? (
  <div className="mb-4!">
    <ActionConfig 
      config={config}
      onChange={setConfig}
    />
  </div>
) : ...}
```

When a user clicks an action node:
1. NodeConfig modal opens
2. ActionConfig component renders
3. User selects action type from dropdown
4. Specific action component renders
5. User configures action settings
6. Config is saved to node data

---

## Data Flow

```
User clicks action node
        ↓
NodeConfig modal opens
        ↓
ActionConfig renders
        ↓
User selects action type
        ↓
Specific action component renders
        ↓
User configures settings
        ↓
onChange callback fires
        ↓
Config saved to node.data
        ↓
Workflow auto-saves
        ↓
On execution: Action runs with config
```

---

## Workflow Context

Actions can access data from:
- **Trigger payload**: Data from the trigger that started the workflow
- **Previous actions**: Output from earlier actions in the chain
- **Workflow variables**: Global workflow state

**Example Access**:
```javascript
// In HTTP Request body
{
  "userId": "{{trigger.userId}}",
  "result": "{{previousAction.result}}",
  "timestamp": "{{workflow.startTime}}"
}
```

---

## Styling

All action components use:
- **Dark theme**: `#1a1a1a`, `#2a2a3e` backgrounds
- **Purple accent**: `#85409D` primary color
- **Text colors**: `#e0e0e0` (light), `#999999` (muted), `#666666` (dim)
- **Tailwind CSS** with `!` important flags for overrides

---

## Adding New Action Types

To add a new action type:

1. **Create component** in `src/components/nodes/actions/NewAction.jsx`:
```jsx
export default function NewAction({ config, onChange }) {
  // Component implementation
}

NewAction.defaultConfig = {
  // Default configuration
}
```

2. **Add to ActionConfig.jsx**:
```jsx
import NewAction from './NewAction'

const actionTypes = [
  // ... existing types
  { value: 'newType', label: 'New Action', component: NewAction },
]
```

3. **Export from index.js**:
```jsx
export { default as NewAction } from './NewAction'
```

---

## Backend Integration (Future)

### HTTP Request Execution
- **Method**: Use axios or fetch
- **Headers**: Apply custom headers
- **Body**: Send JSON payload
- **Timeout**: Enforce timeout limit
- **Response**: Capture and store result

### Database Operations
- **Connection**: Use database driver
- **Query**: Execute with parameters
- **Security**: Use parameterized queries
- **Result**: Return query results

### Data Transformation
- **JavaScript**: Execute in sandbox
- **JSONPath**: Parse and extract
- **Template**: Render with context
- **Filter/Map**: Process arrays

### Email Sending
- **SMTP**: Connect to mail server
- **Attachments**: Download and attach
- **Recipients**: Validate email addresses
- **HTML**: Sanitize HTML content

---

## Testing

### HTTP Request
- Configure endpoint and method
- Add test headers
- Execute workflow
- Check response in logs

### Database
- Verify connection string
- Test query syntax
- Execute workflow
- Verify data changes

### Data Transform
- Provide sample input data
- Execute transform
- Verify output format
- Check for errors

### Email
- Configure test recipient
- Execute workflow
- Check email inbox
- Verify formatting

---

## Security Considerations

1. **Connection Strings**: Encrypted storage, show/hide toggle
2. **API Keys**: Never logged or exposed in frontend
3. **Email Attachments**: Validate URLs before downloading
4. **JavaScript Execution**: Run in isolated context
5. **SQL Injection**: Use parameterized queries
6. **HTML Sanitization**: Sanitize HTML email content

---

## Performance Notes

- HTTP requests: Timeout prevents hanging
- Database queries: Connection pooling recommended
- Data transforms: JavaScript execution is fast
- Email sending: Async processing recommended
- Large attachments: Stream instead of buffer

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| HTTP request fails | Check URL, headers, timeout |
| Database connection error | Verify connection string, credentials |
| Transform error | Check syntax, input data format |
| Email not sent | Verify SMTP config, recipient email |
| Attachment missing | Check URL accessibility |

---

## Version History

- **v1.0** (Dec 27, 2025): Initial implementation
  - HTTP Request, Database, Transform, Email actions
  - ActionConfig orchestrator
  - Full NodeConfig integration
