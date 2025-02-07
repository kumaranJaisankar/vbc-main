import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Input
} from "reactstrap";
import Select from '../Common/Select';
import SpineArea from '../Charts/SpineArea';
import BarsWithValue from '../Charts/BarsWithValue'
import { getConvertedDataByMonth } from '../Common/getConvertedData';

const UnsolvedTicket = ({ unsolved_tickets_by_Date }) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [selectedMonth, setSelectedMonth] = useState('October');
   
    const [categories, setCategories]= useState([]);
    const [series, setSeries]= useState([]);

    useEffect(() => {
        const dataByMonth = getConvertedDataByMonth(unsolved_tickets_by_Date);
       
        const dataOfSelectedMonth = dataByMonth[selectedMonth];
        if(dataOfSelectedMonth){
            const ser=[];
            const cat= Object.keys(dataOfSelectedMonth); 
            for(let i=0; i<cat.length; i++){
                    ser.push(dataOfSelectedMonth[cat[i]].count);
            }
           
            setCategories(cat);
            setSeries(ser)
        }
     

    }, [selectedMonth])

    return (
        <div className="bandwidth-usage">
        <Card>
            <CardHeader>
                <Row>
                    <Col md={6}>
                        <div className="card-title leads-generated1">Unsolved Tickets</div>
                        <div className="lead-converted-by-month-title">
                        Unsolved tickets by days
                         </div>
                    </Col>
                    <Col md={6}>
                    <div className="month-dropdown"><span>Sort by:</span>
                    <Select list={months}  setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth}/>
                    </div>
                </Col>
                </Row>
            </CardHeader>
            <BarsWithValue graphData={{categories: categories, series:series, dataLabelsPosition:'bottom', dataLabelsVisible :true, columnWidth: 10}} />
        </Card>
    </div>
    );
};

UnsolvedTicket.propTypes = {
    
};

export default UnsolvedTicket;