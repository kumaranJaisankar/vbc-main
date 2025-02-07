import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Label, Input, Spinner } from "reactstrap";
// import {Globe} from "feather-icons";
import { default as axiosBaseURL, adminaxios } from "../../../axios";
import useFormValidation from "../../customhooks/FormValidation";
// import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { ADMINISTRATION } from "../../../utils/permissions";
import ErrorModal from "../../common/ErrorModal";

// Sailaja imported common component Sorting on 29th March 2023
import { Sorting } from "../../common/Sorting";
var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}
const DepartmentDetails = (props) => {
  const { id } = useParams();
  // const [roles, setRoles] = useState([]);
  // const [deptusers, setDeptUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  //to disable button
  const [disable, setDisable] = useState(false);
  useEffect(() => {
    if (props.lead) {
      let userids = [];
      if (props.lead.users) {
        userids = props.lead.users.map((u) => (u.id ? u.id : u));
      }
      let roleids = [];
      if (props.lead.roles) {
        roleids = props.lead.roles.map((r) => (r.id ? r.id : r));
      }

      let leaddata = {
        ...props.lead,
        // roles: [id]
        users: userids,
        roles: roleids,
      };
      setLeadUser({ ...leaddata });
    }
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    let userids = [];
    if (props.lead.users) {
      userids = props.lead.users.map((u) => u.id);
    }
    let roleids = [];
    if (props.lead.roles) {
      roleids = props.lead.roles.map((r) => r.id);
    }
    let leaddata = {
      ...props.lead,
      // roles: [id]
      users: userids,
      roles: roleids,
    };
    setLeadUser({ ...leaddata });
  }, [props.rightSidebar]);

  // useEffect(() => {
  //   console.log("departmet")
  //   axiosBaseURL
  //     .get("accounts/department/list")
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       // console.log(res);
  //       setLeadUser(res.data);
  //     });
  // }, []);

  const handleChange = (e) => {
    if (e.target.name == "roles" || e.target.name == "users") {
      setLeadUser((prev) => ({
        ...prev,
        [e.target.name]: [e.target.value],
      }));
    } else {
      setLeadUser((prev) => ({
        ...prev,
        [e.target.name]:
          e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
      }));
    }
    // setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    axiosBaseURL
      .get("accounts/department/list")

      .then((res) => {
        let { type, status } = res.data;
        setLeadUser(res.data);

        // setAssignedBy([...status]);
      })
      .catch((err) => console.log(err));
  }, []);
  // useEffect(() => {
  //   adminaxios
  //     .get("/accounts/options/all")
  //     .then((res) => {
  //       let { roles, users } = res.data;
  //       // setRoles([...roles]);
  //       // Sailaja sorting the Administration -> Department(Edit Panel)->Roles * Dropdown data as alphabetical order on 29th March 2023
  //       setRoles(Sorting(([...roles]),'name'))
  //       setDeptUsers([...users]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  // const handleSubmit = (e, id) => {
  //   // if (e.key === "Enter" || e.key === "NumpadEnter") {
  //   e.preventDefault();
  //   axiosBaseURL.patch(`/accounts/department/${id}/rud`, leadUser).then((res) => {
  //     console.log(res);
  //     console.log(res.data);
  //     props.onUpdate(res.data);
  //     setIsdisabled(true);
  //   });
  //   // }
  // };
  // https://sparkradius.in:7001/accounts/department/7/rud

  const deptDetails = (id) => {
    setDisable(true);
    // const userids = leadUser.users.map(u=>u.id)
    // let leaddata = {
    //   ...leadUser,
    //   // roles: [id]
    //   users:userids
    // };

    if (!isDisabled) {
      adminaxios
        .patch(`/accounts/department/${id}/rud`, leadUser)
        .then((res) => {
          setDisable(false);
          const role = props.roles.find((r) => r.id == res.data.roles[0]);
          const dep = props.deptusers.find((d) => d.id == res.data.users[0]);
          props.onUpdate({ ...res.data });
          // toast.success("Department was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setShowModal(true);
          setModalMessage("Department was edited successfully");
          setIsdisabled(true);
        })
        // .catch(function (error) {
        //   setDisable(false)
        //   if (error.response && error.response.data) {
        //     setErrors(error.response.data);
        //   }
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        //   console.error("Something went wrong!", error);
        // });
        // Modified by Marieya
        .catch(function (error) {
          setDisable(false);
          if (error.response && error.response.data) {
            setErrors(error.response.data);
            setModalMessage("Something went wrong");
          } else {
            setModalMessage("Something went wrong");
          }
          setShowModal(true);
          console.error("Something went wrong!", error);
        });

      // }
    }
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    let newleadUser = { ...leadUser };
    newleadUser.department_name = newleadUser.name;
    e = e.target.name;

    const validationErrors = validate(newleadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      deptDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };

  const requiredFields = ["department_name", "roles"];
  const { validate, Error } = useFormValidation(requiredFields);

  return (
    <Fragment>
      {token.permissions.includes(ADMINISTRATION.DEPTUPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "8px", right: "64px" }}
          id="edit_icon"
          onClick={clicked}
          // disabled={isDisabled}
        />
      )}
      <Container fluid={true}>
        <br />
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row style={{ marginTop: "35px" }}>
            <Col md="4" id="moveup">
              <div className="input_wrap">
                <Label className="kyc_label">
                  Department Name *
                </Label>
                <Input
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="text"
                  name="name"
                  style={{ border: "none", outline: "none"}}
                  value={leadUser && leadUser.name}
                  onChange={handleChange}
                  // onBlur={blur}
                  // disabled={true}
                  disabled={isDisabled}
                />
                <span className="errortext">{errors.department_name}</span>
              </div>
            </Col>

            <Col md="4" id="moveup">
              <div className="input_wrap">
                <select
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="select"
                  name="roles"
                  style={{ border: "none", outline: "none", marginTop: "30px" }}
                  value={leadUser && leadUser.roles && leadUser.roles[0]}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={isDisabled}
                >
                  <option value="">---</option>
                  {props.roles.map((leadsource) => {
                    if (!!leadsource && leadUser && leadUser.roles) {
                      return (
                        <option
                          key={leadsource.id}
                          value={leadsource.id}
                          selected={
                            leadsource.id == leadUser.roles[0] ? "selected" : ""
                          }
                        >
                          {leadsource.name}
                        </option>
                      );
                    }
                  })}
                </select>
                <Label className="form_label">Roles *</Label>
              </div>
              <span className="errortext">{errors.roles}</span>
            </Col>

            {/* <Col md="4" id="moveup">
              <div className="input_wrap">
              <select
                  className={`form-control digits not-empty`}
                id="afterfocus"
                type="select"
                name="users"
                style={{ border: "none", outline: "none", marginTop:"30px"  }}
                value={leadUser && leadUser.users && leadUser.users[0]}
                onChange={handleChange}
                disabled={isDisabled}
              >
                  <option value="">---</option>
                {deptusers.map((departmentusers) => {
                  if (!!departmentusers && leadUser && leadUser.users) {
                    return (
                      <option
                        key={departmentusers.id}
                        value={departmentusers.id}
                        selected={
                          departmentusers.id == leadUser.users[0]
                            ? "selected"
                            : ""
                        }
                      >
                        {departmentusers.username}
                      </option>
                    );
                  }
                })}
              </select>
              <Label className="form_label">Users *</Label>

              </div>
              <span className="errortext">{errors.users}</span>
            </Col> */}

            {/* <Col md="4">
              <Label>Roles</Label>
              <select
                id="afterfocus"
                type="select"
                name="roles[0].name"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.roles && leadUser.roles[0].name}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></select>
                <Error>{errors.roles}</Error>
                    <span className="errortext">{errors.roles && 'Please select role'}</span>

            </Col> */}
            {/* <Col md="4">
              <Label>Users</Label>
              <input
                id="afterfocus"
                type="text"
                name="users[0].username"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.users && leadUser.users[0].username}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
            </Col>
            <Error>{errors.users}</Error>
                    <span className="errortext">{errors.users && 'Please select User'}</span> */}

            <span
              className="sidepanel_border"
              style={{ position: "relative", top: "8px" }}
            ></span>
          </Row>
          <div style={{ marginTop: "-18px" }}>
            <br />
            <button
              type="submit"
              name="submit"
              class="btn btn-primary"
              id="save_button"
              disabled={disable}
            >
              {disable ? <Spinner size="sm"> </Spinner> : null}
              Save
            </button>
            &nbsp; &nbsp; &nbsp;
            <button
              type="submit"
              name="submit"
              class="btn btn-secondary"
              onClick={props.dataClose}
              id="resetid"
            >
              Cancel
            </button>
          </div>
        </Form>
        <ErrorModal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          message={modalMessage}
          action={() => setShowModal(false)}
        />
      </Container>
    </Fragment>
  );
};

export default DepartmentDetails;
