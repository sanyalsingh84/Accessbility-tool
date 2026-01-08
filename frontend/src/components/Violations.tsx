import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Info,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import type {
  Violation as ApiViolation,
  Rule,
  ViolationImpact,
} from "../types/scan.types";

interface Violation {
  rule: string;
  ruleId: string;
  help: string;
  learnMoreUrl: string;
  elements: string[];
}

interface ViolationGroup {
  severity: ViolationImpact;
  count: number;
  violations: Violation[];
}

interface ViolationsProps {
  violations: ApiViolation[];
}

const Violations = ({ violations }: ViolationsProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<ViolationImpact>>(
    new Set(["serious", "critical"])
  );

  const violationGroups = useMemo(() => {
    const groups: Record<
      ViolationImpact,
      Record<string, { rule: Rule; elements: string[] }>
    > = {
      critical: {},
      serious: {},
      moderate: {},
      minor: {},
    };

    for (const violation of violations) {
      if (!groups[violation.impact][violation.rule.ruleId]) {
        groups[violation.impact][violation.rule.ruleId] = {
          rule: violation.rule,
          elements: [],
        };
      }
      groups[violation.impact][violation.rule.ruleId].elements.push(
        violation.html
      );
    }

    const result: ViolationGroup[] = (
      Object.keys(groups) as ViolationImpact[]
    ).map((impact) => {
      const ruleGroups = groups[impact];
      const groupViolations = Object.values(ruleGroups).map((rg) => ({
        rule: rg.rule.description,
        ruleId: rg.rule.ruleId,
        help: rg.rule.help,
        learnMoreUrl: rg.rule.helpUrl,
        elements: rg.elements,
      }));

      return {
        severity: impact,
        count: Object.values(ruleGroups).reduce(
          (acc, rg) => acc + rg.elements.length,
          0
        ),
        violations: groupViolations,
      };
    });

    return result.sort((a, b) => {
      const order: Record<ViolationImpact, number> = {
        critical: 4,
        serious: 3,
        moderate: 2,
        minor: 1,
      };
      return order[b.severity] - order[a.severity];
    });
  }, [violations]);

  const toggleGroup = (severity: ViolationImpact) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(severity)) {
      newExpanded.delete(severity);
    } else {
      newExpanded.add(severity);
    }
    setExpandedGroups(newExpanded);
  };

  const getSeverityColor = (severity: ViolationImpact) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white";
      case "serious":
        return "bg-orange-500 text-white";
      case "moderate":
        return "bg-yellow-500 text-white";
      case "minor":
        return "bg-blue-500 text-white";
    }
  };

  const getSeverityIcon = (severity: ViolationImpact) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-4 h-4" />;
      case "serious":
        return <AlertCircle className="w-4 h-4" />;
      case "moderate":
        return <AlertTriangle className="w-4 h-4" />;
      case "minor":
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="drop-shadow-sm bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">Accessibility Issues Found</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {violationGroups.map((group) => (
            <div
              key={group.severity}
              className="bg-gray-50 rounded-lg p-4 text-center"
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm mb-2 ${getSeverityColor(
                  group.severity
                )}`}
              >
                {getSeverityIcon(group.severity)}
                <span className="uppercase tracking-wide">
                  {group.severity}
                </span>
              </div>
              <div className="text-3xl text-gray-900">{group.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Violation List */}
      <div className="drop-shadow-sm bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {violationGroups.map((group) => (
            <div
              key={group.severity}
              className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
            >
              <button
                onClick={() => toggleGroup(group.severity)}
                className="w-full flex items-center justify-between text-left py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedGroups.has(group.severity) ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="uppercase tracking-wide text-sm text-gray-700">
                    {group.severity} Issues ({group.count})
                  </span>
                </div>
              </button>

              {expandedGroups.has(group.severity) && (
                <div className="mt-4 space-y-6 ml-8">
                  {group.violations.map((violation, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="mb-3">
                        <div className="text-gray-900 mb-1">
                          Rule: {violation.rule}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Rule ID: {violation.ruleId}
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          Help: {violation.help}
                        </div>
                        <a
                          href={violation.learnMoreUrl}
                          className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more →
                        </a>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="text-sm text-gray-700 mb-2">
                          Affected Elements ({violation.elements.length}):
                        </div>
                        <ul className="space-y-2">
                          {violation.elements.map((element, elemIdx) => (
                            <li
                              key={elemIdx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />
                              <code className="text-gray-800 bg-white px-2 py-1 rounded border border-gray-200 break-all">
                                {element}
                              </code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Violations;
