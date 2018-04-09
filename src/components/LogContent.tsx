import * as React from 'react';
import './LogContent.css';
import { Settings } from '../common-interfaces/Settings';

// BAD PRACTICE: declare variables for external modules.
declare var $: any;
declare var moment: any;

const DATERANGEPICKER_DOM_ID = 'daterange-picker';

export interface Props {
  settings: Settings;
  logGroupName?: string;
  logStreamName?: string;
  startDate: Date;
  endDate: Date;
  SetDateRange: (startDate: Date, endDate: Date) => void;
  DownloadLogs: (logGroupName: string, logStreamName: string, startDate: Date, endDate: Date) => void;
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
      format: 'YYYY/MM/DD HH:mm',
      autoClose: false,
      time: {
        enabled: true
      },
      defaultTime: start,
      defaultEndTime: end,
      getValue: function() {
        return this.innerHTML;
      },
      setValue: function(range: string, startDate: string, endDate: string) {
        this.innerHTML = range;
        SetDateRange(new Date(startDate), new Date(endDate));
      }
    });

    $('#' + DATERANGEPICKER_DOM_ID).data('dateRangePicker')
      .setDateRange(moment(start).format('YYYY/MM/DD HH:mm'), moment(end).format('YYYY/MM/DD HH:mm'));
  }

  render() {
    // let { settings, logGroupName, logStreamName, DownloadLogs } = this.props;

    return (
      <div className="LogContent" >
        <p id={DATERANGEPICKER_DOM_ID} style={{ border: '1px', borderColor: 'gray', borderRadius: '4px' }}>aaa</p>
        {/* <input id="daterange-picker" /> */}
      </div>
    );
  }
}

export default LogContent;
