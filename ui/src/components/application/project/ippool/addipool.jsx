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
  Spinner,
} from "reactstrap";

import { networkaxios, adminaxios } from "../../../../axios";
// import { toast } from "react-toastify";
import { Add } from "../../../../constant";
import useFormValidation from "../../../customhooks/FormValidation";
import MaskedInput from "react-text-mask";
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../common/Sorting";
import ErrorModal from "../../../common/ErrorModal";


//added changes in line 21 by Marieya
const AddIpPool = (props, initialValues) => {
  const [formData, setFormData] = useState({
    branch: JSON.parse(localStorage.getItem("token"))?.branch?.id
      ? JSON.parse(localStorage.getItem("token")).branch.id
      : "",
    name: "",
    ip_address_from: "",
    ip_address_to: "",
    description: "",
    serial_no: "",
    cost_per_ip: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [resetStatus, setResetStatus] = useState(false);
  const [nasList1, setNaList1] = useState([]);
  {
    /*Spinner state added by Marieya on 25.8.22 */
  }
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  // nas
  const [nasList, setNaList] = useState([]);

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

  const handleInputChange = (event) => {
    event.persist();
    setResetStatus(false);

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

    if (name == "branch") {
      getNasList(value);
    }
  };

  // branch lis
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // setBranch([...res.data]);
// Sailaja sorting the IP Pool Branch Dropdown data as alphabetical order on 24th March 2023
        setBranch(Sorting([...res.data],'name'));

      })
      // .catch(() =>
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   })
      // );
      // Modified by Marieya
      .catch(() => {
        setShowModal(true);
        setModalMessage("Something went wrong");
      });      
  }, []);

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("token")) &&
      JSON.parse(localStorage.getItem("token")).branch === null
    ) {
    } else {
      networkaxios
        .get(
          `network/nas/filter?branch=${
            JSON.parse(localStorage.getItem("token")) &&
            JSON.parse(localStorage.getItem("token")).branch &&
            JSON.parse(localStorage.getItem("token")).branch.id
          }`
        )
        .then((response) => {
          console.log(response.data);
          // setNaList1(response.data);
          // Sailaja sorting the Branch Login IP Pool NAS Dropdown data as alphabetical order on 24th March 2023
           setNaList1(Sorting((response?.data),'name'));
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }
  }, []);

  const getNasList = (branchid) => {
    networkaxios
      .get(`network/nas/filter?branch=${branchid}`)
      .then((response) => {
        console.log(response.data);
        // setNaList(response.data);
    // Sailaja sorting the Admin Login IP Pool NAS Dropdown data as alphabetical order on 24th March 2023
        setNaList(Sorting((response?.data),'name'));
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  const resetformmanually = () => {
    setFormData({
      name: "",
      serial_no: "",
      ip_address_from: "",
      cost_per_ip: "",
    });
    //Sailaja modified clear_form_data on 26th July
    document.getElementById("myForm").reset();
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  const addippool = () => {
    setLoaderSpinner(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    networkaxios
      .post("network/ippool/create", formData, config)
      .then((response) => {
        props.onUpdate(response.data);
        setShowModal(true);
        setModalMessage("Ippool was added successfully");
        // toast.success("Ippool was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
        resetformmanually();
      })
      // .catch(function (error) {
      //   setLoaderSpinner(false);
      //   console.log(error, "AddIP");

      //   if (error.response && error.response.data) {
      //     setErrors(error.response.data);
      //   }
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   });
      // });
      .catch(function (error) {
        setLoaderSpinner(false);
        console.log(error, "AddIP");
        let errorMessage = "Something went wrong";
        // if (error.response) {

        //   if (error.response.data) {
        //     setErrors(error.response.data);
        //   }
        //   if (error.response.data && error.response.data.detail) {
        //     errorMessage = error.response.data.detail;
        //   }
        // }
        if (error.response) {
          if (error.response.data) {
            setErrors(error.response.data);
          }
          Object.entries(error?.response?.data).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errors.forEach(error => {
                errorMessage =`${field === 'name' || field === 'serial_no' ? '' : field
              } ${error}`
              });
            }
          });
          // if (Array.isArray(error.response.data)) {
          //   if (error.response.data[0] === "ip pool with this name already exists.") {
          //     errorMessage = "IP pool with this name already exists. Please choose a different name.";
          //   }
          // } else if (error.response.data && error.response.data.detail) {
          //   errorMessage = error.response.data.detail;
          // }
        }
     
        setShowModal(true);
        setModalMessage(errorMessage);
      });      
  };
  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    let dataNew = {...formData}
    dataNew.nas_pool_name = dataNew.name;
    // Sailaja Added new Validation key word to overcome conflit with Admin login & Remaining Logins on 4th April 2023
    dataNew.admin_select_Branch = dataNew.branch;

    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      addippool();
    } else {
      console.log("errors try again", validationErrors);
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
    setResetStatus(true);

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
    // Sailaja Added new Validation key word admin_select_Branch to requiredFields on 4th April 2023
  const requiredFields = [
    "branch",
    "nas",
    "nas_pool_name",
    "ip_address_from",
    "ip_address_to",
    "description",
    "serial_no",
    "cost_per_ip",
    "admin_select_Branch",
  ];
  const { validate } = useFormValidation(requiredFields);
  // added form reset on line 185 by Mareiya
  //ippool changed by sailaja
  return (
    <Fragment>
      <Container fluid={true}>
        <Row className="form_layout">
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                {JSON.parse(localStorage.getItem("token")) &&
                JSON.parse(localStorage.getItem("token")).branch &&
                JSON.parse(localStorage.getItem("token")).branch.name ? (
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Branch *</Label>
                        <Input
                          // draft
                          className={`form-control digits not-empty`}
                          value={
                            JSON.parse(localStorage.getItem("token")) &&
                            JSON.parse(localStorage.getItem("token")).branch &&
                            JSON.parse(localStorage.getItem("token")).branch
                              .name
                          }
                          type="text"
                          name="branch"
                          onChange={props.handleChange}
                          style={{ textTransform: "capitalize" }}
                          disabled={true}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                ) : (
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Select Branch *</Label>
                        <Input
                          type="select"
                          name="branch"
                          className="form-control digits"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                        >
                          <option style={{ display: "none" }}></option>

                          {branch.map((types) => (
                            <option key={types.id} value={types.id}>
                              {types.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                       <span className="errortext">
                       {/*  Sailaja modified Validation key word to overcome conflit with Admin login & Remaining Logins on 4th April 2023 */}
                        {errors.admin_select_Branch && "Selection is required"}
                      </span>
                    </FormGroup>
                  </Col>
                )}

                {JSON.parse(localStorage.getItem("token")) &&
                JSON.parse(localStorage.getItem("token")).branch &&
                JSON.parse(localStorage.getItem("token")).branch.name ? (
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">NAS *</Label>
                        <Input
                          type="select"
                          name="nas"
                          className="form-control digits"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                        >
                          <option style={{ display: "none" }}></option>

                          {nasList1.map((nasname) => (
                            <option key={nasname.id} value={nasname.id}>
                              {nasname.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <span className="errortext">
                        {errors.nas && "Selection is required"}
                      </span>
                    </FormGroup>
                  </Col>
                ) : (
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">NAS *</Label>
                        <Input
                          type="select"
                          name="nas"
                          className="form-control digits"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                        >
                          <option style={{ display: "none" }}></option>

                          {nasList.map((nasname) => (
                            <option key={nasname.id} value={nasname.id}>
                              {nasname.name}
                            </option>
                          ))}
                        </Input>
                        <span className="errortext">
                          {errors.nas && "Selection is required"}
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                )}

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Pool Name *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">
                      {errors.nas_pool_name}
                    </span>

                    {/* <span className="errortext">{errors.name}</span> */}
                  </FormGroup>
                </Col>
                <Col sm="4" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label" style={{ left: "0% " }}>
                        IP Address From *
                      </Label>
                      <MaskedInput
                        {...ipprops}
                        style={{
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
                        name="ip_address_from"
                        onChange={handleInputChange}
                        class="form-control"
                      />
                    </div>
                    <span className="errortext">
                      {errors.ip_address_from && "Field is required"}
                    </span>
                  </FormGroup>
                </Col>

                <Col sm="4" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label" style={{ left: "0% " }}>
                        IP Address To *
                      </Label>
                      <MaskedInput
                        {...ipprops}
                        style={{
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
                        name="ip_address_to"
                        onChange={handleInputChange}
                        class="form-control"
                      />
                    </div>
                    <span className="errortext">
                      {errors.ip_address_to && "Field is required"}
                    </span>

                    {/* <span className="errortext">{errors.ip_address_to}</span> */}
                  </FormGroup>
                </Col>
                <Col sm="4" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Serial Number *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="serial_no"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">
                      {errors.serial_no }
                    </span>

                    {/* <span className="errortext">{errors.serial_no}</span> */}
                  </FormGroup>
                </Col>
                <Col md="4" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Cost Per IP</Label>

                      <Input
                        className="form-control"
                        type="text"
                        name="cost_per_ip"
                        onChange={handleInputChange}
                        style={{ textTransform: "capitalize" }}
                        // disabled={isDisabled}
                      ></Input>
                    </div>
                    <span className="errortext">
                      {errors.cost_per_ip}
                    </span>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm="12" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="desc_label">Description *</Label>
                      <Input
                        className="form-control"
                        type="textarea"
                        name="description"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">
                      {errors.description}
                    </span>
                  </FormGroup>
                </Col>
              </Row>
              <Row style={{ marginTop: "-2%" }}>
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

export default AddIpPool;
