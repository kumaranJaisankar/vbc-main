import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Spinner,
} from "reactstrap";
import { Close } from "../../../../../constant";
import { isEmpty } from "lodash";
import useFormValidation from "../../../../customhooks/FormValidation";
import { networkaxios, adminaxios } from "../../../../../axios";
import { hardwareCategoryType, makeType } from "./oltdopdowns";
import AddressComponent from "../../../../common/AddressComponent";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { NETWORK } from "../../../../../utils/permissions";
import ErrorModal from "../../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

// import AddressComponent from "../../../../common/AddressComponent";
// import NoObjectAddressComponentDetailsPage  from  "../../../../common/NoObjectAddressComponentDetailsPage";

const OltDetails = (props, initialValues) => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState([props.lead]);
  const [leadUserBkp, setLeadUserBkp] = useState(props.lead);
  const [branch, setBranch] = useState([]);
  const [isDisabled, setIsdisabled] = useState(true);
  const [inputs, setInputs] = useState(initialValues);
  const [zone, setZone] = useState([]);
  const [ismodalShow, setIsmodalShow] = useState(false);
  const [resetStatus, setResetStatus] = useState(false);
  //to disable button
  const [disable, setDisable] = useState(false);
  const [getlistofareas, setGetlistofareas] = useState([]);

  const [isFieldsEditable, setFieldsEditable] = useState({
    no_of_ports: false,
    capacity: false,
  });
  const [isFocusOFF, setIsFocusOFF] = useState({
    no_of_ports: false,
    capacity: false,
  });
  const [currentFocusField, setCurrentFocusField] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  useEffect(() => {
    setLeadUser(props.lead);
    setLeadUserBkp(props.lead);
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    let selectedBranch = zone.find((zone) => zone.name === props.lead.zone);
    if (selectedBranch) {
      setLeadUser({ ...props.lead, zone: selectedBranch.id });
      setLeadUserBkp({ ...props.lead, zone: selectedBranch.id });
    }
    setFieldsEditable({
      no_of_ports: false,
      capacity: false,
    });
    setIsFocusOFF({
      no_of_ports: false,
      capacity: false,
    });
  }, [props.rightSidebar]);

  // useEffect(() => {
  //   networkaxios
  //     .get("network/olt/display")
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       // console.log(res);
  //       setLeadUser(res.data);
  //     });
  // }, []);

  // const LeadUserObj = { ...leadUser, nas: leadUser.nas.id };
  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    // var value = target.value;
    let val = e.target.value;


    if (e.target.name === "no_of_ports" || e.target.name === "capacity") {
      if (isFieldsEditable[e.target.name]) {
        validateHarwareValue(e.target.name, e.target.value);
        setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      }
    } else {
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    // if (e.target.name == "no_of_ports" || e.target.value == "capacity") {
    //   validatePortAndCapacity(e.target.name, e.target.value);
    // }
    if (e.target.value == "capacity") {
      validatePortAndCapacity(e.target.name, e.target.value);
    }
    if (name == "zone") {
      // getlistofparentslno(val);
  setLeadUser(prev => ({ ...prev, zone: { id: val } }));
      // getlistofAreas(val)
    } 
   };
  const validatePortAndCapacity = (name, value) => {
    if (value !== "" && value == 0) {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: `${name} should not be 0`,
        };
      });
    } else {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: "",
        };
      });
    }
  };

  const validateHarwareValue = (name, value) => {
    const currentValue = leadUserBkp[name];
    if (value < currentValue) {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: "This value should not be less than current value",
        };
      });
    } else {
      setErrors((prevState) => {
        let err = { ...prevState };
        delete err[name];
        return {
          ...err,
        };
      });
    }
  };
  //olt details
  // const oltdetails = (id) => {

  // };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    let data = { ...leadUser };

    data.house_no = !isEmpty(data && data.house_no)
      ? data && data.house_no
      : "N/A";
    delete data.parent_nas;
    delete data.available_ports;
    delete data.olt_use_criteria;

    data.no_of_ports = +data.no_of_ports;
    data.capacity = +data.capacity;
    data.zone = leadUser.zone.id;
    // const LeadUserObj = { ...leadUser, nas: leadUser.nas.id };

    let dataNew = { ...data };
    dataNew.nas_name = data.name;
    const validationErrors = validate(dataNew);
    data.serial_no = { name: data.serial_no };
    // delete data.area;
    // delete data.zone;
    const noErrors = Object.keys(validationErrors).length === 0;
    if (!noErrors) {
      if (errors.no_of_ports || errors.capacity) {
        setErrors({ ...errors, ...validationErrors });
      } else {
        setErrors({ ...validationErrors });
      }
    } else if ((noErrors && !errors.no_of_ports) || !errors.capacity) {
      setErrors({});
    }

    // const noErrors = Object.keys(validationErrors).length === 0;

    // setErrors({ ...errors, ...validationErrors });

    if (noErrors && isEmpty(noErrors)) {
      setDisable(true);
      if (!isDisabled) {
        setIsdisabled(true);
        networkaxios
          .put(`network/olt/update/${id}`, data)
          .then((res) => {
            setDisable(false);
            console.log(res);
            console.log(res.data);
            props.onUpdate(res.data);
            toast.success("OLT was edited successfully", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
            });

            setIsdisabled(true);
            props.Refreshhandler();
          })
          // .catch(function (error) {
          //   setDisable(false)
          //   if (error.response && error.response.data) {
          //     setErrors(error.response.data);
          //   }
          //   if (error.response) {
          //     let message = "";
          //     if (error.response.data && error.response.data.detail) {
          //       message = error.response.data.detail;
          //     } else {
          //       message = "Something went wrong";
          //     }
          //     setShowModal(true);
          //     setModalMessage(message);
          //   } else {
          //     setShowModal(true);
          //     setModalMessage("Something went wrong");
          //   }
          //   // toast.error("Something went wrong", {
          //   //   position: toast.POSITION.TOP_RIGHT,
          //   //   autoClose: 1000,
          //   // });
          //   // console.error("Something went wrong!", error);

          // });
          .catch(function (error) {
            setIsdisabled(false);
            setDisable(false);
            let message = "Something went wrong";
            // Check if there's an error response
            if (error.response) {
              // Handle specific HTTP status codes
              if (error.response.status === 500) {
                message = "Something went wrong";
              } else if (error.response.data) {
                setErrors(error.response.data);
                if (error.response.data.detail) {
                  message = error.response.data.detail;
                } else {
                  // Extract the first error message if 'detail' doesn't exist
                  const errorDataKeys = Object.keys(error.response.data);
                  if (errorDataKeys.length > 0) {
                    const firstErrorMessage =
                      error.response.data[errorDataKeys[0]];
                    if (Array.isArray(firstErrorMessage)) {
                      message = firstErrorMessage[0];
                    } else {
                      message = firstErrorMessage;
                    }
                  }
                }
              }
            }
            // Update the modal message and display the modal
            setModalMessage(message);
            setShowModal(true);
          });
      }
      // oltdetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }

    // }
  };

  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
  };

  const requiredFields = [
    "specification",
    // "notes",
    "house_no",
    "street",
    "city",
    "longitude",
    "latitude",
    "district",
    "pincode",
    "state",
    "country",
    "make",
    "device_model",
    "hardware_category",
    "zone",
    "nas_name",
    "serial_no",
    "landmark",
    "no_of_ports",
    "capacity",
  ];
  const { validate, Error } = useFormValidation(requiredFields);

  useEffect(() => {
    networkaxios
      .get("network/extended/options")
      .then((res) => {
        console.log(res);
        // let { branch_name } = res.data;
        setBranch([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    adminaxios
      .get("accounts/loggedin/zones")
      .then((res) => {
        console.log(res);
        // let { branch_name } = res.data;
        setZone([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);


  useEffect(() => {
    if (leadUser?.zone?.id && leadUser?.franchise?.id) {
      adminaxios
        .get(`accounts/zone/${leadUser.zone.id}/${leadUser?.franchise?.id}/operatingareas`)
        .then((response) => {
          setGetlistofareas(response?.data);
        })
        .catch((error) => {
          console.error("Something went wrong", error);
        });
    }
  }, [leadUser?.zone?.id, leadUser?.franchise?.id]);
  // get list of areas
  // const getlistofAreas = (val) => {
  //   // useEffect(() => {
  //     console.log(val,"zonecheck")
  //     if (leadUser && leadUser.zone && leadUser.franchise?.id) {
  //   adminaxios
  //     .get(`accounts/zone/${val}/${leadUser?.franchise?.id}/operatingareas`)
  //     .then((response) => {
  //       console.log(response.data);
  //       // setGetlistofareas(response.data);
  //       // Sailaja sorting the Optical network -> Add OLT->Area Dropdown data as alphabetical order on 24th March 2023
  //       setGetlistofareas(response?.data);
  //     })
  //     // })
  //     .catch(function (error) {
  //       console.error("Something went wrong", error);
  //     });
  //   }
  // // // }, [leadUser]);
  // };

  const setIsEditableModalYes = () => {
    setIsmodalShow(!ismodalShow);
    setFieldsEditable((prevState) => {
      return {
        ...prevState,
        [currentFocusField]: true,
      };
    });
  };

  const onFocusHandler = (name) => {
    if (!!name && !isFocusOFF[name]) {
      setCurrentFocusField(name);
      if (!isFieldsEditable[name]) {
        setIsmodalShow(!ismodalShow);
      }
    }
  };

  const handleBlur = (name) => {
    setIsFocusOFF((prevState) => {
      return {
        ...prevState,
        [name]: false,
      };
    });
  };

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  // useEffect(()=>{
  //   if(props.openCustomizer){
  //     setErrors({});
  //   }
  // }, [props.openCustomizer]);

  return (
    <Fragment>
      {token.permissions.includes(NETWORK.OPTICALOLTUPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "7px", right: "64px", color: "black" }}
          onClick={clicked}
          // disabled={isDisabled}
        />
      )}
      <Container fluid={true}>
        <br />
        <Form
        // onSubmit={(e) => {
        //   handleSubmit(e, props.lead.id);
        // }}
        >
          <Row style={{ marginTop: "4%" }}>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Hardware Category</Label>
                  <Input
                    id="afterfocus"
                    style={{
                      color: "#495057",
                      border: "none",
                      outline: "none",
                    }}
                    type="select"
                    name="hardware_category"
                    className={`form-control digits not-empty`}
                    disabled={isDisabled}
                    onChange={handleChange}
                    value={leadUser && leadUser.hardware_category}
                  >
                    {hardwareCategoryType.map((cateType) => {
                      return (
                        <option value={cateType.id}>{cateType.name}</option>
                      );
                    })}
                  </Input>
                </div>
                <span className="errortext">
                  {errors.hardware_category && "Select Hardware Category"}
                </span>
              </FormGroup>
            </Col>
            {/* <Col sm="4">
              <Label style={{ whiteSpace: "nowrap" }}>Branch</Label>
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    disabled={true}
                    style={{ color: "#495057" }}
                    type="select"
                    name="branch"
                    className="form-control digits"
                    onChange={handleChange}
                    id="afterfocus"
                    // disabled={isDisabled}
                    value={leadUser && leadUser.nas && leadUser.nas.branch}
                  >
                    <option style={{ display: "none" }}></option>

                    {branch.map((types) => (
                      <option key={types.branch_id} value={types.branch_name}>
                        {types.branch_name}
                      </option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col> */}
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Parent NAS</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="parent_nas"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.parent_nas}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Branch</Label>
                  <Input
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                    type="text"
                    name="branch"
                    className={`form-control digits not-empty`}
                    onChange={handleChange}
                    disabled={true}
                    value={leadUser?.branch}
                  ></Input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Franchise</Label>
                  <Input
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                    type="text"
                    name="franchise"
                    className={`form-control digits not-empty`}
                    onChange={handleChange}
                    disabled={true}
                    value={leadUser?.franchise?.name}
                  ></Input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3" id="moveup">
              {console.log(leadUser.zone?.name, "leadUser")}
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Zone</Label>
                  <Input
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                    type="select"
                    name="zone"
                    className={`form-control digits not-empty`}
                    onChange={handleChange}
                    disabled={isDisabled}
                    value={leadUser?.zone?.id}  // <-- Update this line

                    // onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>

                    {zone.map((types) => (
                      <option key={types.id} value={types.id}>
                        {types.name}
                      </option>
                    ))}
                  </Input>
                </div>
                <span className="errortext">
                  {errors.zone && "Select Zone"}
                </span>
              </FormGroup>
            </Col>{" "}
            <Col sm="3" id="moveup">
              {console.log(leadUser?.area?.id,"leadUser?.area?.id")}
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Area</Label>
                  <Input
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                    type="select"
                    name="area"
                    className={`form-control digits not-empty`}
                    onChange={handleChange}
                    disabled={isDisabled}
                    value={leadUser?.area?.id}

                    // onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>

                    {getlistofareas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Name</Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="name"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.name}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>
                  <span className="errortext">{errors.nas_name}</span>
                </div>
              </FormGroup>{" "}
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Serial Number</Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="serial_no"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.serial_no}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isDisabled}
                  ></input>
                </div>
                <span className="errortext">{errors.serial_no}</span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Available Ports</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="available_ports"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.available_ports}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={true}
                  ></input>

                  {/* <span className="errortext">{errors.hardware_name}</span> */}
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Number of Ports</Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="no_of_ports"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.no_of_ports}
                    onChange={handleChange}
                    // onBlur={handleBlur}
                    onFocus={() => onFocusHandler("no_of_ports")}
                    onBlur={() => handleBlur("no_of_ports")}
                    disabled={isDisabled}
                  ></input>

                  {!!errors.no_of_ports && (
                    <span className="errortext">{errors.no_of_ports}</span>
                  )}
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <Label className="kyc_label">OLT Use Criteria</Label>
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="olt_use_criteria"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.olt_use_criteria}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Capacity Per Port</Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="capacity"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.capacity}
                    onChange={handleChange}
                    onFocus={() => onFocusHandler("capacity")}
                    onBlur={() => handleBlur("capacity")}
                    disabled={isDisabled}
                  ></input>

                  {!!errors.capacity && (
                    <span className="errortext">{errors.capacity}</span>
                  )}
                </div>
              </FormGroup>
            </Col>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Make</Label>
                  <Input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    style={{
                      color: "#495057",
                      border: "none",
                      outline: "none",
                    }}
                    type="select"
                    name="make"
                    disabled={isDisabled}
                    onChange={handleChange}
                    value={leadUser && leadUser.make}
                  >
                    {makeType.map((typeMake) => {
                      return (
                        <option value={typeMake.id}>{typeMake.name}</option>
                      );
                    })}
                  </Input>

                  <span className="errortext">{errors.make}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Device Model</Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="device_model"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.device_model}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>

                  <span className="errortext">{errors.device_model}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Created At</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="created_at"
                    style={{ border: "none", outline: "none" }}
                    value={moment(leadUser && leadUser.created_at).format(
                      "DD MMM YY"
                    )}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Updated At</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="updated_at"
                    style={{ border: "none", outline: "none" }}
                    value={moment(leadUser && leadUser.updated_at).format(
                      "DD MMM YY"
                    )}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="12">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Specification</Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="specification"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.specification}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isDisabled}
                  ></input>

                  <span className="errortext">{errors.specification}</span>
                </div>
              </FormGroup>
            </Col>
          </Row>
          {props.lead && props.lead.id && (
            <AddressComponent
              handleInputChange={handleChange}
              errors={errors}
              setFormData={setLeadUser}
              formData={leadUser}
              setInputs={setInputs}
              resetStatus={resetStatus}
              setResetStatus={setResetStatus}
              isDisabled={isDisabled}
              setErrors={setErrors}
            />
          )}
          {/* <NoObjectAddressComponentDetailsPage
            handleInputChange={handleChange}
            errors={errors}
            setFormData={setLeadUser}
            formData={leadUser}
            setInputs={setInputs}
            resetStatus={resetStatus}
            setResetStatus={setResetStatus}
            isDisabled={isDisabled}
          /> */}
          {/* <Row>
            <Col sm="12">
              <Label>Notes</Label>
              <input
                id="afterfocus"
                type="text"
                name="notes"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.notes}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.notes}</span>

            </Col>
          </Row>
          <Row>
            <h6 style={{ paddingLeft: "20px" }}>Address</h6>
          </Row>
          <Row>
            <Col md="4">
              <Label>H.No :</Label>
              <input
                type="text"
                name="house_no"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.house_no}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.house_no}</span>
            </Col>
            <Col md="4">
              <Label>Landmark</Label>
              <input
                type="text"
                name="landmark"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.landmark}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.landmark}</span>
            </Col>
            <Col md="4">
              <Label>Street</Label>
              <input
                type="text"
                name="street"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.street}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.street}</span>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <Label>City</Label>
              <input
                type="text"
                name="city"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.city}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.city}</span>
            </Col>
            <Col md="4">
              <Label>Pin Code</Label>
              <input
                type="text"
                name="pincode"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.pincode}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.pincode}</span>
            </Col>
            <Col md="4">
              <Label>District</Label>
              <input
                type="text"
                name="district"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.district}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.district}</span>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <Label>State</Label>
              <input
                type="text"
                name="state"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.state}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.state}</span>
            </Col>
            <Col md="4">
              <Label>Country</Label>
              <input
                type="text"
                name="country"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.country}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.country}</span>
            </Col>
            <Col md="4">
              <Label>Latitude</Label>
              <input
                type="text"
                name="latitude"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.latitude}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
             
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <Label>Longitude</Label>
              <input
                type="text"
                name="longitude"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.longitude}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              
            </Col>
          </Row> */}
          <Row style={{ marginTop: "-2%" }}>
            <span
              className="sidepanel_border"
              style={{ position: "relative", top: "25px" }}
            ></span>
          </Row>
          <br />
          <button
            type="button"
            name="submit"
            class="btn btn-primary"
            onClick={(e) => handleSubmit(e, props.lead.id)}
            id="save_button"
            disabled={isDisabled}
          >
            {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp; &nbsp; &nbsp;
          <button
            type="button"
            name="cancel"
            class="btn btn-secondary"
            onClick={props.dataClose}
            id="resetid"
          >
            Cancel
          </button>
          <br />
          {/* {errors.detail && <span className="errortext">{errors.detail}</span>} */}
        </Form>
        <ErrorModal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          message={modalMessage}
          action={() => setShowModal(false)}
        />
        <Modal
          isOpen={ismodalShow}
          toggle={() => setIsmodalShow(!ismodalShow)}
          centered
        >
          <ModalHeader toggle={() => setIsmodalShow(!ismodalShow)}>
            Confirmation
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to edit this hardware attribute?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => {
                setIsFocusOFF((prevState) => {
                  return {
                    ...prevState,
                    [currentFocusField]: true,
                  };
                });
                setIsmodalShow(false);
              }}
              id="resetid"
            >
              {Close}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setIsEditableModalYes();
              }}
              id="yes_button"
            >
              Yes
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </Fragment>
  );
};

