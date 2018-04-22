import * as React from 'react';
import './LogContent.css';
import { Settings } from '../common-interfaces/Settings';

// BAD PRACTICE: declare variables for external modules.
declare var $: any;
declare var moment: any;

const DATERANGEPICKER_DOM_ID = 'daterange-picker';
const DOWNLOADBUTTON_DOM_ID = 'download-button';

export interface Props {
  settings: Settings;
  logGroupName?: string;
  logStreamName?: string;
  startDate: Date;
  endDate: Date;
  logText: string;
  SetDateRange: (startDate: Date, endDate: Date) => void;
  DownloadLogs: (settings: Settings, logGroupName: string, logStreamName: string, startDate: Date, endDate: Date) => void;
}

class LogContent extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
  }

  componentDidMount(): void {
    let start = this.props.startDate;
    let end = this.props.endDate;
    let SetDateRange = this.props.SetDateRange;

    // initializing jquery-daterangepicker.
    $('#' + DATERANGEPICKER_DOM_ID).dateRangePicker({
      startOfWeek: 'monday',
      separator: ' ~ ',
      format: 'YYYY/MM/DD HH:mm (Z)',
      autoClose: false,
      time: {
        enabled: true,
      },
      defaultTime: start,
      defaultEndTime: end,
      getValue: function() {
        return this.innerHTML;
      },
      setValue: function(range: string, startDate: string, endDate: string) {
        this.innerHTML = range;
        SetDateRange(new Date(startDate), new Date(endDate)); // @fixme should be parsed explicitly.
      },
    });

    $('#' + DATERANGEPICKER_DOM_ID).data('dateRangePicker')
      .setDateRange(moment(start).format('YYYY/MM/DD HH:mm (Z)'), moment(end).format('YYYY/MM/DD HH:mm (Z)'));
  }

  render() {
    return (
      <div className="LogContent" >
        <p id={DATERANGEPICKER_DOM_ID}>dummy text</p>
        <div className="clearfix">
          {downloadButton(this.props)}
        </div>
        {/* @see https://stackoverflow.com/questions/37847885/formatting-code-with-pre-tag-in-react-and-jsx */}
        <pre className="log-text">
          {`${this.props.logText}`}
        </pre>
      </div>
    );
  }
}

function downloadButton(props: Props) {
  const { settings, logGroupName, logStreamName, startDate, endDate, DownloadLogs } = props;

  if (!logGroupName || !logStreamName) {
    return <button type="button" id={DOWNLOADBUTTON_DOM_ID} className="btn btn-negative" disabled={true}>Download Logs</button>;
  }

  let onClick = () => DownloadLogs(settings, logGroupName, logStreamName, startDate, endDate);

  return <button type="button" id={DOWNLOADBUTTON_DOM_ID} className="btn btn-primary" onClick={onClick}>Download Logs</button>;
}

export default LogContent;
