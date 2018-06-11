import * as React from 'react';
import DownloadBadge from './DownloadBadge';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/DownloadBadge', () => {
  it('render without jobs', () => {

    let props = {
      jobs: [],
    };

    let wrapper = shallow(<DownloadBadge {...props} />);
    expect(wrapper.find('div.DownloadBadge div.badge span').exists()).toBe(false);
  });

  it('render with running jobs', () => {

    let props = {
      jobs: [
        { id: 'xxx', logGroupName: 'group 1', logStreamName: 'stream 1', startTime: 0, progress: 0.0 },
        { id: 'yyy', logGroupName: 'group 2', logStreamName: 'stream 2', startTime: 0, progress: 0.5 },
      ],
    };

    let wrapper = shallow(<DownloadBadge {...props} />);
    expect(wrapper.find('div.DownloadBadge div.badge span').exists()).toBe(true);
    expect(wrapper.find('div.DownloadBadge div.badge span').text()).toBe('2');
  });

  it('render with finished jobs ONLY', () => {

    let props = {
      jobs: [
        { id: 'xxx', logGroupName: 'group 1', logStreamName: 'stream 1', startTime: 0, progress: 1.0 },
        { id: 'yyy', logGroupName: 'group 2', logStreamName: 'stream 2', startTime: 0, progress: 1.0 },
      ],
    };

    let wrapper = shallow(<DownloadBadge {...props} />);
    expect(wrapper.find('div.DownloadBadge div.badge span').exists()).toBe(false);
  });

  it('render with running & finished jobs', () => {

    let props = {
      jobs: [
        { id: 'xxx', logGroupName: 'group 1', logStreamName: 'stream 1', startTime: 0, progress: 1.0 },
        { id: 'yyy', logGroupName: 'group 2', logStreamName: 'stream 2', startTime: 0, progress: 0.5 },
        { id: 'zzz', logGroupName: 'group 3', logStreamName: 'stream 3', startTime: 0, progress: 1.0 },
      ],
    };

    let wrapper = shallow(<DownloadBadge {...props} />);
    expect(wrapper.find('div.DownloadBadge div.badge span').exists()).toBe(true);
    expect(wrapper.find('div.DownloadBadge div.badge span').text()).toBe('1');
  });
});
