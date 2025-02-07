import React, { Fragment, useEffect, useState } from "react"; 

import { Container, Row, Col, Form, Label, Input, FormGroup,Spinner } from "reactstrap";
import useFormValidation from "../../../customhooks/FormValidation";
import { default as axiosBaseURL, helpdeskaxios } from "../../../../axios";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { ADMINISTRATION } from "../../../../utils/permissions";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const PriorityDetails = (props) => {
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  //to disable button
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setLeadUser(props.lead);
    setDisable(false)
  }, [props.lead]);

  useEffect(() => {
    setLeadUser(props.lead);
    setDisable(false)
    setIsdisabled(true);
  }, [props.rightSidebar]);

  useEffect(() => {
    // var now = new Date(props.lead.response_time);
    // now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // const opendateFomated = now.toISOString().slice(0, 16);

    // setLeadUser({  
    //   ...props.lead,
    //   response_time: opendateFomated,
    // });

    axiosBaseURL
      .get("accounts/department/list")
      // .then((res) => setData(res.data))
      .then((res) => {
        // console.log(res);
        setLeadUser(res.data);
      });
  }, []);

  const handleChange = (e, date) => {
    setstartDate(date);
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value.charAt(0).toUpperCase() +  e.target.value.slice(1)}));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

 

  // const handleSubmit = (e, id) => {
  //   // if (e.key === "Enter" || e.key === "NumpadEnter") {
  //   e.preventDefault();
  //   helpdeskaxios.patch(`rud/${id}/ticket/prioritysla`, leadUser).then((res) => {
  //     console.log(res);
  //     console.log(res.data);
  //     props.onUpdate(res.data);
  //     setIsdisabled(true);
  //   });
  //   // }
  // };

  const priorityDetails = (id) => {
    setDisable(true)
    setIsdisabled(true);
    if (!isDisabled) {
      helpdeskaxios
        .patch(`rud/${id}/ticket/prioritysla`, leadUser)
        .then((res) => {
          setDisable(false)
          console.log(res);
          console.log(res.data);
          props.onUpdate(res.data);
          // Modified by Marieya
          // toast.success("Ticket Priority was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          props.setShowModal(true);
          props.setModalMessage("Ticket priority was edited successfully");
          setIsdisabled(true);
          props.Refreshhandler()
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
          setIsdisabled(false);
          const errorString = JSON.stringify(error);
          const is500Error = errorString.includes("500");
          const is400Error = errorString.includes("400");
        // Modified by Marieya
          if (is500Error) {
            props.setModalMessage("Internal Server Error");
          } else if (is400Error) {
            props.setModalMessage("Something went wrong");
          } else {
            props.setModalMessage("Something went wrong");
          }
          
          props.setShowModal(true);
          console.error("Something went wrong", error);
        });
        
      // }
    }
  };
  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    {/*Added new keyname for priority name by Marieya*/}
    let dataNew = { ...leadUser }
    dataNew.priority_name = dataNew.name
    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      priorityDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
  };
  // const blur = (e) => {
  //   e.preventDefault();
  //   console.log("u clicked false");
  //   setIsdisabled(true);
  // };

  const [startDate, setstartDate] = useState(new Date());
// Sailaja Added  "escalation_notification_message" & "notification_frequency" as requiredFields in Priotity Edit pannel on 3rd March
  const requiredFields = ["priority_name", "response_time", "notification_frequency","escalation_notification_message","resolution_time"];
  const { validate, Error } = useFormValidation(requiredFields);

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  useEffect(()=>{
    if(props.openCustomizer){
      setErrors({});
    }
  }, [props.openCustomizer]);
  
  return (
    <Fragment>
      {token.permissions.includes(ADMINISTRATION.TICKETPARUPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "8px", right: "64px" }} id="edit_icon"
          onClick={clicked}
        />
      )}

      <br />
      <Container fluid={true}>
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row style={{marginTop:"3%"}}>
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Priority *</Label>
                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="name"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.name}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isDisabled}
                  />
                </div>
                <span className="errortext">{errors.priority_name}</span>
              </FormGroup>
            </Col>
            {/* <Col md="6">
            <Label>Response Time</Label>

              <div className="input_wrap">
                <Input
                  className="form-control"
                  type="text"
                  id="responseTime"
                  name="response_time"

                  value={
                    leadUser &&
                    moment
                      .utc(leadUser.response_time)
                      .format("YYYY-MM-DDThh:mm")
                  }
                  onChange={handleChange}
                 
                  disabled={isDisabled}
                  maxLength="15"
                />
                <Label
                  for="meeting-time"
                  className="placeholder_styling"
                ></Label>
              </div>
              <span className="errortext">{errors.response_time}</span>
             
            </Col> */}
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Response Time *</Label>
                  
                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    style={{ border: "none", outline: "none" }}
                    id="afterfocus"
                    value={leadUser && leadUser.response_time}
                    disabled={isDisabled}
                    type="time"
                    min="0"
                    // step="1"
                    name="response_time"
                    onChange={handleChange}
                  />
                </div>
                <span className="errortext">{errors.response_time}</span>
              </FormGroup>
            </Col>
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Resolution Time *</Label>

                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    style={{ border: "none", outline: "none" }}
                    id="afterfocus"
                    value={leadUser && leadUser.resolution_time}
                    disabled={isDisabled}
                    type="time"
                    min="0"
                    // step="1"
                    name="resolution_time"
                    onChange={handleChange}
                  />
                </div>
                <span className="errortext">{errors.resolution_time}</span>
              </FormGroup>
            </Col>
            {/* <Col md="4">
              <Label>Resolution Time</Label>
              <input
                id="afterfocus"
                type="text"
                name="resolution_time"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.resolution_time}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
            </Col>
            <span className="errortext">{errors.resolution_time}</span> */}
          </Row>
          <Row style={{marginTop:"2%"}}>
            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">
                    Notification Message
                  </Label>
                  <Input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="escalation_notification_message"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.escalation_notification_message}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isDisabled}
                  />
                  
                </div>
                {/* Sailaja Changed the position of span to fire validation on below the field on 3rd march */}
                <span className="errortext">
              {errors.escalation_notification_message}
            </span>
              </FormGroup>
            </Col>
           

            <Col md="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">
                    Notification Frequency
                  </Label>
                  <Input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="notification_frequency"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.notification_frequency}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isDisabled}
                  />
                
                </div>
              <span className="errortext">{errors.notification_frequency}</span>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{marginTop:"-2%"}}>
          <span className="sidepanel_border" style={{position:"relative", top:"23px"}}></span>

          </Row>
          {/* <DatePicker className="form-control digits" name="response_time" showPopperArrow={false} selected={startDate} showTimeSelect dateFormat="Pp" onChange={handleChange}  value={leadUser && leadUser.response_time}/> */}
          <br />
          <button type="submit" name="submit" class="btn btn-primary" id="save_button" disabled={isDisabled}>
          {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp;
          &nbsp;
          <button
            type="submit"
            name="submit"
            id="resetid"
            class="btn btn-secondary"
            onClick={props.dataClose}
          >
            Cancel
          </button>
        </Form>
      </Container>
    </Fragment>
  );
};

export default PriorityDetails;
