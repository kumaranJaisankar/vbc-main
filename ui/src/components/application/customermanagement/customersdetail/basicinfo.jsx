import React, { useState, useEffect } from "react";
import { Row, Col, Form, Label, FormGroup, Spinner, Modal, ModalBody, ModalFooter } from "reactstrap";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { customeraxios, networkaxios, adminaxios, billingaxios} from "../../../../axios";
import { toast } from "react-toastify";
import { Tooltip } from "antd";
import { pick } from "lodash";
// import Changepassword from "./changepassword"
import { isEmpty } from "lodash";
import MaskedInput from "react-text-mask";
import AddressValidation from "../../../customhooks/addressValidation";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { Sorting } from "../../../common/Sorting";


const BasicInfo = (props) => {
  const [basicInfo, setBasicInfo] = useState({});
  const [basicInfodata, setBasicInfodata] = useState();
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState([]);

  // pool list
  const [ipPool, setIpPool] = useState([]);
  // staticip
  const [staticIP, setStaticIP] = useState([]);
  const [staticIPCost, setStaticIPCost] = useState({});
  const [disable, setDisable] = useState(false);
  const [reset, setReset] = useState();
  // priorcheck 
  const [balance, setBalance] = useState(false)
  // sms toggle
  const [smsToggle, setSmsToggle] = useState("off");
  const [istelShow, setTelIsShow] = React.useState(false);
  function SMSToggle() {
    setSmsToggle(smsToggle === "off" ? "on" : "off");
    setTelIsShow(!istelShow);
  }
  // exits sms
  const [showPaymentType, setShowPaymentType] = useState(false);

  const [smsToggle1, setSmsToggle1] = useState("on");
  const [istelShow1, setTelIsShow1] = React.useState(true);
  function SMSToggle1() {
    setSmsToggle1(smsToggle1 === "on" ? "off" : "on");
    setTelIsShow1(!istelShow1);
  }


  // email toggle
  const [emailToggle, setEmailToggle] = useState('off');
  const [isShow, setIsshow] = React.useState(false);
  function EmailToggle() {
    setEmailToggle(emailToggle === "off" ? "on" : "off");
    setIsshow(!isShow)
  }
  // esits email
  const [emailToggle1, setEmailToggle1] = useState('on');
  const [isShow1, setIsshow1] = React.useState(true);
  function EmailToggle1() {
    setEmailToggle1(emailToggle1 === "on" ? "off" : "on");
    setIsshow1(!isShow1)
  }

  const [whatsappToggle, setWhatsappToggle] = useState("off");
  const [iswhatsShow, setWhatsIsShow] = React.useState(false);
  function WHATSAPPToggle() {
    setWhatsappToggle(whatsappToggle === "off" ? "on" : "off");
    setWhatsIsShow(!iswhatsShow);
  }

  const [whatsappToggle1, setWhatsappToggle1] = useState("on");
  const [iswhatsShow1, setWhatsIsShow1] = React.useState(true);
  function WHATSAPPToggle1() {
    setWhatsappToggle1(whatsappToggle1 === "on" ? "off" : "on");
    setWhatsIsShow1(!iswhatsShow1);
  }
  const checkBalance = () => setBalance(!balance)
  useEffect(() => {
    customeraxios
      .get(`customers/v3/list/basicinfo/${props?.basicinfo?.user?.id}`)
      .then((res) => {
        setBasicInfo(res.data);
        setBasicInfodata(res.data);
        setReset(res.data.radius_info.mac_bind);
      });
  }, [props]);
  const handleChange = (e) => {
    if (
      e.target.name == "street" ||
      e.target.name == "city" ||
      e.target.name == "landmark" ||
      e.target.name == "country" ||
      e.target.name == "pincode" ||
      e.target.name == "district" ||
      e.target.name == "state" ||
      e.target.name == "house_no" ||
      e.target.name == "installation_charges" ||
      e.target.name == "security_deposit" ||
      e.target.name == "GSTIN" ||
      e.target.name == "static_ip_bind" ||
      e.target.name == "static_ip_cost" ||
      e.target.name == "mac_bind" ||
      e.target.name == "ippool_id"
      // e.target.name == "email_flag"
    ) {
      let address1 = {
        ...basicInfo.address,
        [e.target.name]: e.target.value,
      };
      // let address2 = {
      //   ...basicInfo.permanent_address,
      //   [e.target.name]: e.target.value
      // }

      let useradvance = {
        ...basicInfo.user_advance_info,
        [e.target.name]: e.target.value,
      };
      let radiusinfo = {
        ...basicInfo.radius_info,
        [e.target.name]: e.target.value,
      };
      setBasicInfo({
        ...basicInfo,
        address: address1,
        user_advance_info: useradvance,
        radius_info: radiusinfo,
        // permanent_address: address2,
      });
    } else {
      setBasicInfo((prev) => ({
        ...prev,
        [e.target.name]:
          // e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
          e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),

      }));
    }
    if (e.target.name == "static_ip_bind" && e.target.value.includes("_")) {
      setErrors((prevState) => {
        return {
          ...prevState,
          static_ip_bind: "please enter valid static ip ",
        };
      });
    } else {
      setErrors((prevState) => {
        return {
          ...prevState,
          static_ip_bind: "",
        };
      });
    }

    if (e.target.name == "installation_charges" || e.target.name == "security_deposit") {
      setShowPaymentType(true);
  }
    // if (e.target.name == "ippool_id") {
    //   getStaticIP(e.target.value);
    // }
  };

  // useEffect(() => {
  //   const data = pick(props.basicinfo, [
  //     "address",
  //     "first_name",
  //     "last_name",
  //     "register_mobile",
  //     "alternate_mobile",
  //     "registered_email","user_advance_info"
  //   ]);
  //   setBasicInfo(data)
  // },[props.basicinfo])

  console.log(props?.basicinfo, "props?.basicinfo")

  const basicDetails1 = () => {
    const obj = {
      area: props?.basicinfo?.area?.id,
      ippool: Number(basicInfo.radius_info?.ippool_id),
      plans: props?.basicinfo?.service_plan?.id,
    };
    adminaxios.post(`wallet/priorcheck`, obj).then((res) => {
      if (res.data.check == true) {
        basicDetails()
      }
      if (res.data.check == false) {
        checkBalance()
      }
    }).catch((errors) => {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    })
  }


  const basicDetails = (e) => {
    // e.preventDefault();
    const submitdata = {
      ...pick(basicInfo, [
        "address",
        "offline_payment_mode",
        "first_name",
        "last_name",
        "register_mobile",
        "alternate_mobile",
        "registered_email",
        "user_advance_info",
        "radius_info",
        "stb_serial_no",
        "extension_no",
        // "permanent_address",
        // "email_flag",
        // "sms_flag"
      ]),
    };

    submitdata.user_advance_info.installation_charges = !isEmpty(
      basicInfo &&
      basicInfo.user_advance_info &&
      basicInfo.user_advance_info.installation_charges
    )
      ? basicInfo &&
      basicInfo.user_advance_info &&
      basicInfo.user_advance_info.installation_charges
      : "0.00";
    submitdata.user_advance_info.security_deposit = !isEmpty(
      basicInfo &&
      basicInfo.user_advance_info &&
      basicInfo.user_advance_info.security_deposit
    )
      ? basicInfo &&
      basicInfo.user_advance_info &&
      basicInfo.user_advance_info.security_deposit
      : "0.00";
    submitdata.address.house_no = !isEmpty(
      basicInfo && basicInfo.address && basicInfo.address.house_no
    )
      ? basicInfo && basicInfo.address && basicInfo.address.house_no
      : "N/A";
    // submitdata.permanent_address.house_no = !isEmpty(
    //   basicInfo && basicInfo.permanent_address && basicInfo.permanent_address.house_no
    // )
    //   ? basicInfo && basicInfo.permanent_address && basicInfo.permanent_address.house_no
    //   : "N/A";
    submitdata.address.landmark = !isEmpty(
      basicInfo && basicInfo.address && basicInfo.address.landmark
    )
      ? basicInfo && basicInfo.address && basicInfo.address.landmark
      : "N/A";

    // submitdata.permanent_address.landmark = !isEmpty(
    //   basicInfo && basicInfo.permanent_address && basicInfo.permanent_address.landmark
    // )
    //   ? basicInfo && basicInfo.permanent_address && basicInfo.permanent_address.landmark
    //   : "N/A";
    submitdata.radius_info.static_ip_cost =
      basicInfo &&
      basicInfo.radius_info &&
      basicInfo.radius_info.static_ip_cost
    // staticIPCost?.cost_per_ip;
    submitdata.last_name = !isEmpty(basicInfo && basicInfo.last_name)
      ? basicInfo && basicInfo.last_name
      : "N/A";


    submitdata.user_advance_info.GSTIN = submitdata.user_advance_info.GSTIN ? submitdata.user_advance_info.GSTIN : null;

    delete submitdata.permanent_address;
    delete submitdata.user_advance_info.static_ip_bind;
    delete submitdata.user_advance_info.static_ip_cost;
    delete submitdata.user_advance_info.ippool;
    // delete submitdata.radius_info;

    // delete submitdata.radius_info.static_ip_bind;
    // delete submitdata.radius_info.ippool_id;
    // delete submitdata.radius_info.static_ip_cost;
    // delete submitdata.radius_info.id;

    delete submitdata.radius_info.ippool;
    delete submitdata.radius_info.GSTIN;
    delete submitdata?.permanent_address?.static_ip_bind;
    delete submitdata?.address?.static_ip_bind;

    submitdata.radius_info.ippool_id =
      typeof basicInfo.radius_info.ippool_id == "object"
        ? Number(basicInfo.radius_info.ippool_id?.id)
        : basicInfo.radius_info.ippool_id;

    submitdata.email_flag = basicInfo?.email_flag ? isShow1 : isShow;
    submitdata.sms_flag = basicInfo?.sms_flag ? istelShow1 : istelShow;
    submitdata.whatsapp_flag = basicInfo?.whatsapp_flag ? iswhatsShow1 : iswhatsShow;
    // submitdata.radius_info.ippool = basicInfo.radius_info.ippool?.id
    setDisable(true);
    customeraxios
      .patch("customers/enh/rud/" + props.basicinfo.id, submitdata)
      .then((res) => {
        props.onUpdate(submitdata);
        setDisable(false);
        toast.success("Customer Information edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.setIsdisabled(true);
        // customeraxios.get(`customers/last/invoice/info/${props.basicinfo.user}`)
        // if(basicInfo &&
        //   basicInfo.radius_info &&
        //   basicInfo.radius_info.static_ip_cost != 0){
        //     window.location.reload(false);
        //   }
      })
      .catch(function (error) {
        setDisable(false);
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
          toast.error(error.response && error.response.data.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is500Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is404Error) {
          toast.error("API mismatch", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      });
  };


  // show password for superadmin only
  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let showPassword = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Super Admin") ||
    (tokenInfo && tokenInfo.user_type === "Admin") ||
    (tokenInfo && tokenInfo.user_type === "Franchise Owner")
  ) {
    showPassword = true;
  }

  const ipAddress = {
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

  // validations

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;

    const validationErrors = validate(basicInfo);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      basicDetails(id);

    } else {
      console.log("errors try again", validationErrors);
    }

  };


  const handleSubmit1 = (e, id) => {
    e.preventDefault();
    e = e.target.name;

    const validationErrors = validate(basicInfo);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      basicDetails1(id);

    } else {
      console.log("errors try again", validationErrors);
    }

  };

  const requiredFields = [
    "static_ip_bind",
    "first_name",
    "register_mobile",
    "house_no",
    "last_name",
    "district",
    "city",
    "country",
    "landmark",
    "street",
    "state",
    "pincode",
    "registered_email",
    "alternate_mobile",
    // "offline_payment_mode",
  ];
  const { validate, Error } = AddressValidation(requiredFields);

  // pool list
  // useEffect(() => {
  //   networkaxios
  //     .get(
  //       `network/ippool/${props?.basicinfo?.area?.id
  //       }/get`
  //     )
  //     .then((res) => {
  //       setIpPool([...res.data]);
  //     });


  // }, []);

  // static ip
  // const  = (val) => {
  //   networkaxios.get(`network/ippool/used_ips/${val}`).then((res) => {
  //     let { available_ips } = res.data;
  //     setStaticIP([...available_ips]);
  //     setStaticIPCost(res.data)
  //   });
  // };

  // useEffect(() => {
  //   if (basicInfo?.radius_info?.static_ip_bind) {
  //     networkaxios.get(`network/ippool/used_ips/${props.basicinfo?.radius_info?.ippool?.id}`).then((res) => {
  //       let { available_ips } = res.data;
  //       setStaticIP([...available_ips]);
  //       setStaticIPCost(res.data)
  //     })
  //   }
  // }, [])


  const strAscending = [...staticIP]?.sort((a, b) =>
    a.ip > b.ip ? 1 : -1,
  );

  {
    /*MAC ID code*/
  }
  var macAddress = document.getElementById("macAddress");

  function formatMAC(e) {
    var r = /([a-f0-9]{2})/i;
    var str = e.target.value.replace(/[^a-f0-9:]/ig, "");
    if (e.keyCode != 8 && r.test(str.slice(-2))) {
      str = str.concat(':')
    }
    e.target.value = str.slice(0, 17);
  }
  macAddress && macAddress.addEventListener("keyup", formatMAC, false);

  const resetHandler = (e) => {
    setBasicInfo({
      ...basicInfo,
      radius_info: "",
    });
    document.getElementById("resetid").click();

    document.getElementById("macAddress").reset();
  };

  // use effect for payment
  useEffect(() => {
    billingaxios
      .get(`payment/options`)
      .then((res) => {
        let { offline_payment_modes } = res.data;
        setPayment([...offline_payment_modes]);
        // Sailaja sorting the Finance-> Billing History -> Offline Payment Type Dropdown data as alphabetical order on 28th March 2023
        setPayment(Sorting([...offline_payment_modes], "name"));
        // setReportstatus([...status]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);

  return (
    <>
      {basicInfo && (
        <Form onSubmit={basicInfodata?.radius_info?.ippool ? handleSubmit : (basicInfo?.radius_info?.ippool_id ? handleSubmit1 : handleSubmit)}>
          <Row>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip title={basicInfo.first_name}>
                    <Label className="kyc_labellabel">First Name *</Label>

                    <input
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="text"
                      name="first_name"
                      style={{
                        border: "none",
                        outline: "none",
                        textTransform: "capitalize",
                      }}
                      value={basicInfo.first_name}
                      onChange={handleChange}
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                    ></input>
                    <span className="errortext">{errors.first_name}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip title={basicInfo.last_name}>
                    <Label className="kyc_labellabel">Last Name </Label>

                    <input
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="text"
                      name="last_name"
                      style={{
                        border: "none",
                        outline: "none",
                        textTransform: "capitalize",
                      }}
                      value={basicInfo.last_name}
                      onChange={handleChange}
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                    ></input>
                    <span className="errortext">{errors.last_name}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip title={basicInfo.register_mobile}>
                    <Label className="kyc_labellabel">Mobile *</Label>

                    <input
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      // onBlur={blur}
                      // disabled={props.isDisabled}
                      type="text"
                      name="register_mobile"
                      style={{ border: "none" }}
                      value={basicInfo.register_mobile}
                      onChange={handleChange}
                    ></input>
                    <span className="errortext">{errors.register_mobile}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip title={basicInfo.alternate_mobile}>
                    <Label className="kyc_labellabel">Alternate Mobile</Label>

                    <input
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      // onBlur={blur}
                      // disabled={props.isDisabled}
                      type="text"
                      name="alternate_mobile"
                      style={{ border: "none" }}
                      value={basicInfo.alternate_mobile}
                      onChange={handleChange}
                    ></input>
                  </Tooltip>
                </div>
                <span className="errortext">{errors.alternate_mobile}</span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip title={basicInfo.registered_email}>
                    <Label className="kyc_labellabel">Email *</Label>

                    <input
                      className={`form-control digits not-empty`}
                      type="email"
                      name="registered_email"
                      style={{ border: "none", outline: "none", }}
                      value={basicInfo.registered_email?.toLowerCase()}
                      onChange={handleChange}
                      id="afterfocus"
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                    ></input>
                    <span className="errortext">{errors.registered_email}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.address &&
                        basicInfo.address.house_no
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">H.No</Label>

                    <input
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="text"
                      name="house_no"
                      style={{
                        border: "none",
                        outline: "none",
                      }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.address &&
                          basicInfo.address.house_no
                          : ""
                      }
                      onChange={handleChange}
                    ></input>
                    <span className="errortext">{errors.house_no}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.address &&
                        basicInfo.address.street
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">Street *</Label>

                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="street"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.address &&
                          basicInfo.address.street
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">{errors.street}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.address &&
                        basicInfo.address.landmark
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">Landmark </Label>

                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="landmark"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.address &&
                          basicInfo.address.landmark
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">{errors.landmark}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.address &&
                        basicInfo.address.city
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">City *</Label>

                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="city"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.address &&
                          basicInfo.address.city
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">{errors.city}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.address &&
                        basicInfo.address.district
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">District *</Label>

                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="district"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.address &&
                          basicInfo.address.district
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">{errors.district}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.address &&
                        basicInfo.address.state
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">State *</Label>

                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="state"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.address &&
                          basicInfo.address.state
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">{errors.state}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.address &&
                        basicInfo.address.pincode
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">Pincode *</Label>

                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="pincode"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.address &&
                          basicInfo.address.pincode
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                    ></input>
                    <span className="errortext">{errors.pincode}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.address &&
                        basicInfo.address.country
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">Country *</Label>

                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="country"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.address &&
                          basicInfo.address.country
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                    ></input>
                    <span className="errortext">{errors.country}</span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.user_advance_info &&
                        basicInfo.user_advance_info.installation_charges
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">
                      Installation Charges *
                    </Label>
                    <input
                      className={`form-control digits not-empty`}
                      type="number"
                      min="0"
                      onKeyDown={(evt) =>
                        (evt.key === "e" ||
                          evt.key === "E" ||
                          evt.key === "." ||
                          evt.key === "-") &&
                        evt.preventDefault()
                      }
                      name="installation_charges"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.user_advance_info &&
                          basicInfo.user_advance_info.installation_charges
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                    ></input>
                  </Tooltip>
                </div>
              </FormGroup>
              </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.user_advance_info &&
                        basicInfo.user_advance_info.security_deposit
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">Security Deposit *</Label>
                    <input
                      className={`form-control digits not-empty`}
                      type="number"
                      name="security_deposit"
                      min="0"
                      onKeyDown={(evt) =>
                        (evt.key === "e" ||
                          evt.key === "E" ||
                          evt.key === "." ||
                          evt.key === "-") &&
                        evt.preventDefault()
                      }
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.user_advance_info &&
                          basicInfo.user_advance_info.security_deposit
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                    ></input>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
            {/* <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Security Payment Type</Label>
                  <select
                    // className={`form-control ${props?.customerInfo && props?.customerInfo.radius_info?.ippool
                    //   ? "not-empty"
                    //   : "not-empty"
                    //   }`}
                    className="form-control digits not-empty"
                    style={{ border: "none", outline: "none" }}
                    id="afterfocus"
                    type="select"
                    name="offline_payment_mode"
                    // value={exitStaticip?.ippool || props?.customerInfo?.radius_info?.ippool?.id}
                    value={
                      basicInfo.offline_payment_mode
                    }
                    onChange={handleChange}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL3">All</option>
                    {payment.map((paymentreport) => (
                      <option key={paymentreport.id} value={paymentreport.id}>
                        {paymentreport.name}
                      </option>
                    ))}
                  </select>
                </div>
              </FormGroup>
            </Col> */}
            {showPaymentType && (
    <Col sm="3" id="moveup">
        <FormGroup>
            <div className="input_wrap">
                <Label className="kyc_label">Security Payment Type</Label>
                <select
                    className="form-control digits not-empty"
                    style={{ border: "none", outline: "none" }}
                    id="afterfocus"
                    type="select"
                    name="offline_payment_mode"
                    value={basicInfo.offline_payment_mode}
                    onChange={handleChange}
                >
                    <option style={{ display: "none" }}></option>
                    {/* <option value="ALL3">All</option> */}
                    {payment.map((paymentreport) => (
                        <option key={paymentreport.id} value={paymentreport.id}>
                            {paymentreport.name}
                        </option>
                    ))}
                </select>
            </div>
        </FormGroup>
    </Col>
)}

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.user_advance_info &&
                        basicInfo.user_advance_info.GSTIN
                        : ""
                    }
                  >
                    <Label className="kyc_labellabel">GSTIN</Label>

                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="GSTIN"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.user_advance_info &&
                          basicInfo.user_advance_info.GSTIN
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                    ></input>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>

            {/* IPpool */}

            {/* {basicInfodata &&
              basicInfodata.radius_info &&
              basicInfodata.radius_info?.static_ip_bind ? ( */}
{/* 
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_labellabel">IP Pool</Label>

                  <select
                    className={`form-control ${basicInfo && basicInfo.radius_info?.ippool
                      ? "not-empty"
                      : "not-empty"
                      }`}
                    id="afterfocus"
                    type="select"
                    name="ippool"
                    style={{ border: "none", outline: "none" }}
                    value={
                      basicInfo &&
                      basicInfo.radius_info &&
                      basicInfo.radius_info.ippool &&
                      basicInfo.radius_info.ippool.id
                    }
                    onChange={handleChange}
                    // disabled={true}
                  >
                    <option value="" style={{ display: "none" }}></option>
                    {ipPool.map((staticip) => {
                      if (!!staticip) {
                        return (
                          <option
                            key={staticip.id}
                            value={staticip.id}
                            selected={
                              staticip.id == basicInfo &&
                                basicInfo.radius_info &&
                                basicInfo.radius_info.ippool &&
                                basicInfo.radius_info.ippool.id
                                ? "selected"
                                : ""
                            }
                          >
                            {staticip.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>
              </FormGroup>
            </Col> */}
            {/* ) : ( */}
            {/* <Col sm="3" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_labellabel">IP Pool234</Label>

                    <select
                      className={`form-control ${basicInfo && basicInfo.radius_info?.ippool_id
                        ? "not-empty"
                        : "not-empty"
                      }`}
                    id="afterfocus"
                    type="select"
                    name="ippool_id"
                    style={{ border: "none", outline: "none" }}
                    value={
                      basicInfo &&
                      basicInfo.radius_info &&
                      basicInfo.radius_info.ippool_id &&
                      basicInfo.radius_info.ippool_id.id
                    }
                    onChange={handleChange}
                  // disabled={props.isDisabled}
                  >
                    <option value="" style={{ display: "none" }}></option>
                      {ipPool.map((staticip) => {
                        if (!!staticip) {
                          return (
                            <option
                              key={staticip.id}
                              value={staticip.id}
                              selected={
                                staticip.id == basicInfo &&
                                  basicInfo.radius_info &&
                                  basicInfo.radius_info.ippool_id &&
                                  basicInfo.radius_info.ippool_id.id
                                  ? "selected"
                                  : ""
                              }
                            >
                              {staticip.name}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </div>
                </FormGroup>
              </Col> */}
            {/* )} */}

            {/* static ip bind */}

          

            {/* <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_labellabel">Static IP</Label>

                  <MaskedInput
                    {...ipAddress}
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="static_ip_bind"
                    style={{ border: "none", outline: "none" }}
                    value={
                      basicInfo
                        ? basicInfo &&
                        basicInfo.radius_info &&
                        basicInfo.radius_info.static_ip_bind
                        : ""
                    }
                    onChange={handleChange}
                    disabled={true}
                  ></MaskedInput>
                  {errors.static_ip_bind && (
                    <span className="errortext">
                      {errors && errors.static_ip_bind != ""
                        ? errors.static_ip_bind
                        : ""}
                    </span>
                  )}
                </div>
              </FormGroup>
            </Col> */}
            {/* ) : ( */}
            {/* <Col md="3" id="moveup">
                <div className="input_wrap">
                  <Label className="kyc_labellabel">Static IP</Label>

                  <select
                    // className="form-control digits not-empty"
                    className={`form-control ${basicInfo && basicInfo.radius_info?.static_ip_bind
                        ? "not-empty"
                        : "not-empty"
                      }`}
                    id="afterfocus"
                    type="select"
                    name="static_ip_bind"
                    style={{ border: "none", outline: "none" }}
                    value={
                      basicInfo &&
                      basicInfo.radius_info &&
                      basicInfo.radius_info.static_ip_bind
                    }
                    onChange={handleChange}
                  // disabled={props.isDisabled}
                  >
                    <option value="" style={{ display: "none" }}></option>
                    {strAscending.map((staticip) => {
                      if (!!staticip) {
                        return (
                          <option
                            key={staticip.ip}
                            value={staticip.ip}
                            selected={
                              staticip.ip ==
                                basicInfo.radius_info?.static_ip_bind
                                ? "selected"
                                : ""
                            }
                          >
                            {staticip.ip}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>
              </Col> */}
            {/* )} */}
            {/* static ip cose */}

            {/* {basicInfodata &&
              basicInfodata.radius_info &&
              basicInfodata.radius_info.static_ip_cost ? (
              <Col md="3" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_labellabel">Static IP Cost Per Month</Label>
                    <input
                      className={`form-control digits not-empty`}
                      type="number"
                      min="0"
                      onKeyDown={(evt) =>
                        evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-"
                      }
                      name="static_ip_cost"
                      style={{ border: "none", outline: "none" }}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.radius_info &&
                          basicInfo.radius_info.static_ip_cost
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                      // onBlur={blur}
                      disabled={true}
                    ></input>
                  </div>
                </FormGroup>
              </Col>
            ) : (
              <Col md="3" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip
                      title={
                        basicInfo
                          ? basicInfo &&
                            basicInfo.radius_info &&
                            basicInfo.radius_info.static_ip_cost
                          : ""
                      }
                    >
                      <Label className="kyc_labellabel">Static IP Cost </Label>
                      <input
                        className={`form-control digits not-empty`}
                        type="number"
                        min="0"
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-") &&
                          evt.preventDefault()
                        }
                        name="static_ip_cost"
                        style={{ border: "none", outline: "none" }}
                        value={
                          basicInfo
                            ? basicInfo &&
                              basicInfo.radius_info &&
                              basicInfo.radius_info.static_ip_cost
                            : ""
                        }
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        // disabled={props.isDisabled}
                      ></input>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip
                      title={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.radius_info &&
                          basicInfo.radius_info.static_ip_cost
                          : ""
                      }
                    >
                      <Label className="kyc_labellabel">Static IP Cost </Label>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="static_ip_cost"
                        value={staticIPCost?.cost_per_ip}
                       
                        id="afterfocus"
                        disabled={true}
                      ></input>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
            )} */}

            {/* <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                          basicInfo.radius_info &&
                          basicInfo.radius_info.static_ip_cost
                        : ""
                    }
                  >
                    <input
                      className={`form-control digits not-empty`}
                      type="number"
                      name="static_ip_cost"
                      disabled={props.isDisabled}
                      style={{ border: "none", outline: "none" }}
                      id="afterfocus"
                      //  onBlur={blur}
                      min="0"
                      onKeyDown={(evt) =>
                        (evt.key === "e" ||
                          evt.key === "E" ||
                          evt.key === "." ||
                          evt.key === "-") &&
                        evt.preventDefault()
                      }
                      onChange={handleChange}
                      value={
                        basicInfo
                          ? basicInfo &&
                            basicInfo.radius_info &&
                            basicInfo.radius_info.static_ip_cost
                          : ""
                      }
                    />
                    <Label className="kyc_labellabel">Serial No</Label>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col> */}

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_labellabel">Setup Box Number</Label>

                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="stb_serial_no"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={basicInfo.stb_serial_no}
                    onChange={handleChange}
                  // disabled={props.isDisabled}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_labellabel">Extension Number</Label>

                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="extension_no"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={basicInfo.extension_no}
                    onChange={handleChange}
                  // disabled={props.isDisabled}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            {/*MAC ID Field*/}
            <Col md="3" id="moveup">
              <FormGroup>
                {/* Sailaja Changed Mac ID to MAC ID on 27th March 2023  */}
                <Label className="kyc_labellabel"> MAC ID</Label>
                <Paper component="div" className="mac_bar">
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      id="macAddress"
                      type="text"
                      name="mac_bind"
                      style={{
                        border: "none",
                        outline: "none",
                        textTransform: "capitalize",
                      }}
                      // id="afterfocus"

                      // value={
                      //     basicInfo?.radius_info?.mac_bind}
                      value={
                        basicInfo
                          ? basicInfo &&
                          basicInfo.radius_info &&
                          basicInfo.radius_info.mac_bind
                          : ""
                      }
                      // value={reset}
                      onChange={handleChange}
                    ></input>
                  </div>
                  <IconButton
                    sx={{ p: "15px" }}
                    aria-label="search"
                    type="reset"
                  >
                    <ReplayRoundedIcon onClick={resetHandler} />
                  </IconButton>
                </Paper>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col id="moveup">
              <h5>Configuration</h5>
            </Col>
          </Row>
          <Row>
            {/* email */}

            {basicInfo?.email_flag === true ? <Col sm="3">
              <Label className="kyc_label">Email</Label>
              <br />
              <div
                className={`franchise-switch ${emailToggle1}`}
                onClick={EmailToggle1}
              />
            </Col> :
              <Col sm="3">
                <Label className="kyc_label">Email</Label>
                <br />
                <div
                  className={`franchise-switch ${emailToggle}`}
                  onClick={EmailToggle}
                />
              </Col>
            }
            {/* sms */}
            {basicInfo?.sms_flag === true ?
              <Col sm="3">
                <Label className="kyc_label">SMS</Label>
                <br />
                <div
                  className={`franchise-switch ${smsToggle1}`}
                  onClick={SMSToggle1}
                />
              </Col> :

              <Col sm="3">
                <Label className="kyc_label">SMS</Label>
                <br />
                <div
                  className={`franchise-switch ${smsToggle}`}
                  onClick={SMSToggle}
                />
              </Col>}
              {basicInfo?.whatsapp_flag === true ?
              <Col sm="3">
                <Label className="kyc_label">Whatsapp</Label>
                <br />
                <div
                  className={`franchise-switch ${whatsappToggle1}`}
                  onClick={WHATSAPPToggle1}
                />
              </Col> :

              <Col sm="3">
                <Label className="kyc_label">Whatsapp</Label>
                <br />
                <div
                  className={`franchise-switch ${whatsappToggle}`}
                  onClick={WHATSAPPToggle}
                />
              </Col>}


          </Row>
          <br />
          <Stack direction="row" spacing={2}>
            {/* {basicInfo &&
            basicInfo.radius_info &&
            basicInfo.radius_info.static_ip_cost > 0 ? (
              <Button type="submit" variant="contained" onClick={refreshPage}>
                Save
              </Button>
            ) : (
              <Button type="submit" variant="contained">
                Save
              </Button>
            )} */}
            <Button
              type="submit"
              variant="contained"
              id="save_button"
              disabled={disable}
            >
              {disable ? <Spinner size="sm"> </Spinner> : null}
              Save
            </Button>
          </Stack>
        </Form>
      )}
      {/* priorcheck wallet modal for checking balance */}
      <Modal isOpen={balance} toggle={checkBalance} centered>
        <ModalBody>
          <p>{"You do not have enough balance"}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            onClick={() => {
              checkBalance()
            }}
          >
            {"Ok"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default BasicInfo;
