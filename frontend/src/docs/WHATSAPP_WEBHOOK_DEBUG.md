# WhatsApp Webhook Verification Debug Guide

If webhook verification is failing, follow these steps to identify the exact issue.

## Step 1: Restart Backend with New Token

**CRITICAL**: You must restart the backend for the new `WHATSAPP_VERIFY_TOKEN` to load.

```bash
# Stop the current backend (Ctrl+C in the terminal)
# Then restart it:
npm start
```

You should see in the logs:
```
Server is running on port 4000
Initializing workflow scheduler...
```

## Step 2: Test Webhook Verification Manually

### Test with curl

```bash
curl -X GET "https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp?hub.mode=subscribe&hub.verify_token=fegrebgwqfbr3rnfgbb&hub.challenge=test_challenge_123"
```

**Expected response**:
```
test_challenge_123
```

**If you get an error**, check the backend logs for the detailed debugging output.

### Check Backend Logs

When you run the curl command above, your backend terminal should show:

```
WhatsApp webhook verification request received
Mode: subscribe
Token received: fegrebgwqfbr3rnfgbb
Expected token: fegrebgwqfbr3rnfgbb
Challenge: test_challenge_123
Token match: true
✅ WhatsApp webhook verified successfully
```

## Step 3: Verify Token Matches Exactly

**In your .env file**:
```
WHATSAPP_VERIFY_TOKEN=fegrebgwqfbr3rnfgbb
```

**In Meta Business Manager**:
- Verify Token field should be: `fegrebgwqfbr3rnfgbb`

They must match **exactly** (case-sensitive).

## Step 4: Check ngrok is Running

Make sure ngrok tunnel is still active:

```bash
# In another terminal, check if ngrok is running
ps aux | grep ngrok
```

You should see:
```
ngrok http 4000
```

If ngrok is not running, restart it:
```bash
ngrok http 4000
```

## Step 5: Verify Webhook URL

In Meta Business Manager, the Callback URL should be:
```
https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp
```

**NOT**:
- `https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp/` (trailing slash)
- `https://ironic-chau-influenceable.ngrok-free.dev/api/chat` (missing /whatsapp)
- `http://` instead of `https://`

## Step 6: Check ngrok Web Interface

Open: `http://127.0.0.1:4040`

When you click "Verify and save" in Meta, you should see a GET request:
```
GET /api/chat/whatsapp?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
```

**Check the response**:
- Status should be **200**
- Response body should be the challenge value

If status is **403**, the token doesn't match.

## Step 7: Common Issues & Solutions

### Issue: Status 403 (Verification Failed)

**Cause**: Token mismatch

**Solution**:
1. Check `.env` file has correct token: `fegrebgwqfbr3rnfgbb`
2. Check Meta has same token: `fegrebgwqfbr3rnfgbb`
3. Restart backend: `npm start`
4. Try verification again

### Issue: Status 500 (Server Error)

**Cause**: Backend error

**Solution**:
1. Check backend logs for error message
2. Verify `.env` file is valid
3. Restart backend: `npm start`
4. Try verification again

### Issue: Connection Refused

**Cause**: ngrok tunnel not running or wrong URL

**Solution**:
1. Verify ngrok is running: `ps aux | grep ngrok`
2. Check ngrok URL matches in Meta
3. Restart ngrok if needed: `ngrok http 4000`
4. Try verification again

### Issue: Timeout

**Cause**: Firewall or network issue

**Solution**:
1. Check firewall allows port 4000
2. Verify ngrok tunnel is active
3. Test with curl command above
4. Try verification again

## Step 8: Backend Logs Analysis

When verification request comes in, you'll see detailed logs:

```
WhatsApp webhook verification request received
Mode: subscribe                          ← Should be "subscribe"
Token received: fegrebgwqfbr3rnfgbb     ← Should match your token
Expected token: fegrebgwqfbr3rnfgbb     ← From .env file
Challenge: [some-value]                  ← Meta's challenge
Token match: true                         ← Should be true
✅ WhatsApp webhook verified successfully ← Success message
```

If any value doesn't match, that's the issue.

## Step 9: Full Verification Checklist

- [ ] Backend restarted after changing `.env`
- [ ] `.env` has: `WHATSAPP_VERIFY_TOKEN=fegrebgwqfbr3rnfgbb`
- [ ] Meta has Verify Token: `fegrebgwqfbr3rnfgbb`
- [ ] Callback URL is: `https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp`
- [ ] ngrok tunnel is running
- [ ] Curl test returns challenge value
- [ ] ngrok Web Interface shows 200 status
- [ ] Backend logs show "✅ WhatsApp webhook verified successfully"

## Step 10: If Still Not Working

### Collect Debug Information

1. **Backend logs** - Copy the full output when verification request comes in
2. **ngrok logs** - Check ngrok Web Interface for request details
3. **Meta error message** - Note the exact error from Meta Business Manager
4. **Curl test output** - Run the curl command and note the response

### Try Alternative Verify Token

If the current token still doesn't work, try a simpler one:

1. Change `.env`:
```
WHATSAPP_VERIFY_TOKEN=webhook_token_123
```

2. Restart backend: `npm start`

3. Update Meta with same token: `webhook_token_123`

4. Click "Verify and save" in Meta

Sometimes special characters in tokens can cause issues.

## Quick Commands Reference

```bash
# Restart backend
npm start

# Check ngrok running
ps aux | grep ngrok

# Test webhook with curl
curl -X GET "https://ironic-chau-influenceable.ngrok-free.dev/api/chat/whatsapp?hub.mode=subscribe&hub.verify_token=fegrebgwqfbr3rnfgbb&hub.challenge=test_challenge_123"

# View ngrok requests
http://127.0.0.1:4040

# Check .env token
grep WHATSAPP_VERIFY_TOKEN /Users/apostolisjerasi/Documents/Work/FlowForge/backend/.env
```

## Next Steps After Verification

Once webhook is verified (green checkmark in Meta):

1. ✅ Send test WhatsApp message
2. ✅ Check Execution Logs in FlowForge
3. ✅ Verify workflow triggers
4. ✅ Check email notification received
5. ✅ Monitor ngrok Web Interface for requests

## Support

If verification still fails after all these steps:

1. Check backend logs for exact error
2. Verify all tokens match exactly
3. Ensure backend is restarted
4. Test with curl command
5. Check ngrok Web Interface for request details
