# cloudwatchlogs-downloader

![DownloadLogs pane](https://raw.githubusercontent.com/megmogmog1965/cloudwatchlogs-downloader/feature/demo-images/_demo_images/DownloadLogs.png)

## About app

Cross-platform application to download logs from [Amazon CloudWatch Logs].

## Binary Release

Click [here](https://mega.nz/#F!XKg0RJ6S!pPDl4vxdJtQkoY9gdl9PvA) to download application binary for Windows and Mac OS.

## How to use

Just run the application. The application requests [AWS access key ID and secret access key] with following policies.

* ``CloudWatchLogsReadOnlyAccess``

> AWS access keys are encrypted with your machine depended key by AES-256 and stored in your local application data directory.

## How to manually build

Require [Node 8.11.x] or Higher.

```
npm install
npm run dist
```

## See also

* [CloudWatch Logs Limits]
* [Export Log Data to Amazon S3 Using the Console]


[Node 8.11.x]:https://nodejs.org/en/
[Amazon CloudWatch Logs]:https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html
[AWS access key ID and secret access key]:https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html
[CloudWatch Logs Limits]:https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch_limits_cwl.html
[Export Log Data to Amazon S3 Using the Console]:https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3ExportTasksConsole.html
