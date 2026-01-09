import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAIAPI } from '../lib/api';
import { toast } from 'sonner';

export function useAIValidation(nodes, edges, activeWorkflow) {
  const { token } = useContext(AuthContext);
  const aiAPI = getAIAPI(token);
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);
  const [lastValidated, setLastValidated] = useState(null);

  const validateWorkflow = useCallback(async () => {
    if (!activeWorkflow || nodes.length === 0) {
      setValidation(null);
      return;
    }

    const currentState = JSON.stringify({ nodes, edges });
    if (lastValidated === currentState) {
      return;
    }

    setValidating(true);
    try {
      const workflow = {
        id: activeWorkflow._id,
        name: activeWorkflow.name,
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          label: node.data?.label,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })),
      };

      const response = await aiAPI.validateWorkflow(workflow);
      setValidation(response.data.validation);
      setLastValidated(currentState);

      if (response.data.validation.status === 'INVALID') {
        const highIssues = response.data.validation.issues.filter(i => i.severity === 'HIGH').length;
        if (highIssues > 0) {
          toast.warning('Workflow validation issues detected', {
            description: `Found ${highIssues} high-severity issue${highIssues > 1 ? 's' : ''}`
          });
        }
      }
    } catch (error) {
      console.error('AI validation error:', error);
    } finally {
      setValidating(false);
    }
  }, [nodes, edges, activeWorkflow, lastValidated, aiAPI]);

  return { validation, validating, validateWorkflow };
}
