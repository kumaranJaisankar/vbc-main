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
  CardHeader,
  Spinner,
} from "reactstrap";

import axios from "axios";
import { default as axiosBaseURL } from "../../../../axios";
// import { toast } from "react-toastify";
import {
  BasciInformation,
  Add,
  Cancel,
  InputSizing,
} from "../../../../constant";
import useFormValidation from "../../../customhooks/FormValidation";
import ErrorModal from "../../../common/ErrorModal";

const AddLeadType = (props, initialValues) => {
  const [assign, setAssign] = useState();
  const [user, setUser] = useState();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [image, setimage] = useState({ pictures: [] });
  const [roles, setRoles] = useState([]);
  const [branch, setBranch] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [permissions, setPermissions] = useState([]);
  {/*Spinner state added by Marieya on 25.8.22 */}
  const [loaderSpinneer, setLoaderSpinner ] = useState(false)
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
        [name]: value.charAt(0).toUpperCase() +  value.slice(1),
      }));
    }
  };

  useEffect(() => {
    axiosBaseURL
      .get("/accounts/register/options")
      .then((res) => {
        let { roles, permissions, branches } = res.data;
        setRoles([...roles]);
        setPermissions([...permissions]);
        setBranch([...branches]);
      })
      .catch((error) => console.log(error));
  }, []);

  const resetformmanually = () => {
    setFormData({
      name: "",
    });
        //Sailaja modified clear_form_data on 26th July
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();

  };
  const ltype = () => {
    setLoaderSpinner(true)
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axiosBaseURL
      .post("/radius/type/create", formData, config)
      .then((response) => {
        setShowModal(true);
        setModalMessage("Lead Type was added successfully");
        // toast.success("Lead Type was added successfully", { position: toast.POSITION.TOP_RIGHT })
        props.onUpdate(response.data);
        resetformmanually();
      })
      // Modified by Marieya
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
        
        setShowModal(true);  // Set the modal to be visible
        const status = error.response ? error.response.status : null;
        // Customize the error message based on status code
        if (status === 500) {
          setModalMessage("Internal Server Error");
        } else {
          setModalMessage("Something went wrong");
        }
        console.error("Something went wrong!", error);
      });
      
  };

  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually()
      setErrors({})
    }
  }, [props.rightSidebar])
  
  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    {/*Added new keyname for Name field validation by Marieya on 23.8.22*/}
    let newinputsdata = {...inputs}
    newinputsdata.lead_type_name = newinputsdata.name
    const validationErrors = validate(newinputsdata);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      ltype();
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
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({})
  };

  const form = useRef(null);

  const requiredFields = ["lead_type_name"];
  const { validate, Error } = useFormValidation(requiredFields);
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                {/* <h6 style={{ paddingLeft: "20px" }}>Personal Info</h6> */}
              </Row>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Type Name *</Label>

                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{textTransform:"capitalize"}}
                      />
                    </div>
                    <span className="errortext">{errors.lead_type_name}</span>
                    {/* <Error>{errors.name}</Error>
                    <span className="errortext">{errors.name && 'Type is required'}</span> */}
                  </FormGroup>
                </Col>
              </Row>

             
              
              {/* <br />
              <br /> */}

              <Row style={{marginTop:"-2%"}}>
          <span className="sidepanel_border" style={{position:"relative"}}></span>

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

export default AddLeadType;
