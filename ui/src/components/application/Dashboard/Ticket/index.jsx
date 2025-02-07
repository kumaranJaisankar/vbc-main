import React,{useState} from 'react';

import {
    Row,
    Col,
    Card
} from "reactstrap";

import UnsolvedTicket from './UnsolvedTicket';
import ConvertedLeadTable from './TicketCategory';
import TicketCreated from './TicketCreated';
import TicketResolution from './TicketResolution';
import TicketTab from './TicketTab'

const TicketDashboard = ({ ticketInfo }) => {

    return (
        <div className="dashboard-content">
            <div className="dashboard-content-title">Tickets</div>
            <Row className="lead-generated customer-dash">
                <Col xs={12} className="customer-left-col">
                <TicketCreated total_tickets_created_per_month={ticketInfo.total_tickets_created_per_month}/>
                </Col>
                <Col xs={12} className="lead-convertion-ration customer-right-col">
                <UnsolvedTicket unsolved_tickets_by_Date={ticketInfo.unsolved_tickets_by_Date}/>
                </Col>
            </Row>
            <Row className="lead-generated customer-dash">
                <Col xs={12} className="customer-left-col">
                  <TicketTab ticketInfo={ticketInfo}/>
                </Col>
                <Col xs={12} className="lead-convertion-ration customer-right-col">
                   <TicketResolution average_resolution_time_by_ticket_category={ticketInfo.average_resolution_time_by_ticket_category}/>
                </Col>
            </Row>
            
        </div>
    )
}

export default TicketDashboard;