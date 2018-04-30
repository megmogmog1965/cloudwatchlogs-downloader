import * as React from 'react';
import App from './App';
import MockComponent from '../../_mocks/MockComponent';
import * as enums from '../enums';
import * as types from '../common-interfaces';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

let settings: types.Settings = {
  region: 'ap-northeast-2',
  awsAccessKeyId: 'xxxxxxxx',
  awsSecretAccessKey: 'yyyyyyyy',
  lineBreak: 'CRLF',
  jsonKey: '',
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
      runningJobs: [],
      errorJobs: [],
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
      runningJobs: [],
      errorJobs: [],
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

  it('renders NO "errors" text without errorJobs', () => {
    let props = {
      LogGroups: () => <MockComponent name="LogGroups" />,
      LogStreams: () => <MockComponent name="LogStreams" />,
      LogContent: () => <MockComponent name="LogContent" />,
      Settings: () => <MockComponent name="Settings" />,
      windowContent: enums.WindowContent.LogDownload,
      settings: settings,
      logGroupName: '',
      logStreamName: '',
      runningJobs: [],
      errorJobs: [],
      ShowWindowContent: (windowContent: any) => windowContent,
      LoadSettings: () => 0,
      ReloadAll: () => 0,
      OpenGithub: () => 0,
    };

    let wrapper = shallow(<App {...props} />);
    expect(wrapper.find('span.errors').exists()).toBe(false);
  });

  it('renders "errors" text with errorJobs', () => {
    let props = {
      LogGroups: () => <MockComponent name="LogGroups" />,
      LogStreams: () => <MockComponent name="LogStreams" />,
      LogContent: () => <MockComponent name="LogContent" />,
      Settings: () => <MockComponent name="Settings" />,
      windowContent: enums.WindowContent.LogDownload,
      settings: settings,
      logGroupName: '',
      logStreamName: '',
      runningJobs: [],
      errorJobs: [{id: '0000', progress: 0}],
      ShowWindowContent: (windowContent: any) => windowContent,
      LoadSettings: () => 0,
      ReloadAll: () => 0,
      OpenGithub: () => 0,
    };

    let wrapper = shallow(<App {...props} />);
    expect(wrapper.find('span.errors').exists()).toBe(true);
  });

  it('renders "DOWNLOADING" text with runningJobs', () => {
    let props = {
      LogGroups: () => <MockComponent name="LogGroups" />,
      LogStreams: () => <MockComponent name="LogStreams" />,
      LogContent: () => <MockComponent name="LogContent" />,
      Settings: () => <MockComponent name="Settings" />,
      windowContent: enums.WindowContent.LogDownload,
      settings: settings,
      logGroupName: '',
      logStreamName: '',
      runningJobs: [{id: '0000', progress: 0}],
      errorJobs: [],
      ShowWindowContent: (windowContent: any) => windowContent,
      LoadSettings: () => 0,
      ReloadAll: () => 0,
      OpenGithub: () => 0,
    };

    let wrapper = mount(<App {...props} />);
    expect(wrapper.find('progress').exists()).toBe(true);
  });
});
