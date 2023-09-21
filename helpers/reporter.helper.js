const _ = require("lodash");

const TEST_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  SKIPPED: "SKIPPED",
};

class JestCustomReporter {
  onRunComplete(test, results) {
    const { testResults } = results;

    const allTests = [];

    for (const suite of testResults) {
      for (const test of suite.testResults) {
        let status = "";

        switch (test.status) {
          case "passed":
            status = TEST_STATUS.SUCCESS;
            break;
          case "failed":
            status = TEST_STATUS.FAILED;
            break;
          case "pending":
            status = TEST_STATUS.SKIPPED;
            break;
        }

        allTests.push({
          suiteTitle: test.ancestorTitles[0],
          testTitle: test.title,
          status,
        });
      }
    }

    const groupedBySuite = _.groupBy(
      _.orderBy(allTests, ["suiteTitle", "testTitle"], ["asc", "asc"]),
      "suiteTitle"
    );

    for (const suiteTitle of Object.keys(groupedBySuite)) {
      console.log(suiteTitle);

      for (const test of groupedBySuite[suiteTitle]) {
        let testStatus = "";

        if (test.status === TEST_STATUS.SUCCESS) {
          testStatus = "🟢";
        } else if (test.status === TEST_STATUS.FAILED) {
          testStatus = "🔴";
        } else if (test.status === TEST_STATUS.SKIPPED) {
          testStatus = "🟠";
        }

        console.log(`\t${testStatus} ${test.testTitle}`);
      }
    }

    process.exit();
  }
}

module.exports = JestCustomReporter;
