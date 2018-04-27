import * as React from 'react';
import LogGroups from './LogGroups';
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

describe('components/LogGroups', () => {
  it('render NO <li> without logGroups.', () => {
    let mockFetchLogGroups = jest.fn();
    let mockSelectLogGroup = jest.fn();
    let mockFetchLogStreams = jest.fn();

    let props = {
      logGroups: [],
      selectedName: undefined,
      lastModified: new Date(1),
      settings: settings,
      FetchLogGroups: mockFetchLogGroups,
      SelectLogGroup: mockSelectLogGroup,
      FetchLogStreams: mockFetchLogStreams,
    };

    let wrapper = shallow(<LogGroups {...props} />);
    expect(wrapper.find('ul.LogGroups').exists()).toBe(true);
    expect(wrapper.find('li').length).toBe(1);
  });

  it('render <li> with logGroups.', () => {
    let mockFetchLogGroups = jest.fn();
    let mockSelectLogGroup = jest.fn();
    let mockFetchLogStreams = jest.fn();

    let logGroups = [
      { arn: 'xxxx', logGroupName: 'yyyy', creationTime: new Date(1).getTime(), storedBytes: 300 },
      { arn: 'zzzz', logGroupName: 'wwww', creationTime: new Date(101).getTime(), storedBytes: 400 },
    ];

    let props = {
      logGroups: logGroups,
      selectedName: undefined,
      lastModified: new Date(0),
      settings: settings,
      FetchLogGroups: mockFetchLogGroups,
      SelectLogGroup: mockSelectLogGroup,
      FetchLogStreams: mockFetchLogStreams,
    };

    let wrapper = shallow(<LogGroups {...props} />);

    expect(wrapper.find('ul.LogGroups').exists()).toBe(true);
    expect(wrapper.find('li').length).toBe(1 + 2);

    expect(wrapper.find('li.list-group-item strong').at(0).text()).toBe('yyyy');
    expect(wrapper.find('li.list-group-item p').at(0).text()).toBe('Created: 1970-01-01T00:00:00.001Z');

    expect(wrapper.find('li.list-group-item strong').at(1).text()).toBe('wwww');
    expect(wrapper.find('li.list-group-item p').at(1).text()).toBe('Created: 1970-01-01T00:00:00.101Z');
  });

  it('called SelectLogGroup, FetchLogStreams on click list items.', () => {
    let mockFetchLogGroups = jest.fn();
    let mockSelectLogGroup = jest.fn();
    let mockFetchLogStreams = jest.fn();

    let logGroups = [
      { arn: 'xxxx', logGroupName: 'yyyy', creationTime: new Date(1).getTime(), storedBytes: 300 },
      { arn: 'zzzz', logGroupName: 'wwww', creationTime: new Date(101).getTime(), storedBytes: 400 },
    ];

    let props = {
      logGroups: logGroups,
      selectedName: undefined,
      lastModified: new Date(0),
      settings: settings,
      FetchLogGroups: mockFetchLogGroups,
      SelectLogGroup: mockSelectLogGroup,
      FetchLogStreams: mockFetchLogStreams,
    };

    let wrapper = shallow(<LogGroups {...props} />);
    expect(wrapper.find('ul.LogGroups').exists()).toBe(true);

    wrapper.find('li.list-group-item').at(0).simulate('click'); // simulate first <li> element clicked.

    expect(mockSelectLogGroup.mock.calls.length).toBe(1);
    expect(mockFetchLogStreams.mock.calls.length).toBe(1);
    expect(mockSelectLogGroup.mock.calls[0][0]).toBe('yyyy');
    expect(mockFetchLogStreams.mock.calls[0][0]).toBe(settings);
    expect(mockFetchLogStreams.mock.calls[0][1]).toBe('yyyy');

    wrapper.find('li.list-group-item').at(1).simulate('click'); // simulate second <li> element clicked.

    expect(mockSelectLogGroup.mock.calls.length).toBe(2);
    expect(mockFetchLogStreams.mock.calls.length).toBe(2);
    expect(mockSelectLogGroup.mock.calls[1][0]).toBe('wwww');
    expect(mockFetchLogStreams.mock.calls[1][0]).toBe(settings);
    expect(mockFetchLogStreams.mock.calls[1][1]).toBe('wwww');
  });
});
