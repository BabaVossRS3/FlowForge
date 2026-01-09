# WhatsApp Real Message Not Triggering - Debug Guide

Curl test works but real WhatsApp messages don't trigger. Follow these steps to diagnose.

## Step 1: Verify Phone is in Test Recipients List

**In Meta Business Manager**:
1. Go to https://developers.facebook.com
2. Select your WhatsApp Business App
3. Go to **API Setup** or **Test Account**
4. Look for **"Test Recipients"** or **"Recipient Phone Numbers"**
5. **Your phone number should be listed there**

If your phone is NOT in the test recipients list:
1. Click **"Add Test Recipient"**
2. Enter your phone number (e.g., `+1234567890`)
3. Click **Add**
4. Try sending a message again

## Step 2: Verify Webhook Subscription

**In Meta Business Manager**:
1. Go to Configuration → Webhooks
2. Check **"Subscribed Fields"** - should include:
   - ✅ `messages`
   - ✅ `message_status` (optional)
   - ✅ `message_template_status_update` (optional)

If `messages` is NOT checked:
1. Click the checkbox next to `messages`
2. Click **Save**
3. Try sending a message again

## Step 3: Check Webhook Status

**In Meta Business Manager**:
1. Go to Configuration → Webhooks
2. Check the **Status** - should show:
   - ✅ **Active** (green)
   - ✅ **Verified** (green checkmark)

If status is not active or verified:
1. Click **"Verify and Save"** again
2. Wait for confirmation
3. Try sending a message again

## Step 4: Monitor ngrok Web Interface

While sending a WhatsApp message:
1. Open ngrok Web Interface: `http://127.0.0.1:4040`
2. Watch for incoming POST requests to `/api/chat/whatsapp`
3. If you see requests:
   - Check the status (should be 200)
   - Check the request body for your message
4. If you DON'T see requests:
   - Meta is not sending to your webhook
   - Check steps 1-3 above

## Step 5: Check Meta Webhook Logs

**In Meta Business Manager**:
1. Go to Configuration → Webhooks
2. Look for **"Webhook Logs"** or **"Recent Requests"**
3. Check if Meta is sending requests to your webhook
4. Look for any error messages

## Step 6: Verify Phone Number Format

Make sure your phone number in Meta test recipients matches:
- Your actual phone number
- The format Meta expects (usually `+[country code][number]`)

Example: `+15551868469`

## Step 7: Test with Different Message

Try sending different types of messages:
- Plain text: `hello`
- With emoji: `test 😀`
- Just numbers: `123`
- Special characters: `!@#$`

One of these should trigger if webhook is working.

## Step 8: Check Backend Logs

When you send a real WhatsApp message, your backend should show:
```
WhatsApp webhook received raw request body: {...}
Processing WhatsApp message: {...}
Processing chat message: {...}
Found X active workflows
```

If you DON'T see these logs, Meta is not sending to your webhook.

## Common Issues & Solutions

### Issue: "Phone number not in test recipients"
**Solution**: Add your phone to test recipients in Meta Business Manager

### Issue: "Webhook not subscribed to messages"
**Solution**: Check the `messages` checkbox in webhook subscriptions

### Issue: "Webhook status not active"
**Solution**: Click "Verify and Save" in Meta Business Manager

### Issue: "ngrok not showing incoming requests"
**Solution**: Meta is not sending to your webhook - check Meta configuration

### Issue: "Backend logs don't show incoming messages"
**Solution**: Same as above - Meta configuration issue

## Quick Checklist

- [ ] Phone number is in Meta test recipients list
- [ ] Webhook is subscribed to `messages` event
- [ ] Webhook status is Active and Verified
- [ ] ngrok Web Interface shows incoming POST requests
- [ ] Backend logs show "WhatsApp webhook received"
- [ ] Workflow trigger matches incoming message
- [ ] Workflow execution logs show success

## If Still Not Working

1. **Check Meta webhook logs** for error messages
2. **Verify phone number format** in test recipients
3. **Try a different message** (plain text, emoji, etc.)
4. **Restart ngrok** and update webhook URL in Meta
5. **Check firewall** - make sure port 4000 is accessible
6. **Contact Meta support** if webhook logs show errors

## Meta Business Manager Checklist

- [ ] WhatsApp Business App is created
- [ ] Phone number is registered
- [ ] Test phone number is added to test recipients
- [ ] Webhook URL is set correctly
- [ ] Webhook is verified (green checkmark)
- [ ] Webhook is subscribed to `messages` event
- [ ] Webhook status is Active

## Next Steps

1. Verify all items in checklist above
2. Send a test message
3. Check ngrok Web Interface for incoming request
4. Check backend logs
5. If still not working, check Meta webhook logs for errors
