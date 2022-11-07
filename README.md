# Ostorlab Azure DevOps extension for mobile security testing 

## Marketplace URL for Installation and Download to TFS/Azure DevOps Server:
- [https://marketplace.visualstudio.com/items?itemName=Ostorlab.ostorlab-azure-security-scanner]

## Development
- install node
- npm install -g tfx-cli
- cd src
- npm install

Edit index.ts to update business logic/params

Finally, run
```
  tsc --skipLibCheck
```


## Deploy
```
  cd src && npm install && tsc --skipLibCheck;cd .. && tfx extension create --rev-version --manifest-globs vss-extension.json
```

IMPORTANT!! update src/task.json version

Then upload extension (vsix) to https://marketplace.visualstudio.com/manage/publishers/ostorlab?noPrompt=true

### Installation

See [Overview documentation](overview.md)
