import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Label, Input, Spinner } from "reactstrap";
// import {Globe} from "feather-icons";
import { default as axiosBaseURL } from "../../../../axios";
import useFormValidation from "../../../customhooks/FormValidation";
// import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { ADMINISTRATION } from "../../../../utils/permissions";
import ErrorModal from "../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const DisplayLeadType = (props) => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  const [errors, setErrors] = useState({});
  //to disable button
  const [disable, setDisable] = useState(false);
  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(props.lead);
  }, [props.rightSidebar]);

  useEffect(() => {
    axiosBaseURL
      .get("/radius/type/display")
      // .then((res) => setData(res.data))
      .then((res) => {
        setLeadUser(res.data);
      });
  }, []);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };


  const typeDetails = (id) => {
    setDisable(true)
    if (!isDisabled) {
      axiosBaseURL
        .patch("radius/type/" + id + "/edit", leadUser)
        .then((res) => {
          setDisable(false)
          props.onUpdate(res.data);
          setShowModal(true);
          setModalMessage("Lead Type was edited successfully");
          // toast.success("Lead Type was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setIsdisabled(true);
          props.Refreshhandler()
        })
        // .catch(function (error) {
        //   setDisable(false)
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        // });
        .catch(function (error) {
          setDisable(false);
          // Modified by Marieya
          setShowModal(true); // Set the modal to be visible
          const status = error.response ? error.response.status : null;
          
          // Customize the error message based on status code
          if (status === 500) {
            setModalMessage("Internal Server Error");
          } else {
            setModalMessage("Something went wrong");
          }
          
          console.error("Something went wrong!", error);
        });
        
      // }
    }
  };
  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    {/*Added new keyname for Name field validation by Marieya on 23.8.22*/ }
    let newleadUser = { ...leadUser }
    newleadUser.lead_type_details_name = newleadUser.name

    const validationErrors = validate(newleadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      typeDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };
  // const blur = (e) => {
  //   e.preventDefault();
  //   console.log("u clicked false");
  //   setIsdisabled(true);
  // };
  const requiredFields = ["lead_type_details_name"];
  const { validate, Error } = useFormValidation(requiredFields);
  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);


  useEffect(() => {
    if (props.openCustomizer) {
      setErrors({});
    }
  }, [props.openCustomizer]);

  return (
    <Fragment>
      {token.permissions.includes(ADMINISTRATION.LEADTYPEUPDATE) && (
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
          <Row style={{ marginTop: "3%" }}>
            <Col md="4" id="moveup">
              <div className="input_wrap">
                <Label className="kyc_label">Lead Type *</Label>
                <Input
                  className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
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
              <span className="errortext">{errors.lead_type_details_name}</span>
            </Col>
          </Row>
          <Row style={{ marginTop: "-2%" }}>
            <span className="sidepanel_border" style={{ position: "relative", top: "22px" }}></span>

          </Row>
          <br />
          <button type="submit" name="submit" class="btn btn-primary" id="save_button" disabled={disable}>
            {disable ? <Spinner size="sm"> </Spinner> : null}
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

export default DisplayLeadType;
