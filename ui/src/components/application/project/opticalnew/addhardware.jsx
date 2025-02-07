import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { Search } from "react-feather";
import { networkaxios } from "../../../../axios";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import useFormValidation from "../../../customhooks/FormValidation";
//accordion
import { Accordion } from "react-bootstrap";
import AddNas from "../nas/addnas";
import AddOlt from "../devicemanagement/opticalnetwork/addolt";
import Collapse from "./collapse";
import CpeCollapse from "./cpecollapse";
import { NETWORK } from "../../../../utils/permissions";
var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const AddHardware = (props, initialValues) => {
  const [formData, setFormData] = useState({});
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [resetStatus, setResetStatus] = useState(false);
  const [parent, setParent] = useState([]);

  const handleInputChange = (event) => {
    event.persist();
    setResetStatus(false);

    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (
      name == "nassearch" ||
      name == "oltsearch" ||
      name == "dpsearch" ||
      name == "cpesearch"
    ) {
      if (name == "nassearch") {
        setFormData((preState) => ({
          ...preState,
          [name]: value,
          ["oltsearch"]: "",
          ["dpsearch"]: "",
          ["cpesearch"]: "",
        }));
      } else if (name == "oltsearch") {
        setFormData((preState) => ({
          ...preState,
          [name]: value,
          ["nassearch"]: "",
          ["dpsearch"]: "",
          ["cpesearch"]: "",
        }));
      } else if (name == "dpsearch") {
        setFormData((preState) => ({
          ...preState,
          [name]: value,
          ["nassearch"]: "",
          ["oltsearch"]: "",
          ["cpesearch"]: "",
        }));
      } else if (name == "cpesearch") {
        setFormData((preState) => ({
          ...preState,
          [name]: value,
          ["nassearch"]: "",
          ["oltsearch"]: "",
          ["dpsearch"]: "",
        }));
      }
      if (value == "") {
        setErrors({});
      } else {
        parentnas(value, name);
      }
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
  };
  //Sailaja modified uppercase & lowercase for Field Validation Messages of NAS,OLT,DP & CPE on 22nd July
  const parentnas = useCallback(
    debounce(async (val, name) => {
      networkaxios
        .get(`network/search/${val}`)
        .then((res) => {
          if (Array.isArray(res.data) && name == "nassearch") {
            let parentSlNoList = [...res.data];
            let lastObj = parentSlNoList[parentSlNoList.length - 1];
            let stepperList = [...showStepperList];
            if (lastObj["category"] == "Nas" && name == "nassearch") {
              stepperList[0].title =
                lastObj["device_name"] != null ? lastObj["device_name"] : "";
              setErrors({ ...errors, nassearch: "" });
              props.setAvailableHardware(lastObj);
            } else if (name == "nassearch") {
              stepperList[0].title = "";
              props.setAvailableHardware({});
              setErrors({
                ...errors,
                nassearch: "Matching NAS Serial number does not exist",
              });
              props.setAvailableHardware({});
            }
            setShowStepperList(stepperList);
            setParent(res.data);
          } else if (name == "nassearch") {
            setErrors({
              ...errors,
              nassearch: "Matching NAS Serial number does not exist",
            });
            props.setAvailableHardware({});
          }
          //end of nas search
          //olt outer search functionality
          else if (name == "oltsearch") {
            let stepperList = [...showStepperList];
            let lastObj = {};
            if (Array.isArray(res.data)) {
              let parentSlNoList = [...res.data];
              lastObj = parentSlNoList[parentSlNoList.length - 1];

              if (lastObj["category"] == "Olt" && name == "oltsearch") {
                stepperList[0].title =
                  lastObj["parentnas"] != null ? lastObj["parentnas"] : "";
                stepperList[1].title =
                  lastObj["device_name"] != null ? lastObj["device_name"] : "";
                setErrors({ ...errors, oltsearch: "" });
                props.setAvailableHardware(lastObj);
              }
            } else if (name == "oltsearch") {
              stepperList[0].title = "";
              stepperList[1].title = "";
              setErrors({
                ...errors,
                oltsearch: "Matching OLT Serial number does not exist",
              });
              props.setAvailableHardware({});
            }
            setShowStepperList(stepperList);

            setParent(res.data);
          }
          //end of olt outer search functionality
          //dp outer search functionality
          else if (name == "dpsearch") {
            let stepperList = [...showStepperList];
            if (Array.isArray(res.data)) {
              let parentSlNoList = [...res.data];
              let lastObj = parentSlNoList[parentSlNoList.length - 1];

              if (
                (lastObj["category"] == "ParentDp" ||
                  lastObj["category"] == "ChildDp") &&
                name == "dpsearch"
              ) {
                setErrors({ ...errors, dpsearch: "" });
                props.setAvailableHardware(lastObj);
              }
            } else if (name == "dpsearch") {
              stepperList[0].title = "";
              stepperList[1].title = "";
              stepperList[2].title = "";
              stepperList[3].title = "";
              stepperList[4].title = "";
              stepperList[5].title = "";
              stepperList[6].title = "";
              stepperList[7].title = "";

              setErrors({
                ...errors,
                dpsearch: "Matching DP Serial number  does not exist",
              });
              props.setAvailableHardware({});
            }
            setShowStepperList(stepperList);

            setParent(res.data);
          }
          //end of dp outer search functionality
          //cpe outer search functionality
          else if (name == "cpesearch") {
            let stepperList = [...showStepperList];
            if (Array.isArray(res.data)) {
              let parentSlNoList = [...res.data];
              let lastObj = parentSlNoList[parentSlNoList.length - 1];

              if (lastObj["category"] == "CPE" && name == "cpesearch") {
                setErrors({ ...errors, cpesearch: "" });
                props.setAvailableHardware(lastObj);
              }
            } else if (
              res.data[0]["category"] == "CPE" &&
              name == "cpesearch"
            ) {
              props.setAvailableHardware(res.data[0]);
            } else if (name == "cpesearch") {
              stepperList[0].title = "";
              stepperList[1].title = "";
              stepperList[2].title = "";
              stepperList[3].title = "";
              stepperList[4].title = "";
              stepperList[5].title = "";
              stepperList[6].title = "";
              stepperList[7].title = "";
              stepperList[8].title = "";

              setErrors({
                ...errors,
                cpesearch: "Matching CPE Serial number  does not exist",
              });
              props.setAvailableHardware({});
            }
            setShowStepperList(stepperList);

            setParent(res.data);
          }
          //end of cpe search
        })
        .catch(function (error) {
          props.setAvailableHardware({});
        });
    }, 500),
    []
  );
  //end

  // useEffect(() => {
  //   networkaxios
  //     .get("network/extended/options")
  //     .then((res) => {
  //       setBranch([...res.data]);
  //     })
  //     .catch(() =>
  //       toast.error("error extended options", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 1000,
  //       })
  //     );
  // }, []);
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
      nassearch: "",
      oltsearch: "",
      dpsearch: "",
      cpesearch: "",
    });
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
      setexpanded1(false);
      setexpanded2(false);
      setexpanded3(false);
      setExpandedStatus(false);
      setShowStepperList([
        { title: "" },
        { title: "" },
        { title: "" },
        { title: "" },
        { title: "" },
        { title: "" },
        { title: "" },
        { title: "" },
        { title: "" },
      ]);
      props.setAvailableHardware({});
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
          autoClose: 1000,
        });
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
  const { validate, Error } = useFormValidation(requiredFields);

  //accordion
  const [expanded1, setexpanded1] = useState(true);
  const [expanded2, setexpanded2] = useState(false);
  const [expanded3, setexpanded3] = useState(false);

  const [expandedStatus, setExpandedStatus] = useState(false);

  useEffect(() => {
    setExpandedStatus(!expandedStatus);
  }, [expanded1, expanded2, expanded3]);

  const [showStepperList, setShowStepperList] = useState([
    { title: "" },
    { title: "" },
    { title: "" },
    { title: "" },
    { title: "" },
    { title: "" },
  ]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      props.setIsExpand(true);
    }
  };

  // not showing add buttons for admin and superadmin

  // show password for superadmin only
  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let addNetwork = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Super Admin") ||
    (tokenInfo && tokenInfo.user_type === "Admin")
  ) {
    addNetwork = true;
  }

  const [networkModal, setNetworkMOdal] = useState(false);
  const HideAddNetworkMOdal = () => setNetworkMOdal(!networkModal);

  const tokenInfo1 = JSON.parse(localStorage.getItem("token"));
  let ShowNas = false;
  if (tokenInfo1 && tokenInfo1.user_type === "Admin") {
    ShowNas = true;
  }

  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form
              onSubmit={submit}
              id="myForm"
              onReset={resetForm}
              ref={form}
              style={{ overflow: "hidden" }}
            ></Form>
            <br />
            {/* accordion */}

            <Accordion
              defaultActiveKey="0"
              activeKey={props.accordionActiveKey}
            >
              <CardBody style={{ padding: "15px 0px" }}>
                <div className="default-according style-1" id="accordionoc">
                  <Row style={{ width: "106%" }}>
                    <Col sm="8">
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                          style={{
                            color: "#495057",
                            height: "43px",
                            boxShadow: "0 0 40px rgb(8 21 66 / 5%)",
                            border: "1px solid #BDBDBD",  
                          }}
                            //Sailaja Modified  NAS,OLT,DP & CPE  Fields  Placeholders on 22nd July REF NET-15

                            className="form-control"
                            type="text"
                            name="nassearch"
                            value={formData && formData.nassearch}
                            onChange={handleInputChange}
                            placeholder="Search With NAS Serial Number"
                            onKeyPress={(e) => handleKeyPress(e)}
                          />
                          <Search
                            className="search-icon"
                            style={{
                              border: "none",
                              position: "absolute",
                              right: "1.5rem",
                              color: "#3B3B3B",
                              top: "8px",
                              height: "20px",
                            }}
                            onClick={() => props.setIsExpand(true)}
                          />
                        </div>
                      </FormGroup>
                      {/*Sailaja updated NAS,OLT,DP & CPE Validation messages position on 22nd July REF NET-16 */}
                      <span
                        className="errortext"
                        style={{ position: "relative", top: "-27%" }}
                      >
                        {errors.nassearch}
                      </span>
                    </Col>
                    <Col sm="1"></Col>
                    <Col sm="3" style={{ marginLeft: "-76px" }}>
                      {token.permissions.includes(NETWORK.OPTICALNASCREATE) && (
                        <>
                          <h5
                            className="mb-0"
                            style={{
                              backgroundColor: "#a4cbf4",
                              borderBottomRightRadius: "4px",
                              borderTopRightRadius: "4px",
                              width: "138px",
                            }}
                          >
                            {/* {ShowNas ? ( */}
                            <Accordion.Toggle
                              style={{
                                color: "rgba(0,0,0,0.87)",
                                height: "43px",
                              }}
                              // id="bringcenter"
                              as={Card.Header}
                              className="btn btn-link txt-white "
                              color="primary"
                              onClick={() =>
                                props.setAccordionActiveKey(
                                  props.accordionActiveKey != "0" ? "0" : ""
                                )
                              }
                              eventKey="0"
                              id="nas_id"
                            >
                              Add NAS

                              <i
                                className="fa fa-plus-circle"
                                style={{
                                  color: "rgba(0,0,0,0.87)",
                                  fontSize: "21px",
                                  cursor: "pointer",
                                  marginLeft: "0px",
                                  position: "relative",
                                  left: "6px",
                                  verticalAlign: "bottom",
                                }}
                              ></i>
                            </Accordion.Toggle>
                            {/* ) : ( */}
                            {/* "" */}
                            {/* )} */}
                          </h5>
                        </>
                      )}
                    </Col>
                  </Row>
                  {/* </CardHeader> */}
                  <Accordion.Collapse eventKey="0">
                    <Row>
                      {props.accordionActiveKey == "0" && (
                        <AddNas
                          lead={props.lead}
                          Refreshhandler={props.Refreshhandler}
                          rightSidebar={props.rightSidebar}
                          setIsDirtyFun={props.setIsDirtyFun}
                          setformDataForSaveInDraft={
                            props.setformDataForSaveInDraft
                          }
                          accordionActiveKey={props.accordionActiveKey}
                          setLead={props.setLead}
                          setAccordionActiveKey={props.setAccordionActiveKey}
                          dataClose={props.dataClose}
                        />
                      )}
                    </Row>
                  </Accordion.Collapse>
                  {/* 2nd accordion */}

                  <Row style={{ width: "106%" }}>
                    <Col sm="8">
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                            style={{
                              color: "#495057",
                              height: "43px",
                              boxShadow: "0 0 40px rgb(8 21 66 / 5%)",
                              border: "1px solid #BDBDBD",  
                            }}
                            className="form-control"
                            type="text"
                            name="oltsearch"
                            onChange={handleInputChange}
                            placeholder="Search With OLT Serial Number"
                            onKeyPress={(e) => handleKeyPress(e)}
                            value={formData && formData.oltsearch}
                          />
                          <Search
                            className="search-icon"
                            style={{
                              border: "none",
                              position: "absolute",
                              right: "1.5rem",
                              color: "#3B3B3B",
                              top: "8px",
                              height: "20px",
                            }}
                            onClick={() => props.setIsExpand(true)}
                          />
                        </div>
                      </FormGroup>
                      <span
                        className="errortext"
                        style={{ position: "relative", top: "-27%" }}
                      >
                        {errors.oltsearch}
                      </span>
                    </Col>
                    <Col sm="1"></Col>
                    <Col
                      sm="3"
                      style={{ marginTop: "-2px", marginLeft: "-76px" }}
                    >
                      {token.permissions.includes(NETWORK.OPTICALOLTCREATE) && (
                        <>
                          {addNetwork ? (
                            <>
                              <h5
                                className="mb-0"
                                style={{
                                  backgroundColor: "#a4cbf4",
                                  borderBottomRightRadius: "4px",
                                  borderTopRightRadius: "4px",
                                  width: "137px",
                                }}
                              >
                                <Accordion.Toggle
                                  style={{
                                    color: "rgba(0,0,0,0.87)",
                                    height: "43px",
                                  }}
                                  // id="bringcenter"
                                  as={Card.Header}
                                  className="btn btn-link txt-white "
                                  color="primary"
                                  onClick={() => HideAddNetworkMOdal()}
                                  eventKey="1"
                                  id="nas_id"
                                >
                                  Add OLT
                                  <i
                                    className="fa fa-plus-circle"
                                    style={{
                                      color: "rgba(0,0,0,0.87)",
                                      fontSize: "21px",
                                      cursor: "pointer",
                                      verticalAlign: "bottom",
                                      marginLeft: "0px",
                                      position: "relative",
                                      left: "6px",
                                    }}
                                  ></i>
                                </Accordion.Toggle>
                              </h5>
                            </>
                          ) : (
                            <>
                              <h5
                                className="mb-0"
                                style={{
                                  backgroundColor: "#a4cbf4",
                                  borderBottomRightRadius: "4px",
                                  borderTopRightRadius: "4px",
                                  width: "137px",
                                }}
                              >
                                <Accordion.Toggle
                                  style={{
                                    color: "rgba(0,0,0,0.87)",
                                    height: "43px",
                                  }}
                                  // id="bringcenter"
                                  as={Card.Header}
                                  className="btn btn-link txt-white "
                                  color="primary"
                                  onClick={() =>
                                    props.setAccordionActiveKey(
                                      props.accordionActiveKey != "1" ? "1" : ""
                                    )
                                  }
                                  eventKey="1"
                                  id="nas_id"
                                >
                                  Add OLT
                                  <i
                                    className="fa fa-plus-circle"
                                    style={{
                                      color: "rgba(0,0,0,0.87)",
                                      fontSize: "21px",
                                      cursor: "pointer",
                                      verticalAlign: "bottom",
                                      marginLeft: "-1px",
                                      position: "relative",
                                      left: "6px",
                                    }}
                                  ></i>
                                </Accordion.Toggle>
                              </h5>
                            </>
                          )}
                        </>
                      )}
                    </Col>
                  </Row>
                  {/* </CardHeader> */}
                  <Accordion.Collapse eventKey="1">
                    <Row>
                      {props.accordionActiveKey == "1" && (
                        <AddOlt
                          lead={props.lead}
                          setLead={props.setLead}
                          expandedStatus={expandedStatus}
                          setShowStepperList={setShowStepperList}
                          showStepperList={showStepperList}
                          Refreshhandler={props.Refreshhandler}
                          setResetStatus={setResetStatus}
                          rightSidebar={props.rightSidebar}
                          setIsDirtyFun={props.setIsDirtyFun}
                          setformDataForSaveInDraft={
                            props.setformDataForSaveInDraft
                          }
                          setAvailableHardware={props.setAvailableHardware}
                          accordionActiveKey={props.accordionActiveKey}
                          dataClose={props.dataClose}
                        />
                      )}
                    </Row>
                  </Accordion.Collapse>
                  {/* end */}
                  <Row style={{ width: "106%" }}>
                    <Col sm="8">
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                            style={{
                              color: "#495057",
                              height: "43px",
                              boxShadow: "0 0 40px rgb(8 21 66 / 5%)",
                              border: "1px solid #BDBDBD",  
                            }}
                            className="form-control"
                            type="text"
                            name="dpsearch"
                            onChange={handleInputChange}
                            placeholder="Search With DP Serial Number"
                            onKeyPress={(e) => handleKeyPress(e)}
                            value={formData && formData.dpsearch}
                          />
                          <Search
                            className="search-icon"
                            style={{
                              border: "none",
                              position: "absolute",
                              right: "1.5rem",
                              color: "#3B3B3B",
                              top: "8px",
                              height: "20px",
                            }}
                            onClick={() => props.setIsExpand(true)}
                          />
                        </div>
                      </FormGroup>
                      <span
                        className="errortext"
                        style={{ position: "relative", top: "-27%" }}
                      >
                        {errors.dpsearch}
                      </span>
                    </Col>
                    <Col sm="1"></Col>
                    <Col
                      sm="3"
                      style={{ marginTop: "-2px", marginLeft: "-76px" }}
                    >
                      {addNetwork ? (
                        <>
                          <h5
                            className="mb-0"
                            style={{
                              backgroundColor: "#a4cbf4",
                              borderBottomRightRadius: "4px",
                              borderTopRightRadius: "4px",
                              width: "137px",
                            }}
                          >
                            <Accordion.Toggle
                              style={{
                                color: "rgba(0,0,0,0.87)",
                                height: "43px",
                              }}
                              // id="bringcenter"
                              as={Card.Header}
                              className="btn btn-link txt-white "
                              color="primary"
                              onClick={() => HideAddNetworkMOdal()}
                              eventKey="2"
                              id="nas_id"
                            >
                              Add DP
                              <i
                                className="fa fa-plus-circle"
                                style={{
                                  color: "rgba(0,0,0,0.87)",
                                  fontSize: "21px",
                                  cursor: "pointer",
                                  marginLeft: "4px",
                                  verticalAlign: "bottom",
                                  position: "relative",
                                  left: "6px",
                                }}
                              ></i>
                            </Accordion.Toggle>
                          </h5>
                        </>
                      ) : (
                        <>
                          <h5
                            className="mb-0"
                            style={{
                              backgroundColor: "#a4cbf4",
                              borderBottomRightRadius: "4px",
                              borderTopRightRadius: "4px",
                              width: "137px",
                            }}
                          >
                            <Accordion.Toggle
                              style={{
                                color: "rgba(0,0,0,0.87)",
                                height: "43px",
                              }}
                              // id="bringcenter"
                              as={Card.Header}
                              className="btn btn-link txt-white "
                              color="primary"
                              onClick={() =>
                                props.setAccordionActiveKey(
                                  props.accordionActiveKey != "2" ? "2" : ""
                                )
                              }
                              eventKey="2"
                              id="nas_id"
                            >
                              Add DP
                              <i
                                className="fa fa-plus-circle"
                                style={{
                                  color: "rgba(0,0,0,0.87)",
                                  fontSize: "21px",
                                  cursor: "pointer",
                                  marginLeft: "4px",
                                  verticalAlign: "bottom",
                                  position: "relative",
                                  left: "6px",
                                }}
                              ></i>
                            </Accordion.Toggle>
                          </h5>
                        </>
                      )}
                    </Col>
                  </Row>

                  <Accordion.Collapse eventKey="2">
                    <Collapse
                      expandedStatus={expandedStatus}
                      lead={props.lead}
                      setShowStepperList={setShowStepperList}
                      showStepperList={showStepperList}
                      Refreshhandler={props.Refreshhandler}
                      rightSidebar={props.rightSidebar}
                      setIsDirtyFun={props.setIsDirtyFun}
                      setformDataForSaveInDraft={
                        props.setformDataForSaveInDraft
                      }
                      accordionActiveKey={props.accordionActiveKey}
                      setAvailableHardware={props.setAvailableHardware}
                      dataClose={props.dataClose}
                      zone={props.zone}
                      setZone={props.setZone}

                    />
                  </Accordion.Collapse>

                  <Row style={{ width: "106%" }}>
                    <Col sm="8">
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                            style={{
                              color: "#495057",
                              height: "43px",
                              boxShadow: "0 0 40px rgb(8 21 66 / 5%)",
                              border: "1px solid #BDBDBD",  
                            }}
                            className="form-control"
                            type="text"
                            name="cpesearch"
                            onChange={handleInputChange}
                            placeholder="Search With CPE Serial Number"
                            onKeyPress={(e) => handleKeyPress(e)}
                            value={formData && formData.cpesearch}
                          />
                          <Search
                            className="search-icon"
                            style={{
                              border: "none",
                              position: "absolute",
                              right: "1.5rem",
                              color: "#3B3B3B",
                              top: "8px",
                              height: "20px",
                            }}
                            onClick={() => props.setIsExpand(true)}
                          />
                        </div>
                      </FormGroup>
                      <span
                        className="errortext"
                        style={{ position: "relative", top: "-27%" }}
                      >
                        {errors.cpesearch}
                      </span>
                    </Col>
                    <Col sm="1"></Col>
                    <Col sm="3" style={{ marginLeft: "-76px" }}>
                      {token.permissions.includes(NETWORK.OPTICALCPECREATE) && (
                        <>
                          {addNetwork ? (
                            <>
                              <h5
                                className="mb-0"
                                style={{
                                  backgroundColor: "#a4cbf4",
                                  borderBottomRightRadius: "4px",
                                  borderTopRightRadius: "4px",
                                  width: "137px",
                                }}
                              >
                                <Accordion.Toggle
                                  style={{
                                    color: "rgba(0,0,0,0.87)",
                                    height: "43px",
                                  }}
                                  // id="bringcenter"
                                  as={Card.Header}
                                  className="btn btn-link txt-white "
                                  color="primary"
                                  onClick={() => HideAddNetworkMOdal()}
                                  eventKey="3"
                                  id="nas_id"
                                >
                                  Add CPE
                                  <i
                                    className="fa fa-plus-circle"
                                    style={{
                                      color: "rgba(0,0,0,0.87)",
                                      fontSize: "21px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                      verticalAlign: "bottom",
                                      position: "relative",
                                      left: "6px",
                                    }}
                                  ></i>
                                </Accordion.Toggle>
                              </h5>
                            </>
                          ) : (
                            <>
                              <h5
                                className="mb-0"
                                style={{
                                  backgroundColor: "#a4cbf4",
                                  borderBottomRightRadius: "4px",
                                  borderTopRightRadius: "4px",
                                  width: "137px",
                                }}
                              >
                                <Accordion.Toggle
                                  style={{
                                    color: "rgba(0,0,0,0.87)",
                                    height: "43px",
                                  }}
                                  // id="bringcenter"
                                  as={Card.Header}
                                  className="btn btn-link txt-white "
                                  color="primary"
                                  onClick={() =>
                                    props.setAccordionActiveKey(
                                      props.accordionActiveKey != "3" ? "3" : ""
                                    )
                                  }
                                  eventKey="3"
                                  id="nas_id"
                                >
                                  Add CPE
                                  <i
                                    className="fa fa-plus-circle"
                                    style={{
                                      color: "rgba(0,0,0,0.87)",
                                      fontSize: "21px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                      verticalAlign: "bottom",
                                      position: "relative",
                                      left: "6px",
                                    }}
                                  ></i>
                                </Accordion.Toggle>
                              </h5>
                            </>
                          )}
                        </>
                      )}
                    </Col>
                  </Row>

                  <Accordion.Collapse eventKey="3">
                    <CpeCollapse
                      expandedStatus={expandedStatus}
                      lead={props.lead}
                      setShowStepperList={setShowStepperList}
                      showStepperList={showStepperList}
                      Refreshhandler={props.Refreshhandler}
                      rightSidebar={props.rightSidebar}
                      setIsDirtyFun={props.setIsDirtyFun}
                      setformDataForSaveInDraft={
                        props.setformDataForSaveInDraft
                      }
                      accordionActiveKey={props.accordionActiveKey}
                      setAvailableHardware={props.setAvailableHardware}
                      dataClose={props.dataClose}
                      zone={props.zone}
                      setZone={props.setZone}
                    />
                  </Accordion.Collapse>
                </div>
              </CardBody>
            </Accordion>
          </Col>
        </Row>
      </Container>
      {/* hide add netwirk modal */}
      <Modal isOpen={networkModal} toggle={HideAddNetworkMOdal} centered>
        <ModalBody>
          <p className="modal_text">
            {
              "Please switch to Franchise or Branch user to Add Network devices."
            }
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="" onClick={HideAddNetworkMOdal} id="yes_button">
            {"Ok"}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default AddHardware;
