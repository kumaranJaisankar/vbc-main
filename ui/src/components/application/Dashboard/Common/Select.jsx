import React,{ useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from "reactstrap";
import moment from 'moment';

const Select = ({setSelectedMonth, selectedMonth, list}) => {

    useEffect(() => {
        setSelectedMonth(moment().format('MMMM'));

     }, [])

    return (
        <span className="input_wrap select-input-box">
                                    <Input
                                        type="select"
                                        name="bandwidthusage"
                                        className={`form-control digits ${selectedMonth ? 'not-empty' : ''}`}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        value={selectedMonth}
                                    >
                                        {list.map((m) => {
                                            return (
                                                <option key={m} value={m}>
                                                    {m}
                                                </option>
                                            )
                                        })}
                                    </Input>
                                </span>
    );
};

Select.propTypes = {
    
};

export default Select;