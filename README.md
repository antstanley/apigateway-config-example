# API Gateway example

This repo is to show how Pulumi does not handle Google's [Long-running operations](https://github.com/googleapis/gax-nodejs/blob/main/client-libraries.md#long-running-operations)

### Setup

Clone repo and run `npm run install`.

### Run Pulumi Script

Install and configure Pulumi for use with Google Cloud

```sh
npm run deploy:pulumi
```

or

```
pulumi up
```

### Run script

Install and configure the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

Runs TypeScript script that calls

```sh
npm run deploy:script
```
