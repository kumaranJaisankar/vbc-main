import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  Input,
  FormGroup,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
// import { toast } from "react-toastify";
import { adminaxios } from "../../../../axios";
import useFormValidation from "../../../customhooks/FormValidation";
import AddressComponent from "../../../common/AddressComponentDetailsPage";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { ADMINISTRATION } from "../../../../utils/permissions";
import ErrorModal from "../../../common/ErrorModal";
import AdminMultiselect from "./adminmultiselect";
import Multiselect from "../../franchise/multiselectcheckbox";

// Sailaja imported common component Sorting on 29th March 2023
import { Sorting } from "../../../common/Sorting";

import { userStatus } from "./data";
import ZoneModal from "../../../common/zoneConfirmModal";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const tokenInfo = JSON.parse(localStorage.getItem("token"));
let UserTypEdit = false;
if (tokenInfo && tokenInfo.user_type === "Admin") {
  UserTypEdit = true;
}
const Userdetails = (props, initialValues) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: "",
    mobile_number: "",
    email: "",
    first_name: "",
    last_name: "",
    roles: "",
    // permissions: [],
    avatar: null,
    googleAddress: "",
    entity: "",
    franchise: "",
    user_type: "",
  });
  // console.log(formData, "formDataformData");
  const { id } = useParams();
  const [errors, setErrors] = useState({});

  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  const [roles, setRoles] = useState([]);
  const [usertype, setUsertype] = useState([]);
  const [resetStatus, setResetStatus] = useState(false);
  const [inputs, setInputs] = useState(initialValues);
  //to disable button
  const [disable, setDisable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  // added edit functionality states
  const [resetfield, setResetfield] = useState(false);
  const [franchiselist, setFranchiselist] = useState([]);
  const [branchlist, setBranchlist] = useState([]);
  const [zonelist, setZoneList] = useState([]);
  const [selcategories, setSelectedCategories] = useState([]);
  const [arealist, setAreaList] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [checkedZonesnew, setCheckedZones] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [metazoneData, setMetazoneData] = useState([]);

  const resetformmanually = () => {
    setFormData({
      username: "",
      cleartext_password: "",
      status: "",
      user_type: "",
    });
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
  };

  useEffect(() => {
    console.log(props.lead, "props.lead");
    if (!!props.lead) setLeadUser(props.lead);
    resetformmanually();
    setIsdisabled(true);
    setErrors({});
    console.log("1");
  }, [props.lead]);

  useEffect(() => {
    if (!!props.lead) setLeadUser(props.lead);
    setIsdisabled(true);
    resetformmanually();
    console.log("2");
  }, [props.rightSidebar]);

  const handleChange = (e) => {
    setResetfield(false);
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
    let val = e.target.value;
    const target = e.target;
    var value = target.value;
    const name = target.name;
    if (
      e.target.name == "street" ||
      e.target.name == "city" ||
      e.target.name == "landmark" ||
      e.target.name == "country" ||
      e.target.name == "pincode" ||
      e.target.name == "district" ||
      e.target.name == "state" ||
      e.target.name == "house_no"
    ) {
      let address = { ...leadUser.address, [e.target.name]: e.target.value };
      setLeadUser(() => ({ ...leadUser, address: address }));
    } else if (e.target.name == "roles") {
      setLeadUser((prev) => ({ ...prev, [e.target.name]: [+e.target.value] }));
    } else {
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
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

    if (name == "franchise") {
      setSelectedZones([]);
      setSelectedIds([]);
      setZoneList([]);
      franchZoneList(val);
    }
    if (name == "entity") {
      setZoneList([]);
      setSelectedZones([]);
      setSelectedIds([]);
      setFranchiselist([]);
      setBranchlist([]);
      getlistofranchises(value);
      getlistobranches(value);
      setResetfield(true);
    }
    if (name == "branch") {
      setSelectedZones([]);
      setZoneList([]);
      setSelectedIds([]);
      branchZOneList(val);
    }
    if (name == "zone") {
      getlistofareas(val);
    }
    if (e.target.name === "pincode") {
      const validPinCode = e.target.value.replace(/[^0-9]/g, "");
      let address = { ...leadUser.address, [e.target.name]: validPinCode };
      setLeadUser(() => ({ ...leadUser, address: address }));
      // setFormData(prevState => ({
      //   ...prevState,
      //   pincode: validPinCode
      // }));
    }
  };

  const fetchData = () => {
    adminaxios
      .get("accounts/options/all")
      .then((res) => {
        let { roles, permissions, user_types } = res.data;
        setRoles(Sorting([...roles], "name"));
        setUsertype([...user_types]);
      })
      .catch((error) => console.log(error));
  };

  // Use the custom function inside the useEffect hook
  useEffect(() => {
    console.log("3");
    fetchData();
  }, []);

  //handling edit functionality
  // api to get franchise on select of franchise in entity dropdown
  const getlistofranchises = () => {
    adminaxios.get("accounts/franchises/mine").then((res) => {
      // setFranchiselist([...res.data]);
      setFranchiselist(Sorting([...res.data], "name"));
    });
  };
  //end
  // api to get franchise on select of franchise in entity dropdown
  const getlistobranches = () => {
    adminaxios.get("accounts/branches/mine").then((res) => {
      // setBranchlist([...res.data]);
      // Sailaja sorting the Administration -> Users ->Branch * Dropdown data as alphabetical order on 29th March 2023
      setBranchlist(Sorting([...res.data], "name"));
    });
  };

  //end
  const requiredFields = [];
  //console.log(leadUser, "leadUser");
  const { validate, Error } = useFormValidation(requiredFields);
  const handleSubmit = (e, username) => {
    // Sailaja commetedoff the to fix  loader issue on 16th May 2023
    // setDisable(true)
    e.preventDefault();
    e = e.target.name;

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let userData = {
      username: leadUser.username,
      user_type: leadUser.user_type,
      is_active: leadUser.is_active,
      cleartext_password: leadUser.cleartext_password,
      // service_plan: "ss",
      service_plan: leadUser.service_plan,
    };
    const validationErrors = validate(userData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      const data = { ...userData };

      // console.log("data3456", selectedAreas);
      // console.log(data, "data456");
      setMetazoneData(data);
      // if (!inputs.user_type) {
      //   // If the user_type hasn't been set, delete it from the data object
      //   delete data.user_type;
      // }
      if (!isDisabled) {
        adminaxios

          .patch("accounts/universityusers/" + username.id + "/edit", data)
          .then((res) => {
            setDisable(false);
            props.onUpdate({ ...res.data, username: username.username });
            fetchData();
            // toast.success("User was edited successfully", {
            //   position: toast.POSITION.TOP_RIGHT,
            //   autoClose: 1000,
            // });
            setShowModal(true);
            setModalMessage("User was edited successfully");
            // props.Refreshhandler()
            props.Refreshhandler();
            props.dataClose();
            setIsdisabled(true);
          })
          .catch((error) => {
            setDisable(false);

            if (error.response && error.response.data) {
              setErrors(error.response.data);
            }
            let errorMessage = "Something went wrong";

            // Check for error response and the 'detail' field
            if (
              error.response &&
              error.response.data &&
              error.response.data.detail
            ) {
              errorMessage = error.response.data.detail;
            }
            if (error.response.status === 400) {
              console.log(
                error.response.data.detail,
                "error.response.data.detail"
              );
              if (errorMessage.includes("Already assigned to User")) {
                setShowModal(true);
                setModalMessage(errorMessage);
              } else {
                setShowZoneModal(true);
                setConfirmModalMessage(errorMessage);
              }
            } else {
              setShowModal(true);
              setModalMessage(errorMessage);
            }

            // setShowModal(true);
            // setModalMessage("Something went wrong");
            // console.error("Error occurred:", error);
          });
        // props.Refreshhandler();
        // props.dataClose();
      } else {
        console.log("errors try again", validationErrors);
      }
    }
  };
  //     .catch(function (error) {
  //       setDisable(false);
  //       if (error.response && error.response.data) {
  //         setErrors(error.response.data);
  //       }
  //       toast.error("Something went wrong", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 1000,
  //       });
  //       console.error("Something went wrong!", error);
  //     });
  //   }
  //   props.Refreshhandler();
  //   props.dataClose();
  // } else {
  //   // toast.error("Something went wrong", {
  //   //   position: toast.POSITION.TOP_RIGHT,
  //   //   autoClose:1000
  //   // });
  //   console.log("errors try again", validationErrors);
  // }
  // };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(!isDisabled);
  };

  useEffect(() => {
    console.log("4");
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  useEffect(() => {
    console.log("5");
    if (props.openCustomizer) {
      resetformmanually();
      setIsdisabled(true);
      setErrors({});
    }
    resetformmanually();
    setIsdisabled(true);
    setErrors({});
  }, [props.openCustomizer]);

  //get area list based on zone
  const getlistofareas = (val) => {
    {
      inputs.user_type === "STAFF" &&
        adminaxios
          .get(
            `/accounts/all/${inputs.entity === "FR" ? "franchise" : "branch"}/${
              inputs.franchise || inputs.branch
            }/${val}/areas`
          )
          .then((response) => {
            // setAreaList(response.data);
            // Sailaja sorting the Add New User ->  Zone & Area *  Dropdown data as alphabetical order on 29th March 2023
            setAreaList(Sorting(response.data, "name"));
          })
          .catch(function (error) {
            console.error("Something went wrong!", error);
          });
    }
  };

  const franchZoneList = (val) => {
    const handleResponse = (res) => {
      if (res.data.zones) {
        const sortedZones = Sorting(res.data.zones, "name");
        if (Array.isArray(res.data.user_zones) && setSelectedCategories) {
          setSelectedCategories(res.data.user_zones);
          const key = "id";
          let newArray = [...res.data.zones, ...res.data.user_zones];
          const combinedArray = [
            ...new Map(newArray.map((item) => [item[key], item])).values(),
          ];
          const IdSelected = combinedArray
            .filter((item) => item?.selected_zone)
            .map((item) => item.id);
          setSelectedIds(IdSelected);
          setZoneList(combinedArray);
          // console.log(combinedArray, "combinedArray");
        } else {
          setZoneList(sortedZones);
        }
      }
    };

    let apiCall;

    if (inputs.user_type === "ZNMR") {
      const payload = {
        id: val,
        entity: inputs.entity,
        user_id: leadUser.id,
      };

      apiCall = adminaxios.post("accounts/zonalmanager/zones", payload);
    } else {
      apiCall = adminaxios.get(
        `accounts/available/${inputs.user_type}/franchise/${val}/zones`
      );
    }

    apiCall.then(handleResponse).catch((error) => {
      console.error("Error fetching zones:", error);
    });
  };

  const branchZOneList = (val) => {
    const handleResponse = (res) => {
      // if (res.data.zones) {
      //     const sortedZones = Sorting(res.data.zones, "name");
      //     setZoneList(sortedZones);
      // }
      // // If there's a multi-select dropdown for zones, and you want to use `user_zones`
      // if (Array.isArray(res.data.user_zones) && setSelectedCategories) {
      //     setSelectedCategories(res.data.user_zones);
      //     setSelectedZones(res.data.user_zones);  // set selected zones
      // }
      if (res.data.zones) {
        const sortedZones = Sorting(res.data.zones, "name");
        if (Array.isArray(res.data.user_zones) && setSelectedCategories) {
          setSelectedCategories(res.data.user_zones);
          const key = "id";
          let newArray = [...res.data.zones, ...res.data.user_zones];
          const combinedArray = [
            ...new Map(newArray.map((item) => [item[key], item])).values(),
          ];
          const IdSelected = combinedArray
            .filter((item) => item?.selected_zone)
            .map((item) => item.id);
          setSelectedIds(IdSelected);
          setZoneList(combinedArray);
          //console.log(combinedArray, "combinedArray");
        } else {
          setZoneList(sortedZones);
        }
      }
    };

    let apiCall;

    if (inputs.user_type === "ZNMR") {
      const payload = {
        id: val,
        entity: inputs.entity,
        user_id: leadUser.id,
      };

      apiCall = adminaxios.post("accounts/zonalmanager/zones", payload);
    } else {
      apiCall = adminaxios.get(
        `accounts/available/${"STAFF"}/branch/${val}/zones`
      );
    }

    apiCall.then(handleResponse).catch((error) => {
      console.error("Error fetching zones:", error);
    });
  };
  const handleClick = () => {
    setShowZoneModal(false);
    let reqData = {
      id: parseInt(metazoneData?.franchise),
      entity: metazoneData?.entity,
      user_id: metazoneData?.id,
      user_type: metazoneData?.user_type,
      zones: metazoneData?.zones,
    };

    adminaxios
      .post("accounts/zonalmanager/zones/assign", reqData)
      .then((res) => {
        setDisable(false);
        props.onUpdate({ ...res.data, username: props?.lead?.username });
        fetchData();
        // toast.success("User was edited successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
        setShowModal(true);
        setModalMessage("User was edited successfully");
        // props.Refreshhandler()
        setIsdisabled(true);
      })
      .catch((error) => {
        setDisable(false);

        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        let errorMessage = "Something went wrong";

        // Check for error response and the 'detail' field
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail
        ) {
          errorMessage = error.response.data.detail;
        }

        setShowModal(true);
        setModalMessage(errorMessage);
      });
    props.Refreshhandler();
    props.dataClose();
  };

  const deletFunc = (username) => {
    adminaxios
      .delete("accounts/universityusers/" + username.id + "/delete")
      .then((res) => {
        setDeleteModal(false);
        setShowModal(true);
        setModalMessage("Deleted succesfully!");
        props.Refreshhandler();
        props.dataClose();
      })
      .catch((error) => {
        setDeleteModal(false);
        setShowModal(true);
        setModalMessage("Something went wrong!");
      });
  };

  return (
    <Fragment>
      <Row md={6}>
        {!isDisabled && (
          <DeleteIcon
            className="icofont icofont-edit"
            style={{ top: "18px", right: "100px", color: "black" }}
            // id="edit_icon"
            onClick={() => setDeleteModal(true)}
          />
        )}
      </Row>
      <Row>
        {token && token.permissions?.includes(ADMINISTRATION.USERUPDATE) && (
          <>
            {isDisabled ? (
              <EditIcon
                className="icofont icofont-edit"
                style={{ top: "8px", right: "64px" }}
                id="edit_icon"
                onClick={clicked}
              />
            ) : (
              <EditOffIcon
                className="icofont icofont-edit"
                style={{ top: "8px", right: "64px" }}
                id="edit_icon"
                onClick={clicked}
              />
            )}
          </>
        )}
      </Row>

      <Container fluid={true}>
        <Form>
          <Row className="form_layout">
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">User Name *</Label>

                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="username"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.username}
                    // onBlur={checkEmptyValue}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
                <span className="errortext">{errors.username}</span>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Status</Label>
                  <Input
                    type="select"
                    name="is_active"
                    disabled={isDisabled}
                    className={`form-control digits not-empty`}
                    value={leadUser && leadUser.is_active}
                    onChange={handleChange}
                    // onBlur={checkEmptyValue}
                  >
                    <option value="" style={{ display: "none" }}></option>

                    {userStatus.map((fupCal) => {
                      return <option value={fupCal.id}>{fupCal.name}</option>;
                    })}
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Cleartext Password</Label>

                  <Input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="cleartext_password"
                    style={{
                      border: "none",
                      outline: "none",
                    }}
                    value={leadUser && leadUser.cleartext_password}
                    // onBlur={checkEmptyValue}
                    onChange={handleChange}
                    disabled={
                      token.permissions.includes(ADMINISTRATION.USER_TYPE_EDIT)
                        ? isDisabled
                        : true
                    }
                  />
                </div>
                <span className="errortext">{errors.cleartext_password}</span>
              </FormGroup>
            </Col>
            <Col md="3">
              {/* {console.log(leadUser, "leadUser.user_type")} */}
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">User Type</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="user_type"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.user_type}
                    onChange={handleChange}
                    // disabled={isDisabled}
                    disabled={
                      token.permissions.includes(ADMINISTRATION.USER_TYPE_EDIT)
                        ? isDisabled
                        : true
                    }
                  >
                    {[
                      { id: "STUDENT", name: "Student" },
                      { id: "STAFF", name: "Staff" },
                    ].map((typeofuser) => (
                      <option key={typeofuser.id} value={typeofuser.id}>
                        {typeofuser.name}
                      </option>
                    ))}
                  </select>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <br />
          <br />
          <Row>
            {/* Added Edit Functionality */}
            {/* {UserTypEdit ? ( */}

            <Col md="3" className="user_moveup">
              {/* {console.log(leadUser, "leadUser.user_type")} */}
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Plan Type</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="service_plan"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.service_plan}
                    onChange={handleChange}
                    // disabled={isDisabled}
                    disabled={
                      token.permissions.includes(ADMINISTRATION.USER_TYPE_EDIT)
                        ? isDisabled
                        : true
                    }
                  >
                    {/* <option key={typeofuser.id} value={" "}>
                      Select Plan Type
                        </option> */}
                    {props.planList.map((typeofuser) => (
                      <option key={typeofuser.id} value={typeofuser.id}>
                        {typeofuser.package_name}
                      </option>
                    ))}
                  </select>
                </div>
              </FormGroup>
            </Col>
            {/* ) : ( */}
            {/* <Col md="3" className="user_moveup">
                   <select
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="select"
                      name="user_type"
                      style={{ border: "none", outline: "none" }}
                      value={
                        leadUser &&
                        leadUser.user_type &&
                        leadUser.user_type.name
                      }
                      onChange={handleChange}
                      // onBlur={blur}
                      disabled={true}
                    >
                      {usertype.map((typeuser) => {
                        return (
                          <option
                            key={typeuser.id}
                            value={typeuser.id}
                            selected={
                              leadUser && typeuser.id == leadUser.user_type
                                ? "selected"
                                : ""
                            }
                          >
                            {typeuser.name}
                          </option>
                        );
                      })}
                      {usertype.map((typeuser) => {
                        if (!!typeuser && leadUser && leadUser.user_type) {
                          return (
                            <option
                              key={typeuser.id}
                              value={typeuser.name}
                              selected={
                                typeuser.id == leadUser.user_type.name
                                  ? "selected"
                                  : ""
                              }
                            >
                              {typeuser.name}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </div>
                </FormGroup>
              </Col>
            )} */}
            {/* <Col md="3" className="user_moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">User Type</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="user_type"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.user_type && leadUser.user_type.id
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  >
                    {usertype.map((typeuser) => (
                      <option key={typeuser.id} value={typeuser.id}>
                        {typeuser.name}
                      </option>
                    ))}
                  </select>
                </div>
              </FormGroup>
            </Col> */}

            {/* Zone, Branch and Area for User Edit */}

            <Col
              sm="3"
              // className="padding-10"
              className="user_moveup"
              // id="moveup"
              hidden={inputs.entity != "FR" || inputs.user_type != "ZNMR"}
            >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Franchise *</Label>
                  <Input
                    type="select"
                    name="franchise"
                    className="form-control digits"
                    onChange={handleChange}
                    onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>
                    {franchiselist.map((listoffranchises) => (
                      <option
                        key={listoffranchises.id}
                        value={listoffranchises.id}
                      >
                        {listoffranchises.name}
                      </option>
                    ))}
                  </Input>
                </div>
                <span className="errortext">{errors.user_type}</span>
              </FormGroup>
            </Col>

            <Col
              sm="3"
              className="user_moveup"
              // className="padding-10"
              // id="moveup"
              hidden={inputs.entity != "FR" || inputs.user_type != "STAFF"}
            >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Franchise *</Label>
                  <Input
                    type="select"
                    name="franchise"
                    className="form-control digits"
                    onChange={handleChange}
                    onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>
                    {franchiselist.map((listoffranchises) => (
                      <option
                        key={listoffranchises.id}
                        value={listoffranchises.id}
                      >
                        {listoffranchises.name}
                      </option>
                    ))}
                  </Input>
                </div>
                <span className="errortext">{errors.user_type}</span>
              </FormGroup>
            </Col>
            <Col
              sm="3"
              // className="padding-10"
              // id="moveup"
              className="user_moveup"
              hidden={inputs.entity != "FR" || inputs.user_type != "HPDSK"}
            >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Franchise *</Label>
                  <Input
                    type="select"
                    name="franchise"
                    className="form-control digits"
                    onChange={handleChange}
                    onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>
                    {franchiselist.map((listoffranchises) => (
                      <option
                        key={listoffranchises.id}
                        value={listoffranchises.id}
                      >
                        {listoffranchises.name}
                      </option>
                    ))}
                  </Input>
                </div>
                <span className="errortext">{errors.user_type}</span>
              </FormGroup>
            </Col>
            {/* end */}
            {/* branch */}
            <Col
              sm="3"
              // className="padding-10"
              // id="moveup"
              className="user_moveup"
              hidden={inputs.entity != "BR" || inputs.user_type != "ZNMR"}
            >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Branch *</Label>
                  <Input
                    type="select"
                    name="branch"
                    className="form-control digits"
                    onChange={handleChange}
                    onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>
                    {branchlist.map((listofbranches) => (
                      <option key={listofbranches.id} value={listofbranches.id}>
                        {listofbranches.name}
                      </option>
                    ))}
                  </Input>
                </div>
                <span className="errortext">{errors.user_type}</span>
              </FormGroup>
            </Col>
            <Col
              sm="3"
              // className="padding-10"
              // id="moveup"
              className="user_moveup"
              hidden={inputs.entity != "BR" || inputs.user_type != "STAFF"}
            >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Branch *</Label>
                  <Input
                    type="select"
                    name="branch"
                    className="form-control digits"
                    onChange={handleChange}
                    onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>
                    {branchlist.map((listofbranches) => (
                      <option key={listofbranches.id} value={listofbranches.id}>
                        {listofbranches.name}
                      </option>
                    ))}
                  </Input>
                </div>
                <span className="errortext">{errors.user_type}</span>
              </FormGroup>
            </Col>
            <Col
              sm="3"
              // className="padding-10"
              // id="moveup"
              className="user_moveup"
              hidden={inputs.entity != "BR" || inputs.user_type != "HPDSK"}
            >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Branch *</Label>
                  <Input
                    type="select"
                    name="branch"
                    className="form-control digits"
                    onChange={handleChange}
                    onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>
                    {branchlist.map((listofbranches) => (
                      <option key={listofbranches.id} value={listofbranches.id}>
                        {listofbranches.name}
                      </option>
                    ))}
                  </Input>
                </div>
                <span className="errortext">{errors.user_type}</span>
              </FormGroup>
            </Col>
            {/* end */}
            {/* zone and area */}
            <Col
              sm="3"
              // className="padding-10"
              // id="moveup"
              className="user_moveup"
              hidden={
                (inputs.entity != "FR" && inputs.entity != "BR") ||
                inputs.entity != "ZNMR"
              }
            >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Zone1 *</Label>
                  <Input
                    type="select"
                    name="zone"
                    className="form-control digits"
                    onChange={handleChange}
                    onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>
                    {zonelist.map((listofzones) => (
                      <option key={listofzones.id} value={listofzones.id}>
                        {listofzones.name}
                      </option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col
              sm="3"
              className="padding-10 user_moveup"
              id="moveup"
              hidden={
                (inputs.entity != "FR" && inputs.entity != "BR") ||
                inputs.user_type != "ZNMR"
              }
            >
              <Label className="kyc_label">Zones *</Label>
              {/* {console.log(zonelist, "zonelist")}
              {console.log("Selected Zones:", selectedZones)} */}
              <FormGroup>
                <AdminMultiselect
                  data={zonelist}
                  setValues={setSelectedCategories}
                  selectedValues={selectedZones}
                  setCheckedZones={setCheckedZones} // pass selected zones to the component
                  setSelectedZones={setSelectedZones}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              </FormGroup>
            </Col>
            <Col
              sm="3"
              // className="padding-10"
              // id="moveup"
              className="user_moveup"
              hidden={
                (inputs.entity != "FR" && inputs.entity != "BR") ||
                (inputs.user_type != "STAFF" && inputs.user_type != "HPDSK")
              }
            >
              <FormGroup>
                <Label className="kyc_label">Zone & Area3 *</Label>
                <Multiselect
                  arealist={zonelist}
                  setFormData={setFormData}
                  resetfield={resetfield}
                  setResetfield={setResetfield}
                />
                {/* Sailaja modified msg as Selection is required */}
                <span className="errortext">
                  {errors.areas && "Selection is required"}
                </span>
              </FormGroup>
            </Col>
            {/* end */}
            {/* <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <select
                    style={{
                      color: "#495057",
                      border: "none",
                      outline: "none",
                    }}
                    className={`form-control digits not-empty`}
                    type="select"
                    name="branch"
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={isDisabled}
                    value={leadUser && leadUser.branch}
                  >
                    <option style={{ display: "none" }}></option>
                    {branch.map((types) => (
                      <option key={types.id} value={types.id}>
                        {types.name}
                      </option>
                    ))}
                  </select>
                  <Label className="placeholder_styling">Branch</Label>
                </div>
              </FormGroup>
              <span className="errortext">
                {errors.branch && "Select any branch"}
              </span>
            </Col> */}

            {/* <Col md="4">
              <Label className="placeholder_styling">Role</Label>
              <div className="input_wrap">
                <Input
                  id="afterfocus"
                  type="select"
                  name="roles"
                  style={{ border: "none", outline: "none" }}
                  className="form-control digits"
                  onChange={handleChange}
                  disabled={isDisabled}
                  onBlur={checkEmptyValue}
                  value={
                    leadUser &&
                    leadUser.roles &&
                    leadUser.roles.length > 0 &&
                    leadUser.roles[0].id
                  }
                >
                  <option style={{display:"none"}}></option>
                  {roles.map((opened) => (
                    <option key={opened.id} value={opened.id}>
                      {opened.name}
                    </option>
                  ))}
                </Input>
              </div>
            </Col> */}

            {/* <Col sm="4">
              <Label className="placeholder_styling">Branch</Label>
              <div className="input_wrap">
                <Input
                  id="afterfocus"
                  type="select"
                  name="branch"
                  style={{ border: "none", outline: "none" }}
                  className="form-control digits"
                  onChange={handleChange}
                  disabled={isDisabled}
                  onBlur={checkEmptyValue}
                  value={leadUser && leadUser.branch && leadUser.name} 
                >
                  <option style={{display:"none"}}></option>
                  {branch.map((opened) => (
                    <option key={opened.id} value={opened.id}>
                      {opened.name}
                    </option>
                  ))}
                </Input>
              </div>
            </Col> */}
            <span
              className="sidepanel_border"
              style={{ position: "relative", top: "24px" }}
            ></span>
          </Row>
          <br />
          <button
            type="button"
            name="submit"
            class="btn btn-primary"
            id="save_button"
            onClick={(e) => handleSubmit(e, props.lead)}
            disabled={isDisabled}
          >
            {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp; &nbsp; &nbsp;
          <button
            type="button"
            name="submit"
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
        <ZoneModal
          isOpen={showZoneModal}
          toggle={() => setShowZoneModal(false)}
          message={confirmModalMessage}
          action={() => setShowZoneModal(false)}
          iscontinue={handleClick}
        />
      </Container>
      <Modal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        centered
      >
        <ModalHeader>Confirmation !</ModalHeader>
        <ModalBody>Do you want permanently delete this user?</ModalBody>
        <ModalFooter>
          <Button onClick={() => setDeleteModal(false)}>No</Button>
          <Button color="danger" onClick={() => deletFunc(props.lead)}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default Userdetails;
