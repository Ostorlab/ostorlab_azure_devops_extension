import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import { join } from 'path';
import { getPythonPath } from './getpythonpath';
import { getOstorlabPath } from './getostorlabpath';
import { TaskResult, debug, error, getInput, loc, setResult, tool} from 'azure-pipelines-task-lib';


const YAML = require('yamljs');

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


const riskThreshold = getInput("riskThreshold", false);
debug("riskThreshold: " + riskThreshold);

const waitMinutes = getInput("waitMinutes", false);
debug("waitMinutes: " + waitMinutes);

const extra: string = getInput("extra", false);

let sbomFiles: string[] = null;
let credentials: {login : string, pass : string, role : string, url : string}[] = null;
let customCredentials: {name : string, value : string}[] = null;

if (extra != null || extra != undefined){
const extraDict = YAML.parse(extra);
  sbomFiles = extraDict["sbom"]?.toString().split(",");
  credentials = extraDict["credentials"];
  customCredentials = extraDict["custom_credentials"];
}


async function runScan(): Promise<void> {
    try {

        // Get Python 3 path
        const pyPath: string = await getPythonPath();
        debug('PYTHON PATH: ' + `${pyPath}`);

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

        const ostorlab: string = await getOstorlabPath()

        if (ostorlab != null)
        {
            const ostorlabExutable = tool(ostorlab)

            ostorlabExutable.arg("--api-key")
            ostorlabExutable.arg(apiKey!)
            ostorlabExutable.arg("ci-scan")
            ostorlabExutable.arg("run")
            if (title != null || title != undefined) {
                ostorlabExutable.arg("--title")
                ostorlabExutable.arg(title!)
            }
            ostorlabExutable.arg("--break-on-risk-rating")
            ostorlabExutable.arg(riskThreshold)
            ostorlabExutable.arg("--max-wait-minutes")
            ostorlabExutable.arg(waitMinutes)
            ostorlabExutable.arg("--scan-profile")
            if (scanProfile!= null && scanProfile == "Full Scan") {
                ostorlabExutable.arg("full_scan")
            } else {
                ostorlabExutable.arg("fast_scan")
            }

            if (sbomFiles) {
              for (let i = 0; i < sbomFiles.length; i++){
                ostorlabExutable.arg("--sbom");
                ostorlabExutable.arg(sbomFiles[i]);
              }
            }

            if (credentials) {
              for (let i = 0; i < credentials.length; i++){
                if ("login" in credentials[i] && "pass" in credentials[i]){

                  ostorlabExutable.arg("--test-credentials-login");
                  ostorlabExutable.arg(credentials[i].login);
                  ostorlabExutable.arg("--test-credentials-password");
                  ostorlabExutable.arg(credentials[i].pass);

                  if ("role" in credentials[i]){
                    ostorlabExutable.arg("--test-credentials-role");
                    ostorlabExutable.arg(credentials[i].role);
                  }

                  if ("url" in credentials[i]){
                    ostorlabExutable.arg("--test-credentials-url");
                    ostorlabExutable.arg(credentials[i].url);
                  }
                }
              }
            }

            if (customCredentials) {
              for (let i = 0; i < customCredentials.length; i++){
                if ("name" in customCredentials[i] && "value" in customCredentials[i]){
                  ostorlabExutable.arg("--test-credentials-name");
                  ostorlabExutable.arg(customCredentials[i].name);
                  ostorlabExutable.arg("--test-credentials-value");
                  ostorlabExutable.arg(customCredentials[i].value);
                }
              }
            }

            if (platform!= null && platform.toLowerCase() == "android") {
              ostorlabExutable.arg("android-apk")
            } else if (platform!= null && platform.toLowerCase() == "ios") {
                ostorlabExutable.arg("ios-ipa")
            } else {
              error("Platform not implemented.")
            }

            ostorlabExutable.arg(filePath)

            ostorlabExutable.exec().toString;
          }

    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        error(`An error was encountered, please check documentation at (https://docs.ostorlab.co) or contact support at support@ostorlab.dev: ${err.message}`);
        setResult(TaskResult.Failed, loc('taskFailed', err.message));

    }
}

runScan();
