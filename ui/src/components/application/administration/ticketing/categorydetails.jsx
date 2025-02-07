import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Label, Input, Spinner } from "reactstrap";
// import {Globe} from "feather-icons";
import { default as axiosBaseURL, helpdeskaxios } from "../../../../axios";
import useFormValidation from "../../../customhooks/FormValidation";
// import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { ADMINISTRATION } from "../../../../utils/permissions";
import ErrorModal from "../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const CategoryDetails = (props) => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  //to disable button
  const [disable, setDisable] = useState(false);
  // email toggle
  const [emailToggle, setEmailToggle] = useState("off");
  const [isShow, setIsshow] = React.useState(false);
  function EmailToggle() {
    setEmailToggle(emailToggle === "off" ? "on" : "off");
    setIsshow(!isShow);
  }
  // esits email
  const [emailToggle1, setEmailToggle1] = useState("on");
  const [isShow1, setIsshow1] = React.useState(true);
  function EmailToggle1() {
    setEmailToggle1(emailToggle1 === "on" ? "off" : "on");
    setIsshow1(!isShow1);
  }

  useEffect(() => {
    setLeadUser(props.lead);
    setDisable(false)
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(props.lead);
    setDisable(false)
  }, [props.rightSidebar]);

  useEffect(() => {
    axiosBaseURL
      .get("accounts/department/list")
      // .then((res) => setData(res.data))
      .then((res) => {
        // console.log(res);
        setLeadUser(res.data);
      })
      .catch((error) => {
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is400Error = errorString.includes("400");
  
        if (is500Error) {
          setShowModal(true);
          setModalMessage("Internal Server Error");
        } else if (is400Error) {
          setShowModal(true);
          setModalMessage("Something went wrong!");
        }
      });
  }, []);

  const handleChange = (e) => {
    setLeadUser((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
    }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  // const handleSubmit = (e, id) => {
  //   e.preventDefault();
  //   helpdeskaxios.patch(`rud/${id}/ticket/category`, leadUser).then((res) => {
  //     console.log(res);
  //     console.log(res.data);
  //     props.onUpdate(res.data);
  //     setIsdisabled(true);
  //   });
  // };

  const cateDetails = (id) => {
    setDisable(true);
    setIsdisabled(true);
    if (!isDisabled) {
      helpdeskaxios
        .patch(`rud/${id}/ticket/category`, leadUser)
        .then((res) => {
          setDisable(false);
          console.log(res);
          console.log(res.data);
          props.onUpdate(res.data);
          setShowModal(true);
          setModalMessage("Ticket Category was edited successfully");
          // Modified by Marieya
          // toast.success("Ticket Category was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setIsdisabled(true);
          props.Refreshhandler();
        })
        // .catch(function (error) {
        //   setDisable(false);
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        //   console.error("Something went wrong!", error);
        // });
        .catch(function (error) {
          setDisable(false);
          setIsdisabled(false);
          // Set the modal message
          setModalMessage("Something went wrong");
          // Show the error modal
          setShowModal(true);
          console.error("Something went wrong!", error);
        });
      // }
    }
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    {
      /*changed keyname for category and subject fields by Marieya*/
    }
    let newleadUser = { ...leadUser };
    newleadUser.new_ticket_category = newleadUser.category;
    newleadUser.new_subject = newleadUser.subject;
    const validationErrors = validate(newleadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      cateDetails(id);
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
  const requiredFields = ["new_ticket_category", "new_subject"];
  const { validate, Error } = useFormValidation(requiredFields);

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  // setting erros empty when clicking on multiple ids
  useEffect(() => {
    if (props.openCustomizer) {
      setErrors({});
    }
  }, [props.openCustomizer]);
  return (
    <Fragment>
      {token.permissions.includes(ADMINISTRATION.TICKETCATUPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "8px", right: "64px" }}
          id="edit_icon"
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
          <Row style={{ marginTop: "32px" }}>
            <Col md="4" id="moveup">
              <div className="input_wrap">
                <Label className="kyc_label">Category *</Label>
                <Input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="text"
                  name="category"
                  style={{
                    border: "none",
                    outline: "none",
                    textTransform: "capitalize",
                  }}
                  value={leadUser && leadUser.category}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={isDisabled}
                />

                <span className="errortext">{errors.new_ticket_category}</span>
              </div>
            </Col>
            <Col md="4" id="moveup">
              {/* <Label>Subject</Label> */}
              <div className="input_wrap">
                <Label className="kyc_label">Subject *</Label>
                <Input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="text"
                  name="subject"
                  style={{
                    border: "none",
                    outline: "none",
                    textTransform: "capitalize",
                  }}
                  value={leadUser && leadUser.subject}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={isDisabled}
                />

                <span className="errortext">{errors.new_subject}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <span
              className="sidepanel_border"
              style={{ position: "relative", top: "23px" }}
            ></span>
          </Row>
          <br />
          <button
            type="submit"
            name="submit"
            class="btn btn-primary"
            id="save_button"
            disabled={isDisabled}
          >
            {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp; &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            onClick={() => {
              setDisable(false);
              props.dataClose();
            }}

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

export default CategoryDetails;
