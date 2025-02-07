import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Card
} from "reactstrap";
import BarsWithValue from '../Charts/BarsWithValue';
import Select from '../Common/Select';

const LeadGenerated = props => {
    const [selectedMonth, setSelectedMonth] = useState('October');
    const [graphData, setGraphdata] = useState({});
    const { leads_generated_by_source, setLeadCountByMonth } = props;


    useEffect(() => {
       const currentData = leads_generated_by_source[selectedMonth];
       const categories=[];
       const series=[];
       let leadCount = 0;
       currentData.forEach(element => {
        leadCount = leadCount + element.count;
        categories.push(element.source);
        series.push(element.count);
       });
       setLeadCountByMonth(leadCount);
       setGraphdata({categories:categories, series:series});
    }, [selectedMonth])

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <Card style={{padding:"27px"}}>
            <Row>
                <Col md={6}>
                    <div className="card-title leads-generated" style={{fontSize:"20px"}}>Leads Generated</div>
                </Col>
                <Col md={6}>
                    <div className="month-dropdown"><span>Month:</span>
                        <Select list={months} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
                    </div>
                </Col>
            </Row>
            <BarsWithValue graphData={{...graphData, columnWidth: 15}} />
        </Card>
    );
};

LeadGenerated.propTypes = {

};

export default LeadGenerated;