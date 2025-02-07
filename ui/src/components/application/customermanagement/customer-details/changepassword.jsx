import React, { useState, useRef, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import Tooltip from '@mui/material/Tooltip';

import {
  Modal,
  ModalFooter,
  ModalBody,
  FormGroup,
  Input,
  Label,
  Form, Spinner
} from "reactstrap";
import { adminaxios } from "../../../../axios";
import { toast } from "react-toastify";
import useFormValidation from "../../../customhooks/FormValidation";
import LockResetIcon from "@mui/icons-material/LockReset";
const Changepassword = (props, initialValues) => {
  const [changepassword, setChangepssword] = useState(false);
  const changePasswordmodal = () => setChangepssword(!changepassword);
  const [custchangepwd, setCustchangepwd] = useState();
  const [inputs, setInputs] = useState(initialValues);
  const [error, setError] = useState();
  const [show, setShowpassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toggleNewPassword, setToggleNewPassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);
  //to disable button
  const [disable, setDisable] = useState(false);
  // show password for superadmin only
  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let showPassword = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Super Admin") ||
    (tokenInfo && tokenInfo.user_type === "Admin") ||
    (tokenInfo && tokenInfo.user_type === "Franchise Owner") ||
    (tokenInfo && tokenInfo.user_type === "Staff") ||
    (tokenInfo && tokenInfo.user_type === "Help Desk") ||
    (tokenInfo && tokenInfo.user_type === "Zonal Manager")
  ) {
    showPassword = true;
  }

  useEffect((e) => {
    setErrors({})
  }, [props])


  const customsubmit = (e) => {
    e.preventDefault();
    e = e.target.name;
    const validationErrors = validate(inputs);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (noErrors && Object.keys(inputs).length === 2) {
      setDisable(true)
      adminaxios
        .post(
          "accounts/otp/reset/password",
          { username: props.profileDetails?.user?.username, ...custchangepwd },
          config
        )
        .then((response) => {
          setDisable(false)
          resetformmanually();
          if (props.fetchComplaints)
            props.fetchComplaints()
          toast.success("Password changed successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });

          props.setProfileDetails((preState) => ({
            ...preState,
            cleartext_password: {
              ...preState.cleartext_password,
              cleartext_password: custchangepwd.password,
            }
          }));

          setCustchangepwd({
            password: "",
            password2: "",
          });
          setChangepssword(false);
        })
        .catch(function (error) {
          setDisable(false)
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
    } else {
      const validationErrors = validate(inputs);
      const noErrors = Object.keys(validationErrors).length === 0;
      setErrors(validationErrors);
    }
  };
  //end
  const requiredFields = ["password", "password2"];
  // Errors

  const { validate, Error } = useFormValidation(requiredFields);
  const handleCustomChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (target.type === "checkbox") {
      if (target.checked) {
        custchangepwd.hobbies[value] = value;
      } else {
        custchangepwd.hobbies.splice(value, 1);
      }
    } else {
      setCustchangepwd((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
  };

  const customresetForm = function () {
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setError({});
  };

  const resetformmanually = () => {
    setCustchangepwd({
      password: "",
      password2: "",
    });
    setInputs("")
    setErrors({})
    document.getElementById("resetid").click();
  };
  const form = useRef(null);

  // show change password for  admin only
  const tokenInfo1 = JSON.parse(localStorage.getItem("token"));
  let changePassword = false;
  if (tokenInfo1 && tokenInfo1.user_type === "Admin") {
    changePassword = true;
  }

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }


  return (
    <>

      {showPassword && (
        <div className="cust_pwd" id="cust_details">
          <OutlinedInput
            className="cust_details_pwd"
            id="cleartext_password"
            size="small"
            type={show ? "text" : "password"}
            value={props.profileDetails?.user?.cleartext_password}
            disabled={true}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowpassword(!show);
                  }}
                  edge="end"
                >
                  <Tooltip title={"Preview Password"}>
                    {show ? (
                      <Visibility style={{ color: "#285295 " }} />
                    ) : (
                      <VisibilityOff style={{ color: "#285295 " }} />
                    )}
                  </Tooltip>
                </IconButton>
                &nbsp; &nbsp;
                <Tooltip title={"Change Password"}>
                  <LockResetIcon
                    onClick={changePasswordmodal}
                    style={{ cursor: "pointer", color: "#285295 " }}
                  />
                </Tooltip>
              </InputAdornment>
            }
            label="Password"
          />
        </div>
      )}
      <Modal isOpen={changepassword} toggle={changePasswordmodal} centered>
        <Form onSubmit={customsubmit} onReset={customresetForm} ref={form}>
          <ModalBody className="changePassword_modalBody">
            <Grid container spacing={1}>
             
             
              <h5> Change Password</h5>
            </Grid>

            <br />
            <br />
            <>
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className="form-control digits not-empty"
                    value={custchangepwd && custchangepwd.password}
                    type={toggleNewPassword ? "text" : "password"}
                    name="password"
                    onChange={handleCustomChange}
                    onBlur={checkEmptyValue}
                  />
                  <Label className="form_label">New Password</Label>
                  <span className="errortext" id="error_pwd">
                    {errors.password}
                  </span>
                  <div
                    className="show-hide"
                    style={{
                      top: "25px",
                      right: "39px",
                      color: "#19345F",
                    }}
                    onClick={() => setToggleNewPassword(!toggleNewPassword)}
                  >
                    {toggleNewPassword ? (
                      <Visibility style={{ color: "#285295", position: "relative", top: "-5px" }} />
                    ) : (
                      <VisibilityOff style={{ color: "#285295", position: "relative", top: "-5px" }} />
                    )}

                  </div>
                </div>
              </FormGroup>
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className="form-control digits not-empty"
                    value={custchangepwd && custchangepwd.password2}
                    name="password2"
                    type={toggleConfirmPassword ? "text" : "password"}
                    onChange={handleCustomChange}
                    onBlur={checkEmptyValue}
                  />
                  <Label className="form_label">Confirm Password</Label>
                  <span className="errortext" id="error_pwd1">
                    {errors.password2}
                  </span>
                  <div
                    className="show-hide"
                    style={{
                      top: "25px",
                      right: "39px",
                      color: "#19345F",
                    }}
                    onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}
                  >
                    {toggleConfirmPassword ? (
                      <Visibility style={{ color: "#285295", position: "relative", top: "-5px" }} />
                    ) : (
                      <VisibilityOff style={{ color: "#285295", position: "relative", top: "-5px" }} />
                    )}


                  </div>
                </div>
                <p>
                  {error !== "" && <span className="errortext">{error}</span>}
                </p>
              </FormGroup>
            </>
            {/* ) : (
              ""
            )} */}
          </ModalBody>
          <ModalFooter className="changePassword_modal">
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              
              <>
                <div style={{ zIndex: 1 }}>
                  <button
                    type="button"
                    name="submit"
                    className="btn btn-secondary"
                    onClick={() => {
                      changePasswordmodal();
                      resetformmanually();
                    }}
                    id="resetid"
                  >
                    Cancel
                  </button>
                  &nbsp; &nbsp; &nbsp;
                  <Button
                    variant="contained"
                    onClick={customsubmit}
                    id="yes_button"
                    disabled={disable}
                  >
                    {disable ? <Spinner size="sm"> </Spinner> : null}
                    Submit
                  </Button>
                </div>
              </>
              {/* ) : ""} */}
            </Stack>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default Changepassword;
