import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";


import { transformAdress } from "./googleAddressFormat";

let autocomplete='';

const AddressComponent = (props) => {
  const [addressData, setAddressData] = useState([]);
  const [streetList, setStreetList] = useState([]);
  const [streetListObj, setStreetListObj] = useState([]);
  const [selectedStreet, setSelectedStreet] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      autocomplete ='';
      initAutocomplete();
    }, 0);
  });

  //pass selected adress json to this function to get type and adress in object
  const fillInaddress = () => {
    const place = autocomplete.getPlace();
    if(!!place){
      setAddressFields(transformAdress(place));
    }

  };

  

  //initialize google API
  const initAutocomplete = () => {
    // Create the autocomplete object, restricting the search to geographical location types.
    autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("pac-input-details")
    );
    // autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener("place_changed", fillInaddress);

  };
  

  const setAddressFields = (addressFound) => {
    props.setFormData((preState) => ({
      ...preState,
      address:{
        district: addressFound.administrative_area_level_2 || '',
        state: addressFound.administrative_area_level_1 || '',
        pincode: addressFound.postal_code || '',
        street: addressFound.nebourhood || '',
        city: addressFound.locality || '',
        country:addressFound.country || '',
        landmark: addressFound.sublocality_level_1 || '',
        street: addressFound.route || '',
        house_no: addressFound.street_number || ''
      }
   
    }));
    props.setInputs((inputs) => ({
      ...inputs,
      address:{
        district: addressFound.administrative_area_level_2 || '',
        state: addressFound.administrative_area_level_1 || '',
        pincode: addressFound.postal_code || '',
        street: addressFound.nebourhood || '',
        city: addressFound.locality || '',
        country:addressFound.country || '',
        landmark: addressFound.sublocality_level_1 || '',
        street: addressFound.route || '',
        house_no: addressFound.street_number || ''
      }
    }));
    setAddressData(addressFound);
  };

  useEffect(()=>{
    if(!!props.formData)
    setAddressData(props.formData);
  },[props.formData])
  return (
    <>
      <Row>
        <h6 style={{ paddingLeft: "20px" }}>Address</h6>
      </Row>
      <br/>
      {/* <Col sm="12"> */}
        <FormGroup>
          <div className="input_wrap">
            <Input
              className="form-control not-empty"
              id="pac-input-details"
              type="text"
              name="pac_input"
              disabled={props.isDisabled}
              // onChange={props.handleInputChange}
              // onBlur={props.checkEmptyValue}
            />
            <Label className="placeholder_styling">Google Address</Label>
          </div>
          <div
            style={{
              position: "absolute",
              top: "14%",
              left: "73%",
            }}
          ></div>
        </FormGroup>
      {/* </Col> */}
      <Row>
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // draft
                className={`form-control digits not-empty`}
                value={props.formData && props.formData.house_no}
                type="text"
                name="house_no"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="placeholder_styling">H.No *</Label>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            ></div>
            <span className="errortext">{props.errors.house_no}</span>
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // draft
                className={`form-control digits not-empty`}
                value={props.formData && props.formData.street}
                type="text"
                name="street"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="placeholder_styling">street *</Label>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            ></div>
            <span className="errortext">{props.errors.street}</span>
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // draft
                className={`form-control  not-empty`}
                value={props.formData && props.formData.landmark}
                type="text"
                name="landmark"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
                // value={props.formData && props.formData.landmark}
              />
              <Label className="placeholder_styling">Landmark *</Label>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            ></div>
            <span className="errortext">{props.errors.landmark}</span>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // className={`form-control ${
                //   props.formData && !props.formData.city
                //   ? ""
                //   : "not-empty"
                //   }`}
                // draft
                className={`form-control  not-empty`}
                value={props.formData && props.formData.city}
                type="text"
                name="city"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
                // value={props.formData && props.formData.city}
              />
              <Label className="placeholder_styling">City *</Label>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            >
              {/* {props.errors.city} */}
            </div>
            <span className="errortext">{props.errors.city}</span>
          </FormGroup>
        </Col>
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // draft
                className={`form-control digits not-empty`}
                value={props.formData &&  props.formData.pincode}
                type="text"
                name="pincode"
                // value={props.formData && props.formData.pincode}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="placeholder_styling">Pincode *</Label>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            ></div>
            <span className="errortext">{props.errors.pincode}</span>
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                className={`form-control not-empty`}
                type="text"
                name="district"
                value={props.formData &&  props.formData.district}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="placeholder_styling">District *</Label>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            ></div>
            <span className="errortext">{props.errors.district}</span>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // draft
                className={`form-control digits not-empty`}
                value={props.formData && props.formData.state}
                type="text"
                name="state"
                // value={props.formData && props.formData.state}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="placeholder_styling">State *</Label>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            ></div>
            <span className="errortext">{props.errors.state}</span>
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <Input
                // draft
                className={`form-control digits not-empty`}
                value={props.formData &&  props.formData.country}
                type="text"
                name="country"
                onChange={props.handleInputChange}
                // value={props.formData && props.formData.country}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="placeholder_styling">Country *</Label>
            </div>

            <span className="errortext">{props.errors.country}</span>
          </FormGroup>
        </Col>
      </Row>
      <Row></Row>
    </>
  );
};

export default AddressComponent;
