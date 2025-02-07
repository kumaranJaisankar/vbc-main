import React, { useState, useEffect } from "react";
import { Row, Col, Input, Label, FormGroup, Button, Spinner } from "reactstrap";
import { customeraxios, billingaxios } from "../../../../axios";
import { toast } from "react-toastify";
import { Sorting } from "../../../common/Sorting";
const EditStaticIpInfo = (props) => {
    console.log(props)
  const [exitStaticip, setexitStaticIP] = useState({
    ippool: props?.customerInfo?.radius_info?.ippool?.id,
  });
  const [calculationdata, setCalculationdata] = useState();
  const [loader, setLoader] = useState(false); //loader
  const [showPaymentType, setShowPaymentType] = useState(false);
  const [payment, setPayment] = useState([]);
  const [getpaymentmethod, setGetPaymentMethod] = useState()
  const handleChange = (event) => {
    setexitStaticIP((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    if (event.target.name == "ippool") {
      props.getStaticIP(event.target.value);
    }
    if (
      event.target.name == "ippool" ||
      event.target.name == "static_ip_bind"
    ) {
      setShowPaymentType(true);
    }
  };
  // calculation
  useEffect(() => {
    setLoader(true);
    let caldata = {
      ...exitStaticip,
      customer_id: props?.customerInfo?.id,
    };
    console.log(caldata,"caldata")
    customeraxios
      .post(`customers/static_ip/update/amount`, caldata)
      .then((res) => {
        setLoader(false);
        props.setGetcalculations(res.data);
      });
  }, [calculationdata]);
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
  const staticIPSubmit = () => {
    setLoader(true);
    let data = { 
        ...props.getcalculation, 
        payment_method: getpaymentmethod 
      };    customeraxios
      .patch(`customers/static_ip/update/${props?.customerInfo?.id}`, data)
      .then((res) => {
        setLoader(false);
        props.onUpdate(data);
        window.location.reload();
        toast.success(res.data.msg, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .catch((error) => {
        setLoader(false);
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("400");
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

  return (
    <>
      <Row>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">IP Pool</Label>
              <select
                className={`form-control ${
                  props?.customerInfo && props?.customerInfo.radius_info?.ippool
                    ? "not-empty"
                    : "not-empty"
                }`}
                id="afterfocus"
                type="select"
                name="ippool"
                value={
                  exitStaticip?.ippool ||
                  props?.customerInfo?.radius_info?.ippool?.id
                }
                onChange={handleChange}
              >
                <option value="" style={{ display: "none" }}></option>
                {props?.ipPool.map((staticip) => {
                  if (!!staticip) {
                    return (
                      <option key={staticip.id} value={staticip.id}>
                        {staticip.name}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Static IP</Label>
              <Input
                className="form-control digits not-empty"
                type="text"
                value={
                  props?.customerInfo &&
                  props?.customerInfo.radius_info?.static_ip_bind
                }
                disabled={true}
                name="static_ip_total_cost"
              />
            </div>
          </FormGroup>
        </Col>
        <Col md="3">
          <div className="input_wrap">
            <Label className="kyc_label">Static IP</Label>
            <select
              className={`form-control ${
                props?.customerInfo &&
                props?.customerInfo?.radius_info?.static_ip_bind
                  ? "not-empty"
                  : "not-empty"
              }`}
              id="afterfocus"
              type="select"
              name="static_ip_bind"
              style={{ border: "none", outline: "none" }}
              value={
                exitStaticip?.static_ip_bind ||
                props?.customerInfo?.radius_info?.static_ip_bind
              }
              onChange={(event) => {
                handleChange(event);
                setCalculationdata(event.target.value);
              }}
            >
              <option value="" style={{ display: "none" }}></option>
              {props.strAscending.map((staticip) => {
                if (!!staticip) {
                  return (
                    <option key={staticip.ip} value={staticip.ip}>
                      {staticip.ip}
                    </option>
                  );
                }
              })}
            </select>
          </div>
        </Col>
        <Col md="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Static IP Cost Per Month</Label>
              <Input
                className="form-control digits not-empty"
                type="text"
                value={
                  props.getcalculation?.radius_info
                    ?.static_ip_total_cost_per_month
                }
                disabled={true}
                name="static_ip_total_cost_per_month"
              />
            </div>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Amount To Be Paid</Label>
              <Input
                className="form-control digits not-empty"
                type="text"
                value={props.getcalculation?.amount}
                disabled={true}
                name="amount"
              />
            </div>
          </FormGroup>
        </Col>
        {showPaymentType && (
          <Col sm="3">
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">Payment Method</Label>
                <select
                  className="form-control digits not-empty"
                  style={{ border: "none", outline: "none" }}
                  id="afterfocus"
                  type="select"
                  name="payment_method"
                //   value={getpaymentmethod}
                  onChange={(event) => {
                    handleChange(event);
                    setGetPaymentMethod(event.target.value)
                }}
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
      <Row>
        <Col>
          <Button
            type="submit"
            variant="contained"
            id="save_button"
            onClick={staticIPSubmit}
            disabled={loader}
          >
            {loader ? <Spinner size="sm"> </Spinner> : null}
            Save
          </Button>
        </Col>
      </Row>
    </>
  );
};
export default EditStaticIpInfo;
