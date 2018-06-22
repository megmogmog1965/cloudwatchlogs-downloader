import * as React from 'react';
import Filters from './Filters';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('components/Filters [Cannot test it because it uses "redux-form"]', () => {
  it('render with default form values.', () => {
    let mockHandleSubmit = jest.fn();

    let props = {
      handleSubmit: mockHandleSubmit,
    };

    // cannot test Filters due to redux-form.
    shallow(<Filters {...props} />);
  });
});