export default OltDetails;

// import React, { Fragment, useEffect, useState } from "react"; //hooks
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardHeader,
//   CardBody,
//   TabPane,
//   Nav,
//   NavItem,
//   NavLink,
//   TabContent,
//   Form,
//   Label,
//   FormGroup,
//   Input,
//   Modal,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   Button,
// } from "reactstrap";
// import { Close } from "../../../../../constant";
// import get from "lodash/get";
// import { isEmpty } from "lodash";
// import axios from "axios";
// import useFormValidation from "../../../../customhooks/FormValidation";
// import { networkaxios, adminaxios } from "../../../../../axios";
// import { hardwareCategoryType, makeType } from "./oltdopdowns";

// const OltDetails = (props, initialValues) => {
//   const { id } = useParams();
//   const [errors, setErrors] = useState({});
//   const [leadUser, setLeadUser] = useState(props.lead);
//   const [leadUserBkp, setLeadUserBkp] = useState(props.lead);
//   const [branch, setBranch] = useState([]);
//   const [isDisabled, setIsdisabled] = useState(true);
//   const [inputs, setInputs] = useState(initialValues);
//   const [zone, setZone] = useState([]);
//   const [ismodalShow, setIsmodalShow] = useState(false);
//   const [isFieldsEditable, setFieldsEditable] = useState({
//     no_of_ports: false,
//     capacity: false,
//   });
//   const [isFocusOFF, setIsFocusOFF] = useState({
//     no_of_ports: false,
//     capacity: false,
//   });
//   const [currentFocusField, setCurrentFocusField] = useState("");

