# Chat Trigger Testing Checklist

Complete this checklist to verify all chat message trigger functionality is working correctly.

## Pre-Testing Setup

- [ ] Backend server is running
- [ ] Frontend is accessible
- [ ] All integrations are configured with valid credentials
- [ ] Workflows are created and saved
- [ ] Chat webhooks are properly registered in server.js

## Platform-Specific Tests

### Slack Testing

#### Setup
- [ ] Slack bot is created and installed in workspace
- [ ] Bot has permission to read messages
- [ ] Webhook URL is configured in Slack app settings
- [ ] Bot token is saved in FlowForge integrations

#### Trigger Tests
- [ ] Create workflow with Slack chat trigger
- [ ] Configure channel: `#general`
- [ ] Configure keywords: `test, hello`
- [ ] Set match type: `contains`
- [ ] Activate workflow
- [ ] Send message "test" in #general
- [ ] Verify workflow execution in logs
- [ ] Check that action nodes executed correctly

#### Edge Cases
- [ ] Test with empty keywords (should trigger on any message)
- [ ] Test with exact match type
- [ ] Test with startsWith match type
- [ ] Test with message containing multiple keywords
- [ ] Test with message in different channel (should not trigger)
- [ ] Test with deactivated workflow (should not trigger)

---

### Microsoft Teams Testing

#### Setup
- [ ] Incoming webhook is created for team/channel
- [ ] Webhook URL is saved in FlowForge integrations
- [ ] Bot has necessary permissions

#### Trigger Tests
- [ ] Create workflow with Teams chat trigger
- [ ] Configure channel: `general`
- [ ] Configure keywords: `alert, urgent`
- [ ] Set match type: `contains`
- [ ] Activate workflow
- [ ] Post message "alert" in channel
- [ ] Verify workflow execution in logs
- [ ] Check that action nodes executed correctly

#### Edge Cases
- [ ] Test with empty keywords
- [ ] Test with exact match type
- [ ] Test with startsWith match type
- [ ] Test with message in different channel (should not trigger)
- [ ] Test with deactivated workflow

---

### Discord Testing

#### Setup
- [ ] Discord bot is created and added to server
- [ ] Bot has "Read Messages" permission
- [ ] Message Content Intent is enabled
- [ ] Webhook URL is configured
- [ ] Bot token is saved in FlowForge integrations

#### Trigger Tests
- [ ] Create workflow with Discord chat trigger
- [ ] Configure channel: `#announcements`
- [ ] Configure keywords: `ping, pong`
- [ ] Set match type: `contains`
- [ ] Activate workflow
- [ ] Send message "ping" in #announcements
- [ ] Verify workflow execution in logs
- [ ] Check that action nodes executed correctly

#### Edge Cases
- [ ] Test with empty keywords
- [ ] Test with exact match type
- [ ] Test with startsWith match type
- [ ] Test with message in different channel
- [ ] Test with bot mention in message
- [ ] Test with deactivated workflow

---

### Telegram Testing

#### Setup
- [ ] Telegram bot is created with BotFather
- [ ] Webhook is set up correctly
- [ ] Bot token is saved in FlowForge integrations
- [ ] Bot is added to group or started in private chat

#### Trigger Tests
- [ ] Create workflow with Telegram chat trigger
- [ ] Configure chat: `@mygroup` or user ID
- [ ] Configure keywords: `start, begin`
- [ ] Set match type: `startsWith`
- [ ] Activate workflow
- [ ] Send message "/start" to bot/group
- [ ] Verify workflow execution in logs
- [ ] Check that action nodes executed correctly

#### Edge Cases
- [ ] Test with empty keywords
- [ ] Test with exact match type
- [ ] Test with contains match type
- [ ] Test with message in different chat (should not trigger)
- [ ] Test with bot command (e.g., /start)
- [ ] Test with deactivated workflow

---

### WhatsApp Testing

#### Setup
- [ ] WhatsApp Business Account is set up
- [ ] API credentials are obtained
- [ ] Webhook is configured and verified
- [ ] Credentials are saved in FlowForge integrations

#### Trigger Tests
- [ ] Create workflow with WhatsApp chat trigger
- [ ] Configure phone: `+1234567890`
- [ ] Configure keywords: `help, support`
- [ ] Set match type: `contains`
- [ ] Activate workflow
- [ ] Send message "help" to configured number
- [ ] Verify workflow execution in logs
- [ ] Check that action nodes executed correctly

