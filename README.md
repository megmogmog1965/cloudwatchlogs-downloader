# cloudwatchlogs-downloader

![DownloadLogs pane](https://raw.githubusercontent.com/megmogmog1965/cloudwatchlogs-downloader/feature/demo-images/_demo_images/DownloadLogs.png)

## About app

Cross-platform application to download logs from [Amazon CloudWatch Logs].

## Binary Release

Click [here](https://mega.nz/#F!XKg0RJ6S!pPDl4vxdJtQkoY9gdl9PvA) to download application binary for Windows and Mac OS.

## How to use

Just run the application. The application requests [AWS access key ID and secret access key] with following policies.

* ``CloudWatchLogsReadOnlyAccess``

## How to manually build

Require [Node 8.11.x] or Higher.

```
npm install
npm run dist
```


[Node 8.11.x]:https://nodejs.org/en/
[Amazon CloudWatch Logs]:https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html
[AWS access key ID and secret access key]:https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html
