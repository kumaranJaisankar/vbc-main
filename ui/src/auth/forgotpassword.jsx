import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Label,
  Form,
  FormGroup,
  Input, Spinner
} from "reactstrap";

import Resendcode from "./resendcode";
import Newpassword from "./newpwd";
import { adminaxiosWithoutToken } from "../axios";
import { useHistory } from "react-router-dom";
import CONTENT from "./content"
import USER from "../assets/images/Customer-Circle-img/user.png";
import LOGO1 from "../assets/images/logo-1.png"
import FooterContent from "./footer1"
import Successing from "./success"
import ErrorModal from "../components/common/ErrorModal";

const Forgot = () => {
  let history = useHistory();

  const [mobnoendswith, setMobnoendswith] = useState("");

  const [error, setError] = useState();
  const [username, setUsername] = useState();
  const [showpage, setShowPage] = useState("forgot");
  const [loaderSpinneer, setLoaderSpinner] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");  
  const sendotp = () => {
    setLoaderSpinner(true)
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    adminaxiosWithoutToken
      .post(`accounts/otp/send`, { username }, config)
      .then((response) => {
        if (response.data.status) {
          setShowPage("resendcode");
          setError("");
          const mobilenum = response.data.message.substring(
            response.data.message.length - 4
          );
          setMobnoendswith(mobilenum);
        }
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        //Changes by Marieya
        if (error.response) {
          let message = "";
          if (error.response.data && error.response.data.detail) {
            message = error.response.data.detail;
          } else {
            message = "Something went wrong";
          }
          setShowModal(true);
          setModalMessage(message);
        } else {
          setShowModal(true);
          setModalMessage("Something went wrong");
        }
      });
      // .catch(function (error) {
      //   setLoaderSpinner(false)
      //   if (error && error.response && error.response.data) {
      //     console.error("Something went wrong!", error);
      //     setError(error.response.data.detail);
      //   } else {
      //     setError("");
      //   }
      // });
  };

  const movetosignin = () => {
    history.push("/login");
  };

  return (
    <>
      {showpage == "forgot" && (
        <Container fluid={true} className="p-0">
          <Row style={{ backgroundColor: "#e4ecf8" }}>
            <Col xs="2"></Col>
            <Col xs="4">
              <CONTENT />
            </Col>
            <Col xs="5">
              <div className="login-card" >
                <div className="Newlogin-card">
                  <div>
                    <a className="logo" href="index.html">

                      <img src={LOGO1} style={{ marginLeft: "15%" }} />
                      {/* <img src={SPARKRADIUS}/> */}
                    </a>
                  </div>
                  <span className="signin_text">Forgot Password</span>

                  <div className="login-main login-tab1">
                    <Form className="theme-form" style={{ marginTop: " 2%", width: "111%" }}>
                      <p>{"Reset password in two quick steps"}</p>
                      <FormGroup style={{ top: "-30px" }}>
                        <Label className="col-form-label">
                          Please enter your username
                        </Label>
                        <div>
                          <img src={USER} className="lock" style={{ top: "62px", left: "20px" }} />
                          <Input
                            className="form-control logininput"
                            type="text"
                            required=""
                            onChange={(e) => {
                              setUsername(e.target.value);
                              if (e.target.value == "") {
                                setError("");
                              }
                            }}
                            style={{ left: "0px", paddingLeft: "15%" }}
                          />
                          {error !== "" && (
                            <span className="errortext">{error}</span>
                          )}
                        </div>


                      </FormGroup>
                    </Form>
                    {/* <div style={{display:"flex"}}> */}

                    <Button
                      // style={{ marginTop: "-65px" ,fontSize:"20px",   fontFamily: "Open Sans",
                      // fontWeight: 600,}}
                      color="primary"
                      onClick={sendotp}
                      id="loginBtn"
                      className="btn-block"
                      style={{
                        fontSize: "18px",
                        fontFamily: "Open Sans",
                        fontWeight: 600,
                        marginTop: "-11%",
                        width: "111%",
                      }}
                      disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                    > {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp;
                      Reset Password
                    </Button>
                    <Button
                      style={{
                        fontSize: "18px", fontFamily: "Open Sans",
                        fontWeight: 600,
                        width: "111%",
                      }}
                      color="primary"
                      className="btn-block"
                      onClick={movetosignin}
                      id="loginBtn"

                    >
                      Back
                    </Button>
                    {/* </div> */}
                  </div>
                  <br />
                  <FooterContent />
                </div>
              </div>
            </Col>
            <Col xs="5"></Col>
          </Row>
          <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
        </Container>
      )}
      {showpage == "resendcode" && (
        <Resendcode
          setShowPage={setShowPage}
          username={username}
          mobnoendswith={mobnoendswith}
          sendotp={sendotp}
        />
      )}
      {showpage == "newpwd" && (
        <Newpassword setShowPage={setShowPage} username={username} />
      )}
      {showpage == "success" && (
        <Successing />
      )}
    </>
  );
};

export default Forgot;
