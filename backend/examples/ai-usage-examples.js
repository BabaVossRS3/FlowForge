import aiService from '../services/aiService.js';

const exampleWorkflowValidation = async () => {
  const workflow = {
    nodes: [
      { id: 'trigger-1', type: 'trigger', data: { event: 'form_submit' } },
      { id: 'action-1', type: 'action', data: { action: 'send_email' } },
      { id: 'action-2', type: 'action', data: { action: 'save_to_db' } }
    ],
    edges: [
      { source: 'trigger-1', target: 'action-1' },
      { source: 'trigger-1', target: 'action-2' }
    ]
  };

  try {
    const validation = await aiService.validateWorkflow(workflow);
    console.log('Workflow Validation Result:', JSON.stringify(validation, null, 2));
  } catch (error) {
    console.error('Validation error:', error.message);
  }
};

const exampleEmailCrafting = async () => {
  const emailContext = {
    senderEmail: 'customer@example.com',
    senderName: 'John Doe',
    subject: 'Question about Premium Plan',
    body: 'Hi, I am interested in upgrading to your premium plan. Can you tell me more about the features and pricing?',
    receivedAt: new Date().toISOString()
  };

  const conditions = {
    tone: 'professional',
    includeDiscount: true,
    discountAmount: '20%',
    productTier: 'premium',
    responseType: 'inquiry'
  };

  try {
    const email = await aiService.craftEmailResponse(emailContext, conditions);
    console.log('Crafted Email:', JSON.stringify(email, null, 2));
  } catch (error) {
    console.error('Email crafting error:', error.message);
  }
};

const exampleWorkflowGuidance = async () => {
  const query = 'How do I create a workflow that automatically sends a welcome email when a new user signs up?';
  
  const workflowContext = {
    existingNodes: ['trigger-signup', 'action-create-user'],
    userLevel: 'beginner',
    platform: 'FlowForge'
  };

  try {
    const guidance = await aiService.generateWorkflowGuidance(query, workflowContext);
    console.log('Workflow Guidance:', JSON.stringify(guidance, null, 2));
  } catch (error) {
    console.error('Guidance error:', error.message);
  }
};

const exampleEmailExtraction = async () => {
  const emailContent = `
From: urgent.customer@example.com
To: support@flowforge.com
Subject: URGENT: Workflow not executing

Hi Support Team,

I created a workflow yesterday to automate our customer onboarding process, but it's not executing at all. 
The trigger is set to "New User Registration" but nothing happens when a user signs up.

This is blocking our entire onboarding process and we have 50+ users waiting.

Please help ASAP!

Best regards,
Sarah Johnson
Operations Manager
  `;

  try {
    const extractedData = await aiService.extractEmailData(emailContent);
    console.log('Extracted Email Data:', JSON.stringify(extractedData, null, 2));
  } catch (error) {
    console.error('Extraction error:', error.message);
  }
};

const exampleAutomatedEmailWorkflow = async () => {
  console.log('\n=== Automated Email Response Workflow Example ===\n');
  
  const incomingEmail = `
From: potential.client@company.com
Subject: Interested in enterprise plan

Hello,

We are a company with 500+ employees looking for a workflow automation solution.
We need features like:
- Custom integrations
- SSO authentication
- Dedicated support
- SLA guarantees

Can you provide pricing and a demo?

Thanks,
Michael Chen
CTO, TechCorp Inc.
  `;

  console.log('1. Extracting email data...');
  const extractedData = await aiService.extractEmailData(incomingEmail);
  console.log('Extracted:', JSON.stringify(extractedData, null, 2));

  console.log('\n2. Crafting personalized response...');
  const emailContext = {
    senderEmail: 'potential.client@company.com',
    senderName: 'Michael Chen',
    senderTitle: 'CTO',
    company: 'TechCorp Inc.',
    subject: 'Interested in enterprise plan',
    body: incomingEmail,
    intent: extractedData.intent,
    urgency: extractedData.urgency
  };

  const conditions = {
    tone: 'professional',
    offerDemo: true,
    planType: 'enterprise',
    features: ['custom-integrations', 'sso', 'dedicated-support', 'sla'],
    includeCalendlyLink: true,
    responseTime: 'immediate'
  };

  const craftedEmail = await aiService.craftEmailResponse(emailContext, conditions);
  console.log('Crafted Email:', JSON.stringify(craftedEmail, null, 2));
  
  console.log('\n=== Workflow Complete ===\n');
};

export {
  exampleWorkflowValidation,
  exampleEmailCrafting,
  exampleWorkflowGuidance,
  exampleEmailExtraction,
  exampleAutomatedEmailWorkflow
};
