import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Input
} from "reactstrap";
import moment from 'moment';
import StackBar from '../Charts/StackBar';
import Select from '../Common/Select';
import {getConvertedDataByMonthNodate} from '../Common/getConvertedData'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TicketByBranch = ({tickets_by_branch}) => {
    const [selectedMonth, setSelectedMonth] = useState('October');

    const [categories, setCategories]= useState([]);
    const [series, setSeries]= useState([]);

    useEffect(() => {
        const dataByMonth = getConvertedDataByMonthNodate(tickets_by_branch);
        const dataOfSelectedMonth = dataByMonth[selectedMonth];
        let s =[]
        let c =[]

            for(let i=0; i<dataOfSelectedMonth.length; i++){
                s.push(dataOfSelectedMonth[i].count);
                c.push(dataOfSelectedMonth[i].branch_name)
            }
            setSeries(s)
            setCategories(c)

    }, [tickets_by_branch, selectedMonth]);

    return (
        <div className="bandwidth-usage ticket-branch">
        <Card>
            <CardHeader>
            <div className="month-dropdown" style={{textAlign: 'right',
    float: 'none'}}><span>Sort by:</span>
             <Select list={months}  setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth}/>

                    </div>
                         
            </CardHeader>
            <StackBar categories={categories} series={series} columnWidth={12}/> 
          
        </Card>
    </div>
    );
};

TicketByBranch.propTypes = {
    
};

export default TicketByBranch;