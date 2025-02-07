import React, { useEffect, useState, useRef } from "react";
import {
  Row,
  Col,
  Label,
  Input,
  Container,
  FormGroup,
  Button,
  Form,
  ModalBody,
  Modal,
  ModalFooter, Spinner
} from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { toast } from "react-toastify";
import { adminaxios } from "../../../axios";
import RoleDetails from "./roledetails";

const ManageUserPermissions = (props) => {
  const [formData, setFormData] = useState({
    unit: "H",
  });
  const [errors, setErrors] = useState({});
  const [userList, setUserList] = useState([]);
  const [userListSearching, setUserListSearching] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [resetStatus, setResetStatus] = useState(false);
  const [userRecord, setUserRecord] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const showPermission = () => setShowPermissionModal(!showPermissionModal)
  // soinner loader
  const [loaderSpinneer, setLoaderSpinner] = useState(false)
  // handle change
  const handleInputChange = (event) => {
    event.persist();
    setResetStatus(false);
    const target = event.target;
    var value = target.value;
    const name = target.name;
    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
  };


  // reset function call
  const form = useRef(null);

  const resetForm = function () {
    setResetStatus(true);
    setFormData({
      permissions: [],
      roles: "",
      unit: "H",
      ttl: "",
    });
    setSelectedUser([]);
    setUserListSearching([]);
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  // get all users api call
  useEffect(() => {
    adminaxios.get(`accounts/users`).then((res) => {
      setUserList([...res.data]);
    });
  }, []);

  // permission update api call
  const onClickofYyes = () => {
    setLoaderSpinner(true)
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    adminaxios
      .patch(
        `/accounts/user/${selectedUser[0].id}/permission/update`,
        {
          permissions: [...props.selected, ...props.halfChecked],
          ttl: formData.ttl,
          unit: formData.unit,
        },
        config
      )
      .then(() => {
        setLoaderSpinner(false)
        props.closeCustomizer();
        toast.success("permissions added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
        setShowPermissionModal(false)
        resetForm();
        props.Refreshhandler();
      })
      .catch(function (error) {
        setLoaderSpinner(false)
        toast.error("Something went wrong!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
        console.error("Something went wrong!", error);
      });
  };

  // submit function
  const submit = (e) => {
    e.preventDefault();
    // onClickofYyes();
  };

  // get all the permission for user
  useEffect(() => {
    if (selectedUser.length > 0) {
      adminaxios
        .get(`/accounts/user/${selectedUser[0].id}/permissions`)
        .then((res) => {
          const rolenames = res.data.roles.map((r) => r.name);
          props.setSelected(res.data?.permissions?.map(item => item.id));
          console.log(res?.data?.permissions, "permissions")
          setFormData((preState) => {
            return { ...preState, roles: rolenames.join(",") };
          });
          setUserRecord(res.data);
        });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!props.rightSidebar) {
      resetForm();
    }
  }, [props.rightSidebar]);

  return (
    <Container fluid={true}
      className="openmodal"
    >
      <Form onSubmit={submit} id="myForm2" onReset={resetForm} ref={form}>
        <Row>
          <Col sm="4">
            <FormGroup>
              <div className="input_wrap">
                <Input

                  className="form-control"
                  type="hidden"
                  name="username"
                  value={formData && formData.username}
                  onChange={handleInputChange}
                  onBlur={checkEmptyValue}
                />
                <Typeahead
                  style={{ marginTop: "9%" }}
                  className="openmodal"
                  id="usernameId"
                  labelKey="username"
                  single
                  options={userListSearching}
                  placeholder="Search Username"
                  selected={selectedUser}
                  onChange={(selected) => setSelectedUser(selected)}
                  onInputChange={(text) => {
                    if (text !== "") {
                      let arrFilter = userList.filter(
                        (a) =>
                          a.username
                            .toLowerCase()
                            .indexOf(text.toLowerCase()) !== -1
                      );
                      setUserListSearching(arrFilter);
                    } else {
                      setUserListSearching([]);
                    }
                  }}
                />

              </div>
            </FormGroup>
          </Col>
          <Col sm="4">
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">Roles *</Label>

                <Input
                  // draft
                  className={`form-control digits not-empty ${formData && formData.roles ? "not-empty" : ""
                    }`}
                  value={formData && formData.roles}
                  type="text"
                  name="roles"
                  readOnly={true}
                />
              </div>
            </FormGroup>
          </Col>
        </Row>
        <RoleDetails
          nestedPermissions={props.nestedPermissions}
          setNestedPermissions={props.setNestedPermissions}
          expanded={props.expanded}
          setHalfChecked={props.setHalfChecked}
          halfChecked={props.halfChecked}
          setExpanded={props.setExpanded}
          selected={props.selected}
          setSelected={props.setSelected}
          editRecord={userRecord}
          disabled={userRecord && props.showDetailsPage}
        />
        <Row style={{ paddingLeft: "20px", marginTop: "31px" }}>
          <span
            className="sidepanel_border"
            style={{ position: "relative", top: "5px" }}
          ></span>
          <Col>
            <FormGroup className="mb-0">
              <Button
                color="btn btn-primary"
                type="submit"
                className="mr-3"
                id="create_button"
                onClick={showPermission}
              >
                Save
              </Button>
              {/*Added Cancel button by Marieya on 22/8/22*/}
              <Button type="button" id="resetid" color="btn btn-primary" onClick={props.dataClose}>
                Cancel
              </Button>
            </FormGroup>
          </Col>
        </Row>
        {/* modal */}

        <Modal isOpen={showPermissionModal} centered>
          <ModalBody>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="number"
                      name="ttl"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      className={`form-control digits ${formData && formData.ttl ? "not-empty" : ""
                        }`}
                      value={formData && formData.ttl}
                      min="1"
                      onKeyDown={(evt) =>
                        (evt.key === "e" ||
                          evt.key === "E" ||
                          evt.key === "." ||
                          evt.key === "-") &&
                        evt.preventDefault()
                      }
                    />

                    <Label className="placeholder_styling">Expiry *</Label>
                  </div>
                  <span className="errortext">{errors.name}</span>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="unit"
                      className={`form-control ${formData && !formData.unit ? "" : "not-empty"
                        }`}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      value={formData.unit}
                      onBlur={checkEmptyValue}
                    >
                      <option value="H">Hour</option>
                      <option value="D">Day</option>
                      <option value="W">Week</option>
                      <option value="M">Month</option>
                      <option value="Y">Year</option>
                      <option value="P">permanent</option>
                    </Input>
                    <Label className="placeholder_styling">Unit Type *</Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={showPermission}>
              {"Cancel"}
            </Button>
            <Button color="primary" onClick={onClickofYyes}
              disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
            >
              {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp; {"Yes"}
            </Button>
          </ModalFooter>
        </Modal>
      </Form>


    </Container>
  );
};

export default ManageUserPermissions;
