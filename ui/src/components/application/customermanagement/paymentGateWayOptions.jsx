import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,Label
} from "reactstrap";
import { Close } from "../../../constant";
import { billingaxios } from "../../../axios";
const PaymentGatewayOptions = (props) => {
    const { paymentGateways, selectedGateway, handleGatewayClick } = props;
   {/* payment gateway methods */}
    // Effect to handle initial selection
    useEffect(() => {
      const initialGateway = paymentGateways.find(
        (gateway) => gateway.enabled && gateway.default
      );
      if (initialGateway && !selectedGateway) {
        handleGatewayClick(initialGateway);
      }
    }, [paymentGateways, selectedGateway, handleGatewayClick]);
  
    return (
      <div className="payment-gateway-options">
        <Label>
          <b style={{ fontSize: "20px" }}>Payment Gateway :</b> &nbsp;&nbsp;
        </Label>
        {paymentGateways.length===0 ?<b style={{ fontSize: "20px" }}>No Payment Gateways Defined</b>
        :
         <div className="pcard-container">
       
          {paymentGateways.map((gateway) => (
            <div
              key={gateway.id}
              className={`pcard ${
                selectedGateway === gateway.id ? "selected" : ""
              }`}
              onClick={() => handleGatewayClick(gateway)}
            >
              <img src={`${process.env.REACT_APP_API_URL_BILLING}/${gateway.imageurl}`} alt={gateway.gateway_type} />
              {selectedGateway === gateway.id && <div className="ptick-mark">&#10003;</div>}
            </div>
          ))}
        </div>}
      </div>
    );
  };
  
  export default PaymentGatewayOptions;