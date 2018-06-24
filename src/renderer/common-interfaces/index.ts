import { TransformTypes } from '../constants';

type Timestamp = number;

export interface Settings {
  region: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  lineBreak: string;
  filters: Transform[];
}

export interface DownloadJob {
  id: string;
  logGroupName: string;
  logStreamName: string;
  startTime: Timestamp;
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

export interface TransformReplaceRegex {
  type: TransformTypes.REPLACE_REGEX;
  pattern: string;
  replacement: string;
}

export interface TransformExtractJson {
  type: TransformTypes.EXTRACT_JSON;
  key: string;
}

export type Transform = TransformReplaceRegex | TransformExtractJson;
