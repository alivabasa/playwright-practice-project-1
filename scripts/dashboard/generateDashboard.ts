import fs from "node:fs";
import path from "node:path";
import { ExecutionMetrics } from "../../models/ExecutionMetrics";

// Read the metrics.json file path
const metricsFilePath = path.join(
    process.cwd(),
    "metrics",
    "metrics.json"
)

// Check if the metrics.json file exists
if (!fs.existsSync(metricsFilePath)) {
    console.error("❌ metrics.json file not found. Please run the tests first.");
    process.exit(1);
}

// Read and parse the metrics.json file
const metrics: ExecutionMetrics = JSON.parse(fs.readFileSync(metricsFilePath, "utf-8"));

// Generate the HTML content for the dashboard
const html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Playwright Execution Dashboard</title>
</head>

<body>

    <h1>Playwright Execution Dashboard</h1>

    <h2>Execution Summary</h2>

    <ul>
        <li>Total Tests: ${metrics.summary.total}</li>
        <li>Passed: ${metrics.summary.passed}</li>
        <li>Failed: ${metrics.summary.failed}</li>
        <li>Skipped: ${metrics.summary.skipped}</li>
        <li>Pass Rate: ${metrics.summary.passRate}%</li>
    </ul>

</body>

</html>
`;

// Create the dashboard directory if it doesn't exist
const dashboardFilPath = path.join(process.cwd(), "dashboard");
if (!fs.existsSync(dashboardFilPath)){
    fs.mkdirSync(dashboardFilPath, { recursive: true });
}

// Write the HTML content to the dashboard.html file
fs.writeFileSync(
    path.join(dashboardFilPath, "dashboard.html"),
    html,
    "utf-8"
);

