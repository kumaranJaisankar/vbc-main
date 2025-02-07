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

const CustomerBillPayment = ({ customers_by_payment_status }) => {
    return (
        <div className="bandwidth-usage billpayment">
            <Card>
                <CardHeader style={{ padding: '14px' }}>
                    <Row>
                        <Col md={8}>
                            <div className="bandwidth-usage-text">Bill Payment</div>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody style={{ padding: '14px' }}>
                    <Row>
                    {customers_by_payment_status &&  Object.keys(customers_by_payment_status).map((key) => {
                        return (
                        <Col md={6}>
                       <span className="billpayment-count"><span className="billPaymentCount billpayment-count-new">{key == "pd" ? "Paid" : "Unpaid"} <br/>
                       <span> {customers_by_payment_status[key]}</span>
                       </span>
                        </span>
                        </Col>)
                    })}
                    </Row>
                    <div className="customer-subtext">
                        new bills paid before time
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

CustomerBillPayment.propTypes = {

};

export default CustomerBillPayment;