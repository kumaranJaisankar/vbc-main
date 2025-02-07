import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Label,Spinner } from "reactstrap";
import useFormValidation from "../../../customhooks/FormValidation";
// import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
// import {Globe} from "feather-icons";
import { franchiseaxios } from "../../../../axios";
import { ADMINISTRATION } from "../../../../utils/permissions";
import ErrorModal from "../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const SmsgatewayDetails = (props) => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");  
    //to disable button
    const [disable, setDisable] = useState(false);
  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(props.lead);
  }, [props.rightSidebar]);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value.charAt(0).toUpperCase() +  e.target.value.slice(1) }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  const statusDetails = (id) => {
    setDisable(true)
    setIsdisabled(true);
    if (!isDisabled) {
      franchiseaxios
        .patch("franchise/smsgateway/" + id + "/update", leadUser)
        .then((res) => {
          setDisable(false)
          props.onUpdate(res.data);
          // toast.success("Sms Gateway was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setShowModal(true);
          setModalMessage("Sms Gateway was edited successfully");
          setIsdisabled(true);
          props.Refreshhandler()
        })
        .catch(function (error) {
          setDisable(false)
          setIsdisabled(false);
          // toast.error("Something went wrong", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          // Modified by Marieya
          // console.error("Something went wrong!", error);
          setModalMessage("Something went wrong");
          // Show the error modal
          setShowModal(true);
          console.error("Something went wrong!", error);
        });
      // .catch(function (error) {
      //   console.error("Something went wrong!", error);
      //   // this.setState({ errorMessage: error });
      // });
      // }
    }
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    {/*Added new keyname for sms gateway name by Marieya*/}
    let newleadUser = {...leadUser}
    newleadUser.sms_gateway_name = newleadUser.name
    const validationErrors = validate(newleadUser);
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
    setIsdisabled(false);
  };

  const requiredFields = ["sms_gateway_name"];
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
      {token.permissions.includes(ADMINISTRATION.FRANSMSUPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "8px", right: "64px"}}
          onClick={clicked}
          id="edit_icon"
          // disabled={isDisabled}
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
              <div className="input_wrap">
              <Label className="kyc_label">
                  SMS Gateway *
                </Label>
                <input
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
                ></input>
            

                <span className="errortext">{errors.sms_gateway_name}</span>
              </div>
            </Col>
          </Row>
          <Row>
          <span className="sidepanel_border" style={{position:"relative", top:"24px"}}></span>

          </Row>
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

export default SmsgatewayDetails;
