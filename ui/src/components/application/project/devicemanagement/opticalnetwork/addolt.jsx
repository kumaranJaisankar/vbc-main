import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Button,
} from "reactstrap";
import { hardwareCategoryType } from "./oltdopdowns";

import { networkaxios, adminaxios } from "../../../../../axios";
import { toast } from "react-toastify";
import { Add } from "../../../../../constant";
import useFormValidation from "../../../../customhooks/FormValidation";
import debounce from "lodash/debounce";
import ErrorModal from "../../../../common/ErrorModal";
import AddressComponent from "../../../../common/AddressComponent";
import { isEmpty } from "lodash";
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../../common/Sorting";

const AddOlt = (props) => {
  const [formData, setFormData] = useState({
    hardware_category: "",
    parent_nas: "",
    serial_no: "",
    name: "",
    no_of_ports: "",
    make: "",
    device_model: "",
    specification: "",
    notes: "",
    house_no: "",
    street: "",
    city: "",
    pincode: "",
    district: "",
    state: "",
    country: "",
    capacity: "",
    available_ports: "",
    googleAddress: "",
    olt_use_criteria: "",
    landmark: "",
    zone: "",
    area: "",
    latitude: "",
    longitude: "",
    snmp_port: null,
  });
  // const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [getolt, setGetolt] = useState([]);
  //branch autopopulate
  const [resetStatus, setResetStatus] = useState(false);
  const [parent, setParent] = useState([]);
  //zone state
  const [zone, setZone] = useState([]);
  //state for parent sl no based on zone selection
  const [getlistofslno, setGetlistofslno] = useState([]);
  const [getlistofslnobasedonarea, setGetlistofslnobasedonarea] = useState([]);

  const [getlistofareas, setGetlistofareas] = useState([]);
  //state for present serial number
  const [presentSerial, setPresentSerial] = useState([]);
  //
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  //to disable button
  const [disable, setDisable] = useState(false);
  const [inputs, setInputs] = useState({
    no_of_ports: 0,
    available_ports: 0,
  });

  useEffect(() => {
    console.log("formData UsEffect...", formData);
  }, [formData.city]);

  useEffect(() => {
    let total = parseInt(inputs.no_of_ports === "" ? 0 : inputs.no_of_ports);

    setInputs((inp) => ({ ...inp, available_ports: total }));
    setFormData((preState) => ({
      ...preState,
      available_ports: total,
    }));
  }, [inputs.no_of_ports]);

  const handleInputChange = (event) => {
    event.persist();
    setResetStatus(false);
    props.setIsDirtyFun("olt");
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;
    const id = target.id;

    setFormData((preState) => ({
      ...preState,
      [name]: value,
      [id]: value

    }));
    props.setformDataForSaveInDraft((preState) => ({
      ...preState,
      [name]: value,
      // [id]:value
    }));
    //handle change for branch dropdown while selecting branch from branch handler function
    let val = event.target.value;
    if (name == "branch") {
      branchHandler(val);
    }
    if (name == "parent_nas") {
      if (value == "") {
        setErrors({ ...errors, [name]: "" });
      } else {
        console.log(val, "checkvalue")
        parentnas(val, name);
      }
    }

    // if(name === "new_parent_nas"){
    //   showParentserial(val)

    // }
    if (name == "no_of_ports" || name == "capacity") {
      validatePortAndCapacity(name, value);
    }
    if (name == "zone") {
      // getlistofparentslno(val);
      getlistofAreas(val)
    }
    //  let val1 = event.target.value
    if (name === "area") {
      getlistofparentslnobasedonarea(val)
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
  useEffect(() => {
    setFormData((preState) => {
      let olt_use_criteria = muliplty(preState.no_of_ports, preState.capacity);

      return {
        ...preState,
        ["olt_use_criteria"]: olt_use_criteria,
      };
    });
  }, [formData.no_of_ports, formData.capacity]);

  const muliplty = (a = 1, b = 1) => a * b;

  //getting the dropdown values from api and setting it in state
  const branchHandler = (val) => {
    networkaxios
      .get(`network/nas/filter?branch=${val}`)
      .then((response) => {
        console.log(response.data);
        setGetolt(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };

  // const [showStepperList, setShowStepperList] = useState([
  //   { title: "" },
  //   { title: "" },
  //   { title: "" },
  //   { title: "" },
  // ]);
  //parentserial no useeffect method
  //latest code for search

  // const showParentserial= (val) =>{
  //   networkaxios
  //   .get(`network/search/${val}`)
  //   .then((res)=>{
  //     setPresentSerial(res.data)
  //     console.log(res.data);
  //   })
  // }

  const parentnas = useCallback(
    debounce(async (val) => {
      console.log("Add olt....");
      networkaxios
        .get(`network/search/${val}`)

        .then((res) => {
          console.log(res);

          if (Array.isArray(res.data)) {
            let lastObj = [...res.data][0];
            let stepperList = [];
            if (lastObj["category"] == "Nas") {
              setErrors({
                ...errors,
                parent_nas: "",
              });

              setParent(res.data);
              console.log(stepperList, "stepperList");
              stepperList.push({
                title:
                  lastObj["device_name"] != null ? lastObj["device_name"] : "",
              });
              props.setAvailableHardware(lastObj);
              props.setShowStepperList(stepperList);

              // stepperList[0].title =
              //   lastObj["device_name"] != null ? lastObj["device_name"] : "";
            } else {
              setErrors({
                ...errors,
                parent_nas: "Matching NAS Does Not Exist",
              });
              props.setAvailableHardware({});
            }
          } else {
            setErrors({
              ...errors,
              parent_nas: "Matching NAS Does Not Exist",
            });
            props.setAvailableHardware({});
          }
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }, 500),
    []
  );
  //end
  //end
  //old code for search
  // const parentnas = (val) => {
  //   networkaxios
  //     .get(`network/search/${val}`)

  //     .then((res) => {
  //       console.log(res);

  //       setParent(res.data);
  //     })
  //     .catch(function (error) {
  //       console.error("Something went wrong!", error);
  //     });
  // };
  //end
  // hitting an api and getting zone
  useEffect(() => {
    adminaxios
      .get("accounts/loggedin/zones")
      .then((res) => {
        console.log(res);
        // let { branch_name } = res.data;
        // setZone([...res.data]);
        // Sailaja sorting the Optical network -> Add OLT->Zone Dropdown data as alphabetical order on 24th March 2023
        setZone(Sorting([...res?.data], 'name'));

      })
      .catch((error) => console.log(error));
  }, []);
  // useEffect(() => {
  //   networkaxios
  //     .get("network/extended/options")
  //     .then((res) => {
  //       console.log(res);
  //       // let { branch_name } = res.data;
  //       setBranch([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  const resetformmanually = () => {
    console.log("olt resetformmanually");
    setFormData({
      hardware_category: "",
      parent_nas: "",
      serial_no: "",
      name: "",
      no_of_ports: "",
      make: "",
      device_model: "",
      specification: "",
      notes: "",
      house_no: "",
      street: "",
      city: "",
      pincode: "",
      district: "",
      state: "",
      country: "",
      capacity: "",
      available_ports: "",
      googleAddress: "",
      olt_use_criteria: "",
      landmark: "",
      latitude: "",
      longitude: "",
      zone: "",
      area: "",
    });
    props.setformDataForSaveInDraft({
      hardware_category: "",
      parent_nas: "",
      serial_no: "",
      name: "",
      no_of_ports: "",
      make: "",
      device_model: "",
      specification: "",
      notes: "",
      house_no: "",
      street: "",
      city: "",
      pincode: "",
      district: "",
      state: "",
      country: "",
      capacity: "",
      available_ports: "",
      olt_use_criteria: "",
      landmark: "",
      zone: "",
      area: "",
    });
    localStorage.removeItem("network/olt");
    localStorage.removeItem("networkDraftSaveKey");
    props.setLead({});
    props.setformDataForSaveInDraft({});
    props.setIsDirtyFun("");
    document.getElementById("resetid").click();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
    if (!!localStorage.getItem("network/olt")) setFormData(props.lead);
  }, [props.rightSidebar]);

  const oltadd = (e) => {
    setDisable(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      ...formData,
      capacity: parseInt(formData.capacity),
      no_of_ports: parseInt(formData.no_of_ports),
      zone: parseInt(formData.zone),
      area: parseInt(formData.area),
      house_no: !isEmpty(formData.house_no) ? formData.house_no : "N/A",
    };

    data.parent_nas = parent ? parent[0]?.id : null;
    data.serial_no = { name: formData.serial_no };
    console.log(data, "data");
    console.log(parent, "parent");
    delete data.googleAddress;
    delete data.afterfocus;
    // delete data;
    const removeEmptyValues = (object) => {
      const keys = Object.keys(object);
      for (var i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = object[key];
        if (key === '') {
          delete object[key];
        }
      }
    };

    data.franchise =
      JSON.parse(localStorage.getItem("token")) &&
      JSON.parse(localStorage.getItem("token")).franchise &&
      JSON.parse(localStorage.getItem("token")).franchise.id;
    console.log(data, "data")
    console.log(removeEmptyValues(data), "test12")
    networkaxios
      .post("network/olt/create", data, config)
      .then((response) => {
        setDisable(false);
        toast.success("OLT was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        props.Refreshhandler();
        props.dataClose();
        resetformmanually();
      }).catch(function (error) {
        setDisable(false);
        console.log(error, "errors");
      
        let errorMessage = "";
      
        // Check for a response with error data
        if (error.response && error.response.data) {
          setErrors(error.response.data);
      
          if (error.response.data.detail) {
              errorMessage = error.response.data.detail;
          } 
          else if (error.response.data["serial_no"] && error.response.data["serial_no"].length > 0) {
              errorMessage = error.response.data["serial_no"][0];
          }
          else if (error.response.data["name"] && error.response.data["name"].length > 0) {
              errorMessage = error.response.data["name"][0];
          }
          else if (error.response.status === 500) {
              errorMessage = "Internal server error. Something went wrong.";
          }
          else {
              errorMessage = "Something Went Wrong";
          }
        } 
        else {
            const errorString = JSON.stringify(error);
            const is500Error = errorString.includes("500");
            if (is500Error) {
                errorMessage = "Internal server error. Something went wrong.";
            } 
            else {
                errorMessage = "Something went wrong";
            }
        }
        // Set the error message to be displayed in the modal and open the modal
        setModalMessage(errorMessage);  // Assuming you have a state updater called setModalMessage
        setShowModal(true); // Assuming you have a state updater called setShowModal
      });      
      // .catch(function (error) {
      //   setDisable(false);
      //   if (error.response && error.response.data) {
      //     setErrors(error.response.data);
      //   }
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });
      //   if (error.response && error.response.data) {
      //     setErrors(error.response.data);
      //   }
      // });

    console.log(formData);
  };



  const submit = (e) => {



    e.preventDefault();
    e = e.target.name;
    const data = { ...formData };


    let dataNew = { ...data };
    dataNew.olt_nas_name = data.name;
    // dataNew.new_parent_nas = data.parent_nas;
    delete dataNew.name;
    delete Object.keys(data)[0]
    // delete dataNew.parent_nas;

    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;

    setErrors(validationErrors);
    if (noErrors) {
      console.log(formData);
      oltadd();
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

  const resetForm = function () {
    setResetStatus(true);

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

  const requiredFields = [
    "hardware_category",
    // "new_parent_nas",
    "parent_nas",
    "serial_no",
    "olt_nas_name",
    "no_of_ports",
    "make",
    "device_model",
    "specification",
    "notes",
    "house_no",
    "street",
    "city",
    "pincode",
    "district",
    "state",
    "country",
    "capacity",
    "available_ports",
    "zone",
    "area",
    "olt_use_criteria",
    "landmark",
    "latitude",
    "longitude",
  ];

  const franchId =
    JSON.parse(localStorage.getItem("token")) &&
      JSON.parse(localStorage.getItem("token")).franchise &&
      JSON.parse(localStorage.getItem("token")).franchise.id
      ? JSON.parse(localStorage.getItem("token")) &&
      JSON.parse(localStorage.getItem("token")).franchise &&
      JSON.parse(localStorage.getItem("token")).franchise.id
      : 0;


  // get list of areas
  const getlistofAreas = (val) => {
    adminaxios
      .get(`accounts/zone/${val}/${franchId}/operatingareas`)
      .then((response) => {
        console.log(response.data);
        // setGetlistofareas(response.data);
        // Sailaja sorting the Optical network -> Add OLT->Area Dropdown data as alphabetical order on 24th March 2023
        setGetlistofareas(Sorting((response?.data), 'name'))
      })
      // })
      .catch(function (error) {
        console.error("Something went wrong", error);
      });
  };

  //get list of serial no based on selected areas
  const getlistofparentslnobasedonarea = (val) => {
    console.log(val, "checkval");
    console.log(franchId, "franchId")
    networkaxios
      .get(`network/get/olt/${val}/slno`)
      .then((response) => {
        console.log(response.data);
        // setGetlistofslnobasedonarea(response.data);
        setGetlistofslnobasedonarea(Sorting((response?.data), 'name'))
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };


  //get list of parent sl no
  const getlistofparentslno = (val) => {
    console.log(val, "checkval");
    console.log(franchId, "franchId")
    networkaxios
      .get(`network/get/olt/${val}/${franchId}/slno`)
      .then((response) => {
        console.log(response.data);
        setGetlistofslno(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  //end
  //changed validation msg for the below fields by Marieya on 8/8/22
  const { validate } = useFormValidation(requiredFields);
  return (
    <Fragment>
      <br />
      <Row>
        <Col sm="12">
          <Form id="myForm" onReset={resetForm} ref={form}>
            <Row>
              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label
                      className="kyc_label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Hardware Category *
                    </Label>
                    <Input
                      type="select"
                      name="hardware_category"
                      className={`form-control digits ${formData && formData.hardware_category
                          ? "not-empty"
                          : ""
                        }`}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      onBlur={checkEmptyValue}
                      value={formData && formData.hardware_category}
                    >
                      <option value="" style={{ display: "none" }}></option>

                      {hardwareCategoryType.map((cateType) => {
                        return (
                          <option value={cateType.id}>{cateType.name}</option>
                        );
                      })}
                    </Input>
                  </div>
                  <span className="errortext">
                    {errors.hardware_category}
                  </span>
                </FormGroup>
              </Col>

              {JSON.parse(localStorage.getItem("token")) &&
                JSON.parse(localStorage.getItem("token")).franchise &&
                JSON.parse(localStorage.getItem("token")).franchise.name ? (
                <Col sm="4" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Franchise *</Label>
                      <Input
                        // draft
                        className={`form-control digits not-empty`}
                        value={
                          JSON.parse(localStorage.getItem("token")) &&
                          JSON.parse(localStorage.getItem("token")).franchise &&
                          JSON.parse(localStorage.getItem("token")).franchise
                            .name
                        }
                        type="text"
                        name="franchise"
                        onChange={handleInputChange}
                        style={{ textTransform: "capitalize" }}
                        disabled={true}
                      />
                    </div>
                  </FormGroup>
                </Col>
              ) : (
                <Col sm="4" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Branch *</Label>
                      <Input
                        // draft
                        className={`form-control digits not-empty`}
                        value={
                          JSON.parse(localStorage.getItem("token")) &&
                          JSON.parse(localStorage.getItem("token")).branch &&
                          JSON.parse(localStorage.getItem("token")).branch.name
                        }
                        type="text"
                        name="branch"
                        onChange={handleInputChange}
                        style={{ textTransform: "capitalize" }}
                        disabled={true}
                      />
                    </div>
                  </FormGroup>
                </Col>
              )}

              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label
                      className="kyc_label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Zone *
                    </Label>
                    <Input
                      type="select"
                      name="zone"
                      className={`form-control digits ${formData && formData.zone ? "not-empty" : ""
                        }`}
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={formData && formData.zone}
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
                    {errors.zone && "Selection is required"}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label
                      className="kyc_label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Area *
                    </Label>
                    <Input
                      type="select"
                      name="area"
                      className={`form-control digits ${formData && formData.area ? "not-empty" : ""
                        }`}
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={formData && formData.area}
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

              {/* <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Parent Serial Number</Label>
                    <Input
                      type="select"
                      name="parent_nas"
                      className={`form-control digits ${
                        formData && formData.parent_nas ? "not-empty" : ""
                      }`}
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    >
                      <option style={{ display: "none" }}></option>
                      {getlistofslnobasedonarea.map((area) => (
                        <option>{area.name}</option>
                      ))}
                    </Input>
                  </div>
                  {errors.parent_nas && (
                    <span className="errortext">
                      {errors.parent_nas && "Parent Serial No is required"}
                    </span>
                  )}
                </FormGroup>
              </Col> */}

              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Parent Serial Number</Label>
                    <Input
                      type="select"
                      name="parent_nas"
                      className={`form-control digits ${formData && formData.parent_nas ? "not-empty" : ""
                        }`}
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    >
                      <option style={{ display: "none" }}></option>
                      {getlistofslnobasedonarea.map((area) => (
                        // <option value={area.id}>{area.name}</option>
                        <option value={area.name}>{area.name}</option>
                      ))}
                    </Input>
                  </div>
                  {errors.parent_nas && (
                    <span className="errortext">
                      {errors.parent_nas && "Selection is required"}
                    </span>
                  )}
                </FormGroup>
              </Col>


              {/* <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Parent Serial Number</Label>
                    <Input
                      type="select"
                      name="parent_nas"
                      className={`form-control digits ${
                        formData && formData.parent_nas ? "not-empty" : ""
                      }`}
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    >
                      <option style={{ display: "none" }}></option>
                      {getlistofareas.map((zone) => (
                        <option>{zone.name}</option>
                      ))}
                    </Input>
                  </div>
                  {errors.parent_nas && (
                    <span className="errortext">
                      {errors.parent_nas && "Parent Serial No is required"}
                    </span>
                  )}
                </FormGroup>
              </Col> */}

              {/* {console.log(getlistofareas.map((area)=>area.name,"checkareas"))} */}

              {/* <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="parent_nas"
                      className={`form-control digits ${formData && formData.parent_nas ? "not-empty" : ""
                        }`}
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={formData && formData.parent_nas}
                    >
                    </Input>
                    <Label className="placeholder_styling">
                      Parent Serial Number *
                    </Label>
                  </div>
                  {errors.parent_nas && (
                    <span className="errortext">{errors.parent_nas}</span>
                  )}
                </FormGroup>
              </Col> */}

              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Serial Number *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      className={`form-control digits ${formData && formData.serial_no ? "not-empty" : ""
                        }`}
                      type="text"
                      name="serial_no"
                      onBlur={checkEmptyValue}
                      onChange={handleInputChange}
                      // value={inputs.first_name}
                      value={formData && formData.serial_no}
                      // .split(" ").join("")
                      maxLength="15"
                    />
                  </div>
                  <span className="errortext">
                    {/* {errors.serial_no && errors.serial_no.name[0]} */}
                    {errors.serial_no && errors.serial_no}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Hardware Name *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      className={`form-control digits ${formData && formData.name ? "not-empty" : ""
                        }`}
                      type="text"
                      name="name"
                      onBlur={checkEmptyValue}
                      onChange={handleInputChange}
                      // value={inputs.first_name}
                      value={formData && formData.name}
                      maxLength="15"
                    />

                    <span className="errortext">{errors.olt_nas_name}</span>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Number Of Ports *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      className={`form-control digits ${formData && formData.no_of_ports ? "not-empty" : ""
                        }`}
                      type="number"
                      name="no_of_ports"
                      // value={inputs.first_name}
                      maxLength="15"
                      onBlur={checkEmptyValue}
                      onChange={handleInputChange}
                      value={formData && formData.no_of_ports}
                      min="1"
                      onKeyDown={(evt) =>
                        (evt.key === "e" ||
                          evt.key === "E" ||
                          evt.key === "." ||
                          evt.key === "-") &&
                        evt.preventDefault()
                      }
                    />
                  </div>
                  <span className="errortext">{errors.no_of_ports}</span>
                </FormGroup>
              </Col>
              <Col sm="4" style={{ display: "none" }} id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Available Ports *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      type="number"
                      name="available_ports"
                      className={`form-control digits ${formData && formData.available_ports ? "not-empty" : ""
                        }`}
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={formData && formData.available_ports}
                    ></Input>
                  </div>
                  <span className="errortext">{errors.available_ports}</span>
                </FormGroup>
              </Col>

              {/* <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label
                      className="kyc_label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Make *
                    </Label>
                    <Input
                      type="select"
                      name="make"
                      className={`form-control digits ${formData && formData.make ? "not-empty" : ""
                        }`}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      onBlur={checkEmptyValue}
                      value={formData && formData.make}
                    >
                      <option value="" style={{ display: "none" }}></option>

                      {makeType.map((makedType) => {
                        return (
                          <option value={makedType.id}>{makedType.name}</option>
                        );
                      })}
                    </Input>

                  </div>
                  <span className="errortext">{errors.make}</span>
                </FormGroup>
              </Col> */}
              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label
                      className="kyc_label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Make *
                    </Label>
                    <Input
                      type="select"
                      name="make"
                      className={`form-control digits ${formData && formData.make ? "not-empty" : ""
                        }`}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      onBlur={checkEmptyValue}
                      value={formData && formData.make}
                    >
                      {/*  Sailaja sorting the Optical network -> Add OLT-> Make Dropdown data as alphabetical order on 24th March 2023 */}

                      <option value="" style={{ display: "none" }}></option>
                      <option value='DBC'>{'DBC'}</option>
                      <option value="KWSH">{"Khwahish"}</option>
                      <option value="OTLK">{"Optilink"}</option>
                      <option value="SRT">{"Syrotech"}</option>
                      <option value="TJS">{"Tejas"}</option>
                      <option value="TS">{"Timescope"}</option>
                    </Input>
                  </div>
                  <span className="errortext">{errors.make}</span>
                </FormGroup>
              </Col>

              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Model *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      type="text"
                      name="device_model"
                      className={`form-control digits ${formData && formData.device_model ? "not-empty" : ""
                        }`}
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={formData && formData.device_model}
                    ></Input>
                  </div>
                  <span className="errortext">
                    {errors.device_model}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Capacity Per Port *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      className={`form-control digits ${formData && formData.capacity ? "not-empty" : ""
                        }`}
                      type="number"
                      name="capacity"
                      onBlur={checkEmptyValue}
                      onChange={handleInputChange}
                      value={formData && formData.capacity}
                      min="1"
                      onKeyDown={(evt) =>
                        (evt.key === "e" ||
                          evt.key === "E" ||
                          evt.key === "." ||
                          evt.key === "-") &&
                        evt.preventDefault()
                      }
                    />
                  </div>
                  <span className="errortext">{errors.capacity}</span>
                </FormGroup>
              </Col>

              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">OLT Use Criteria *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      className={`form-control digits not-empty ${formData && formData.olt_use_criteria ? "not-empty" : ""
                        }`}
                      type="number"
                      name="olt_use_criteria"
                      // value={formData.olt_use_criteria}
                      disabled={true}
                      onBlur={checkEmptyValue}
                      onChange={handleInputChange}
                      value={formData && formData.olt_use_criteria}
                    />
                  </div>
                  <span className="errortext">
                    {errors.olt_use_criteria && "Field is required"}
                  </span>
                </FormGroup>
              </Col>

              <Col sm="12" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Specification *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      className={`form-control digits ${formData && formData.specification ? "not-empty" : ""
                        }`}
                      type="text"
                      name="specification"
                      rows="3"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={formData && formData.specification}
                    />
                  </div>
                  <span className="errortext">
                    {errors.specification}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <div
                    className="input_wrap"
                    style={{ position: "relative", top: "-17px" }}
                  >
                    <Label className="kyc_label">Notes *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      type="textarea"
                      className={`form-control digits ${formData && formData.notes ? "not-empty" : ""
                        }`}
                      name="notes"
                      rows="3"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={formData && formData.notes}
                    />
                  </div>
                  <span className="errortext">
                    {errors.notes}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            {props.accordionActiveKey == "1" && (
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
                googleSearchId="pac-input-olt"
              />
            )}
            <Row></Row>

            <Row>
              <Col sm="2">
                <FormGroup className="mb-0">
                  <Button
                    // id="center"
                    id="create_button"
                    color="btn btn-primary"
                    type="button"
                    className="mr-3"
                    onClick={submit}
                    style={{ textAlign: "center !important" }}
                    disabled={disable}
                  >
                    {disable ? <Spinner size="sm"> </Spinner> : null}
                    {Add}
                  </Button>
                </FormGroup>
              </Col>
              {/*Changes in reset button css by marieya on 20/8/22*/}
              <Col sm="2" >
                <FormGroup className="mb-0">
                  <Button
                    type="reset"
                    onClick={resetformmanually}
                    color="btn btn-primary"
                    class="center1"
                    id="resetid"
                    style={{
                      width: "auto"
                    }}
                  >
                    Reset
                  </Button>
                </FormGroup>
              </Col>
            </Row>
            <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
          </Form>
        </Col>
      </Row>
      {/* </Container> */}
    </Fragment>
  );
};

export default AddOlt;
