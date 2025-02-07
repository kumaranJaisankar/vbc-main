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
import { campaignaxios } from "../../../axios";
import { toast } from "react-toastify";
import { Add } from "../../../constant";
import useFormValidation from "../../customhooks/FormValidation";

const Addnotification = (props, initialValues) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [notificationcheckbox, setnotificationcheckbox] = useState(false);
  const [mobilecheckbox, setmobilecheckbox] = useState(false);

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
  };

  useEffect(() => {}, []);

  // API Call for Add notification by Marieya
  const dept = () => {
    const notifyData = {...formData}
    notifyData.web = notificationcheckbox
    notifyData.mobile = mobilecheckbox

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    campaignaxios
      .post("notifications", notifyData, config
      )
      .then((response) => {
        console.log(response.data);
        props.onUpdate('notifications');
        resetformmanually();
        toast.success("Notification was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
 
  };

  ///

  const resetformmanually = () => {
    setFormData({
      name: "",
      content: "",
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
    console.log(formData);

    const validationErrors = validate(formData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log(formData);
      dept();
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
  const requiredFields = ["name", "content"];
  const { validate, Error } = useFormValidation(requiredFields);

  // function for checkbox click

  const handleClick1 = () => setmobilecheckbox(!mobilecheckbox);
  console.log(mobilecheckbox, "mobilecheckbox");


  const handleClick = () => setnotificationcheckbox(!notificationcheckbox);


 


  return (
    <div>
      <Fragment>
        <br />
        <Container fluid={true}>
          <Row>
            <Col sm="12">
              <Form onSubmit={submit} id="myForm" onReset={resetForm}>
                <Row></Row>
                <Row style={{ marginTop: "-1%" }}>
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">
                          Notification Title *
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          name="name"
                          onChange={handleInputChange}
                          // onBlur={checkEmptyValue}
                        />
                      </div>
                      <span className="errortext">{errors.name}</span>
                    </FormGroup>
                  </Col>
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">
                          Content for Notification *
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          name="content"
                          onChange={handleInputChange}
                          // onBlur={checkEmptyValue}
                        />
                      </div>
                      <span className="errortext">{errors.content}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <span className="form_heading">Notification Type</span>
                <br />
                <br />
                <Row style={{ marginTop: "-1%" }}>
                  <Col sm="2">
                    <Input
                      type="checkbox"
                      className="checkbox_animated"
                      name="web"
                      checked={notificationcheckbox}
                      onClick={handleClick}
                    />
                    <Label>
                      <b>Web *</b>
                    </Label>
                  </Col>
                  <Col sm="2">
                    <Input
                      type="checkbox"
                      className="checkbox_animated"
                      name="mobile"
                      checked={mobilecheckbox}
                      onClick={handleClick1}
                    />
                    <Label>
                      <b>Mobile *</b>
                    </Label>
                  </Col>
                </Row>

                <br />
                <br />

                <Row style={{ marginTop: "-7%" }}>
                  <span
                    className="sidepanel_border"
                    style={{ position: "relative", marginTop: "3%" }}
                  ></span>

                  <Col>
                    <FormGroup className="mb-0">
                      <Button
                        color="btn btn-primary"
                        type="submit"
                        className="mr-3"
                        onClick={resetInputField}
                        id="create_button"
                      >
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
        </Container>
      </Fragment>
    </div>
  );
};
//made changes by marieya

export default Addnotification;
