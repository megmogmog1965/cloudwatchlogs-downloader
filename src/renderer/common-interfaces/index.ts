
type Timestamp = number;

export interface Settings {
  region: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  lineBreak: string;
  jsonKey: string;
}

export interface DownloadJob {
  id: string;
  progress: number;
}

export interface LogGroup {
  arn: string;
  logGroupName: string;
  creationTime: Timestamp;
  storedBytes: number;
}

export interface LogStream {
  arn: string;
  logStreamName: string;
  creationTime: Timestamp;
  firstEventTimestamp: Timestamp;
  lastEventTimestamp: Timestamp;
  storedBytes: number;
}
