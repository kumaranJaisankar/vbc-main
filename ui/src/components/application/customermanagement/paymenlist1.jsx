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
const PaymentList1 = (props) => {
  const [paymentlist, setPaymentlist] = useState([]);

  useEffect(() => {
    billingaxios
      .get("payment/enh/enabled/gateways")

      .then((res) => {
        // let { ATOM, RPAY } = res.data;
        setPaymentlist(res.data);
        // setRpaylist([...RPAY]);
      })
      .catch((err) => console.log(err));
  }, []);


  return (
    <FormGroup>
      <div>
        {/* <Button color="primary" onClick={props.setShowPayment} id="accept_button" >
          Make Payment
        </Button> */}
      </div>

      <Modal
        isOpen={props.showPayment}
        toggle={()=>props.setShowPayment(!props.showPayment)}
        centered
        backdrop="static"
      >
        <ModalBody>
            <h4>Select Payment Method</h4>
          <Row>
            <Col>
              <FormGroup>
                <div className="input_wrap">
                
               
                  {paymentlist.map((payment) => (
                    <><Label className="d-block" for="edo-ani1">
                      <Input  className="radio_animated" type="radio" id="edo-ani1" key={payment.payment_gateway.id} value={payment.payment_gateway.id} name="gateway_type" 
                      onChange={()=>props.setSelectedPaymentId(payment.payment_gateway.id)}/>
                       {payment.payment_gateway.gateway.name}</Label>
                    </>
                  ))}
                 
                </div>
              </FormGroup>
            </Col>
         
          </Row>
          <br />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={()=>{ 
              props.setSelectedPaymentId(null);
          props.setShowPayment(false);
          props.closeButton()}}
          >
            {Close}
          </Button>
          &nbsp;&nbsp;
          <Button
            color="primary"
            onClick={() => {
                props.submitdata();
               
              props.setShowPayment(false);;
            }}
            
          >
            Proceed to pay
          </Button>
        </ModalFooter>
      </Modal>
    </FormGroup>
  );
};
export default PaymentList1;
