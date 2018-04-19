
type Timestamp = number;

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
