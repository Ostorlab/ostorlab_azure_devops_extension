import * as tl from "azure-pipelines-task-lib/task";
import fs = require("fs");
import path = require("path");
import YAML from 'yaml';

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

const extra: string = tl.getInput("extra", false);

let sbomFiles: string[] = null;
let credentials: {login : string, pass : string, role : string, url : string}[] = null;
let customCredentials: {name : string, value : string}[] = null;

if (extra != null && extra != undefined){
const extra_dict = YAML.parse(extra);
  sbomFiles = extra_dict["sbom"];
  credentials = extra_dict["credentials"];
  customCredentials = extra_dict["custom_credentials"];
}

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

if (sbomFiles) {
  for (let i = 0; i < sbomFiles.length; i++){
    java.arg("--sbom");
    java.arg(sbomFiles[i]);
  }
}

if (credentials) {
  for (let i = 0; i < credentials.length; i++){
    if ("login" in credentials[i] && "pass" in credentials[i]){

      java.arg("--test-credentials-login");
      java.arg(credentials[i].login);
      java.arg("--test-credentials-pass");
      java.arg(credentials[i].pass);

      if ("role" in credentials[i]){
        java.arg("--test-credentials-role");
        java.arg(credentials[i].role);
      }

      if ("url" in credentials[i]){
        java.arg("--test-credentials-url");
        java.arg(credentials[i].url);
      }
    }
  }
}

if (customCredentials) {
  for (let i = 0; i < customCredentials.length; i++){
    if ("name" in customCredentials[i] && "value" in customCredentials[i]){
      java.arg("--test-credentials-name");
      java.arg(customCredentials[i].name);
      java.arg("--test-credentials-value");
      java.arg(customCredentials[i].value);
    }
  }
}


java.on("stdout", function (data: Buffer) {
  const dataValue = data.toString()

  console.log(`STDOUT: ${dataValue}`)

  if (dataValue.includes('createMobileScan') === true) {
    const scanId = JSON.parse(dataValue).data?.createMobileScan?.scan?.id
    console.log(`Scan ${scanId} is created successfully.`)
    if (scanId !== undefined && scanId !== null) {
      console.log(`##vso[task.setvariable variable=OstorlabScanId]${scanId}`)
    }
  }

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
