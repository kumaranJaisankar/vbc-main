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

import { helpdeskaxios } from "../../../../axios";
import { adminaxios } from "../../../../axios";
// import { toast } from "react-toastify";
import { Add } from "../../../../constant";
import useFormValidation from "../../../customhooks/FormValidation";
import ErrorModal from "../../../common/ErrorModal";

const AddTicketCategory = (props, initialValues) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [branch, setBranch] = useState([]);

  const [permissions, setPermissions] = useState([]);
  {
    /*Spinner state added by Marieya on 25.8.22 */
  }
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [filter, setFilter] = useState({
    first_name: "",
    // branch:"",
    // area:"",
    // leadsource: "",
  });
  const [emailToggle1, setEmailToggle1] = useState("on");
  const [isShow1, setIsshow1] = React.useState(true);

  function EmailToggle1() {
    setEmailToggle1(emailToggle1 === "on" ? "off" : "on");
    setIsshow1(!isShow1);
  }

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
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      }));
    }
  };

  useEffect(() => {
    adminaxios
      .get("accounts/register/options")
      .then((res) => {
        let { roles, permissions, branches } = res.data;
        setRoles([...roles]);
        setPermissions([...permissions]);
        setBranch([...branches]);
      })
      // .catch((error) => console.log(error));
      .catch((error) => {
        console.log(error);
        // Set the error message to be displayed in the modal
        setModalMessage("Something went wrong");
        setShowModal(true);
      });
  }, []);

  const addTicketCate = () => {
    setLoaderSpinner(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const obj = {
      ...formData,
      cstmr_visibility: isShow1 ? isShow1 : false,
    };
    helpdeskaxios
      .post("create/ticket/category", obj, config)
      .then((response) => {
        console.log(response.data);
        props.onUpdate(response.data);
        setShowModal(true);
        setModalMessage("Ticket Category was added successfully");
        // Modified by Marieya
        // toast.success("Ticket Category was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose:1000
        // });
        resetformmanually();
        setLoaderSpinner(false);
        // toast.success("Branch was added successfully", { position: toast.POSITION.TOP_RIGHT })
      })
      // .catch(function (error) {
      //   setLoaderSpinner(false);
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   });
      //   console.error("Something went wrong!", error);
      // });
      .catch(function (error) {
        setLoaderSpinner(false);
        // Set the error message to be displayed in the modal
        setModalMessage("Something went wrong");
        // Show the error modal
        setShowModal(true);
        console.error("Something went wrong!", error);
      });
      
  };

  const resetformmanually = () => {
    setFormData({
      category: "",
      subject: "",
    });
    //Sailaja modified clear_form_data on 26th July

    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(formData);
    {
      /*changed keyname for category and subject fields by Marieya*/
    }
    let newInputs = { ...inputs };
    newInputs.new_ticket_category = newInputs.category;
    newInputs.new_subject = newInputs.subject;
    const validationErrors = validate(newInputs);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log(inputs);
      addTicketCate();
    } else {
      console.log("errors try again", validationErrors);
    }
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

  const requiredFields = ["new_ticket_category", "new_subject"];
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
                      <Label className="kyc_label">Category *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="category"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">
                      {errors.new_ticket_category}
                    </span>

                    {/* <Error>{errors.category}</Error>
                    <span className="errortext">{errors.category && 'Category is required'}</span> */}
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Subject *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        onChange={handleInputChange}
                        name="subject"
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">{errors.new_subject}</span>

                    {/* <Error>{errors.subject}</Error>
                    <span className="errortext">{errors.subject && 'Subject is required'}</span> */}
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <Label className="kyc_label">Customer Visibility</Label>
                  <br />
                  <div
                    className={`franchise-switch ${emailToggle1}`}
                    onClick={EmailToggle1}
                  />
                </Col>
              </Row>

              <br />
              <br />
              <br />

              <Row style={{ marginTop: "-93px" }}>
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
                        loaderSpinneer ? loaderSpinneer : loaderSpinneer
                      }
                    >
                      {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null}
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

export default AddTicketCategory;
