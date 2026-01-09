# WhatsApp Testing - Quick Reference Card

## Your Credentials

```
Phone Number ID: 917386968126025
Access Token: EAAVyRZBhteZBcBQWNMC0wH5JZCV1KPjC9UQtrhxcfxFYsBwyiBUMHty8awqPVqRIViMboZC28aTzJfQzZCZBZAwVQSDZAzHM5GT3DSYZCwZCgwssDY0n7vCEarZBYMSDLzLul6cLkV4a9GZB8tw3ZBZBrDZBxlrntoe6l6XXMxZCOJHA0KJ95GddmCfFXoPZBo55k98k8swZDZD
```

## Quick Setup (5 Minutes)

### 1. Save Credentials
```
Settings → Integrations → WhatsApp Business
- Phone Number ID: 917386968126025
- Access Token: [paste token above]
- Click Save
```

### 2. Create Workflow
```
New Workflow → Name: "WhatsApp Test"
Add Trigger Node → Chat Message
- Platform: whatsapp
- Phone: [your test number]
- Keywords: test, hello
- Match Type: contains
```

### 3. Add Action
```
Add Action Node → Email
- To: [your email]
- Subject: WhatsApp Message Received
- Body: Test workflow triggered!
```

### 4. Activate
```
Click "Active" button (top right)
Wait for green confirmation
```

### 5. Test
```
Send WhatsApp message: "test"
Check Execution Logs
Check email inbox
```

## Testing Commands

| Test | Command | Expected Result |
|------|---------|-----------------|
| Basic | Send "test" | Workflow triggers ✅ |
| Keyword | Send "hello world" | Workflow triggers ✅ |
| No Match | Send "random" | No trigger ❌ |
| Exact | Set match to "exact", send "test" | Triggers ✅ |
| Exact No Match | Send "testing" | No trigger ❌ |
| Starts With | Set match to "startsWith", keywords "!", send "!help" | Triggers ✅ |
| Any Message | Set match to "any", send anything | Always triggers ✅ |

## Webhook URL

```
Local: https://localhost:4000/api/chat/whatsapp
(Use ngrok for internet access)

Production: https://your-domain.com/api/chat/whatsapp
```

## Verify It's Working

### Check Server Logs
```
Look for: "Chat trigger matched for workflow"
```

### Check Execution Logs
```
Workflow → Execution Logs
Should show recent entries with status: "success"
```

### Check Email
```
Look for email with subject: "WhatsApp Message Received"
Check spam folder if not in inbox
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Workflow not triggering | Check: Active button is green, phone number matches, keywords match |
| Email not sending | Check: SMTP credentials saved, email address valid |
| Webhook not receiving | Check: Webhook URL in Meta Business Manager, webhook subscribed to "messages" |
| Credentials not saving | Check: Server logs for errors, try saving again |

## Server Logs to Watch For

```
✅ Success:
"Chat trigger matched for workflow [ID] on whatsapp"
"Workflow execution completed successfully"

❌ Errors:
"Error processing chat message"
"Integration not found"
"Email sending failed"
```

## Meta Business Manager Setup

1. Go to: https://developers.facebook.com
2. Select your WhatsApp Business App
3. Configuration → Webhooks
4. Set Callback URL: `https://your-domain.com/api/chat/whatsapp`
5. Subscribe to: `messages` event
6. Save

## Common Issues & Fixes

### "Workflow not triggering"
- [ ] Workflow is activated (green button)
- [ ] Platform is "whatsapp" (lowercase)
- [ ] Phone number matches exactly
- [ ] Keywords match message (or use "any")
- [ ] Integration credentials saved

### "Email not received"
- [ ] Check spam folder
- [ ] Verify SMTP credentials in Integrations
- [ ] Check execution logs for email action status
- [ ] Try sending test email manually

### "Webhook not receiving messages"
- [ ] Test webhook with curl
- [ ] Check Meta webhook logs
- [ ] Verify webhook URL is accessible
- [ ] Confirm webhook subscribed to "messages"

## Test Curl Commands

### Test Webhook Directly
```bash
curl -X POST https://your-domain.com/api/chat/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "1234567890",
      "text": {"body": "test"}
    }]
  }'
```

### Check Saved Credentials
```bash
curl http://localhost:4000/api/integrations/whatsapp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Next Steps After Testing

1. ✅ Test with different keywords
2. ✅ Test with different match types
3. ✅ Create production workflows
4. ✅ Set up error handling
5. ✅ Monitor execution logs regularly

## Support Resources

- Full Guide: `WHATSAPP_TESTING_GUIDE.md`
- Chat Triggers: `CHAT_TRIGGER_SETUP.md`
- Testing Checklist: `CHAT_TRIGGER_TESTING.md`
