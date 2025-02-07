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
import DateSelect from '../Common/DateSelect'
import SpineArea from '../Charts/SpineArea';
import BarsWithValue from '../Charts/BarsWithValue'
import { getConvertedDataByMonth } from '../Common/getConvertedData';

const WeeklyTransaction = ({ paymentInfo, getPaymentInfoBydate, defautDatePickerValue }) => {

    const [customerStatusdateRange, setCustomerStatusDateRange] = useState(defautDatePickerValue)
   
    const [categories, setCategories]= useState([]);
    const [series, setSeries]= useState([]);

    useEffect(() => {
        if(paymentInfo.weeklyTransactions){

            const ser = paymentInfo.weeklyTransactions.map((w)=>w.count);
            const cat = paymentInfo.weeklyTransactions.map((w)=>w.week_num);
            setSeries(ser);
            setCategories(cat)
        }
 
    }, [paymentInfo.weeklyTransactions])

    useEffect(()=>{

        const startDate = moment(customerStatusdateRange[0]).format("YYYY-MM-DD")
        const endDate = moment(customerStatusdateRange[1]).format("YYYY-MM-DD")
        getPaymentInfoBydate(startDate, endDate, 'weeklyTransactions');

    },[customerStatusdateRange])

    return (
        <div className="bandwidth-usage">
        <Card>
            <CardHeader>
                <Row>
                    <Col md={6} style={{marginTop:"-10px"}}>
                        <div className="bandwidth-usage-text" id="weeklytitle">Weekly Transaction</div>
                        <div className="lead-converted-by-month-title weekly-transaction-value">
                        Weekly transaction volume
                         </div>
                    </Col>
                    <Col md={6} style={{textAlign: 'right',marginTop:"-10px"}}>
                    <DateSelect setDateRange={setCustomerStatusDateRange} 
                 defaultPickerValue={defautDatePickerValue}/>
                </Col>
                </Row>
            </CardHeader>
            <BarsWithValue graphData={{
                categories: categories, 
                series:series, 
                dataLabelsPosition:'bottom', 
                dataLabelsVisible :true, 
                dataLabelColor:['#87a4d8'], 
                colorsData:['#87a4d8'],
                yaxisSufix:'k',
                hideYAxis:false,
                seriesName: 'amount',
                yaxisTicks:true,
                gridyaxis:true,
                grid:true
            }
            } 
               />
        </Card>
    </div>
    );
};

WeeklyTransaction.propTypes = {
    
};

export default WeeklyTransaction;