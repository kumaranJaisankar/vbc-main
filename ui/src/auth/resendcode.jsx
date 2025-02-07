import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Label,
  Form,
  FormGroup,
  Input,Spinner
} from "reactstrap";
import FooterContent from "./footer1";
import LOGO1 from "../assets/images/logo-1.png";

import { adminaxiosWithoutToken } from "../axios";
import CONTENT from "./content";
const Resendcode = (props) => {
  // const [otp, setOtp] = useState();
  const [error, setError] = useState();
  //state for timer
  // const [counter, setCounter] = React.useState(300);
  const [otp, setOtp] = useState("");
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [dataError, setDataError] = useState()
  const otpverify = () => {
    setLoaderSpinner(true)
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      otp: otp,
      username: props.username,
    };
    adminaxiosWithoutToken
      .post(`accounts/otp/verify`, data, config)
      .then((response) => {
       
        setLoaderSpinner(false)
        if (response.data.status) {
          props.setShowPage("newpwd");
        }
        //  else {
        //   setError(res.data.details);
        // }
      })
      .catch(function (error) {
        setDataError(error.response.data)
        console.log(error.response.data,"error.response.data")
        setLoaderSpinner(false)
        if (error && error.response && error.response.data) {
          console.error("Something went wrong!", error);
          setError(error.response.data.message);
        }
      });
  };
  //use effect for counter
  // useEffect(() => {
  //   counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  // }, [counter]);
  // timer code
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);


  const resendHandleClick = () => {
    setMinutes(5);
    setSeconds(59);
    props.sendotp();
    // setCounter(300);
  };
  // end
  return (
    <Container fluid={true} className="p-0">
      <Row style={{ backgroundColor: "#e4ecf8" }}>
        <Col xs="2"></Col>
        <Col xs="4">
          <CONTENT />
        </Col>
        <Col xs="5" sm="5" lg="5" md="5">
          <div className="login-card">
            <div className="Newlogin-card">
              <div>
                <a className="logo" href="index.html">
                  <img src={LOGO1} style={{ marginLeft: "15%" }} />
                </a>
              </div>
              <span className="signin_text">We sent a code to your phone</span>

              <div className="login-main login-tab1">
                <Form className="theme-form">
                  <p>
                    Enter 6 digit verification code sent to your phone
                    <br />
                    ending in ****** {props.mobnoendswith}.{/* <b>Change</b> */}
                    <br />
                  </p>

                  <FormGroup style={{ top: "-30px" }}>
                    <Label className="col-form-label">6-digit code</Label>
                    <Input
                      className="form-control logininput"
                      type="text"
                      required=""
                      onChange={(e) => {
                        if (e.target.value == "") {
                          setError("");
                        }
                        setOtp(e.target.value);
                      }}
                      style={{ left: "0px", paddingLeft: "15%", width: "111%" }}
                    />
                    <p style={{ marginBottom: "-3px", fontSize: "12px" }}>
                      {seconds > 0 || minutes > 0 ? (
                        <p>
                          OTP expires in{" "}
                          {minutes < 10 ? `0${minutes}` : minutes}:
                          {seconds < 10 ? `0${seconds}` : seconds} minutes
                        </p>
                      ) : (
                        ""
                        // <p>Didn't recieve code?</p>
                      )}

                      {/* OTP expires in {counter} seconds */}
                    </p>

                    <p>
                      {error !== "" && (
                        <span className="errortext">{error}</span>
                      )}
                    </p>
                    <p>  <span className="errortext">{dataError?.detail && "Enter Valid OTP"}</span></p>
                  </FormGroup>
                </Form>
              

                {minutes || seconds ? (
                  <div>
                    <Button
                      disabled
                      color="primary"
                      style={{
                        fontSize: "18px",
                        fontFamily: "Open Sans",
                        fontWeight: 600,
                        marginTop: "-11%",
                        width: "111%",
                      }}
                      className="btn-succes disabled btn-block"
                      onClick={props.sendotp}
                    >
                      Resend
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      className="btn-block"
                      color="primary"
                      style={{ marginTop: "-65px", ontSize: "20px" }}
                      onClick={resendHandleClick}
                    >
                      Resend
                    </Button>
                    <br />
                  </div>
                )}
                <br />
                <Button
                  color="primary"
                  className="btn-block"
                  onClick={otpverify}
                  id="loginBtn"
                  style={{
                    fontSize: "18px",
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                    width: "111%",
                  }}
                  disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                >{loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp;
                  Submit
                </Button>
              </div>
              <br />
              <FooterContent />
            </div>
          </div>
        </Col>{" "}
        <Col xs="1"></Col>
      </Row>
    </Container>
  );
};

export default Resendcode;
