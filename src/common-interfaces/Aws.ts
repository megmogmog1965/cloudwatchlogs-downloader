
type Timestamp = number;

export interface LogGroup {
  arn: string;
  logGroupName: string;
  creationTime: Timestamp;
  storedBytes: Timestamp;
}

export interface LogStream {
  arn: string;
  logStreamName: string;
  creationTime: Timestamp;
  firstEventTimestamp: Timestamp;
  lastEventTimestamp: Timestamp;
  storedBytes: number;
}
