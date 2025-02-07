import React, { useState } from "react";
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

import { adminaxiosWithoutToken } from "../axios";
import { useHistory } from "react-router-dom";
import { passwordStrength } from "check-password-strength";
import CONTENT from "./content"
import FooterContent from "./footer1"

const Newpassword = (props) => {
  let history = useHistory();
  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();
  const [errors, setErrors] = useState();
  const [togglePassword, setTogglePassword] = useState(false);
  const [passwordScore, setPasswordScrore] = useState({});
  const [error, setError] = useState();
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
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

  const newpwd = () => {
    setLoaderSpinner(true)
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      password: password,
      password2: password2,
      username: props.username,
    };
    // if(validate()){

    adminaxiosWithoutToken
      .post(`accounts/otp/reset/password`, data, config)
      .then((response) => {
        setLoaderSpinner(false)
        // if (response.data.status) {
          // history.push("/login");
        // }
        if (response.data.detail) {
          props.setShowPage("success");
          
        }
      })
      .catch(function (error) {
        setLoaderSpinner(false)
        if (error && error.response && error.response.data) {
        console.error("Something went wrong!", error);
        setError(error.response.data.detail);
        }
      })
    // }
  };

  //   const validate =()=>{
  //     if (password !== "undefined" && password2 !== "undefined") {
  //         if (password != password2) {

  //           setErrors({password: "Passwords don't match", password2: "Passwords don't match"})
  //             return false;

  //         }else{
  //             setErrors({})
  //             return true;
  //         }

  //     } else{
  //         setErrors({password: "Passwords don't match", password2: "Passwords don't match"})
  //         return false;
  //     }
  //   }

  return (
    <Container fluid={true} className="p-0">
     <Row style={{ backgroundColor: "#e4ecf8" }}>
        <Col xs="2"></Col>
        <Col xs="4">
         <CONTENT/>
        </Col>
        <Col xs="5">
          <div className="login-card">
            <div className="Newlogin-card">
              <div>
                <a className="logo" href="index.html">
                  <h3>
                    <b>Choose a new password</b>
                  </h3>
                </a>
              </div>
              <div className="login-main login-tab">
                <Form className="theme-form">
                  <p>
                    Create a new password that is atleast 8 characters
                    <br />
                    long.
                    <b>What makes a strong password?</b>
                  </p>
                  <div className="password-notes">
                  <div>Notes:</div>
                  <ul>
                    <li>
                      At least 8 characters—the more characters, the better
                    </li>
                    <li>A mixture of both uppercase and lowercase letters</li>
                    <li>A mixture of letters and numbers</li>
                    <li>
                      Inclusion of at least one special character, e.g., ! @ # ?
                      ]
                    </li>
                  </ul>
                </div>
                  <FormGroup>
                    <Label className="col-form-label">New Password</Label>
                    <Input
                    style={{left:"0px"}}
                      className="form-control logininput"
                      type={togglePassword ? "text" : "password"}
                      onChange={(e) => {
                        validatePassword("password", e.target.value);
                        setPassword(e.target.value);
                      }}
                      //   onKeyPress={handlePassword}
                      defaultValue={password}
                      required=""
                    />
                    <div
                      className="show-hide"
                      onClick={() => setTogglePassword(!togglePassword)}
                    >
                      <span className={togglePassword ? "" : "show"}></span>
                    </div>
                    {getPasswordStatus(
                      passwordScore ? passwordScore.password : null
                    )}
                    <br />
                    {/* {errors !=='' &&<span className="errortext">{errors}</span>} */}
                  </FormGroup>
                  <FormGroup>
                    <Label className="col-form-label">
                      Retype New Password
                    </Label>

                    <Input
                     style={{left:"0px"}}
                      className="form-control logininput"
                      type={togglePassword ? "text" : "password2"}
                      onChange={(e) => {
                        validatePassword("password2", e.target.value);
                        setPassword2(e.target.value);
                      }}
                      //   onKeyPress={handlePassword}
                      //   defaultValue={password}
                      required=""
                    />
                    {getPasswordStatus(
                      passwordScore ? passwordScore.password2 : null
                    )}
                    <br />

                    {errors !=='' &&<span className="errortext">{error}</span>}
                  </FormGroup>
                  <div className="checkbox ml-3">
                    <Input id="checkbox1" type="checkbox" />
                    <Label className="text-muted" for="checkbox1">
                      Require all devices to signin with new password
                    </Label>
                  </div>
                </Form>
                
                <br />
                <Button
                  color="primary"
                  className="btn-block"
                  style={{fontSize:"20px"}}
                  onClick={newpwd}
                  // disabled={
                  //   !passwordScore ||
                  //   !passwordScore.password ||
                  //   (passwordScore &&
                  //     passwordScore.password &&
                  //     passwordScore.password.id != 3) ||
                  //   !passwordScore.password2 ||
                  //   (passwordScore &&
                  //     passwordScore.password2 &&
                  //     passwordScore.password2.id != 3)
                  // }
                  disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                >{loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp;
                  Submit
                </Button>
              </div>
              <br/>
              <FooterContent/>
            </div>
          </div>
        </Col>
        <Col xs="5"></Col>
      </Row>
    
    </Container>
  );
};

export default Newpassword;
