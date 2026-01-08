import puppeteer from "puppeteer";
import axe, {
  type AxeResults,
  type Result as AxeResult,
  type NodeResult,
} from "axe-core";
import { ScanModel } from "../models/Scan.js";
import { RuleModel } from "../models/Rule.js";
import { ViolationModel } from "../models/Violation.js";

// A mapping from axe-core severity to a numeric value for scoring
const severityValue: Record<NonNullable<AxeResult["impact"]>, number> = {
  minor: 1,
  moderate: 3,
  serious: 5,
  critical: 8,
};

const computeScore = (violations: AxeResult[]) => {
  const totalImpact = violations.reduce((acc, violation) => {
    const impact = violation.impact;
    if (impact && severityValue[impact]) {
      // Multiply by the number of nodes affected
      return acc + severityValue[impact] * violation.nodes.length;
    }
    return acc;
  }, 0);

  // Score is out of 100. The higher the impact, the lower the score.
  // This is a simple scoring algorithm and can be adjusted.
  return Math.max(0, 100 - totalImpact);
};

export const executeScan = async (scanId: string) => {
  console.log(`[Worker] Starting scan for ID: ${scanId}`);
  const scan = await ScanModel.findById(scanId);

  if (!scan) {
    console.error(`[Worker] Scan not found for ID: ${scanId}`);
    return;
  }

  if (scan.status !== "queued") {
    console.warn(`[Worker] Scan ${scanId} already processed`);
    return;
  }
  // 1. Mark scan as running
  scan.status = "running";
  await scan.save();

  let browser;
  try {
    // 2. Open the site in a browser (Puppeteer)
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto(scan.url, {
      waitUntil: "networkidle2",
      timeout: 30_000,
    });

    // Inject axe-core into the page
    await page.addScriptTag({ content: axe.source });

    // 3. Run axe-core
    const axeResults: AxeResults = await page.evaluate(async () => {
      // @ts-ignore
      return await axe.run(document);
    });

    // 4. Map axe rules to your Rule collection
    const allRules = await RuleModel.find({}).lean();
    const ruleMap = new Map(allRules.map((rule) => [rule.ruleId, rule._id]));
    const missingRuleIds = new Set<string>();

    // 5. Save Violations
    if (axeResults.violations.length > 0) {
      const violationDocs = axeResults.violations.flatMap((v: AxeResult) => {
        const ruleObjectId = ruleMap.get(v.id);

        if (!ruleObjectId) {
          // Log missing rule once
          if (!missingRuleIds.has(v.id)) {
            missingRuleIds.add(v.id);
            console.warn(
              `[Worker] Missing rule definition for axe rule: "${v.id}". ` +
                `Consider seeding this rule.`
            );
          }
          return [];
        }

        if (!v.impact) return [];

        return v.nodes.map((node: NodeResult) => ({
          scan: scan._id,
          rule: ruleObjectId,
          impact: v.impact,
          html: node.html,
        }));
      });
      if (violationDocs.length > 0) {
        await ViolationModel.insertMany(violationDocs);
      }
    }

    // 6. Compute score
    scan.score = computeScore(axeResults.violations);

    if (missingRuleIds.size > 0) {
      console.warn(
        `[Worker] Scan ${scanId} completed with ${missingRuleIds.size} ` +
          `unrecognized rule(s):`,
        Array.from(missingRuleIds)
      );
    }

    // 7. Mark scan as completed
    scan.status = "completed";
    console.log(`[Worker] Scan completed for ID: ${scanId}`);
  } catch (error: any) {
    // 7. Mark scan as failed
    scan.status = "failed";
    if (error instanceof Error) {
      scan.error = error.message;
    } else {
      scan.error = "An unknown error occurred during the scan.";
    }
    console.error(`[Worker] Scan failed for ID: ${scanId}`, error);
  } finally {
    if (browser) {
      await browser.close();
    }
    scan.completedAt = new Date();
    await scan.save();
    console.log(`[Worker] Finished processing for scan ID: ${scanId}`);
  }
};
