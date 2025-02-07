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
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { adminaxios } from "../../../../axios";
// import { toast } from "react-toastify";
import { passwordStrength } from "check-password-strength";
import { Add } from "../../../../constant";
import useFormValidation from "../../../customhooks/FormValidation";
import { isEmpty } from "lodash";
import AdminMultiselect from "./adminmultiselect";

//address component google api calling

import AddressComponent from "../../../common/AddressComponent";
import Multiselect from "../../franchise/multiselectcheckbox";
import ErrorModal from "../../../common/ErrorModal";

// Sailaja imported common component Sorting on 29th March 2023
import { Sorting } from "../../../common/Sorting";
import ZoneModal from "../../../common/zoneConfirmModal";

const AddadminUser = (props, initialValues) => {
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
  });
  console.log(formData, "formDataformData");
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [image, setimage] = useState({ pictures: [] });
  const [roles, setRoles] = useState([]);
  //state for branch
  const [togglePassword, setTogglePassword] = useState(false);
  const [reenterToggle, setReenterToggle] = useState(false);
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState([]);
  //set state for usertype
  const [usertype, setUsertype] = useState([]);
  const [passwordScore, setPasswordScrore] = useState({});
  //state for franchise list
  const [franchiselist, setFranchiselist] = useState([]);
  const [branchlist, setBranchlist] = useState([]);
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  // based on franchise hetting zone list
  const [zonelist, setZoneList] = useState([]);
  //new state for area
  const [arealist, setAreaList] = useState([]);
  const [selcategories, setSelectedCategories] = useState([]);
  const [resetfield, setResetfield] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  //zone related
  const [metazoneData, setMetazoneData] = useState([]);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [metaZoneUserId, setMetaZoneUserId] = useState(0);
  console.log("area", arealist);
  const [rolepermissions, setRolePermission] = useState([]);
  console.log(rolepermissions, "rolepermissions");
  const handleInputChange = (event) => {
    event.persist();
    setResetfield(false);
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    setPassword(event.target.value);

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (target.name === "roles" || target.name === "permissions") {
      value = [target.value];
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
    if (name == "password" || name == "password2")
      validatePassword(name, value);

    if (name == "entity") {
      getlistofranchises(value);
      getlistobranches(value);
      setResetfield(true);
    }
    let val = event.target.value;
    if (name == "franchise") {
      franchZoneList(val);
    }
    // if (name ==="FR"){
    // }
    // let val1 = event.target.value
    // if (name == "user_type"){
    //   franchZoneList(val1)
    // }
    if (name == "branch") {
      branchZOneList(val);
    }
    if (name == "zone") {
      getlistofareas(val);
    }
    if (event.target.name === "roles") {
      const id = Number(event.target.value);
      const selectedItem = roles.find((role) => role?.id === id);
      console.log(selectedItem, "selectedItem");
      if (selectedItem) {
        setFormData((prevState) => ({
          ...prevState,
          permissions: selectedItem?.permissions,
        }));
      }
    }
    if (event.target.name === "pincode") {
      const validPinCode = event.target.value.replace(/[^0-9]/g, "");
      setFormData((prevState) => ({
        ...prevState,
        pincode: validPinCode,
      }));
    }
  };

  // {
  //   accounts/zone/${val}/areas`

  // }
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

  // get zone list based on franchise
  const franchZoneList = (val) => {
    if (inputs.user_type === "STAFF") {
      adminaxios
        .get(`accounts/available/${`STAFF`}/franchise/${val}/zones`)
        .then((res) => {
          // setZoneList([...res.data]);
          // Sailaja sorting the Add New User ->  Zone & Area *  Dropdown data as alphabetical order on 29th March 2023
          setZoneList(Sorting([...res.data], "name"));
        });
    } else {
      adminaxios
        .get(`accounts/available/${`ZNMR`}/franchise/${val}/zones`)
        .then((res) => {
          // Sailaja sorting the Add New User ->  Zone & Area *  Dropdown data as alphabetical order on 29th March 2023
          setZoneList(Sorting([...res.data], "name"));
        });
    }
  };
  // get zone list based on branch
  const branchZOneList = (val) => {
    if (inputs.user_type === "ZNMR") {
      adminaxios
        .get(`accounts/available/${"ZNMR"}/branch/${val}/zones`)
        .then((res) => {
          // setZoneList(res.data);
          setZoneList(Sorting(res.data, "name"));
        });
    } else {
      adminaxios
        .get(`accounts/available/${"STAFF"}/branch/${val}/zones`)
        .then((res) => {
          // setZoneList([...res.data]);
          // Sailaja sorting the Add New User ->  Zone & Area *  Dropdown data as alphabetical order on 29th March 2023
          setZoneList(Sorting([...res.data], "name"));
        });
    }
  };

  const passwordScoreObj = [
    {
      id: 0,
      value: "Bad",
      minDiversity: 0,
      minLength: 0,
    },
    {
      id: 1,
      value: "Weak",
      minDiversity: 2,
      minLength: 4,
    },
    {
      id: 2,
      value: "Medium",
      minDiversity: 3,
      minLength: 6,
    },
    {
      id: 3,
      value: "Strong",
      minDiversity: 4,
      minLength: 8,
    },
  ];
  const validatePassword = (name, value) => {
    const passwordStrengthObj = passwordStrength(value, passwordScoreObj);
    setPasswordScrore((prevState) => {
      return {
        ...prevState,
        [name]: passwordStrengthObj,
      };
    });
  };

  const getPasswordStatus = (current) => {
    switch (current && current.id) {
      case 0:
        return (
          <span>
            {" "}
            Strength : <span className="password-bad">{current.value} </span>
          </span>
        );
      case 1:
        return (
          <span>
            {" "}
            Strength : <span className="password-weak">{current.value}</span>
          </span>
        );
      case 2:
        return (
          <span>
            {" "}
            Strength : <span className="password-medium">{current.value}</span>
          </span>
        );
      case 3:
        return (
          <span>
            {" "}
            Strength : <span className="password-strong">{current.value}</span>
          </span>
        );
      default:
        return null;
    }
  };
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    } else {
      setIsOpen(true);
    }
  }, [webcamRef, setImgSrc]);
  const UploadImage = (e) => {
    let img = URL.createObjectURL(e.target.files[0]);
    setImgSrc(img);

    setFormData((preState) => ({
      ...preState,
      customer_documents: {
        ...preState.customer_documents,
        customer_pic: e.target.files[0],
      },
    }));
  };
  //api for getting roles permission and usertypes
  useEffect(() => {
    adminaxios
      .get("/accounts/options/all")
      .then((res) => {
        let { roles, permissions, user_types } = res.data;
        // setRoles([...roles]);
        // Sailaja sorting the Administration -> Users ->Roles * Dropdown data as alphabetical order on 29th March 2023
        setRoles(Sorting([...roles], "name"));
        setPermissions([...permissions]);
        // setUsertype([...user_types]);
        // Sailaja sorting the Administration -> Users (Add Panel) ->User Type * Dropdown data as alphabetical order on 29th March 2023
        setUsertype(Sorting([...user_types], "name"));
      })
      .catch((error) => console.log(error));
  }, []);
  //end
  //reset
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);
  //end
  const addAdmin = (name) => {
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // Sailaja Fixed error unable to create new user.i.e; error throwing from backend for Latitude Longitude fields on 4th April 2023
    let address = {
      // house_no: formData["house_no"],
      house_no: !isEmpty(formData.house_no) ? formData.house_no : "N/A",
      street: formData["street"],
      landmark: formData["landmark"],
      city: formData["city"],
      pincode: formData["pincode"],
      district: formData["district"],
      state: formData["state"],
      country: formData["country"],
      latitude: formData["latitude"],
      longitude: formData["longitude"],
    };

    formData.address = { ...address };
    console.log(formData, "formDataformData");
    // formData.permissions = [];

    let originaldata = { ...formData };
    console.log(originaldata, "originaldata");
    if (originaldata.entity == "FR") {
      delete originaldata.branch;
    }
    if (originaldata.entity == "BR") {
      delete originaldata.franchise;
    }
    delete originaldata.city;
    delete originaldata.country;
    delete originaldata.district;
    delete originaldata.house_no;
    delete originaldata.landmark;
    delete originaldata.pincode;
    delete originaldata.state;
    delete originaldata.street;
    const selectedAreas = selcategories.map((value) => value?.id);
    console.log(selectedAreas, "selcetdZones");
    originaldata.zones = selectedAreas;
    setMetazoneData(originaldata);

    console.log(selcategories, "selcategories");
    setLoaderSpinner(true);
    adminaxios
      .post("accounts/register", originaldata, config)
      .then((response) => {
        props.onUpdate(response.formData);
        setLoaderSpinner(false);
        setShowModal(true);
        setModalMessage("User was added successfully");
        resetformmanually();
        // toast.success("User was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        if (error.response) {
          let message = "";
          switch (error.response.status) {
            case 400:
              // First try to get the 'detail' field
              // by Marieya
              if (error.response.data && error.response.data.detail) {
                message = error.response.data.detail;
                setMetaZoneUserId(error?.response?.data?.user_details?.id);
                // setShowZoneModal(true);
                // setConfirmModalMessage(message);
              } else if (error.response.data) {
                // If 'detail' is not available, loop through the other error messages
                for (let key in error.response.data) {
                  if (Array.isArray(error.response.data[key])) {
                    error.response.data[key].forEach((item) => {
                      message += `${item}\n`;
                    });
                  } else {
                    message += `${error.response.data[key]}\n`;
                  }
                }
              } else {
                // If 'detail' is not available and error.response.data is also not available
                message = "Something went wrong.";
                setShowModal(true);
                // setModalMessage(message);
              }
              setShowModal(true);
              setModalMessage(message);
              break;
            case 401:
              message =
                error.response.data && error.response.data.detail
                  ? error.response.data.detail
                  : "Unauthorized.";
              setShowModal(true);
              setModalMessage(message);
              break;
            case 403:
              message =
                error.response.data && error.response.data.detail
                  ? error.response.data.detail
                  : "No Permissions.";
              setShowModal(true);
              setModalMessage(message);
              break;
            case 500:
              message =
                error.response.data && error.response.data.detail
                  ? error.response.data.detail
                  : "An internal server error has occurred. Please try again later.";
              setShowModal(true);
              setModalMessage(message);
              break;
            default:
              message = "Something went wrong.";
              setShowModal(true);
              setModalMessage(message);
              break;
          }
        } else {
          setShowModal(true);
          setModalMessage("Something went wrong.");
        }
        console.error("Something went wrong!", error);
      });
    // .catch(function (error) {
    //   setLoaderSpinner(false);
    //   if (error.response && error.response.data) {
    //     setErrors(error.response.data);
    //   }
    //   toast.error("Something went wrong", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1000,
    //   });
    //   console.error("Something went wrong!", error);
    // });
  };
  const handleMetaZone = () => {
    setShowZoneModal(false);
    let reqData = {
      id: parseInt(metazoneData?.franchise),
      entity: metazoneData?.entity,
      user_id: metaZoneUserId,
      user_type: metazoneData?.user_type,
      zones: metazoneData?.zones,
    };

    adminaxios
      .post("accounts/zonalmanager/zones/assign", reqData)
      .then((res) => {
        props.onUpdate(res.data);
        setLoaderSpinner(false);
        setShowModal(true);
        setModalMessage("User was added successfully");
        resetformmanually();
      })
      .catch((error) => {
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
  const resetformmanually = () => {
    setResetfield(true);
    setFormData({
      password: "",
      password2: "",
      mobile_number: "",
      email: "",
      first_name: "",
      googleAddress: "",
      branch: "",
      street: "",
      landmark: "",
      district: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
      latitude: "",
      longitude: "",
      house_no: "",
    });
    setPasswordScrore({});
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();
    // Sailaja fixed clear previous entry in password fields by giving above line on 9th August REF US-05
  };

  const submit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      addAdmin();
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
    setPasswordScrore({});
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

  const onDrop = (pictureFiles) => {
    setimage({
      ...image,
      pictureFiles,
    });
  };

  const HideShowPassword = (tPassword) => {
    setTogglePassword(!tPassword);
  };
  // Sailaja Added landmark on requiredFields to get field validation on 17th August
  //validation
  const requiredFields = [
    "username",
    "password",
    "password2",
    "mobile_number",
    "alternate_mobile_number",
    "email",
    "first_name",
    "roles",
    "landmark",
    "house_no",
    "city",
    "district",
    "state",
    "country",
    "pincode",
    "street",
    "latitude",
    "longitude",
    "last_name",
    "user_type",
  ];
  const { validate, Error } = useFormValidation(requiredFields);

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

  const setAddressFields = (addressFound) => {
    setFormData((preState) => ({
      ...preState,
      district: addressFound.district || "",
      state: addressFound.state || "",
      pincode: addressFound.pincode || "",
      street: addressFound.street || "",
      city: addressFound.city || "",
      country: addressFound.area || "",
      landmark: addressFound.subLocality || "",
      house_no: addressFound.houseNumber || "",
      latitude: addressFound.lat,
      longitude: addressFound.lng,
    }));
    setInputs((inputs) => ({
      ...inputs,
      district: addressFound.district || "",
      state: addressFound.state || "",
      pincode: addressFound.pincode || "",
      street: addressFound.street || "",
      city: addressFound.city || "",
      country: addressFound.area || "",
      landmark: addressFound.subLocality || "",
      house_no: addressFound.houseNumber || "",
      latitude: addressFound.lat,
      longitude: addressFound.lng,
    }));
  };

  const handleLocation = useCallback(() => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      var crd = pos.coords;
      window.picker.setLocation({ lat: crd.latitude, lng: crd.longitude });
      setAddressFields(window.picker.getLocation());
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  AddressComponent.defaultProps = {
    showLatLng: true,
  };
  //end
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form id="myForm" onReset={resetForm} ref={form}>
              <Row className="form_layout">
                <Col sm="3" className="padding-10">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">User Name *</Label>
                      {/* Sailaja modified Note Msg  */}
                      <Input
                        className="form-control not-empty"
                        type="text"
                        name="username"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">{errors.username}</span>
                    {/* <ul>
                      <li
                        className="nas_field_strength"
                        style={{ marginLeft: "-3%", whiteSpace: "nowrap" }}
                      >
                        Note :{" "}
                        <b style={{ fontWeight: "bold" }}>
                          {" "}
                          Whitespaces not allowed.
                        </b>
                      </li>
                    </ul> */}
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">First Name *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="first_name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">{errors.first_name}</span>
                  </FormGroup>
                </Col>

                <Col sm="3" className="padding-10">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Last Name *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="last_name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">{errors.last_name}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Email *</Label>
                      <Input
                        className="form-control"
                        type="email"
                        name="email"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "lowercase" }}
                      />
                    </div>
                    <span className="errortext">{errors.email}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Mobile *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="mobile_number"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                    </div>
                    <span className="errortext">{errors.mobile_number}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Alternate Mobile</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="alternate_mobile_number"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                    </div>
                    <span className="errortext">
                      {errors.alternate_mobile_number}
                    </span>
                  </FormGroup>
                </Col>
              </Row>
              <Row style={{ marginTop: "2%" }}>
                <div
                  id="editmoveup"
                  style={{
                    textAlign: "left",
                    marginTop: "20px",
                    fontSize: "19px",
                    fontWeight: "600",
                    fontFamily: "Open Sans",
                    paddingLeft: "20px",
                    position: "relative",
                    top: "-25px",
                  }}
                >
                  Address
                </div>
              </Row>
              <br />
              <Row>
                <Col
                  sm="6"
                  style={{ position: "relative", left: "-5px", bottom: "-4px" }}
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className={`form-control not-empty afterfocus`}
                        id="pac-input-2"
                        // id="afterfocus"
                        type="text"
                        name="pac_input"
                        disabled={true}
                        style={{ border: "none", outline: "none" }}
                      />
                      <Label className="form_label">Google Address</Label>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">H.No </Label>
                      <Input
                        id="afterfocus"
                        style={{
                          border: "none",
                          outline: "none",
                          textTransform: "capitalize",
                          height: "37px",
                        }}
                        // draft
                        className={`form-control digits ${
                          formData && formData.house_no ? "not-empty" : ""
                        }`}
                        value={formData && formData.house_no}
                        type="text"
                        name="house_no"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">{errors.house_no}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Street /Building *</Label>
                      <Input
                        id="afterfocus"
                        style={{
                          border: "none",
                          outline: "none",
                          textTransform: "capitalize",
                          height: "37px",
                        }}
                        // draft
                        className={`form-control digits ${
                          formData && formData.street ? "not-empty" : ""
                        }`}
                        value={formData && formData.street}
                        type="text"
                        name="street"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">{errors.street}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Landmark *</Label>
                      <Input
                        id="afterfocus"
                        style={{
                          border: "none",
                          outline: "none",
                          textTransform: "capitalize",
                        }}
                        // draft
                        className={`form-control  ${
                          formData && formData.landmark ? "not-empty" : ""
                        }`}
                        value={formData && formData.landmark}
                        type="text"
                        name="landmark"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">{errors.landmark}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">City *</Label>
                      <Input
                        id="afterfocus"
                        style={{
                          border: "none",
                          outline: "none",
                          textTransform: "capitalize",
                        }}
                        className={`form-control  ${
                          formData && formData.city ? "not-empty" : ""
                        }`}
                        value={formData && formData.city}
                        type="text"
                        name="city"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">{errors.city}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Pincode *</Label>
                      <Input
                        id="afterfocus"
                        style={{ border: "none", outline: "none" }}
                        // draft
                        className={`form-control digits ${
                          formData && formData.pincode ? "not-empty" : ""
                        }`}
                        value={formData && formData.pincode}
                        type="text"
                        name="pincode"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">{errors.pincode}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">District *</Label>
                      <Input
                        id="afterfocus"
                        style={{
                          border: "none",
                          outline: "none",
                          textTransform: "capitalize",
                        }}
                        className={`form-control ${
                          formData && !formData.district ? "" : "not-empty"
                        }`}
                        type="text"
                        name="district"
                        value={formData && formData.district}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">{errors.district}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">State *</Label>
                      <Input
                        id="afterfocus"
                        style={{
                          border: "none",
                          outline: "none",
                          textTransform: "capitalize",
                        }}
                        // draft
                        className={`form-control digits ${
                          formData && formData.state ? "not-empty" : ""
                        }`}
                        value={formData && formData.state}
                        type="text"
                        name="state"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">{errors.state}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  {" "}
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Country *</Label>
                      <Input
                        id="afterfocus"
                        style={{
                          border: "none",
                          outline: "none",
                          textTransform: "capitalize",
                        }}
                        // draft
                        className={`form-control digits ${
                          formData && formData.country ? "not-empty" : ""
                        }`}
                        value={formData && formData.country}
                        type="text"
                        name="country"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>
                    <span className="errortext">{errors.country}</span>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Latitude *</Label>
                      <Input
                        id="afterfocus"
                        style={{ border: "none", outline: "none" }}
                        // draft
                        className={`form-control digits ${
                          formData && formData.latitude
                            ? "not-empty"
                            : "not-empty"
                        }`}
                        value={formData && formData.latitude}
                        type="text"
                        name="latitude"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>

                    <span className="errortext">{errors.latitude}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Longitude *</Label>
                      <Input
                        id="afterfocus"
                        style={{ border: "none", outline: "none" }}
                        // draft
                        className={`form-control digits ${
                          formData && formData.longitude
                            ? "not-empty"
                            : "not-empty"
                        }`}
                        value={formData && formData.longitude}
                        type="text"
                        name="longitude"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        disabled={props.isDisabled}
                      />
                    </div>

                    <span className="errortext">{errors.longitude}</span>
                  </FormGroup>
                </Col>
                {/* api adddress component */}
                {/* <AddressComponent
                  handleInputChange={handleInputChange}
                  checkEmptyValue={checkEmptyValue}
                  errors={errors}
                  setFormData={setFormData}
                  formData={formData}
                  setInputs={setInputs}
                  resetStatus={resetStatus}
                  setResetStatus={setResetStatus}
                  setIsDirtyFun={props.setIsDirtyFun}
                /> */}
              </Row>

              <Row style={{ marginTop: "-29px" }}>
                <Col sm="6">
                  <span className="form_heading">Create Password</span>
                </Col>
                <Col sm="6">
                  <span className="form_heading">Configuration</span>
                </Col>
              </Row>
              <br />
              <Row>
                <Col sm="3" className="padding-10">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Password *</Label>
                      <Input
                        className="form-control not-empty"
                        type={togglePassword ? "text" : "password"}
                        name="password"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />

                      <div
                        className="show-hide"
                        style={{ top: "50px" }}
                        onClick={() => HideShowPassword(togglePassword)}
                      >
                        <i
                          className={
                            togglePassword ? "fa fa-eye" : "fa fa-eye-slash"
                          }
                        ></i>
                      </div>
                    </div>
                    {getPasswordStatus(
                      passwordScore ? passwordScore.password : null
                    )}
                    <br />
                    <span className="errortext password-error">
                      {errors.password}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3" className="padding-10">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label
                        className="kyc_label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Re-Enter Password *
                      </Label>
                      <Input
                        className="form-control"
                        type={reenterToggle ? "text" : "password"}
                        name="password2"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />

                      <div
                        className="show-hide"
                        style={{ top: "50px" }}
                        onClick={() => setReenterToggle(!reenterToggle)}
                      >
                        <i
                          className={
                            reenterToggle ? "fa fa-eye" : "fa fa-eye-slash"
                          }
                        ></i>
                      </div>
                    </div>
                    {getPasswordStatus(
                      passwordScore ? passwordScore.password2 : null
                    )}
                    <br />
                    <span className="errortext password-error">
                      {errors.password2}
                    </span>
                  </FormGroup>
                </Col>

                {/* <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="branch"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        onChange={handleInputChange}
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
                    <span className="errortext">
                            {errors.branch && "Select branch"}
                          </span>
                  </FormGroup>
                </Col> */}

                <Col sm="3" className="padding-10">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Role *</Label>

                      <Input
                        type="select"
                        name="roles"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option>Select Below</option>
                        {roles.map((typeofrole) => (
                          <option key={typeofrole.id} value={typeofrole.id}>
                            {typeofrole.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    {/* <span className="errortext">{errors.roles}</span> */}
                    <span className="errortext">
                      {errors.roles && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>

                <Col sm="3" className="padding-10">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">User Type *</Label>
                      <Input
                        type="select"
                        name="user_type"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option>Select Below</option>

                        {usertype.map((typeofuser) => (
                          <option key={typeofuser.id} value={typeofuser.id}>
                            {typeofuser.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    {/* <span className="errortext">{errors.user_type}</span> */}
                    <span className="errortext">
                      {errors.user_type && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                {/* entity field */}
                <Col
                  id="moveup"
                  sm="3"
                  className="padding-10"
                  hidden={
                    inputs.user_type != "STAFF" &&
                    inputs.user_type != "HPDSK" &&
                    inputs.user_type != "ZNMR"
                  }
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Entity *</Label>
                      <Input
                        type="select"
                        name="entity"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        {/* Sailaja Interchange Options in the Administration -> Users ->Entity * Dropdown data as alphabetical order on 29th March 2023 */}
                        <option style={{ display: "none" }}></option>
                        <option value="BR">Branch</option>
                        <option value="FR">Franchise</option>
                      </Input>
                    </div>
                    <span className="errortext">{errors.user_type}</span>
                  </FormGroup>
                </Col>
                {/* end */}
                {/* franchise  */}

                <Col
                  sm="3"
                  className="padding-10"
                  id="moveup"
                  hidden={inputs.entity != "FR" || inputs.user_type != "ZNMR"}
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Franchise *</Label>
                      <Input
                        type="select"
                        name="franchise"
                        className="form-control digits"
                        onChange={handleInputChange}
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
                  className="padding-10"
                  id="moveup"
                  hidden={inputs.entity != "FR" || inputs.user_type != "STAFF"}
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Franchise *</Label>
                      <Input
                        type="select"
                        name="franchise"
                        className="form-control digits"
                        onChange={handleInputChange}
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
                  className="padding-10"
                  id="moveup"
                  hidden={inputs.entity != "FR" || inputs.user_type != "HPDSK"}
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Franchise *</Label>
                      <Input
                        type="select"
                        name="franchise"
                        className="form-control digits"
                        onChange={handleInputChange}
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
                  className="padding-10"
                  id="moveup"
                  hidden={inputs.entity != "BR" || inputs.user_type != "ZNMR"}
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Branch *</Label>
                      <Input
                        type="select"
                        name="branch"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {branchlist.map((listofbranches) => (
                          <option
                            key={listofbranches.id}
                            value={listofbranches.id}
                          >
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
                  className="padding-10"
                  id="moveup"
                  hidden={inputs.entity != "BR" || inputs.user_type != "STAFF"}
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Branch *</Label>
                      <Input
                        type="select"
                        name="branch"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {branchlist.map((listofbranches) => (
                          <option
                            key={listofbranches.id}
                            value={listofbranches.id}
                          >
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
                  className="padding-10"
                  id="moveup"
                  hidden={inputs.entity != "BR" || inputs.user_type != "HPDSK"}
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Branch *</Label>
                      <Input
                        type="select"
                        name="branch"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {branchlist.map((listofbranches) => (
                          <option
                            key={listofbranches.id}
                            value={listofbranches.id}
                          >
                            {listofbranches.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">{errors.user_type}</span>
                  </FormGroup>
                </Col>
                {/* <Col
                  sm="3"
                  className="padding-10"
                  id="moveup"
                  hidden={inputs.entity != "BR"}
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Branch *</Label>
                      <Input
                        type="select"
                        name="branch"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {branchlist.map((listofbranches) => (
                          <option
                            key={listofbranches.id}
                            value={listofbranches.id}
                          >
                            {listofbranches.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">{errors.user_type}</span>
                  </FormGroup>
                </Col> */}
                <Col
                  sm="3"
                  className="padding-10"
                  id="moveup"
                  hidden={
                    (inputs.entity != "FR" && inputs.entity != "BR") ||
                    inputs.entity != "ZNMR"
                  }
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Zone *</Label>
                      <Input
                        type="select"
                        name="zone"
                        className="form-control digits"
                        onChange={handleInputChange}
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
                  className="padding-10"
                  id="moveup"
                  hidden={
                    (inputs.entity != "FR" && inputs.entity != "BR") ||
                    inputs.user_type != "ZNMR"
                  }
                >
                  <Label className="kyc_label">Zones *</Label>
                  <FormGroup>
                    <AdminMultiselect
                      data={zonelist}
                      setValues={setSelectedCategories}
                    />
                  </FormGroup>
                </Col>
                <Col
                  sm="3"
                  className="padding-10"
                  id="moveup"
                  hidden={
                    (inputs.entity != "FR" && inputs.entity != "BR") ||
                    (inputs.user_type != "STAFF" && inputs.user_type != "HPDSK")
                  }
                >
                  <FormGroup>
                    <Label className="kyc_label">Zone & Area *</Label>
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
                {/*New Area field*/}
                {/* <Col sm="3" style={{marginTop:"-20px"}}
                     hidden={inputs.entity != "FR" && inputs.entity != "BR" || inputs.user_type != 'STAFF'}
                 >
                      <Label className="kyc_label">Area *</Label>
                  <FormGroup>
                    {console.log(arealist,"arealist")}
                     <AdminMultiselect
                      data={arealist}
                      setValues={setSelectedCategories}
                    />
                  </FormGroup>
                </Col> */}
                {/* end */}
              </Row>
              <br />
              <div
                className="password-notes"
                style={{ position: "relative", top: "-55px" }}
              >
                <div className="pass_notes">Notes :</div>
                <ul>
                  <li>
                    <b>Password must be strong</b>
                  </li>
                  <li>At least 8 characters—the more characters, the better</li>
                  <li>A mixture of both uppercase and lowercase letters</li>
                  <li>A mixture of letters and numbers</li>
                  <li>Whitespaces not allowed</li>
                  <li>
                    Inclusion of at least one special character, e.g., ! @ # ? ]
                  </li>
                </ul>
              </div>
              <br />
              <Row style={{ marginTop: "-35px" }}>
                <span
                  className="sidepanel_border"
                  style={{ position: "relative", top: "-12px" }}
                ></span>
                <Col id="moveup">
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="button"
                      className="mr-3"
                      id="create_button"
                      onClick={submit}
                      disabled={
                        loaderSpinneer
                          ? loaderSpinneer
                          : !passwordScore ||
                            !passwordScore.password ||
                            (passwordScore &&
                              passwordScore.password &&
                              passwordScore.password.id != 3) ||
                            !passwordScore.password2 ||
                            (passwordScore &&
                              passwordScore.password2 &&
                              passwordScore.password2.id != 3)
                      }
                    >
                      {loaderSpinneer ? (
                        <Spinner size="sm" id="spinner"></Spinner>
                      ) : null}
                      {Add}
                    </Button>
                    <Button
                      type="reset"
                      color="btn btn-primary"
                      id="resetid"
                      onClick={resetformmanually}
                    >
                      Reset
                    </Button>
                  </FormGroup>
                </Col>

                {/* <Col sm="4">
                  <Card>
                    <CardHeader></CardHeader>
                    <CardBody>
                      <ImageUploader
                        withIcon={false}
                        withPreview={true}
                        label=""
                        singleImage={true}
                        buttonText="Upload Images"
                        onChange={onDrop}
                        imgExtension={[
                          ".jpg",
                          ".gif",
                          ".png",
                          ".gif",
                          ".svg",
                          "jpeg",
                        ]}
                        maxFileSize={1048576}
                        fileSizeError=" file size is too big"
                      />
                    </CardBody>
                  </Card>
                </Col> */}
              </Row>
            </Form>
          </Col>
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
            iscontinue={handleMetaZone}
          />
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddadminUser;
