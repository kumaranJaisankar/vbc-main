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
import SpineArea from '../Charts/SpineArea';
import BarsWithValue from '../Charts/BarsWithValue'

const LeadConversionRation = ({ leads_converted_by_month }) => {
    const series= Object.values(leads_converted_by_month);
    const categories=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var currMonthName  = moment().format('MMMM');
    return (
        <div className="bandwidth-usage">
        <Card style={{padding:"25px"}}>
            <CardHeader>
                <Row>
                    <Col md={12}>
                        <div className="card-title leads-generated1" style={{fontSize:"20px"}}>Leads Converted By Month</div>
                        <div className="lead-converted-by-month-title"><span className="count">{leads_converted_by_month[currMonthName]}</span> 
                        leads converted this month
                         </div>
                    </Col>
                   
                </Row>
            </CardHeader>
            <BarsWithValue graphData={{categories: categories, series:series, dataLabelsPosition:'bottom', hideYAxis: true, columnWidth:120}} />
        </Card>
    </div>
    );
};

LeadConversionRation.propTypes = {
    
};

export default LeadConversionRation;