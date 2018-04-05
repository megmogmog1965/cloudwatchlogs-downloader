// src/constants/index.tsx

export namespace ActionTypes {
  export const SHOW_WINDOW_CONTENT = 'SHOW_WINDOW_CONTENT';
  export type SHOW_WINDOW_CONTENT = typeof SHOW_WINDOW_CONTENT;

  export const REQUEST_LOG_GROUPS = 'REQUEST_LOG_GROUPS';
  export type REQUEST_LOG_GROUPS = typeof REQUEST_LOG_GROUPS;

  export const RECEIVE_LOG_GROUPS = 'RECEIVE_LOG_GROUPS';
  export type RECEIVE_LOG_GROUPS = typeof RECEIVE_LOG_GROUPS;

  export const SELECT_LOG_GROUP = 'SELECT_LOG_GROUP';
  export type SELECT_LOG_GROUP = typeof SELECT_LOG_GROUP;

  export const SAVE_SETTINGS = 'SAVE_SETTINGS';
  export type SAVE_SETTINGS = typeof SAVE_SETTINGS;

  export const RECEIVE_SETTINGS = 'RECEIVE_SETTINGS';
  export type RECEIVE_SETTINGS = typeof RECEIVE_SETTINGS;
}

export namespace Region {
  export const US_EAST_1 = 'us-east-1';
  export const US_EAST_2 = 'us-east-2';
  export const US_WEST_1 = 'us-west-1';
  export const US_WEST_2 = 'us-west-2';
  export const AP_NORTHEAST_1 = 'ap-northeast-1';
  export const AP_NORTHEAST_2 = 'ap-northeast-2';
  export const AP_NORTHEAST_3 = 'ap-northeast-3';
  export const AP_SOUTH_1 = 'ap-south-1';
  export const AP_SOUTHEAST_1 = 'ap-southeast-1';
  export const AP_SOUTHEAST_2 = 'ap-southeast-2';
  export const CA_CENTRAL_1 = 'ca-central-1';
  export const CN_NORTH_1 = 'cn-north-1';
  export const EU_CENTRAL_1 = 'eu-central-1';
  export const EU_WEST_1 = 'eu-west-1';
  export const EU_WEST_2 = 'eu-west-2';
  export const EU_WEST_3 = 'eu-west-3';
  export const SA_EAST_1 = 'sa-east-1';
}
