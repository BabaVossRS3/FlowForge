import express from "express";
import Workflow from "../models/Workflow.js";
import { authenticateToken } from "../middleware/auth.js";
import { executeNode } from "../services/nodeExecutor.js";
import { scheduleWorkflow, unscheduleWorkflow } from "../services/schedulerService.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const workflows = await Workflow.find({ userId: req.user.userId });
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ message: "Workflow not found" });
    if (workflow.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const workflow = new Workflow({
    userId: req.user.userId,
    name: req.body.name,
    description: req.body.description,
    nodes: req.body.nodes || [],
    edges: req.body.edges || [],
  });

  try {
    const newWorkflow = await workflow.save();
    res.status(201).json(newWorkflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ message: "Workflow not found" });
    if (workflow.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.body.name) workflow.name = req.body.name;
    if (req.body.description) workflow.description = req.body.description;
    if (req.body.nodes) workflow.nodes = req.body.nodes;
    if (req.body.edges) workflow.edges = req.body.edges;
    
    if (req.body.isActive !== undefined) {
      const wasActive = workflow.isActive;
      workflow.isActive = req.body.isActive;
      
      if (req.body.isActive && !wasActive) {
        scheduleWorkflow(workflow);
      } else if (!req.body.isActive && wasActive) {
        unscheduleWorkflow(workflow._id);
      }
    }

    const updatedWorkflow = await workflow.save();
    res.json(updatedWorkflow);
  } catch (error) {
    console.error('Error updating workflow:', error);
    res.status(400).json({ message: error.message, details: error.errors });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ message: "Workflow not found" });
    if (workflow.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    if (workflow.isActive) {
      unscheduleWorkflow(workflow._id);
    }
    
    await Workflow.findByIdAndDelete(req.params.id);
    res.json({ message: "Workflow deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/execute", authenticateToken, async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ message: "Workflow not found" });
    if (workflow.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { nodes, edges } = req.body;

    if (!nodes || nodes.length === 0) {
      return res.status(400).json({ message: "Workflow has no nodes to execute" });
    }

    try {
      // Execute workflow nodes in order based on edges
      const executionResults = {};
      const nodeMap = {};
      nodes.forEach(node => {
        nodeMap[node.id] = node;
      });

      // Find trigger nodes (nodes with no incoming edges)
      const triggerNodes = nodes.filter(node => 
        !edges.some(edge => edge.target === node.id)
      );

      if (triggerNodes.length === 0) {
        return res.status(400).json({ message: "Workflow must have at least one trigger node" });
      }

      // Execute each trigger node and follow the chain
      for (const triggerNode of triggerNodes) {
        await executeNode(triggerNode, nodeMap, edges, executionResults, req.user.userId);
      }

      const log = {
        timestamp: new Date(),
        status: "success",
        message: "Workflow executed successfully",
        results: executionResults,
      };

      workflow.executionLogs.push(log);
      await workflow.save();

      res.json({ message: "Workflow executed", log });
    } catch (executionError) {
      const log = {
        timestamp: new Date(),
        status: "failure",
        message: "Workflow execution failed",
        error: executionError.message,
      };

      workflow.executionLogs.push(log);
      await workflow.save();

      res.status(400).json({ message: "Workflow execution failed", error: executionError.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/:id/logs", authenticateToken, async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ message: "Workflow not found" });
    if (workflow.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(workflow.executionLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
