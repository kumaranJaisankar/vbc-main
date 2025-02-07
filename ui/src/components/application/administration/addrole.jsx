import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Button
} from "reactstrap";
import { adminaxios } from "../../../axios";
import { toast } from "react-toastify";
import { Add } from "../../../constant";
import RoleDetails from "./roledetails";
import useFormValidation from "../../customhooks/FormValidation";

const AddRole = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setDisable(false);
    if (props.editRecord) {
      setFormData((preState) => ({
        ...preState,
        name: props.editRecord.name,
        description: props.editRecord.description,
      }));
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [props.editRecord]);

  const handleInputChange = (event) => {
    setFormData((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const roleadd = (data) => {
    setDisable(true);
    const updatedFormData = {
      ...data,
      permissions: [...props.selected, ...props.halfChecked],
    };

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (!props.editRecord) {
      adminaxios
        .post("accounts/role/create", updatedFormData, config)
        .then(() => {
          props.onUpdate();
          toast.success("Role was added successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          resetForm();
        })
        .catch(function (error) {
          toast.error("Something went wrong!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          console.error("Something went wrong!", error);
          setDisable(false);
        });
    } else {
      adminaxios
        .patch(
          `accounts/role/${props.editRecord.id}/rud`,
          updatedFormData,
          config
        )
        .then(() => {
          props.onUpdate();
          toast.success("Role was edited successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        })
        .catch(function (error) {
          toast.error("Something went wrong!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          console.error("Something went wrong!", error);
          setDisable(false);
        });
    }
  };

  //
  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    const data = { ...formData };
    let dataNew = { ...data };
    dataNew.role_name = data.name;
    dataNew.role_desc = data.description;
    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      roleadd(formData);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const resetInputField = () => {};
  const resetForm = function () {};

  const form = useRef(null);

  //validations
  const requiredFields = ["role_name", "role_desc"];
  const { validate, Error } = useFormValidation(requiredFields);

  useEffect(() => {
    if (!props.rightSidebar) {
      // resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  return (
    <Container fluid={true}>
      <Row>
        <Col sm="12">
          <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
            <Row className="form_layout">
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Role Name *</Label>
                    <Input
                      style={{
                        border: "none",
                        outline: "none",
                        textTransform: "capitalize",
                      }}
                      id="afterfocus"
                      className="form-control not-empty"
                      type="text"
                      name="name"
                      onChange={handleInputChange}
                      value={formData && formData.name}
                      disabled={props.editRecord && props.showDetailsPage}
                    />
                  </div>
                  <span className="errortext">{errors.role_name}</span>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Description *</Label>
                    <Input
                      style={{
                        border: "none",
                        outline: "none",
                        textTransform: "capitalize",
                      }}
                      id="afterfocus"
                      className="form-control not-empty"
                      type="text"
                      name="description"
                      onChange={handleInputChange}
                      value={formData && formData.description}
                      disabled={props.editRecord && props.showDetailsPage}
                    />
                  </div>
                  <span className="errortext">{errors.role_desc}</span>
                </FormGroup>
              </Col>
            </Row>
            <div style={{ marginTop: "-19px" }}>
              <RoleDetails
                getStatusOfSelectedPermission={
                  props.getStatusOfSelectedPermission
                }
                setHalfChecked={props.setHalfChecked}
                halfChecked={props.halfChecked}
                nestedPermissions={props.nestedPermissions}
                editRecord={props.editRecord}
                expanded={props.expanded}
                setExpanded={props.setExpanded}
                selected={props.selected}
                setSelected={props.setSelected}
                disabled={props.editRecord && props.showDetailsPage}
              />
            </div>
            <Row style={{ paddingLeft: "20px", marginTop: "31px" }}>
              <span
                className="sidepanel_border"
                style={{ position: "relative", top: "5px" }}
              ></span>
              <Col>
                <FormGroup className="mb-0">
                  <button
                    class="btn btn-primary"
                    type="submit"
                    onClick={resetInputField}
                    id="create_button"
                    disabled={props.editRecord && props.showDetailsPage}
                  >
                    {" "}
                    {disable ? <Spinner size="sm"> </Spinner> : null}
                    {props.editRecord ? "Save" : Add}
                  </button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="button" color="btn btn-primary" id="resetid" onClick={props.dataClose}>
                    Cancel
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddRole;
