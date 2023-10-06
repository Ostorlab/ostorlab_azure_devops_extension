/**
 * Python locater
 */

import { exist, which, tool as tool_1 } from 'azure-pipelines-task-lib/task';
import * as trm from 'azure-pipelines-task-lib/toolrunner';
import * as tool from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';

/* Location of python3 on Microsoft hosted agents:
https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/tool/use-python-version?view=azure-devops */

export async function getPythonPath(): Promise<string> {

    if (exist('C:/hostedtoolcache/windows')) {
        // Windows
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string = tool.findLocalTool('python', '3.9');
        const pythonPath: string = path.join(baseDir, 'python.exe');

        return pythonPath;

    } else if (exist('/opt/hostedtoolcache')) {
        // Linux
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string = tool.findLocalTool('Python', '3.9');
        const pythonPath: string = path.join(baseDir, '/bin/python3');

        return pythonPath;

    } else if (exist('/Users/runner/hostedtoolcache')) {
        // OS X
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string = tool.findLocalTool('Python', '3.9');
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

    const selfHostedPythonPath: string = which('python3.9', true);

    if (selfHostedPythonPath != null) {
        const pythonVer: trm.ToolRunner = tool_1(selfHostedPythonPath);
        pythonVer.arg('-c');
        pythonVer.arg('import platform; print(platform.python_version())');
        // https://github.com/microsoft/azure-pipelines-task-lib/blob/master/node/docs/azure-pipelines-task-lib.md
        const result: string = await pythonVer.execSync().stdout;
        console.log('PYTHON VERSION: ' + `${result}`);

    } else {
        // Python3 not installed
        throw new Error('Python3.9 installation not found.');
    }

    return selfHostedPythonPath;

}


