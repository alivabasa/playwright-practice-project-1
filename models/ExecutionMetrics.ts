import { Summary } from "./Summary";
import { TestMetric } from "./TestMetric";

export interface ExecutionMetrics {
  execution: {
    timestamp: string;
    environment: string;
    browser: string;
    duration: number;
  };

  summary: Summary;

  tests: TestMetric[];
}