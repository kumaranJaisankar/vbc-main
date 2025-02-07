import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Input, Button, Label } from "reactstrap";
import { toast } from "react-toastify";
import { billingaxios } from "../../../axios";
import ErrorModal from "../../common/ErrorModal";

const PaymentList = (props) => {
  const [paymentlist, setPaymentlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  useEffect(() => {
    billingaxios
      .get(
        `payment/enh/area/${props?.formData && props.formData?.area}/gateways`
      )
// Modified by Marieya
      .then((res) => {
        // let { ATOM, RPAY } = res.data;
        setPaymentlist(res.data);
        // setRpaylist([...RPAY]);
      })
      .catch((err) => {
        console.log(err);
        // toast.error("Something went wrong", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
        // Modified by Marieya
        setShowModal(true);
          setModalMessage("Something went wrong");
      });
  }, []);

  // changed payment id by Marieya 4/08/2022
  const SubmitHandler = () =>{
    props.submitdata()
    props.setShowPayment(false)
  }
  const SubmitHandlerWithPriorCheck = () =>{
    props.priorCheck()
  }
  return (
    <FormGroup>
      <div></div>

      {/* <Modal
        isOpen={props.showPayment}
        toggle={()=>props.setShowPayment(!props.showPayment)}
        centered
        backdrop="static"
      >
        <ModalBody>
            <h4>Select Payment Method</h4> */}
      <Row>
        <Col>
          <FormGroup>
            <div className="input_wrap">
              {paymentlist?.map((payment) => (
                <>
                  <Label className="d-block" for="edo-ani1">
                    <Input
                      className="radio_animated"
                      type="radio"
                      id="edo-ani1"
                      key={payment.payment_gateway.id}
                      value={payment.payment_gateway.id}
                      name="gateway_type"
                      onChange={() =>
                        props.setSelectedPaymentId(payment.payment_gateway.id)
                      }
                    />
                    {payment.payment_gateway.gateway.name}
                  </Label>
                </>
              ))}
            </div>
          </FormGroup>
        </Col>
      </Row>
      <br />
      {/* </ModalBody>
        <ModalFooter> */}
      {/* <Button color="secondary" onClick={()=>{ 
              props.setSelectedPaymentId(null);
          props.setShowPayment(false);
          props.closeButton()}}
          >
            {Close}
          </Button>
          &nbsp;&nbsp; */}
      <Button
        // style={{marginTop:"-24%",marginLeft:"-13%"}}
        color="primary"
        onClick={
    props.formData.ippool ?SubmitHandlerWithPriorCheck  : SubmitHandler
        
      }
        className="pay_online"
        id="update_button"
      >
        Submit
      </Button>
      {/* </ModalFooter>
      </Modal> */}
           <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
    </FormGroup>
  );
};
export default PaymentList;