//   useEffect(() => {
//     setLeadUser(props.lead);
//     setLeadUserBkp(props.lead);
//   }, [props.lead]);

//   useEffect(() => {
//     setIsdisabled(true);
//     let selectedBranch = zone.find((zone) => zone.name === props.lead.zone);
//     if (selectedBranch) {
//       setLeadUser({ ...props.lead, zone: selectedBranch.id });
//       setLeadUserBkp({ ...props.lead, zone: selectedBranch.id });
//     }
//     setFieldsEditable({
//       no_of_ports: false,
//       capacity: false,
//     });
//     setIsFocusOFF({
//       no_of_ports: false,
//       capacity: false,
//     });
//   }, [props.rightSidebar]);

//   // useEffect(() => {
//   //   networkaxios
//   //     .get("network/olt/display")
//   //     // .then((res) => setData(res.data))
//   //     .then((res) => {
//   //       // console.log(res);
//   //       setLeadUser(res.data);
//   //     });
//   // }, []);

//   // const LeadUserObj = { ...leadUser, nas: leadUser.nas.id };
//   const handleChange = (e) => {
//     if (e.target.name === "no_of_ports" || e.target.name === "capacity") {
//       if (isFieldsEditable[e.target.name]) {
//         validateHarwareValue(e.target.name, e.target.value);
//         setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//       }
//     } else {
//       setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     }
//   };
//   const validateHarwareValue = (name, value) => {
//     const currentValue = leadUserBkp[name];
//     if (value < currentValue) {
//       setErrors((prevState) => {
//         return {
//           ...prevState,
//           [name]: "this value should not be less than current value",
//         };
//       });
//     } else {
//       setErrors((prevState) => {
//         let err = { ...prevState };
//         delete err[name];
//         return {
//           ...err,
//         };
//       });
//     }
//   };
//   //olt details
//   const oltdetails = (id) => {
//     let data = { ...leadUser };
//     delete data.parent_nas;
//     delete data.available_ports;
//     delete data.olt_use_criteria;

