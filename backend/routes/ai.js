import express from 'express';
import aiService from '../services/aiService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate-workflow', authenticateToken, async (req, res) => {
  try {
    const { workflow } = req.body;

    if (!workflow) {
      return res.status(400).json({ error: 'Workflow data is required' });
    }

    const validation = await aiService.validateWorkflow(workflow);
    
    res.json({
      success: true,
      validation
    });
  } catch (error) {
    console.error('Workflow validation error:', error);
    res.status(500).json({ 
      error: 'Failed to validate workflow',
      message: error.message 
    });
  }
});

router.post('/craft-email', authenticateToken, async (req, res) => {
  try {
    const { emailContext, conditions } = req.body;

    if (!emailContext) {
      return res.status(400).json({ error: 'Email context is required' });
    }

    const emailResponse = await aiService.craftEmailResponse(emailContext, conditions || {});
    
    res.json({
      success: true,
      email: emailResponse
    });
  } catch (error) {
    console.error('Email crafting error:', error);
    res.status(500).json({ 
      error: 'Failed to craft email',
      message: error.message 
    });
  }
});

router.post('/guidance', authenticateToken, async (req, res) => {
  try {
    const { query, workflowContext } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const guidance = await aiService.generateWorkflowGuidance(query, workflowContext || {});
    
    res.json({
      success: true,
      guidance
    });
  } catch (error) {
    console.error('Guidance generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate guidance',
      message: error.message 
    });
  }
});

router.post('/extract-email-data', authenticateToken, async (req, res) => {
  try {
    const { emailContent } = req.body;

    if (!emailContent) {
      return res.status(400).json({ error: 'Email content is required' });
    }

    const extractedData = await aiService.extractEmailData(emailContent);
    
    res.json({
      success: true,
      data: extractedData
    });
  } catch (error) {
    console.error('Email extraction error:', error);
    res.status(500).json({ 
      error: 'Failed to extract email data',
      message: error.message 
    });
  }
});

export default router;
