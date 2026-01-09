import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

export default function AIValidationTooltip({ nodeId, validation }) {
  const [tooltipContent, setTooltipContent] = useState(null);

  useEffect(() => {
    if (!validation || !validation.issues) return;

    const nodeIssues = validation.issues.filter(
      issue => issue.nodeId === nodeId
    );

    if (nodeIssues.length > 0) {
      setTooltipContent(nodeIssues);
    } else {
      setTooltipContent(null);
    }
  }, [validation, nodeId]);

  if (!tooltipContent || tooltipContent.length === 0) return null;

  const highestSeverity = tooltipContent.reduce((max, issue) => {
    const severityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return severityOrder[issue.severity] > severityOrder[max] ? issue.severity : max;
  }, 'LOW');

  const getIcon = (severity) => {
    switch (severity) {
      case 'HIGH':
        return <AlertTriangle size={16} className="text-red-400" />;
      case 'MEDIUM':
        return <AlertCircle size={16} className="text-yellow-400" />;
      case 'LOW':
        return <Info size={16} className="text-blue-400" />;
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  const getColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'border-red-400/50 bg-red-900/20';
      case 'MEDIUM':
        return 'border-yellow-400/50 bg-yellow-900/20';
      case 'LOW':
        return 'border-blue-400/50 bg-blue-900/20';
      default:
        return 'border-blue-400/50 bg-blue-900/20';
    }
  };

  return (
    <>
      <div
        data-tooltip-id={`ai-tooltip-${nodeId}`}
        className={`absolute! -top-2! -right-2! w-6! h-6! rounded-full! border-2! ${getColor(highestSeverity)} flex! items-center! justify-center! cursor-pointer! animate-pulse! z-10!`}
      >
        {getIcon(highestSeverity)}
      </div>
      <Tooltip
        id={`ai-tooltip-${nodeId}`}
        place="top"
        className="bg-[#1a1a1a]! border! border-[#85409D]/50! rounded-lg! shadow-xl! p-0! opacity-100! z-50!"
        style={{ maxWidth: '300px' }}
      >
        <div className="p-3!">
          <div className="flex! items-center! gap-2! mb-2!">
            <div className="w-2! h-2! rounded-full! bg-[#85409D]! animate-pulse!" />
            <span className="text-[#85409D]! font-semibold! text-sm!">AI Validation</span>
          </div>
          <div className="space-y-2!">
            {tooltipContent.map((issue, index) => (
              <div key={index} className="text-xs!">
                <div className="flex! items-start! gap-2!">
                  {getIcon(issue.severity)}
                  <div className="flex-1!">
                    <p className="text-white! font-medium!">{issue.type.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-[#999999]! mt-1!">{issue.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Tooltip>
    </>
  );
}
