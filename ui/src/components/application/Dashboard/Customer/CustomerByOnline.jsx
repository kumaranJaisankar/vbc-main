import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    Row,
    Col
} from "reactstrap";
import moment from 'moment';
import PieChartDonuts from '../Charts/PieChartDonutsCustomer'
import DateSelect from '../Common/DateSelect'

const CustomerByOnline = ({ leads_by_status, defautDatePickerValue, getCustomerInfoBydate}) => {
    const dateFormat = 'MM/DD';

    const [categories, setCategories] = useState([])
    const [series, setSeries] = useState([])
    const [onlineCount, setOnlineCount] = useState(0);

    const [customerStatusdateRange, setCustomerStatusDateRange] = useState(defautDatePickerValue)

    useEffect(()=>{
        const startDate = moment(customerStatusdateRange[0]).format("YYYY-MM-DD")
        const endDate = moment(customerStatusdateRange[1]).format("YYYY-MM-DD")
        getCustomerInfoBydate(startDate, endDate, 'customerOnline');
    },[customerStatusdateRange])

    useEffect(() => {
        const categories1 = [];
        const series1 = [];
        console.log(leads_by_status,"hihi")
        leads_by_status && leads_by_status.forEach(element => {
            
            let status = 'Online';
            if(element.status ==='offline'){
                status ='Offline'
            }else if(element.status ==='deactive'){
                status = 'Not active';
            }
            categories1.push(status);
            series1.push(element.count);
            if(element.status === 'online'){
                setOnlineCount(element.count);
            }
        });
        setCategories(categories1)
        setSeries(series1)

    }, [leads_by_status])

    return (
        <div className="customers-online-card">
            <Card>
                <CardHeader>
                    <Row>
                        <Col md={7}>
                            <div className="bandwidth-usage-text">Customers Online</div>
                            <div className="lead-converted-by-month-title">
                            <span className="count">{onlineCount}</span>customers are online now
                            </div>
                        </Col>
                        <Col md={5} style={{ padding: '0px 10px', textAlign: 'right' }}>
                        <DateSelect setDateRange={setCustomerStatusDateRange} defaultPickerValue={defautDatePickerValue}/>
                        </Col>
                    </Row>
                </CardHeader>
                {series.length>0 && 
                <PieChartDonuts categories={categories} series={series} width={100}/>
                }
            </Card>
        </div>
    );
};

CustomerByOnline.propTypes = {

};

export default CustomerByOnline;