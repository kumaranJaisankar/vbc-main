import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

import { networkaxios, adminaxios } from "../../../../axios";
import { toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
//accordion
import AddDistribution from "../devicemanagement/opticalnetwork/adddistribution";
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../common/Sorting";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const Collapse = (props, initialValues) => {
  console.log(props, "propsprops");
  const [formData, setFormData] = useState({
    // device_type:'parentdptype'
  });
  const [inputs, setInputs] = useState("");
  const [deviceType, setDeviceTYpe] = useState("parentdptype");
  const [errors, setErrors] = useState({});

  const [branch, setBranch] = useState([]);
  //state for toggle

  const [resetStatus, setResetStatus] = useState(false);
  const [parent, setParent] = useState([]);
  const [searchedCategory, setSearchedCategory] = useState("");
  const [refrence, setRefrence] = useState();
  const [presentSerial, setPresentSerial] = useState([]);

  //accordion
  const [expanded1, setexpanded1] = useState(true);
  const [selectedDpRadioBtn, setSelectedDpRadioBtn] = useState("");
  const [parentDpNodeSelected, setParentDpNodeSelected] = useState({});
  const [showAddDistribution, setShowAddDistribution] = useState(false);
  const [getlistofslno, setGetlistofslno] = useState([]);
  const [getlistofslnobasedonarea, setGetlistofslnobasedonArea] = useState([]);
  //parent olt field states on dec 5
  const [getAreainolt, setGetAreainolt] = useState([]);
  const [getlistofareas, setGetlistofareas] = useState([]);
  const [getlistofoltports, setGetlistofoltports] = useState([]);
  const [getlistofoltportsflag, setGetlistofoltportsflag] = useState([]);
  const [getlistofpdpports, setGetlistofpdpports] = useState([]);
  const [getlistofparentports, setGetlistofparentports] = useState([]);
  //end
  //new states for Device Type
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [selectedConnectType, setSelectedConnectType] = useState("OLT");

  console.log(selectedConnectType, "selectedConnectType");
  // get flag error messgae
  const [parentOltPorts, setParentOltPorts] = useState("parentdp");
  const [getparentoltValue, setGetparentoltValue] = useState({});
  //state for displaying error if flag is true when connect type is pdp
  const [getparentdpflag, setGetparentdpflag] = useState({});

  //states for getting OLT/PDP Port IDS
  const [getparentoltId, setGetparentoltId] = useState({});
  const [getparentdpsId, setGetparentdpsId] = useState({});

  //end
  //end
  const [childstate, setChildState] = useState(false);
  const [childstate1, setChildState1] = useState(false);
  const [getFlag, setGetFlag] = useState({});
  //zone state
  const getInitialState = () => {
    const value = "parentdp";
    return value;
  };
  const [value, setValue] = useState(getInitialState);

  // const [dpzone, setDpzone] = useState([]);
  //state for disable collapse
  useEffect(() => {
    setParent([]);
  }, [props.expandedStatus]);

  useEffect(() => {
    if (isEmpty(props.lead)) {
      setFormData((prevState) => {
        return { ...prevState, parent_slno: "" };
      });
      setParent([]);
      let stepperList = [];
      stepperList.push({ title: "" });
      stepperList.push({ title: "" });
      stepperList.push({ title: "" });
      stepperList.push({ title: "" });
      stepperList.push({ title: "" });
      props.setAvailableHardware({});
      props.setShowStepperList(stepperList);
    }
  }, [props.accordionActiveKey]);

  useEffect(() => {
    if (props.lead) {
      setFormData((prevState) => {
        return {
          ...prevState,
          ...props.lead,
        };
      });
      if (!isEmpty(props.lead)) {
        setSelectedDpRadioBtn(
          props.lead ? props.lead.selectedDpRadioBtn : "parentdp"
        );
      }
    }
  }, [props.lead]);
  const handleInputChange = (event) => {
    setValue(event.target.value);
    event.persist();
    setResetStatus(false);

    props.setIsDirtyFun("dp");
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
        setErrors({ ...errors, [name]: "" });
      } else {
        parentnas(value, name);
      }
    }
    // childdptype
    if (event.target.value == "parentdptype") {
      setChildState(true);
    }
    if (event.target.value == "childdptype") {
      setChildState1(true);
    }
    // if(name === "new_parent_slno"){
    //   showParentserial(val)

    // }
    if (name == "zone") {
      // getlistofparentslno(val);
      getlistofAreas(val);
    }
    if (name == "area") {
      // getlistofparentslnobasedonarea(val);
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

  console.log(getparentdpsId, "getparentdpsId");
  // useEffect(() => {
  //   networkaxios
  //     .get("network/extended/options")
  //     .then((res) => {
  //       setBranch([...res.data]);
  //     })
  //     .catch((error) => toast.error("error extended options"));
  // }, []);
  //after submit reseting the form
  const resetformmanually = () => {
    setFormData({
      device_type: "",
      connect: "",
      branch: "",
      zone: "",
      area: "",
      parentolt: "",
      parent_dp_port: "",
      parentoltports: "",
      parent_dp_port: "",
      parent_dp_ports: "",
      nas_type: "",
      name: "",
      ip_address: "",
      secret: "",
      status: "",
      accounting_interval_time: "",
      parent_slno: "",
    });
  };
  //marieya changed setFormData to empty strings after sidebar is closed.
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
      setFormData("");
    }
    setSelectedDpRadioBtn("");
    if (!!localStorage.getItem("network/dp")) setFormData(props.lead);
    if (!isEmpty(props.lead)) {
      setSelectedDpRadioBtn(
        props.lead ? props.lead.selectedDpRadioBtn : "parentdp"
      );
      setErrors({ ...errors, parent_slno: "" });
      parentnas(props.lead.parent_slno, "parent_slno");
    }
  }, [props.rightSidebar]);

  //add nas call

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const form = useRef(null);

  const requiredFields = [
    "parentoltports",
    "name",
    "branch",
    "nas_type",
    "ip_address",
    "secret",
    "status",
    "accounting_interval_time",
    "connect",
  ];

  const Accordion1 = (e) => {
    setexpanded1(!expanded1);
    setShowAddDistribution(true);
  };
  //api call for parent serial number with area
  // const showParentserial= (val) =>{
  //   networkaxios
  //   .get(`network/search/${val}`)
  //   .then((res)=>{
  //     setPresentSerial(res.data)
  //     console.log(res.data);
  //   })
  // }

  const parentnas = useCallback(
    debounce(async (val, name) => {
      networkaxios
        .get(`network/search/${val}`)
        .then((res) => {
          if (!Array.isArray(res.data)) {
            setParent([]);
          }
          setSearchedCategory("");
          let is_parent_oltport = null;
          if (Array.isArray(res.data) && name == "parent_slno") {
            let parentSlNoList = [...res.data];
            let lastObj = parentSlNoList[parentSlNoList.length - 1];
            let stepperList = [];

            if (
              (lastObj["category"] == "Olt" ||
                lastObj["category"] == "ParentDp") &&
              name == "parent_slno"
            ) {
              setSearchedCategory(lastObj["category"]);
              if (lastObj["category"] == "ParentDp") {
                stepperList.push({
                  title:
                    lastObj["parentnas"] != null ? lastObj["parentnas"] : "",
                });
                stepperList.push({
                  title:
                    lastObj["parentolt"] != null ? lastObj["parentolt"] : "",
                });
                stepperList.push({
                  title:
                    lastObj["parentolt_port"] != null
                      ? lastObj["parentolt_port"]
                      : "",
                });
                stepperList.push({
                  title:
                    lastObj["parentdp1"] != null
                      ? lastObj["parentdp1"]
                      : "none",
                });
                stepperList.push({
                  title:
                    lastObj["parentdp1_port"] != null
                      ? lastObj["parentdp1_port"]
                      : "none",
                });
                stepperList.push({
                  title:
                    lastObj["parentdp2"] != null
                      ? lastObj["parentdp2"]
                      : "none",
                });
                stepperList.push({
                  title:
                    lastObj["parentdp2_port"] != null
                      ? lastObj["parentdp2_port"]
                      : "none",
                });
                stepperList.push({
                  title:
                    lastObj["device_name"] != null
                      ? lastObj["device_name"]
                      : "",
                });
              } else {
                stepperList.push({
                  title:
                    lastObj["parentnas"] != null ? lastObj["parentnas"] : "",
                });
                stepperList.push({
                  title:
                    lastObj["device_name"] != null
                      ? lastObj["device_name"]
                      : "",
                });
              }
              setErrors({ ...errors, parent_slno: "" });
            } else if ((name = "parent_slno")) {
              let stepperList = [...props.showStepperList];
              stepperList[0].title = "";
              stepperList[1].title = "";
              stepperList[2].title = "";
              stepperList[3].title = "";
              stepperList[4].title = "";
              stepperList[5].title = "";

              stepperList[6].title = "";

              props.setAvailableHardware();
              props.setShowStepperList(stepperList);
              setErrors({
                ...errors,
                parent_slno: "Matching OLT or ParentDP Does Not Exist",
              });
            }
            props.setAvailableHardware(lastObj);
            props.setShowStepperList(stepperList);

            if (selectedConnectType == "OLT") {
              is_parent_oltport = true;
            } else {
              is_parent_oltport = false;
            }

            // if (parentSlNoList[parentSlNoList.length - 1].selectedConnectType == "OLT") {
            //   is_parent_oltport = true;
            // } else if (
            //   parentSlNoList[parentSlNoList.length - 1].selectedConnectType2 == "PDP"
            // ) {
            //   is_parent_oltport = false;
            // }

            if (Array.isArray(res.data)) {
              if (lastObj["usable"] == true) {
                setParent(res.data);
              } else {
                setParent([]);

                setErrors({
                  ...errors,
                  parent_slno: "Cannot use this parent",
                });
              }
            }

            // })
          }
          //clear the stepper on remove of no
          else if ((name = "parent_slno")) {
            let stepperList = [...props.showStepperList];
            stepperList[0].title = "";
            stepperList[1].title = "";
            stepperList[2].title = "";
            stepperList[3].title = "";
            stepperList[4].title = "";
            props.setAvailableHardware({});
            props.setShowStepperList(stepperList);
            setErrors({
              ...errors,
              parent_slno: "Matching OLT or ParentDP Does Not Exist",
            });
          }
        })
        .catch(function (error) {
          let stepperList = [];
          stepperList.push({ title: "" });
          stepperList.push({ title: "" });
          stepperList.push({ title: "" });
          stepperList.push({ title: "" });
          stepperList.push({ title: "" });
          props.setAvailableHardware({});
          props.setShowStepperList(stepperList);
        });
    }, 500),
    []
  );
  //end

  // hitting an api and getting zone
  // useEffect(() => {
  //   adminaxios
  //     .get("accounts/loggedin/zones")
  //     .then((res) => {
  //       // setDpzone([...res.data]);
  //        {/* Sailaja sorting the Optical network -> Add DP -> Zone dropdown data as alphabetical order on 24th March 2023 */}
  //       setDpzone(Sorting([...res?.data],'name'))
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
  //end
  //get list of parent sl no

  const franchId =
    JSON.parse(localStorage.getItem("token")) &&
    JSON.parse(localStorage.getItem("token")).franchise &&
    JSON.parse(localStorage.getItem("token")).franchise.id
      ? JSON.parse(localStorage.getItem("token")) &&
        JSON.parse(localStorage.getItem("token")).franchise &&
        JSON.parse(localStorage.getItem("token")).franchise.id
      : 0;
  // const getlistofparentslno = (val) => {
  //   networkaxios
  //     .get(`network/get/pdp/${val}/${franchId}/slno`)
  //     .then((response) => {
  //       setGetlistofslno(response.data);
  //     })
  //     .catch(function (error) {
  //       console.error("Something went wrong!", error);
  //     });
  // };

  // get list of areas
  const getlistofAreas = (val) => {
    adminaxios
      .get(`accounts/zone/${val}/${franchId}/operatingareas`)
      .then((response) => {
        // setGetlistofareas(response.data);
        {
          /* Sailaja sorting the Optical network -> Add DP -> Area dropdown data as alphabetical order on 24th March 2023 */
        }
        setGetlistofareas(Sorting(response?.data, "name"));
      })
      .catch(function (error) {
        console.error("Something went wrong", error);
      });
  };

  //get list of parent serial numbers based on areas
  const getlistofparentslnobasedonarea = (val) => {
    networkaxios
      .get(
        `network/get/${
          selectedDpRadioBtn === "childdp" ? "cdp" : "pdp"
        }/${val}/slno`
      )
      .then((response) => {
        setGetlistofslnobasedonArea(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  //get list of serial numbers in parent olt field
  const getlistofparentoltareas = (val) => {
    networkaxios
      .get(`network/area/olts?area=${val}`)
      .then((response) => {
        // setGetAreainolt(response.data);
        {
          /* Sailaja sorting the Optical network -> Add DP -> Parent OLT dropdown data as alphabetical order on 24th March 2023 */
        }
        setGetAreainolt(Sorting(response?.data, "serial_no"));
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  const getlistofparentoltports = (val) => {
    let device = null;

    if (refrence == "OLT") {
      device = "olt";
    } else {
      device = "parentdp";
    }
    networkaxios
      .get(`network/oltport/${val}/filter?connecting_device=${device}`)
      .then((response) => {
        setGetlistofoltports(response.data);
        setGetlistofoltportsflag();
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  const getlistofparentdpports = (val) => {
    networkaxios
      .get(`network/oltport/parentdps?parent_oltport=${val}`)
      .then((response) => {
        setGetlistofpdpports(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  const getlistofparentdpportsdisplay = (val) => {
    networkaxios
      .get(`network/parentdpport/${val}/filter`)
      .then((response) => {
        setGetlistofparentports(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  return (
    <Fragment>
      <br />
      <Container
        fluid={true}
        style={{ backgroundColor: "#f3f3f3", marginBottom: "10px" }}
      >
        <Row>
          <Col sm="12">
            <Form id="myForm" ref={form}>
              {/* checkboxes */}
              {/* <Row>
                <Col sm="10">
                  <FormGroup
                    className="m-t-15 m-checkbox-inline mb-0 custom-radio-ml"
                    style={{ display: "flex" }}
                  >
                     {token.permissions.includes(
                      NETWORK.OPTICALPARENTDPCREATE
                    ) && ( 
                      <div className="">
                        <Input
                          id="parentdp"
                          type="radio"
                          name="radio1"
                          className="radio_animated"
                          checked={
                            selectedDpRadioBtn == "parentdp" ? "checked" : ""
                          }
                          value={selectedDpRadioBtn == "parentdp"}
                          onClick={() => {
                            props.setformDataForSaveInDraft((preState) => ({
                              ...preState,
                              selectedDpRadioBtn: "parentdp",
                            }));
                            setSelectedDpRadioBtn("parentdp");
                            props.setIsDirtyFun("dp");
                          }}
                        />
                        <Label className="mb-0" for="parentdp">
                          {Option}
                          <span className="digits">Parent DP</span>
                        </Label>
                      </div>
                     )} 
                    &nbsp;&nbsp;
                     {token.permissions.includes(
                      NETWORK.OPTICALCHILDDPCREATE
                    ) && ( 
                      <div className="">
                        <Input
                          id="childdp"
                          type="radio"
                          name="radio1"
                          className="radio_animated"
                          value={selectedDpRadioBtn == "childdp"}
                          checked={
                            selectedDpRadioBtn == "childdp" ? "checked" : ""
                          }
                          onClick={() => {
                            props.setformDataForSaveInDraft((preState) => ({
                              ...preState,
                              selectedDpRadioBtn: "childdp",
                            }));
                            setSelectedDpRadioBtn("childdp");
                            props.setIsDirtyFun("dp");
                          }}
                        />
                        <Label className="mb-0" for="childdp">
                          {Option}
                          <span className="digits">Child DP</span>
                        </Label>
                      </div>
                     )} 
                  </FormGroup>
                </Col>
              </Row> */}
              <div
              // style={{ display: selectedDpRadioBtn == "" ? "none" : "block" }}
              >
                <br />

                <Row>
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Device Type *</Label>
                        <Input
                          className={`form-control digits not-empty`}
                          name="device_type"
                          value={formData && formData.device_type}
                          type="select"
                          onChange={(event) => {
                            handleInputChange(event);
                            setParentOltPorts(event.target.value);
                          }}
                          style={{ textTransform: "capitalize" }}
                        >
                          <option value={"parentdp"}> Parent DP</option>
                          <option value={"childdp"}>Child DP</option>
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Connect *</Label>
                        <Input
                          // draft
                          className={`form-control digits not-empty`}
                          type="select"
                          name="connect"
                          value={formData && formData.connect}
                          // onChange={handleInputChange}
                          style={{ textTransform: "capitalize" }}
                          // disabled={true}
                          onChange={(event) => {
                            handleInputChange(event);
                            setSelectedConnectType(event.target.value);

                            setRefrence(event.target.value);
                          }}
                        >
                          <option style={{ display: "none" }}></option>
                          <option selected={childstate1} value={"OLT"}>
                            OLT
                          </option>
                          <option selected={childstate} value={"PDP"}>
                            Parent DP
                          </option>
                        </Input>
                      </div>
                      {/* <span className="errortext">
                        {errors.connect && "Selection is required"}
                      </span> */}
                    </FormGroup>
                  </Col>

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
                          className={`form-control digits ${
                            formData && formData.zone ? "not-empty" : ""
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
                      {/* <span className="errortext">
                        {errors.zone && "Selection is required"}
                      </span> */}
                    </FormGroup>
                  </Col>
                  <Col sm="3">
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
                          className={`form-control digits ${
                            formData && formData.area ? "not-empty" : ""
                          }`}
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          value={formData && formData.area}
                        >
                          <option style={{ display: "none" }}></option>

                          {getlistofareas.map((areas) => (
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
                          {getAreainolt.map((area) => (
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
                      <span className="errortext">
                        {selectedConnectType == "OLT" &&
                          getparentoltValue === true &&
                          "This port is unavailable"}
                      </span>
                    </FormGroup>
                  </Col>
                  {/* { childstate && */}

                  <Col sm="3" hidden={refrence != "PDP"}>
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Parent DP</Label>
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

                  <Col sm="3" hidden={refrence != "PDP"}>
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Parent DP Ports</Label>
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
                  <Row style={{ paddingLeft: "32px" }}>
                    <AddDistribution
                      Refreshhandler={props.Refreshhandler}
                      lead={props.lead}
                      selectedDpRadioBtn={selectedDpRadioBtn}
                      parent={parent}
                      parentDpNodeSelected={parentDpNodeSelected}
                      accordionActiveKey={props.accordionActiveKey}
                      Accordion1={Accordion1}
                      setParentDpNodeSelected={setParentDpNodeSelected}
                      setShowAddDistribution={setShowAddDistribution}
                      inputs={inputs}
                      parentOltPorts={parentOltPorts}
                      dataClose={props.dataClose}
                      selectedDeviceType={selectedDeviceType}
                      selectedConnectType={selectedConnectType}
                      deviceType={deviceType}
                      value={value}
                      getparentoltId={getparentoltId}
                      getparentdpsId={getparentdpsId}
                      getparentoltValue={getparentoltValue}
                      getparentdpflag={getparentdpflag}
                      setIsDirtyFun={props.setIsDirtyFun}
                      resetformmanually={resetformmanually}
                    />
                  </Row>

                  {/* }  */}

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
                          {getlistofslnobasedonarea.map((area) => (
                            <option>
                              {area.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      {errors.parent_slno && (
                        <span className="errortext">{errors.parent_slno}</span>
                      )}
                    </FormGroup>
                  </Col> */}
                  {/* commenting code for autopopulating fields */}
                  {/* <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          className={`form-control digits ${
                            formData && formData.parent_slno ? "not-empty" : ""
                          }`}
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
                      {errors.parent_slno && (
                        <span className="errortext">{errors.parent_slno}</span>
                      )}
                    </FormGroup>
                  </Col> */}
                  {/* end */}
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
                      <i
                        className="fa fa-circle"
                        style={{ color: "#959595" }}
                      />
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
                {/* {parent.length > 1 &&
                  searchedCategory != "" &&
                  searchedCategory != "ChildDp" && (
                    <>
                      <div className="parenttree">
                        <ReactFlowParentTree
                          from="cpeCollapse"
                          parent={parent}
                          setParentDpNodeSelected={setParentDpNodeSelected}
                          parentDpNodeSelected={parentDpNodeSelected}
                          parent_slno={formData.parent_slno}
                        />
                      </div>
                    </>
                  )} */}

                {/* <Accordion>
                  <div id="accordionoc">
                    <h5 style={{ textAlign: "center" }}>
                      <Accordion.Toggle
                        style={{
                          width: "auto",
                          backgroundColor: "#e75500",
                          color: "white",
                        }}
                        as={Card.Header}
                        className="btn btn-link txt-white "
                        color="black"
                        onClick={Accordion1}
                        eventKey="0"
                        aria-expanded={expanded1}
                        disabled={
                          parentDpNodeSelected && !parentDpNodeSelected.id
                        }
                      >
                        Continue
                      </Accordion.Toggle>
                    </h5>
                    {showAddDistribution && (
                      <div>
                        <Accordion.Collapse eventKey="0">
                          <AddDistribution
                            Refreshhandler={props.Refreshhandler}
                            lead={props.lead}
                            selectedDpRadioBtn={selectedDpRadioBtn}
                            parent={parent}
                            parentDpNodeSelected={parentDpNodeSelected}
                            accordionActiveKey={props.accordionActiveKey}
                            Accordion1={Accordion1}
                            setParentDpNodeSelected={setParentDpNodeSelected}
                            setShowAddDistribution={setShowAddDistribution}
                            inputs={inputs}
                            dataClose={props.dataClose}
                          />
                        </Accordion.Collapse>
                      </div>
                    )}
                  </div>
                </Accordion> */}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Collapse;
