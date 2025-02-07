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

import { adminaxios } from "../../../axios";
// import { toast } from "react-toastify";
import { Add } from "../../../constant";
import useFormValidation from "../../customhooks/FormValidation";
import ErrorModal from "../../common/ErrorModal";


const AddDepartment = (props, initialValues) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  // const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    roles: "",
    users: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});

  //to disable button

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (target.name === "roles" || target.name === "users") {
      value = [target.value];
    }

    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    }
    // else {
    //   if (name === "users") {
    //     setFormData((preState) => ({
    //       ...preState,
    //       [name]: [value],
    //     }));
    //   }
    else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
      // }
    }
  };

  // useEffect(() => {
  //   setDisable(false);
  //   adminaxios
  //     .get("/accounts/options/all")
  //     .then((res) => {
  //       let { roles, users } = res.data;
  //       // setRoles([...roles]);
  //       // Sailaja sorting the Administration -> Department(Add Panel)->Roles * Dropdown data as alphabetical order on 29th March 2023
  //       setRoles(Sorting(([...roles]),'name'))
  //       // setPermissions([...permissions]);
  //       // setBranch([...branches]);
  //       setUsers([...users]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  const dept = () => {
    props.setDisable(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    adminaxios
      .post("/accounts/department/create", formData, config)
      .then((response) => {
        props.setDisable(false);
        props.onUpdate(response.data);
        resetformmanually();
        setShowModal(true);
        setModalMessage("Department was added successfully");
        // toast.success("Department was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
      })
      .catch((error) => {
        // set the error message and display the error modal
        // Modified by Marieya
        setModalMessage("Something went wrong!");
        setShowModal(true);
        // disable the loading state if necessary
        props.setDisable(false);
        console.error("Something went wrong!", error);
      });      
      // .catch(function (error) {
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   });
      //   props.setDisable(false);
      //   console.error("Something went wrong!", error);
      // });
  };

  const resetformmanually = () => {
    setFormData({
      name: "",
      roles: "",
      // users: "",
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

  const submit = (e) => {
    e.preventDefault();
    let newformData = {...formData}
newformData.department_name = newformData.name
    props.setDisable(true);
    const validationErrors = validate(newformData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      dept();
    } else {
      props.setDisable(false);
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
  const requiredFields = ["department_name", "roles"];
  const { validate, Error } = useFormValidation(requiredFields);

  const changeCase = (event) => {
    event.preventDefault();
    setFormData(event.target.value.toUpperCase() + event.target.value.slice(1));
  };

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
                      <Label
                        className="kyc_label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Department Name *
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                        onMouseEnter={changeCase}
                      />
                    </div>
                    <span className="errortext">{errors.department_name}</span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Role *</Label>
                      <Input
                        type="select"
                        name="roles"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {props.roles.map((opened) => (
                          <option key={opened.id} value={opened.id}>
                            {opened.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">{errors.roles && "Selection is required"}</span>
                  </FormGroup>
                </Col>
                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Users *</Label>
                      <Input
                        type="select"
                        name="users"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{display:"none"}}></option>
                        {users.map((addingusers) => (
                          <option key={addingusers.id} value={addingusers.id}>
                            {addingusers.username}
                          </option>
                        ))}
                      </Input>
                    </div>
                    
                
                    <span className="errortext">{errors.users}</span>


                  </FormGroup>
                </Col> */}
              </Row>

              <br />

              <div style={{ marginTop: "2%" }}>
                <Row>
                  <span
                    className="sidepanel_border"
                    style={{ position: "relative", top: "-68px" }}
                  ></span>
                  <Col style={{ top: "-66px" }}>
                    <FormGroup className="mb-0">
                      <Button
                        color="btn btn-primary"
                        type="submit"
                        className="mr-3"
                        onClick={resetInputField}
                        id="create_button"
                        disabled={props.disable}
                      >
                        {" "}
                        {props.disable ? <Spinner size="sm"> </Spinner> : null}&nbsp;
                        {Add}
                      </Button>
                      <Button
                        type="reset"
                        color="btn btn-secondary"
                        id="resetid"
                      >
                        Reset
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
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

export default AddDepartment;
