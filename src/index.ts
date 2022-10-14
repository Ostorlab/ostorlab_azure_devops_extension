import * as tl from "azure-pipelines-task-lib/task";
import fs = require("fs");
import path = require("path");

const onError = function (errMsg: string, code: number) {
  tl.error(errMsg);
  tl.setResult(tl.TaskResult.Failed, errMsg);
}

const apiKey = tl.getInput("apiKey", true);
tl.debug("apiKey: " + apiKey);

const filePath = tl.getInput("filepath", true);
tl.debug("filePath: " + filePath);

const artifactsDir = tl.getInput("artifactsDir", true);
tl.debug("artifactsDir: " + artifactsDir);

const platform = tl.getInput("platform", true);
tl.debug("platform: " + platform);

const scanProfile = tl.getInput("scanProfile", true);
tl.debug("scanProfile: " + scanProfile);

const title = tl.getInput("title", false);
tl.debug("title: " + title);

const waitForResults = tl.getBoolInput("waitForResults", false);
tl.debug("waitForResults: " + waitForResults);

const riskThreshold = tl.getInput("riskThreshold", false);
tl.debug("riskThreshold: " + riskThreshold);

const waitMinutes = tl.getInput("waitMinutes", false);
tl.debug("waitMinutes: " + waitMinutes);

const breakBuildOnScore = tl.getBoolInput("breakBuildOnScore", false);
tl.debug("breakBuildOnScore: " + breakBuildOnScore);

const task = JSON.parse(fs.readFileSync(path.join(__dirname, "task.json")).toString());
const version = `${task.version.Major}.${task.version.Minor}.${task.version.Patch}`

const javaPath = tl.which("java");
if (!javaPath) {
  onError("java is not found in the path", 1);
}
const java = tl.tool("java");
const binOstorlab = path.join(__dirname, "ostorlab_ci.jar");

java.arg("-jar");
java.arg(binOstorlab);

java.arg("--api-key");
java.arg(apiKey);

java.arg("--file-path");
java.arg(filePath);

java.arg("--artifacts-dir");
java.arg(artifactsDir);

java.arg("--scan-profile");
java.arg(scanProfile);

java.arg("--platform");
java.arg(platform);

if (title) {
  java.arg("--title");
  java.arg(title);
}

if (waitForResults) {
  java.arg("--waitForResults");
  java.arg("--auto-wait");
  java.arg(waitMinutes);
}


if (breakBuildOnScore) {
  java.arg("--breakBuildOnScore");
  java.arg("--riskThreshold");
  java.arg(riskThreshold);
}

if (process.env.SYSTEM_DEBUG) {
  java.arg("--debug");
}

java.on("stdout", function (data: Buffer) {
  console.log(data.toString());
});

console.log(java);

//////////////////////////////////////////////////////////////////////////
// Starting Java app to process the app for preflight and assessment
// based on above config.
//////////////////////////////////////////////////////////////////////////
java.exec()
  .then(function (code: number) {
    tl.debug("code: " + code);
    if (code != 0) {
      onError("Error occurred:", code);
    }
  })
  .fail(function (err: Error) {
    onError("Error occurred: [" + err.toString() + "]", 1);
  });