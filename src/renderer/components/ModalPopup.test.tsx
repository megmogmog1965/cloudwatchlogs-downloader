import * as React from 'react';
import ModalPopup from './ModalPopup';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/Loading', () => {
  it('visible', () => {
    let props = {
      visible: true,
      message: 'message',
      HideMessage: () => 0,
    };

    let wrapper = shallow(<ModalPopup {...props} />);
    expect(wrapper.find('.ModalPopup').hasClass('visible')).toBe(true);
    expect(wrapper.find('.ModalPopup').hasClass('invisible')).toBe(false);
  });

  it('invisible', () => {
    let props = {
      visible: false,
      message: '',
      HideMessage: () => 0,
    };

    let wrapper = shallow(<ModalPopup {...props} />);
    expect(wrapper.find('.ModalPopup').hasClass('visible')).toBe(false);
    expect(wrapper.find('.ModalPopup').hasClass('invisible')).toBe(true);
  });

  it('message', () => {
    let props = {
      visible: true,
      message: 'message',
      HideMessage: () => 0,
    };

    let wrapper = shallow(<ModalPopup {...props} />);
    expect(wrapper.find('.ModalPopup .popup h2').text()).toBe('message');
  });
});
