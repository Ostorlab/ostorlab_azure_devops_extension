"use strict";
/**
 * Python locater
 */
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
exports.getPythonPath = void 0;
var task_1 = require("azure-pipelines-task-lib/task");
var tool = require("azure-pipelines-tool-lib/tool");
var path = require("path");
/* Location of python3 on Microsoft hosted agents:
https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/tool/use-python-version?view=azure-devops */
function getPythonPath() {
    return __awaiter(this, void 0, void 0, function () {
        var baseDir, pythonPath, baseDir, pythonPath, baseDir, pythonPath, pythonPath, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, task_1.exist)('C:/hostedtoolcache/windows')) return [3 /*break*/, 1];
                    // Windows
                    console.log('AGENT: Extension running on a Microsoft hosted Agent.');
                    baseDir = tool.findLocalTool('python', '3.8');
                    pythonPath = path.join(baseDir, 'python.exe');
                    return [2 /*return*/, pythonPath];
                case 1:
                    if (!(0, task_1.exist)('/opt/hostedtoolcache')) return [3 /*break*/, 2];
                    // Linux
                    console.log('AGENT: Extension running on a Microsoft hosted Agent.');
                    baseDir = tool.findLocalTool('Python', '3.8');
                    pythonPath = path.join(baseDir, '/bin/python3');
                    return [2 /*return*/, pythonPath];
                case 2:
                    if (!(0, task_1.exist)('/Users/runner/hostedtoolcache')) return [3 /*break*/, 3];
                    // OS X
                    console.log('AGENT: Extension running on a Microsoft hosted Agent.');
                    baseDir = tool.findLocalTool('Python', '3.8');
                    pythonPath = path.join(baseDir, '/bin/python3');
                    return [2 /*return*/, pythonPath];
                case 3:
                    // Self-Hosted Agent
                    console.log('AGENT: Extension running on a self-hosted Agent.');
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, getSelfHostedPythonPath()];
                case 5:
                    pythonPath = _a.sent();
                    return [2 /*return*/, pythonPath];
                case 6:
                    err_1 = _a.sent();
                    return [2 /*return*/, err_1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.getPythonPath = getPythonPath;
/**
 * Function to detect the Python path on a self-hosted ADO Agent
 */
function getSelfHostedPythonPath() {
    return __awaiter(this, void 0, void 0, function () {
        var selfHostedPythonPath, pythonVer, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selfHostedPythonPath = (0, task_1.which)('python3', true);
                    if (!(selfHostedPythonPath != null)) return [3 /*break*/, 2];
                    pythonVer = (0, task_1.tool)(selfHostedPythonPath);
                    pythonVer.arg('-c');
                    pythonVer.arg('import platform; print(platform.python_version())');
                    return [4 /*yield*/, pythonVer.execSync().stdout];
                case 1:
                    result = _a.sent();
                    console.log('PYTHON VERSION: ' + "".concat(result));
                    return [3 /*break*/, 3];
                case 2: 
                // Python3 not installed
                throw new Error('Python3 installation not found.');
                case 3: return [2 /*return*/, selfHostedPythonPath];
            }
        });
    });
}
