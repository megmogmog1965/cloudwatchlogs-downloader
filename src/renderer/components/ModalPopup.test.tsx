import * as React from 'react';
import ModalPopup from './ModalPopup';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/Loading', () => {
  it('visible', () => {
    let props = {
      message: 'message',
      visible: true,
      HideMessage: () => 0,
    };

    let wrapper = shallow(<ModalPopup {...props} />);
    expect(wrapper.find('.ModalPopup').hasClass('visible')).toBe(true);
    expect(wrapper.find('.ModalPopup').hasClass('invisible')).toBe(false);
  });

  it('invisible', () => {
    let props = {
      message: '',
      visible: false,
      HideMessage: () => 0,
    };

    let wrapper = shallow(<ModalPopup {...props} />);
    expect(wrapper.find('.ModalPopup').hasClass('visible')).toBe(false);
    expect(wrapper.find('.ModalPopup').hasClass('invisible')).toBe(true);
  });
});
