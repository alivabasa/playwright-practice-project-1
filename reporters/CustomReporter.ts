import type {
    Reporter,
    FullConfig,
    Suite,
    TestCase,
    TestResult,
    FullResult,
  } from '@playwright/test/reporter';
  
class CustomReporter implements Reporter {
  
    private results: { name: string; status: string; duration: number }[] = [];
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
      this.results.push({
        name:     test.title,
        status:   status,
        duration: duration,
      });
    }
  
    // Event 3 — everything is done
    onEnd(result: FullResult): void {
      const total    = this.results.length;
      const passed   = this.results.filter(r => r.status === 'passed').length;
      const failed   = this.results.filter(r => r.status === 'failed').length;
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
  
      console.log(`\n${'─'.repeat(40)}`);
      console.log(`Results: ${passed}/${total} passed | ${failed} failed | ${duration}s`);
  
      if (failed > 0) {
        console.log(`\nFailed tests:`);
        this.results
          .filter(r => r.status === 'failed')
          .forEach(r => console.log(`  • ${r.name}`));
      }
    }
  }

  export default CustomReporter;