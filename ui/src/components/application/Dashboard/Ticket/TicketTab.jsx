import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
    
    CardHeader,
    CardBody,
    Row,
    Col,
    Input
} from "reactstrap";
import {Tabs} from 'antd'
import TicketCategory from './TicketCategory'
import TicketStatus from './TicketStatus'
import TicketByBranch from './TicketByBranch';
const { TabPane } = Tabs;

const TicketTab = ({ ticketInfo }) => {
   
  
function callback(key) {
    console.log(key);
  }

    return (
        <div className="dashboard-content-title ticket-tab-section">
        <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Ticket Category" key="1">
               {ticketInfo && <TicketCategory ticketInfo={ticketInfo}/>}
            </TabPane>
            <TabPane tab="Ticket Status" key="2">
            {ticketInfo &&<TicketStatus tickets_by_status_per_month={ticketInfo.tickets_by_status_per_month}/>}
            </TabPane>
            <TabPane tab="Ticket By Branch" key="3">
                <TicketByBranch tickets_by_branch={ticketInfo.tickets_by_branch}/>
            </TabPane>
        </Tabs>
        </div>
    );
};

TicketTab.propTypes = {

};

export default TicketTab;