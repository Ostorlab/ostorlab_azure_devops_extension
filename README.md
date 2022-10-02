# Azure DevOps Extension for Ostorlab Auto Security Test

## Marketplace URL for Installation and Download to TFS/Azure DevOps Server:
- [https://marketplace.visualstudio.com/items?itemName=Ostorlab-com.azure-ostorlab-auto-security-test]

## Development
- install node
- npm install -g tfx-cli
- cd src
- npm install

Edit task.json to update version

Edit index.ts to update business logic/params

Finally, run
```
  tsc --skipLibCheck
```


## Deploy
```
  cd src && npm install && tsc --skipLibCheck;cd .. && tfx extension create --rev-version --manifest-globs vss-extension.json
```

Then upload extension (vsix) to https://marketplace.visualstudio.com/manage/publishers/ostorlab?noPrompt=true

### Installation

See [Overview documentation](overview.md)
