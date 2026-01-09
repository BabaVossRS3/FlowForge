import cron from 'node-cron';
import Workflow from '../models/Workflow.js';
import { executeNode } from './nodeExecutor.js';

const activeSchedules = new Map();

export async function initializeScheduler() {
  console.log('Initializing workflow scheduler...');
  try {
    const workflows = await Workflow.find({ isActive: true });
    
    for (const workflow of workflows) {
      scheduleWorkflow(workflow);
    }
    
    console.log(`Scheduler initialized with ${workflows.length} active workflows`);
  } catch (error) {
    console.error('Error initializing scheduler:', error);
  }
}

export function scheduleWorkflow(workflow) {
  if (!workflow.nodes || workflow.nodes.length === 0) {
    return;
  }

  const triggerNode = workflow.nodes.find(node => node.data?.type === 'trigger');
  if (!triggerNode) {
    return;
  }

  const nodeConfig = triggerNode.data?.config || {};
  const scheduleConfig = nodeConfig.schedule;
  
  if (!scheduleConfig) {
    console.warn(`No schedule config found for workflow ${workflow._id}`);
    return;
  }

  const scheduleType = scheduleConfig.scheduleType;

  if (scheduleType === 'specificDate') {
    scheduleSpecificDateTime(workflow, scheduleConfig);
  } else if (scheduleType === 'recurring') {
    const cronExpression = intervalToCron(scheduleConfig.interval);
    scheduleWithCron(workflow, cronExpression);
  } else if (scheduleType === 'cron') {
    scheduleWithCron(workflow, scheduleConfig.cronExpression);
  } else {
    console.warn(`Invalid schedule type for workflow ${workflow._id}`);
  }
}

function scheduleWithCron(workflow, cronExpression) {
  if (!cronExpression) {
    console.warn(`Invalid cron expression for workflow ${workflow._id}`);
    return;
  }

  try {
    const task = cron.schedule(cronExpression, async () => {
      console.log(`Executing scheduled workflow: ${workflow._id}`);
      await executeWorkflow(workflow);
    });

    activeSchedules.set(workflow._id.toString(), task);
    console.log(`Scheduled workflow ${workflow._id} with cron: ${cronExpression}`);
  } catch (error) {
    console.error(`Error scheduling workflow ${workflow._id}:`, error);
  }
}

function scheduleSpecificDateTime(workflow, scheduleConfig) {
  if (!scheduleConfig.specificDate || !scheduleConfig.specificTime) {
    console.warn(`Missing date or time for workflow ${workflow._id}`);
    return;
  }

  try {
    const dateTimeString = `${scheduleConfig.specificDate}T${scheduleConfig.specificTime}`;
    let targetDateTime = new Date(dateTimeString);
    
    const timezone = scheduleConfig.timezone || 'UTC';
    const timezoneOffset = parseTimezone(timezone);
    if (timezoneOffset !== null) {
      const localOffset = targetDateTime.getTimezoneOffset();
      const totalOffset = (timezoneOffset * 60) + localOffset;
      targetDateTime = new Date(targetDateTime.getTime() - (totalOffset * 60 * 1000));
    }
    
    const now = new Date();
    const delay = targetDateTime.getTime() - now.getTime();

    if (delay <= 0) {
      console.warn(`Scheduled time for workflow ${workflow._id} is in the past: ${targetDateTime.toISOString()} (now: ${now.toISOString()})`);
      return;
    }

    if (delay > 2147483647) {
      console.warn(`Scheduled time for workflow ${workflow._id} is too far in the future (max ~24 days)`);
      return;
    }

    const timeoutId = setTimeout(async () => {
      console.log(`Executing scheduled workflow at specific time: ${workflow._id}`);
      await executeWorkflow(workflow);
      activeSchedules.delete(workflow._id.toString());
    }, delay);

    activeSchedules.set(workflow._id.toString(), { 
      stop: () => clearTimeout(timeoutId),
      type: 'timeout',
      targetTime: targetDateTime
    });
    
    console.log(`Scheduled workflow ${workflow._id} for ${targetDateTime.toISOString()} (in ${Math.round(delay / 1000)}s / ${Math.round(delay / 60000)}m)`);
  } catch (error) {
    console.error(`Error scheduling specific date/time for workflow ${workflow._id}:`, error);
  }
}

function parseTimezone(timezone) {
  if (timezone === 'UTC') return 0;
  
  const match = timezone.match(/UTC([+-])(\d+)/);
  if (match) {
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2]);
    return sign * hours;
  }
  
  return null;
}

export function unscheduleWorkflow(workflowId) {
  const task = activeSchedules.get(workflowId.toString());
  if (task) {
    if (typeof task.stop === 'function') {
      task.stop();
    }
    activeSchedules.delete(workflowId.toString());
    console.log(`Unscheduled workflow ${workflowId}`);
  }
}

function intervalToCron(interval) {
  const intervalMap = {
    '1m': '* * * * *',
    '5m': '*/5 * * * *',
    '15m': '*/15 * * * *',
    '30m': '*/30 * * * *',
    '1h': '0 * * * *',
    '6h': '0 */6 * * *',
    '12h': '0 */12 * * *',
    '1d': '0 0 * * *',
    '1w': '0 0 * * 0',
  };

  return intervalMap[interval] || '*/5 * * * *';
}

function dateTimeToCron(dateStr, timeStr) {
  if (!dateStr || !timeStr) {
    return null;
  }

  const [year, month, day] = dateStr.split('-');
  const [hour, minute] = timeStr.split(':');

  return `${minute} ${hour} ${day} ${month} *`;
}

async function executeWorkflow(workflow) {
  try {
    const { nodes, edges } = workflow;

    if (!nodes || nodes.length === 0) {
      console.warn(`Workflow ${workflow._id} has no nodes`);
      return;
    }

    const executionResults = {};
    const nodeMap = {};
    nodes.forEach(node => {
      nodeMap[node.id] = node;
    });

    const triggerNodes = nodes.filter(node => 
      !edges.some(edge => edge.target === node.id)
    );

    for (const triggerNode of triggerNodes) {
      await executeNode(triggerNode, nodeMap, edges, executionResults, workflow.userId);
    }

    const log = {
      timestamp: new Date(),
      status: 'success',
      message: 'Scheduled workflow executed successfully',
      results: executionResults,
    };

    workflow.executionLogs.push(log);
    await workflow.save();

    console.log(`Workflow ${workflow._id} executed successfully`);
  } catch (error) {
    console.error(`Error executing workflow ${workflow._id}:`, error);

    const log = {
      timestamp: new Date(),
      status: 'failure',
      message: 'Scheduled workflow execution failed',
      error: error.message,
    };

    workflow.executionLogs.push(log);
    await workflow.save();
  }
}


export default {
  initializeScheduler,
  scheduleWorkflow,
  unscheduleWorkflow,
};
