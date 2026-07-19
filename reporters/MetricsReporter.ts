import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';
import fs from "node:fs";
import path from "node:path";

import { ExecutionMetrics } from "../models/ExecutionMetrics";
import { TestMetric } from "../models/TestMetric";

class MetricsReporter implements Reporter {

  // private results: { name: string; status: string; duration: number }[] = [];
  private tests: TestMetric[] = [];
  private startTime: number = 0;

  // Event 1 — the whole suite is about to begin
  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    console.log(`\n🚀 Starting ${suite.allTests().length} tests...\n`);
  }

  // Event 2 — one test just finished (pass, fail, or skip)
  onTestEnd(test: TestCase, result: TestResult): void {
    const status = result.status;
    const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏭️';
    const duration = result.duration;

    console.log(`${icon} ${test.title} — ${duration}ms`);

    // store for the summary
    this.tests.push({
      title: test.title,
      file: test.location.file,
      status: status,
      duration: duration,
    });
  }

  // Event 3 — everything is done
  onEnd(result: FullResult): void {
    const total = this.tests.length;
    const passed = this.tests.filter(r => r.status === 'passed').length;
    const failed = this.tests.filter(r => r.status === 'failed').length;
    const skipped = this.tests.filter(r => r.status === "skipped").length;
    const passRate = total === 0 ? 0 : Number(((passed / total) * 100).toFixed(2));
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    console.log(`\n${'─'.repeat(40)}`);
    console.log(`Results: ${passed}/${total} passed | ${failed} failed | ${duration}s`);

    if (failed > 0) {
      console.log(`\nFailed tests:`);
      this.tests
        .filter(r => r.status === 'failed')
        .forEach(r => console.log(`  • ${r.title}`));
    }
    const metrics: ExecutionMetrics = {

      execution: {
        timestamp: new Date().toISOString(),
        environment: "QA",
        browser: "chromium",
        duration: Date.now() - this.startTime,
      },
      summary: {
        total,
        passed,
        failed,
        skipped,
        passRate,
      },

      tests: this.tests,

    };
    const metricsDir = path.join(process.cwd(), "metrics");
    if (!fs.existsSync(metricsDir)) {
      fs.mkdirSync(metricsDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(metricsDir, "metrics.json"),
      JSON.stringify(metrics, null, 2)
    );
  }

}

export default MetricsReporter;