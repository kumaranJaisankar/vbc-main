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
import useFormValidation from "../../../customhooks/FormValidation";
import {
  Add,
} from "../../../../constant";
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../common/Sorting";
import ErrorModal from "../../../common/ErrorModal";

const AddArea = (props, initialValues) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formData, setFormData] = useState({});
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [selectBranch, setSelectBranch] = useState();
  const [zonelist, setZonelist] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  {/*Spinner state added by Marieya on 25.8.22 */}
  const [loaderSpinneer, setLoaderSpinner ] = useState(false)
  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    } else {
      let street = "";
      if (name === "assigned_to") {
        let branch = assignedTo.find((b) => b.id == value);
        if (branch) street = branch.street;
        setFormData((preState) => ({
          ...preState,
          [name]: value,
          ["street"]: street,
        }));
      } else {
        setFormData((preState) => ({
          ...preState,
          [name]: value.charAt(0).toUpperCase() +  value.slice(1),
        }));
      }
    }
    if (name == "branch") {
      getlistofzones(value);
    }
  };


  // zone list
  const getlistofzones = (branchid) => {
    adminaxios
      .get("accounts/zone/list/create")
      .then((res) => {
        // let name = res.data.map(branch=>branch.name);
        const list = res?.data.filter((b) => b.branch == branchid);
        // setZonelist(list);
       // Sailaja sorting the Area/Add New Area -> Zone Dropdown data as alphabetical order on 24th March 2023
        setZonelist(Sorting((list),'name'));
      })
      .catch((err) => console.log(err));
  };


  // branch list
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // let name = res.data.map(branch=>branch.name);
        // setAssignedTo([...res.data]);
        // Sailaja sorting the Area/Add New Area -> Branch Dropdown data as alphabetical order n 24th March 2023
        setAssignedTo(Sorting([...res?.data],'name'));

      })
      .catch((err) => console.log(err));
  }, []);

  const addArea = (e) => {
    setLoaderSpinner(true)
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    adminaxios
      .post("accounts/area/list/create", formData, config)
      .then((response) => {
        setLoaderSpinner(false)
        props.onUpdate(response.data);
        // toast.success("Area was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose:1000
        // });
        setShowModal(true);
        setModalMessage("Area was added successfully");
        resetformmanually();
      })
      // .catch(function (error) {
      //   setLoaderSpinner(false)
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose:1000
      //   });
      //   console.error("Something went wrong!", error);
      // });
      .catch(function (error) {
        setLoaderSpinner(false);
      // Modified by Marieya
        setShowModal(true); // Set the modal to be visible
        const status = error.response ? error.response.status : null;
      
        // Customize the error message based on the status code
        if (status === 500) {
          setModalMessage("Internal Server Error");
        } else {
          // setModalMessage("Something went wrong");
        setModalMessage(error?.response?.data?.non_field_errors);
        }
        console.error("Something went wrong!", error);
      });
      
  };

  const resetformmanually = () => {
    setFormData({
      name: "",
      branch:""
    });
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
let newareadata = {...formData}
newareadata.area_code = newareadata.code
newareadata.areaname = newareadata.name
    const validationErrors = validate(newareadata);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      addArea();
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  const requiredFields = ["areaname","branch","zone","area_code"];
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
                    <span className="errortext">{errors.branch && "Selection is required"}</span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Select Zone *</Label>
                      <Input
                        type="select"
                        name="zone"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {zonelist.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    {/* Sailaja modified msg as Selection is required */}
                    <span className="errortext">{errors.zone && "Selection is required"}</span>
                  </FormGroup>
                </Col>
                
              <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Area *</Label>

                      <Input
                        type="text"
                        name="name"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{textTransform:"capitalize"}}
                      ></Input>
                    </div>
                    {/* Sailaja changed validation msg text as guided by QA team on 3rd August  */}
                    <span className="errortext">{errors.areaname}</span>
                  </FormGroup>
                </Col>
                

                
                {/* <Col sm="4">
                  <FormGroup>
                  
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="street"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.street}
                        placeholder="Zone"
                      >
                        
                      </Input>
                      
                    </div>
                  </FormGroup>
                </Col> */}

               
              </Row>
              <Row style={{marginTop:"-3%"}}>
              <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">
                        Area Code *
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
                    <span className="errortext">{errors.area_code}</span>
                  </FormGroup>
                </Col>
              </Row>

              <br />
{/* 
              <br /> */}
              <Row style={{marginTop:"-4%"}}>
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

export default AddArea;
