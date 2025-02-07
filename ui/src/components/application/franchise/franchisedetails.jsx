import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Form, Label, FormGroup } from "reactstrap";
import { franchiseaxios, servicesaxios } from "../../../axios";
// import {Globe} from "feather-icons";
import useFormValidation from "../../customhooks/FormValidation";
import isEmpty from "lodash/isEmpty";
import Packagelistselect from "./Packagelistselect";
import {toast} from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
const FranchiseDetails = (props) => {
  const { id } = useParams();
  const [franchiseStatus, setFranchiseStatus] = useState([]);
  const [franchiseType, setFranchiseType] = useState([]);
  const [franchiseSMS, setFranchiseSMS] = useState([]);
  const [franchiseRole, setFranchiseRole] = useState([]);
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  const [errors, setErrors] = useState({});

  //service package list from api
  const [servicelist, setServicelist] = useState([]);
  const [selectedplan, setSeletcedplan] = useState([]);

  useEffect(() => {
    setIsdisabled(true);

    if (!isEmpty(props.lead)) {
      let leadData = { ...props.lead };
      for (let key in leadData.address) {
        if (key !== "id") {
          leadData[key] = leadData.address[key];
        }
      }
      setLeadUser(leadData);
      console.log(leadData, "leaddata");
    }
  }, [props.rightSidebar]);

  useEffect(() => {
    franchiseaxios
      .get("franchise/update/" + id)
      // .then((res) => setData(res.data))
      .then((res) => {
        console.log(res);
        setLeadUser(res.data);
      });
  }, []);

  const handleChange = (e) => {
    if (
      e.target.name == "street" ||
      e.target.name == "city" ||
      e.target.name == "landmark" ||
      e.target.name == "country" ||
      e.target.name == "pincode" ||
      e.target.name == "district" ||
      e.target.name == "state"
    ) {
      let address = { ...leadUser.address, [e.target.name]: e.target.value };
      setLeadUser(() => ({ ...leadUser, address: address }));
    }

    if (
      e.target.name == "type" ||
      e.target.name == "status" ||
      e.target.name == "sms_gateway_type" ||
      e.target.name == "role"
    ) {
      setLeadUser((prev) => ({
        ...prev,
        [e.target.name]: { id: e.target.value },
      }));
    } else {
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const franchiseDetails = (id) => {
    let leaddata = {
      ...leadUser,
      type: { id: leadUser.type.id },
      status: { id: leadUser.status.id },
      role: { id: leadUser.role.id },
      sms_gateway_type: { id: leadUser.sms_gateway_type.id },
    };

    // e.preventDefault();
    franchiseaxios.patch("franchise/update/" + id, leaddata).then((res) => {
      console.log(res);
      console.log(res.data);
      props.onUpdate(res.data);
      toast.success("Franchise was edited successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose:1000
      });
      setIsdisabled(true);
    })
    .catch(function (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose:1000
      });
      console.error("Something went wrong!", error);
    });
  };

  const requiredFields = [
    "user_name",
    "franchise_code",
    "franchise_name",
    "role",
    "type",
    "revenue_sharing",
    "status",
    "renewal_bal",
    "outstanding_bal",
    "sms_gateway_type",
    "sms_balance",
    "street",
    "city",
    "landmark",
    "country",
    "pincode",
    "district",
    "state",
  ];

  const { validate, Error } = useFormValidation(requiredFields);

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;

    const validationErrors = validate(leadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      // console.log(inputs);
      franchiseDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
  };

  //dynamic options
  useEffect(() => {
    //franchiselist
    franchiseaxios
      .get("/franchise/options")
      .then((res) => {
        let { status, type, sms, role } = res.data;
        setFranchiseStatus([...status]);
        setFranchiseType([...type]);
        setFranchiseSMS([...sms]);
        setFranchiseRole([...role]);
        // setIsloaded(1);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    servicesaxios
      .get("plans/create")
      .then((res) => {
        console.log(res);
        const list = [...res.data].map((d) => {
          return { value: d.id, label: d.package_name };
        });
        const listselecedid = [...props.lead.plans].map((d) => d.plan);
        const selectedlist = list.filter((l) => {
          return listselecedid.includes(l.value);
        });
        setSeletcedplan(selectedlist);
        setServicelist(list);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Fragment>
      <EditIcon  className="icofont icofont-edit"  style={{ top: "10px", right:"56px" ,color:"#2572C5" }}   onClick={clicked}
       // disabled={isDisabled} 
      />

      <Container fluid={true}>
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row>
            {/* <Col md="3">
              <Label>Plans :</Label>
              <Packagelistselect
                servicelist={servicelist}
                selectedplan={selectedplan}
              />
            </Col> */}
            <Col md="3">
              <FormGroup>
            <div className="input_wrap">
            
              <input
                id="afterfocus"
                type="text"
                className="form-control digits not-empty"
                name="user_name"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.user_name}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
                <Label className="placeholder_styling">User Name :</Label>
              </div>
              <span className="errortext">{errors.user_name}</span>
              </FormGroup>
            </Col>

            <Col md="3">
            <FormGroup>
            <div className="input_wrap">             
              <input
               className="form-control digits not-empty"
                id="afterfocus"
                type="text"
                name="franchise_code"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.franchise_code}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <Label className="placeholder_styling">Franchise Code:</Label>
              </div>
              <span className="errortext">{errors.franchise_code}</span>
              </FormGroup>
            </Col>
            <Col md="3">
            <FormGroup>
            <div className="input_wrap">              
              <input
              className="form-control digits not-empty"
                type="text"
                name="franchise_name"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.franchise_name}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <Label className="placeholder_styling">Franchise Name :</Label>
              </div>
              <span className="errortext">{errors.franchise_name}</span></FormGroup>
            </Col>
          {/* </Row>
          <br />
          <Row> */}
            <Col md="3">
            <FormGroup>
            <div className="input_wrap">              
              <select
                id="afterfocus"
                type="select"
                name="role"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.role && leadUser.role.id}
                onChange={handleChange}
                // onBlur={blur}
                className="form-control digits not-empty"
                disabled={isDisabled}
              >
                {franchiseRole.map((franchiserole) => {
                  if (!!franchiserole && leadUser && leadUser.role) {
                    return (
                      <option
                        key={franchiserole.id}
                        value={franchiserole.id}
                        selected={
                          franchiserole.id == leadUser.role.id ? "selected" : ""
                        }
                      >
                        {franchiserole.name}
                      </option>
                    );
                  }
                })}
              </select>
              <Label className="placeholder_styling">Role :</Label>
              </div>
              <span className="errortext">{errors.role}</span>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
            <FormGroup>
            <div className="input_wrap"> 
              
              <select
                id="afterfocus"
                className="form-control digits not-empty"
                type="select"
                name="type"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.type && leadUser.type.id}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              >
                {franchiseType.map((franchisetype) => {
                  if (!!franchisetype && leadUser && leadUser.type) {
                    return (
                      <option
                        key={franchisetype.id}
                        value={franchisetype.id}
                        selected={
                          franchisetype.id == leadUser.type.id ? "selected" : ""
                        }
                      >
                        {franchisetype.name}
                      </option>
                    );
                  }
                })}
              </select>
              <Label className="placeholder_styling">Type :</Label>
              </div>
              <span className="errortext">{errors.type}</span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
            <FormGroup>
            <div className="input_wrap">              
              <input
              className="form-control digits not-empty"
                type="select"
                name="revenue_sharing"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.revenue_sharing}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <Label className="placeholder_styling"> Revenue Sharing </Label> 
              </div>
              <span className="errortext">{errors.revenue_sharing}</span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
            <FormGroup>
            <div className="input_wrap">             
              <select
              className="form-control digits not-empty"
                id="afterfocus"
                type="select"
                name="status"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.status && leadUser.status.id}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              >
                {franchiseStatus.map((franchisestatus) => {
                  if (!!franchisestatus && leadUser && leadUser.status) {
                    return (
                      <option
                        key={franchisestatus.id}
                        value={franchisestatus.id}
                        selected={
                          franchisestatus.id == leadUser.status.id
                            ? "selected"
                            : ""
                        }
                      >
                        {franchisestatus.name}
                      </option>
                    );
                  }
                })}
              </select>
              <Label className="placeholder_styling">Status :</Label>
              </div>
              <span className="errortext">{errors.status}</span>
              </FormGroup>
            </Col>
          {/* </Row>
          <br />
          <Row> */}
            <Col md="3" id="moveup">
            <FormGroup>
            <div className="input_wrap">                
              <input
                type="select"
                name="renewal_bal"
                className="form-control digits not-empty"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.renewal_amount}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <Label className="placeholder_styling"> Renewald Balance </Label> 
              </div>
              <span className="errortext">{errors.renewal_amount}</span>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
            <FormGroup>
            <div className="input_wrap">               
              <input
                type="select"
                name="outstanding_bal"
                className="form-control digits not-empty"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.outstanding_balance}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <Label className="placeholder_styling"> Outstanding Balance </Label> 
              </div>
              <span className="errortext">{errors.outstanding_balance}</span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
            <FormGroup>
            <div className="input_wrap">              
              <select
                id="afterfocus"
                type="select"
                className="form-control digits not-empty"
                name="sms_gateway_type"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.sms_gateway_type &&
                  leadUser.sms_gateway_type.id
                }
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              >
                {franchiseSMS.map((franchisesms) => {
                  if (!!franchisesms && leadUser && leadUser.sms_gateway_type) {
                    return (
                      <option
                        key={franchisesms.id}
                        value={franchisesms.id}
                        selected={
                          franchisesms.id == leadUser.sms_gateway_type.id
                            ? "selected"
                            : ""
                        }
                      >
                        {franchisesms.name}
                      </option>
                    );
                  }
                })}
              </select>
              <Label className="placeholder_styling">SMS Gateway Type :</Label>
              </div>
              <span className="errortext">{errors.sms_gateway_type}</span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
            <FormGroup>
            <div className="input_wrap">  
             
              <input
                type="select"
                className="form-control digits not-empty"
                name="sms_balance"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.sms_balance}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <Label className="placeholder_styling"> SMS Balance </Label> 
              </div>
              <span className="errortext">{errors.sms_balance}</span>
              </FormGroup>
            </Col>
          {/* </Row>
          <br />
          <Row> */}
            <Col md="3" id="moveup" >
              <FormGroup>
            <div className="input_wrap">  
              
              <input
                type="text"
                name="house_no"
                className="form-control digits not-empty"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.address &&
                  leadUser.address.id &&
                  leadUser.address.house_no
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <Label className="placeholder_styling">H.No :</Label>
              </div>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
            <div className="input_wrap"> 
             
              <input
                type="text"
                className="form-control digits not-empty"
                name="landmark"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.address &&
                  leadUser.address.id &&
                  leadUser.address.landmark
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <Label className="placeholder_styling">Landmark :</Label>
              </div>
              <span className="errortext">{errors.landmark}</span>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
            <div className="input_wrap"> 
             
              <input
                type="text"
                name="street"
                className="form-control digits not-empty"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.address &&
                  leadUser.address.id &&
                  leadUser.address.street
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <Label className="placeholder_styling">Street :</Label>
              </div>
              <span className="errortext">{errors.street}</span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
            <div className="input_wrap"> 
              
              <input
                type="text"
                name="city"
                className="form-control digits not-empty"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.address &&
                  leadUser.address.id &&
                  leadUser.address.city
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
              <Label className="placeholder_styling">City :</Label>
              </div>
              <span className="errortext">{errors.city}</span>
              </FormGroup>
            </Col>
          {/* </Row>
          <br />
          <Row> */}
            <Col md="3" id="moveup">
              <FormGroup>
            <div className="input_wrap"> 
             
              <input
                type="text"
                name="pincode"
                className="form-control digits not-empty"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.address &&
                  leadUser.address.id &&
                  leadUser.address.pincode
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <Label className="placeholder_styling">Pincode :</Label>
              </div>
              <span className="errortext">{errors.pincode}</span>
              </FormGroup>
            </Col>
 
            <Col md="3" id="moveup">
              <FormGroup>
            <div className="input_wrap"> 
             
              <input
                type="text"
                name="district"
                className="form-control digits not-empty"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.address &&
                  leadUser.address.id &&
                  leadUser.address.district
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <Label className="placeholder_styling">District :</Label>
              </div>
              <span className="errortext">{errors.district}</span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
            <div className="input_wrap">
              <input
                type="text"
                name="state"
                className="form-control digits not-empty"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.address &&
                  leadUser.address.id &&
                  leadUser.address.state
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <Label className="placeholder_styling">State :</Label>
               </div>
              <span className="errortext">{errors.state}</span>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>

            <div className="input_wrap"> 
             
              <input
                type="text"
                name="country"
                className="form-control digits not-empty"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.address &&
                  leadUser.address.id &&
                  leadUser.address.country
                }
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
               <Label className="placeholder_styling">Country :</Label>
              </div>
              <span className="errortext">{errors.country}</span>
              </FormGroup>

            </Col>
          </Row>
          <br />
          <Row></Row>
          <br />
          {/* <i class="icofont-tick-mark"></i> */}
          <button type="submit" name="submit" class="btn btn-primary">
            Save
          </button>
          &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            onClick={props.dataClose}
          >
            Cancel
          </button>
        </Form>
      </Container>
    </Fragment>
  );
};

export default FranchiseDetails;
