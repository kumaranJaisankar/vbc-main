import React, { useState, useEffect } from "react";
import axios from "axios";
import man from "../assets/images/dashboard/profile.jpg";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  TabContent,
  TabPane,
  Spinner,
} from "reactstrap";
import { firebase_app, Jwt_token } from "../data/config";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { withRouter, Link } from "react-router-dom";
import LOGO1 from "../assets/images/logo-2.png";
import { SignIn, ForgotPassword, LoginWithJWT } from "../constant";
// import axios from "axios";
import { adminaxios } from "../axios";
// import Forgot from "./forgotpassword";

import LOCK from "../assets/images/Customer-Circle-img/lock.png";
import USER from "../assets/images/Customer-Circle-img/user.png";
import QUESTION from "../assets/images/Customer-Circle-img/question-circle.png";
import ARROW from "../assets/images/Customer-Circle-img/arrow-right.png";
import CONTENT from "./content";
import ErrorModal from "../components/common/ErrorModal";

const Logins = (props) => {
  const { loginWithRedirect } = useAuth0();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("jwt");
  const [togglePassword, setTogglePassword] = useState(false);

  const [value, setValue] = useState(localStorage.getItem("profileURL" || man));
  const [name, setName] = useState(localStorage.getItem("Name"));
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const iptv_credentials = {
    username: "mso_usr@vbc.com",
    password: "vbc!@34",
    ismso: true,
  };
  const iptv_login_url = "http://125.62.213.82:9081/admin/auth/mso/login";

  // var access_token=JSON.parse(localStorage.getItem("token"));
  // var options={
  //   headers:{
  //     "Authorization":"Bearer" + access_token,
  //   }
  // }

  // axios.get("https://4d668c7d1e99.ngrok.io/radius/group/display", options).then((res) => {
  //     console.log(res)
  // })

  // let submit=()=>{

  // var data = {
  //     "username": "admin",
  //     "password": "Apple@12345"
  // }

  //   axios
  //   .post("https://4d668c7d1e99.ngrok.io/radius/group/login", data)

  //   .then((response) => {
  // console.log(response)

  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // }

  useEffect(() => {
    localStorage.setItem("profileURL", value);
    localStorage.setItem("Name", name);
  }, [value, name]);

  const loginAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await firebase_app
        .auth()
        .signInWithEmailAndPassword(username, password)
        .then(function () {
          setValue(man);
          setName("Emay Walter");
          localStorage.setItem("token", Jwt_token);
          setTimeout(() => {
            props.history.push(`${process.env.PUBLIC_URL}/dashboard/default/`);
          }, 200);
        });
    } catch (error) {
      setTimeout(() => {
        toast.error(
          "Oppss.. The password is invalid or the user does not have a password."
        );
      }, 200);
    }
  };

  const handlePassword = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      loginWithJwt(username, password);
    }
  };

  const iptvLogin = () => {
    axios
      .post(iptv_login_url, iptv_credentials)
      .then((response) => {
        localStorage.setItem("iptvtoken", response.data.token);
      })
      .catch((err) => console.log("IPTV LOGIN FAILED !!!!!"));
  };

  const loginWithJwt = async (username, password) => {
    setLoaderSpinner(true);
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      return await adminaxios
        .post("accounts/token", { username, password })
        .then((response) => {
          return response.data;
        })
        .then((user) => {
          if (
            user.detail === "No active account found with the given credentials"
          ) {
            setWrongCredentials(true);
          } else {
            setWrongCredentials(false);
            setValue(man);
            setName(username);
            localStorage.setItem("token", JSON.stringify(user));
            window.location.href = `${process.env.PUBLIC_URL}/app/dashboard/`;

            // window.location.href = `${process.env.PUBLIC_URL}/app/project/user-list/`
            return user;
          }
        });
    } catch (error) {
      // Checks if error response exists and if it does, handles it based on status code by Marieya
      if (error.response) {
        let message = "";
        switch (error.response.status) {
          case 400:
            // Check if detail property is available
            if (error.response.data && error.response.data.detail) {
              message = error.response.data.detail;
            } else {
              // If detail is not available, loop through error messages
              if (error.response.data) {
                for (let key in error.response.data) {
                  message += `${key}: ${error.response.data[key].join("\n")}\n`;
                }
              } else {
                message = "Something went wrong.";
              }
            }
            break;
          case 401:
            if (error.response.data && error.response.data.detail) {
              message = error.response.data.detail;
            } else {
              message = "No active account found with the given credentials.";
            }
            break;
          case 403:
            if (error.response.data && error.response.data.detail) {
              message = error.response.data.detail;
            } else {
              message = "No Permissions.";
            }
            break;
          case 500:
            if (error.response.data && error.response.data.detail) {
              message = error.response.data.detail;
            } else {
              message =
                "An internal server error has occurred. Please try again later.";
            }
            break;
          default:
            message =
              "Oppss.. The password is invalid or the user does not have a password.";
            break;
        }
        // Show the error modal with the error message
        setShowModal(true);
        setModalMessage(message);
      } else {
        // If error does not have a response (e.g., network error), handle it separately
        setShowModal(true);
        setModalMessage(
          "Oppss.. The password is invalid or the user does not have a password."
        );
      }
      setLoaderSpinner(false);
    }
    // catch (e) {
    //   if (e.response.status === 403) {
    //     window.location.href = `${process.env.PUBLIC_URL}/login`;
    //   }
    //   setLoaderSpinner(false);
    //   setWrongCredentials(true);
    //   toast.error(
    //     "Oppss.. The password is invalid or the user does not have a password."
    //   );
    // }
  };
  useEffect(() => {
    // Clear the 'backup' item from the localStorage when the login page is opened
    localStorage.removeItem("backup");
  }, []);

  return (
    <Container fluid={true} className="p-0">
      <Row style={{ backgroundColor: "#e4ecf8" }}>
        <Col xs="1"></Col>
        <Col xs="5">
          <CONTENT />
        </Col>
        <Col xs="5" sm="5" lg="5" md="5">
          <div className="login-card" style={{}}>
            <div className="Newlogin-card">
              {/* <div style={{marginTop:"10%"}}> */}
              <div>
                <a
                  className="logo"
                  href="index.html"
                  // style={{ marginLeft: "13%" }}
                >
                  {/* <img src={LOGO1} style={{ marginLeft: "15%" }} /> */}
                  <img src={LOGO1} />
                </a>
              </div>
              <span
                className="signin_text"
                style={{ position: "relative", left: "9%" }}
              >
                Sign in to your Account
              </span>

              <div className="login-main login-tab">
                {/* <Nav className="border-tab flex-column" tabs>
                  
                  <NavItem>
                    <NavLink
                      className={selected === "jwt" ? "active" : ""}
                      onClick={() => setSelected("jwt")}
                    >
                      <img src={require("../assets/images/jwt.svg")} alt="" />
                      <span>{JWT}</span>
                    </NavLink>
                  </NavItem>
                </Nav> */}
                <TabContent activeTab={selected} className="content-login">
                  <TabPane
                    className="fade show"
                    tabId={selected === "jwt" ? "jwt" : "firebase"}
                  >
                    <Form
                      className="theme-form"
                      style={{ marginTop: "2%", width: "111%" }}
                    >
                      {/* onSubmit={submit} */}
                      {/* <h4>{selected === "firebase" ? "Sign In With Firebase" : "Sign In"}</h4> */}
                      {/* <p>{"Enter your USERNAME & PASSWORD to login"}</p> */}
                      <FormGroup>
                        {/* <Label className="col-form-label">{EmailAddress}</Label> */}
                        <div>
                          <img src={USER} className="lock" />
                          {/* <PersonIcon className="lock" color="#8B8EA3" disabled="true"/> */}
                          <Input
                            className="form-control logininput"
                            type="text"
                            required=""
                            onChange={(e) => setUsername(e.target.value)}
                            defaultValue={username}
                            placeholder="User Name"
                            style={{ paddingLeft: "15%" }}
                          />
                        </div>
                      </FormGroup>
                      <FormGroup>
                        {/* <Label className="col-form-label">{Password}</Label> */}
                        <div>
                          <img src={LOCK} className="lock" />
                          <Input
                            // onCopy={(e)=>{
                            //   e.preventDefault()
                            //   return false;
                            // }}
                            // onPaste={(e)=>{
                            //   e.preventDefault()
                            //   return false;
                            // }}
                            className="form-control logininput"
                            type={togglePassword ? "text" : "password"}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handlePassword}
                            defaultValue={password}
                            required=""
                            placeholder="Password"
                            style={{ paddingLeft: "15%" }}
                          />
                        </div>
                        <div
                          className="show-hide"
                          style={{
                            top: "25px",
                            right: "39px",
                            color: "#19345F",
                          }}
                          onClick={() => setTogglePassword(!togglePassword)}
                        >
                          <i
                            className={
                              togglePassword ? "fa fa-eye" : "fa fa-eye-slash"
                            }
                          ></i>
                        </div>
                        {/* <div
                          className="show-hide"
                          onClick={() => setTogglePassword(!togglePassword)}
                        >
                          <span className={togglePassword ? "" : "show"}></span>
                        </div> */}
                      </FormGroup>
                      {wrongCredentials && (
                        <span
                          style={{
                            color: "#ff6666",
                            textAlign: "center",
                            position: "relative",
                            top: "-25px",
                            left: "-8%",
                          }}
                        >
                          Invalid User Name or Password{" "}
                        </span>
                      )}
                      <div className="form-group mb-0">
                        <div className="checkbox ml-3">
                          <br />
                          <br />
                          {/* <Input id="checkbox1" type="checkbox" />
                            <Label className="text-muted" for="checkbox1">
                              {RememberPassword}
                            </Label> */}
                        </div>
                        <div>
                          {/* <span className="remember_text">
                            <Input
                              type="checkbox"
                              // className="checkbox_animated"
                              className="checkbox_img"
                              style={{ position: "relative",
                              left: "-3%",top:"1px"}}
                            />
                            {Rememberme}
                          </span> */}
                          <Link to="/forgotpassword">
                            <a
                              className="link"
                              href="#javascript"
                              style={{
                                position: "relative",
                                top: "-49px",
                                left: "-4%",
                                fontFamily: "Open Sans",
                                fontStyle: "normal",
                                fontWeight: "400",
                                fontSize: "14px",
                                // line-height: "19px",
                                /* identical to box height */

                                color: "#285295",
                              }}
                            >
                              <img src={QUESTION} className="question" />
                              {ForgotPassword}
                            </a>
                          </Link>
                        </div>
                        {selected === "firebase" ? (
                          <Button
                            color="primary"
                            className="btn-block"
                            disabled={loading ? loading : loading}
                            onClick={(e) => loginAuth(e)}
                          >
                            {loading ? "LOADING..." : SignIn}
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            id="loginBtn"
                            className="btn-block"
                            style={{
                              fontSize: "18px",
                              marginLeft: "-8%",
                              fontFamily: "Open Sans",
                              fontWeight: 600,
                              marginTop: "-22px",
                            }}
                            disabled={
                              loaderSpinneer ? loaderSpinneer : loaderSpinneer
                            }
                            onClick={() => {
                              loginWithJwt(username, password);
                              iptvLogin();
                            }}
                          >
                            {loaderSpinneer ? (
                              <Spinner size="sm"> </Spinner>
                            ) : null}{" "}
                            &nbsp;
                            {LoginWithJWT}{" "}
                            <img src={ARROW} style={{ marginLeft: "4%" }} />
                          </Button>
                        )}
                      </div>
                    </Form>
                  </TabPane>
                </TabContent>
                {/* <FooterContent /> */}
              </div>
              {/* </div> */}
              <div
                class="footer1"
                style={{ position: "relative", bottom: "-95px" }}
              >
                <p> Powered by SPARK RADIUS</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xs="1"></Col>
        <ErrorModal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          message={modalMessage}
          action={() => setShowModal(false)}
        />
      </Row>
    </Container>
  );
};

export default withRouter(Logins);
