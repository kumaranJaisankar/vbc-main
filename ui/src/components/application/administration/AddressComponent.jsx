import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";

// import pincodeDirectory from 'india-pincode-lookup'
import { lookup } from "../../utilitycomponents/dummyPincodeDirectory";

import { Typeahead } from "react-bootstrap-typeahead";

const AddressComponent = (props) => {
  const [addressData, setAddressData] = useState([]);
  const [streetList, setStreetList] = useState([]);
  const [streetListObj, setStreetListObj] = useState([]);
  const [selectedStreet, setSelectedStreet] = useState([]);

  const setStreetListFun = (text) => {
    if (text !== "") {
      let listOfDataFound = lookup(text);
      let listOfStreet = listOfDataFound.map((data) => data.officeName);
      setStreetList(listOfStreet);
      setStreetListObj(listOfDataFound);
    } else {
      setStreetList([]);
      setAddressData([]);
      props.setFormData((preState) => ({
        ...preState,
        district: "",
        pincode: "",
        street: "",
        state: "",
        city: "",
        country: "",
        landmark: "",
        house_no: "",
      }));
    }
    props.setInputs((inputs) => ({
      ...inputs,
      district: "",
      pincode: "",
      street: "",
      state: "",
      city: "",
      country: "",
      landmark: "",
      house_no: "",
    }));
  };

  useEffect(() => {
    if (props.resetStatus) {
      setStreetListFun("");
      setSelectedStreet([]);
    }
  }, [props.resetStatus]);

  const setAddressDataFun = (text) => {
    let addressFound = lookup(text[0]);
    if (addressFound.length === 1) {
      setAddressData(addressFound[0]);
      props.setFormData((preState) => ({
        ...preState,
        district: addressFound[0].districtName,
        state: addressFound[0].stateName,
        pincode: addressFound[0].pincode,
        street: addressFound[0].officeName,
        city: addressFound[0].taluk,
      }));
      props.setInputs((inputs) => ({
        ...inputs,
        district: addressFound[0].districtName,
        state: addressFound[0].stateName,
        pincode: addressFound[0].pincode,
        street: addressFound[0].officeName,
        city: addressFound[0].taluk,
      }));
    } else if (streetListObj.length > 1) {
      let findAddress = streetListObj.find(
        (office) => office.officeName == text[0]
      );
      if (findAddress) {
        setAddressData(findAddress);
        props.setFormData((preState) => ({
          ...preState,
          district: findAddress.districtName,
          state: findAddress.stateName,
          pincode: findAddress.pincode,
          street: findAddress.officeName,
          city: findAddress.taluk,
        }));

        props.setInputs((inputs) => ({
          ...inputs,
          district: findAddress.districtName,
          state: findAddress.stateName,
          pincode: findAddress.pincode,
          street: findAddress.officeName,
          city: findAddress.taluk,
        }));
      }
    } else {
      setAddressData([]);
      props.setFormData((preState) => ({
        ...preState,
        district: "",
        pincode: "",
        city: "",
      }));

      props.setInputs((inputs) => ({
        ...inputs,
        district: "",
        state: "",
        pincode: "",
        street: "",
        city: "",
      }));
    }
  };

  return (
    <>
      <Row>
        <h6 style={{ paddingLeft: "20px" }}>Address</h6>
      </Row>
      <Row>
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                className="form-control"
                type="text"
                name="house_no"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                value={props.formData && props.formData.house_no}
                // draft
                className={`form-control digits ${
                  props.formData && props.formData.house_no ? "not-empty" : ""
                }`}
                // value={formData && formData.name}
              />
              <Label className="placeholder_styling">H.No *</Label>
            </div>
            {/* <div
              style={{
                position: 'absolute',
                top: '14%',
                left: '73%',
              }}
            >

            </div> */}
            <span className="errortext">{props.errors.house_no}</span>
          </FormGroup>
        </Col>

       


        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                className="form-control"
                type="text"
                name="street"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                value={props.formData && props.formData.street}
                
              />
              <Label className="placeholder_styling">Street *</Label>
            </div>
            <span className="errortext">{props.errors.street}</span>
           
          </FormGroup>
        </Col>
        {/* <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                className="form-control"
                type="hidden"
                name="street"
                value={addressData && addressData.officeName}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
              />
              <Typeahead
                id="public-methods-example"
                labelKey="officeName"
                single
                options={streetList}
                placeholder="Choose a street... *"
                selected={selectedStreet}
                onChange={(selected) => {
                  setAddressDataFun(selected);
                  setSelectedStreet(selected);
                }}
                onInputChange={(text) => setStreetListFun(text)}
              />
            </div>
            <span className="errortext">
              {props.errors.street && "Please Select Street"}
            </span>
          </FormGroup>
        </Col> */}
         <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // className="form-control"
                type="text"
                name="street"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                value={props.formData && props.formData.street}
                // draft
                className={`form-control digits ${
                  props.formData && props.formData.street ? "not-empty" : ""
                }`}
              />
              <Label className="placeholder_styling">Street</Label>
            </div>
            <span className="errortext">{props.errors.street}</span>
          </FormGroup>
        </Col> 
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // className="form-control"
                type="text"
                name="landmark"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                value={props.formData && props.formData.landmark}
                // draft
                className={`form-control digits ${
                  props.formData && props.formData.landmark ? "not-empty" : ""
                }`}
              />
              <Label className="placeholder_styling">Landmark</Label>
            </div>
            <span className="errortext">{props.errors.landmark}</span>
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // className="form-control"
                type="text"
                name="city"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                value={props.formData && props.formData.city}
                // placeholder="City *"
              />
              <Label className="placeholder_styling">City *</Label>
            </div>
            <span className="errortext">{props.errors.city}</span>

            {/* <div
              style={{
                position: 'absolute',
                top: '14%',
                left: '73%',
              }}
            > */}
            {/* {props.errors.city} */}

            {/* </div> */}
            {/* <span className="errortext">{props.errors.city}</span> */}
          </FormGroup>
        </Col>
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // className="form-control"
                type="text"
                name="pincode"
                // placeholder="Pincode *"
                value={props.formData && props.formData.pincode}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                 // draft
                 className={`form-control digits ${
                  props.formData && props.formData.pincode ? "not-empty" : ""
                }`}
              />
              <Label className="placeholder_styling">Pincode *</Label>
            </div>
            <span className="errortext">{props.errors.pincode}</span>

            {/* <div
              style={{
                position: 'absolute',
                top: '14%',
                left: '73%',
              }}
            > */}
            {/* {props.errors.pin_code} */}
            {/* </div> */}
            {/* <span className="errortext">{props.errors.pin_code && 'Enter Pin code'}</span> */}
          </FormGroup>
        </Col>
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // className="form-control"
                type="text"
                name="district"
                // placeholder="District *"
                value={props.formData && props.formData.district}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                // draft
                className={`form-control digits ${
                  props.formData && props.formData.district ? "not-empty" : ""
                }`}
              />
              <Label className="placeholder_styling">District *</Label>
            </div>
            <span className="errortext">{props.errors.district}</span>

            {/* <div
              style={{
                position: 'absolute',
                top: '14%',
                left: '73%',
              }}
            >
            </div> */}
            {/* <span className="errortext">{props.errors.district}</span> */}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        {/* <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                className="form-control"
                type="text"
                name="area"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                value={props.formData && props.formData.area}
              />
              <Label className="placeholder_styling">Area *</Label>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '14%',
                left: '73%',
              }}
            >
            </div>
           

          </FormGroup>
        </Col> */}

        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // className="form-control"
                type="text"
                name="state"
                // placeholder="State *"
                value={props.formData && props.formData.state}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                className={`form-control digits ${
                  props.formData && props.formData.state ? "not-empty" : ""
                }`}
              />
<Label className="placeholder_styling">state *</Label>
              
            </div>
            <span className="errortext">{props.errors.state}</span>

            {/* <div
              style={{
                position: 'absolute',
                top: '14%',
                left: '73%',
              }}
            >
            </div> */}
            {/* <span className="errortext">{props.errors.state}</span> */}
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // className="form-control"
                type="text"
                name="country"
                onChange={props.handleInputChange}
                value={props.formData && props.formData.country}
                // placeholder="Country *"
              />
              <Label className="placeholder_styling">country *</Label>
            </div>
            <span className="errortext">{props.errors.country}</span>

            {/* <div
              style={{
                position: 'absolute',
                top: '14%',
                left: '73%',
              }}
            >

            </div> */}
            {/* <span className="errortext">{props.errors.country}</span> */}
          </FormGroup>
        </Col>
      </Row>
      <Row></Row>
    </>
  );
};

export default AddressComponent;
