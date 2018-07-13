import { FilterTypes } from '../constants';

type Timestamp = number;

export interface Settings {
  region: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  lineBreak: string;
  filters: Filter[];
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

export interface FilterReplaceRegex {
  type: FilterTypes.FILTER_REGEX;
  pattern: string;
}

export interface MapperReplaceRegex {
  type: FilterTypes.REPLACE_REGEX;
  pattern: string;
  replacement: string;
}

export interface MapperExtractJson {
  type: FilterTypes.EXTRACT_JSON;
  key: string;
}

export type Filter = FilterReplaceRegex | MapperReplaceRegex | MapperExtractJson;
