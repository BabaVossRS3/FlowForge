# WhatsApp Workflow Testing Guide

This guide walks you through setting up and testing WhatsApp chat triggers in FlowForge.

## Prerequisites

You should have:
- ✅ WhatsApp Business Account
- ✅ Access Token (from Meta/Facebook)
- ✅ Phone Number ID (your WhatsApp Business phone number ID)
- ✅ Test Phone Number (the number you'll send test messages from)
- ✅ FlowForge running locally or deployed
- ✅ Webhook URL accessible from the internet

## Step 1: Save WhatsApp Credentials in FlowForge

### Via Frontend (Integration Settings)

1. **Open FlowForge** in your browser
2. **Click Settings** (gear icon)
3. **Go to Integrations** tab
4. **Find "WhatsApp Business"** section
5. **Fill in the following fields**:
   - **Phone Number ID**: `917386968126025` (your phone number ID)
   - **Access Token**: `EAAVyRZBhteZBcBQWNMC0wH5JZCV1KPjC9UQtrhxcfxFYsBwyiBUMHty8awqPVqRIViMboZC28aTzJfQzZCZBZAwVQSDZAzHM5GT3DSYZCwZCgwssDY0n7vCEarZBYMSDLzLul6cLkV4a9GZB8tw3ZBZBrDZBxlrntoe6l6XXMxZCOJHA0KJ95GddmCfFXoPZBo55k98k8swZDZD`

6. **Click Save**
7. **Wait for "Saved" confirmation** (green checkmark)

### Via cURL (Alternative)

```bash
curl -X PUT http://localhost:4000/api/integrations/whatsapp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId": "917386968126025",
    "accessToken": "EAAVyRZBhteZBcBQWNMC0wH5JZCV1KPjC9UQtrhxcfxFYsBwyiBUMHty8awqPVqRIViMboZC28aTzJfQzZCZBZAwVQSDZAzHM5GT3DSYZCwZCgwssDY0n7vCEarZBYMSDLzLul6cLkV4a9GZB8tw3ZBZBrDZBxlrntoe6l6XXMxZCOJHA0KJ95GddmCfFXoPZBo55k98k8swZDZD"
  }'
```

## Step 2: Configure WhatsApp Webhook

Your WhatsApp webhook should be configured to send messages to:
```
https://your-domain.com/api/chat/whatsapp
```

### Setup in Meta Business Manager

1. Go to **Meta App Dashboard** (https://developers.facebook.com)
2. Select your **WhatsApp Business App**
3. Go to **Configuration** → **Webhooks**
4. Set **Callback URL**: `https://your-domain.com/api/chat/whatsapp`
5. Set **Verify Token**: Any random string (e.g., `flowforge_webhook_token`)
6. Subscribe to **messages** webhook events
7. Save and verify webhook

### For Local Testing (using ngrok)

If testing locally, use ngrok to expose your local server:

```bash
# Install ngrok if you haven't
brew install ngrok

# Start ngrok tunnel
ngrok http 4000

# You'll get a URL like: https://abc123.ngrok.io
# Use: https://abc123.ngrok.io/api/chat/whatsapp as webhook URL
```

## Step 3: Create a Test Workflow

### Step 3a: Create New Workflow

1. **Click "New Workflow"** in FlowForge
2. **Name it**: "WhatsApp Test Workflow"
3. **Click Create**

### Step 3b: Add Chat Trigger

1. **Drag "Trigger" node** to canvas
2. **Select Trigger Type**: "Chat Message"
3. **Configure**:
   - **Platform**: WhatsApp
   - **Phone Number**: Your test phone number (e.g., `+1234567890`)
   - **Keywords**: `test, hello, help` (comma-separated)
   - **Match Type**: `contains`

4. **Save trigger configuration**

### Step 3c: Add Action (Email Notification)

1. **Drag "Action" node** to canvas
2. **Connect Trigger → Action** (draw line between nodes)
3. **Select Action Type**: "Email"
4. **Configure**:
   - **To**: Your email address
   - **Subject**: "WhatsApp Message Received"
   - **Body**: "A WhatsApp message triggered your workflow!"
   - **Is HTML**: No

5. **Save action configuration**

### Step 3d: Add Notification Node

1. **Drag "Notification" node** to canvas
2. **Connect Action → Notification**
3. **Select Notification Type**: "Email"
4. **Configure**:
   - **To**: Your email address
   - **Subject**: "Workflow Executed Successfully"
   - **Body**: "Your WhatsApp workflow ran successfully!"
   - **Reply To**: Your email

5. **Save notification configuration**

### Step 3e: Activate Workflow

1. **Click "Active" button** (top right)
2. **Wait for confirmation** (button turns green)
3. **Workflow is now listening for WhatsApp messages**

## Step 4: Test the Workflow

### Test 1: Send Simple Message

1. **Open WhatsApp** on your phone
2. **Send message to your test number**: `test`
3. **Check FlowForge**:
   - Go to workflow
   - Click "Execution Logs"
   - Look for recent execution entry
   - Verify status is "success"

4. **Check Email**:
   - You should receive notification email
   - Subject: "WhatsApp Message Received"

### Test 2: Send Message with Keyword

1. **Send message**: `hello world`
2. **Check Execution Logs** for new entry
3. **Verify email received**

### Test 3: Send Message without Keyword

1. **Send message**: `random text`
2. **Check Execution Logs** - should NOT have new entry
3. **No email should be received** (keyword didn't match)

### Test 4: Test Exact Match

1. **Edit workflow trigger**
2. **Change Match Type to**: `exact`
3. **Change Keywords to**: `test`
4. **Save and activate**

5. **Send message**: `test` (exact match)
   - Should trigger ✅

6. **Send message**: `testing` (contains but not exact)
   - Should NOT trigger ❌

### Test 5: Test Starts With

1. **Edit workflow trigger**
2. **Change Match Type to**: `startsWith`
3. **Change Keywords to**: `!command`
4. **Save and activate**

5. **Send message**: `!command start`
   - Should trigger ✅

6. **Send message**: `run !command`
   - Should NOT trigger ❌

## Step 5: Verify Webhook is Receiving Messages

### Check Server Logs

1. **Open terminal** where FlowForge backend is running
2. **Look for logs like**:
   ```
   WhatsApp webhook received message
   Chat trigger matched for workflow [ID] on whatsapp
   ```

3. **If you see these logs**, webhook is working ✅

### Debug Missing Messages

If workflow isn't triggering:

1. **Check Integration Credentials**:
   ```bash
   curl http://localhost:4000/api/integrations/whatsapp \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```
   Should return your credentials

2. **Check Webhook URL**:
   - Verify it's accessible from internet
   - Test with curl:
   ```bash
   curl -X POST https://your-domain.com/api/chat/whatsapp \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"from":"1234567890","text":{"body":"test"}}]}'
   ```

3. **Check WhatsApp Configuration**:
   - Verify webhook URL in Meta Business Manager
   - Verify webhook is subscribed to "messages" events
   - Check webhook logs in Meta dashboard

4. **Check Workflow Configuration**:
   - Verify workflow is activated (Active button is green)
   - Verify trigger platform is "whatsapp"
   - Verify phone number matches exactly

## Step 6: Advanced Testing

### Test with Different Phone Numbers

1. **Create multiple test workflows** for different numbers
2. **Send messages from different phones**
3. **Verify each triggers correct workflow**

### Test with Multiple Keywords

1. **Set Keywords**: `help, support, urgent, alert`
2. **Send messages with each keyword**
3. **Verify all trigger correctly**

### Test with Empty Keywords

1. **Leave Keywords field empty**
2. **Set Match Type to**: `any`
3. **Send any message**
4. **Should trigger on any message** ✅

### Test with Special Characters

1. **Send message**: `!@#$%^&*()`
2. **Send message**: `emoji 😀 test`
3. **Send message**: `numbers 123 456`
4. **Verify handling is correct**

## Troubleshooting

### Workflow Not Triggering

**Checklist**:
- [ ] Workflow is activated (Active button is green)
- [ ] Chat trigger platform is "whatsapp"
- [ ] Phone number in trigger matches test number
- [ ] Keywords match message content (or match type is "any")
- [ ] Integration credentials are saved
- [ ] Webhook URL is correct and accessible
- [ ] Server logs show webhook received message

**Debug Steps**:
1. Check server logs for errors
2. Verify webhook is receiving messages
3. Test with "any message" match type
4. Check integration credentials are saved
5. Verify workflow is activated

### Email Not Sending

**Checklist**:
- [ ] Email integration is configured
- [ ] SMTP credentials are saved
- [ ] Email address is valid
- [ ] Workflow execution logs show email action executed
- [ ] Check spam folder

**Debug Steps**:
1. Check execution logs for email action status
2. Verify SMTP credentials in integrations
3. Check server logs for email sending errors
4. Test email action manually

### Webhook Not Receiving Messages

**Checklist**:
- [ ] Webhook URL is accessible from internet
- [ ] Webhook is configured in Meta Business Manager
- [ ] Webhook is subscribed to "messages" events
- [ ] Phone number is registered with WhatsApp Business

**Debug Steps**:
1. Test webhook with curl
2. Check Meta webhook logs
3. Verify webhook URL format
4. Check firewall/network settings

## Testing Checklist

- [ ] Credentials saved in FlowForge
- [ ] Webhook configured in Meta Business Manager
- [ ] Test workflow created
- [ ] Chat trigger configured
- [ ] Action node configured
- [ ] Notification node configured
- [ ] Workflow activated
- [ ] Test message sent
- [ ] Execution log shows success
- [ ] Email received
- [ ] Keyword matching works
- [ ] Match types work correctly
- [ ] Different phone numbers work
- [ ] Special characters handled
- [ ] Empty keywords work with "any" match

## Next Steps

Once testing is complete:

1. **Create production workflows** for real use cases
2. **Configure multiple triggers** for different keywords
3. **Set up proper error handling** in actions
4. **Monitor execution logs** regularly
5. **Test with real messages** from users

## Support

If you encounter issues:

1. Check server logs for errors
2. Review this guide's troubleshooting section
3. Verify all credentials and URLs
4. Test webhook independently
5. Check Meta Business Manager webhook logs
