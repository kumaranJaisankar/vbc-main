import React, { Fragment, useState, useRef, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import { networkaxios, adminaxios } from "../../../../axios";
import { toast } from "react-toastify";
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';

import useFormValidation from "../../../customhooks/FormValidation";

//accordion
import { Accordion } from "react-bootstrap";
import ReactFlowParentTree from "./ReactFlowParentTree";
import AddCustomer from "../devicemanagement/opticalnetwork/addcustomer";

const CpeCollapse = (props, initialValues) => {
  const [formData, setFormData] = useState({});
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [resetStatus, setResetStatus] = useState(false);
  const [parent, setParent] = useState([]);
  const [searchedCategory, setSearchedCategory] = useState("");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  //zone state
  const [cpezone, setCpezone] = useState([]);
  const [getlistofslno, setGetlistofslno] = useState([]);
//new states for cpe addition
const [getlistofcpeareas, setGetlistofcpeareas] = useState([]);
const [getAreaincpeolt, setGetAreaincpeolt] = useState([]);
const [getlistofoltports, setGetlistofoltports] = useState([]);
const [getparentoltValue, setGetparentoltValue] = useState({});
const [getlistofpdpports, setGetlistofpdpports] = useState([]);
const [getlistofparentports, setGetlistofparentports] = useState([]);


const [getparentoltId, setGetparentoltId] = useState({});
const [getparentdpsId, setGetparentdpsId] = useState({});

const [getparentdpflag, setGetparentdpflag] = useState({});
const [selectedConnectType, setSelectedConnectType] = useState("OLT");


  useEffect(() => {
    setParent([]);
  }, [props.expandedStatus]);

  useEffect(() => {
    setFormData((prevState) => {
      return { ...prevState, parent_slno: '' }
    })
    setParent([]);
  }, [props.accordionActiveKey])

  const handleInputChange = (event) => {
    event.persist();
    setResetStatus(false);
    props.setIsDirtyFun('cpe');
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;
    let val = event.target.value;

    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
    props.setformDataForSaveInDraft((preState) => ({
      ...preState,
      [name]: value,
    }));
    if (name == "parent_slno") {
      if (value == "") {
        setErrors({ ...errors, [name]: "" })
      }
      else {
        parentnas(value, name);

      }
    }
    if (name == "zone") {
      // getlistofparentslno(val);
      getlistofAreas(val);
    }
    if (name == "area") {
      getlistofparentoltareas(val);
    }
    if (name == "parentolt") {
      getlistofparentoltports(val);
    }
    if (name == "parentoltports") {
      var parsedValue = JSON.parse(val);
      getlistofparentdpports(parsedValue.id);
      setGetparentoltValue(parsedValue.flag);
      setGetparentoltId(parsedValue.id);
    }
    if (name === "parent_dp_port") {
      getlistofparentdpportsdisplay(val);
    }
    if (name === "parent_dp_ports") {
      var parsedValue = JSON.parse(val);
      setGetparentdpsId(parsedValue.id);
      setGetparentdpflag(parsedValue.flag);
    }
  };

 // 1 get list of areas
 const getlistofAreas = (val) => {
  adminaxios
    .get(`accounts/zone/${val}/${franchId}/operatingareas`)
    .then((response) => {
      setGetlistofcpeareas(response.data);
    })
    // })
    .catch(function (error) {
      console.error("Something went wrong", error);
    });
};

// 2
const getlistofparentoltareas = (val) => {
  networkaxios
    .get(`network/area/olts/for/cpe?area=${val}`)
    .then((response) => {
      setGetAreaincpeolt(response.data);
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });
};

//3
const getlistofparentoltports = (val) => {
  networkaxios
    .get(`network/oltport/${val}/filter`)
    .then((response) => {
      setGetlistofoltports(response.data);
      // setGetlistofoltportsflag();
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });
};
//4
const getlistofparentdpports = (val) => {
  networkaxios
    .get(`network/oltport/childdps?parent_oltport=${val}`)
    .then((response) => {
      setGetlistofpdpports(response.data);
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });
};
//5
const getlistofparentdpportsdisplay = (val) => {
  networkaxios
    .get(`network/childdpport/${val}/filter`)
    .then((response) => {
      setGetlistofparentports(response.data);
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });
};
  //after submit reseting the form
  const resetformmanually = () => {
    setFormData({
      branch: "",
      nas_type: "",
      name: "",
      ip_address: "",
      secret: "",
      status: "",
      accounting_interval_time: "",
      parent_slno: ""
    });
  };
  //marieya changed setFormData to empty strings after sidebar is closed.  
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
      setFormData("");
    }
    if (!!localStorage.getItem('network/cpe'))
      setFormData(props.lead);
    if (!isEmpty(props.lead)) {
      parentnas(props.lead.parent_slno, 'parent_slno')
    }
  }, [props.rightSidebar]);

  //add nas call
  const addnas = () => {
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    networkaxios
      .post("network/nas/create", formData, config)
      .then((response) => {
        props.onUpdate(response.data);
        toast.success("Nas was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
        props.dataClose();
        resetformmanually();
      })
      .catch(function (error) {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
      });

  };

  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    const validationErrors = validate(formData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      addnas();
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
    "name",
    "branch",
    "nas_type",
    "ip_address",
    "secret",
    "status",
    "accounting_interval_time",
  ];
  const { validate } = useFormValidation(requiredFields);

  //accordion
  const [expanded1, setexpanded1] = useState(true);
  const [expanded2, setexpanded2] = useState(false);
  const [expanded3, setexpanded3] = useState(false);
  const [selectedDpRadioBtn, setSelectedDpRadioBtn] = useState("");
  const [parentDpNodeSelected, setParentDpNodeSelected] = useState({});

  const Accordion1 = () => {
    setexpanded1(!expanded1);
    setexpanded2(false);
    setexpanded3(false);
    setShowAddCustomer(true);
  };

  const parentnas = useCallback(debounce(async (val, name) => {
    networkaxios
      .get(`network/search/${val}`)
      .then((res) => {
        if (!Array.isArray(res.data)) {
          setParent([]);
        }
        setSearchedCategory("");
        let is_parent_oltport = null;
        if (Array.isArray(res.data) && (name == "parent_slno")) {

          let parentSlNoList = [...res.data];
          let lastObj = parentSlNoList[parentSlNoList.length - 1];
          let stepperList = [];
          setSearchedCategory(lastObj["category"]);
          if (lastObj["category"] == "ChildDp") {
            setSearchedCategory(lastObj["category"]);
            //search in parent sl no based in childdp entered
            stepperList.push({
              title: lastObj["parentnas"] != null ? lastObj["parentnas"] : "",
            });
            stepperList.push({
              title: lastObj["parentolt"] != null ? lastObj["parentolt"] : "",
            });
            stepperList.push({
              title: lastObj["parentdp1"] != null ? lastObj["parentdp1"] : "none",
            });
            stepperList.push({
              title:
                lastObj["parentdp2"] != null ? lastObj["parentdp2"] : "none",
            });
            stepperList.push({
              title:
                lastObj["device_name"] != null ? lastObj["device_name"] : "",
            });
            setErrors({ ...errors, parent_slno: "" });

          }

          props.setAvailableHardware(lastObj)
          props.setShowStepperList(stepperList);
          //end

          if (parentSlNoList[parentSlNoList.length - 1].category == "Olt") {
            is_parent_oltport = true;

          } else if (
            parentSlNoList[parentSlNoList.length - 1].category == "ParentDp"
          ) {
            is_parent_oltport = false;

          }
          if (Array.isArray(res.data)) {
            if (lastObj["usable"] == true) {
              setParent(res.data);
            }
            else {
              setParent([])
              setErrors({
                ...errors,
                parent_slno: "Cannot use this parent",
              });
            }
          }
          else {

          }
        }
        else if (name = "parent_slno") {
          let stepperList = [...props.showStepperList]
          stepperList[0].title = "";
          stepperList[1].title = "";
          stepperList[2].title = "";
          stepperList[3].title = "";
          stepperList[4].title = "";
          props.setAvailableHardware({})
          props.setShowStepperList(stepperList);
          // setErrors({
          //   ...errors,
          //   parent_slno: "Matching ChildDP Does Not Exist",
          // });
        }

      })
      .catch(function () {
        toast.error("Something went wrong");
      });
  }, 500), []);
  //end
  // hitting an api and getting zone
  // useEffect(() => {
  //   adminaxios
  //     .get("accounts/loggedin/zones7")
  //     .then((res) => {
  //       console.log(res);
  //       setCpezone([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
  //end
  //get list of parent sl no

  const franchId = JSON.parse(localStorage.getItem("token")) &&
    JSON.parse(localStorage.getItem("token")).franchise &&
    JSON.parse(localStorage.getItem("token")).franchise.id ? JSON.parse(localStorage.getItem("token")) &&
    JSON.parse(localStorage.getItem("token")).franchise &&
  JSON.parse(localStorage.getItem("token")).franchise.id : 0;
  const getlistofparentslno = (val) => {
    networkaxios
      .get(`network/get/cpe/${val}/${franchId}/slno`)
      .then((response) => {
        console.log(response.data);
        setGetlistofslno(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  //end
  return (
    <Fragment>
      <br />
      <Container
        fluid={true}
        style={{ backgroundColor: "#f3f3f3", marginBottom: "10px" }}
      >
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              {/* <hr /> */}
              <br />
              <Row>
              {JSON.parse(localStorage.getItem("token")) &&
                  JSON.parse(localStorage.getItem("token")).franchise &&
                  JSON.parse(localStorage.getItem("token")).franchise.name ? (
                    <Col sm="3">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Franchise *</Label>
                          <Input
                            // draft
                            className={`form-control digits not-empty`}
                            value={
                              JSON.parse(localStorage.getItem("token")) &&
                              JSON.parse(localStorage.getItem("token"))
                                .franchise &&
                              JSON.parse(localStorage.getItem("token"))
                                .franchise.name
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
                    <Col sm="3">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Branch *</Label>
                          <Input
                            // draft
                            className={`form-control digits not-empty`}
                            value={
                              JSON.parse(localStorage.getItem("token")) &&
                              JSON.parse(localStorage.getItem("token"))
                                .branch &&
                              JSON.parse(localStorage.getItem("token")).branch
                                .name
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
                <Col sm="3">
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
                   
                        {props.zone?.map((types) => (
                          <option key={types.id} value={types.id}>
                            {types.name}
                          </option>
                        ))}
                      </Input>


                    </div>
                    {/* Sailaja modified msg as Selection is required */}
                    <span className="errortext">
                    
                      {errors.zone && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label
                          className="kyc_label"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Area*
                        </Label>
                        <Input
                          type="select"
                          name="area"
                          className={`form-control digits ${
                            formData && formData.area ? "not-empty" : ""
                          }`}
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          value={formData && formData.area}
                        >
                          <option style={{ display: "none" }}></option>

                          {getlistofcpeareas.map((areas) => (
                            <option key={areas.id} value={areas.id}>
                              {areas.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <span className="errortext">
                        {errors.area && "Selection is required"}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Parent OLT</Label>
                        <Input
                          type="select"
                          name="parentolt"
                          className={`form-control digits ${
                            formData && formData.parentolt ? "not-empty" : ""
                          }`}
                          onChange={handleInputChange}
                          // onBlur={checkEmptyValue}
                          value={formData && formData.parentolt}
                        >
                          <option style={{ display: "none" }}></option>
                          {getAreaincpeolt.map((area) => (
                            <option value={area.id}>{area.serial_no}</option>
                          ))}
                        </Input>
                      </div>
                      {/* {errors.parent_slno && (
                        <span className="errortext">{errors.parent_slno}</span>
                      )} */}
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">OLT Ports</Label>
                        <Input
                          type="select"
                          name="parentoltports"
                          className={`form-control digits ${
                            formData && formData.parentoltports
                              ? "not-empty"
                              : ""
                          }`}
                          onChange={(event) => {
                            handleInputChange(event);
                          }}
                          // onBlur={checkEmptyValue}
                          value={formData && formData.parentoltports}
                        >
                          <option style={{ display: "none" }}></option>
                          {getlistofoltports.map((items) => (
                            <option value={JSON.stringify(items)}>
                              {items.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      {/* <span className="errortext">
                        {selectedConnectType == "OLT" &&
                          getparentoltValue === true &&
                          "This port is unavailable"}
                      </span> */}
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Child DP</Label>
                        <Input
                          type="select"
                          name="parent_dp_port"
                          className={`form-control digits ${
                            formData && formData.parent_slno ? "not-empty" : ""
                          }`}
                          onChange={handleInputChange}
                          // onBlur={checkEmptyValue}
                          value={formData && formData.parent_dp_port}
                        >
                          <option style={{ display: "none" }}></option>
                          {getlistofpdpports.map((area) => (
                            <option value={area.id}>{area.serial_no}</option>
                          ))}
                        </Input>
                      </div>
                      {/* {errors.parent_slno && (
                        <span className="errortext">{errors.parent_slno}</span>
                      )} */}
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Child DP Ports</Label>
                        <Input
                          type="select"
                          name="parent_dp_ports"
                          className={`form-control digits ${
                            formData && formData.parent_slno ? "not-empty" : ""
                          }`}
                          onChange={handleInputChange}
                          // onBlur={checkEmptyValue}
                          value={formData && formData.parent_dp_ports}
                        >
                          <option style={{ display: "none" }}></option>
                          {getlistofparentports.map((area) => (
                            <option value={JSON.stringify(area)}>
                              {area.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <span className="errortext">
                        {getparentdpflag === true && "This port is unavailable"}
                      </span>
                    </FormGroup>
                  </Col>


                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Parent Serial Number</Label>
                      <Input
                        type="select"
                        name="parent_slno"
                        className={`form-control digits ${formData && formData.parent_slno ? "not-empty" : ""
                          }`}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.parent_slno}
                      >
                        <option style={{ display: "none" }}></option>
                        {getlistofslno.map((zone) => (
                          <option>
                            {zone.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    {errors.parent_slno && (
                      <span className="errortext">{errors.parent_slno}</span>
                    )}
                  </FormGroup>
                </Col> */}

                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                         className={`form-control digits ${formData && formData.parent_slno ? 'not-empty' :''}`}
                        type="text"
                        name="parent_slno"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.parent_slno}
                      />
                      <Label className="placeholder_styling">
                        Parent Serial No.
                      </Label>
                    </div>
                  </FormGroup>
                  <span className="errortext">{errors.parent_slno}</span>

                </Col> */}

              </Row>
              {/* <Row>
                <Col sm="12">
                  <h6 style={{ textAlign: "center" }}>
                    Select available ports for connecting Parent
                  </h6>
                </Col>
              </Row>
              <Row>
                <Col sm="12" style={{ display: "flex", paddingLeft: "28%" }}>
                  <div style={{ margin: "0px 15px" }}>
                    <i className="fa fa-circle" style={{ color: "red" }} />
                    &nbsp; Unavailable
                  </div>
                  <div style={{ margin: "0px 15px" }}>
                    <i className="fa fa-circle" style={{ color: "#959595" }} />
                    &nbsp; Available
                  </div>

                  <div style={{ margin: "0px 15px" }}>
                    <i className="fa fa-circle" style={{ color: "green" }} />
                    &nbsp; Selected
                  </div>
                </Col>
              </Row> */}
              <br />
              {/* calling tree diagram here */}

              {/* {parent.length > 1 && searchedCategory == 'ChildDp' && (
                <div className="parenttree">
                  <ReactFlowParentTree
                    from="cpeCollapse"
                    parent={parent}
                    setParentDpNodeSelected={setParentDpNodeSelected}
                    parentDpNodeSelected={parentDpNodeSelected}
                    parent_slno={formData.parent_slno}
                  />

                </div>
              )} */}
 <AddCustomer
                         dataClose={props.dataClose}
                          lead={props.lead}
                          selectedDpRadioBtn={selectedDpRadioBtn}
                          parent={parent}
                          parentDpNodeSelected={parentDpNodeSelected}
                          Refreshhandler={props.Refreshhandler}
                          accordionActiveKey={props.accordionActiveKey}
                          Accordion1={Accordion1}
                          setParentDpNodeSelected={setParentDpNodeSelected}
                          setShowAddCustomer={setShowAddCustomer}
                          getparentdpsId={getparentdpsId}
                          getparentdpflag={getparentdpflag}
                        />
              {/* <Accordion>
                <div id="accordionoc">

                  <h5 style={{textAlign:"center"}}>
                    <Accordion.Toggle
                      style={{
                        width: "auto",
                        backgroundColor: "#e75500",
                        color: "white",
                      }}

                      className="btn btn-link txt-white "
                      color="black"
                      onClick={Accordion1}
                      eventKey="0"
                      aria-expanded={expanded1}
                      disabled={parentDpNodeSelected && !parentDpNodeSelected.id}

                    >
                      Continue
                    </Accordion.Toggle>
                  </h5>
                  {showAddCustomer &&
                    <div>
                      <Accordion.Collapse eventKey="0">
                        <AddCustomer
                         dataClose={props.dataClose}
                          lead={props.lead}
                          selectedDpRadioBtn={selectedDpRadioBtn}
                          parent={parent}
                          parentDpNodeSelected={parentDpNodeSelected}
                          Refreshhandler={props.Refreshhandler}
                          accordionActiveKey={props.accordionActiveKey}
                          Accordion1={Accordion1}
                          setParentDpNodeSelected={setParentDpNodeSelected}
                          setShowAddCustomer={setShowAddCustomer}
                        />
                      </Accordion.Collapse>
                    </div>}
                </div>
              </Accordion> */}
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default CpeCollapse;
