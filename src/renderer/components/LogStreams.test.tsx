import * as React from 'react';
import LogStreams from './LogStreams';
import * as types from '../common-interfaces/Settings';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

let settings: types.Settings = {
  region: 'ap-northeast-2',
  awsAccessKeyId: 'xxxxxxxx',
  awsSecretAccessKey: 'yyyyyyyy',
  lineBreak: 'CRLF',
};

describe('components/LogStreams', () => {
  it('render NO <li> without logStreams.', () => {
    let mockSelectLogStream = jest.fn();

    let props = {
      logStreams: [],
      selectedName: undefined,
      lastModified: new Date(1),
      settings: settings,
      SelectLogStream: mockSelectLogStream,
    };

    let wrapper = shallow(<LogStreams {...props} />);
    expect(wrapper.find('ul.LogStreams').exists()).toBe(true);
    expect(wrapper.find('li').length).toBe(1);
  });

  it('render <li> with logStreams.', () => {
    let mockSelectLogStream = jest.fn();

    let logStreams = [
      { arn: 'xxxx', logStreamName: 'yyyy', creationTime: new Date(1).getTime(), firstEventTimestamp: new Date(2).getTime(), lastEventTimestamp: new Date(3).getTime(), storedBytes: 300 },
      { arn: 'zzzz', logStreamName: 'wwww', creationTime: new Date(101).getTime(), firstEventTimestamp: new Date(102).getTime(), lastEventTimestamp: new Date(103).getTime(), storedBytes: 400 },
    ];

    let props = {
      logStreams: logStreams,
      selectedName: undefined,
      lastModified: new Date(0),
      settings: settings,
      SelectLogStream: mockSelectLogStream,
    };

    let wrapper = shallow(<LogStreams {...props} />);

    expect(wrapper.find('ul.LogStreams').exists()).toBe(true);
    expect(wrapper.find('li').length).toBe(1 + 2);

    // descending order
    expect(wrapper.find('li.list-group-item strong').at(0).text()).toBe('wwww');
    expect(wrapper.find('li.list-group-item p').at(0).text()).toBe('Last: 1970-01-01T00:00:00.103Z');

    // descending order
    expect(wrapper.find('li.list-group-item strong').at(1).text()).toBe('yyyy');
    expect(wrapper.find('li.list-group-item p').at(1).text()).toBe('Last: 1970-01-01T00:00:00.003Z');
  });

  it('called SelectLogStream on click list items.', () => {
    let mockSelectLogStream = jest.fn();

    let logStreams = [
      { arn: 'xxxx', logStreamName: 'yyyy', creationTime: new Date(1).getTime(), firstEventTimestamp: new Date(2).getTime(), lastEventTimestamp: new Date(3).getTime(), storedBytes: 300 },
      { arn: 'zzzz', logStreamName: 'wwww', creationTime: new Date(101).getTime(), firstEventTimestamp: new Date(102).getTime(), lastEventTimestamp: new Date(103).getTime(), storedBytes: 400 },
    ];

    let props = {
      logStreams: logStreams,
      selectedName: undefined,
      lastModified: new Date(0),
      settings: settings,
      SelectLogStream: mockSelectLogStream,
    };

    let wrapper = shallow(<LogStreams {...props} />);
    expect(wrapper.find('ul.LogStreams').exists()).toBe(true);

    wrapper.find('li.list-group-item').at(0).simulate('click'); // simulate first <li> element clicked.

    // descending order
    expect(mockSelectLogStream.mock.calls.length).toBe(1);
    expect(mockSelectLogStream.mock.calls[0][0]).toBe('wwww');

    wrapper.find('li.list-group-item').at(1).simulate('click'); // simulate second <li> element clicked.

    // descending order
    expect(mockSelectLogStream.mock.calls.length).toBe(2);
    expect(mockSelectLogStream.mock.calls[1][0]).toBe('yyyy');
  });
});
