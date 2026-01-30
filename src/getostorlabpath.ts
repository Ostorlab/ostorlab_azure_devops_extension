import {exist, tool as tool_1, which} from "azure-pipelines-task-lib";
import * as tool from "azure-pipelines-tool-lib";
import * as path from 'path';
import * as trm from "azure-pipelines-task-lib/toolrunner";

/**
 * Try to find Python in the tool cache with version fallback
 * Tries versions in order: 3.12 (default), 3.11, 3.10
 */
function findPythonInToolCache(toolName: string): string | undefined {
    const versions = ['3.12', '3.11', '3.10'];
    
    for (const version of versions) {
        console.log(`Attempting to locate Python ${version}...`);
        const baseDir = tool.findLocalTool(toolName, version);
        if (baseDir !== undefined && baseDir !== null && baseDir !== '') {
            console.log(`Found Python ${version} at: ${baseDir}`);
            return baseDir;
        }
    }
    
    return undefined;
}

export async function getOstorlabPath(): Promise<string> {

    if (exist('C:/hostedtoolcache/windows')) {
        // Windows
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string | undefined = findPythonInToolCache('python');
        
        if (baseDir === undefined || baseDir === null || baseDir === '') {
            throw new Error('Python 3.10, 3.11, or 3.12 not found in tool cache. Please add UsePythonVersion@0 task to your pipeline before this task.');
        }
        
        const binDir = path.join(baseDir, 'Scripts/ostorlab');
        return binDir;

    } else if (exist('/opt/hostedtoolcache')) {
        // Linux
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string | undefined = findPythonInToolCache('Python');
        
        if (!baseDir || baseDir === '') {
            throw new Error('Python 3.10, 3.11, or 3.12 not found in tool cache. Please add UsePythonVersion@0 task to your pipeline before this task.');
        }
        
        const binDir = path.join(baseDir, 'bin/ostorlab');
        return binDir;

    } else if (exist('/Users/runner/hostedtoolcache')) {
        // OS X
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string | undefined = findPythonInToolCache('Python');
        
        if (baseDir === undefined || baseDir === null || baseDir === '') {
            throw new Error('Python 3.10, 3.11, or 3.12 not found in tool cache. Please add UsePythonVersion@0 task to your pipeline before this task.');
        }
        
        const binDir = path.join(baseDir, 'bin/ostorlab');
        return binDir;

    } else {
        // Self-Hosted Agent
         console.log('AGENT: Extension running on a self-hosted Agent.');
        try {
            const ostorlabPath: string = await getSelfHostedOstorlabPath();

            return ostorlabPath;

        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any

            return err;
        }

    }
}

/**
 * Function to detect the ostorlab path on a self-hosted ADO Agent
 */
async function getSelfHostedOstorlabPath(): Promise<string> {

    const selfHostedOstorlabPath: string = which('ostorlab', true);

    if (selfHostedOstorlabPath != null) {
        const pythonVer: trm.ToolRunner = tool_1(selfHostedOstorlabPath);
        pythonVer.arg('--version');
        const result: string = await pythonVer.execSync().stdout;
        console.log('OSTORLAB VERSION: ' + `${result}`);

    } else {
        // Python3 not installed
        throw new Error('ostorlab installation not found.');
    }

    return selfHostedOstorlabPath;

}