#### Edge Cases
- [ ] Test with empty keywords
- [ ] Test with exact match type
- [ ] Test with startsWith match type
- [ ] Test with message from different number (should not trigger)
- [ ] Test with media message (image, video)
- [ ] Test with deactivated workflow

---

## Cross-Platform Tests

### Multi-Platform Workflows
- [ ] Create workflow that responds to Slack messages
- [ ] Create separate workflow for Teams messages
- [ ] Create separate workflow for Discord messages
- [ ] Create separate workflow for Telegram messages
- [ ] Create separate workflow for WhatsApp messages
- [ ] Verify each triggers independently without interference

### Keyword Matching Tests
- [ ] Test case-insensitive matching (lowercase keywords)
- [ ] Test with special characters in keywords
- [ ] Test with multiple keywords (comma-separated)
- [ ] Test with whitespace in keywords
- [ ] Test with empty keyword field (any message)
- [ ] Test with very long keywords

### Channel/Person Filtering Tests
- [ ] Test with specific channel name
- [ ] Test with empty channel field (all channels)
- [ ] Test with different channel (should not trigger)
- [ ] Test with case sensitivity in channel names
- [ ] Test with special characters in channel names

### Match Type Tests
- [ ] Test "contains" match type
- [ ] Test "exact" match type
- [ ] Test "startsWith" match type
- [ ] Test "any" match type
- [ ] Verify correct behavior for each type

---

## Action Node Tests

### Email Actions
- [ ] Verify email is sent when chat trigger fires
- [ ] Check email contains correct content
- [ ] Verify email is sent to correct recipient
- [ ] Test with multiple recipients

### HTTP Request Actions
- [ ] Verify HTTP request is made when chat trigger fires
- [ ] Check request contains correct payload
- [ ] Verify response is logged correctly

### Notification Actions
- [ ] Verify notification email is sent
- [ ] Check notification contains correct message
- [ ] Verify notification is sent to correct recipient

---

## Error Handling Tests

### Invalid Configuration
- [ ] Test with invalid platform name
- [ ] Test with missing channel/person
- [ ] Test with malformed keywords
- [ ] Verify error is logged appropriately

### Missing Credentials
- [ ] Test with missing integration credentials
- [ ] Verify workflow doesn't execute
- [ ] Check error message in logs

### Network Issues
- [ ] Test webhook with network timeout
- [ ] Verify graceful error handling
- [ ] Check error is logged

---

## Performance Tests

### High Volume Messages
- [ ] Send 10 messages rapidly to trigger channel
- [ ] Verify all messages are processed
- [ ] Check server logs for performance issues
- [ ] Verify workflow executes for each message

### Large Message Payloads
- [ ] Send message with large text content
- [ ] Send message with media attachments
- [ ] Verify processing completes successfully

---

## Logging and Debugging

### Server Logs
- [ ] Check for "Chat trigger matched" messages
- [ ] Verify workflow execution logs are created
- [ ] Check for any error messages
- [ ] Verify timestamps are correct

### Workflow Execution Logs
- [ ] Check execution timestamp
- [ ] Verify trigger node executed
- [ ] Check action node results
- [ ] Verify notification node results

---

## Integration Tests

### With Other Trigger Types
- [ ] Create workflow with manual trigger
- [ ] Create workflow with scheduled trigger
- [ ] Create workflow with webhook trigger
- [ ] Create workflow with chat trigger
- [ ] Verify each trigger type works independently

### With Multiple Actions
- [ ] Create workflow with chat trigger + email action + notification
- [ ] Verify all actions execute in correct order
- [ ] Check execution logs for all nodes

---

## Final Verification

- [ ] All platform tests pass
- [ ] All match type tests pass
- [ ] All action node tests pass
- [ ] Error handling works correctly
- [ ] Performance is acceptable
- [ ] Logging is comprehensive
- [ ] Documentation is accurate
- [ ] No regressions in other trigger types

---

## Test Results Summary

| Platform | Status | Notes |
|----------|--------|-------|
| Slack | ⬜ | |
| Teams | ⬜ | |
| Discord | ⬜ | |
| Telegram | ⬜ | |
| WhatsApp | ⬜ | |

**Legend**: ⬜ Not Tested | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## Known Issues / Limitations

(Document any issues found during testing)

---

## Sign-Off

- Tested By: _______________
- Date: _______________
- All Tests Passed: ☐ Yes ☐ No