//     data.serial_no = { name: data.serial_no };
//     data.no_of_ports = +data.no_of_ports;
//     data.capacity = +data.capacity;

//     if (!isDisabled) {
//       networkaxios
//         .put(`network/olt/update/${id}`, data)
//         .then((res) => {
//           console.log(res);
//           console.log(res.data);
//           props.onUpdate(res.data);
//           toast.success("Olt was edited successfully", {
//             position: toast.POSITION.TOP_RIGHT,
//           });

//           setIsdisabled(true);
//         })
//         .catch(function (error) {
//           if (error.response && error.response.data) {
//             setErrors(error.response.data);
//           }
//           toast.error("Something went wrong", {
//             position: toast.POSITION.TOP_RIGHT,
//           });
//           console.error("Something went wrong!", error);
//         });
//     }
//   };

//   const handleSubmit = (e, id) => {
//     e.preventDefault();
//     // const LeadUserObj = { ...leadUser, nas: leadUser.nas.id };

//     const validationErrors = validate(leadUser);
//     const noErrors = Object.keys(validationErrors).length === 0;

//     setErrors({ ...errors, ...validationErrors });

//     if (noErrors && isEmpty(errors)) {
//       console.log(leadUser);
//       oltdetails(id);
//     } else {
//       console.log("errors try again", validationErrors);
//     }

