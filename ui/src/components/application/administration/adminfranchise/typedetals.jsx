import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Label ,Spinner} from "reactstrap";
import useFormValidation from "../../../customhooks/FormValidation";
// import { toast } from "react-toastify";
// import {Globe} from "feather-icons";
import { franchiseaxios } from "../../../../axios";
import EditIcon from "@mui/icons-material/Edit";
import { ADMINISTRATION } from "../../../../utils/permissions";
import ErrorModal from "../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const TypeDetail = (props) => {
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

  // useEffect(() => {
  //   franchiseaxios
  //     .get("franchise/status/create")
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       // console.log(res);
  //       setLeadUser(res.data);
  //     });
  // }, []);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value.charAt(0).toUpperCase() +  e.target.value.slice(1) }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  const statusDetails = (id) => {
    setDisable(true)
    setIsdisabled(true);
    if (!isDisabled) {
      franchiseaxios
        .patch("franchise/type/" + id + "/update", leadUser)
        .then((res) => {
          setDisable(false)
          props.onUpdate(res.data);
          setShowModal(true);
          setModalMessage("Type Details was edited successfully");
          // toast.success("Type Details was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          // Modified by Marieya
          setIsdisabled(true);
          props.Refreshhandler();
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
        });
      // }
    }
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;

    let newleadUser = { ...leadUser };
    newleadUser.franchise_type_name = newleadUser.name;
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
  // const blur = (e) => {
  //   e.preventDefault();
  //   console.log("u clicked false");
  //   setIsdisabled(true);
  // };
  const requiredFields = ["franchise_type_name"];
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
      {token.permissions.includes(ADMINISTRATION.FRANTYPEUPDATE) && (
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
          <Row style={{marginTop:"1%"}}>
            <Col md="4" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Franchise Type *</Label>

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
              </div>

              <span className="errortext">{errors.franchise_type_name}</span>
            </Col>
          </Row>
          <Row style={{marginTop:"-2%"}}>
          <span className="sidepanel_border" style={{position:"relative", top:"24px"}}></span>

          </Row>
          <br />
          <button type="submit" name="submit" class="btn btn-primary"id="save_button" disabled={isDisabled}>
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

export default TypeDetail;
