import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Label ,Spinner} from "reactstrap";
// import { toast } from "react-toastify";
import useFormValidation from "../../../customhooks/FormValidation";
import EditIcon from "@mui/icons-material/Edit";
// import {Globe} from "feather-icons";
import { adminaxios } from "../../../../axios";
import { ADMINISTRATION } from "../../../../utils/permissions";
import ErrorModal from "../../../common/ErrorModal";

// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../common/Sorting";

var storageToken = localStorage.getItem("token");
 if (storageToken !== null) {
  var token = JSON.parse(storageToken) ;
}
const ZoneDetail = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [assignBranch, setAssignBranch] = useState([]);
  const [isDisabled, setIsdisabled] = useState(true);
    //to disable button
    const [disable, setDisable] = useState(false);
  useEffect(() => {
    setLeadUser(props.lead);
    setDisable(false)
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true); 
    setDisable(false)
    setLeadUser(props.lead);
  }, [props.rightSidebar]);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value.charAt(0).toUpperCase() +  e.target.value.slice(1) }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  //function for validation
  const zoneDetails = (id,newleadUser) => {
    setDisable(true)
    setIsdisabled(true)
    if (!isDisabled) {
      const validationErrors = validate(newleadUser);
      const noErrors = Object.keys(validationErrors).length === 0;
      setErrors(validationErrors);
      adminaxios
        .put("accounts/zone/" + id + "/rud", newleadUser)
        .then((res) => {
          setDisable(false)
          props.onUpdate(res.data);
          // toast.success("Zone was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setShowModal(true);
          setModalMessage("Zone was edited successfully");
          props.Refreshhandler()
          setIsdisabled(true);
        })
        .catch(function (error) {
          setDisable(false);
          setIsdisabled(false);
        // Modified by Marieya
          setShowModal(true); // Set the modal to be visible
          const status = error.response ? error.response.status : null;
        
          // Customize the error message based on the status code
          if (status === 500) {
            setModalMessage("Internal Server Error");
          } else {
            setModalMessage("Something went wrong");
          }
        
          console.error("Something went wrong!", error);
        });
        
        // .catch(function (error) {
        //   setDisable(false)
        //   setIsdisabled(false);
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        // });
      // }
    }
  };
  //end

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    let newleadUser = { ...leadUser };
      newleadUser.zone_area_code = newleadUser.code;
      newleadUser.zone_name = newleadUser.name;
    const validationErrors = validate(newleadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      zoneDetails(id,newleadUser);
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  // const handleSubmit = (e, id) => {
  //   e.preventDefault();
  //   let newleadUser = { ...leadUser };
  //   newleadUser.area_code = newleadUser.code;
  //   if (!isDisabled) {
  //     const validationErrors = validate(newleadUser);
  //     const noErrors = Object.keys(validationErrors).length === 0;
  //     setErrors(validationErrors);
  //     adminaxios
  //       .put("accounts/zone/" + id + "/rud", newleadUser)
  //       .then((res) => {
  //         console.log(res);
  //         console.log(res.data);
  //         props.onUpdate(res.data);
  //         toast.success("Zone was edited successfully", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1000,
  //         });
  //         setIsdisabled(true);
  //       })
  //       .catch(function (error) {
  //         toast.error("Something went wrong", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1000,
  //         });
  //         console.error("Something went wrong!", error);
  //       });
  //     // }
  //   }
  // };



  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };

  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // let name = res.data.map(branch=>branch.name);

        // setAssignBranch([...res.data]);
        // Sailaja sorting the Zone Configuration/Zone Edit -> Branch Dropdown data as alphabetical order on 24th March 2023
        setAssignBranch(Sorting([...res?.data],'name'));

      })
      .catch((err) => console.log(err));
  }, []);

  const requiredFields = ["zone_name","zone_area_code","branch"];
  const { validate, Error } = useFormValidation(requiredFields);

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  useEffect(()=>{
    if(props.openCustomizer){
      setErrors({});
    }
  }, [props.openCustomizer]);
{/* Sailaja fixed Zone Config/Zone Edit icon position by modify style top: "18px", on 12th August */}
  return (
    <Fragment>
      {token.permissions.includes(ADMINISTRATION.ZONEUPDATE) && (

      <EditIcon
        className="icofont icofont-edit"
        style={{ top: "18px", right: "64px" }} id="edit-icon"
        onClick={clicked}
        // disabled={isDisabled}
      />
      )}

      <br />
      <Container fluid={true}>
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row style={{marginTop:"1%"}}>
            <Col md="4" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Zone Name *</Label>

                <input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="text"
                  name="name"
                  style={{
                    border: "none",
                    outline: "none",
                    textTransform: "capitalize",
                  }}
                  value={leadUser && leadUser.name}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={isDisabled}
                ></input>
              </div>
              <span className="errortext">{errors.zone_name}</span>

            </Col>
            <Col md="4" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Branch *</Label>

                <select
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="select"
                  name="branch"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.branch}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={isDisabled}
                >
                  {assignBranch.map((leadtype) => {
                    if (!!leadtype && leadUser && leadUser.branch) {
                      return (
                        <option
                          key={leadtype.id}
                          value={leadtype.id}
                          selected={
                            leadtype.id == leadUser.branch.id ? "selected" : ""
                          }
                        >
                          {leadtype.name}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
              <span className="errortext">{errors.branch && "Selection is required" }</span>

            </Col>
            <Col md="4" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Zone Code *</Label>

                <input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="text"
                  name="code"
                  style={{
                    border: "none",
                    outline: "none",
                    textTransform: "capitalize",
                  }}
                  value={leadUser && leadUser.code}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={isDisabled}
                ></input>
              </div>
              <span className="errortext">{errors.zone_area_code}</span>
            </Col>
          </Row>
          <Row style={{marginTop:"-2%"}}>
          <span className="sidepanel_border" style={{position:"relative", top:"24px"}}></span>
          </Row>
          <br />
          <button type="submit" name="submit" class="btn btn-primary" id ="save_button" disabled={isDisabled}>
          {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp;
          &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            onClick={props.dataClose}
            id="resetid"
          >
            Cancel
          </button>
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

export default ZoneDetail;
