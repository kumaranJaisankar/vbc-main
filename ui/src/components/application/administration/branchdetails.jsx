import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Input, Form, Label } from "reactstrap";
// import {Globe} from "feather-icons";
import { franchiseaxios, adminaxios } from "../../../axios";
import useFormValidation from "../../customhooks/FormValidation";
import { toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import AddressComponentDetailsPage from "../../common/AddressComponentDetailsPage";
import EditIcon from '@mui/icons-material/Edit';

const BranchDetails = (props, initialValues) => {
  const { id } = useParams();

  const [errors, setErrors] = useState({});

  const [leadUser, setLeadUser] = useState(props.lead);
  const [update, setUpdate] = useState(true);
  const [isDisabled, setIsdisabled] = useState(true);
  const [resetStatus, setResetStatus] = useState(false);
  const [inputs, setInputs] = useState(initialValues);
  const [franchiselist, setFranchiselist] = useState([]);
  useEffect(() => {
    if (!!props.lead)
      setLeadUser((prevState) => {
        return {
          ...prevState,
          ...props.lead,
        };
      });
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);

    if (!isEmpty(props.lead)) {
      let leadData = { ...props.lead };
      for (let key in leadData.address) {
        if (key !== "id") {
          leadData[key] = leadData.address[key];
        }
      }
      if (!!props.lead)
        setLeadUser((prevState) => {
          return {
            ...prevState,
            ...props.lead,
          };
        });
    }
  }, [props.rightSidebar]);

  // useEffect(() => {
  //   axiosBaseURL
  //     .get("/radius/source/display")
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       // console.log(res);
  //       setLeadUser(res.data);
  //     });
  // }, []);

  const handleChange = (e) => {
    if (
      e.target.name == "street" ||
      e.target.name == "city" ||
      e.target.name == "landmark" ||
      e.target.name == "country" ||
      e.target.name == "pincode" ||
      e.target.name == "district" ||
      e.target.name == "state" ||
      e.target.name == "house_no"
    ) {
      let address = { ...leadUser.address, [e.target.name]: e.target.value };
      setLeadUser(() => ({ ...leadUser, address: address }));
    } else {
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  // const handleSubmit = (e, id) => {
  //   // if (e.key === "Enter" || e.key === "NumpadEnter") {
  //   e.preventDefault();
  //   adminaxios.patch(`/accounts/branch/${id}/rud`, leadUser).then((res) => {
  //     console.log(res);
  //     console.log(res.data);
  //     props.onUpdate(res.data);
  //     setIsdisabled(true);
  //   });
  //   // }
  // };

  const branchDetails = (id) => {
    if (!isDisabled) {
      adminaxios
        .patch(`/accounts/branch/${id}/rud`, leadUser)
        .then((res) => {
          props.onUpdate(res.data);
          toast.success("Branch updated successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          setIsdisabled(true);
        })
        .catch(function (error) {
          if (error.response && error.response.data) {
            setErrors(error.response.data);
          }
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          console.error("Something went wrong!", error);
        });
    }
  };
  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;

    const validationErrors = validate(leadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      branchDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };
  // const blur = (e) => {
  //   e.preventDefault();
  //   console.log("u clicked false");
  //   setIsdisabled(true);
  // };
  //validation
  // const requiredFields = [
  //   "house_no",
  //   "street",
  //   "landmark",
  //   "city",
  //   "pincode",
  //   "district",
  //   "state",
  //   "country",
  // ];
  const { validate, Error } = useFormValidation(requiredFields);

  // franchise
  useEffect(() => {
    franchiseaxios
      .get("franchise/display")
      .then((res) => {
        setFranchiselist([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <Fragment>
         {/* <EditIcon  className="icofont icofont-edit"  style={{ top: "10px", right:"56px" ,color:"#2572C5" }}   onClick={clicked}
       // disabled={isDisabled} 
      /> */}
    
      <Container fluid={true}>
        <br />
        <Form
        // onSubmit={(e) => {
        //   handleSubmit(e, props.lead.id);
        // }}
        >
          <Row>
            <Col md="4" id="moveup">
              <div className="input_wrap">
                <Input
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="text"
                  name="name"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.name}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={true}
                />

                <Label className="placeholder_styling">Branch</Label>
              </div>
            </Col>
            <span className="errortext">{errors.name}</span>

            {/* <Col md="4" id="moveup">
              <div className="input_wrap">
                <select
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="select"
                  name="franchise"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.franchise}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={isDisabled}
                >
                  {franchiselist.map((selectfranch) => {
                    if (selectfranch && leadUser) {
                      return (
                        <option
                          key={selectfranch.id}
                          value={selectfranch.id}
                          selected={
                            leadUser.selectfranch &&
                            selectfranch.id == leadUser.franchise.id
                              ? "selected"
                              : ""
                          }
                        >
                          {selectfranch.franchise_name}
                        </option>
                      );
                    }
                  })}
                </select>
                <Label className="placeholder_styling">Franchise *</Label>
              </div>
            </Col> */}
          </Row>
          <Row id="reaarangeaddress">
            <Col>
              <AddressComponentDetailsPage
                handleInputChange={handleChange}
                errors={errors}
                setFormData={setLeadUser}
                formData={leadUser}
                setInputs={setInputs}
                resetStatus={resetStatus}
                setResetStatus={setResetStatus}
                isDisabled={isDisabled}
              />
            </Col>
          </Row>
          {/* <Row>
            <Col sm="12">
              <h6>Address</h6>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <Label>H.No</Label>
              <input
                id="afterfocus"
                type="text"
                name="house_no"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.id && leadUser.address.house_no}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
             
              <span className="errortext">{errors.house_no}</span>
            </Col>
            <Col md="4">
              <Label>Landmark :</Label>
              <input
                type="text"
                name="landmark"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.id
                  && leadUser.address.landmark
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
            <span className="errortext">{errors.landmark}</span>

            </Col>


            <Col md="4">
              <Label>Street :</Label>
              <input
                type="text"
                name="street"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.id
                  && leadUser.address.street
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <span className="errortext">{errors.street}</span>

            </Col>


          </Row>
          <Row>
          <Col md="4">
              <Label>City</Label>
              <input
                id="afterfocus"
                type="text"
                name="city"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.address  && leadUser.address.city}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.city}</span>
            </Col>


         
            <Col md="4">
              <Label>Pin Code</Label>
              <input
                type="text"
                name="pincode"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.address && leadUser.address.pincode}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <span className="errortext">{errors.pincode}</span>
            </Col>




            <Col md="4">
              <Label>District</Label>
              <input
                id="afterfocus"
                type="text"
                name="district"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.address && leadUser.address.district}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.district}</span>
            </Col>
            <Col md="4">
              <Label>State</Label>
              <input
                id="afterfocus"
                type="text"
                name="state"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.address && leadUser.address.state}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.state}</span>
            </Col>
            <Col md="4">
              <Label>Country</Label>
              <input
                id="afterfocus"
                type="text"
                name="country"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.address && leadUser.address.country}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <span className="errortext">{errors.country}</span>
            </Col>
          </Row> */}
          <br />
          <button
            type="button"
            name="submit"
            class="btn btn-primary"
            onClick={(e) => {
              handleSubmit(e, props.lead.id);
            }}
          >
            Save
          </button>
          &nbsp;
          <button
            type="button"
            name="Cancel"
            class="btn btn-danger"
            onClick={props.dataClose}
          >
            Cancel
          </button>
        </Form>
      </Container>
    </Fragment>
  );
};

export default BranchDetails;