//     // }
//   };

//   const clicked = (e) => {
//     e.preventDefault();
//     console.log("u clicked");
//     setIsdisabled(false);
//   };

//   const requiredFields = [
//     "specification",
//     "notes",
//     "house_no",
//     "street",
//     "city",
//     "district",
//     "pincode",
//     "state",
//     "country",
//     "make",
//     "device_model",
//   ];
//   const { validate, Error } = useFormValidation(requiredFields);

//   useEffect(() => {
//     networkaxios
//       .get("network/extended/options")
//       .then((res) => {
//         console.log(res);
//         // let { branch_name } = res.data;
//         setBranch([...res.data]);
//       })
//       .catch((error) => console.log(error));
//   }, []);
//   useEffect(() => {
//     adminaxios
//       .get("accounts/zone/list/create")
//       .then((res) => {
//         console.log(res);
//         // let { branch_name } = res.data;
//         setZone([...res.data]);
//       })
//       .catch((error) => console.log(error));
//   }, []);

//   const setIsEditableModalYes = () => {
//     setIsmodalShow(!ismodalShow);
//     setFieldsEditable((prevState) => {
//       return {
//         ...prevState,
//         [currentFocusField]: true,
//       };
//     });
//   };

//   const onFocusHandler = (name) => {
//     if (!!name && !isFocusOFF[name]) {
//       setCurrentFocusField(name);
//       if (!isFieldsEditable[name]) {
//         setIsmodalShow(!ismodalShow);
//       }
//     }
//   };

