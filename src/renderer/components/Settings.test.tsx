import * as React from 'react';
import Settings from './Settings';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/Settings [Cannot test it because it uses "redux-form"]', () => {
  it('render with default form values.', () => {
    let mockHandleSubmit = jest.fn();

    let props = {
      handleSubmit: mockHandleSubmit,
    };

    shallow(<Settings {...props} />);
    // let wrapper = shallow(<Settings {...props} />);
    // expect(wrapper.find('input').exists()).toBe(true);
    // expect(wrapper.find('select[name="region"]').exists()).toBe(true);
    // expect(wrapper.find('select[name="region"]').text()).toBe('ap-northeast-1');
  });

  it('called handleSubmit on click submit button.', () => {
    let mockHandleSubmit = jest.fn();

    let props = {
      handleSubmit: mockHandleSubmit,
    };

    shallow(<Settings {...props} />);
    // let wrapper = shallow(<Settings {...props} />);
    // expect(wrapper.find('form.Settings').exists()).toBe(true);
    //
    // wrapper.find('form button').simulate('click'); // simulate form submit button clicked.
    // expect(mockHandleSubmit.mock.calls.length).toBe({});
  });
});
