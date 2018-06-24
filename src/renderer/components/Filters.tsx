import * as React from 'react';
import './Filters.css';
import { Field, FieldArray, reduxForm } from 'redux-form';

export interface Props {
  handleSubmit: (value: object) => void;
}

const FiltersImpl: React.SFC<Props> = ({ handleSubmit }) => {
  return (
    <form className="Filters" onSubmit={handleSubmit}>
      <FieldArray name="filters" component={FilterList} />

      <div className="form-actions">
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
    document.getElementById(targetName + '.TransformReplaceRegex')!.style.display = 'none';
    document.getElementById(targetName + '.TransformExtractJson')!.style.display = 'none';

    switch (value) {
      case 'REPLACE_REGEX':
        document.getElementById(targetName + '.TransformReplaceRegex')!.style.display = 'block';
        break;
      case 'EXTRACT_JSON':
        document.getElementById(targetName + '.TransformExtractJson')!.style.display = 'block';
        break;
      default:
        break;
    }
  };

  return (
    <div className="form-group">
      <label><strong>Filters</strong></label>

      <ul>
        {/* force to call componentDidUpdate */}
        <UpdatedHook />

        <li>
          <button type="button" className="btn btn-form btn-default" onClick={() => fields.push({})}>Add filter</button>
          {submitFailed && error && <span>{error}</span>}
        </li>

        {(fields as any[]).map((member, index) => (
          <li key={index}>
            <div className="form-group">
              <Field id={`${member}.type`} name={`${member}.type`} component="select" className="form-control filter-type" onChange={onChange(`${member}`)}>
                <option value="">None</option>
                <option value="REPLACE_REGEX">Replace with regular expression</option>
                <option value="EXTRACT_JSON">Extract a json value for the key</option>
              </Field>
            </div>

            <div id={`${member}.TransformReplaceRegex`} className="form-group">
              <label>Regular expression pattern.</label>
              <Field name={`${member}.pattern`} component="input" type="text" className="form-control" placeholder="Enter regular expression. (NOT partial match)" />
              <label>Replacement.</label>
              <Field name={`${member}.replacement`} component="input" type="text" className="form-control" placeholder="Enter replacement string. $1, $2... represent captured groups." />
            </div>

            <div id={`${member}.TransformExtractJson`} className="form-group">
              <label>A root key of the json object.</label>
              <Field name={`${member}.key`} component="input" type="text" className="form-control" placeholder={'e.g., Enter key \'log\' for the json formatted log \'{ "log": "..."}\' .'} />
            </div>

            <button type="button" className="btn btn-form btn-negative" onClick={() => fields.remove(index)}>Remove</button>
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
