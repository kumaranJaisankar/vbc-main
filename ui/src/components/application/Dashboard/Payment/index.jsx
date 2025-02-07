import React from 'react';
import PropTypes from 'prop-types';
import PaymentGrossData from './PaymentGrossData';
import PaymentType from './PaymentType'
import {Col, Row} from 'reactstrap';
import WeeklyTransaction from './WeeklyTransaction';

const Payment = ({ paymentInfo, getPaymentInfoBydate, defautDatePickerValue }) => {
    return (
        <div>
             <div className="dashboard-content">
                <div className="dashboard-content-title">Billing</div>
                <div className="bandwidth-usage"></div>
                {paymentInfo &&
                <PaymentGrossData
                paymentInfo={paymentInfo} getPaymentInfoBydate={getPaymentInfoBydate} defautDatePickerValue={defautDatePickerValue} />}
                <Row>
                    <Col xs={12} md={7} lg={7} className="customer-left-col"> 
                    {paymentInfo &&
                    <PaymentType   paymentInfo={paymentInfo} getPaymentInfoBydate={getPaymentInfoBydate} defautDatePickerValue={defautDatePickerValue} />
                    }
                    </Col>
                    <Col xs={12} md={5} lg={5} className="lead-convertion-ration customer-right-col">
                    {paymentInfo &&
                        <WeeklyTransaction paymentInfo={paymentInfo} getPaymentInfoBydate={getPaymentInfoBydate} defautDatePickerValue={defautDatePickerValue} />
                    }
                        </Col>
                </Row>

            </div>
        </div>
    );
};

Payment.propTypes = {
    
};

export default Payment;