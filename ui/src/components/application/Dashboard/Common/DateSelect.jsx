import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {DatePicker} from 'antd'
import CalendarIcon from '../../../../assets/images/dashboard/calendar-icon.svg';

const { RangePicker } = DatePicker;


const DateSelect = ({ setDateRange, defaultPickerValue}) => {

    const [dateRange, setDateRangeLocal] = useState(defaultPickerValue)

    const dateFormat = 'MMM DD';

    useEffect(() => {
      const startDate = moment().subtract(30, 'days');
      const endDate = moment();
      setDateRangeLocal([startDate, endDate]);
    }, [])

    return (
        <RangePicker
        allowClear={false}
        value={dateRange}
        format={dateFormat}
        onChange={(v) => {
          setDateRange(v);
          setDateRangeLocal(v)
        }}   
        separator={<span>-</span>}      
        suffixIcon={<img src={CalendarIcon} alt="calendar-icon"/>}     
        className='custom-range-picker' 
        defaultValue={defaultPickerValue}
        />
    );
};

DateSelect.propTypes = {
    
};

export default DateSelect;