//   const handleBlur = (name) => {
//     setIsFocusOFF((prevState) => {
//       return {
//         ...prevState,
//         [name]: false,
//       };
//     });
//   };
//   return (
//     <Fragment>
//       <Container fluid={true}>
//         <Row>
//           <Col sm="5">
//             <i
//               className="icofont icofont-edit"
//               // disabled={isDisabled}
//               onClick={clicked}
//               style={{
//                 fontSize: "27px",
//                 cursor: "pointer",
//               }}
//             ></i>
//           </Col>
//           <Col>
//             <h6>ID : OLT{props.lead && props.lead.id}</h6>
//           </Col>
//         </Row>
//         <br />
//         <Form
//           onSubmit={(e) => {
//             handleSubmit(e, props.lead.id);
//           }}
//         >
//           <Row>
//             <Col sm="4">
//               <Label style={{ whiteSpace: "nowrap" }}>Hardware Category</Label>
//               <FormGroup>
//                 <div className="input_wrap">
//                   <Input
//                     id="afterfocus"
//                     style={{ color: "#495057" }}
//                     type="select"
//                     name="hardware_category"
//                     className="form-control digits"
//                     disabled={isDisabled}
//                     onChange={handleChange}
//                     value={leadUser && leadUser.hardware_category}
//                   >
//                     {hardwareCategoryType.map((cateType) => {
//                       return (
//                         <option value={cateType.id}>{cateType.name}</option>
//                       );
//                     })}
//                   </Input>
//                 </div>
//               </FormGroup>
//             </Col>

