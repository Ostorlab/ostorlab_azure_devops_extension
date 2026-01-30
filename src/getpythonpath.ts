/**
 * Python locater
 */

import { exist, which, tool as tool_1 } from 'azure-pipelines-task-lib/task';
import * as trm from 'azure-pipelines-task-lib/toolrunner';
import * as tool from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';

/* Location of python3 on Microsoft hosted agents:
https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/tool/use-python-version?view=azure-devops */

/**
 * Try to find Python in the tool cache with version fallback
 * Tries versions in order: 3.12 (default), 3.11, 3.10
 */
function findPythonInToolCache(toolName: string): string | undefined {
    const versions = ['3.12', '3.11', '3.10'];
    
    for (const version of versions) {
        console.log(`Attempting to locate Python ${version}...`);
        const baseDir = tool.findLocalTool(toolName, version);
        if (baseDir) {
            console.log(`Found Python ${version} at: ${baseDir}`);
            return baseDir;
        }
    }
    
    return undefined;
}

export async function getPythonPath(): Promise<string> {

    if (exist('C:/hostedtoolcache/windows')) {
        // Windows
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string | undefined = findPythonInToolCache('python');
        
        if (baseDir === undefined || baseDir === null || baseDir === '') {
            throw new Error('Python 3.10, 3.11, or 3.12 not found in tool cache. Please add UsePythonVersion@0 task to your pipeline before this task.');
        }
        
        const pythonPath: string = path.join(baseDir, 'python.exe');
        return pythonPath;

    } else if (exist('/opt/hostedtoolcache')) {
        // Linux
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string | undefined = findPythonInToolCache('Python');
        
        if (!baseDir || baseDir === '') {
            throw new Error('Python 3.10, 3.11, or 3.12 not found in tool cache. Please add UsePythonVersion@0 task to your pipeline before this task.');
        }
        
        const pythonPath: string = path.join(baseDir, '/bin/python3');
        return pythonPath;

    } else if (exist('/Users/runner/hostedtoolcache')) {
        // OS X
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string | undefined = findPythonInToolCache('Python');
        
        if (baseDir === undefined || baseDir === null || baseDir === '') {
            throw new Error('Python 3.10, 3.11, or 3.12 not found in tool cache. Please add UsePythonVersion@0 task to your pipeline before this task.');
        }
        
        const pythonPath: string = path.join(baseDir, '/bin/python3');
        return pythonPath;

    } else {
        // Self-Hosted Agent
        console.log('AGENT: Extension running on a self-hosted Agent.');
        try {
            const pythonPath: string = await getSelfHostedPythonPath();

            return pythonPath;

        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any

            return err;
        }

    }
}

/**
 * Function to detect the Python path on a self-hosted ADO Agent
 */
async function getSelfHostedPythonPath(): Promise<string> {
    const versions = ['python3.12', 'python3.11', 'python3.10', 'python3'];
    
    for (const pythonCmd of versions) {
        try {
            const selfHostedPythonPath: string = which(pythonCmd, false);
            
            if (selfHostedPythonPath) {
                const pythonVer: trm.ToolRunner = tool_1(selfHostedPythonPath);
                pythonVer.arg('-c');
                pythonVer.arg('import platform; print(platform.python_version())');
                // https://github.com/microsoft/azure-pipelines-task-lib/blob/master/node/docs/azure-pipelines-task-lib.md
                const result: string = await pythonVer.execSync().stdout;
                console.log('PYTHON VERSION: ' + `${result}`);
                return selfHostedPythonPath;
            }
        } catch (err) {
            // Continue to next version
            continue;
        }
    }
    
    throw new Error('Python 3.10, 3.11, or 3.12 not found. Please install Python 3.10 or higher.');
}


