import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  Modal,
  ModalFooter,
  ModalBody,
  FormGroup,
  Input,
  Label,
  Form,
} from "reactstrap";
import { adminaxios } from "../../../../axios";
import { toast } from "react-toastify";

const Changepassword = (props, initialValues) => {
  const [changepassword, setChangepssword] = useState(false);
  const changePasswordmodal = () => setChangepssword(!changepassword);
  const [custchangepwd, setCustchangepwd] = useState();
  const [inputs, setInputs] = useState(initialValues);
  const [error, setError] = useState();

  const customsubmit = (e) => {
    e.preventDefault();
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    adminaxios
      .post("accounts/otp/reset/password", { username: props.basicInfo.username, ...custchangepwd }, config)
      .then((response) => {
        toast.success("passowrd changed successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        setCustchangepwd({
          password: "",
          password2: "",
        });
        setChangepssword(false);
      })
      .catch(function (error) {
        if (error && error.response && error.response.data && error.response.data.detail) {
          console.error("Something went wrong!", error);
          setError(error.response.data.detail);
          toast.error(error.response.data.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      });
  };

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
      var obj = {}
      for (var name in inputs) {
        obj[name] = ''
      }
      return obj
    })
    setError({})
  }
  const form = useRef(null)


  // show change password for  admin only
  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let changePassword = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Admin")
  ) {
    changePassword = true;
  }
  return (
    <>
      {changePassword && (
        <Button
          variant="contained"
          onClick={changePasswordmodal}
        >
          Change Password
        </Button>
      )}
      <Modal isOpen={changepassword} toggle={changePasswordmodal} centered>
        <Form onSubmit={customsubmit} onReset={customresetForm} ref={form}>
          <ModalBody>
            <FormGroup>
              <div className="input_wrap">
                <Input
                  className="form-control digits not-empty"
                  value={custchangepwd && custchangepwd.password}
                  type="text"
                  name="password"
                  onChange={handleCustomChange}
                />
                <Label className="placeholder_styling">New Password</Label>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="input_wrap">
                <Input
                  className="form-control digits not-empty"
                  value={custchangepwd && custchangepwd.password2}
                  type="text"
                  name="password2"
                  onChange={handleCustomChange}
                />
                <Label className="placeholder_styling">Confirm Password</Label>
              </div>
              <p>
                {error !== "" && <span className="errortext">{error}</span>}
              </p>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="outlined" onClick={changePasswordmodal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={customsubmit}
              >
                Yes
              </Button>
            </Stack>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default Changepassword;
