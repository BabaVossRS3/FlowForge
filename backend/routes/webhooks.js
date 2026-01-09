import express from "express";
import Workflow from "../models/Workflow.js";
import { executeNode } from "../services/nodeExecutor.js";

const router = express.Router();

router.all("/:webhookId", async (req, res) => {
  try {
    const { webhookId } = req.params;
    const webhookUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    
    const workflows = await Workflow.find({ isActive: true });
    
    let matchedWorkflow = null;
    for (const workflow of workflows) {
      const triggerNode = workflow.nodes?.find(node => node.data?.type === 'trigger');
      if (!triggerNode) continue;
      
      const webhookConfig = triggerNode.data?.config?.webhook;
      if (!webhookConfig) continue;
      
      if (webhookConfig.url && webhookConfig.url.includes(webhookId)) {
        if (webhookConfig.method && webhookConfig.method !== req.method) {
          continue;
        }
        matchedWorkflow = workflow;
        break;
      }
    }

    if (!matchedWorkflow) {
      return res.status(404).json({ 
        message: "Webhook not found or workflow is not active",
        webhookId 
      });
    }

    const webhookData = {
      method: req.method,
      headers: req.headers,
      query: req.query,
      body: req.body,
      timestamp: new Date(),
    };

    const executionResults = {};
    const nodeMap = {};
    matchedWorkflow.nodes.forEach(node => {
      nodeMap[node.id] = node;
    });

    const triggerNodes = matchedWorkflow.nodes.filter(node => 
      !matchedWorkflow.edges.some(edge => edge.target === node.id)
    );

    for (const triggerNode of triggerNodes) {
      await executeNode(triggerNode, nodeMap, matchedWorkflow.edges, executionResults, matchedWorkflow.userId, webhookData);
    }

    const log = {
      timestamp: new Date(),
      status: 'success',
      message: 'Webhook triggered workflow execution',
      results: executionResults,
      webhookData: {
        method: req.method,
        url: webhookUrl,
      }
    };

    matchedWorkflow.executionLogs.push(log);
    await matchedWorkflow.save();

    res.json({ 
      message: "Workflow executed successfully", 
      workflowId: matchedWorkflow._id,
      executionResults 
    });
  } catch (error) {
    console.error('Webhook execution error:', error);
    res.status(500).json({ message: error.message });
  }
});


export default router;
