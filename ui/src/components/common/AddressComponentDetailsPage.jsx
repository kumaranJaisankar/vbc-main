import React, { useState, useEffect, useRef} from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";

import { transformAdress } from "./googleAddressFormat";

let autocomplete = "";

const AddressComponent = (props) => {
  const [addressData, setAddressData] = useState([]);
const addressRef = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      autocomplete = "";
      addressRef.current && 
      initAutocomplete();
    }, 0);
  },[]);

  //pass selected adress json to this function to get type and adress in object
  const fillInaddress = () => {
    const place = autocomplete.getPlace();
    if (!!place) {
      setAddressFields(transformAdress(place));
    }
  };

  //initialize google API
  const initAutocomplete = () => {
    // Create the autocomplete object, restricting the search to geographical location types.
    autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("pac-input-2")
    );
    // autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener("place_changed", fillInaddress);
    var inputSearch = document.getElementById("pac-input-2");
    window.google.maps.event.trigger(inputSearch, "focus", {});
    window.google.maps.event.trigger(inputSearch, "keydown", {
      keyCode: 13,
    });
  };

  const setAddressFields = (addressFound) => {
    props.setFormData((preState) => ({
      ...preState,
      address: {
        district: addressFound.administrative_area_level_2 || "",
        state: addressFound.administrative_area_level_1 || "",
        pincode: addressFound.postal_code || "",
        street: addressFound.nebourhood || "",
        city: addressFound.locality || "",
        country: addressFound.country || "",
        landmark: addressFound.sublocality_level_1 || "",
        street: addressFound.route || "",
        house_no: addressFound.street_number || "",
      },
    }));
    props.setInputs((inputs) => ({
      ...inputs,
      address: {
        district: addressFound.administrative_area_level_2 || "",
        state: addressFound.administrative_area_level_1 || "",
        pincode: addressFound.postal_code || "",
        street: addressFound.nebourhood || "",
        city: addressFound.locality || "",
        country: addressFound.country || "",
        landmark: addressFound.sublocality_level_1 || "",
        street: addressFound.route || "",
        house_no: addressFound.street_number || "",
      },
    }));
    setAddressData(addressFound);
  };

  useEffect(() => {
    if (!!props.formData) setAddressData(props.formData.address);
  }, [props.formData]);
  return (
    <>
      <Row style={{marginTop:"2%"}}>
        
        <div id="editmoveup" 
                    style={{ textAlign: "left", marginTop: "20px", fontSize:"19px", fontWeight:"600", fontFamily:"Open Sans",paddingLeft: "20px", position:"relative", top:"-25px" }} >
          Address
        </div>
      </Row>
    
    <br/>
      <Col sm="6" style={{position:"relative",left:"-15px"}}>
      <FormGroup>
        <div className="input_wrap">
          <Input
            className={`form-control not-empty afterfocus`}
            id="pac-input-2"
            // id="afterfocus"
            type="text"
            name="pac_input"
            disabled={props.isDisabled}
            style={{ border: "none", outline: "none",}}
            // onChange={props.handleInputChange}
            ref={addressRef}
            // ,backgroundColor:"#f9f6fb"
            // onBlur={props.checkEmptyValue}
          />
          <Label className="form_label">Google Address</Label>
        </div>
        <div
          style={{
            position: "absolute",
            top: "14%",
            left: "73%",
          }}
        ></div>
      </FormGroup>
      </Col>
      <div>
      <Row>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Input
                id="afterfocus"
                style={{ border: "none", outline: "none"}}
                // draft
                className={`form-control digits not-empty`}
                value={
                  props.formData &&
                  props.formData.address &&
                  props.formData.address.house_no
                }
                type="text"
                name="house_no"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
            <Label className="form_label">H.No </Label>
            <span className="errortext">{props.errors.house_no}</span>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            ></div>
          </FormGroup>
        </Col>

        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Input
               id="afterfocus"
               style={{ border: "none", outline: "none",textTransform:"capitalize" }}
                className={`form-control digits not-empty`}
                value={
                  props.formData &&
                  props.formData.address &&
                  props.formData.address.street
                }
                type="text"
                name="street"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="form_label">Street *</Label>
            <span className="errortext">{props.errors.street}</span>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            ></div>
          </FormGroup>
        </Col>

        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Input
                id="afterfocus"
                style={{ border: "none", outline: "none",textTransform:"capitalize" }}
                className={`form-control  not-empty`}
                value={
                  props.formData &&
                  props.formData.address &&
                  props.formData.address.landmark
                }
                type="text"
                name="landmark"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
                // value={props.formData && props.formData.landmark}
              />
              <Label className="form_label">Landmark *</Label>
            <span className="errortext">{props.errors.landmark}</span>
            </div>
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "73%",
              }}
            ></div>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Input
              id="afterfocus"
              style={{ border: "none", outline: "none",textTransform:"capitalize" }}
                // className={`form-control ${
                //   props.formData && !props.formData.city
                //   ? ""
                //   : "not-empty"
                //   }`}
                // draft
                className={`form-control  not-empty`}
                value={
                  props.formData &&
                  props.formData.address &&
                  props.formData.address.city
                }
                type="text"
                name="city"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
                // value={props.formData && props.formData.city}
              />
              <Label className="form_label">City *</Label>
            <span className="errortext">{props.errors.city}</span>
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
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm="3" id="moveup">
          <FormGroup>
            <div className="input_wrap">
              <Input
               id="afterfocus"
               style={{ border: "none", outline: "none" }}
                className={`form-control digits not-empty`}
                value={
                  props.formData &&
                  props.formData.address &&
                  props.formData.address.pincode
                }
                type="text"
                name="pincode"
                // value={props.formData && props.formData.pincode}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="form_label">Pincode *</Label>
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

        <Col sm="3" id="moveup">
          <FormGroup>
            <div className="input_wrap">
              <Input
              id="afterfocus"
              style={{ border: "none", outline: "none",textTransform:"capitalize" }}
                className={`form-control not-empty`}
                type="text"
                name="district"
                value={
                  props.formData &&
                  props.formData.address &&
                  props.formData.address.district
                }
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="form_label">District *</Label>
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
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap" id="moveup">
              <Input
              id="afterfocus"
              style={{ border: "none", outline: "none",textTransform:"capitalize"}}
                // draft
                className={`form-control digits not-empty`}
                value={
                  props.formData &&
                  props.formData.address &&
                  props.formData.address.state
                }
                type="text"
                name="state"
                // value={props.formData && props.formData.state}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="form_label">State *</Label>
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

        <Col sm="3" id="moveup">
          <FormGroup>
            <div className="input_wrap">
              <Input
              id="afterfocus"
              style={{ border: "none", outline: "none",textTransform:"capitalize" }}
                // draft
                className={`form-control digits not-empty`}
                value={
                  props.formData &&
                  props.formData.address &&
                  props.formData.address.country
                }
                type="text"
                name="country"
                onChange={props.handleInputChange}
                // value={props.formData && props.formData.country}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
              <Label className="form_label">Country *</Label>
            </div>

            <span className="errortext">{props.errors.country}</span>
          </FormGroup>
        </Col>
      </Row>
      </div>
    </>
  );
};

export default AddressComponent;
