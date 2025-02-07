import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Label, Input ,Spinner} from "reactstrap";
import useFormValidation from "../../../customhooks/FormValidation";
// import {Globe} from "feather-icons";
import { default as axiosBaseURL } from "../../../../axios";
// import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import ErrorModal from "../../../common/ErrorModal";

import { ADMINISTRATION } from "../../../../utils/permissions";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const DisplayLeadSource = (props) => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
     //to disable button
     const [disable, setDisable] = useState(false);
     const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(props.lead);
  }, [props.rightSidebar]);

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  useEffect(() => {
    axiosBaseURL
      .get("/radius/source/display")
      // .then((res) => setData(res.data))
      .then((res) => {
        // console.log(res);
        setLeadUser(res.data);
      });
  }, []);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value.charAt(0).toUpperCase() +  e.target.value.slice(1) }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };



  // const handleSubmit = (e, id) => {
  //   // if (e.key === "Enter" || e.key === "NumpadEnter") {
  //   e.preventDefault();
  //   axiosBaseURL
  //     .patch("radius/source/" + id + "/edit", leadUser)
  //     .then((res) => {
  //       console.log(res);
  //       console.log(res.data);
  //       props.onUpdate(res.data);
  //       setIsdisabled(true);
  //     });
  //   // }
  // };

  const sourceDetails = (id) => {
    // setDisable(true)
    setIsdisabled(true);
    if (!isDisabled) {
      setIsLoading(true);
      axiosBaseURL
        .patch("radius/source/" + id + "/edit", leadUser)
        .then((res) => {
          setIsLoading(false);
          // setDisable(false)
          props.onUpdate(res.data);
          // toast.success("Lead Source was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setShowModal(true);
          setModalMessage("Lead Source was edited successfully");
          setIsdisabled(true);
          props.Refreshhandler();
        })
        // .catch(function (error) {
        //   setIsLoading(false);

        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        //   console.error("Something went wrong!", error);
        // })
        // Modified by Marieya
        .catch(function (error) {
          setIsLoading(false);
          setIsdisabled(false);
          setShowModal(true);        
            // The request was made and the server responded with a status code
            // Modified by Marieya
            if (error.response) {
              // The request was made and the server responded with a status code
              if (error.response.status === 500) {
                setModalMessage("Internal Server Error");
              } else if (error.response.status === 400) {
                setModalMessage("Something went wrong");
              } else {
                setModalMessage("Something went wrong");
              }
            } else if (error.request) {
              // The request was made but no response was received
              setModalMessage("Something went wrong");
            } else {
              // Something happened in setting up the request that triggered an Error
              setModalMessage("Something went wrong");
            }
          console.error("Something went wrong!", error);
        });
      // }
    }
  };

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };

 
  const requiredFields = ["lead_source_details_name"];
  const { validate, Error } = useFormValidation(requiredFields);

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    {/*changed keyname for Lead Source field by Marieya*/}
    let newleadUser = {...leadUser}
    newleadUser.lead_source_details_name = newleadUser.name
    const validationErrors = validate(newleadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      sourceDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  useEffect(()=>{
    if(props.openCustomizer){
      setErrors({});
    }
  }, [props.openCustomizer]);


  return (
    <Fragment>
      {token.permissions.includes(ADMINISTRATION.LEADUPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "8px", right: "64px" }} id="edit_icon"
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
          <Row id="leadsource_details">
            <Col md="4" id="moveup">
              <div className="input_wrap">
                {/* <Label>Lead Sources:</Label> */}
                <Label className="kyc_label">Lead Source *</Label>
                <Input
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
                  // onBlur={checkEmptyValue}
                  disabled={isDisabled}
                />
              </div>

              <span className="errortext">{errors.lead_source_details_name}</span>
            </Col>
          </Row>
          <Row>
          <span className="sidepanel_border" style={{position:"relative", top:"23px"}}></span>

          </Row>
          <br />
          <button type="submit" name="submit" class="btn btn-primary" id="save_button" disabled={isDisabled}>
          {isLoading ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp;
          &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            id="resetid"
            onClick={props.dataClose}
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

export default DisplayLeadSource;
