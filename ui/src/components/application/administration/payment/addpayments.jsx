import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner
} from "reactstrap";
import useFormValidation from "../../../customhooks/FormValidation";
import { billingaxios } from "../../../../axios";
// import { toast } from "react-toastify";
import { Add } from "../../../../constant";
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../common/Sorting";
import ErrorModal from "../../../common/ErrorModal";

const AddPayment = (props, initialValues) => {
  const [togglesnmpState, setTogglesnmpState] = useState("off");
  const [togglesnmpState1, setTogglesnmpState1] = useState("off");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isShow, setIsShow] = React.useState(true);
  const [isShow1, setIsShow1] = React.useState(true);
  const [showpayment, setShowpayment] = useState(false);
  const [razorPay, setRazorPay] = useState();
  const [selectedGateway, setSelectedGateway] = useState("");
  const [formData, setFormData] = useState({
    payment_gateway: {
      gateway: {
        key_id: "",
        client_id: "",
        name: "",
        entity: "",
        entity_id: "",
        request_hash_key:"",
        request_salt_key:"",
        resphashkey:"", 
         responsesaltkey:"",
      },
    },
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [paymentType, setPaymentType] = useState([]);
  // added new states by Marieya for entity and user id on 03/08/2922
  const [paymentUserid, setPaymentUserid] = useState([]);
  const [disable, setDisable] = useState(false);


  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if(event.target.value === "ATOM" ){
      setSelectedGateway(true)
    }
   
    if (target.name === "roles" || target.name === "permissions") {
      value = [target.value];
    }
    if (
      event.target.value === "ATOM" ||
      event.target.value === "RPAY" ||
      event.target.value === "PAYU"
    ) {
      setShowpayment(true);
    }
    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
    let val = event.target.value;

    if (name == "entity") {
      getuserId(val);
    }
  };

  const addPayment = (e) => {
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    var data = {
      //   "gateway_type":formData.gateway_type,

      //   "enabled": !isShow,
      //  "default":!isShow1,
      //  payment_gateway :{
      //   gateway: {
      //     "key_id": formData.key_id,
      //     "client_id": formData.client_id,
      //     "name": formData.name
      // }
      //  }

      payment_gateway: {
        gateway_type: formData.gateway_type,

        enabled: !isShow,

        default: !isShow1,

        gateway: {
          key_id: formData.key_id,

          client_id: formData.client_id,

          name: formData.name,
          ...(formData.gateway_type==="ATOM"?{request_hash_key :formData.request_hash_key}:{}),
          ...(formData.gateway_type==="ATOM"?{request_salt_key  :formData.request_salt_key }:{}),
          ...(formData.gateway_type==="ATOM"?{resphashkey  :formData.resphashkey }:{}),
          ...(formData.gateway_type==="ATOM"?{responsesaltkey :formData.responsesaltkey}:{}),
        },
      },

      entity: formData.entity,

      entity_id: formData.entity_id,
    };
    setDisable(true)
    billingaxios
      .post("payment/v2/create/gateway", data, config)
      .then((response) => {
        props.onUpdate(response.data);
        setDisable(false)
        // toast.success("Payment Gateway was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
        // Modified by Marieya
        setShowModal(true);
         setModalMessage("Payment Gateway was added successfully");
        resetformmanually();
      })
      // .catch(function (error) {
      //   setDisable(false)
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   });
      //   console.error("Something went wrong!", error);
      // });
      .catch(function (error) {
        setDisable(false);
        // If an error message exists, assign it to errorMessage, else use a default message
        const errorMessage = error.response?.data?.detail ? error.response.data.detail : "Something went wrong";
        // Set the error message state which will be displayed in the modal
        setModalMessage(errorMessage);
      
        // Show the modal
        setShowModal(true);
      
        console.error("Something went wrong!", error);
      })
      
  };

  const resetformmanually = () => {
    setFormData({}); //Sailaja modified clear_form_data on 26th July
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => { };
  const resetForm = function () {
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({});
  };

  const form = useRef(null);

  useEffect(() => {
    billingaxios
      .get("payment/enh/gateways")
      .then((res) => {
        let { options } = res.data;
        // setPaymentType([...options]);
// Sailaja sorting the Add New Payment Gateway ->Gateway Dropdown data as alphabetical order on 24th March 2023
        setPaymentType(Sorting([...options],'name'));
      })
      .catch((err) => console.log(err));
  }, []);

  function togglesnmp() {
    setTogglesnmpState(togglesnmpState === "off" ? "on" : "off");
    setIsShow(!isShow);
  }

  function togglesnmp1() {
    setTogglesnmpState1(togglesnmpState1 === "off" ? "on" : "off");
    setIsShow1(!isShow1);
  }
  let newinputsdata = {...inputs}
  newinputsdata.payment_gateway_name = newinputsdata.name
  const paymentSubmit = (e) => {
    e.preventDefault();
    e = e.target.name;
    const validationErrors = validate(newinputsdata);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      addPayment();
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  // Sailaja added "entity","entity_id" in requiredFields on 3rd March
  
  let requiredFields;
  if(formData.gateway_type==="ATOM"){
     requiredFields = ["gateway_type", "payment_gateway_name", "entity",  "client_id", "key_id","request_hash_key","request_salt_key","resphashkey","responsesaltkey" ];
  }else{
     requiredFields = ["gateway_type", "payment_gateway_name", "entity",  "client_id", "key_id" ];
  }
  const { validate, Error } = useFormValidation(requiredFields);
  // added Entity and User id code by Marieya on 3/08/2022
  const getuserId = (val) => {
    billingaxios
      .get(`payment/${val}/options/list`)
      .then((res) => {
        let { entity_list } = res.data;
        // setPaymentUserid([...entity_list])
        // Sailaja sorting the Add New Payment Gateway ->Entity Dropdown data as alphabetical order on 24th March 2023
        setPaymentUserid(Sorting([...entity_list],'name'));

      });
  };
  // added options for entity by Marieya on 4/08/2022

  // hide drop dwon field after select admin
  const [hidefield, setHideField] = useState();

  // hide drop dwon field after select admin
  // const [hidefield, setHideField] = useState();
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row style={{ margintop: "-1%" }}>
          <Col sm="12">
            <Form
              onSubmit={paymentSubmit}
              id="myForm"
              onReset={resetForm}
              ref={form}
            >
              <Row>
                {/* <Col sm="4">
                          <Iconupload/>
                </Col> */}
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Gateway *</Label>

                      <Input
                        type="select"
                        name="gateway_type"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        onChange={(event) => {
                          handleInputChange(event);
                          setRazorPay(event.target.value);
                          setSelectedGateway(event.target.value)
                        }}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {paymentType.map((paymenttype) => (
                          <option value={paymenttype.id}>
                            {paymenttype.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    {/* Sailaja modified msg as Selection is required */}
                    <span className="errortext">
                      {errors.gateway_type && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
              </Row>
              {/* Rpay */}
              {showpayment ? (
                <>
                  <Row>
                    <Col sm="4">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Entity *</Label>
                          <Input
                            type="select"
                            name="entity"
                            className="form-control digits"
                            onChange={(event) => {
                              handleInputChange(event);
                              setHideField(event.target.value)
                            }}
                          // onBlur={checkEmptyValue}
                          >
                            <option style={{ display: "none" }}></option>
                            <option value="admin">
                              {"Admin"}
                            </option>
                            <option value="branch">
                              {"Branch"}
                            </option>
                            <option value="franchise">
                              {"Franchise"}
                            </option>
                          </Input>
                        </div>
                        {/* Sailaja Added Entity Validation msg for only Add Payment configuration on 3rd March */}
                        <span className="errortext">
                          {errors.entity && "Selection is required"}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col sm="4" hidden={hidefield === "admin"}>
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Entity ID *</Label>
                          <Input
                            type="select"
                            name="entity_id"
                            onChange={handleInputChange}
                            className="form-control digits"
                          // onBlur={checkEmptyValue}
                          >
                            <option style={{ display: "none" }}></option>
                            {paymentUserid.map((userid) => (
                              <option key={userid.id} value={userid.id}>
                                {userid.name}
                              </option>
                            ))}
                          </Input>
                        </div>
                          {/* Sailaja Added Entity ID Validation msg for only Add Payment configuration on 3rd March */}
                        <span className="errortext">
                          {errors.entity_id}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="4">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Name *</Label>

                          <Input
                            className="form-control"
                            type="text"
                            name="name"
                            onBlur={checkEmptyValue}
                            onChange={handleInputChange}
                          />
                        </div>
                        <span className="errortext">{errors.payment_gateway_name}</span>
                      </FormGroup>
                    </Col>
                    <Col sm="4">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Client ID *</Label>

                          <Input
                            className="form-control"
                            type="text"
                            name="client_id"
                            onBlur={checkEmptyValue}
                            onChange={handleInputChange}
                          />
                        </div>
                        <span className="errortext">
                          {errors.client_id}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col sm="4">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Key ID *</Label>

                          <Input
                            className="form-control"
                            type="text"
                            name="key_id"
                            onChange={handleInputChange}
                            onBlur={checkEmptyValue}
                          />
                        </div>
                        <span className="errortext">
                          {errors.key_id}
                        </span>
                      </FormGroup>
                    </Col>
                    
                    {selectedGateway === "ATOM"? <><Col sm="4">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Request - Hash Key *</Label>
                          <Input
                            type="text"
                            name="request_hash_key"
                            onChange={handleInputChange}
                            className="form-control digits"
                          // onBlur={checkEmptyValue}
                          >
                          </Input>
                        </div>
                          {/* Sailaja Added Entity ID Validation msg for only Add Payment configuration on 3rd March */}
                        {/* <span className="errortext">
                          {errors.entity_id}
                        </span> */}
                          <span className="errortext">
                          {errors.request_hash_key}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col sm="4">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Request - Salt Key *</Label>
                          <Input
                            type="text"
                            name="request_salt_key"
                            onChange={handleInputChange}
                            className="form-control digits"
                          // onBlur={checkEmptyValue}
                          >
                          </Input>
                        </div>
                          {/* Sailaja Added Entity ID Validation msg for only Add Payment configuration on 3rd March */}
                        {/* <span className="errortext">
                          {errors.entity_id}
                        </span> */}
                          <span className="errortext">
                          {errors.request_salt_key}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col sm="4">
                    <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Response - Hash Key *</Label>
                          <Input
                            type="text"
                            name="resphashkey"
                            onChange={handleInputChange}
                            className="form-control digits"
                          // onBlur={checkEmptyValue}
                          >
                          </Input>
                        </div>
                          {/* Sailaja Added Entity ID Validation msg for only Add Payment configuration on 3rd March */}
                        {/* <span className="errortext">
                          {errors.entity_id}
                        </span> */}
                          <span className="errortext">
                          {errors.resphashkey}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col sm="4">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Response - Salt Key *</Label>
                          <Input
                            type="text"
                            name="responsesaltkey"
                            onChange={handleInputChange}
                            className="form-control digits"
                          // onBlur={checkEmptyValue}
                          >
                          </Input>
                        </div>
                          {/* Sailaja Added Entity ID Validation msg for only Add Payment configuration on 3rd March */}
                        {/* <span className="errortext">
                          {errors.entity_id}
                        </span> */}
                          <span className="errortext">
                          {errors.responsesaltkey}
                        </span>
                      </FormGroup>
                    </Col></>:''}
                    <Col sm="4">
                      <Label className="kyc_label"> Enable</Label>
                      <FormGroup>
                        <div
                          className={`franchise-switch ${togglesnmpState}`}
                          onClick={togglesnmp}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="4">
                      <Label className="kyc_label"> Default</Label>
                      <FormGroup>
                        <div
                          className={`franchise-switch ${togglesnmpState1}`}
                          onClick={togglesnmp1}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              ) : (
                ""
              )}


              <Row style={{ marginTop: "-3%" }}>
                <span
                  className="sidepanel_border"
                  style={{ position: "relative" }}
                ></span>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                      id="create_button"
                      disabled={disable}
                    >
                      {disable ? <Spinner size="sm"> </Spinner> : null}
                      {Add}
                    </Button>
                    <Button type="reset" color="btn btn-primary" id="resetid">
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
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

export default AddPayment;