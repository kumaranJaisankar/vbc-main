import React, { useState, useEffect } from 'react';

import {
    Card,
    CardHeader,
    Row,
    Col,
} from "reactstrap";
import PieChartDonuts from '../Charts/PieChartDonuts'

const LeadsByStatus = ({ leads_by_status }) => {
    const [categories, setCategories] = useState([])
    const [series, setSeries] = useState([])
    const [categoriesByStatus, setcategoriesByStatus] = useState([])

    useEffect(() => {
        const categories1 = [];
        const series1 = [];
        const categoriesByStatusObj = {};
        leads_by_status.forEach(element => {
            categories1.push(element.status);
            series1.push(element.count);
            categoriesByStatusObj[element.status] = element.count_by_status.map((s)=>s.source+':'+ s.count);
        });
        setCategories(categories1)
        setSeries(series1)
        setcategoriesByStatus(categoriesByStatusObj);
    }, [leads_by_status])

    return (
        <div className="bandwidth-usage">
            <Card>
                <CardHeader>
                    <Row>
                        <Col md={12}>
                            <div className="bandwidth-usage-text">Percentage of leads</div>
                            <div className="lead-converted-by-month-title">
                                Percentage of leads by lead status
                            </div>
                        </Col>
                       
                    </Row>
                </CardHeader>
                {series.length>0 && 
                <PieChartDonuts categories={categories} series={series} dataLabel={false} categoriesByStatus={categoriesByStatus}/>
                }
            </Card>
        </div>
    );
};

LeadsByStatus.propTypes = {

};

export default LeadsByStatus;