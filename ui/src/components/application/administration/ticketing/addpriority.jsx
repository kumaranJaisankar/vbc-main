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
  CardHeader,
  Spinner,
} from "reactstrap";
import ImageUploader from "react-images-upload";
import InputMask from "react-input-mask";
import axios from "axios";
import { adminaxios } from "../../../../axios";
import { helpdeskaxios } from "../../../../axios";

// import { toast } from "react-toastify";
import { addNewProject } from "../../../../redux/project-app/action";

import {
  BasciInformation,
  Add,
  Cancel,
  InputSizing,
} from "../../../../constant";
import useFormValidation from "../../../customhooks/FormValidation";
import ErrorModal from "../../../common/ErrorModal";

const AddPriority = (props, initialValues) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    responsetime: "",
    resolutiontime: "",
    escalationnotificationmessage: "",
    notificationfrequency: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [branch, setBranch] = useState([]);

  const [permissions, setPermissions] = useState([]);
  {
    /*Spinner state added by Marieya on 25.8.22 */
  }
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [filter, setFilter] = useState({
    first_name: "",
    // branch:"",
    // area:"",
    // leadsource: "",
  });

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (target.name === "roles" || target.name === "permissions") {
      value = [target.value];
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
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      }));
    }

    // if(name === 'response_time' && value.split(":")[0] >7){
    //   setErrors({...errors, response_time: 'days should be less than 7'})
    // }else if(name === 'resolution_time' && value.split(":")[0] >7){
    //   setErrors({...errors, resolution_time: 'days should be less than 7'})
    // }else{
    //   setErrors({...errors, resolution_time: '', response_time: ''})
    // }
  };

  useEffect(() => {
    adminaxios
      .get("accounts/register/options")
      .then((res) => {
        let { roles, permissions, branches } = res.data;
        setRoles([...roles]);
        setPermissions([...permissions]);
        setBranch([...branches]);
      })
      // .catch((error) => console.log(error));
      .catch((error) => {
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is400Error = errorString.includes("400");
  
        if (is500Error) {
          setModalMessage("Internal Server Error");
        } else if (is400Error) {
          setModalMessage("Something went wrong");
        } else {
          setModalMessage("Something went wrong");
        }
        setShowModal(true);
        console.error("Something went wrong", error);
      });
  }, []);

  const priority = () => {
    setLoaderSpinner(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    helpdeskaxios
      .post("create/ticket/prioritysla", formData, config)
      .then((response) => {
        props.onUpdate(response.data);
        // toast.success("Ticket priority was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        setShowModal(true);
        setModalMessage("Ticket priority was added successfully");
        resetformmanually();
      })
      // Modified by Marieya 
      .catch(function (error) {
        setLoaderSpinner(false);
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is400Error = errorString.includes("400");
        if (is500Error) {
          setModalMessage("Internal Server Error");
        } else if (is400Error) {
          setModalMessage("Something went wrong");
        } else {
          setModalMessage("Something went wrong");
        }
        setShowModal(true);
        console.error("Something went wrong!", error);
      });
      
      // .catch(function (error) {
      //   setLoaderSpinner(false);
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   });
      //   console.error("Something went wrong!", error);
      // });
  };

  const resetformmanually = () => {
    setFormData({
      name: "",
      response_time: "",
      resolution_time: "",
      escalation_notification_message: "",
      notification_frequency: "",
    }); //Sailaja modified clear_form_data on 26th July
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();
  };

  const submit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    {
      /*Added new keyname for priority name by Marieya*/
    }
    let dataNew = { ...data };
    dataNew.priority_response_time = data.response_time;
    dataNew.priority_resolution_time = data.resolution_time;
    dataNew.priority_name = data.name;
    let validationErrors = validate(dataNew);

    if (
      !!dataNew.priority_response_time &&
      dataNew.priority_response_time.split(":")[0] > 7
    ) {
      validationErrors = {
        ...validationErrors,
        priority_response_time: "Days should be less than 7",
      };
    }
    if (
      !!dataNew.priority_resolution_time &&
      dataNew.priority_resolution_time.split(":")[0] > 7
    ) {
      validationErrors = {
        ...validationErrors,
        priority_resolution_time: "Days should be less than 7",
      };
    }

    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      priority();
    } else {
      console.log("errors try again", validationErrors);
    }
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

  const resetInputField = () => {};
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
  //validation
  const requiredFields = [
    "priority_name",
    "priority_response_time",
    "priority_resolution_time",
    "escalation_notification_message",
    "notification_frequency",
  ];
  const { validate, Error } = useFormValidation(requiredFields);

  const beforeMaskedValueChange1 = (newState, oldState, userInput) => {
    var { value } = newState;
    var selection = newState.selection;
    var cursorPosition = selection ? selection.start : null;

    // keep minus if entered by user
    if (
      !!formData.response &&
      value.endsWith("-") &&
      userInput !== "-" &&
      formData.response.endsWith("-")
    ) {
      if (cursorPosition === value.length) {
        cursorPosition--;
        selection = { start: cursorPosition, end: cursorPosition };
      }
      value = value.slice(0, -1);
    }

    return {
      value,
      selection,
    };
  };
  const beforeMaskedValueChange2 = (newState, oldState, userInput) => {
    var { value } = newState;
    var selection = newState.selection;
    var cursorPosition = selection ? selection.start : null;

    // keep minus if entered by user
    if (
      !!formData.resolution &&
      value.endsWith("-") &&
      userInput !== "-" &&
      formData.resolution.endsWith("-")
    ) {
      if (cursorPosition === value.length) {
        cursorPosition--;
        selection = { start: cursorPosition, end: cursorPosition };
      }
      value = value.slice(0, -1);
    }

    return {
      value,
      selection,
    };
  };
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Priority *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>

                    <span className="errortext">{errors.priority_name}</span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup style={{ paddingBottom: "1%" }}>
                    <div className="input_wrap">
                      <Label className="kyc_label">Response Time *</Label>
                      <Input
                        className="form-control not-empty"
                        type="time"
                        min="0"
                        // step="1"
                        name="response_time"
                        value={formData && formData.response}
                        onChange={handleInputChange}
                        // onBlur={checkEmptyValue}
                      ></Input>
                    </div>
                    <span className="errortext">
                      {errors.priority_response_time}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup style={{ paddingBottom: "1%" }}>
                    <div className="input_wrap">
                      <Label className="kyc_label">Resolution Time *</Label>
                      <Input
                        className="form-control not-empty"
                        type="time"
                        min="0"
                        // step="1"
                        name="resolution_time"
                        value={formData && formData.resolution}
                        onChange={handleInputChange}
                      ></Input>
                    </div>
                    <span className="errortext">
                      {errors.priority_resolution_time}
                    </span>
                  </FormGroup>
                </Col>
                {/* <Col sm="4">
                <Label className="placeholder_styling">
                       Response Time *
                </Label>
                  <FormGroup>
                    <div className="input_wrap add-priority-response-time">
                    <InputMask  
                     className="form-control "
                     id="meeting-time"
                     onChange={handleInputChange}
                     onBlur={checkEmptyValue}
                     name="response_time"
                     value={formData && formData.response_time}
                     maskPlaceholder="-:--:--"
                     mask="9:99:99" 
                     maskChar="-"
                     alwaysShowMask={true}
                     beforeMaskedValueChange={beforeMaskedValueChange1}/>
                   
                    </div>
                    <span className="errortext">{errors.response_time}</span>
                  </FormGroup>
                </Col> */}
                {/* <Col sm="4">
                  <Label className="placeholder_styling">
                    Resolution Time *
                  </Label>
                  <FormGroup>
                    <div className="input_wrap">
                      <InputMask
                        className="form-control "
                        id="meeting-time"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        name="resolution_time"
                        value={formData && formData.resolution_time}
                        maskPlaceholder="-:--:--"
                        mask="9:99:99"
                        maskChar="-"
                        alwaysShowMask={true}
                        beforeMaskedValueChange={beforeMaskedValueChange2}
                      />
                    </div>
                    <span className="errortext">{errors.resolution_time}</span>
                  </FormGroup>
                </Col> */}
              </Row>

              <Row style={{ marginTop: "-3%" }}>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Notification Message *
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="escalation_notification_message"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">
                      {errors.escalation_notification_message}
                    </span>

                    {/* <Error>{errors.escalation_notification_message}</Error>
                    <span className="errortext">{errors.escalation_notification_message && 'Notification Message is required'}</span> */}
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Notification Frequency *
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="notification_frequency"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">
                      {errors.notification_frequency}
                    </span>

                    {/* <Error>{errors.notification_frequency}</Error>
                    <span className="errortext">{errors.notification_frequency && 'Notification Frequency is required'}</span> */}
                  </FormGroup>
                </Col>
              </Row>

              <br />
              <br />
              <Row>
                <span
                  className="sidepanel_border"
                  style={{ position: "relative" }}
                ></span>
                {/*Spinner added to create button by Marieya on 25.8.22*/}
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                      id="create_button"
                      disabled={
                        loaderSpinneer ? loaderSpinneer : loaderSpinneer
                      }
                    >
                      {loaderSpinneer ? (
                        <Spinner size="sm" id="spinner"></Spinner>
                      ) : null}{" "}
                      &nbsp;
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

export default AddPriority;
