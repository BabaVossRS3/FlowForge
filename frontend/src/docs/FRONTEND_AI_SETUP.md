# Frontend AI Integration Setup

## Overview

The frontend now includes AI-powered features with interactive tooltips and a persistent AI assistant.

## Features Added

### 1. **AI Validation Tooltips** 
Appear on workflow nodes when issues are detected:
- **Red badge** = HIGH severity (critical issues)
- **Yellow badge** = MEDIUM severity (warnings)
- **Blue badge** = LOW severity (suggestions)

Hover over the badge to see detailed issue descriptions.

### 2. **AI Assistant Bubble** (Bottom-right corner)
- Click to open chat interface
- Ask questions about workflows
- Get real-time guidance
- Contextual help based on current workflow

### 3. **AI Validate Button** (Top toolbar)
Manually trigger workflow validation to check for:
- Invalid configurations
- Missing connections
- Infinite loops
- Overlapping triggers
- Best practice violations

## Installation

### 1. Install Dependencies
```bash
cd frontend
npm install
```

New packages added:
- `react-tooltip` - For validation tooltips
- `framer-motion` - For smooth animations

### 2. Start Development Server
```bash
npm run dev
```

## How It Works

### Automatic Validation
- Runs automatically 2 seconds after you stop editing
- Validates workflow structure in the background
- Shows tooltips on problematic nodes

### Manual Validation
- Click "AI Validate" button in toolbar
- Forces immediate validation
- Useful for checking before execution

### AI Assistant
- Always available in bottom-right corner
- Green pulse indicator shows it's active
- Provides contextual help based on your workflow
- Remembers conversation history during session

## Usage Examples

### Example 1: Workflow Validation
1. Create a workflow with multiple nodes
2. Wait 2 seconds or click "AI Validate"
3. Look for colored badges on nodes
4. Hover over badges to see issues
5. Fix issues based on AI suggestions

### Example 2: AI Assistant
1. Click the chat bubble in bottom-right
2. Ask: "How do I create an email automation?"
3. Get step-by-step guidance
4. Ask follow-up questions
5. Close when done

### Example 3: Real-time Help
1. Start building a workflow
2. Get stuck on a node configuration
3. Open AI assistant
4. Ask: "What's the best way to set up a trigger for form submissions?"
5. Apply the suggestions

## API Endpoints Used

All AI features connect to backend endpoints:

- `POST /api/ai/validate-workflow` - Validates workflow structure
- `POST /api/ai/guidance` - Provides contextual help
- `POST /api/ai/craft-email` - Generates email content (future feature)
- `POST /api/ai/extract-email-data` - Extracts email data (future feature)

## Components Created

### `AIAssistant.jsx`
- Chat interface component
- Floating bubble button
- Message history
- Real-time AI responses

### `AIValidationTooltip.jsx`
- Tooltip component for nodes
- Severity-based styling
- Issue display logic

### `useAIValidation.js` (Hook)
- Manages validation state
- Debounced validation calls
- Caches results to avoid duplicate API calls

## Customization

### Change Validation Delay
Edit `useAIValidation.js`:
```javascript
const timer = setTimeout(() => {
  validateWorkflow();
}, 2000); // Change this value (milliseconds)
```

### Disable Auto-validation
Comment out the useEffect in `useAIValidation.js`:
```javascript
// useEffect(() => {
//   const timer = setTimeout(() => {
//     validateWorkflow();
//   }, 2000);
//   return () => clearTimeout(timer);
// }, [validateWorkflow]);
```

### Change Tooltip Colors
Edit `AIValidationTooltip.jsx`:
```javascript
const getColor = (severity) => {
  switch (severity) {
    case 'HIGH':
      return 'border-red-400/50 bg-red-900/20'; // Change these
    // ...
  }
};
```

## Troubleshooting

### Tooltips Not Showing
- Check if backend AI service is running
- Verify GEMINI_API_KEY is set in backend `.env`
- Check browser console for errors
- Ensure workflow has at least one node

### AI Assistant Not Responding
- Check network tab for failed API calls
- Verify authentication token is valid
- Check backend logs for AI service errors
- Ensure backend server is running on port 4000

### Validation Takes Too Long
- Check backend AI service response time
- Verify Gemini API key is valid
- Check network connection
- Consider increasing timeout in `useAIValidation.js`

## Best Practices

1. **Don't spam validation** - Let auto-validation work, only use manual when needed
2. **Read tooltip messages** - AI provides specific, actionable feedback
3. **Use AI assistant for learning** - Ask "why" questions to understand best practices
4. **Fix high-severity issues first** - Red badges indicate critical problems
5. **Save before validating** - Validation works on saved workflow state

## Future Enhancements

Planned features:
- [ ] Email crafting interface
- [ ] Workflow suggestions panel
- [ ] AI-powered node recommendations
- [ ] Workflow optimization suggestions
- [ ] Export validation reports
- [ ] Integration with workflow execution logs

## Performance Notes

- Validation is debounced (2 seconds) to reduce API calls
- Results are cached to avoid duplicate validations
- AI assistant uses streaming for faster responses (future)
- Tooltips are lazy-loaded only when issues exist

## Cost Optimization

Using Google Gemini 1.5 Flash (FREE tier):
- Validation: ~200-400 tokens per request
- Guidance: ~300-600 tokens per request
- Daily limit: 1,500 requests
- Monthly capacity: ~45,000 requests

**Estimated usage for typical user:**
- 50 validations/day = 10,000 tokens
- 20 AI assistant queries/day = 10,000 tokens
- **Total: ~20,000 tokens/day** (well within free limits)

## Security

- All API calls require authentication
- Token is stored in AuthContext
- No API keys exposed in frontend
- Validation data is not stored on backend
- Chat history is session-only (not persisted)
