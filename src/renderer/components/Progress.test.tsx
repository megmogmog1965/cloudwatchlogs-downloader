import * as React from 'react';
import Progress from './Progress';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/Loading', () => {
  it('renders', () => {
    let props = {
      progress: 0.92,
    };

    let wrapper = shallow(<Progress {...props} />);
    expect(wrapper.find('.progress-label').text()).toBe('92%');
  });

  it('has "active" className when value is NOT 1', () => {
    let props = {
      progress: 0.92,
    };

    let wrapper = shallow(<Progress {...props} />);
    expect(wrapper.find('progress.active').exists()).toBe(true);
    expect(wrapper.find('progress.inactive').exists()).toBe(false);
  });

  it('has "inactive" className when value is 1', () => {
    let props = {
      progress: 1,
    };

    let wrapper = shallow(<Progress {...props} />);
    expect(wrapper.find('progress.active').exists()).toBe(false);
    expect(wrapper.find('progress.inactive').exists()).toBe(true);
  });
});
