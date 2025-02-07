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
} from "reactstrap";

import { default as axiosBaseURL, networkaxios } from "../../../../../axios";
import { toast } from "react-toastify";
import { Add } from "../../../../../constant";
import useFormValidation from "../../../../customhooks/FormValidation";
import MaskedInput from "react-text-mask";
import { statusType } from "./radiushealthdropdown";
import { passwordStrength } from "check-password-strength";
import ErrorModal from "../../../../common/ErrorModal";

const AddRadius = (props, initialValues) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [image, setimage] = useState({ pictures: [] });
  const [roles, setRoles] = useState([]);
  const [branch, setBranch] = useState([]);
  const [radiuspasswordScore, setRadiusPasswordScrore] = useState({});
  const [reenterToggle, setReenterToggle] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [filter, setFilter] = useState({
    name: "",
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
        [name]: value,
      }));
    }
    if (name == "password") validatePassword(name, value);
  };

  // password
  const passwordScoreObj = [
    {
      id: 0,
      value: "Bad",
      minDiversity: 0,
      minLength: 0,
    },
    {
      id: 1,
      value: "Weak",
      minDiversity: 2,
      minLength: 4,
    },
    {
      id: 2,
      value: "Medium",
      minDiversity: 3,
      minLength: 6,
    },
    {
      id: 3,
      value: "Strong",
      minDiversity: 4,
      minLength: 8,
    },
  ];
  const validatePassword = (name, value) => {
    const passwordStrengthObj = passwordStrength(value, passwordScoreObj);
    setRadiusPasswordScrore((prevState) => {
      return {
        ...prevState,
        [name]: passwordStrengthObj,
      };
    });
  };

  const getPasswordStatus = (current) => {
    switch (current && current.id) {
      case 0:
        return (
          <span>
            {" "}
            Strength : <span className="password-bad">{current.value} </span>
          </span>
        );
      case 1:
        return (
          <span>
            {" "}
            Strength : <span className="password-weak">{current.value}</span>
          </span>
        );
      case 2:
        return (
          <span>
            {" "}
            Strength : <span className="password-medium">{current.value}</span>
          </span>
        );
      case 3:
        return (
          <span>
            {" "}
            Strength : <span className="password-strong">{current.value}</span>
          </span>
        );
      default:
        return null;
    }
  };

  // password end

  useEffect(() => {
    axiosBaseURL
      .get("/accounts/register/options")
      .then((res) => {
        let { roles, permissions, branches } = res.data;
        setRoles([...roles]);
        setPermissions([...permissions]);
        setBranch([...branches]);
      })
      .catch(() => {
        console.log("error");
        // toast.error("error get register options", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose:1000
        // });
      });
  }, []);

  const resetformmanually = () => {
    setFormData({
      name: "",
    });    
    //Sailaja modified clear_form_data on 26th July
    setRadiusPasswordScrore({});
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();
  };

  const leadsrc = () => {
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    networkaxios
      .post("network/radius/create", formData, config)
      .then((response) => {
        props.onUpdate(response.data);
        // toast.success("Radius was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
        setShowModal(true);
        setModalMessage("Radius was added successfully");
        resetformmanually();
      })
      // .catch(function (error) {
      //   toast.error("error while add radius");
      // });
      .catch(function (error) {
        console.error("Error while adding radius:", error);
        let errorMessage = "Error while adding radius";
        if (error.response && error.response.data && error.response.data.name) {
            errorMessage = error.response.data.name[0];
        }
        setShowModal(true);
        setModalMessage(errorMessage);
    });
    
    // Modified by Marieya
  };

  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    let dataNew = { ...formData };
    dataNew.radius_password = dataNew.password;
    dataNew.nas_name = dataNew.name;
    dataNew.radius_username = dataNew.username;
    delete dataNew.password;
    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      leadsrc();
    } else {
      // toast.error("error in form data");
      setShowModal(true);
      setModalMessage("error in form data");
    }
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => {};
  const resetForm = function () {
    setRadiusPasswordScrore({});
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
    "nas_name",
    "ip_address",
    "radius_username",
    "status",
    "radius_password",
  ];
  const { validate, Error } = useFormValidation(requiredFields);
  // ipprops
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

  //end
  return (
    <Fragment>
      <Container fluid={true}>
        <Row className="form_layout">
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Name *</Label>

                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                    </div>
                    <span className="errortext">{errors.nas_name}</span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label" style={{ left: "0% " }}>
                        IP Address *
                      </Label>
                      <MaskedInput
                        {...ipprops}
                        style={{
                          // border: "1px solid black",
                          width: "100%",
                          height: "calc(1.5em + 0.75rem + 2px)",
                          padding: "0.375rem 0.75rem",
                          fontSize: "1rem",
                          padding: "0.375rem 0.75rem",
                          fontWweight: "400",
                          lineHeight: "1.5",
                          color: "#495057",
                          backgroundColor: "#fff",
                          borderRadius: "0.25rem",
                          borderTopColor: "rgb(206, 212, 218)",
                          borderLeftColor: "rgb(206, 212, 218)",
                          borderTopWidth: "1px",
                          borderBottomColor: "rgb(206, 212, 218)",

                          borderRightColor: "rgb(206, 212, 218)",
                        }}
                        onBlur={checkEmptyValue}
                        name="ip_address"
                        onChange={handleInputChange}
                        value={formData && formData.ip_address}
                        className={`form-control  ${
                          formData && formData.ip_address ? "not-empty" : ""
                        }`}
                      />
                    </div>
                    <span className="errortext">{errors.ip_address && "Field is required"}</span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">User Name *</Label>
                      <Input
                        className="form-control not-empty"
                        type="text"
                        name="username"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                    </div>
                    <span className="errortext">{errors.radius_username}</span>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="4" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label
                        className="kyc_label "
                        // className="not-empty"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Password *
                      </Label>
                      <Input
                        className="form-control not-empty"
                        type={reenterToggle ? "text" : "password"}
                        name="password"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />

                      <div
                        className="show-hide"
                        style={{ top: "48px", right: "10px" }}
                        onClick={() => setReenterToggle(!reenterToggle)}
                      >
                        <i
                          className={
                            reenterToggle ? "fa fa-eye" : "fa fa-eye-slash"
                          }
                        ></i>
                      </div>
                      {getPasswordStatus(
                        radiuspasswordScore
                          ? radiuspasswordScore.password
                          : null
                      )}
                      <br />
                      <span className="errortext">
                        {errors.radius_password}
                      </span>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Status *</Label>

                      <Input
                        type="select"
                        name="status"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.status}
                        className={`form-control  ${
                          formData && formData.status ? "not-empty" : ""
                        }`}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {statusType.map((status) => {
                          return (
                            <option value={status.id}>{status.name}</option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">{errors.status && "Selection is required"}</span>
                  </FormGroup>
                </Col>
              </Row>
              <br />
              <div className="password-notes" style={{ marginTop: "-44px" }}>
                <div style={{ fontWeight: "500" }}>Password Field Strength :</div>
                <ul>
                  <li>At least 8 characters—the more characters, the better</li>
                  <li>A mixture of both uppercase and lowercase letters</li>
                  <li>A mixture of letters and numbers</li>
                  <li>
                    Inclusion of at least one special character, e.g., ! @ # ? ]
                  </li>
                </ul>
              </div>
              <br />

              <Row>
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
                      disabled={
                        !radiuspasswordScore ||
                        !radiuspasswordScore.password ||
                        (radiuspasswordScore &&
                          radiuspasswordScore.password &&
                          radiuspasswordScore.password.id != 3)
                      }
                    >
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

export default AddRadius;
