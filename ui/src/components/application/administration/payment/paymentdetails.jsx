import React, { Fragment, useEffect, useState } from "react"; //hooks
import { Container, Row, Col, Form, Label, Input } from "reactstrap";
import useFormValidation from "../../../customhooks/FormValidation";
// import {Globe} from "feather-icons";
import { billingaxios } from "../../../../axios";
// import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';
import { ADMINISTRATION } from "../../../../utils/permissions";
import ErrorModal from "../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const PaymentDetails = (props) => {
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const[gatewayInfo,setGatewayInfo] = useState({})
  const [isDisabled, setIsdisabled] = useState(true);
  const [paymentType, setPaymentType] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  // const [gateway, setGateway]= useState([]);
  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(props.lead);
  }, [props.rightSidebar]);

  const handleChange = (e) => {

    // const leadUserCloned = { ...leadUser };
    const leadUserCloned1 = { ...gatewayInfo };
    if (e.target.name == "gateway_type") {
      // leadUserCloned.payment_gateway.gateway_type = e.target.value;
      leadUserCloned1.gateway_type = e.target.value;
    } else {
      leadUserCloned1[e.target.name] = e.target.value;
      // leadUserCloned.payment_gateway.gateway[e.target.name] = e.target.value;
    }
    setLeadUser(leadUserCloned1);
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };
  //payment list
  // useEffect(() => {
  //   billingaxios
  //     .get("payment/v2/gateways")
  //     .then((res) => {
  //       setLeadUser(res.data);
  //       let { options } = res.data;
  //       setPaymentType([...options]);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  //get gateway information and commented off options api
  useEffect(() => {
    billingaxios
      .get(`payment/get/gateway/${leadUser?.payment_gateway?.id}`)
      .then((res) => {
        setGatewayInfo(res.data);
        let { options } = res.data;
        setPaymentType([...options]);
      })
      .catch((err) => console.log(err));
  }, []);

  //details update
  const statusDetails = (id,
    // newleadUser
  ) => {
    if (!isDisabled) {
      billingaxios
        .patch("payment/gateway/" + id + "/ru", leadUser)
        .then((res) => {
          props.onUpdate(res.data);
          // toast.success("Payment Gateway was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
           // Modified by Marieya
        setShowModal(true);
        setModalMessage("Payment Gateway was edited successfully");
          props.RefreshHandler()
          setIsdisabled(true);
        })
        // .catch(function (error) {
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        //   console.error("Something went wrong!", error);
        // });
        .catch(function (error) {
          setShowModal(true);
          setModalMessage("Something went wrong");
          console.error("Something went wrong!", error);
        });        
      // }
    }
  };

  //validations
  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    let leadUserNew = { ...gatewayInfo };
    if (leadUserNew.gateway) {
      leadUserNew.name = leadUserNew.gateway.name;
      leadUserNew.client_id = leadUserNew.gateway.client_id;
      leadUserNew.key_id = leadUserNew.gateway.key_id;
    }

    const validationErrors = validate(leadUserNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      statusDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(true);
  };

  // function CheckEmptyValue(e){
  //   if(e.target.value == ""){
  //     e.target.classList.remove('not-empty');
  //   }else{
  //     e.target.classList.add("not-empty");
  //   }
  // }
  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  const requiredFields = ["name", "client_id", "gateway_type", "key_id",];
  const { validate, Error } = useFormValidation(requiredFields);

  useEffect(() => {
    if (props.openCustomizer) {
      setErrors({});
    }
  }, [props.openCustomizer]);

  return (
    <Fragment>
      {/* {token.permissions.includes(ADMINISTRATION.PAYMENTUPDATE) && (

        <EditIcon className="icofont icofont-edit" style={{ top: "8px", right: "64px" }} onClick={clicked} id="edit_icon"
        // disabled={isDisabled} 
        />
      )} */}

      <br />
      <Container fluid={true}>
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row style={{ marginTop: "1%" }}>
            <Col md="4" id="moveup">
              <div className="input_wrap">
                {/* <Label> Name:</Label> */}
                <Label className="kyc_label">Name *</Label>
                <Input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                  id="afterfocus"
                  type="text"
                  name="name"
                  style={{ border: "none", outline: "none", textTransform: "capitalize" }}
                  // value={leadUser && leadUser.payment_gateway && leadUser.payment_gateway.gateway?.name}
                  value={gatewayInfo?.gateway?.name}
                  onChange={handleChange}
                  // onBlur={CheckEmptyValue}
                  disabled={isDisabled}
                ></Input>

                <span className="errortext">{errors.name && "Field is required"}</span>
              </div>
            </Col>
            {/* <Col md="4" id="moveup">
              <div className="input_wrap">
                <Label className="kyc_label">Gateway *</Label>
                <select
                  className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                  id="afterfocus"
                  type="select"
                  name="gateway_type"
                  style={{ border: "none", outline: "none" }}
                  // value={leadUser && leadUser.payment_gateway?.gateway_type}
                  value={leadUser?.gateway_type}
                  onChange={handleChange}
                  disabled={isDisabled}
                >
                  {paymentType.map((payemttype) => {
                    if (!!payemttype && gatewayInfo?.gateway_type) {
                      return (
                        <option
                          key={payemttype.id}
                          value={payemttype.id}
                          selected={
                            payemttype.id == gatewayInfo?.gateway_type
                              ? "selected"
                              : ""
                          }
                        >
                          {payemttype.name}
                        </option>
                      );
                    }
                  })}
                </select>
                <span className="errortext">{errors.gateway_type && "select"}</span>
              </div>
            </Col> */}
            <Col md="4" id="moveup">
              <div className="input_wrap">
                {/* <Label> Name:</Label> */}
                <Label className="kyc_label">Gateway *</Label>
                <Input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                  id="afterfocus"
                  type="text"
                  name="name"
                  style={{ border: "none", outline: "none", textTransform: "capitalize" }}
                  value={gatewayInfo?.gateway_type}
                  onChange={handleChange}
                  // onBlur={CheckEmptyValue}
                  disabled={isDisabled}
                ></Input>

                <span className="errortext">{errors.gateway_type && "select"}</span>
              </div>
            </Col>
            <Col md="4" id="moveup">
              <div className="input_wrap">
                <Label className="kyc_label">Key ID *</Label>
                <input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                  id="afterfocus"
                  type="text"
                  name="key_id"
                  style={{ border: "none", outline: "none" }}
                  value={gatewayInfo?.gateway?.key_id}
                  // value={
                  //   leadUser && leadUser.payment_gateway && leadUser.payment_gateway.gateway?.key_id
                  // }
                  onChange={handleChange}
                  // onBlur={CheckEmptyValue}
                  disabled={isDisabled}
                ></input>
                <span className="errortext">{errors.key_id && "Field is required"}</span>
              </div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="4" >
              <div className="input_wrap">
                <Label className="kyc_label">Client ID *</Label>
                <input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                  id="afterfocus"
                  type="text"
                  name="client_id"
                  style={{ border: "none", outline: "none" }}
                  value={gatewayInfo?.gateway?.client_id}
                  // value={
                  //   leadUser && leadUser.payment_gateway && leadUser.payment_gateway.gateway?.client_id
                  // }
                  onChange={handleChange}
                  // onBlur={CheckEmptyValue}
                  disabled={isDisabled}
                ></input>
                <span className="errortext">{errors.client_id && "Field is required"}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <span className="sidepanel_border" style={{ position: "relative", top: "25px" }}></span>
          </Row>
          <br />
          <button type="submit" name="submit" class="btn btn-primary" id="save_button">
            Save
          </button>
          &nbsp;
          &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            onClick={props.dataClose}
            id="resetid"
          >
            Cancel
          </button>
        </Form>
        <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
      </Container>
    </Fragment>
  );
};

export default PaymentDetails;
