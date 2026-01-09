# Verify WhatsApp Webhook Setup

Quick verification steps to ensure your WhatsApp webhook is properly configured with your ngrok URL.

## Your Configuration

**ngrok URL**: `https://ironic-chau-influenceable.ngrok-free.dev`

**Webhook Callback URL**: `https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp`

**Verify Token**: `fegrebgwqfbr3rnfgbb`

## Step 1: Test Webhook Manually

### Using curl

```bash
curl -X POST https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "1234567890",
      "text": {"body": "test"}
    }]
  }'
```

**Expected Response**:
```json
{"ok": true}
```

### Check ngrok Web Interface

1. Open: `http://127.0.0.1:4040`
2. You should see a POST request to `/api/chat/whatsapp`
3. Status should be **200**

## Step 2: Verify in Meta Business Manager

1. Go to https://developers.facebook.com
2. Select your WhatsApp Business App
3. Go to **Configuration** → **Webhooks**
4. Verify:
   - [ ] Callback URL: `https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp`
   - [ ] Verify Token: `flowforge_webhook_token`
   - [ ] Subscribed to: `messages` event
   - [ ] Status shows: **Verified** (green checkmark)

## Step 3: Verify in FlowForge

1. Open FlowForge Settings → Integrations
2. WhatsApp Business section
3. Verify:
   - [ ] Phone Number ID: `917386968126025`
   - [ ] Access Token: Saved (shows as dots)
   - [ ] Status: **Saved** (green checkmark)

## Step 4: Test End-to-End

### Create Simple Test Workflow

1. **New Workflow** → "Quick WhatsApp Test"
2. **Add Trigger**:
   - Type: Chat Message
   - Platform: `whatsapp`
   - Phone: Your test number
   - Keywords: `test`
   - Match Type: `contains`
3. **Add Action**:
   - Type: Email
   - To: Your email
   - Subject: "WhatsApp Test"
   - Body: "Webhook is working!"
4. **Activate** (click Active button)

### Send Test Message

1. Open WhatsApp
2. Send message: `test`
3. Wait 5-10 seconds

### Verify Execution

1. Check **Execution Logs** in workflow
2. Look for recent entry with status: **success**
3. Check email inbox for notification

## Step 5: Monitor Webhook Traffic

### Real-Time Monitoring

Open ngrok Web Interface: `http://127.0.0.1:4040`

You'll see:
- All POST requests to `/api/chat/whatsapp`
- Request headers and body
- Response status and body
- Timing information

### Server Logs

Check FlowForge backend terminal for:
```
Chat trigger matched for workflow [ID] on whatsapp
Workflow execution completed successfully
```

## Troubleshooting

### Webhook Not Receiving Messages

**Checklist**:
- [ ] ngrok tunnel is running
- [ ] Callback URL in Meta Business Manager is correct
- [ ] Webhook is subscribed to "messages" event
- [ ] Phone number is registered with WhatsApp Business
- [ ] Test webhook with curl command above

**Fix**:
1. Verify ngrok is still running: `ngrok http 4000`
2. Check ngrok Web Interface for requests
3. Verify Meta Business Manager webhook configuration
4. Test with curl command

### Workflow Not Triggering

**Checklist**:
- [ ] Workflow is activated (green button)
- [ ] Chat trigger platform is "whatsapp"
- [ ] Phone number matches exactly
- [ ] Keywords match message
- [ ] Integration credentials are saved

**Fix**:
1. Check server logs for errors
2. Verify credentials in Integrations
3. Test with "any message" match type
4. Check execution logs for details

### Email Not Sending

**Checklist**:
- [ ] SMTP credentials are saved
- [ ] Email address is valid
- [ ] Check spam folder
- [ ] Check execution logs for email action status

**Fix**:
1. Verify SMTP credentials in Integrations
2. Check execution logs for email errors
3. Test email action manually

## Quick Verification Checklist

- [ ] ngrok tunnel running: `ngrok http 4000`
- [ ] Webhook URL correct: `https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp`
- [ ] Meta Business Manager updated with webhook URL
- [ ] Webhook subscribed to "messages" event
- [ ] FlowForge credentials saved
- [ ] Test workflow created and activated
- [ ] Test message sent via WhatsApp
- [ ] Execution logs show success
- [ ] Email notification received
- [ ] ngrok Web Interface shows POST request

## Success Indicators

✅ **You'll know it's working when**:

1. ngrok Web Interface shows POST requests
2. Execution logs show "success" status
3. Email notifications are received
4. Server logs show "Chat trigger matched"
5. Different keywords trigger correctly

## Next Steps

1. ✅ Send multiple test messages
2. ✅ Test different keywords
3. ✅ Test different match types
4. ✅ Create production workflows
5. ✅ Monitor execution logs regularly

## Important Notes

⚠️ **Keep ngrok Running**
- Don't close the ngrok terminal window
- If it closes, restart: `ngrok http 4000`
- You'll get the same URL (unless you restart your machine)

⚠️ **Monitor Webhook**
- Check ngrok Web Interface regularly
- Watch for any failed requests (non-200 status)
- Review server logs for errors

⚠️ **Test Thoroughly**
- Test with different keywords
- Test with different match types
- Test with different phone numbers
- Verify all actions execute correctly
