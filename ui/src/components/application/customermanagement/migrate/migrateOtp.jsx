import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Label,
  Form,
  FormGroup,
  Input,
  Spinner,
} from "reactstrap";

import { helpdeskaxios, customeraxios } from "../../../../axios";
const Migrateotp = (props) => {
  // const [otp, setOtp] = useState();
  const [error, setError] = useState();
  //state for timer
  // const [counter, setCounter] = React.useState(300);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);


  const otpverify = () => {
    setLoading(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      otp: otp,
      username: JSON.parse(localStorage.getItem("token")).username,
    };
    customeraxios
      .post(`customers/otp/verify`, data, config)
      .then((response) => {
        setLoading(false);

        //  else {
        //   setError(res.data.details);
        // }
        
        props.OTpverifytoggle();
        // props.handleSubmit();
        props.migrateHandler();
      })
      .catch(function (error) {
        setLoading(false);
        if (error && error.response && error.response.data) {
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
  //end
  const resendHandleClick = () => {
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      username: JSON.parse(localStorage.getItem("token")).username,
    };
    helpdeskaxios
      .get(`send/otp`, data, config)
      .then((response) => {
        console.log("res", response.data);

        //  else {
        //   setError(res.data.details);
        // }
        props.handleSubmit();
      })
      .catch(function (error) {
        if (error && error.response && error.response.data) {
          setError(error.response.data.message);
        }
      });
    // setCounter(300);
    setMinutes(5);
    setSeconds(0);
    handleResendOtp();
  };

  useEffect(() => {
    handleResendOtp();
  },[]);

  const handleResendOtp = () => {
    // const data = {
    //   username: JSON.parse(localStorage.getItem("token")).username,
    // };

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    customeraxios
      .post(`customers/changeplan/otp`,  config)
      .then((response) => {
        console.log("otp sent", response.data);
      })
      .catch(function (error) {
        if (error && error.response && error.response.data) {
          setError(error.response.data.message);
        }
      });
  };
  return (
    <Container fluid={true} className="p-0">
      <Row>
        <Col xs="12">
          <div>
            <div>
              <Row id="source_row">
            <Col md="11">
            <h3>
                  <b>We sent a code to your phone</b>

                </h3>
            </Col>
            <Col id="soruce_close" md="1">
              <i className="icon-close" onClick={props.OTpverifytoggle}></i>
            </Col>
          </Row>
            </div>
            <div className="login-main login-tab">
              <Form className="theme-form">
                <p>
                   verification code sent to your phone
                  <br />
                  ending in ******{" "}
                  {/* {props.leadForSubmit?.mobile_number?.substr(-4)}.<b>Change</b> */}
                  {JSON.parse(localStorage.getItem("token"))?.mobile_number?.substr(-4)}.

                  <br />
                </p>

                <FormGroup style={{ top: "-30px" }}>
                  <Label className="col-form-label">6-digit code</Label>
                  <Input
                    className="form-control"
                    type="text"
                    required=""
                    name="otp"
                    onChange={(e) => {
                      if (e.target.value == "") {
                        setError("");
                      }
                      setOtp(e.target.value);
                    }}
                  />
                  <p style={{ fontSize: "12px" }}>
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
                  <br />
                  <p>
                    {error !== "" && <span className="errortext">{error}</span>}
                  </p>
                </FormGroup>
              </Form>

              {minutes || seconds ? (
                <div>
                  <Button
                    disabled
                    color="primary"
                    style={{ marginTop: "-25px" }}
                    className="btn-succes disabled btn-block"
                    onClick={handleResendOtp}
                  >
                    Resend
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    className="btn-block"
                    color="primary"
                    style={{ marginTop: "-25px" }}
                    onClick={resendHandleClick}
                  >
                    Resend
                  </Button>
                </div>
              )}
              <br />
              {/* <Button color="primary" className="btn-block" onClick={otpverify}>
                Submit
              </Button> */}
   <Button
                color="primary"
                className="btn-block"
                onClick={otpverify}
                disabled={otp.length <= 5 || loading}
              >
                {loading ? <Spinner size="sm" color="light" /> : "Submit"}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Migrateotp;
