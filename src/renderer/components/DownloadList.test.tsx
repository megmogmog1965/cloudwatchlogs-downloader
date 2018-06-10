import * as React from 'react';
import DownloadList from './DownloadList';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/DownloadList', () => {
  it('render without jobs', () => {

    let props = {
      jobs: [],
    };

    let wrapper = shallow(<DownloadList {...props} />);
    expect(wrapper.find('div.DownloadList').exists()).toBe(true);
    expect(wrapper.find('div.DownloadList ul li').length).toBe(1);

    expect(wrapper.find('div.DownloadList ul li strong').at(0).text()).toBe('Logs you download appear here');
  });

  it('render with 1 job', () => {

    let props = {
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
