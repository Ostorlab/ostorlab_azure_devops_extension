"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var getpythonpath_1 = require("./getpythonpath");
var azure_pipelines_task_lib_1 = require("azure-pipelines-task-lib");
var apiKey = (0, azure_pipelines_task_lib_1.getInput)("apiKey", true);
(0, azure_pipelines_task_lib_1.debug)("apiKey: " + apiKey);
var filePath = (0, azure_pipelines_task_lib_1.getInput)("filepath", true);
(0, azure_pipelines_task_lib_1.debug)("filePath: " + filePath);
var artifactsDir = (0, azure_pipelines_task_lib_1.getInput)("artifactsDir", true);
(0, azure_pipelines_task_lib_1.debug)("artifactsDir: " + artifactsDir);
var platform = (0, azure_pipelines_task_lib_1.getInput)("platform", true);
(0, azure_pipelines_task_lib_1.debug)("platform: " + platform);
var scanProfile = (0, azure_pipelines_task_lib_1.getInput)("scanProfile", true);
(0, azure_pipelines_task_lib_1.debug)("scanProfile: " + scanProfile);
var title = (0, azure_pipelines_task_lib_1.getInput)("title", false);
(0, azure_pipelines_task_lib_1.debug)("title: " + title);
var waitForResults = (0, azure_pipelines_task_lib_1.getBoolInput)("waitForResults", false);
(0, azure_pipelines_task_lib_1.debug)("waitForResults: " + waitForResults);
var riskThreshold = (0, azure_pipelines_task_lib_1.getInput)("riskThreshold", false);
(0, azure_pipelines_task_lib_1.debug)("riskThreshold: " + riskThreshold);
var waitMinutes = (0, azure_pipelines_task_lib_1.getInput)("waitMinutes", false);
(0, azure_pipelines_task_lib_1.debug)("waitMinutes: " + waitMinutes);
var breakBuildOnScore = (0, azure_pipelines_task_lib_1.getBoolInput)("breakBuildOnScore", false);
(0, azure_pipelines_task_lib_1.debug)("breakBuildOnScore: " + breakBuildOnScore);
function run_scan() {
    return __awaiter(this, void 0, void 0, function () {
        var pyPath, packageSetup, err_1, ostorlabPath, ostorlabExutable, result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, (0, getpythonpath_1.getPythonPath)()];
                case 1:
                    pyPath = _a.sent();
                    console.log('PYTHON PATH: ' + "".concat(pyPath));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    packageSetup = (0, azure_pipelines_task_lib_1.tool)(pyPath);
                    packageSetup.arg('-m');
                    packageSetup.arg('pip');
                    packageSetup.arg('install');
                    packageSetup.arg('-r');
                    packageSetup.arg((0, path_1.join)(__dirname, 'requirements.txt'));
                    return [4 /*yield*/, packageSetup.exec()];
                case 3:
                    _a.sent();
                    (0, azure_pipelines_task_lib_1.setResult)(azure_pipelines_task_lib_1.TaskResult.Succeeded, 'python setup was successful.');
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    return [2 /*return*/, (0, azure_pipelines_task_lib_1.setResult)(azure_pipelines_task_lib_1.TaskResult.Failed, 'python setup failed.')];
                case 5:
                    ostorlabPath = (0, azure_pipelines_task_lib_1.which)('ostorlab', true);
                    if (!(ostorlabPath != null)) return [3 /*break*/, 7];
                    ostorlabExutable = (0, azure_pipelines_task_lib_1.tool)(ostorlabPath);
                    ostorlabExutable.arg("--api-key");
                    ostorlabExutable.arg(apiKey);
                    ostorlabExutable.arg("ci-scan");
                    ostorlabExutable.arg("run");
                    ostorlabExutable.arg("--title");
                    ostorlabExutable.arg(title);
                    if (breakBuildOnScore === true) {
                        ostorlabExutable.arg("--break-on-risk-rating");
                        ostorlabExutable.arg(riskThreshold);
                    }
                    ostorlabExutable.arg("--max-wait-minutes");
                    ostorlabExutable.arg(waitMinutes);
                    ostorlabExutable.arg("--scan-profile");
                    if (scanProfile != null && scanProfile == "Full Scan") {
                        ostorlabExutable.arg("full_scan");
                    }
                    else {
                        ostorlabExutable.arg("full_scan");
                    }
                    if (platform != null && platform.toLowerCase() == "android") {
                        ostorlabExutable.arg("android-apk");
                    }
                    else {
                        ostorlabExutable.arg("ios-ipa");
                    }
                    ostorlabExutable.arg(filePath);
                    return [4 /*yield*/, ostorlabExutable.execSync().stdout];
                case 6:
                    result = _a.sent();
                    console.log('Scan ID: ' + "".concat(result));
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    (0, azure_pipelines_task_lib_1.error)(err_2.message);
                    (0, azure_pipelines_task_lib_1.setResult)(azure_pipelines_task_lib_1.TaskResult.Failed, (0, azure_pipelines_task_lib_1.loc)('taskFailed', err_2.message));
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
run_scan();
