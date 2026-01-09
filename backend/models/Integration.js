import mongoose from 'mongoose'
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const ALGORITHM = 'aes-256-cbc'

// Ensure encryption key is exactly 32 bytes
const getEncryptionKey = () => {
  const key = ENCRYPTION_KEY
  if (key.length < 64) {
    // Pad with zeros if too short
    return key.padEnd(64, '0')
  }
  return key.slice(0, 64)
}

const integrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  integrationId: {
    type: String,
    required: true
  },
  credentials: {
    type: Map,
    of: String,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

integrationSchema.index({ userId: 1, integrationId: 1 }, { unique: true })

integrationSchema.methods.encryptField = function(value) {
  if (!value) return value
  
  try {
    const iv = crypto.randomBytes(16)
    const key = Buffer.from(getEncryptionKey(), 'hex')
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    
    let encrypted = cipher.update(value, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return iv.toString('hex') + ':' + encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    return value
  }
}

integrationSchema.methods.decryptField = function(value) {
  if (!value || !value.includes(':')) return value
  
  try {
    const parts = value.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const encryptedText = parts[1]
    const key = Buffer.from(getEncryptionKey(), 'hex')
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    return value
  }
}

integrationSchema.methods.setCredentials = function(credentials) {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authToken', 'connectionString']
  // Note: accessToken is NOT encrypted to avoid corruption issues with long tokens
  
  for (const [key, value] of Object.entries(credentials)) {
    const isSensitive = sensitiveFields.some(sf => key.toLowerCase().includes(sf.toLowerCase()))
    
    if (isSensitive && value && key !== 'accessToken') {
      this.credentials.set(key, this.encryptField(value))
    } else {
      this.credentials.set(key, value)
    }
  }
  
  this.lastUpdated = new Date()
}

integrationSchema.methods.getCredentials = function() {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authToken', 'accessToken', 'connectionString']
  const decrypted = {}
  
  for (const [key, value] of this.credentials.entries()) {
    const isSensitive = sensitiveFields.some(sf => key.toLowerCase().includes(sf.toLowerCase()))
    
    if (isSensitive && value) {
      const decryptedValue = this.decryptField(value)
      console.log(`Decrypting ${key}:`, {
        isEncrypted: value.includes(':'),
        originalLength: value.length,
        decryptedLength: decryptedValue.length,
        decryptedStart: decryptedValue.substring(0, 20) + '...'
      })
      decrypted[key] = decryptedValue
    } else {
      decrypted[key] = value
    }
  }
  
  return decrypted
}

export default mongoose.model('Integration', integrationSchema)
