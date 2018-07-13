import * as React from 'react';
import LoadingOverlay from './LoadingOverlay';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/Loading', () => {
  it('visible', () => {
    let props = {
      visible: true,
    };

    let wrapper = shallow(<LoadingOverlay {...props} />);
    expect(wrapper.find('.LoadingOverlay').hasClass('visible')).toBe(true);
    expect(wrapper.find('.LoadingOverlay').hasClass('invisible')).toBe(false);
  });

  it('invisible', () => {
    let props = {
      visible: false,
    };

    let wrapper = shallow(<LoadingOverlay {...props} />);
    expect(wrapper.find('.LoadingOverlay').hasClass('visible')).toBe(false);
    expect(wrapper.find('.LoadingOverlay').hasClass('invisible')).toBe(true);
  });
});