//             <Col md="4">
//               <Label>Parent Nas</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="parent_nas"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.parent_nas}
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//             <Col sm="4">
//               <FormGroup>
//                 <div className="input_wrap">
//                   <Input
//                     type="select"
//                     name="zone"
//                     className="form-control digits not-empty"
//                     onChange={handleChange}
//                     disabled={isDisabled}
//                     value={leadUser && leadUser.zone}

//                     // onBlur={checkEmptyValue}
//                   >
//                     <option style={{ display: "none" }}></option>

//                     {zone.map((types) => (
//                       <option key={types.id} value={types.id}>
//                         {types.name}
//                       </option>
//                     ))}
//                   </Input>

//                   <Label
//                     className="placeholder_styling"
//                     style={{ whiteSpace: "nowrap" }}
//                   >
//                     Zone
//                   </Label>
//                 </div>
//               </FormGroup>
//             </Col>{" "}

//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>Name</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="name"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.name}
//                 onChange={handleChange}
//                 disabled={isDisabled}
//               ></input>
//             </Col>
//             <Col md="4">
//               <Label>Serial No.</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="serial_no"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.serial_no}
//                 onChange={handleChange}
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//             </Col>

//             <Col md="4">
//               <Label>Available Ports</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="available_ports"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.available_ports}
//                 onChange={handleChange}
//                 // onBlur={blur}
//                 disabled={true}
//               ></input>
//               {/* <span className="errortext">{errors.hardware_name}</span> */}
//             </Col>
//           </Row>
//           <br />
//           <Row>
//             <Col md="4">
//               <Label>No Of Ports</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="no_of_ports"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.no_of_ports}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 onFocus={() => onFocusHandler("no_of_ports")}
//                 onBlur={() => handleBlur("no_of_ports")}
//                 disabled={isDisabled}
//               ></input>
//               {!!errors.no_of_ports && (
//                 <span className="errortext">{errors.no_of_ports}</span>
//               )}
//             </Col>

