import React, { Fragment, useEffect, useState } from "react";
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
const StatusDetails = (props) => {
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  //to disable button
  const [disable, setDisable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");  
  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(props.lead);
  }, [props.rightSidebar]);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value.charAt(0).toUpperCase() +  e.target.value.slice(1) }));
  };

  const statusDetails = (id) => {
    setDisable(true)
    setIsdisabled(true);
    if (!isDisabled) {
      franchiseaxios
        .patch("franchise/status/" + id + "/update", leadUser)
        .then((res) => {
          setDisable(false)
          props.onUpdate(res.data);
          // toast.success("Status Details was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setShowModal(true);
          setModalMessage("Status Details was edited successfully");
          setIsdisabled(true);
          props.Refreshhandler()
        })
        .catch(function (error) {
          setDisable(false)
          setIsdisabled(false);
          setModalMessage("Something went wrong");
          // Show the error modal
          setShowModal(true);
          console.error("Something went wrong!", error);
          // toast.error("Something went wrong", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          // console.error("Something went wrong!", error);
        });
      // .catch(function (error) {
      //   console.error("Something went wrong!", error);
      //   // this.setState({ errorMessage: error });
      // });
      // }
    }
  };
{/* Sailaja created franchise status name in edit panel as status_name on 13th March 2023 */}
  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    let newleadUser = {...leadUser}
    newleadUser.status_name = newleadUser.name

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
{/* Sailaja added franchise status modified name in requiredFields on 13th March 2023 */}
  const requiredFields = ["status_name"];
  const { validate, Error } = useFormValidation(requiredFields);

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);
  return (
    <Fragment>
      {token.permissions.includes(ADMINISTRATION.FRANSTATUSUPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "8px", right: "64px" }}
          onClick={clicked}
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
          <Row style={{marginTop:"1%"}}>
            <Col md="4" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Status Name *</Label>

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
{/* Sailaja added franchise status name in edit panel on 13th March 2023 */}
<span className="errortext">{errors.status_name}</span>
              </div>
            </Col>
          </Row>
          <Row>
          <span className="sidepanel_border" style={{position:"relative",top:"23px"}}></span>

          </Row>
          <br />
          <button type="submit" name="submit" class="btn btn-primary" id="save_button" disabled={isDisabled}>
          {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp;
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

export default StatusDetails;
