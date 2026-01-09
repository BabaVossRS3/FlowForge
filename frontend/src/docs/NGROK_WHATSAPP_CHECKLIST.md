# ngrok + WhatsApp Setup Checklist

Complete this checklist to ensure your WhatsApp webhook is properly configured with ngrok.

## Prerequisites

- [ ] ngrok installed (`brew install ngrok` ✅ Done)
- [ ] FlowForge backend running on port 4000
- [ ] WhatsApp Business Account created
- [ ] Access Token obtained
- [ ] Phone Number ID obtained (917386968126025)
- [ ] Test phone number available

## Step 1: Start ngrok Tunnel

- [ ] Open terminal
- [ ] Run: `ngrok http 4000`
- [ ] Wait for tunnel to establish
- [ ] Note your ngrok URL (e.g., `https://abc123def456.ngrok.io`)
- [ ] Keep terminal window open

**Your ngrok URL**: `https://________________` (fill in after starting)

## Step 2: Configure Meta Business Manager

- [ ] Go to https://developers.facebook.com
- [ ] Log in with Meta account
- [ ] Select WhatsApp Business App
- [ ] Navigate to Configuration → Webhooks
- [ ] Set Callback URL: `https://[your-ngrok-url]/api/chat/whatsapp`
- [ ] Set Verify Token: `flowforge_webhook_token`
- [ ] Subscribe to events:
  - [ ] `messages`
  - [ ] `message_status` (optional)
  - [ ] `message_template_status_update` (optional)
- [ ] Click "Verify and Save"
- [ ] Wait for verification success message

## Step 3: Save Credentials in FlowForge

- [ ] Open FlowForge in browser
- [ ] Go to Settings → Integrations
- [ ] Find "WhatsApp Business" section
- [ ] Enter Phone Number ID: `917386968126025`
- [ ] Enter Access Token: `EAAVyRZBhteZBcBQWNMC0wH5JZCV1KPjC9UQtrhxcfxFYsBwyiBUMHty8awqPVqRIViMboZC28aTzJfQzZCZBZAwVQSDZAzHM5GT3DSYZCwZCgwssDY0n7vCEarZBYMSDLzLul6cLkV4a9GZB8tw3ZBZBrDZBxlrntoe6l6XXMxZCOJHA0KJ95GddmCfFXoPZBo55k98k8swZDZD`
- [ ] Click Save
- [ ] Wait for "Saved" confirmation

## Step 4: Create Test Workflow

- [ ] Click "New Workflow"
- [ ] Name: "WhatsApp ngrok Test"
- [ ] Click Create
- [ ] Add Trigger node
  - [ ] Select "Chat Message"
  - [ ] Platform: `whatsapp`
  - [ ] Phone Number: Your test number
  - [ ] Keywords: `test, hello, help`
  - [ ] Match Type: `contains`
  - [ ] Save
- [ ] Add Action node
  - [ ] Select "Email"
  - [ ] To: Your email address
  - [ ] Subject: "WhatsApp Message Received"
  - [ ] Body: "A WhatsApp message triggered your workflow!"
  - [ ] Save
- [ ] Connect Trigger → Action (draw line)
- [ ] Click "Active" button
- [ ] Wait for green confirmation

## Step 5: Test Webhook Reception

- [ ] Open ngrok Web Interface: `http://127.0.0.1:4040`
- [ ] You should see POST requests to `/api/chat/whatsapp`
- [ ] If no requests appear:
  - [ ] Check webhook URL in Meta Business Manager matches ngrok URL
  - [ ] Verify webhook is subscribed to "messages" event
  - [ ] Check phone number is registered with WhatsApp Business

## Step 6: Send Test Message

- [ ] Open WhatsApp on your phone
- [ ] Send message to your test number: `test`
- [ ] Wait 5-10 seconds
- [ ] Check ngrok Web Interface for incoming request
- [ ] Verify request shows in POST requests list

## Step 7: Verify Workflow Execution

- [ ] Go back to FlowForge
- [ ] Open your test workflow
- [ ] Click "Execution Logs"
- [ ] Look for recent entry with:
  - [ ] Status: "success"
  - [ ] Platform: "whatsapp"
  - [ ] Timestamp: recent
- [ ] Click on entry to view details
- [ ] Verify trigger node executed
- [ ] Verify action node executed

## Step 8: Verify Email Notification

