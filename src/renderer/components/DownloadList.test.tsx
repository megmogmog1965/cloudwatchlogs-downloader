import * as React from 'react';
import DownloadList from './DownloadList';
import * as types from '../common-interfaces';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

let settings: types.Settings = {
  region: 'ap-northeast-2',
  awsAccessKeyId: 'xxxxxxxx',
  awsSecretAccessKey: 'yyyyyyyy',
  lineBreak: 'CRLF',
  jsonKey: '',
};

describe('components/DownloadList', () => {
  it('render without jobs', () => {

    let props = {
      settings: settings,
      jobs: [],
    };

    let wrapper = shallow(<DownloadList {...props} />);
    expect(wrapper.find('div.DownloadList').exists()).toBe(true);
    expect(wrapper.find('div.DownloadList ul li').exists()).toBe(false);
  });

  it('render with 1 job', () => {

    let props = {
      settings: settings,
      jobs: [
        { id: 'jobid', logGroupName: 'group 1', logStreamName: 'stream 1', startTime: 0, progress: 0 },
      ],
    };

    let wrapper = shallow(<DownloadList {...props} />);
    expect(wrapper.find('div.DownloadList').exists()).toBe(true);
    expect(wrapper.find('div.DownloadList ul li').length).toBe(1);

    expect(wrapper.find('div.DownloadList ul li strong').at(0).text()).toBe('group 1');
    expect(wrapper.find('div.DownloadList ul li div span').at(0).text()).toBe('stream 1');
  });

  it('render with 2 job', () => {

    let props = {
      settings: settings,
      jobs: [
        { id: 'jobid', logGroupName: 'group 1', logStreamName: 'stream 1', startTime: 100, progress: 1.0 },
        { id: 'jobid', logGroupName: 'group 2', logStreamName: 'stream 2', startTime: 20, progress: 0.1 },
      ],
    };

    let wrapper = shallow(<DownloadList {...props} />);
    expect(wrapper.find('div.DownloadList').exists()).toBe(true);
    expect(wrapper.find('div.DownloadList ul li').length).toBe(2);

    expect(wrapper.find('div.DownloadList ul li strong').at(0).text()).toBe('group 1');
    expect(wrapper.find('div.DownloadList ul li div span').at(0).text()).toBe('stream 1');

    expect(wrapper.find('div.DownloadList ul li strong').at(1).text()).toBe('group 2');
    expect(wrapper.find('div.DownloadList ul li div span').at(1).text()).toBe('stream 2');
  });
});
