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

// ==============================
// Generate Test Rows
// ==============================

const testRows = metrics.tests
    .map(
        (test) => `
<tr>
    <td>${test.title}</td>
    <td>${test.status}</td>
    <td>${(test.duration/1000).toFixed(2)} sec</td>
</tr>
`
    )
    .join("");

const summaryCards = `
    <div class="summary">
    
        <div class="card">
            <h3>Total</h3>
            <p>${metrics.summary.total}</p>
        </div>
    
        <div class="card">
            <h3>Passed</h3>
            <p>${metrics.summary.passed}</p>
        </div>
    
        <div class="card">
            <h3>Failed</h3>
            <p>${metrics.summary.failed}</p>
        </div>
    
        <div class="card">
            <h3>Skipped</h3>
            <p>${metrics.summary.skipped}</p>
        </div>
    
        <div class="card">
            <h3>Pass Rate</h3>
            <p>${metrics.summary.passRate}%</p>
        </div>
    
    </div>
    `;

// ==============================
// Execution Details
// ==============================

const executionDetails = `
    <h2>Execution Details</h2>
    
    <table>
    
    <tr>
        <td><strong>Environment</strong></td>
        <td>${metrics.execution.environment}</td>
    </tr>
    
    <tr>
        <td><strong>Browser</strong></td>
        <td>${metrics.execution.browser}</td>
    </tr>
    
    <tr>
        <td><strong>Duration</strong></td>
        <td>${(metrics.execution.duration / 1000).toFixed(2)} sec</td>
    </tr>
    
    <tr>
        <td><strong>Executed At</strong></td>
        <td>${new Date(metrics.execution.timestamp).toLocaleString()}</td>
    </tr>
    
    </table>
    `;

// ==============================
// Test Results
// ==============================

const testResults = `
    <h2>Test Results</h2>
    
    <table>
    
    <thead>
    <tr>
        <th>Test Name</th>
        <th>Status</th>
        <th>Duration</th>
    </tr>
    </thead>
    
    <tbody>
    ${testRows}
    </tbody>
    
    </table>
    `;

// ==============================
// Complete HTML
// ==============================

const html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Playwright Execution Dashboard</title>
    
<style>
.container{

max-width:1300px;

margin:auto;

}

body{
    font-family:Arial,Helvetica,sans-serif;
    background:#F3F6FA;
    margin:0;
    padding:40px;
}

h1{
    text-align:center;
    margin-bottom:50px;
    color:#1F2937;

}

h2{
    margin-top:40px;
}
.summary{
    display:flex;
    gap:20px;
    justify-content:center;
    margin-bottom:40px;
}
.card{
    background:white;
    width:160px;
    padding:20px;
    text-align:center;
    border-radius:10px;
    box-shadow:0 2px 6px rgba(0,0,0,.15);

    transition:all .25s ease;
}

.card:hover{
    transform:translateY(-4px);
}

.card h3{
    margin-top:0;
}

.card p{
    font-size:42px;
    font-weight:bold;
    margin-top:20px;
    color:#1565C0;
}
table{
    width:100%;
    border-collapse:collapse;
    background:white;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 2px 8px rgba(0,0,0,.1);
    margin-top:15px;
}

th,
td{
    padding:12px;
    border-bottom:1px solid #eee;
}
tbody tr:nth-child(even){
    background:#f8f8f8;
}
th{
   background:#1565C0;
    color:white;
    padding:14px;
}
</style>
</head>

<body>

<div class="container">

    <h1>Playwright Execution Dashboard</h1>

    <h2>Execution Summary</h2>

    ${summaryCards}

    ${executionDetails}

    ${testResults}

</div>
</body>


</html>
`;

// ==============================
// Create dashboard folder
// ==============================
const dashboardFilPath = path.join(process.cwd(), "dashboard");
if (!fs.existsSync(dashboardFilPath)) {
    fs.mkdirSync(dashboardFilPath, { recursive: true });
}

// ==============================
// Write dashboard.html
// ==============================
fs.writeFileSync(
    path.join(dashboardFilPath, "dashboard.html"),
    html,
    "utf-8"
);


