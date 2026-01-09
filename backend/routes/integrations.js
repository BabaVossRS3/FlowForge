import express from 'express'
import Integration from '../models/Integration.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, async (req, res) => {
  try {
    const integrations = await Integration.find({ userId: req.user.id })
    
    const integrationsMap = {}
    integrations.forEach(integration => {
      integrationsMap[integration.integrationId] = integration.getCredentials()
    })
    
    res.json(integrationsMap)
  } catch (error) {
    console.error('Error fetching integrations:', error)
    res.status(500).json({ error: 'Failed to fetch integrations' })
  }
})

router.get('/:integrationId', authenticateToken, async (req, res) => {
  try {
    const { integrationId } = req.params
    
    const integration = await Integration.findOne({
      userId: req.user.id,
      integrationId
    })
    
    if (!integration) {
      return res.json({})
    }
    
    res.json(integration.getCredentials())
  } catch (error) {
    console.error('Error fetching integration:', error)
    res.status(500).json({ error: 'Failed to fetch integration' })
  }
})

router.put('/:integrationId', authenticateToken, async (req, res) => {
  try {
    const { integrationId } = req.params
    const credentials = req.body
    
    console.log('Updating integration:', integrationId, 'for user:', req.user.id)
    
    let integration = await Integration.findOne({
      userId: req.user.id,
      integrationId
    })
    
    if (!integration) {
      console.log('Creating new integration document')
      integration = new Integration({
        userId: req.user.id,
        integrationId,
        credentials: new Map()
      })
    }
    
    console.log('Setting credentials:', Object.keys(credentials))
    integration.setCredentials(credentials)
    
    console.log('Saving integration...')
    await integration.save()
    
    console.log('Integration saved successfully')
    res.json({ 
      success: true, 
      message: 'Integration updated successfully',
      credentials: integration.getCredentials()
    })
  } catch (error) {
    console.error('Error updating integration:', error.message, error.stack)
    res.status(500).json({ 
      error: 'Failed to update integration',
      details: error.message
    })
  }
})

router.delete('/:integrationId', authenticateToken, async (req, res) => {
  try {
    const { integrationId } = req.params
    
    await Integration.deleteOne({
      userId: req.user.id,
      integrationId
    })
    
    res.json({ success: true, message: 'Integration deleted successfully' })
  } catch (error) {
    console.error('Error deleting integration:', error)
    res.status(500).json({ error: 'Failed to delete integration' })
  }
})

export default router
