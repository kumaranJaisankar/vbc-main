import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";

import { transformAdress } from "../../common/googleAddressFormat";

let autocomplete = "";

const AddressComponent = (props) => {
  const [addressData, setAddressData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      autocomplete = "";
      initAutocomplete();
    }, 0);
  });
  //pass selected adress json to this function to get type and adress in object
  const fillInaddress = () => {
    const place = autocomplete.getPlace();
    if (!!place) {
      const location = place.geometry.location;
      setAddressFields(
        transformAdress(place),
        place ? place.formatted_address : "",
        location
      );
    }
  };
  //initialize google API
  const initAutocomplete = () => {
    // Create the autocomplete object, restricting the search to geographical location types.
    autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("pac-input")
    );
    // autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
    autocomplete.addListener("place_changed", fillInaddress);
    var inputSearch = document.getElementById("pac-input");
    window.google.maps.event.trigger(inputSearch, "focus", {});
    window.google.maps.event.trigger(inputSearch, "keydown", {
      keyCode: 13,
    });
  };
  const setAddressFields = (addressFound, formatted_address, location) => {
    props.setFormData((preState) => ({
      ...preState,
      district: addressFound.administrative_area_level_2 || "",
      state: addressFound.administrative_area_level_1 || "",
      pincode: addressFound.postal_code || "",
      street: addressFound.nebourhood || "",
      city: addressFound.locality || "",
      country: addressFound.country || "",
      landmark: addressFound.sublocality_level_1 || "",
      street: addressFound.route || "",
      house_no: addressFound.street_number || "",
      googleAddress: formatted_address || "",
    }));
    props.setInputs((inputs) => ({
      ...inputs,
      district: addressFound.administrative_area_level_2 || "",
      state: addressFound.administrative_area_level_1 || "",
      pincode: addressFound.postal_code || "",
      street: addressFound.nebourhood || "",
      city: addressFound.locality || "",
      country: addressFound.country || "",
      landmark: addressFound.sublocality_level_1 || "",
      street: addressFound.route || "",
      house_no: addressFound.street_number || "",
      googleAddress: formatted_address || "",
    }));
    setAddressData(addressFound);
  };
  return (
    <>
      <Row style={{ marginTop: "2%" }}>
        <div
          id="editmoveup"
          style={{
            textAlign: "left",
            marginTop: "20px",
            fontSize: "19px",
            fontWeight: "600",
            fontFamily: "Open Sans",
            paddingLeft: "20px",
            position: "relative",
            top: "-25px",
          }}
        >
          Address
        </div>
      </Row>
      <FormGroup id="moveup">
        <div className="input_wrap">
          <Label className="kyc_label">Google Address</Label>
          <Input
            className={`form-control digits not-empty afterfocus`}
            id="pac-input"
            type="text"
            name="googleAddress"
            style={{ border: "none", outline: "none", width: "45%" }}
            disabled={props.isDisabled}
          />
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
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">H.No</Label>
              <Input
                id="afterfocus"
                style={{
                  border: "none",
                  outline: "none",
                  textTransform: "capitalize",
                }}
                // draft
                className={`form-control digits ${
                  props.formData && props.formData.house_no ? "not-empty" : ""
                }`}
                value={props.formData && props.formData.house_no}
                type="text"
                name="house_no"
                onChange={props.handleInputChange}
                // onBlur={props.checkEmptyValue}
                onBlur={(e) =>
                  props.handleInputBlur(e,"house_no")                  
                  }
                disabled={props.isDisabled}
              />
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
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Street /Building *</Label>
              <Input
                id="afterfocus"
                style={{
                  border: "none",
                  outline: "none",
                  textTransform: "capitalize",
                }}
                // draft
                className={`form-control digits ${
                  props.formData && props.formData.street ? "not-empty" : ""
                }`}
                value={props.formData && props.formData.street}
                type="text"
                name="street"
                onChange={props.handleInputChange}
                // onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation */}
                onBlur={(e) =>
                  props.handleInputBlur(e,"street")                  
                  }
                disabled={props.isDisabled}
              />
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
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Landmark *</Label>
              <Input
                id="afterfocus"
                style={{
                  border: "none",
                  outline: "none",
                  textTransform: "capitalize",
                }}
                // draft
                className={`form-control  ${
                  props.formData && props.formData.landmark ? "not-empty" : ""
                }`}
                value={props.formData && props.formData.landmark}
                type="text"
                name="landmark"
                onChange={props.handleInputChange}
                // onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation */}
                onBlur={(e) =>
                  props.handleInputBlur(e, "landmark")                  
                  }
                disabled={props.isDisabled}
              />
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
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">City *</Label>
              <Input
                id="afterfocus"
                style={{
                  border: "none",
                  outline: "none",
                  textTransform: "capitalize",
                }}
                // draft
                className={`form-control  ${
                  props.formData && props.formData.city ? "not-empty" : ""
                }`}
                value={props.formData && props.formData.city}
                type="text"
                name="city"
                onChange={props.handleInputChange}
               // onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation */}
               onBlur={(e) =>
                props.handleInputBlur(e, "city")                  
                }
                disabled={props.isDisabled}
              />
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
      </Row>
      <Row>
        <Col sm="3" id="moveup">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Pincode *</Label>
              <Input
                id="afterfocus"
                style={{ border: "none", outline: "none" }}
                // draft
                className={`form-control digits ${
                  props.formData && props.formData.pincode ? "not-empty" : ""
                }`}
                value={props.formData && props.formData.pincode}
                type="text"
                name="pincode"
                onChange={props.handleInputChange}
                // onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation */}
                onBlur={(e) =>
                  props.handleInputBlur(e, "pincode")                  
                  }
                disabled={props.isDisabled}
              />
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
              <Label className="kyc_label">District *</Label>
              <Input
                id="afterfocus"
                style={{
                  border: "none",
                  outline: "none",
                  textTransform: "capitalize",
                }}
                className={`form-control ${
                  props.formData && !props.formData.district ? "not-empty" : ""
                }`}
                type="text"
                name="district"
                value={props.formData && props.formData.district}
                onChange={props.handleInputChange}
                // onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation */}
                onBlur={(e) =>
                  props.handleInputBlur(e, "district")                  
                  }
                disabled={props.isDisabled}
              />
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
        <Col sm="3" id="moveup">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">State *</Label>
              <Input
                id="afterfocus"
                style={{
                  border: "none",
                  outline: "none",
                  textTransform: "capitalize",
                }}
                // draft
                className={`form-control digits ${
                  props.formData && props.formData.state ? "not-empty" : ""
                }`}
                value={props.formData && props.formData.state}
                type="text"
                name="state"
                onChange={props.handleInputChange}
                 // onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation */}
                 onBlur={(e) =>
                  props.handleInputBlur(e, "state")                  
                  }
                disabled={props.isDisabled}
              />
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
              <Label className="kyc_label">Country *</Label>
              <Input
                id="afterfocus"
                style={{
                  border: "none",
                  outline: "none",
                  textTransform: "capitalize",
                }}
                // draft
                className={`form-control digits ${
                  props.formData && props.formData.country ? "not-empty" : ""
                }`}
                value={props.formData && props.formData.country}
                type="text"
                name="country"
                onChange={props.handleInputChange}
                 // onBlur={props.checkEmptyValue} {/*Sailaja Commeted out this function for form_validation */}
                 onBlur={(e) =>
                  props.handleInputBlur(e, "country")                  
                  }
                disabled={props.isDisabled}
              />
            </div>
            <span className="errortext">{props.errors.country}</span>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};
AddressComponent.defaultProps = {
  showLatLng: true,
};
export default AddressComponent;
