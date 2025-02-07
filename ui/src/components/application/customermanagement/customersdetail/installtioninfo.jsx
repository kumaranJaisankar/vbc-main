import React, { useState, useEffect } from "react";
import { Row, Col, Form, Label, FormGroup, Spinner } from "reactstrap";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  customeraxios,
  networkaxios,
  adminaxios,
  billingaxios,
} from "../../../../axios";
import { toast } from "react-toastify";
import { Tooltip } from "antd";
import { pick } from "lodash";
import { isEmpty } from "lodash";
import useFperormValidation from "../../../customhooks/permanentAddres";
import { Sorting } from "../../../common/Sorting";

const InstallationBasicinfo = (props) => {
  const [basicInfo, setBasicInfo] = useState({});
  const [basicInfodata, setBasicInfodata] = useState();
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [reset, setReset] = useState();
  const [balance, setBalance] = useState(false);
  const [payment, setPayment] = useState([]);
  const [showPaymentType, setShowPaymentType] = useState(false);

  const checkBalance = () => setBalance(!balance);
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
      e.target.name == "amount" ||
      e.target.name == "payment_type"
    ) {
      // let address1 = {
      //   ...basicInfo.address,
      //   [e.target.name]: e.target.value,
      // };
      let address2 = {
        ...basicInfo.permanent_address,
        [e.target.name]: e.target.value,
      };

      // let useradvance = {
      //   ...basicInfo.user_advance_info,
      //   [e.target.name]: e.target.value,
      // };
      // let radiusinfo = {
      //   ...basicInfo.radius_info,
      //   [e.target.name]: e.target.value,
      // };
      setBasicInfo({
        ...basicInfo,
        // address: address1,
        // user_advance_info: useradvance,
        // radius_info: radiusinfo,
        permanent_address: address2,
      });
    } else {
      setBasicInfo((prev) => ({
        ...prev,
        [e.target.name]:
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
    if (e.target.name == "amount") {
      setShowPaymentType(true);
    }
  };

  const basicDetails = (e) => {
    const submitdata = {
      ...pick(basicInfo, ["permanent_address", "radius_info"]),
    };

    // submitdata.address.house_no = !isEmpty(
    //   basicInfo && basicInfo.address && basicInfo.address.house_no
    // )
    //   ? basicInfo && basicInfo.address && basicInfo.address.house_no
    //   : "N/A";
    submitdata.permanent_address.house_no = !isEmpty(
      basicInfo &&
        basicInfo.permanent_address &&
        basicInfo.permanent_address.house_no
    )
      ? basicInfo &&
        basicInfo.permanent_address &&
        basicInfo.permanent_address.house_no
      : "N/A";
    // submitdata.address.landmark = !isEmpty(
    //   basicInfo && basicInfo.address && basicInfo.address.landmark
    // )
    //   ? basicInfo && basicInfo.address && basicInfo.address.landmark
    //   : "N/A";

    submitdata.permanent_address.landmark = !isEmpty(
      basicInfo &&
        basicInfo.permanent_address &&
        basicInfo.permanent_address.landmark
    )
      ? basicInfo &&
        basicInfo.permanent_address &&
        basicInfo.permanent_address.landmark
      : "N/A";

    // delete submitdata.radius_info;
    delete submitdata.user_advance_info;
    delete submitdata.address;
    delete submitdata?.permanent_address?.static_ip_bind;
    delete submitdata?.address?.static_ip_bind;

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

  const requiredFields = [
    "house_no",
    "district",
    "city",
    "country",
    "landmark",
    "street",
    "state",
    "pincode",
  ];
  const { validate, Error } = useFperormValidation(requiredFields);

  return (
    <>
      {basicInfo && (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col id="moveup">
              <h5>Installation Address</h5>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip
                    title={
                      basicInfo
                        ? basicInfo &&
                          basicInfo.permanent_address &&
                          basicInfo.permanent_address.house_no
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
                            basicInfo.permanent_address &&
                            basicInfo.permanent_address.house_no
                          : ""
                      }
                      onChange={handleChange}
                    ></input>
                    <span className="errortext">
                      {errors.permanent_address &&
                        errors.permanent_address.house_no}
                    </span>
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
                          basicInfo.permanent_address &&
                          basicInfo.permanent_address.street
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
                            basicInfo.permanent_address &&
                            basicInfo.permanent_address.street
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">
                      {errors.permanent_address &&
                        errors.permanent_address.street}
                    </span>
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
                          basicInfo.permanent_address &&
                          basicInfo.permanent_address.landmark
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
                            basicInfo.permanent_address &&
                            basicInfo.permanent_address.landmark
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">
                      {errors.permanent_address &&
                        errors.permanent_address.landmark}
                    </span>
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
                          basicInfo.permanent_address &&
                          basicInfo.permanent_address.city
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
                            basicInfo.permanent_address &&
                            basicInfo.permanent_address.city
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">
                      {errors.permanent_address &&
                        errors.permanent_address.city}
                    </span>
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
                          basicInfo.permanent_address &&
                          basicInfo.permanent_address.district
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
                            basicInfo.permanent_address &&
                            basicInfo.permanent_address.district
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">
                      {errors.permanent_address &&
                        errors.permanent_address.district}
                    </span>
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
                          basicInfo.permanent_address &&
                          basicInfo.permanent_address.state
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
                            basicInfo.permanent_address &&
                            basicInfo.permanent_address.state
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">
                      {errors.permanent_address &&
                        errors.permanent_address.state}
                    </span>
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
                          basicInfo.permanent_address &&
                          basicInfo.permanent_address.pincode
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
                            basicInfo.permanent_address &&
                            basicInfo.permanent_address.pincode
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">
                      {errors.permanent_address &&
                        errors.permanent_address.pincode}
                    </span>
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
                          basicInfo.permanent_address &&
                          basicInfo.permanent_address.country
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
                            basicInfo.permanent_address &&
                            basicInfo.permanent_address.country
                          : ""
                      }
                      onChange={handleChange}
                      id="afterfocus"
                    ></input>
                    <span className="errortext">
                      {errors.permanent_address &&
                        errors.permanent_address.country}
                    </span>
                  </Tooltip>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col id="moveup">
              <h5>Shifting Payment</h5>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Tooltip title={""}>
                    <Label className="kyc_labellabel">Shifting Amount *</Label>
                    <input
                      className={`form-control digits not-empty`}
                      type="number"
                      name="amount"
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
                            basicInfo.user_advance_info.shifting_amount
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
            {showPaymentType && (
              <Col sm="3" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Payment Type</Label>
                    <select
                      className="form-control digits not-empty"
                      style={{ border: "none", outline: "none" }}
                      id="afterfocus"
                      type="select"
                      name="payment_type"
                      value={basicInfo.payment_type}
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
          </Row>
          <Stack direction="row" spacing={2}>
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
    </>
  );
};

export default InstallationBasicinfo;
