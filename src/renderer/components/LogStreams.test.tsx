import * as React from 'react';
import LogStreams from './LogStreams';
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

describe('components/LogStreams', () => {
  it('render NO <li> without logStreams.', () => {
    let mockSelectLogStream = jest.fn();
    let mockFetchLogText = jest.fn();

    let props = {
      logStreams: [],
      selectedName: undefined,
      lastModified: new Date(1),
      settings: settings,
      logGroupName: 'loggroup',
      SelectLogStream: mockSelectLogStream,
      FetchLogText: mockFetchLogText,
      Now: () => new Date(0),
    };

    let wrapper = shallow(<LogStreams {...props} />);
    expect(wrapper.find('ul.LogStreams').exists()).toBe(true);
    expect(wrapper.find('li').length).toBe(1);
  });

  it('render <li> with logStreams.', () => {
    let mockSelectLogStream = jest.fn();
    let mockFetchLogText = jest.fn();

    // ignore locale of test environment.
    let ignoreTimezone = (date: Date) => {
      let timezoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
      return new Date(date.getTime() - timezoneOffsetMs);
    }

    let logStreams = [
      { arn: 'xxxx', logStreamName: 'yyyy', creationTime: new Date(0).getTime(), firstEventTimestamp: ignoreTimezone(new Date('2018/4/1')).getTime(), lastEventTimestamp: ignoreTimezone(new Date('2018/4/3')).getTime(), storedBytes: 300 },
      { arn: 'zzzz', logStreamName: 'wwww', creationTime: new Date(0).getTime(), firstEventTimestamp: ignoreTimezone(new Date('2018/5/2')).getTime(), lastEventTimestamp: ignoreTimezone(new Date('2018/5/5')).getTime(), storedBytes: 400 },
      { arn: 'aaaa', logStreamName: 'bbbb', creationTime: new Date(0).getTime(), firstEventTimestamp: ignoreTimezone(new Date('2018/4/1')).getTime(), lastEventTimestamp: ignoreTimezone(new Date('2018/4/3')).getTime(), storedBytes: 300 },
    ];

    let props = {
      logStreams: logStreams,
      selectedName: undefined,
      lastModified: new Date(0),
      settings: settings,
      logGroupName: 'loggroup',
      SelectLogStream: mockSelectLogStream,
      FetchLogText: mockFetchLogText,
      Now: () => new Date(0),
    };

    let wrapper = shallow(<LogStreams {...props} />);

    expect(wrapper.find('ul.LogStreams').exists()).toBe(true);
    expect(wrapper.find('li').length).toBe(1 + 3);

    // descending order
    expect(wrapper.find('li.list-group-item strong').at(0).text()).toBe('wwww');
    expect(wrapper.find('li.list-group-item p').at(0).text()).toBe('From: 2018/05/02');
    expect(wrapper.find('li.list-group-item p').at(1).text()).toBe('To: 2018/05/05');

    expect(wrapper.find('li.list-group-item strong').at(1).text()).toBe('bbbb');
    expect(wrapper.find('li.list-group-item p').at(2).text()).toBe('From: 2018/04/01');
    expect(wrapper.find('li.list-group-item p').at(3).text()).toBe('To: 2018/04/03');

    expect(wrapper.find('li.list-group-item strong').at(2).text()).toBe('yyyy');
    expect(wrapper.find('li.list-group-item p').at(4).text()).toBe('From: 2018/04/01');
    expect(wrapper.find('li.list-group-item p').at(5).text()).toBe('To: 2018/04/03');
  });

  it('called SelectLogStream on click list items.', () => {
    let mockSelectLogStream = jest.fn();
    let mockFetchLogText = jest.fn();

    let logStreams = [
      { arn: 'xxxx', logStreamName: 'yyyy', creationTime: new Date(1).getTime(), firstEventTimestamp: new Date(2).getTime(), lastEventTimestamp: new Date(3).getTime(), storedBytes: 300 },
      { arn: 'zzzz', logStreamName: 'wwww', creationTime: new Date(101).getTime(), firstEventTimestamp: new Date(102).getTime(), lastEventTimestamp: new Date(103).getTime(), storedBytes: 400 },
    ];

    let props = {
      logStreams: logStreams,
      selectedName: undefined,
      lastModified: new Date(0),
      settings: settings,
      logGroupName: 'loggroup',
      SelectLogStream: mockSelectLogStream,
      FetchLogText: mockFetchLogText,
      Now: () => new Date(0),
    };

    let wrapper = shallow(<LogStreams {...props} />);
    expect(wrapper.find('ul.LogStreams').exists()).toBe(true);

    wrapper.find('li.list-group-item').at(0).simulate('click'); // simulate first <li> element clicked.

    // descending order
    expect(mockSelectLogStream.mock.calls.length).toBe(1);
    expect(mockSelectLogStream.mock.calls[0][0]).toBe('wwww');
    expect(mockFetchLogText.mock.calls.length).toBe(1);
    expect(mockFetchLogText.mock.calls[0][0]).toEqual(settings);
    expect(mockFetchLogText.mock.calls[0][1]).toBe('loggroup');
    expect(mockFetchLogText.mock.calls[0][2]).toEqual(logStreams[1]);

    wrapper.find('li.list-group-item').at(1).simulate('click'); // simulate second <li> element clicked.

    // descending order
    expect(mockSelectLogStream.mock.calls.length).toBe(2);
    expect(mockSelectLogStream.mock.calls[1][0]).toBe('yyyy');
    expect(mockFetchLogText.mock.calls.length).toBe(2);
    expect(mockFetchLogText.mock.calls[1][0]).toEqual(settings);
    expect(mockFetchLogText.mock.calls[1][1]).toBe('loggroup');
    expect(mockFetchLogText.mock.calls[1][2]).toEqual(logStreams[0]);
  });
});
