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
import { adminaxios, staffaxios } from "../../../axios";
import {
  Add,
  Search,
} from "../../../constant";
import { toast } from "react-toastify";
import SearchUser from "./searchuser";
import pick from "lodash/pick";

const AddFieldTeam = (props, initialValues) => {
  //state for username
  const [username, setUsername] = useState([]);
  //module
  const [module, setModule] = useState([]);
  //zone
  const [zone, setZone] = useState([]);
  //state for search user
  const [selectedId, setSelectedId] = useState();
  //getting data
  const [leadUsers, setLeadUsers] = useState([]);

  const [leadUsersData, setLeadUsersData] = useState([]);

  const [branch, setBranch] = useState([]);
  const [formData, setFormData] = useState({
    user: "",
    email: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [assignedTo, setAssignedTo] = useState([]);

  const [filter, setFilter] = useState({
    first_name: "",
    // branch:"",
    // area:"",
    // leadsource: "",
  });
  //
  const handleCheckboxChange = (event) => {
    let modules = [];
    if (event.target.checked) {
      modules.push(event.target.defaultValue);
    } else if (!event.target.checked) {
      modules = modules.filter((item) => item !== event.target.defaultValue);
    }
    setFormData({ ...formData, modules: modules });
  };
  //
  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

    let email = "";
    if (name === "user") {
      let user = username.find((b) => b.id == value);
      if (user) email = user.user.email;
      setFormData((preState) => ({
        ...preState,
        [name]: value,
        ["email"]: email,
      }));
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
    var formgroup = event.target.closest(".form-group");
    var filterArray = [...formgroup.querySelectorAll("input[type=checkbox]")]
      .filter((input) => input.checked)
      .map((input) => input.name);
    setFilter((preState) => ({
      ...preState,
      [formgroup.dataset.name]: filterArray,
    }));
  };

  const resetformmanually = () => {
    setFormData({
      user: "",
      email: "",
    });
    document.getElementById("resetid").click();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  const branchAdd = (e) => {
    // e.preventDefault();

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    staffaxios
      .post("emp/create/list", formData, config)
      .then((response) => {
        props.onUpdate(response.data);
        resetformmanually();
        toast.success("User was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
      })
      .catch(function (error) {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
        console.error("Something went wrong!", error);
      });
  };

  //validdations

  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    const validationErrors = validate(formData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      branchAdd();
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

  const resetInputField = () => { };
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
  const requiredFields = [];
  const { validate, Error } = useFormValidation(requiredFields);

  //getting users from adminusers
  useEffect(() => {
    adminaxios
      .get("accounts/users")
      .then((res) => {
        // let { branch_name } = res.data;
        setUsername([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);
  //getting module from api
  useEffect(() => {
    axios
      // staffaxios
      .get("http://fbba-223-184-2-115.ngrok.io/mod/create/list")
      .then((res) => {
        const modulesData = res.data.map((item) => ({
          value: item.id,
          displayName: item.name,
        }));
        setModule([...modulesData]);
      })
      .catch((error) => console.log(error));
  }, []);
  //getting zone api
  useEffect(() => {
    adminaxios
      .get("accounts/zone/create/list")
      .then((res) => {
        setZone([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);
  //getting branch from api
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        console.log(res);
        setBranch([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);

  var expanded = false;

  let toggleCheckboxes = (e) => {
    e.stopPropagation();
    var checkboxes = e.target
      .closest(".form-group")
      .querySelector(".checkboxes");
    function a(e) {
      if (!checkboxes.contains(e.target)) {
        hideCheckboxes();
      }
    }
    function b(e) {
      if (!checkboxes.contains(e.target)) {
        e.preventDefault();
        hideCheckboxes();
      }
    }
    function showCheckboxes() {
      document.body.addEventListener("focusin", a);
      document.body.addEventListener("click", b);
      checkboxes.style.display = "block";
      expanded = true;
    }
    function hideCheckboxes() {
      document.body.removeEventListener("focusin", a);
      document.body.removeEventListener("click", b);
      checkboxes.style.display = "none";
      expanded = false;
    }

    if (!expanded) {
      showCheckboxes();
    } else {
      hideCheckboxes();
    }
  };
  //api for getting searched data
  useEffect(() => {
    axios
      .get(`/radius/lead/display`)
      // .then((res) => setData(res.data))
      .then((res) => {
        let leadsPick = res.data.map((lead) => {
          let obj = pick(lead, "id", "first_name", "email", "mobile_no");
          return {
            ...obj,
            id: "U00" + obj.id,
          };
        });

        setLeadUsers(leadsPick);
        setLeadUsersData(res.data);
      });
  }, []);

  useEffect(() => {
    if (!!selectedId) {
      let id = selectedId.replace("L00", "");
      let lead = leadUsersData.find((lead) => lead.id == id);

      setFormData((preState) => ({
        ...preState,
        user_name: parseInt(id),
        first_name: lead.first_name,
      }));
      console.log(formData, "data");
    }
  }, [selectedId]);
  // end

  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              {/* search field calling using api */}
              <Row>
                <Col sm="6">
                  <FormGroup>
                    <div className="input_wrap">
                      <SearchUser
                        setSelectedId={setSelectedId}
                        leadUsers={leadUsers}
                      />
                      <Input
                        style={{ visibility: "hidden" }}
                        type="text"
                        name="user"
                        className="form-control digits"
                        onChange={handleInputChange}
                        value={formData && formData.user}
                      ></Input>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "9%",
                        left: "80%",
                      }}
                    >
                      <Search className="search-icon" />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              {/* end */}
              <Row>
                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="user"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>

                        {username.map((types) => (
                          <option key={types.user.id} value={types.user.id}>
                            {types.user.username}
                          </option>
                        ))}
                      </Input>

                      <Label
                        className="placeholder_styling"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Username
                      </Label>
                    </div>
                    
                  </FormGroup>
                </Col> */}

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className={`form-control ${formData && !formData.email ? "" : "not-empty"
                          }`}
                        type="text"
                        name="email"
                        value={formData && formData.email}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Email</Label>
                    </div>
                    <span className="errortext">{errors.email}</span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className={`form-control ${formData && !formData.mobile ? "" : "not-empty"
                          }`}
                        type="text"
                        name="mobile"
                        value={formData && formData.mobile}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Mobile</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup
                    style={{ position: "relative" }}
                    data-name="status"
                  >
                    <div
                      class="selectstatusBox form-control"
                      onClick={(e) => toggleCheckboxes(e)}
                    >
                      <select
                        style={{ border: "none", backgroundColor: "white" }}
                      >
                        <option>Module</option>
                      </select>
                      <div class="overSelect"></div>
                    </div>
                    <div
                      id="selectstatus"
                      onChange={handleInputChange}
                      className="checkboxes"
                    >
                      {module.map((modulename) => (
                        <label
                          for={modulename.displayName}
                          key={modulename.value}
                        >
                          <input
                            value={modulename.value}
                            onChange={handleCheckboxChange}
                            type="checkbox"
                            name={modulename.displayName}
                          />
                          &nbsp; {modulename.displayName}
                        </label>
                      ))}

                      {/* <label>
                          <input type="checkbox" name="OPEN" />
                          &nbsp; Open
                        </label>
                        <label>
                          <input type="checkbox" name="IP" />
                          &nbsp; In Progress
                        </label> */}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="checkbox"
                        name="modules"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>

                        {module.map((typemodule) => (
                          <option key={typemodule.id} value={typemodule.id}>
                            {typemodule.name}
                          </option>
                        ))}
                      </Input>

                      <Label
                        className="placeholder_styling"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Module
                      </Label>
                    </div>
                   
                  </FormGroup>
                </Col> */}

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="designation"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      ></Input>
                      <Label className="placeholder_styling">Designation</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="branch"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.branch}
                      >
                        <option style={{ display: "none" }}></option>

                        {branch.map((branchtype) => (
                          <option key={branchtype.id} value={branchtype.id}>
                            {branchtype.city}
                          </option>
                        ))}
                      </Input>

                      <Label
                        className="placeholder_styling"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Branch
                      </Label>
                    </div>
                    {/* <span className="errortext">{errors.branch}</span> */}
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="zone"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.zone}
                      >
                        <option style={{ display: "none" }}></option>

                        {zone.map((zonetype) => (
                          <option key={zonetype.id} value={zonetype.id}>
                            {zonetype.name}
                          </option>
                        ))}
                      </Input>

                      <Label
                        className="placeholder_styling"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Zone
                      </Label>
                    </div>
                    {/* <span className="errortext">{errors.branch}</span> */}
                  </FormGroup>
                </Col>

                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="datetime-local"
                        id="meeting-time"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        name="created"
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        Created Date
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="created_by"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>

                        {username.map((types) => (
                          <option key={types.user.id} value={types.user.id}>
                            {types.user.username}
                          </option>
                        ))}
                      </Input>
                      <Label className="placeholder_styling">Created By</Label>
                    </div>
                  </FormGroup>
                </Col> */}
              </Row>
              {/* <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        name="modified"
                        className="form-control not-empty"
                        type="datetime-local"
                        id="meeting-time"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        Modified Date
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="modified_by"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>

                        {username.map((types) => (
                          <option key={types.user.id} value={types.user.id}>
                            {types.user.username}
                          </option>
                        ))}
                      </Input>
                      <Label className="placeholder_styling">Modified By</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row> */}
              <Row>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="designation"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      ></Input>
                      <Label className="placeholder_styling">Area</Label>
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
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
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
      </Container>
    </Fragment>
  );
};

export default AddFieldTeam;
