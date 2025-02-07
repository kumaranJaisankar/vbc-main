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
import PieChartDonuts from '../Charts/PieChartDonuts'
import {getConvertedDataByMonthNodate} from '../Common/getConvertedData';

const ticketData = [{
    count: 400,
    status : "Install"},
    {
    count :300,
    status : 'Process',
    },
    {
    count : 200,
    status : 'Router'
    },
    {
        count : 200,
        status : 'Payment'
        }
]

const TicketResolution = ({ average_resolution_time_by_ticket_category }) => {
    const [categories, setCategories] = useState([])
    const [series, setSeries] = useState([])
    const [selectedMonth, setSelectedMonth] = useState('October');
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const colors = ['#E289F2', "#855CF8", "#0431D2", "#B085FF", "#503795", "#263238"];

    useEffect(() => {
        const dataByMonth = getConvertedDataByMonthNodate(average_resolution_time_by_ticket_category);
  
    const dataOfSelectedMonth = dataByMonth[selectedMonth];
        if(dataOfSelectedMonth){
           const categories1 = [];
           const series1 = [];
            dataOfSelectedMonth.forEach(element => {
                categories1.push(element.category);
                series1.push(element.avg_time);
            });
            setCategories(categories1)
            setSeries(series1)
        }
       
    }, [average_resolution_time_by_ticket_category, selectedMonth])

    return (
        <div className="bandwidth-usage">
            <Card style={{marginTop:"58px", height:"450px"}}>
                <CardHeader>
                    <Row>
                        <Col md={7}>
                            <div className="card-title leads-generated1">Ticket Resolution</div>
                            <div className="lead-converted-by-month-title ticket-resolution-time-sub">
                                Avg ticket resolution time
                            </div>
                        </Col>
                        <Col md={5}>
                    <div className="month-dropdown"><span>Sort by:</span>
                    <Select list={months}  setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth}/>
                    </div>
                </Col>
                    </Row>
                </CardHeader>
                {series.length>0 && 
                <PieChartDonuts categories={categories} series={series} label={ true } colors={colors} dataLabel='hours' height={350}/>
                }
            </Card>
        </div>
    );
};

TicketResolution.propTypes = {

};

export default TicketResolution;