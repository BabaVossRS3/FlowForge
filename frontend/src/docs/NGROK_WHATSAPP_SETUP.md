# WhatsApp Setup with ngrok - Local Testing

This guide shows how to configure WhatsApp webhooks using ngrok for local testing.

## What is ngrok?

ngrok creates a secure tunnel from the internet to your local machine, allowing external services (like WhatsApp) to send webhooks to your local development server.

## Step 1: Start ngrok Tunnel

### Terminal Command

```bash
ngrok http 4000
```

This creates a tunnel to your local server running on port 4000.

### What You'll See

```
ngrok by @inconshrevat                                       (Ctrl+C to quit)

Session Status                online
Account                       [your-email]@gmail.com (Plan: Free)
Version                        3.34.1
Region                         Europe (eu)
Latency                        11ms
Web Interface                  http://127.0.0.1:4040
Forwarding                     https://abc123def456.ngrok.io -> http://localhost:4000

Connections                    ttl     opn     rt1     rt5     p50     p95
                               0       0       0.00    0.00    0.00    0.00
```

**Important**: Your ngrok URL is: `https://abc123def456.ngrok.io`

## Step 2: Configure WhatsApp Webhook in Meta Business Manager

### 1. Go to Meta App Dashboard
- URL: https://developers.facebook.com
- Log in with your Meta account

### 2. Select Your WhatsApp Business App
- Click on your app in the dashboard
- Go to **Configuration** or **Webhooks** section

### 3. Set Webhook Configuration

**Callback URL**:
```
https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp
```

**Verify Token**:
```
flowforge_webhook_token
```
(Can be any random string)

### 4. Subscribe to Webhook Events

Make sure these events are subscribed:
- ✅ `messages` - Required for receiving messages
- ✅ `message_status` - Optional, for delivery status
- ✅ `message_template_status_update` - Optional

### 5. Save and Verify

Click "Verify and Save" - WhatsApp will send a test request to your webhook.

You should see in your terminal:
```
POST /api/chat/whatsapp HTTP/1.1
```

## Step 3: Save WhatsApp Credentials in FlowForge

1. **Open FlowForge** in browser
2. **Settings** → **Integrations**
3. **WhatsApp Business** section
4. Fill in:
   - **Phone Number ID**: `917386968126025`
   - **Access Token**: `EAAVyRZBhteZBcBQWNMC0wH5JZCV1KPjC9UQtrhxcfxFYsBwyiBUMHty8awqPVqRIViMboZC28aTzJfQzZCZBZAwVQSDZAzHM5GT3DSYZCwZCgwssDY0n7vCEarZBYMSDLzLul6cLkV4a9GZB8tw3ZBZBrDZBxlrntoe6l6XXMxZCOJHA0KJ95GddmCfFXoPZBo55k98k8swZDZD`
5. **Click Save**

## Step 4: Create and Test Workflow

### Create Test Workflow

1. **New Workflow** → Name: "WhatsApp ngrok Test"
2. **Add Trigger** → Chat Message
   - Platform: `whatsapp`
   - Phone: Your test number
   - Keywords: `test, hello`
   - Match Type: `contains`
3. **Add Action** → Email
   - To: Your email
   - Subject: "WhatsApp Message Received"
   - Body: "Test message triggered workflow!"
4. **Click Active** to activate

### Send Test Message

1. Open WhatsApp on your phone
2. Send message to your test number: `test`
3. Check FlowForge Execution Logs

## Step 5: Monitor Webhook Traffic

### View ngrok Web Interface

Open in browser: `http://127.0.0.1:4040`

You'll see:
- All incoming requests to your webhook
- Request/response details
- Headers and body
- Timing information

### Check Server Logs

In your terminal where FlowForge is running, look for:

```
Chat trigger matched for workflow [ID] on whatsapp
Workflow execution completed successfully
```

## Troubleshooting

### ngrok Tunnel Disconnected

**Problem**: Tunnel shows "offline"

**Solution**:
1. Stop ngrok (Ctrl+C)
2. Restart: `ngrok http 4000`
3. Update webhook URL in Meta Business Manager with new ngrok URL

### Webhook Not Receiving Messages

**Problem**: No requests showing in ngrok Web Interface

**Solution**:
1. Verify webhook URL in Meta Business Manager matches ngrok URL
2. Check webhook is subscribed to "messages" event
3. Verify phone number is registered with WhatsApp Business
4. Test webhook manually with curl:

```bash
curl -X POST https://your-ngrok-url.ngrok.io/api/chat/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "1234567890",
      "text": {"body": "test"}
    }]
  }'
```

### Workflow Not Triggering

**Problem**: Webhook receives message but workflow doesn't trigger

**Solution**:
1. Check workflow is **Active** (green button)
2. Verify credentials are saved in Integrations
3. Check phone number matches exactly
4. Verify keywords match message
5. Check server logs for errors

### "Connection Refused" Error

**Problem**: ngrok shows connection refused

**Solution**:
1. Verify FlowForge backend is running on port 4000
2. Check no firewall is blocking port 4000
3. Restart FlowForge backend
4. Restart ngrok tunnel

## Important Notes

### ngrok Free Plan Limitations

- ⚠️ URL changes every time you restart ngrok
- ⚠️ Limited to 40 connections/minute
- ⚠️ 2 hour session limit

**Solution**: Update webhook URL in Meta Business Manager each time ngrok restarts

### Keep ngrok Running

- Keep the ngrok terminal window open
- Don't close it while testing
- If closed, restart with `ngrok http 4000`

### Update Webhook URL When ngrok Restarts

Every time you restart ngrok, you get a new URL. You must:
1. Note the new ngrok URL
2. Go to Meta Business Manager
3. Update the webhook Callback URL
4. Save changes

## Testing Checklist

- [ ] ngrok tunnel is running (`ngrok http 4000`)
- [ ] ngrok URL is noted (e.g., `https://abc123.ngrok.io`)
- [ ] Webhook URL in Meta Business Manager is updated
- [ ] Webhook is subscribed to "messages" event
- [ ] FlowForge credentials are saved
- [ ] Test workflow is created and activated
- [ ] Test message sent to WhatsApp
- [ ] Execution logs show success
- [ ] Email notification received
- [ ] ngrok Web Interface shows incoming request

## Quick Reference

| Step | Command/Action |
|------|----------------|
| Start ngrok | `ngrok http 4000` |
| View requests | `http://127.0.0.1:4040` |
| Webhook URL | `https://[ngrok-url]/api/chat/whatsapp` |
| Test curl | `curl -X POST https://[ngrok-url]/api/chat/whatsapp ...` |
| Check logs | Look for "Chat trigger matched" in terminal |

## Next Steps

1. ✅ Keep ngrok running during testing
2. ✅ Update webhook URL if ngrok restarts
3. ✅ Monitor ngrok Web Interface for requests
4. ✅ Check server logs for execution details
5. ✅ Test different keywords and match types
6. ✅ Once working, deploy to production with permanent URL

## Moving to Production

When ready to deploy:

1. Get a permanent domain (e.g., `api.yourcompany.com`)
2. Deploy FlowForge to production server
3. Update webhook URL in Meta Business Manager to production URL
4. Stop ngrok tunnel
5. Monitor production logs

## Support

If issues persist:

1. Check ngrok Web Interface for incoming requests
2. Review server logs for errors
3. Verify all credentials are correct
4. Test webhook with curl command
5. Check Meta Business Manager webhook logs
