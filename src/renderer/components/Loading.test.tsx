import * as React from 'react';
import Loading from './Loading';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/Loading', () => {
  it('renders text with property', () => {
    let props = {
      text: 'hello',
    };

    let wrapper = shallow(<Loading {...props} />);
    expect(wrapper.find('div.Loading > div').text()).toBe('hello');
  });
});
