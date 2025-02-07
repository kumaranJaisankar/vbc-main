import React, { useState, useEffect } from "react";
import {
  Col,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { networkaxios } from "../../../axios";
const AddNetwork = (props) => {
  // const [networkmodaltoggle, setNetworkmodaltoggle] = useState(false);
  // const networkcentertoggle = () => setNetworkmodaltoggle(!networkmodaltoggle);
 
 
  // const [custinfo, setCustinfo] = useState();
  // useEffect(() => {
  //   if (props.lead && props.lead.open_for) {
  //     customeraxios
  //       .get(`customers/${props.lead && props.lead.open_for}`)
  //       .then((res) => {
  //         console.log(res);
  //         setCustinfo(res.data);
  //       });
  //   }
  // }, [props.lead.open_for]);

  // nas list

 
 


 
// 
function checkEmptyValue(e) {
  if (e.target.value == "") {
    e.target.classList.remove("not-empty");
  } else {
    e.target.classList.add("not-empty");
  }
}


  return (
    <>
      <Col sm="3">
        <FormGroup>
          <div className="input_wrap">
          <Label className="kyc_label">Branch *</Label>
            <Input
              // draft
              className={`form-control digits not-empty`}
              value={
                JSON.parse(localStorage.getItem("token")) &&
                JSON.parse(localStorage.getItem("token")).branch &&
                JSON.parse(localStorage.getItem("token")).branch.name
              }
              type="text"
              name="branch"
              onChange={props.handleChange}
              style={{ textTransform: "capitalize" }}
              disabled={true}
            />
          
          </div>
        </FormGroup>
      </Col>
      <Col sm="3">
        <FormGroup>
          <div className="input_wrap">
          <Label className="kyc_label">NAS *</Label>
            <Input
              type="select"
              name="nas"
              className="form-control digits"
              onChange={props.handleChange}
              onBlur={checkEmptyValue}
              disabled={props.isEditDisabled}
              value={props && props.lead.nas ? props.lead.nas:""}
            >
              <option style={{ display: "none" }}></option>

              {props.nasList.map((nasname) => (
                <option key={nasname.id} value={nasname.id}>
                  {nasname.name}
                </option>
              ))}
            </Input>

          
          </div>
        </FormGroup>
      </Col>

      <Col sm="3">
      <FormGroup>
          <div className="input_wrap">
          <Label className="kyc_label">OLT *</Label>
            <Input
              type="select"
              name="olt"
              className="form-control digits"
              onChange={props.handleChange}
              value={props && props.lead.olt ? props.lead.olt:""}

              onBlur={checkEmptyValue}
              disabled={props.isEditDisabled}
            >
              <option style={{ display: "none" }}></option>

              {props.oltList.map((nasname) => (
                <option key={nasname.id} value={nasname.id} >
                  {nasname.name}
                </option>
              ))}
            </Input>

          
          </div>
        </FormGroup>
      </Col>
      <Col sm="3">
      <FormGroup>
          <div className="input_wrap">
          <Label className="kyc_label">DP *</Label>
            <Input
              type="select"
              name="dp"
              className="form-control digits"
              onChange={props.handleChange}
              value={props && props.lead.dp ? props.lead.dp:""}
              onBlur={checkEmptyValue}
              disabled={props.isEditDisabled}
            >
              <option style={{ display: "none" }}></option>

              {props.dplist.map((nasname) => (
                <option key={nasname.id} value={nasname.id}>
                  {nasname.name}
                </option>
              ))}
            </Input>

           
          </div>
        </FormGroup>
      </Col>
      <Col sm="3">
      <FormGroup>
          <div className="input_wrap">
          <Label className="kyc_label">Port *</Label>
            <Input
              type="select"
              name="port"
              className="form-control digits"
              onChange={props.handleChange}
              value={props && props.lead.port ? props.lead.port:""}
              onBlur={checkEmptyValue}
              disabled={props.isEditDisabled}
            >
              <option style={{ display: "none" }}></option>

              {props.portlist.map((nasname) => (
                <option key={nasname.id} value={nasname.id}>
                  {nasname.name}
                </option>
              ))}
            </Input>

           
          </div>
        </FormGroup>
      </Col>
      <Col sm="3">
        <FormGroup>
          <div className="input_wrap">
          <Label className="kyc_label">ONU MAC *</Label>
            <Input
              // draft
              className={`form-control digits`}
              value={props.lead && props.lead.onu_mac ? props.lead.onu_mac:"" }
              type="text"
              name="onu_mac"
              onChange={props.handleChange}
              style={{ textTransform: "capitalize" }}
              onBlur={checkEmptyValue}
              disabled={props.isEditDisabled}
            />
          
          </div>
        </FormGroup>
      </Col>
      <Col sm="3">
        <FormGroup>
          <div className="input_wrap">
          <Label className="kyc_label">Setup Box No *</Label>
            <Input
              // draft
              className={`form-control digits`}
              value={props.lead && props.lead.serial_no ? props.lead.serial_no : ""}
              type="text"
              name="serial_no"
              onChange={props.handleChange}
              style={{ textTransform: "capitalize" }}
              onBlur={checkEmptyValue}
              disabled={props.isEditDisabled}
            />
           
          </div>
        </FormGroup>
      </Col>
      <Col sm="3">
        <FormGroup>
          <div className="input_wrap">
          <Label className="kyc_label">Extension number *</Label>
            <Input
              // draft
              className={`form-control digits`}
              value={props.lead && props.lead.extension_no ? props.lead.extension_no:""}
              type="text"
              name="extension_no"
              onChange={props.handleChange}
              style={{ textTransform: "capitalize" }}
              onBlur={checkEmptyValue}
              disabled={props.isEditDisabled}
            />
           
          </div>
        </FormGroup>
      </Col>
      {/* <Button
        color="primary"
        onClick={() => networkcentertoggle()}
        style={{ height: "fit-content" }}
      >
        Add Network
      </Button>
      <Modal
        isOpen={networkmodaltoggle}
        toggle={networkcentertoggle}
        size="lg"
        centered
      >
        <ModalBody>
          <Row>
            <Col>
              <p>
                {" "}
                <b>Customer ID :</b>{" "}
                
                {custinfo && custinfo.radius && custinfo.radius.username}
              </p>
              <p>
                <b>Branch :</b> {custinfo && custinfo.branch}
              </p>
              <p>
                <b>Zone : </b>
                {custinfo && custinfo.zone}
              </p>
              <p>
                <b>Area : </b>
                {custinfo && custinfo.area}
              </p>
            </Col>
            <Col>
              <p>
                <b>Address</b>
              </p>
              <p>
                <b>H.No:</b>{" "}
                {custinfo && custinfo.address && custinfo.address.house_no}
              </p>
              <p>
                <b>Landmark:</b>{" "}
                {custinfo && custinfo.address && custinfo.address.landmark}
              </p>
              <p>
                <b>Street:</b>{" "}
                {custinfo && custinfo.address && custinfo.address.street}
              </p>
              <p>
                <b>City:</b>{" "}
                {custinfo && custinfo.address && custinfo.address.city}
              </p>
            </Col>
            <Col>
              <p></p>
              <p>
                <b>District:</b>{" "}
                {custinfo && custinfo.address && custinfo.address.district}
              </p>
              <p>
                <b>State:</b>{" "}
                {custinfo && custinfo.address && custinfo.address.state}
              </p>
              <p>
                <b>Country:</b>{" "}
                {custinfo && custinfo.address && custinfo.address.country}
              </p>
              <p>
                <b>Pincode:</b>{" "}
                {custinfo && custinfo.address && custinfo.address.pincode}
              </p>
            </Col>
          </Row>
          <Row>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="unit"
                    className="form-control digits not-empty"
                    onChange={(event) => {
                      props.handleChange(event);
                    }}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="H">OLT1</option>
                    <option value="D">OLT2</option>
                    <option value="W">OLT3</option>
                    <option value="M">OLT4</option>
                    <option value="Y">OLT5</option>
                  </Input>
                  <Label className="placeholder_styling"> OLT</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="unit"
                    className="form-control digits not-empty"
                    onChange={(event) => {
                      props.handleChange(event);
                    }}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="H">DP1</option>
                    <option value="D">DP2</option>
                    <option value="W">DP3</option>
                    <option value="M">DP4</option>
                    <option value="Y">DP5</option>
                  </Input>
                  <Label className="placeholder_styling"> DP</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="unit"
                    className="form-control digits not-empty"
                    onChange={(event) => {
                      props.handleChange(event);
                    }}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="H">CPE1</option>
                    <option value="D">CPE2</option>
                    <option value="W">CPE3</option>
                    <option value="M">CPE4</option>
                    <option value="Y">CPE5</option>
                  </Input>
                  <Label className="placeholder_styling"> CPE</Label>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={networkcentertoggle}>
            {"Cancel"}
          </Button>
          <Button color="primary" onClick={networkcentertoggle}>
            {"Save"}
          </Button>
        </ModalFooter>
      </Modal> */}
    </>
  );
};

export default AddNetwork;
