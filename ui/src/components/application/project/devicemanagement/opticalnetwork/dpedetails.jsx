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
// import { default as axiosBaseURL,adminaxios } from "../../../axios";
import useFormValidation from "../../../../customhooks/FormValidation";
import { networkaxios, adminaxios } from "../../../../../axios";
import AddressComponent from "../../../../common/AddressComponent";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import ErrorModal from "../../../../common/ErrorModal";

// token
import { NETWORK } from "../../../../../utils/permissions";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const Dpedetails = (props, initialValues) => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [branch, setBranch] = useState([]);
  const [isDisabled, setIsdisabled] = useState(true);
  const [zone, setZone] = useState([]);
  const [getlistofareas, setGetlistofareas] = useState([]);
  const [leadUserBkp, setLeadUserBkp] = useState(props.lead);
  const [ismodalShow, setIsmodalShow] = useState(false);
  //to disable button
  const [disable, setDisable] = useState(false);
  const [isFieldsEditable, setFieldsEditable] = useState({
    no_of_ports: false,
    capacity: false,
  });
  const [isFocusOFF, setIsFocusOFF] = useState({
    no_of_ports: false,
    capacity: false,
  });
  const [currentFocusField, setCurrentFocusField] = useState("");
  const [inputs, setInputs] = useState(initialValues);
  const [resetStatus, setResetStatus] = useState(false);
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

  useEffect(() => {
    networkaxios
      .get(`network/v2/parentdp/display`)
      // .then((res) => setData(res.data))
      .then((res) => {
        // console.log(res);
        setLeadUser(res.data);
      });
  }, []);

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    // var value = target.value;
    let val = e.target.value;
    if (e.target.name == "roles" || e.target.name == "users") {
      setLeadUser((prev) => ({
        ...prev,
        [e.target.name]: [e.target.value],
      }));
    } else if (
      e.target.name === "no_of_ports" ||
      e.target.name === "capacity"
      // e.target.name === "name"
    ) {
      if (isFieldsEditable[e.target.name]) {
        validateHarwareValue(e.target.name, e.target.value);
        setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      }
    } else {
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    if (name == "zone") {
      // getlistofparentslno(val);
    setLeadUser(prev => ({ ...prev, zone: { id: val } }));
      // getlistofAreas(val)
    } 
    // setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  const validateHarwareValue = (name, value) => {
    const currentValue = leadUserBkp[name];
    if (value < currentValue) {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: "this value should not be less than current value",
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

  // const deptDetails = (id) => {

  //   // let openybyId = get (leadUser.roles, "id", leadUser.roles);
  //   let leaddata = {
  //     ...leadUser,
  //     // roles: [id]
  //     // roles :openybyId,

  //   }

  //   if (!isDisabled) {
  //     // `/accounts/department/${id}/rud`

  //     axios.patch(`https://sparkradius.in:7007/network/olt/update/${id}`,leaddata).then((res) => {
  //         console.log(res);
  //         console.log(res.data);
  //         const role = roles.find(r=>r.id==res.data.roles[0]);
  //         const dep = deptusers.find(d=>d.id==res.data.users[0])
  //         props.onUpdate({...res.data,roles:[role],users:[dep]});
  //         setIsdisabled(true);
  //       });
  //     // }
  //   }
  // };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    let data = { ...leadUser };
    data.house_no = !isEmpty(data && data.house_no)
      ? data && data.house_no
      : "N/A";
    delete data.parent_olt;
    delete data.available_ports;
    delete data.created_at;
    delete data.created_by;
    delete data.updated_at;
    delete data.updated_by;
    delete data.is_parent_oltport;
    delete data.parent_dpport;
    delete data.parent_oltport;
    // delete data.area;
    // delete data.zone;
    data.no_of_ports = +data.no_of_ports;
    data.zone = leadUser.zone.id;


    //validations for name field
    let dataNew = { ...data };
    dataNew.nas_name = data.name;
    delete dataNew.area;
    const validationErrors = validate(dataNew);
    data.serial_no = { name: data.serial_no };

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

    if (noErrors && isEmpty(noErrors)) {
      setDisable(true);
      setIsdisabled(true);
      networkaxios
        .put(`network/${props.selectedDpRadioBtnDisplay}/update/${id}`, data)
        .then((res) => {
          setDisable(false);
          console.log(res);
          console.log(res.data);
          props.onUpdate(res.data);
          toast.success("DP was edited successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          setIsdisabled(true);
          props.Refreshhandler();
        })
        // .catch((e)=>{
        //   setDisable(false)
        // })
        .catch(function (error) {
          // Re-enable any disabled functionality
          setDisable(false);
          setIsdisabled(false);
          // If there's detailed information in the error response, set it
          if (error.response && error.response.data) {
            setErrors(error.response.data);
          }

          let message = "Something went wrong";
          if (error.response) {
            // Handle specific HTTP status codes
            if (error.response.status === 500) {
              message = "Something went wrong.";
            } else if (error.response.data) {
              setErrors(error.response.data);

              if (error.response.data.detail) {
                message = error.response.data.detail;
              } else {
                // Try to get the first key's value if 'detail' doesn't exist
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
    // }
  };

  // const handleSubmit = (e, id) => {

  //   e.preventDefault();

  //   e = e.target.name;

  //   const validationErrors = validate(leadUser);
  //   const noErrors = Object.keys(validationErrors).length === 0;
  //   setErrors(validationErrors);
  //   if (noErrors) {
  //     deptDetails(id);
  //   } else {
  //     console.log("errors try again", validationErrors);
  //   }
  // };
  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
  };

  const requiredFields = [
    "no_of_ports",
    "nas_name",
    "serial_no",
    "zone",
    "house_no",
    "longitude",
    "latitude",
    "street",
    "landmark",
    "city",
    "pincode",
    "district",
    "state",
    "country",
  ];
  const { validate, Error } = useFormValidation(requiredFields);
  // useEffect(() => {
  //   axios
  //     .get("https://sparkradius.in:7007/network/extended/options")
  //     .then((res) => {
  //       let { branches } = res.data;
  //       setBranch([...branches]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get("https://sparkradius.in:7007/network/extended/options")
  //     .then((res) => {
  //       console.log(res);
  //       // let { branch_name } = res.data;
  //       setBranch([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
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
      {token.permissions.includes(
        NETWORK.OPTICALPARENTDPUPDATE || NETWORK.OPTICALCHILDDPUPDATE
      ) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "7px", right: "64px" }}
          onClick={clicked}
          // disabled={isDisabled}
        />
      )}
      {/* <Row style={{ paddingLeft: "2%" }}> */}
      {/* <Col sm="2"> */}
      {/* </Col>
        <Col style={{ marginTop: "-27px" }}>
          <h6 style={{ textAlign: "center" }}>
            ID : DP{props.lead && props.lead.id}
          </h6>
        </Col> */}
      {/* </Row> */}
      <br />
      <Container fluid={true}>
        <Form
        // onSubmit={(e) => {
        //   handleSubmit(e, props.lead.id);
        // }}
        >
          <Row style={{ marginTop: "4%" }}>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Name</Label>
                  <input
                    className={`form-control digits not-empty`}
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
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Serial Number</Label>

                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="serial_no"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.serial_no}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isDisabled}
                  ></input>

                  <span className="errortext">{errors.serial_no}</span>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                    Branch
                  </Label>
                  <Input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                    // disabled={isDisabled}
                    type="text"
                    name="branch"
                    onChange={handleChange}
                    disabled={true}
                    value={leadUser && leadUser.branch}

                    // onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                    Franchise
                  </Label>
                  <Input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                    // disabled={isDisabled}
                    type="text"
                    name="franchise"
                    onChange={handleChange}
                    disabled={true}
                    value={leadUser && leadUser.franchise?.name}
                  >
                    <option style={{ display: "none" }}></option>
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                    Zone
                  </Label>
                  <Input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                    // disabled={isDisabled}
                    type="select"
                    name="zone"
                    onChange={handleChange}
                    disabled={isDisabled}
                    value={leadUser && leadUser.zone?.id}
                  >
                    <option style={{ display: "none" }}></option>

                    {zone.map((types) => (
                      <option key={types.id} value={types.id}>
                        {types.name}
                      </option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                    Area
                  </Label>
                  <Input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                    // disabled={isDisabled}
                    type="select"
                    name="area"
                    onChange={handleChange}
                    disabled={isDisabled}
                    value={leadUser && leadUser?.area?.id}
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
              </FormGroup>{" "}
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Number of Ports</Label>

                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="no_of_ports"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.no_of_ports}
                    onChange={handleChange}
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
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Parent OLT Port</Label>

                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="parent_oltport"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.parent_oltport}
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
                  <Label className="kyc_label">Parent OLT Name</Label>

                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="parent_olt"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.parent_olt}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
              {/* <span className="errortext">{errors.hardware_name}</span> */}
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
                    // onBlur={blur}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Created By</Label>

                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="created_by"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.created_by}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row id="reaarangeaddress">
            <Col>
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
                />
              )}
            </Col>
          </Row>
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

export default Dpedetails;
