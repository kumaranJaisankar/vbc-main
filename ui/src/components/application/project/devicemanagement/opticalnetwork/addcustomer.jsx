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
import { Search } from "../../../../../constant";
import { networkaxios, customeraxios } from "../../../../../axios";
import { toast } from "react-toastify";
import { Add } from "../../../../../constant";
import isEmpty from "lodash/isEmpty";
import useFormValidation from "../../../../customhooks/FormValidation";
import pick from "lodash/pick";
import AddressComponent from "../../../../common/AddressComponent";
import CpeTypeaheadContainer from "./CpeTypeaheadContainer";
import ErrorModal from "../../../../common/ErrorModal";

const AddCustomer = (props, initialValues) => {
  const [resetStatus, setResetStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  //state for auto populate of cpe fields
  const [selectedId, setSelectedId] = useState();
  //getting data from cpetype ahead
  const [leadUsers, setLeadUsers] = useState([]);
  const [leadUsersData, setLeadUsersData] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: "",
    hardware_name: "",
    make: "",
    model: "",
    specification: "",
    notes: "",
    house_no: "",
    street: "",
    landmark: "",
    city: "",
    district: "",
    pincode: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
    serial_no: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [getolt, setGetolt] = useState([]);
  const [branch, setBranch] = useState([]);
  //olt filter state
  const [oltFilter, setOLtFilter] = useState([]);
  //port state
  const [getPort, setGetPort] = useState([]);
  //
  //dp port
  const [dpPort, setDpPort] = useState([]);
  //
  const [parent, setParent] = useState([]);
  //to disable button
  const [disable, setDisable] = useState(false);

  const [macAddress, setMacAddress] = useState("");
  const [macAddressParts, setMacAddressParts] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [separator, setSeparator] = useState(":");

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

    let val = event.target.value;

    //nas selection
    if (name == "branch") {
      branchHandler(val);
    }
    //end
    //olt list
    if (name == "nas") {
      getOltListByNas(val);
    }
    //port list
    if (name == "olt") {
      getPortListByNas(val);
    }
    if (name == "olt_port_name") {
      getDpList(val);
    }
    if (name == "cpe_slno") {
      parentnas(val);
    }
  };

  //olt
  const getOltListByNas = (val) => {
    networkaxios
      .get(`network/olt/${val}/filter`)
      .then((response) => {
        setOLtFilter([...response.data]);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };
  //

  //branch autopopulate
  const branchHandler = (val) => {
    networkaxios
      .get(`network/nas/filter?branch=${val}`)
      .then((response) => {
        setGetolt(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };
  //end of nas populate//

  //nas autopopulate
  // useEffect(() => {
  //   networkaxios
  //     .get("network/extended/options")
  //     .then((res) => {
  //       // let { branch_name } = res.data;
  //       setBranch([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
  //end of nas populate

  //port autopopulate
  const getPortListByNas = (val) => {
    networkaxios
      .get(`network/oltport/${val}/filter`)
      .then((response) => {
        const portListWithoutZero = [...response.data].filter(
          (port) => port.available_ports > 0
        );
        setGetPort(portListWithoutZero);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };
  //
  //end

  //dp port autopopulate
  const getDpList = (val) => {
    networkaxios
      .get(`network/dpe/${val}/filter`)
      .then((response) => {
        const portListWithoutZero = [...response.data].filter(
          (port) => port.available_ports > 0
        );
        setDpPort(portListWithoutZero);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };

  //end//
  // useEffect(() => {
  //   networkaxios
  //     .get("network/oltport/${val}/filter")
  //     .then((res) => {
  //       console.log(res);
  //       // let { branch_name } = res.data;
  //       setGetPort([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
  //end
  //olt autopopulate
  // useEffect(() => {
  //
  //
  //   networkaxios
  //     .get("network/olt/filter")
  //     .then((res) => {
  //       console.log(res);
  //       // let { branch_name } = res.data;
  //       setOLtFilter([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
  //end of olt autopopulate
  const resetformmanually = () => {
    setFormData({
      customer_id: "",
      hardware_name: "",
      make: "",
      model: "",
      specification: "",
      notes: "",
      house_no: "",
      street: "",
      landmark: "",
      city: "",
      district: "",
      pincode: "",
      state: "",
      country: "",
      latitude: "",
      longitude: "",
      serial_no: "",
    });
    setMacAddressParts([
      "",
      "",
      "",
      "",
      "",
      "",
    ])
    setErrors({});
    document.getElementById("resetid").click();
  };

  const submit = (e) => {
    e.preventDefault();
    // e = e.target.name;
    const data = pick(formData, [
      "customer_id",
      "hardware_name",
      "make",
      "model",
      "specification",
      "notes",
      "house_no",
      "street",
      "landmark",
      "city",
      "district",
      "pincode",
      "state",
      "country",
      "latitude",
      "longitude",
      "serial_no",
      "mac_bind"
    ]);

    // data.parent_child_dpport = props.parentDpNodeSelected.id;

    // data.customer_id = customerId
    let dataNew = { ...data };
    dataNew.cpe_nas_name = data.hardware_name;
    // data.serial_no = { name: formData.serial_no };
    //  dataNew.mac_bind=macAddressParts.join(separator);
    const validationErrors = validate(dataNew);
    
    let noErrors = Object.keys(validationErrors).length === 0;
   
    setErrors(validationErrors);
    if (macAddressParts.some((part) => !part)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mac_bind: "Field is required",
      }));
      noErrors = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mac_bind: "",
      }));
      noErrors=true;
    }
    if (noErrors) {
      customeradd();
    } else {
      console.log("errors try again", validationErrors);
    }
    // resetInputField();
  };
  const customeradd = (e) => {
    const data = pick(formData, [
      "customer_id",
      "hardware_name",
      "make",
      "model",
      "specification",
      "notes",
      "house_no",
      "street",
      "landmark",
      "city",
      "district",
      "pincode",
      "state",
      "country",
      "latitude",
      "longitude",
      "serial_no",
    ]);
    data.mac_bind=macAddressParts.join(separator);
    data.serial_no = { name: formData.serial_no };
    data.parent_child_dpport = props.getparentdpsId;
    data.house_no = !isEmpty(formData.house_no) ? formData.house_no : "N/A";
    // data.customer_id = customerId;
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (props.getparentdpflag == false) {
      setDisable(true);
      networkaxios
        .post("network/cpe/create", data, config)
        .then((response) => {
          setDisable(false);
          // props.onUpdate(response.data);
          toast.success("CPE was added successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          resetformmanually();
          props.Accordion1();
          props.setParentDpNodeSelected({});
          props.setShowAddCustomer(false);
          props.Refreshhandler();
          props.dataClose();
        })
        .catch(function (error) {
          setDisable(false);

          let errorMessage = "";

          // Check if there's a response with error data
          if (error.response && error.response.data) {
            setErrors(error.response.data);

            // Check for specific error fields/messages
            if (error.response.data.detail) {
              errorMessage = error.response.data.detail;
            } else if (
              error.response.data["serial_no"] &&
              error.response.data["serial_no"].length > 0
            ) {
              errorMessage = error.response.data["serial_no"][0];
            } else if (
              error.response.data["name"] &&
              error.response.data["name"].length > 0
            ) {
              errorMessage = error.response.data["name"][0];
            } else if (error.response.status === 500) {
              errorMessage = "Internal server error. Something went wrong.";
            } else {
              errorMessage = "An error occurred";
            }
          } else {
            // General error handling if there's no specific response data
            errorMessage = "Something went wrong";
          }

          // Set the error message to be displayed in the modal and open the modal
          setModalMessage(errorMessage); // Assuming you have a state updater called setModalMessage
          setShowModal(true); // Assuming you have a state updater called setShowModal
        });
      // .catch(function (error) {
      //   setDisable(false)
      //   if (error.response && error.response.data) {
      //     setErrors(error.response.data);
      //   }
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   });
      // })
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
    "customer_id",
    "cpe_nas_name",
    "model",
    "make",
    "serial_no",
    "specification",
    "notes",
    "house_no",
    "street",
    "city",
    "pincode",
    "district",
    "state",
    "country",
    "landmark",
    "latitude",
    "longitude",
  ];
  const { validate, Error } = useFormValidation(requiredFields);

  //submit

  //end
  const parentnas = (val) => {
    networkaxios
      .get(`network/search/${val}`)

      .then((res) => {
        if (!Array.isArray(res.data)) {
          setParent([]);
        }
        if (Array.isArray(res.data)) {
          let parentSlNoList = [...res.data];

          let lastObj = parentSlNoList[parentSlNoList.length - 1];
          let stepperList = [];
          stepperList.push({
            title: lastObj["parentnas"] != null ? lastObj["parentnas"] : "",
          });
          stepperList.push({
            title: lastObj["parentolt"] != null ? lastObj["parentolt"] : "",
          });
          stepperList.push({
            title: lastObj["parentdp"] != null ? lastObj["parentdp"] : "",
          });
          //stepperList.push({title: lastObj['parentname'] !=null ? lastObj['parentname'] :''})
          props.setShowStepperList(stepperList);

          if (parentSlNoList[parentSlNoList.length - 1].category == "ChildDp") {
            // if (parentSlNoList[0].flag === "false") {
            //   // console.log(parentSlNoList[0].flag,'false valid')
            // } else {
            // // console.log("the data entered is true");

            // }
            setParent(res.data);
          }
          // else {
          // console.log("Invalicndjfeijiej sl no", res.data);

          // }
        }
        //  else {
        //   console.log("Invalid parent sl no", res.data);

        // }
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  //end

  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);
  //getting data from api for autopopulating fields
  useEffect(() => {
    customeraxios
      .get(`customers/ins`)
      // .then((res) => setData(res.data))
      .then((res) => {
        let leadsPick = res.data.map((lead) => {
          let obj = pick(lead, "username");
          return {
            ...obj,
            username: obj.username,
          };
        });

        setLeadUsers(leadsPick);
        setLeadUsersData(res.data);
      });
  }, []);

  useEffect(() => {
    if (!!selectedId) {
      let username = selectedId;
      let lead = leadUsersData.find((lead) => lead.username == username);

      customeraxios
        .get(`customers/v3/list?username=${lead?.username}`)
        .then((res) => {
          setFormData((preState) => ({
            ...preState,
            customer_id: res.data?.results[0]?.user.username,
            // {console.log()},
            house_no: res.data?.results[0]?.address.house_no,
            street: res.data?.results[0]?.address.street,
            district: res.data?.results[0]?.address.district,
            pincode: res.data?.results[0]?.address.pincode,
            state: res.data?.results[0]?.address.state,
            landmark: res.data?.results[0]?.address.landmark,
            city: res.data?.results[0]?.address.city,
            country: res.data?.results[0]?.address.country,
          }));
        });
    }
  }, [selectedId]);

  const handlePartChange = (event, index) => {
    const { value } = event.target;
    // let inputValue = value.replace(/[^0-9A-Fa-f]/g, '');
    if (/^[0-9A-Fa-f]{0,2}$/.test(value)) {
      // If the input is valid, update the corresponding part in the state
      const newParts = [...macAddressParts];
      newParts[index] = value.toUpperCase(); // Convert to uppercase
      setMacAddressParts(newParts);

      // Move focus to the next input box if needed
      if (value.length === 2 && index < 5) {
        document.getElementById(`part-${index + 1}`).focus();
      } else if (value === "" && index > 0) {
        // If Backspace is pressed and the input is empty, move focus to the previous input box
        document.getElementById(`part-${index - 1}`).focus();
      }
    }
  };
  const handleSeparatorChange = (event) => {
    setSeparator(event.target.value);
  };

  //geting from api and writing autopopulate code
  // useEffect(() => {
  //   if (!!selectedId) {
  //     let username = selectedId;
  //     console.log(username, "cpeusername");
  //     let lead = leadUsersData.find((lead) => lead.username == username);

  //     setFormData((preState) => ({
  //       ...preState,
  //       customer_id: lead?.username,
  //       // customer_name: lead.first_name,
  //       // mobile_no:lead.register_mobile,

  //       house_no: lead?.permanent_address?.house_no,
  //       street: lead?.permanent_address?.street,
  //       district: lead?.permanent_address?.district,
  //       pincode: lead?.permanent_address?.pincode,
  //       state: lead?.permanent_address?.state,
  //       landmark: lead?.permanent_address?.landmark,
  //       city: lead?.permanent_address?.city,
  //       country: lead?.permanent_address?.country,
  //     }));
  //   }
  // }, [selectedId]);
  // added Model label by Marieya on 9/8/22
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="email-wrap bookmark-wrap">
          <Form
            className="theme-form mega-form"
            // onSubmit={submit}
            id="myForm"
            onReset={resetForm}
            ref={form}
          >
            <Row>
              <Col>
                <FormGroup>
                  <div className="input_wrap">
                    <CpeTypeaheadContainer
                      setSelectedId={setSelectedId}
                      leadUsers={leadUsers}
                    />
                    {/* <Input
                      style={{ visibility: "hidden" }}
                      type="text"
                      name="customer_id"
                      className="form-control digits"
                      onChange={handleInputChange}
                      value={formData && formData.customer_id}
                    ></Input> */}
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

            <Row>
              {/* <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className="form-control"
                      type="text"
                      onBlur={checkEmptyValue}
                      onChange={handleInputChange}
                      name="customer_id"
                      // value={inputs.first_name}
                      maxLength="15"
                    />
                    <Label className="placeholder_styling">Customer ID *</Label>
                  </div>
                  <span className="errortext">{errors.customer_id}</span>
                </FormGroup>
              </Col> */}
              {/* <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                       className={`form-control ${
                        formData && !formData.customer_name
                          ? ""
                          : "not-empty"
                      }`}
                      type="text"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      name="customer_name"
                    value={formData && formData.customer_name}
                      maxLength="15"
                      disabled={true}
                    />
                    <Label className="placeholder_styling">
                      Customer Name *
                    </Label>
                  </div>
                  <span className="errortext">{errors.customer_name}</span>
                </FormGroup>
              </Col> */}
              {/* <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className={`form-control ${
                        formData && !formData.mobile_no
                          ? ""
                          : "not-empty"
                      }`}
                      type="text"
                      name="mobile_no"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    value={formData && formData.mobile_no}
                      disabled={true}
                      
                    />
                    <Label className="placeholder_styling">Mobile No *</Label>
                  </div>
                  <span className="errortext">{errors.mobile_no}</span>
                </FormGroup>
              </Col> */}
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Serial Number *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      className="form-control"
                      type="text"
                      name="serial_no"
                      id="afterfocus"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    />
                  </div>
                  <span className="errortext">{errors.serial_no}</span>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Hardware Name *</Label>
                    <Input
                      type="text"
                      name="hardware_name"
                      id="afterfocus"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    ></Input>
                  </div>
                  <span className="errortext">{errors.cpe_nas_name}</span>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Model *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      className="form-control"
                      type="text"
                      name="model"
                      id="afterfocus"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    />
                  </div>
                  <span className="errortext">{errors.model}</span>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Make *</Label>
                    <Input
                      style={{ color: "#495057" }}
                      className="form-control"
                      type="text"
                      name="make"
                      id="afterfocus"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    />
                  </div>
                  <span className="errortext">{errors.make}</span>
                </FormGroup>
              </Col>
              <Col md="6">
                <Label className="kyc_label">Mac ID *</Label>
                <FormGroup>
                  <div className="input_wrap">
                    {macAddressParts?.map((part, index) => (
                      <React.Fragment key={index}>
                        <input
                          type="text"
                          id={`part-${index}`}
                          value={part}
                          name="mac_bind"
                          onChange={(event) => handlePartChange(event, index)}
                          maxLength="2"
                          className="macIdInput"
                          disabled={disable}
                        />
                        {index < 5 && <span>{separator}</span>}
                      </React.Fragment>
                    ))}
                    <select
                      style={{ marginLeft: "5px", borderRadius: "0.25rem" }}
                      value={separator}
                      onChange={handleSeparatorChange}
                      disabled={disable}
                    >
                      <option value=":">Colon</option>
                      <option value="-">Dash</option>
                    </select>
                  </div>
                  <span className="errortext">{errors.mac_bind}</span>
                </FormGroup>
              </Col>
            </Row>
           
            <Row>
              <Col sm="12">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Specification *</Label>
                    <Input
                      className="form-control"
                      type="text"
                      id="afterfocus"
                      name="specification"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    />
                  </div>
                  <span className="errortext">{errors.specification}</span>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Notes *</Label>
                    <Input
                      type="textarea"
                      className="form-control"
                      name="notes"
                      id="afterfocus"
                      rows="3"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                    />
                  </div>
                  <span className="errortext">{errors.notes}</span>
                </FormGroup>
              </Col>
            </Row>
            {props.accordionActiveKey == "3" && (
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
            )}

            <Row>
              <Col sm="2">
                <FormGroup className="mb-0">
                  <Button
                    id="create_button"
                    color="btn btn-primary"
                    type="submit"
                    className="mr-3"
                    // style={{ textAlign: "center !important" }}
                    onClick={submit}
                    disabled={disable}
                  >
                    {disable ? <Spinner size="sm"> </Spinner> : null}
                    {Add}
                  </Button>
                </FormGroup>
              </Col>
              <Col sm="2">
                <FormGroup className="mb-0">
                  <Button
                    type="reset"
                    color="btn btn-primary"
                    id="resetid"
                    // class="center1"
                    onClick={resetformmanually}
                    style={{ width: "auto" }}
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
        </div>
      </Container>
    </Fragment>
  );
};

export default AddCustomer;
