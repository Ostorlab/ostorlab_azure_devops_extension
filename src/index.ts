import * as tl from "azure-pipelines-task-lib/task";
import fs = require("fs");
import path = require("path");

let onError = function (errMsg: string, code: number) {
  tl.error(errMsg);
  tl.setResult(tl.TaskResult.Failed, errMsg);
}

let apiKey = tl.getInput("apiKey", true);
tl.debug("apiKey: " + apiKey);

let filePath = tl.getInput("filepath", true);
tl.debug("filePath: " + filePath);

let artifactsDir = tl.getInput("artifactsDir", true);
tl.debug("artifactsDir: " + artifactsDir);

let platform = tl.getInput("platform", true);
tl.debug("platform: " + platform);

let scanProfile = tl.getInput("scanProfile", true);
tl.debug("scanProfile: " + scanProfile);

let title = tl.getInput("title", false);
tl.debug("title: " + title);

let waitForResults = tl.getInput("waitForResults", false);
tl.debug("waitForResults: " + waitForResults);

let riskThreshold = tl.getInput("riskThreshold", false);
tl.debug("riskThreshold: " + riskThreshold);

let waitMinutes = tl.getInput("waitMinutes", false);
tl.debug("waitMinutes: " + waitMinutes);

let breakBuildOnScore = tl.getInput("breakBuildOnScore", false);
tl.debug("breakBuildOnScore: " + breakBuildOnScore);

let task = JSON.parse(fs.readFileSync(path.join(__dirname, "task.json")).toString());
let version = `${task.version.Major}.${task.version.Minor}.${task.version.Patch}`

let javaPath = tl.which("java");
if (!javaPath) {
  onError("java is not found in the path", 1);
}
let java = tl.tool("java");
let nsAPI = path.join(__dirname, "ostorlab_ci.jar");

java.arg("-jar");
java.arg(nsAPI);

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