- [ ] Check your email inbox
- [ ] Look for email with subject: "WhatsApp Message Received"
- [ ] If not found:
  - [ ] Check spam folder
  - [ ] Verify SMTP credentials in Integrations
  - [ ] Check execution logs for email action status

## Step 9: Test Different Keywords

- [ ] Send message: `hello`
  - [ ] Should trigger ✅
- [ ] Send message: `help`
  - [ ] Should trigger ✅
- [ ] Send message: `random`
  - [ ] Should NOT trigger ❌
- [ ] Verify execution logs show correct behavior

## Step 10: Test Different Match Types

- [ ] Edit workflow trigger
- [ ] Change Match Type to: `exact`
- [ ] Change Keywords to: `test`
- [ ] Save and activate
- [ ] Send message: `test`
  - [ ] Should trigger ✅
- [ ] Send message: `testing`
  - [ ] Should NOT trigger ❌
- [ ] Verify execution logs

## Step 11: Monitor Server Logs

- [ ] Open terminal where FlowForge backend is running
- [ ] Send test message via WhatsApp
- [ ] Look for logs:
  - [ ] "Chat trigger matched for workflow"
  - [ ] "Workflow execution completed successfully"
  - [ ] No error messages

## Step 12: Test with ngrok Web Interface

- [ ] Open `http://127.0.0.1:4040`
- [ ] Send WhatsApp message
- [ ] Click on POST request in interface
- [ ] Verify:
  - [ ] URL: `/api/chat/whatsapp`
  - [ ] Status: 200 (success)
  - [ ] Request body contains message data
  - [ ] Response shows success

## Troubleshooting Checklist

### If Workflow Doesn't Trigger

- [ ] Workflow is activated (green button)
- [ ] Platform is "whatsapp" (lowercase)
- [ ] Phone number matches exactly
- [ ] Keywords match message (or use "any")
- [ ] Integration credentials are saved
- [ ] ngrok tunnel is still running
- [ ] Webhook URL in Meta Business Manager matches ngrok URL

### If Email Doesn't Send

- [ ] SMTP credentials are saved in Integrations
- [ ] Email address is valid
- [ ] Check spam folder
- [ ] Check execution logs for email action status
- [ ] Review server logs for email errors

### If Webhook Doesn't Receive Messages

- [ ] ngrok tunnel is running
- [ ] Webhook URL in Meta Business Manager is correct
- [ ] Webhook is subscribed to "messages" event
- [ ] Phone number is registered with WhatsApp Business
- [ ] Test webhook with curl command

### If ngrok Disconnects

- [ ] Restart ngrok: `ngrok http 4000`
- [ ] Note new ngrok URL
- [ ] Update webhook URL in Meta Business Manager
- [ ] Verify and save in Meta Business Manager
- [ ] Test again

## Important Reminders

⚠️ **ngrok URL Changes on Restart**
- Every time you restart ngrok, you get a new URL
- You MUST update the webhook URL in Meta Business Manager
- Keep the ngrok terminal window open

⚠️ **Keep Services Running**
- Keep ngrok terminal open
- Keep FlowForge backend running
- Keep FlowForge frontend accessible

⚠️ **Free Plan Limitations**
- Limited to 40 connections/minute
- 2 hour session limit
- URL changes on restart

## Success Indicators

✅ You'll know it's working when:
1. ngrok Web Interface shows POST requests
2. Execution logs show "success" status
3. Email notifications are received
4. Server logs show "Chat trigger matched"
5. Different keywords trigger correctly
6. Different match types work as expected

## Next Steps After Testing

1. ✅ Test all keyword variations
2. ✅ Test all match types
3. ✅ Create production workflows
4. ✅ Set up error handling
5. ✅ Monitor execution logs
6. ✅ When ready: Deploy to production with permanent URL

## Quick Commands

```bash
# Start ngrok
ngrok http 4000

# View requests
http://127.0.0.1:4040

# Test webhook with curl
curl -X POST https://[ngrok-url]/api/chat/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"from":"1234567890","text":{"body":"test"}}]}'

# Check if backend is running
nc -z localhost 4000 && echo "Backend running" || echo "Backend not running"
```

## Sign-Off

- [ ] All steps completed
- [ ] Workflow triggers correctly
- [ ] Emails are received
- [ ] Ready for production testing

**Completed By**: _______________
**Date**: _______________
**Notes**: _______________________________________________
