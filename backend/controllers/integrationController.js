const Integration = require('../models/Integration')

exports.getAllIntegrations = async (req, res) => {
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
}

exports.getIntegration = async (req, res) => {
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
}

exports.updateIntegration = async (req, res) => {
  try {
    const { integrationId } = req.params
    const credentials = req.body
    
    let integration = await Integration.findOne({
      userId: req.user.id,
      integrationId
    })
    
    if (!integration) {
      integration = new Integration({
        userId: req.user.id,
        integrationId,
        credentials: new Map()
      })
    }
    
    integration.setCredentials(credentials)
    await integration.save()
    
    res.json({ 
      success: true, 
      message: 'Integration updated successfully',
      credentials: integration.getCredentials()
    })
  } catch (error) {
    console.error('Error updating integration:', error)
    res.status(500).json({ error: 'Failed to update integration' })
  }
}

exports.deleteIntegration = async (req, res) => {
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
}

exports.testIntegration = async (req, res) => {
  try {
    const { integrationId } = req.params
    
    const integration = await Integration.findOne({
      userId: req.user.id,
      integrationId
    })
    
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' })
    }
    
    const credentials = integration.getCredentials()
    
    res.json({ 
      success: true, 
      message: 'Integration credentials retrieved successfully',
      hasCredentials: Object.keys(credentials).length > 0
    })
  } catch (error) {
    console.error('Error testing integration:', error)
    res.status(500).json({ error: 'Failed to test integration' })
  }
}
