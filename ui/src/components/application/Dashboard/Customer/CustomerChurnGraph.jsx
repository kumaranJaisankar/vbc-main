import React,{ useState, useEffect} from 'react';
import {
    Card,
    CardHeader,
    Row,
    Col,
} from "reactstrap";
import BarsWithValueChurn from '../Charts/BarWithValueChurn'
const CustomerChurnGraph = ({ customerInfo }) => {
    const [series, setSeries] = useState([])

    const categories = ["Last Week - " + `${customerInfo.churn_rate_per_last_week}`, 'Last 1 Month - ' + `${customerInfo.churn_rate_per_last_1_month}`, 'Last 3 Months - ' + `${customerInfo.churn_rate_per_last_3_months}`, 'Last 6 Months - ' + `${customerInfo.churn_rate_per_last_6_months}`, 'Last 12 Months - ' + `${customerInfo.churn_rate_per_last_12_months}`]
    const colors = ['#87a4d8', '#87a4d8', '#87a4d8', '#87a4d8', '#87a4d8']
    const dataLabelColor = ["#000000"]

    useEffect(()=>{
        if(customerInfo){
            setSeries([customerInfo.churn_rate_per_last_week,
                customerInfo.churn_rate_per_last_1_month,
                customerInfo.churn_rate_per_last_3_months,
            customerInfo.churn_rate_per_last_6_months,
            customerInfo.churn_rate_per_last_12_months
        ])
        }
    },[customerInfo]);

    return (
       
        <div className="bandwidth-usage churnGraph">
             
            <Card   className = "Main-grid" style={{padding:"10px",height:"563px"}}>
                <CardHeader>
                    <Row>
                        <Col md={8}>
                            <div className="bandwidth-usage-text" style={{fontSize: '20px'}}>Churn Rate</div>

                        </Col>

                    </Row>
                </CardHeader>
<div style={{marginTop:"72px"}}>
                <BarsWithValueChurn 
                graphData={{
                    categories: categories, series: series, dataLabelsPosition: 'bottom',
                    hideYAxis: true, hideXAxis: true, horizontal: true, seriesName: 'Churn rate',
                    offsetYPosition: 0, offsetX: 0, colorsData: colors,
                    dataLabelColor: dataLabelColor, tooltipTitleHide: true,
                    grid:true,
                    gridxaxis:true,
                    gridyaxis:false
                }} 
                />
                </div>
            </Card>
        </div>
    );
};

CustomerChurnGraph.propTypes = {

};

export default CustomerChurnGraph;