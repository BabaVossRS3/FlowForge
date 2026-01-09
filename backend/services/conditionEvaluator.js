export function evaluateCondition(conditionConfig, executionResults) {
  const { compare } = conditionConfig;
  
  if (!compare) {
    console.warn('No compare config found in condition');
    return true;
  }

  try {
    const leftValue = resolveValue(compare.leftValue, compare.leftType, compare.leftTriggerId, compare.leftTriggerField, executionResults);
    const operator = compare.operator;
    
    if (['isEmpty', 'isNotEmpty'].includes(operator)) {
      const result = evaluateUnaryOperator(leftValue, operator);
      console.log(`Condition evaluation (unary): ${leftValue} ${operator} = ${result}`);
      return result;
    }

    const rightValue = resolveValue(compare.rightValue, compare.rightType, compare.rightTriggerId, compare.rightTriggerField, executionResults);
    
    const result = evaluateBinaryOperator(leftValue, operator, rightValue, compare.caseSensitive);
    console.log(`Condition evaluation: "${leftValue}" ${operator} "${rightValue}" (caseSensitive: ${compare.caseSensitive}) = ${result}`);
    return result;
  } catch (error) {
    console.error('Error evaluating condition:', error);
    console.error('Condition config:', conditionConfig);
    console.error('Execution results keys:', Object.keys(executionResults));
    return false;
  }
}

function resolveValue(value, type, triggerId, triggerField, executionResults) {
  switch (type) {
    case 'string':
      return String(value);
    case 'number':
      return Number(value);
    case 'boolean':
      return value === 'true' || value === true;
    case 'trigger':
      return resolveTriggerOutput(triggerId, triggerField, executionResults);
    case 'variable':
      return resolveVariable(value, executionResults);
    default:
      return value;
  }
}

function resolveTriggerOutput(triggerId, triggerField, executionResults) {
  if (!triggerId || !triggerField) {
    throw new Error('Trigger ID and field are required for trigger output resolution');
  }

  const triggerResult = executionResults[triggerId];
  if (!triggerResult) {
    throw new Error(`Trigger ${triggerId} not found in execution results`);
  }

  const triggerData = triggerResult.data?.triggerData;
  if (!triggerData) {
    throw new Error(`No trigger data found for trigger ${triggerId}`);
  }

  return getNestedValue(triggerData, triggerField);
}

function resolveVariable(variablePath, executionResults) {
  if (!variablePath) {
    return undefined;
  }

  const parts = variablePath.split('.');
  const nodeId = parts[0];
  const fieldPath = parts.slice(1).join('.');

  const nodeResult = executionResults[nodeId];
  if (!nodeResult) {
    return undefined;
  }

  if (fieldPath) {
    return getNestedValue(nodeResult.data, fieldPath);
  }

  return nodeResult.data;
}

function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

function evaluateUnaryOperator(value, operator) {
  switch (operator) {
    case 'isEmpty':
      return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
    case 'isNotEmpty':
      return value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0);
    default:
      return false;
  }
}

function evaluateBinaryOperator(left, operator, right, caseSensitive = true) {
  switch (operator) {
    case '==':
      return caseSensitive ? left == right : String(left).toLowerCase() === String(right).toLowerCase();
    case '!=':
      return caseSensitive ? left != right : String(left).toLowerCase() !== String(right).toLowerCase();
    case '>':
      return Number(left) > Number(right);
    case '>=':
      return Number(left) >= Number(right);
    case '<':
      return Number(left) < Number(right);
    case '<=':
      return Number(left) <= Number(right);
    case 'contains':
      return caseSensitive 
        ? String(left).includes(String(right))
        : String(left).toLowerCase().includes(String(right).toLowerCase());
    case 'startsWith':
      return caseSensitive
        ? String(left).startsWith(String(right))
        : String(left).toLowerCase().startsWith(String(right).toLowerCase());
    case 'endsWith':
      return caseSensitive
        ? String(left).endsWith(String(right))
        : String(left).toLowerCase().endsWith(String(right).toLowerCase());
    case 'matches':
      try {
        const regex = new RegExp(right, caseSensitive ? '' : 'i');
        return regex.test(String(left));
      } catch (e) {
        console.error('Invalid regex pattern:', right);
        return false;
      }
    default:
      return false;
  }
}

export default {
  evaluateCondition,
};
