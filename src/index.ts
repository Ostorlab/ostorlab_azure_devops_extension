import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import { join } from 'path';
import { getPythonPath } from './getpythonpath';
import { TaskResult, debug, error, getBoolInput, getInput, loc, setResult, tool, which} from 'azure-pipelines-task-lib';


const apiKey = getInput("apiKey", true);
debug("apiKey: " + apiKey);

const filePath = getInput("filepath", true);
debug("filePath: " + filePath);

const platform = getInput("platform", true);
debug("platform: " + platform);

const scanProfile = getInput("scanProfile", true);
debug("scanProfile: " + scanProfile);

const title = getInput("title", false);
debug("title: " + title);

const waitForResults = getBoolInput("waitForResults", false);
debug("waitForResults: " + waitForResults);

const riskThreshold = getInput("riskThreshold", false);
debug("riskThreshold: " + riskThreshold);

const waitMinutes = getInput("waitMinutes", false);
debug("waitMinutes: " + waitMinutes);


async function run_scan(): Promise<void> {
    try {

        // Get Python 3 path
        const pyPath: string = await getPythonPath();
        console.log('PYTHON PATH: ' + `${pyPath}`);

        try {
            const packageSetup: ToolRunner = tool(pyPath);
            packageSetup.arg('-m');
            packageSetup.arg('pip');
            packageSetup.arg('install');
            packageSetup.arg('-r');
            packageSetup.arg(join(__dirname, 'requirements.txt'));
            await packageSetup.exec();
            setResult(TaskResult.Succeeded, 'python setup was successful.');

        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any

            return setResult(TaskResult.Failed, 'python setup failed.');
        }

        const ostorlabPath: string = which('ostorlab', true);

        if (ostorlabPath != null)
        {
            const ostorlabExutable = tool(ostorlabPath)

            ostorlabExutable.arg("--api-key")
            ostorlabExutable.arg(apiKey!)
            ostorlabExutable.arg("ci-scan")
            ostorlabExutable.arg("run")
            ostorlabExutable.arg("--title")
            ostorlabExutable.arg(title!)
            ostorlabExutable.arg("--break-on-risk-rating")
            ostorlabExutable.arg(riskThreshold)
            ostorlabExutable.arg("--max-wait-minutes")
            ostorlabExutable.arg(waitMinutes)
            ostorlabExutable.arg("--scan-profile")
            if (scanProfile!= null && scanProfile == "Full Scan") {
                ostorlabExutable.arg("full_scan")
            } else {
                ostorlabExutable.arg("full_scan")
            }

            if (platform!= null && platform.toLowerCase() == "android") {
                ostorlabExutable.arg("android-apk")
            } else {
                ostorlabExutable.arg("ios-ipa")
            }

            ostorlabExutable.arg(filePath)

            const result: string = await ostorlabExutable.execSync().stdout;
            console.log('Scan ID: ' + `${result}`);
        }

    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        error(err.message);
        setResult(TaskResult.Failed, loc('taskFailed', err.message));

    }
}

run_scan();