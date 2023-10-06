import {exist, tool as tool_1, which} from "azure-pipelines-task-lib";
import * as tool from "azure-pipelines-tool-lib";
import * as path from 'path';
import * as trm from "azure-pipelines-task-lib/toolrunner";

export async function getOstorlabPath(): Promise<string> {

    if (exist('C:/hostedtoolcache/windows')) {
        // Windows
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string = tool.findLocalTool('python', '3.9');
        const binDir = path.join(baseDir, 'Scripts/ostorlab');
        return binDir;

    } else if (exist('/opt/hostedtoolcache')) {
        // Linux
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string = tool.findLocalTool('Python', '3.9');
        const binDir = path.join(baseDir, 'bin/ostorlab');
        return binDir;

    } else if (exist('/Users/runner/hostedtoolcache')) {
        // OS X
        console.log('AGENT: Extension running on a Microsoft hosted Agent.');
        const baseDir: string = tool.findLocalTool('Python', '3.9');
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
