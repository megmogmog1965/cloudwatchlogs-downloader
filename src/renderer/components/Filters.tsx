import * as React from 'react';
import './Filters.css';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { FilterTypes } from '../constants';

export interface Props {
  handleSubmit: (value: object) => void;
}

const FiltersImpl: React.SFC<Props> = ({ handleSubmit }) => {
  return (
    <form className="Filters" onSubmit={handleSubmit}>
      <FieldArray name="filters" component={FilterList} />

      <div className="form-group form-actions float-right-container">
        <button type="submit" className="btn btn-form btn-primary">Save</button>
      </div>
    </form>
  );
}

const FilterList: React.SFC<any> = ({ fields, meta: { error, submitFailed } }) => {
  /**
   * @note TOO MANY SIDE EFFECTS.
   */
  let onChange = (targetName: string) => () => {
    let value = (document.getElementById(targetName + '.type') as any).value;
    document.getElementById(targetName + '.FilterReplaceRegex')!.style.display = 'none';
    document.getElementById(targetName + '.MapperReplaceRegex')!.style.display = 'none';
    document.getElementById(targetName + '.MapperExtractJson')!.style.display = 'none';

    switch (value) {
      case FilterTypes.FILTER_REGEX:
        document.getElementById(targetName + '.FilterReplaceRegex')!.style.display = 'block';
        break;
      case FilterTypes.REPLACE_REGEX:
        document.getElementById(targetName + '.MapperReplaceRegex')!.style.display = 'block';
        break;
      case FilterTypes.EXTRACT_JSON:
        document.getElementById(targetName + '.MapperExtractJson')!.style.display = 'block';
        break;
      default:
        break;
    }
  };

  return (
    <div className="form-group">
      <label><strong>Filters</strong></label>

      <ul className="list-group">
        {/* force to call componentDidUpdate */}
        <UpdatedHook />

        <li className="list-group-header">
          <button type="button" className="btn btn-form btn-default" onClick={() => fields.push({})}>
            <span className="icon icon-plus-squared icon-text" />Add filter
          </button>
          {submitFailed && error && <span>{error}</span>}
        </li>

        {(fields as any[]).map((member, index) => (
          <li key={index} className="list-group-item">
            <div className="media-body">
              <div className="form-group">
                <h4 className="pull-left">#{index + 1}</h4>
                <div className="pull-right btn-group">
                  <button className="btn btn-mini btn-default" type="button" onClick={() => fields.swap(index, index - 1)} disabled={index <= 0}>
                    <span className="icon icon-up-open" />
                  </button>
                  <button className="btn btn-mini btn-default" type="button" onClick={() => fields.swap(index, index + 1)} disabled={index >= fields.length - 1}>
                    <span className="icon icon-down-open" />
                  </button>
                  <button className="btn btn-mini btn-default" type="button" onClick={() => fields.remove(index)}>
                    <span className="icon icon-cancel-squared" />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <Field id={`${member}.type`} name={`${member}.type`} component="select" className="form-control filter-type" onChange={onChange(`${member}`)}>
                  <option value="">None</option>
                  <option value={FilterTypes.FILTER_REGEX}>Filter with regular expression</option>
                  <option value={FilterTypes.REPLACE_REGEX}>Replace with regular expression</option>
                  <option value={FilterTypes.EXTRACT_JSON}>Extract a json value for the key</option>
                </Field>
              </div>

              <div id={`${member}.FilterReplaceRegex`}>
                <div className="form-group">
                  <label>Regular expression pattern.</label>
                  <Field name={`${member}.pattern`} component="input" type="text" className="form-control" placeholder="Enter regular expression pattern." />
                </div>
              </div>

              <div id={`${member}.MapperReplaceRegex`}>
                <div className="form-group">
                  <label>Regular expression pattern.</label>
                  <Field name={`${member}.pattern`} component="input" type="text" className="form-control" placeholder="Enter regular expression pattern." />
                </div>

                <div className="form-group">
                  <label>Replacement.</label>
                  <Field name={`${member}.replacement`} component="input" type="text" className="form-control" placeholder="Enter replacement string. '$1', '$2'... represent captured groups." />
                </div>
              </div>

              <div id={`${member}.MapperExtractJson`}>
                <div className="form-group">
                  <label>A root key of the json object.</label>
                  <Field name={`${member}.key`} component="input" type="text" className="form-control" placeholder={'e.g., Enter key \'log\' for the json formatted log \'{ "log": "..." }\'.'} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

class UpdatedHook extends React.Component<{}> {
  componentDidMount(): void {
    hide();
  }

  componentDidUpdate(prevProps: {}, prevState: any, prevContext: any) {
    hide();
  }

  render() {
    return (<div />);
  }
}

const hide = () => {
  // @see https://stackoverflow.com/questions/2856513/how-can-i-trigger-an-onchange-event-manually
  let types = document.getElementsByClassName('filter-type');
  for (let i = 0; i < types.length; i++) {
    types[i].dispatchEvent(new Event('change', { bubbles: true }));
  }
};

const Filters = reduxForm<Props, any>({
  // a unique name for the form
  form: 'filters',
})(FiltersImpl);

export default Filters;
