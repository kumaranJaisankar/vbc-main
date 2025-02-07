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
import { adminaxios } from "../../../../axios";
// import { toast } from "react-toastify";
import ErrorModal from "../../../common/ErrorModal";
import Map from "./MapContainer/Map";
import isEmpty from "lodash/isEmpty";
import { Add } from "../../../../constant";
import useFormValidation from "../../../customhooks/FormValidation";
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../common/Sorting";


const AddZone = (props, initialValues) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formData, setFormData] = useState({});
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [assignedTo, setAssignedTo] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);
  {/*Spinner state added by Marieya on 25.8.22 */}
  const [loaderSpinneer, setLoaderSpinner ] = useState(false)
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  useEffect(() => {
    if (selectedArea) {
      setFormData((preState) => ({
        ...preState,
        ["area"]: selectedArea,
      }));
    }
  }, [selectedArea]);
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
        [name]: value.charAt(0).toUpperCase() +  value.slice(1),
      }));
    }
  };

  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
         // let name = res.data.map(branch=>branch.name);
        // setAssignedTo([...res.data]);
        // Sailaja sorting the Zone Configuration/Add New Zone -> Branch Dropdown data as alphabetical order on 24th March 2023
        setAssignedTo(Sorting([...res?.data],'name'));

      })
      .catch((err) => console.log(err));
  }, []);

  const addZone = (e) => {
    setLoaderSpinner(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    adminaxios
      .post("accounts/zone/list/create", formData, config)
      .then((response) => {
        setLoaderSpinner(false);
        props.onUpdate(response.data);
        setShowModal(true);
        setModalMessage("Zone was added successfully");
        // toast.success("Zone was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose:1000
        // });
        resetformmanually();
      })
    //   .catch(function (error) {
    // setLoaderSpinner(false);
    //     toast.error("Something went wrong", {
    //       position: toast.POSITION.TOP_RIGHT,
    //       autoClose:1000
    //     });
    //     console.error("Something went wrong!", error);
    //   });
    .catch(function (error) {
      // props.onUpdate()
      setLoaderSpinner(false);
    //Modified by Marieya 
      setShowModal(true); // Set the modal to be visible
      const status = error.response ? error.response.status : null;
    
      // Customize the error message based on the status code
      if (status === 500) {
        setModalMessage("Internal Server Error");
      } else {
        setModalMessage(error?.response?.data?.non_field_errors);
      }
    
      console.error("Something went wrong!", error);
    });
    
  };

  const resetformmanually = () => {
    setFormData({
      name: "",
    });
     //Sailaja modified clear_form_data on 26th July
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();

  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => {};
  const resetForm = function () {
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




  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
let newzonedata = {...inputs}
newzonedata.zone_name = newzonedata.name
newzonedata.zone_area_code = newzonedata.code
{/*changes zone name validation by Marieya on 22/8/22 */}
    const validationErrors = validate(newzonedata);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      addZone();
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  const requiredFields = ["zone_name","branch","zone_area_code"];
  const { validate, Error } = useFormValidation(requiredFields);

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
              <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Zone Name *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{textTransform:"capitalize"}}
                      />
                    </div>
                    <span className="errortext">{errors.zone_name}</span>
                  </FormGroup>
                </Col>
               
                
              
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">
                          Select Branch *
                      </Label>
                      <Input
                        type="select"
                        name="branch"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {assignedTo.map((assignedto) => (
                          <option key={assignedto.id} value={assignedto.id}>
                            {assignedto.name}
                          </option>
                        ))}
                      </Input>
                   
                    </div>
                    <span className="errortext">{errors.branch && "Selection is required" }</span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">
                        Zone Code *
                      </Label>
                      <Input
                        type="text"
                        name="code"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        // draft
                        className={`form-control digits ${
                          formData && formData.name ? "not-empty" : ""
                        }`}
                        style={{textTransform:"capitalize"}}
                      />

                 
                    </div>
                    <span className="errortext">{errors.zone_area_code}</span>
                  </FormGroup>
                </Col>

                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="owner"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        onChange={handleInputChange}
                      >
                        <option style={{ display: "none" }}></option>
                        {ownerlist.map((branchowner) => (
                          <option key={branchowner.id} value={branchowner.id}>
                            {branchowner.username}
                          </option>
                        ))}
                      </Input>
                      <Label className="placeholder_styling">Owner *</Label>
                    </div>
                  </FormGroup>
                </Col> */}
               
                <Col sm="12" style={{display:"none"}}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="area"
                        // onChange={handleInputChange}
                        // onBlur={checkEmptyValue}
                        value={
                          formData &&
                          !isEmpty(formData.area) &&
                          formData.area.map((a) => a.name).join(",")
                        }
                        disabled={true}
                      />
                      {/* <Label className="placeholder_styling">Areas</Label> */}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Map setSelectedArea={setSelectedArea} />
                </Col>
              </Row>

              <br />
              <Row>
          <span className="sidepanel_border" style={{position:"relative"}}></span>
{/*Spinner added to create button by Marieya on 25.8.22*/}
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                      id="create_button"
                      disabled={loaderSpinneer? loaderSpinneer:loaderSpinneer}
                    >
                      {loaderSpinneer? <Spinner size="sm" id="spinner"></Spinner>: null} &nbsp;
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
      </Container>
      <ErrorModal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          message={modalMessage}
          action={() => setShowModal(false)}
          />
    </Fragment>
  );
};

export default AddZone;
