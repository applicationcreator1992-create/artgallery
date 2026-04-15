#!/usr/bin/env node

/**
 * LilyaArt Test Runner
 *
 * This script runs all automated tests for the LilyaArt application.
 * Usage: node tests/run-tests.js
 */

const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

// Load environment variables from .env file manually
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join("=").trim().replace(/^"(.*)"$/, "$1");
      }
    }
  });
}

// Test files to run
const testFiles = [
  "server-actions.automated.test.js",
  "inventory-update.automated.test.js",
];

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  log(`\n${"=".repeat(50)}`, "cyan");
  log(`  ${title}`, "bright");
  log(`${"=".repeat(50)}`, "cyan");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

// Run a single test file
async function runTestFile(testFile) {
  const testPath = path.join(__dirname, testFile);

  log(`\n🧪 Running ${testFile}`, "magenta");
  log("-".repeat(30), "cyan");

  try {
    // Run the test file
    const output = execSync(`node "${testPath}"`, {
      encoding: "utf8",
      stdio: "pipe",
      timeout: 30000, // 30 second timeout
    });

    console.log(output);

    // Check if the test passed (exit code 0)
    logSuccess(`${testFile} completed successfully`);
    return true;
  } catch (error) {
    // Test failed
    console.log(error.stdout);
    if (error.stderr) {
      logError(`STDERR: ${error.stderr}`);
    }

    logError(`${testFile} failed with exit code ${error.status}`);
    return false;
  }
}

// Check prerequisites
function checkPrerequisites() {
  logHeader("Checking Prerequisites");

  // Check if Node.js is available
  try {
    const nodeVersion = execSync("node --version", { encoding: "utf8" }).trim();
    logSuccess(`Node.js: ${nodeVersion}`);
  } catch (error) {
    logError("Node.js is not installed or not in PATH");
    return false;
  }

  // Check if npm is available
  try {
    const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
    logSuccess(`npm: ${npmVersion}`);
  } catch (error) {
    logError("npm is not installed or not in PATH");
    return false;
  }

  // Check if we're in the right directory
  const packageJsonPath = path.join(__dirname, "../package.json");
  if (!require("fs").existsSync(packageJsonPath)) {
    logError(
      "package.json not found. Make sure you're running this from the project root.",
    );
    return false;
  }

  logSuccess("Project structure verified");

  // Check if dependencies are installed
  try {
    execSync("npm list --depth=0", { encoding: "utf8", stdio: "pipe" });
    logSuccess("Dependencies are installed");
  } catch (error) {
    logWarning("Dependencies might not be installed. Run: npm install");
  }

  return true;
}

// Main test runner
async function runAllTests() {
  logHeader("LilyaArt Automated Test Suite");
  logInfo("Starting comprehensive test run...\n");

  // Check prerequisites
  const prerequisitesPassed = checkPrerequisites();

  if (!prerequisitesPassed) {
    logError("Prerequisites failed. Cannot continue with tests.");
    process.exit(1);
  }

  // Run all test files
  let passedTests = 0;
  let totalTests = testFiles.length;

  for (const testFile of testFiles) {
    const passed = await runTestFile(testFile);

    if (passed) {
      passedTests++;
    }

    // Add a small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Final results
  logHeader("Test Results Summary");

  log(`Total tests: ${totalTests}`, "bright");
  log(`Passed: ${passedTests}`, "green");
  log(`Failed: ${totalTests - passedTests}`, "red");
  log(
    `Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
    "bright",
  );

  if (passedTests === totalTests) {
    logSuccess("🎉 All tests passed! The application is ready for deployment.");

    log("\n📋 Next steps:", "cyan");
    log("1. Review the test output above", "blue");
    log("2. Run the code cleanup: npm run cleanup", "blue");
    log("3. Build the application: npm run build", "blue");
    log("4. Deploy to production", "blue");

    process.exit(0);
  } else {
    logError(
      `❌ ${totalTests - passedTests} test(s) failed. Please fix the issues before deployment.`,
    );

    log("\n🔧 Troubleshooting:", "cyan");
    log("1. Check the error messages above", "blue");
    log("2. Ensure environment variables are set", "blue");
    log("3. Verify Shopify API credentials", "blue");
    log("4. Restart the development server", "blue");
    log("5. Clear the .next cache if needed", "blue");

    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  logHeader("LilyaArt Test Runner Help");
  log("Usage: node tests/run-tests.js [options]", "bright");
  log("\nOptions:", "cyan");
  log("  --help, -h     Show this help message", "blue");
  log("  --list, -l     List available test files", "blue");
  log("  --version, -v  Show version information", "blue");
  process.exit(0);
}

if (args.includes("--list") || args.includes("-l")) {
  logHeader("Available Test Files");
  testFiles.forEach((file, index) => {
    log(`${index + 1}. ${file}`, "blue");
  });
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  log("LilyaArt Test Runner v1.0.0", "bright");
  log("For LilyaArt E-commerce Platform", "cyan");
  process.exit(0);
}

// Error handling
process.on("uncaughtException", (error) => {
  logError(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logError(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

// Run tests
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  runTestFile,
  checkPrerequisites,
  testFiles,
};
