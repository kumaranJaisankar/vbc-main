
import React, { Fragment, useEffect, useState } from "react"; //hooks
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  Input,
  FormGroup,
  Spinner,
  Button, Modal, ModalHeader, ModalBody, ModalFooter, 
} from "reactstrap";
import { nasType, statusType } from "./nasdropdown";
import { adminaxios, networkaxios } from "../../../../axios";
import useFormValidation from "../../../customhooks/FormValidation";
import MaskedInput from "react-text-mask";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { NETWORK } from "../../../../utils/permissions";
import AddressComponent from "../../../common/AddressComponent";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const NasDetails = (props, initialValues) => {
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [resetStatus, setResetStatus] = useState(false);
  const [inputs, setInputs] = useState(initialValues);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNasType, setNewNasType] = useState(null);
  const [nasType, setNasType] = useState([]);

  //to disable button
  const [disable, setDisable] = useState(false);
  // Nas Type API
  useEffect(() => {
    networkaxios.get("/network/all/nas/types").then((res) => {
      setNasType(res.data.nas_types);
    });
  }, []);

  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);


  // useEffect(() => {
  //   setIsdisabled(true);
  //   let selectedBranch = branch.find(
  //     (branch) => branch.name === props.lead.branch
  //   );
  //   if (selectedBranch)
  //     setLeadUser({ ...props.lead, branch: selectedBranch.id });
  // }, [props.rightSidebar]);
  useEffect(() => {
    setIsdisabled(true);
    let selectedBranch = branch.find(
      (branch) => branch.name === props.lead.branch
    );
    if (selectedBranch)
      setLeadUser({ ...props.lead, branch: selectedBranch.id });
  }, [props.rightSidebar, branch, props.lead]);


  // useEffect(() => {
  //   networkaxios.get("/network/nas/display").then((res) => {
  //     setLeadUser(res.data);
  //   });
  // }, []);

  const ipprops = {
    guide: true,
    mask: (value) => {
      let result = [];
      const chunks = value.split(".");

      for (let i = 0; i < 4; ++i) {
        const chunk = (chunks[i] || "").replace(/_/gi, "");

        if (chunk === "") {
          result.push(/\d/, /\d/, /\d/, ".");
          continue;
        } else if (+chunk === 0) {
          result.push(/\d/, ".");
          continue;
        } else if (
          chunks.length < 4 ||
          (chunk.length < 3 && chunks[i].indexOf("_") !== -1)
        ) {
          if (
            (chunk.length < 2 && +`${chunk}00` > 255) ||
            (chunk.length < 3 && +`${chunk}0` > 255)
          ) {
            result.push(/\d/, /\d/, ".");
            continue;
          } else {
            result.push(/\d/, /\d/, /\d/, ".");
            continue;
          }
        } else {
          result.push(...new Array(chunk.length).fill(/\d/), ".");
          continue;
        }
      }

      result = result.slice(0, -1);
      return result;
    },
    pipe: (value) => {
      if (value === "." || value.endsWith("..")) return false;

      const parts = value.split(".");

      if (
        parts.length > 4 ||
        parts.some((part) => part === "00" || part < 0 || part > 255)
      ) {
        return false;
      }

      return value;
    },
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    if (name === "ip_address") {
      if (value.includes("_")) {
        setErrors((prevState) => {
          return {
            ...prevState,
            ip_address: "Enter valid IP address",
          };
        });
      } else {
        setErrors((prevState) => {
          return {
            ...prevState,
            ip_address: "",
          };
        });
        setLeadUser((prev) => ({ ...prev, [name]: value }));
      }
    } 
    else if (name === "nas_type") {
      // Save the new nas_type to state
      setNewNasType(value);
      try {
        // Get the user count for this NAS type
        const response = await networkaxios.get(
          `network/nas/users/count/${leadUser.id}`
        );
        console.log(response.data,"test")
  
        if (response.status === 200) {
          // If the response is OK, update the nas_type
          setLeadUser((prev) => ({ ...prev, nas_type: value }));
        } else if (response.status === 400 && response.data.detail) {
          // If there's an error detail, show it in the modal
          setModalMessage(response.data.detail);
          setIsModalOpen(true);
        }
  
      } catch (error) {
        console.log(error.response.data);
        // If there's an error in the request, show it in the modal
        setModalMessage(error.response.data.detail);
        setIsModalOpen(true);
      }
    }
    else {
      setLeadUser((prev) => ({ ...prev, [name]: value }));
    }
    // else if (name === "nas_type") {
    //   // Save the new nas_type to state
    //   setNewNasType(value);
    //   try {
    //     // Get the user count for this NAS type
    //     const response = await networkaxios.get(
    //       `network/nas/users/count/${leadUser.id}`
    //     );
    
    //     if (response.data.detail) {
    //       setModalMessage(response.data.detail);
    //       setIsModalOpen(true);
    //     }
    //   } catch (error) {
    //     // Handle error
    //     console.error(error);
    //   }
    // }
    //  else {
    //   setLeadUser((prev) => ({ ...prev, [name]: value }));
    // }
  };
  
  // Sailaja changed validation message on 2nd March
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (e.target.name == "ip_address")
  //     if (e.target.name == "ip_address" && e.target.value.includes("_")) {
  //       setErrors((prevState) => {
  //         return {
  //           ...prevState,
  //           ip_address: "Enter valid IP address",
  //         };
  //       });
  //     } else {
  //       setErrors((prevState) => {
  //         return {
  //           ...prevState,
  //           ip_address: "",
  //         };
  //       });
  //     } else if (name === "nas_type") {
  //       // Save the new nas_type to state
  //       setNewNasType(value);
    
  //       try {
  //         // Get the user count for this NAS type
  //         const response = await customeraxios.get(
  //           `network/nas/users/count/${value}`
  //         );
    
  //         // If successful, open the modal with the response message
  //         setModalMessage(response.data.count);
  //         setModalOpen(true);
  //       } catch (error) {
  //         // Handle error
  //         console.error(error);
  //       }
  //     } else {
  //       setLeadUser((prev) => ({ ...prev, [name]: value }));
  //     }
  //   // };
  //   // setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };
  
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    // Update the nas_type in the leadUser state
    setLeadUser((prev) => ({ ...prev, nas_type: newNasType }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const typeDetails = (id) => {
    setDisable(true);
    let data = { ...leadUser };
    data.branch = parseInt(data.branch);
    data.serial_no = { name: data.serial_no };
    delete data.branch_id;
    if (!isDisabled) {

      networkaxios
        .put(`network/nas/update/${id}`, data)
        .then((res) => {
          setDisable(false);
          props.onUpdate(res.data);
          toast.success("NAS was edited successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });

          setIsdisabled(true);
          props.Refreshhandler();
        })
        // .catch(function (error) {
        //   setDisable(false);
        //   if (error.response && error.response.data) {
        //     setErrors(error.response.data);
        //   }
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        // });
        .catch(function (error) {
          setDisable(false);
          if (error.response && error.response.data) {
              setErrors(error.response.data);
              setModalMessage(error.response.data.detail);
              setIsModalOpen(true);
          }
          else {
              setModalMessage("Something went wrong");
              setIsModalOpen(true);
              setDisable(false)
          }
      });
      
      
    }else{
      setDisable(false)
    }
  };
  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    let dataNew = { ...leadUser };
    dataNew.nas_name = dataNew.name;
    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      typeDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };

  const requiredFields = [
    "landmark",
    "street",
    "city",
    "pincode",
    "district",
    "country",
    "state",
    // "longitude",
    // "latitude",

    "nas_name",
    "branch_id",
    "nas_type",
    "ip_address",
    "secret",
    "accounting_interval_time",
    "status",
    "serial_no",
    "latitude",
    "longitude",
  ];
  const { validate } = useFormValidation(requiredFields);
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        setBranch([...res.data]);
      })
      .catch((error) =>
        toast.error("error branch list", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  useEffect(() => {
    if (props.openCustomizer) {
      setErrors({});
    }
  }, [props.openCustomizer]);
  return (
    <Fragment>
      {token.permissions.includes(NETWORK.OPTICALNASUPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "8px", right: "64px" }}
          id="edit_icon"
          onClick={clicked}
          disabled={isDisabled}
        />
      )}
      <Container fluid={true}>
        <br />
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row style={{ marginTop: "1%" }}>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Name *</Label>
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
                    // disabled={true}
                  ></input>

                  <span className="errortext">{errors.nas_name}</span>
                </div>
              </FormGroup>{" "}
            </Col>
            {/* <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Branch *</Label>

                  <input
                    style={{
                      color: "#495057",
                      border: "none",
                      outline: "none",
                    }}
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    type="text"
                    name="branch_id"
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={true}
                    value={leadUser.branch}
                  >
                    <option style={{ display: "none" }}></option>
                    {branch.map((types) => (
                      <option key={types.id} value={types.id}>
                        {types.name}
                      </option>
                    ))}
                  </input>
                </div>
              </FormGroup>
              <span className="errortext">
                {errors.branch && "Select any branch"}
              </span>
            </Col> */}
            {console.log(leadUser,"leadUser")}
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Branch *</Label>
                  <select
                    // style={{
                    //   color: "#495057",
                    //   border: "none",
                    //   outline: "none",
                    // }}
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    type="select"
                    name="branch"
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={token.permissions.includes(NETWORK.NAS_BRANCH_EDIT) ? isDisabled: true} 
                    value={leadUser && leadUser.branch}
                    >
                    <option style={{ display: "none" }}></option>
                    {branch.map((types) => (
                      <option key={types.id} value={types.id}>
                        {types.name}
                      </option>
                    ))}
                  </select>
                </div>
              </FormGroup>
              <span className="errortext">
                {errors.branch && "Select any branch"}
              </span>
            </Col>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">NAS Type *</Label>
                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    style={{
                      color: "#495057",
                      border: "none",
                      outline: "none",
                    }}
                    type="select"
                    name="nas_type"
                    disabled={token.permissions.includes(NETWORK.NAS_TYPE_EDIT) ? isDisabled: true} 
                    onChange={handleChange}
                    value={leadUser && leadUser.nas_type}
                    >
                      {nasType.map((cateType) => {
                        return (
                          <option key={cateType.id} value={cateType.id}>
                            {cateType.name}
                          </option>
                        );
                      })}
                  </Input>
                </div>
                <span className="errortext">
                  {errors.nas_type && "Select any NAS type"}
                </span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">IP Address *</Label>
                  <MaskedInput
                    {...ipprops}
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="ip_address"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.ip_address}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></MaskedInput>
                  {errors.ip_address && (
                    <span className="errortext">
                      {errors && errors.ip_address != ""
                        ? errors.ip_address
                        : ""}
                    </span>
                  )}

                  {/* <span className="errortext">{errors.ip_address}</span> */}
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Secret *</Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="secret"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.secret}
                    onChange={handleChange}
                    // disabled={true}
                    disabled={isDisabled}
                  ></input>
                  <span className="errortext">{errors.secret}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap ">
                  <Label className="kyc_label Table_columns">
                    {" "}
                    Accounting Interval Time *
                  </Label>
                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    style={{ border: "none", outline: "none" }}
                    id="afterfocus"
                    value={leadUser && leadUser.accounting_interval_time}
                    disabled={true}
                    type="time"
                    min="0"
                    step="1"
                    name="accounting_interval_time"
                    onChange={handleChange}
                  />

                  <span className="errortext">
                    {errors.accounting_interval_time}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Status *</Label>
                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    style={{
                      color: "#495057",
                      border: "none",
                      outline: "none",
                    }}
                    type="select"
                    name="status"
                    disabled={isDisabled}
                    onChange={handleChange}
                    value={leadUser && leadUser.status}
                  >
                    {statusType.map((statType) => {
                      return (
                        <option value={statType.id}>{statType.name}</option>
                      );
                    })}
                  </Input>
                </div>
                <span className="errortext">
                  {errors.status && "Select status"}
                </span>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Serial Number *</Label>
                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    disabled={isDisabled}
                    id="afterfocus"
                    type="text"
                    name="serial_no"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.serial_no}
                    onChange={handleChange}
                  ></Input>
                </div>
                <span className="errortext">{errors.serial_no}</span>
              </FormGroup>
            </Col>
            {/* <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Latitude *</Label>
                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.latitude ? "not-empty" : "not-empty"
                    }`}
                    disabled={isDisabled}
                    id="afterfocus"
                    type="text"
                    name="latitude"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.latitude}
                    onChange={handleChange}
                  ></Input>
                </div>
                <span className="errortext">{errors.latitude}</span>
              </FormGroup>
            </Col> */}
            {/* <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Longitude *</Label>
                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.longitude ? "not-empty" : "not-empty"
                    }`}
                    disabled={isDisabled}
                    id="afterfocus"
                    type="text"
                    name="longitude"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.longitude}
                    onChange={handleChange}
                  ></Input>
                </div>
                <span className="errortext">{errors.longitude}</span>
              </FormGroup>
            </Col> */}
          </Row>
          <Row style={{ position: "relative", top: "-25px" }}>
            <h6 style={{ paddingLeft: "20px" }}>Address</h6>
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
              networkState={props.networkState}
            />
          )}
          <Row style={{ marginTop: "-4%" }}>
            <span
              className="sidepanel_border"
              style={{ position: "relative", top: "25px" }}
            ></span>
          </Row>
          <br />
          <button
            type="submit"
            name="submit"
            class="btn btn-primary"
            id="save_button"
            disabled={isDisabled}
          >
            {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp; &nbsp; &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            id="resetid"
            onClick={props.dataClose}
          >
            Cancel
          </button>
        </Form>
        <Modal isOpen={isModalOpen} toggle={closeModal} centered backdrop="static">
        {/* <ModalHeader toggle={closeModal}>Change NAS Type</ModalHeader> */}
        <ModalBody>{modalMessage}</ModalBody>
        <ModalFooter>
        <Button
                    variant="contained"
                    type="button"
                    onClick={handleModalConfirm}
                >
                    {"OK"}
                    </Button>
            </ModalFooter>
      </Modal>
      </Container>
    </Fragment>
  );
};

export default NasDetails;