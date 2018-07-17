import * as React from 'react';
import Balloon from './Balloon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/Balloon', () => {
  it('render with visible=true', () => {

    let props = {
      visible: true,
      message: 'hello world',
    };

    let wrapper = shallow(<Balloon {...props} />);
    expect(wrapper.find('div.Balloon').exists()).toBe(true);
    expect(wrapper.find('div.Balloon p').exists()).toBe(true);
    expect(wrapper.find('div.Balloon p').text()).toBe('hello world');
    expect(wrapper.find('div.Balloon').hasClass('visible')).toBe(true);
    expect(wrapper.find('div.Balloon').hasClass('invisible')).toBe(false);
  });

  it('render with visible=false', () => {

    let props = {
      visible: false,
      message: 'hello world',
    };

    let wrapper = shallow(<Balloon {...props} />);
    expect(wrapper.find('div.Balloon').exists()).toBe(true);
    expect(wrapper.find('div.Balloon').hasClass('visible')).toBe(false);
    expect(wrapper.find('div.Balloon').hasClass('invisible')).toBe(true);
  });
});
