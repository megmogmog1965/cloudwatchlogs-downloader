import * as React from 'react';
import './Settings.css';
import { Region } from '../constants';
import { Field, reduxForm } from 'redux-form';

export interface Props {
  handleSubmit: (value: object) => void;
}

let raw = ({ handleSubmit }: Props) => {

  return (
    <form className="Settings" onSubmit={handleSubmit}>
      <div className="form-group">
        <label><strong>Region</strong></label>
        <Field name="region" component="select" className="form-control">
          <option>{Region.US_EAST_1}</option>
          <option>{Region.US_EAST_2}</option>
          <option>{Region.US_WEST_1}</option>
          <option>{Region.US_WEST_2}</option>
          <option>{Region.AP_NORTHEAST_1}</option>
          <option>{Region.AP_NORTHEAST_2}</option>
          <option>{Region.AP_NORTHEAST_3}</option>
          <option>{Region.AP_SOUTH_1}</option>
          <option>{Region.AP_SOUTHEAST_1}</option>
          <option>{Region.AP_SOUTHEAST_2}</option>
          <option>{Region.CA_CENTRAL_1}</option>
          <option>{Region.CN_NORTH_1}</option>
          <option>{Region.EU_CENTRAL_1}</option>
          <option>{Region.EU_WEST_1}</option>
          <option>{Region.EU_WEST_2}</option>
          <option>{Region.EU_WEST_3}</option>
          <option>{Region.SA_EAST_1}</option>
        </Field>
      </div>
      <div className="form-group">
        <label><strong>AWS Access Key ID</strong></label>
        <Field name="awsAccessKeyId" component="input" type="text" className="form-control" />
      </div>
      <div className="form-group">
        <label><strong>AWS Secret Access Key</strong></label>
        <Field name="awsSecretAccessKey" component="input" type="text" className="form-control" />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-form btn-primary">Save</button>
      </div>
    </form>
  );
};

let Settings = reduxForm<Props, any>({
  // a unique name for the form
  form: 'settings',
})(raw);

export default Settings;
