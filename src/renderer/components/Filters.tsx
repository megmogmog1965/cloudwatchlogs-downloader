import * as React from 'react';
import './Filters.css';
import { Field, reduxForm } from 'redux-form';

export interface Props {
  handleSubmit: (value: object) => void;
}

let raw: React.SFC<Props> = ({ handleSubmit }) => {

  return (
    <form className="Filters" onSubmit={handleSubmit}>
      <div className="form-group">
        <Field name="region" component="input" type="hidden" className="form-control" />
      </div>
      <div className="form-group">
        <Field name="awsAccessKeyId" component="input" type="hidden" className="form-control" />
      </div>
      <div className="form-group">
        <Field name="awsSecretAccessKey" component="input" type="hidden" className="form-control" />
      </div>
      <div className="form-group">
        <Field name="lineBreak" component="input" type="hidden" className="form-control" />
      </div>
      <div className="form-group">
        <label><strong>[Optional] Root object key for json formatted logs</strong></label>
        <Field name="jsonKey" component="input" type="text" className="form-control" placeholder="Enter root object key to extract json value as a log." />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-form btn-primary">Save</button>
      </div>
    </form>
  );
};

let Filters = reduxForm<Props, any>({
  // a unique name for the form
  form: 'filters',
})(raw);

export default Filters;
