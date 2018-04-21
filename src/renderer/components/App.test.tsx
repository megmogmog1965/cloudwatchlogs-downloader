import * as React from 'react';
import App from './App';
import MockComponent from '../../_mocks/MockComponent';
import * as enums from '../enums';
import * as types from '../common-interfaces/Settings';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

let settings: types.Settings = {
  region: 'ap-northeast-2',
  awsAccessKeyId: 'xxxxxxxx',
  awsSecretAccessKey: 'yyyyyyyy',
  lineBreak: 'CRLF',
};

describe('components/App', () => {
  it('renders "LogDownload" pane.', () => {
    let props = {
      LogGroups: () => <MockComponent name="LogGroups" />,
      LogStreams: () => <MockComponent name="LogStreams" />,
      LogContent: () => <MockComponent name="LogContent" />,
      Settings: () => <MockComponent name="Settings" />,
      windowContent: enums.WindowContent.LogDownload,
      settings: settings,
      logGroupName: '',
      logStreamName: '',
      runningIds: [],
      errorIds: [],
      ShowWindowContent: (windowContent: any) => windowContent,
      LoadSettings: () => 0,
      ReloadAll: () => 0,
      OpenGithub: () => 0,
    };

    let wrapper = mount(<App {...props} />);
    expect(wrapper.find('div.LogGroups').exists()).toBe(true);
    expect(wrapper.find('div.LogStreams').exists()).toBe(true);
    expect(wrapper.find('div.LogContent').exists()).toBe(true);
    expect(wrapper.find('div.Settings').exists()).toBe(false);
  });

  it('renders "LogDownload" pane.', () => {
    let props = {
      LogGroups: () => <MockComponent name="LogGroups" />,
      LogStreams: () => <MockComponent name="LogStreams" />,
      LogContent: () => <MockComponent name="LogContent" />,
      Settings: () => <MockComponent name="Settings" />,
      windowContent: enums.WindowContent.Settings,
      settings: settings,
      logGroupName: '',
      logStreamName: '',
      runningIds: [],
      errorIds: [],
      ShowWindowContent: (windowContent: any) => windowContent,
      LoadSettings: () => 0,
      ReloadAll: () => 0,
      OpenGithub: () => 0,
    };

    let wrapper = mount(<App {...props} />);
    expect(wrapper.find('div.LogGroups').exists()).toBe(false);
    expect(wrapper.find('div.LogStreams').exists()).toBe(false);
    expect(wrapper.find('div.LogContent').exists()).toBe(false);
    expect(wrapper.find('div.Settings').exists()).toBe(true);
  });

  it('renders NO "errors" text without errorIds', () => {
    let props = {
      LogGroups: () => <MockComponent name="LogGroups" />,
      LogStreams: () => <MockComponent name="LogStreams" />,
      LogContent: () => <MockComponent name="LogContent" />,
      Settings: () => <MockComponent name="Settings" />,
      windowContent: enums.WindowContent.LogDownload,
      settings: settings,
      logGroupName: '',
      logStreamName: '',
      runningIds: [],
      errorIds: [],
      ShowWindowContent: (windowContent: any) => windowContent,
      LoadSettings: () => 0,
      ReloadAll: () => 0,
      OpenGithub: () => 0,
    };

    let wrapper = shallow(<App {...props} />);
    expect(wrapper.find('span.errors').exists()).toBe(false);
  });

  it('renders "errors" text with errorIds', () => {
    let props = {
      LogGroups: () => <MockComponent name="LogGroups" />,
      LogStreams: () => <MockComponent name="LogStreams" />,
      LogContent: () => <MockComponent name="LogContent" />,
      Settings: () => <MockComponent name="Settings" />,
      windowContent: enums.WindowContent.LogDownload,
      settings: settings,
      logGroupName: '',
      logStreamName: '',
      runningIds: [],
      errorIds: ['0000'],
      ShowWindowContent: (windowContent: any) => windowContent,
      LoadSettings: () => 0,
      ReloadAll: () => 0,
      OpenGithub: () => 0,
    };

    let wrapper = shallow(<App {...props} />);
    expect(wrapper.find('span.errors').exists()).toBe(true);
  });

  it('renders NO "DOWNLOADING" text without runningIds', () => {
    let props = {
      LogGroups: () => <MockComponent name="LogGroups" />,
      LogStreams: () => <MockComponent name="LogStreams" />,
      LogContent: () => <MockComponent name="LogContent" />,
      Settings: () => <MockComponent name="Settings" />,
      windowContent: enums.WindowContent.LogDownload,
      settings: settings,
      logGroupName: '',
      logStreamName: '',
      runningIds: [],
      errorIds: [],
      ShowWindowContent: (windowContent: any) => windowContent,
      LoadSettings: () => 0,
      ReloadAll: () => 0,
      OpenGithub: () => 0,
    };

    let wrapper = mount(<App {...props} />);
    expect(wrapper.find('div.Loading').exists()).toBe(false);
  });

  it('renders "DOWNLOADING" text with runningIds', () => {
    let props = {
      LogGroups: () => <MockComponent name="LogGroups" />,
      LogStreams: () => <MockComponent name="LogStreams" />,
      LogContent: () => <MockComponent name="LogContent" />,
      Settings: () => <MockComponent name="Settings" />,
      windowContent: enums.WindowContent.LogDownload,
      settings: settings,
      logGroupName: '',
      logStreamName: '',
      runningIds: ['0000'],
      errorIds: [],
      ShowWindowContent: (windowContent: any) => windowContent,
      LoadSettings: () => 0,
      ReloadAll: () => 0,
      OpenGithub: () => 0,
    };

    let wrapper = mount(<App {...props} />);
    expect(wrapper.find('div.Loading').exists()).toBe(true);
  });
});
