import React, { Fragment, useEffect, useState } from "react"; //hooks
import { Container, Row, Col, Form, Label, Input, FormGroup } from "reactstrap";
import { networkaxios } from "../../../../../axios";
import useFormValidation from "../../../../customhooks/FormValidation";
// import { toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import MaskedInput from "react-text-mask";
import { statusType } from "./radiushealthdropdown";
import EditIcon from '@mui/icons-material/Edit';
import { NETWORK } from "../../../../../utils/permissions";
import ErrorModal from "../../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}
const RadiusDetails = (props) => {
  const [errors, setErrors] = useState({});

  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  //ipprops
  const ipprops = {
    guide: true,
    mask: (value) => {
      let result = [];
      const chunks = value.split(".");

      for (let i = 0; i < 4; ++i) {
        const chunk = (chunks[i] || "").replace(/_/gi, "");

        if (chunk === "") {
          result.push(/\d/, /\d/, /\d/, ".");
          continue;
        } else if (+chunk === 0) {
          result.push(/\d/, ".");
          continue;
        } else if (
          chunks.length < 4 ||
          (chunk.length < 3 && chunks[i].indexOf("_") !== -1)
        ) {
          if (
            (chunk.length < 2 && +`${chunk}00` > 255) ||
            (chunk.length < 3 && +`${chunk}0` > 255)
          ) {
            result.push(/\d/, /\d/, ".");
            continue;
          } else {
            result.push(/\d/, /\d/, /\d/, ".");
            continue;
          }
        } else {
          result.push(...new Array(chunk.length).fill(/\d/), ".");
          continue;
        }
      }

      result = result.slice(0, -1);
      return result;
    },
    pipe: (value) => {
      if (value === "." || value.endsWith("..")) return false;

      const parts = value.split(".");

      if (
        parts.length > 4 ||
        parts.some((part) => part === "00" || part < 0 || part > 255)
      ) {
        return false;
      }

      return value;
    },
  };

  useEffect(() => {
    if (!!props.lead)
      setLeadUser((prevState) => {
        return {
          ...prevState,
          ...props.lead,
        };
      });
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);

    if (!isEmpty(props.lead)) {
      let leadData = { ...props.lead };
      for (let key in leadData.address) {
        if (key !== "id") {
          leadData[key] = leadData.address[key];
        }
      }
      if (!!props.lead)
        setLeadUser((prevState) => {
          return {
            ...prevState,
            ...props.lead,
          };
        });
    }
  }, [props.rightSidebar]);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const branchDetails = (id) => {
    if (!isDisabled) {
      networkaxios
        .patch(`/network/radius/rud/${id}`, leadUser)
        .then((res) => {
          props.onUpdate(res.data);
          // toast.success("Radius was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setShowModal(true);
          setModalMessage("Radius was edited successfully");
          props.Refreshhandler()
          setIsdisabled(true);
        })
        // .catch(function (error) {
        //   console.log(error,"errr")
        //   if (error.response && error.response.data) {
        //     setErrors(error.response.data);
        //   }
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        // });
        // Modified by Marieya
        .catch(function (error) {
          console.log(error,"errr")
          let errorMessage = "Something went wrong";
          if (error.response && error.response.data) {
            setErrors(error.response.data);
            
            if (error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } 
          }
          setShowModal(true);
          setModalMessage(errorMessage);
        });
        
    }
  };
  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    let dataNew = { ...leadUser };
    dataNew.radius_password = dataNew.password;
    delete dataNew.password;
    dataNew.radius_username = dataNew.username;
    dataNew.nas_name = dataNew.name;
    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      branchDetails(id);
    }
    //  else {
     
    //   toast.error("error in form", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1000,
    //   });
    // }
    else {
      setShowModal(true);
      setModalMessage("Error in form");
    }    
  };

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };

  const requiredFields = ["nas_name", "radius_username", "ip_address"];
  const { validate } = useFormValidation(requiredFields);

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
      {token.permissions.includes(NETWORK.RADIUSUPDATE) && (

        <EditIcon  className="icofont icofont-edit"  style={{ top: "7", right:"64px"  }}   onClick={clicked}
       // disabled={isDisabled} 
      />
      )}
      <Container fluid={true}>
        <br />
        <Form>
          <Row style={{marginTop:"4%"}}>
            <Col md="4" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Name *</Label>

                <Input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="text"
                  name="name"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.name}
                  onChange={handleChange}
                  disabled={isDisabled}
                ></Input>
              </div>
              <span className="errortext">{errors.nas_name}</span>
            </Col>
            <Col md="4" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">IP Address</Label>

                <MaskedInput
                  {...ipprops}
                  id="afterfocus"
                  type="text"
                  name="ip_address"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.ip_address}
                  onChange={handleChange}
                  disabled={isDisabled}
                  className={`form-control  ${
                    leadUser && leadUser.ip_address ? "not-empty" : ""
                  }`}
                />
              </div>
              <span className="errortext">{errors.ip_address}</span>
            </Col>
            {/* <Col md="4" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_labelbel">Username *</Label>

                <Input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="text"
                  name="username"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.username}
                  onChange={handleChange}
                  disabled={isDisabled}
                ></Input>
              </div>
              <span className="errortext">{errors.radius_username}</span>
            </Col> */}
              <Col sm="4"  id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Status</Label>

                  <Input
                    id="afterfocus"
                    style={{ color: "#495057",border: "none", outline: "none" }}z
                    type="select"
                    name="status"
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    disabled={isDisabled}
                    onChange={handleChange}
                    value={leadUser && leadUser.status}
                  >
                    {statusType.map((statType) => {
                      return (
                        <option value={statType.id}>{statType.name}</option>
                      );
                    })}
                  </Input>
                </div>
                <span className="errortext">
                  {errors.status && "Select status"}
                </span>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {/* <Col md="4">
              <div className="input_wrap">
              <Label className="kyc_labelbel">Password</Label>
                <Input
                  id="afterfocus"
                  type="text"
                  name="password"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.password}
                  onChange={handleChange}
                  // className={`form-control digits not-empty`}
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  disabled={isDisabled}
                ></Input>
              </div>
              <span className="errortext">{errors.password}</span>
            </Col> */}
          
          </Row>
          <Row style={{marginTop:"-5%"}}>
          <span className="sidepanel_border" style={{position:"relative", top:"25px"}}></span>
          </Row>
          <br />
          <button
            type="button"
            name="submit"
            class="btn btn-primary"
            onClick={(e) => {
              handleSubmit(e, props.lead.id);
            }}
            id="save_button"
          >
            Save
          </button>
          &nbsp;
          &nbsp;
          &nbsp;
          <button
            type="button"
            name="Cancel"
            class="btn btn-secondary"
            onClick={props.dataClose}
            id="resetid"
            style={{width:"95px", height:"39px"}}
          >
           <p id="radius_cancel">Cancel</p> 
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

export default RadiusDetails;
