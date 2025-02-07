import React from 'react';

import {
    Row,
    Col,
} from "reactstrap";

import LeadConversionRation from './LeadConversionRation';
import ConvertedLeadTable from './ConvertedLeadTable';
import LeadGenerated from './LeadGenerated';
import LeadsByStatus from './LeadsByStatus';
import NewLeadsByStatus from "./NewLeadsByStatus"


const LeadDashboard = ({ leadInfo, setLeadCountByMonth }) => {

    return (
        <div className="dashboard-content">
            <div className="dashboard-content-title" style={{fontSize:"26px"}}>Lead</div>
            <Row className="lead-generated">
                <Col xs={12} md={7} lg={7}>
                {leadInfo && leadInfo.leads_generated_by_source &&
                    <LeadGenerated leads_generated_by_source={leadInfo.leads_generated_by_source} setLeadCountByMonth={setLeadCountByMonth}/>}
                </Col>
                <Col xs={12} md={5} lg={5} className="lead-convertion-ration">
                {/* <LeadsByStatus leads_by_status={leadInfo.leads_by_status}/> */}
                {leadInfo && leadInfo.leads_converted_by_month &&
                 <LeadConversionRation leads_converted_by_month={leadInfo.leads_converted_by_month}/>}
                </Col>
            </Row>
            <Row className="lead-generated">
                <Col xs={12} md={7} lg={7}>
                    <ConvertedLeadTable converted_leads={leadInfo.converted_leads}/>
                </Col>
                <Col xs={12} md={5} lg={5} className="lead-convertion-ration">
                
                  <NewLeadsByStatus leadInfo={leadInfo}/>
                </Col>
            </Row>
            
        </div>
    )
}

export default LeadDashboard;