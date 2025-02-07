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
import { adminaxios } from "../../../axios";
import { toast } from "react-toastify";
// import AddressComponent from "./AddressComponent";
import { Add } from "../../../constant";
import useFormValidation from "../../customhooks/FormValidation";
import AddressComponent from "../../common/AddressComponent";
import Multiselect from "./multiselectcheckbox";
// adding fanchise
const AddBranchManagement = (props, initialValues) => {
  const [resetStatus, setResetStatus] = useState(false);
  const [assignedTo, setAssignedTo] = useState([]);

  //state for getting area,zone
  const [arealist, setArealist] = useState([]);

  const [formData, setFormData] = useState({
    user: "",
    googleAddress: "",
  });

  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  //
  const [resetfield, setResetfield] = useState(false);

  //area and zone state
  const [areazone, setAreaZone] = useState([]);
  //state for address auto populate
  const [address, setAddress] = useState([]);

  // draft
  useEffect(() => {
    if (props.lead) {
      setFormData((prevState) => {
        return {
          ...prevState,
          ...props.lead,
        };
      });
    }
  }, [props.lead]);

  const handleInputChange = (event, isAddress = false, serviceId) => {
    if (event) event.persist();
    // draft
    setResetfield(false);
    props.setIsDirtyFun(true);
    setResetStatus(false);
    if (isAddress) {
      setInputs((inputs) => ({
        ...inputs,
        address: {
          ...inputs.address,
          [event.target.name]: event.target.value,
        },
      }));
    } else {
      setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: event.target.value,
      }));
    }

    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (isAddress) {
      setFormData((preState) => ({
        ...preState,
        address: {
          ...preState.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
      // draft
      props.setformDataForSaveInDraft((preState) => ({
        ...preState,
        [name]: value,
      }));
    }

    //upon select branch display zone
    if (name == "branch") {
      // getZonebyBranch(value);
      displayZone(value);
      addressautopopulate(value);
    }

    //upon select zone display area
    if (name == "zone") {
      getAreabyZone(value);
    }
  };

  const addFranchise = (e, id) => {
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let address = {
      house_no: formData["house_no"],
      city: formData["city"],
      landmark: formData["landmark"],
      country: formData["country"],
      street: formData["street"],
      district: formData["district"],
      pincode: formData["pincode"],
      state: formData["state"],
    };

    formData.address = { ...address };

    let plans = [];

    delete formData.plans;

    delete formData.googleAddress;
    let submitdata = { ...formData };
    if (plans.length > 0) {
      submitdata = { ...formData, plans };
    }

    adminaxios
      .patch(`accounts/branch/${id}/rud`, submitdata, config)
      .then((response) => {
        let responsedata = { ...response.data };

        props.onUpdate(responsedata);
        toast.success("Branch was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        resetformmanually();
      })
      .catch(function (error) {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  const submit = (e) => {
    let dataNew = { ...formData };
    dataNew.franc_name = formData.name;

    e.preventDefault();
    e = e.target.name;

    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      addFranchise();
      // setServicelist({});
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const requiredFields = [


  ];

  const { validate } = useFormValidation(requiredFields);

  const resetformmanually = () => {
    setResetfield(true);
    setFormData({

      user: "",
      code: "",
      branch: "",
      areas: "",

      house_no: "",
      street: "",
      district: "",
      pincode: "",
      state: "",
      country: "",
      landmark: "",

      googleAddress: "",

      city: "",
    });
    document.getElementById("resetid").click();
  };

  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
    // draft
    // setFormData(props.lead);
    setFormData((preState) => ({
      ...preState,
      ...props.lead,
    }));
  }, [props.rightSidebar]);

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  // const resetInputField = () => {};
  const resetForm = function () {
    setResetStatus(true);

    setResetfield(true);

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

  //dynamic options
  useEffect(() => {

    adminaxios
      .get("accounts/options/all")
      .then((res) => {
        let { users } = res.data;
        setAssignedTo([...users]);
      })
      .catch((err) => console.log(err));
  }, []);

  // branch api
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        setBranch([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);

  //get area options based on zone
  const getAreabyZone = (val) => {
    adminaxios
      .get(`accounts/zone/${val}/areas`)
      .then((response) => {
        setAreaZone(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  //integrate api for zone and area
  const displayZone = (id) => {
    adminaxios
      .get(`accounts/branch/${id}/zones/areas`)
      .then((res) => {
        // let { branch_name } = res.data;
        setArealist([...res.data]);
      })
      .catch((error) => console.log(error));
  };
  //use effect for address autopopulate while selecting branch
  const addressautopopulate = (id) => {

    adminaxios
      .get(`accounts/branch/${id}/rud`)
      .then((res) => {
        setAddress({ ...res.data });
        setFormData((preState) => ({
          ...preState,

          house_no: res.data.address.house_no,
          street: res.data.address.street,
          district: res.data.address.district,
          pincode: res.data.address.pincode,
          state: res.data.address.state,
          landmark: res.data.address.landmark,
          city: res.data.address.city,
          country: res.data.address.country,


        }));
      })
      .catch((error) => console.log(error));
  }


  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>

                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="branch"
                        className={`form-control digits ${formData && formData.branch ? "not-empty" : ""
                          }`}
                        onBlur={checkEmptyValue}
                        onChange={handleInputChange}
                        value={formData && formData.branch}
                      >
                        <option style={{ display: "none" }}></option>
                        {branch.map((types) => (
                          <option key={types.id} value={types.id}>
                            {types.name}
                          </option>
                        ))}
                      </Input>
                      <Label className="placeholder_styling">Branch *</Label>
                    </div>
                    <span className="errortext">{errors.branch}</span>
                  </FormGroup>
                </Col>

                <Col sm="3">
                  <FormGroup>
                    <Multiselect
                      arealist={arealist}
                      setFormData={setFormData}
                      resetfield={resetfield}
                      setResetfield={setResetfield}
                    />
                    <span className="errortext">{errors.areas}</span>
                  </FormGroup>
                </Col>

                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="user"
                        // draft
                        className={`form-control digits ${formData && formData.user ? "not-empty" : ""
                          }`}
                        value={formData && formData.user}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {assignedTo.map((assignedto) => (
                          <option key={assignedto.id} value={assignedto.id}>
                            {assignedto.username}
                          </option>
                        ))}
                      </Input>
                      <Label className="placeholder_styling">Owner</Label>
                    </div>
                    <span className="errortext">
                      {errors.user && "Please Select Owner"}
                    </span>
                  </FormGroup>
                </Col>
              </Row>

              <AddressComponent
                handleInputChange={handleInputChange}
                checkEmptyValue={checkEmptyValue}
                errors={errors}
                setFormData={setFormData}
                formData={formData}
                setInputs={setInputs}
                resetStatus={resetStatus}
                setResetStatus={setResetStatus}
                setIsDirtyFun={props.setIsDirtyFun}
              />

              <>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                    // onClick={resetInputField}
                    >
                      {Add}
                    </Button>
                    <Button
                      type="button"
                      color="btn btn-primary"
                      id="resetid"
                      onClick={resetformmanually}
                    >
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddBranchManagement;
