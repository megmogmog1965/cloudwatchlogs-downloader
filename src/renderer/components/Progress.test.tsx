import * as React from 'react';
import Progress from './Progress';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/Loading', () => {
  it('renders text with property', () => {
    let props = {
      progress: 0.92,
    };

    let wrapper = shallow(<Progress {...props} />);
    expect(wrapper.find('progress.Progress > div').text()).toBe('0.92');
  });
});
