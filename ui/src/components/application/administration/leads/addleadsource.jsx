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
import { default as axiosBaseURL } from "../../../../axios";
// import { toast } from "react-toastify";
import ErrorModal from "../../../common/ErrorModal";
import { Add } from "../../../../constant";
import useFormValidation from "../../../customhooks/FormValidation";

const AddLeadSource = (props, initialValues) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [branch, setBranch] = useState([]);
  {/*Spinner state added by Marieya on 25.8.22 */}
  const [loaderSpinneer, setLoaderSpinner ] = useState(false)
  const [permissions, setPermissions] = useState([]);

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

  const leadsrc = () => {
    setLoaderSpinner(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axiosBaseURL
      .post("/radius/source/create", formData, config)
      .then((response) => {
        console.log(response.data);
        // toast.success("Lead Source was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        // Modified by Marieya
        setShowModal(true);
        setModalMessage("Lead Source was added successfully");
        props.onUpdate(response.data);
        resetformmanually();
      })
      // .catch(function (error) {
      //   setLoaderSpinner(false);
      //       toast.error("Something went wrong", {
      //         position: toast.POSITION.TOP_RIGHT,
      //         autoClose: 1000,
      //       });
      //       console.error("Something went wrong!", error);
      //     });
      .catch(function (error) {
        setLoaderSpinner(false);
        
        setShowModal(true);        
          // The request was made and the server responded with a status code
          if (error.response.status === 500) {
            setModalMessage("Internal Server Error");
          } else if (error.response.status === 400) {
            setModalMessage("Something went wrong");
          } else {
            setModalMessage("Something went wrong");
          }
        console.error("Something went wrong!", error);
      });
      
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
    {/*changed keyname for lead source field by Marieya*/}
    let newleadinput = {...inputs}
    newleadinput.lead_source_name = newleadinput.name
    console.log(formData);
    const validationErrors = validate(newleadinput);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log(inputs);
      leadsrc();
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
    setErrors({});
  };

  const form = useRef(null);

  //validation
  const requiredFields = ["lead_source_name"];
  const { validate, Error } = useFormValidation(requiredFields);

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

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
              <Row style={{marginTop:"-1%"}}>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">
                       Source Name *
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    
                    </div>
                    <span className="errortext">{errors.lead_source_name}</span>
                  </FormGroup>
                </Col>
              </Row>

              <br />
              <br />

              <Row style={{marginTop:"-7%"}}>
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
                        {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null}&nbsp;
                      {"Create"}
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

export default AddLeadSource;
