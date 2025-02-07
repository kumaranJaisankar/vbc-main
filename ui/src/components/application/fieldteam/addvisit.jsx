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
import useFormValidation from "../../customhooks/FormValidation";

import axios from "axios";

import { toast } from "react-toastify";

const Addvisit = (props, initialValues) => {
  const [assign, setAssign] = useState();
  //state for username
  const [username, setUsername] = useState([]);
  //module
  const [module, setModule] = useState([]);
  //zone
  const [zone, setZone] = useState([]);
  //emp
  const [emp,setEmp] = useState([]);

  const [branch, setBranch] = useState([]);
  const [formData, setFormData] = useState({
    contacted_person: "",
    category: "",
    check_in: "",
    check_out: "",
    emp: props.lead && props.lead.id,
    notes: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [assignedTo, setAssignedTo] = useState([]);

  const [filter, setFilter] = useState({
    // first_name: "",
    // branch:"",
    // area:"",
    // leadsource: "",
  });

  const handleInputChange = (event) => {
    // event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const resetformmanually = () => {
    setFormData({
      contacted_person: "",
      category: "",
      check_in: "",
      check_out: "",
      emp: "",
      notes: "",
    });
    document.getElementById("resetid").click();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  useEffect(()=>{
    if(!!props.lead){
      setFormData((preState) => ({
        ...preState,
        ['emp']: props.lead.id,
      }));
    }
  },[props.lead])
  const form = useRef(null);

  const visitAdd = (e) => {
    // e.preventDefault();

    console.log(formData);

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      // staffaxios
      .post(
        "http://fbba-223-184-2-115.ngrok.io/tmv/create/list",
        formData,
        config
      )
      .then((response) => {
        console.log(response.data);
        props.onUpdate(response.data);
        resetformmanually();
        resetInputField();
        // form.onReset();
        toast.success("Visit was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000
        });
      })
      .catch(function (error) {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000
        });
        console.error("Something went wrong!", error);
      });
  };

  //validdations

  const submit = (e) => {
    
    console.log("ClickAddSubmit");
    console.log({ e });
    e.preventDefault();

    console.log(formData);
    const validationErrors = validate(formData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log(formData);
      visitAdd();
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



  //validation
  const requiredFields = [];
  const { validate, Error } = useFormValidation(requiredFields);

  //emp autopopulate
  useEffect(() => {
    axios
      .get("http://fbba-223-184-2-115.ngrok.io/emp/create/list")
      .then((res) => {
        console.log(res);
        setEmp([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);
  //
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="contacted_person"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{whiteSpace:"nowrap"}}
                        value={formData && formData.contacted_person}
                      />
                      <Label className="placeholder_styling">
                        Contacted Person
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="category"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.category}
                      />
                      <Label className="placeholder_styling">Category</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="datetime-local"
                        name="check_in"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.check_in}
                      />
                      <Label className="placeholder_styling">Check in</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="datetime-local"
                        name="check_out"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.check_out}

                      />
                      <Label className="placeholder_styling">Check out</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="text"
                        name="emp"
                        value={formData && formData.emp}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Emp</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="textarea"
                        className="form-control"
                        name="notes"
                        rows="3"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.notes}
                        
                      />
                      <Label className="placeholder_styling">Notes *</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <br />

              <Row>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="button"
                      className="mr-3"
                      onClick={submit}
                    >
                      Add
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
  );
};

export default Addvisit;