//             <Col md="4">
//               <Label>Olt User Criteria</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="olt_use_criteria"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.olt_use_criteria}
//                 onChange={handleChange}
//                 // onBlur={blur}
//                 disabled={true}
//               ></input>
//             </Col>
//             <Col md="4">
//               <Label>Capacity</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="capacity"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.capacity}
//                 onChange={handleChange}
//                 onFocus={() => onFocusHandler("capacity")}
//                 onBlur={() => handleBlur("capacity")}
//                 disabled={isDisabled}
//               ></input>
//               {!!errors.capacity && (
//                 <span className="errortext">{errors.capacity}</span>
//               )}
//             </Col>
//           </Row>
//           <Row>
//             <Col sm="4">
//               <Label style={{ whiteSpace: "nowrap" }}>Make</Label>
//               <FormGroup>
//                 <div className="input_wrap">
//                   <Input
//                     id="afterfocus"
//                     style={{ color: "#495057" }}
//                     type="select"
//                     name="make"
//                     className="form-control digits"
//                     disabled={isDisabled}
//                     onChange={handleChange}
//                     value={leadUser && leadUser.make}
//                   >
//                     {makeType.map((typeMake) => {
//                       return (
//                         <option value={typeMake.id}>{typeMake.name}</option>
//                       );
//                     })}
//                   </Input>
//                   <span className="errortext">{errors.make}</span>
//                 </div>
//               </FormGroup>
//             </Col>
//             <Col md="4">
//               <Label>Device Model</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="device_model"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.device_model}
//                 onChange={handleChange}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.device_model}</span>
//             </Col>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>Created At</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="created_at"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.created_at}
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//             <Col md="4">
//               <Label>Updated At</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="updated_at"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.updated_at}
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//           </Row>
//           <Row>
//             <Col sm="12">
//               <Label>Specification</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="specification"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.specification}
//                 onChange={handleChange}
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//             </Col>
//           </Row>
//           <Row>
//             <Col sm="12">
//               <Label>Notes</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="notes"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.notes}
//                 onChange={handleChange}
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//             </Col>
//           </Row>
//           <Row>
//             <h6 style={{ paddingLeft: "20px" }}>Address</h6>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>H.No :</Label>
//               <input
//                 type="text"
//                 name="house_no"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.house_no}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.house_no}</span>
//             </Col>
//             <Col md="4">
//               <Label>Landmark</Label>
//               <input
//                 type="text"
//                 name="landmark"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.landmark}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               {/* <span className="errortext">{errors.landmark}</span> */}
//             </Col>
//             <Col md="4">
//               <Label>Street</Label>
//               <input
//                 type="text"
//                 name="street"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.street}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.street}</span>
//             </Col>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>City</Label>
//               <input
//                 type="text"
//                 name="city"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.city}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.city}</span>
//             </Col>
//             <Col md="4">
//               <Label>Pin Code</Label>
//               <input
//                 type="text"
//                 name="pincode"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.pincode}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.pincode}</span>
//             </Col>
//             <Col md="4">
//               <Label>District</Label>
//               <input
//                 type="text"
//                 name="district"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.district}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.district}</span>
//             </Col>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>State</Label>
//               <input
//                 type="text"
//                 name="state"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.state}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.state}</span>
//             </Col>
//             <Col md="4">
//               <Label>Country</Label>
//               <input
//                 type="text"
//                 name="country"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.country}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.country}</span>
//             </Col>
//             <Col md="4">
//               <Label>Latitude</Label>
//               <input
//                 type="text"
//                 name="latitude"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.latitude}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               {/* <span className="errortext">{errors.latitude}</span> */}
//             </Col>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>Longitude</Label>
//               <input
//                 type="text"
//                 name="longitude"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.longitude}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               {/* <span className="errortext">{errors.longitude}</span> */}
//             </Col>
//           </Row>
//           <br />
//           <button type="submit" name="submit" class="btn btn-primary">
//             Save
//           </button>
//           &nbsp;
//           <button
//             type="submit"
//             name="submit"
//             class="btn btn-danger"
//             onClick={props.dataClose}
//           >
//             Cancel
//           </button>
//           <br />
//           {errors.detail && <span className="errortext">{errors.detail}</span>}
//         </Form>

//         <Modal
//           isOpen={ismodalShow}
//           toggle={() => setIsmodalShow(!ismodalShow)}
//           centered
//         >
//           <ModalHeader toggle={() => setIsmodalShow(!ismodalShow)}>
//             Confirmation
//           </ModalHeader>
//           <ModalBody>
//             <p>Are you sure you want to edit this hardware attribute?</p>
//           </ModalBody>
//           <ModalFooter>
//             <Button
//               color="secondary"
//               onClick={() => {
//                 setIsFocusOFF((prevState) => {
//                   return {
//                     ...prevState,
//                     [currentFocusField]: true,
//                   };
//                 });
//                 setIsmodalShow(false);
//               }}
//             >
//               {Close}
//             </Button>
//             <Button
//               color="primary"
//               onClick={() => {
//                 setIsEditableModalYes();
//               }}
//             >
//               Yes
//             </Button>
//           </ModalFooter>
//         </Modal>
//       </Container>
//     </Fragment>
//   );
// };

// export default OltDetails;
