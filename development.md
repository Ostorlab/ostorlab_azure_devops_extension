# Ostorlab Azure DevOps extension for Mobile Security Testing

Marketplace URL for Installation and Download to TFS/Azure DevOps Server:

- [https://marketplace.visualstudio.com/items?itemName=Ostorlab.ostorlab-azure-security-scanner](Link)

## Installation

To use the extension, follow documentation at [Overview documentation](README.md)

## Development

To set up environment, follow these steps:

- install node
- npm install -g tfx-cli
- cd src
- npm install

Edit `index.ts` to update business logic or params, and then run `tsc --skipLibCheck`.

## Deploy

To deploy code, run the following commands:

```
cd src
npm install
tsc --skipLibCheck
cd ..
tfx extension create --rev-version --manifest-globs vss-extension.json
```

**IMPORTANT**: update `src/task.json` version before release, then upload extension (vsix)
to https://marketplace.visualstudio.com/manage/publishers/ostorlab?noPrompt=true.


