import { useState, useEffect, useContext } from 'react'
import { X, Save, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const integrationCategories = [
  {
    name: 'Communication',
    integrations: [
      { id: 'slack', name: 'Slack', fields: ['botToken', 'signingSecret'] },
      { id: 'email', name: 'Email (SMTP)', fields: ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword'] },
      { id: 'sms', name: 'SMS (Twilio)', fields: ['accountSid', 'authToken', 'phoneNumber'] },
      { id: 'discord', name: 'Discord', fields: ['botToken', 'clientId'] },
      { id: 'telegram', name: 'Telegram', fields: ['botToken'] },
      { id: 'whatsapp', name: 'WhatsApp Business', fields: ['phoneNumberId', 'accessToken'] },
    ]
  },
  {
    name: 'Push Notifications',
    integrations: [
      { id: 'firebase', name: 'Firebase', fields: ['serverKey', 'projectId'] },
      { id: 'onesignal', name: 'OneSignal', fields: ['appId', 'apiKey'] },
      { id: 'sendgrid', name: 'SendGrid', fields: ['apiKey'] },
      { id: 'mailgun', name: 'Mailgun', fields: ['apiKey', 'domain'] },
    ]
  },
  {
    name: 'Databases',
    integrations: [
      { id: 'mongodb', name: 'MongoDB', fields: ['connectionString'] },
      { id: 'postgresql', name: 'PostgreSQL', fields: ['host', 'port', 'database', 'username', 'password'] },
      { id: 'mysql', name: 'MySQL', fields: ['host', 'port', 'database', 'username', 'password'] },
    ]
  },
  {
    name: 'Webhooks & APIs',
    integrations: [
      { id: 'webhook', name: 'Generic Webhook', fields: ['baseUrl', 'apiKey'] },
      { id: 'rest-api', name: 'REST API', fields: ['baseUrl', 'apiKey', 'authType'] },
      { id: 'graphql', name: 'GraphQL', fields: ['endpoint', 'apiKey'] },
    ]
  },
  {
    name: 'Scheduling',
    integrations: [
      { id: 'cron', name: 'Cron Jobs', fields: ['cronExpression'] },
      { id: 'schedule', name: 'Interval Scheduling', fields: ['interval', 'unit'] },
    ]
  },
]

const fieldLabels = {
  botToken: 'Bot Token',
  signingSecret: 'Signing Secret',
  smtpHost: 'SMTP Host',
  smtpPort: 'SMTP Port',
  smtpUser: 'SMTP Username',
  smtpPassword: 'SMTP Password',
  accountSid: 'Account SID',
  authToken: 'Auth Token',
  phoneNumber: 'Phone Number',
  serverKey: 'Server Key',
  projectId: 'Project ID',
  appId: 'App ID',
  apiKey: 'API Key',
  connectionString: 'Connection String',
  host: 'Host',
  port: 'Port',
  database: 'Database',
  username: 'Username',
  password: 'Password',
  clientId: 'Client ID',
  phoneNumberId: 'Phone Number ID',
  accessToken: 'Access Token',
  domain: 'Domain',
  baseUrl: 'Base URL',
  endpoint: 'GraphQL Endpoint',
  authType: 'Auth Type',
  cronExpression: 'Cron Expression',
  interval: 'Interval',
  unit: 'Unit (minutes/hours/days)',
}

const sensitiveFields = ['password', 'token', 'secret', 'key', 'authToken', 'accessToken', 'connectionString']

export default function IntegrationSettings({ isOpen, onClose }) {
  const { token } = useContext(AuthContext)
  const [integrations, setIntegrations] = useState({})
  const [showPasswords, setShowPasswords] = useState({})
  const [savedStatus, setSavedStatus] = useState({})

  useEffect(() => {
    if (isOpen) {
      loadIntegrations()
    }
  }, [isOpen])

  const loadIntegrations = async () => {
    try {
      if (!token) {
        console.warn('No authentication token available')
        return
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/integrations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setIntegrations(data)
      } else {
        console.error('Failed to load integrations:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error loading integrations:', error)
    }
  }

  const saveIntegration = async (integrationId) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/integrations/${integrationId}`
      console.log('Saving integration to:', apiUrl)
      console.log('Token:', token ? 'Present' : 'Missing')
      console.log('Credentials:', integrations[integrationId])

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(integrations[integrationId] || {})
      })

      const data = await response.json()

      if (response.ok) {
        setSavedStatus({ ...savedStatus, [integrationId]: 'success' })
        
        setTimeout(() => {
          setSavedStatus({ ...savedStatus, [integrationId]: null })
        }, 2000)
      } else {
        console.error('Integration save error:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        })
        setSavedStatus({ ...savedStatus, [integrationId]: 'error' })
      }
    } catch (error) {
      console.error('Error saving integration:', {
        message: error.message,
        stack: error.stack
      })
      setSavedStatus({ ...savedStatus, [integrationId]: 'error' })
    }
  }

  const updateIntegrationField = (integrationId, field, value) => {
    setIntegrations({
      ...integrations,
      [integrationId]: {
        ...integrations[integrationId],
        [field]: value
      }
    })
  }

  const togglePasswordVisibility = (fieldKey) => {
    setShowPasswords({
      ...showPasswords,
      [fieldKey]: !showPasswords[fieldKey]
    })
  }

  const isSensitiveField = (fieldName) => {
    return sensitiveFields.some(sf => fieldName.toLowerCase().includes(sf.toLowerCase()))
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed! inset-0! bg-black/50! flex! items-center! justify-center! z-50! p-4!" 
      style={{ position: 'fixed', zIndex: 9999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-[#1a1a1a]! rounded-lg! border! border-[#333]! w-full! max-w-5xl! max-h-[90vh]! flex! flex-col! shadow-2xl!"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex! items-center! justify-between! p-6! border-b! border-[#333]!">
          <div className="flex-1!">
            <div className="flex! items-center! gap-3!">
              <h2 className="text-xl! font-bold! text-[#e0e0e0]!">Integration Settings</h2>
              <div className="flex! items-center! gap-1! text-white!">
                <AlertCircle size={16} />
                <span className="text-xs!">All credentials are encrypted and stored securely</span>
              </div>
            </div>
            <p className="text-sm! text-[#666666]! mt-2!">Configure your third-party service integrations</p>
          </div>
          <button
            onClick={onClose}
            className="p-2! hover:bg-[#2a2a3e]! rounded! transition-colors! text-[#e0e0e0]! shrink-0!"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content with Tabs */}
        <div className="flex-1! overflow-y-auto! p-6! flex! flex-col!">
          <Tabs defaultValue="Communication" className="w-full! flex! flex-col!">
            <TabsList className="bg-[#0a0a0a]! border! border-[#333]! p-1! mb-6! shrink-0!">
              {integrationCategories.map((category) => (
                <TabsTrigger 
                  key={category.name} 
                  value={category.name}
                  className="data-[state=active]:bg-[#85409D]! data-[state=active]:text-white! text-[#999999]! px-4! py-2! rounded! text-sm! transition-colors!"
                >
                  {category.name}
                  <span className="ml-2! text-xs! opacity-60!">({category.integrations.length})</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {integrationCategories.map((category) => (
              <TabsContent 
                key={category.name} 
                value={category.name}
                className="mt-0!"
              >
                <div className="space-y-4!">
                  {category.integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="bg-[#2a2a3e]! rounded-lg! p-5! border! border-[#444]!"
                    >
                      <div className="flex! items-center! justify-between! mb-4!">
                        <div>
                          <h3 className="text-lg! font-semibold! text-[#e0e0e0]!">
                            {integration.name}
                          </h3>
                          <p className="text-xs! text-[#666666]! mt-1!">
                            Configure your {integration.name} integration credentials
                          </p>
                        </div>
                        <button
                          onClick={() => saveIntegration(integration.id)}
                          className="flex! items-center! gap-2! bg-[#85409D]! hover:bg-[#a855f7]! text-white! px-4! py-2! rounded! text-sm! transition-colors! shrink-0!"
                        >
                          {savedStatus[integration.id] === 'success' ? (
                            <>
                              <Check size={16} />
                              Saved
                            </>
                          ) : savedStatus[integration.id] === 'error' ? (
                            <>
                              <AlertCircle size={16} />
                              Error
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid! grid-cols-1! md:grid-cols-2! gap-4!">
                        {integration.fields.map((field) => {
                          const fieldKey = `${integration.id}_${field}`
                          const isSensitive = isSensitiveField(field)
                          const fieldValue = integrations[integration.id]?.[field] || ''

                          return (
                            <div key={field} className={integration.fields.length === 1 ? 'md:col-span-2!' : ''}>
                              <label className="block! text-sm! font-medium! text-[#999999]! mb-2!">
                                {fieldLabels[field] || field}
                              </label>
                              <div className="relative!">
                                <input
                                  type={isSensitive ? 'password' : 'text'}
                                  value={fieldValue}
                                  onChange={(e) => updateIntegrationField(integration.id, field, e.target.value)}
                                  placeholder={`Enter ${fieldLabels[field] || field}`}
                                  className="w-full! bg-[#1a1a2e]! border! border-[#333]! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! outline-none! focus:ring-2! focus:ring-[#85409D]! focus:border-transparent! transition-all!"
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

      </div>
    </div>
  )
}
