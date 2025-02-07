import React, { useCallback,useEffect } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import Button from "@mui/material/Button";
import MyLocationIcon from '@mui/icons-material/MyLocation';

const AddressComponent = (props) => {
  const setAddressFields = (addressFound) => {
    props.setFormData((preState) => ({
      ...preState,
      district: addressFound.district || '',
      state: addressFound.state || '',
      pincode: addressFound.pincode || '',
      street: addressFound.street || '',
      city: addressFound.city || '',
      country: addressFound.area || '',
      landmark: addressFound.subLocality || '',
      house_no: addressFound.houseNumber || '',
      latitude: addressFound.lat,
      longitude: addressFound.lng,
    }));
    props.setInputs((inputs) => ({
      ...inputs,
      district: addressFound.district || '',
      state: addressFound.state || '',
      pincode: addressFound.pincode || '',
      street: addressFound.street || '',
      city: addressFound.city || '',
      country: addressFound.area || '',
      landmark: addressFound.subLocality || '',
      house_no: addressFound.houseNumber || '',
      latitude: addressFound.lat,
      longitude: addressFound.lng,
    }));
  };

  const handleLocation = useCallback(() => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      window.picker.setLocation({ lat: crd.latitude, lng: crd.longitude });
      setAddressFields(window.picker.getLocation());
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  //   useEffect(() => {
  //   if (!props.rightSidebar) {
  //     props.setErrors({});
  //   }
  // }, [props.rightSidebar]);

  // useEffect(()=>{
  //   if(props.openCustomizer){
  //     props.setErrors({});
  //   }
  // }, [props.openCustomizer]);
  console.log(props.formData,"checkformData")
  console.log(props.formData.house_no,"checkformData.house_no")

  return (
    <>
      <Row style={{marginTop:"-26px"}}>
      <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
            <Label className="kyc_label">H.No </Label>
              <Input
                id="afterfocus"
                style={{ border: "none", outline: "none", textTransform: "capitalize" }}
                // draft
                className={`form-control digits ${props.formData && props.formData.house_no ? "not-empty" : ""
                  }`}
                // value={props.formData && props.formData.house_no}
                value ={
                  props.formData?.house_no
                  ? 
                  props?.formData?.house_no
                  : ""
                }
                type="text"
                name="house_no"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
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
                style={{ border: "none", outline: "none" ,textTransform: "capitalize" }}
                // draft
                className={`form-control digits ${props.formData && props.formData.street ? "not-empty" : ""
                  }`}
                value={props.formData && props.formData.street}
                type="text"
                name="street"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
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
                style={{ border: "none", outline: "none" ,textTransform: "capitalize"}}
                // draft
                className={`form-control  ${props.formData && props.formData.landmark ? "not-empty" : ""
                  }`}
                value={props.formData && props.formData.landmark}
                type="text"
                name="landmark"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
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
                style={{ border: "none", outline: "none" ,textTransform: "capitalize" }}
                className={`form-control  ${props.formData && props.formData.city ? "not-empty" : ""
                  }`}
                value={props.formData && props.formData.city}
                type="text"
                name="city"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
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
                className={`form-control digits ${props.formData && props.formData.pincode ? "not-empty" : ""
                  }`}
                value={props.formData && props.formData.pincode}
                type="text"
                name="pincode"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
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
                style={{ border: "none", outline: "none" ,textTransform: "capitalize" }}
                className={`form-control ${props.formData && !props.formData.district ? "" : "not-empty"
                  }`}
                type="text"
                name="district"
                value={props.formData && props.formData.district}
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
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
                style={{ border: "none", outline: "none", textTransform: "capitalize" }}
                // draft
                className={`form-control digits ${props.formData && props.formData.state ? "not-empty" : ""
                  }`}
                value={props.formData && props.formData.state}
                type="text"
                name="state"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
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
                style={{ border: "none", outline: "none", textTransform: "capitalize" }}
                // draft
                className={`form-control digits ${props.formData && props.formData.country ? "not-empty" : ""
                  }`}
                value={props.formData && props.formData.country}
                type="text"
                name="country"
                onChange={props.handleInputChange}
                onBlur={props.checkEmptyValue}
                disabled={props.isDisabled}
              />
            </div>

            <span className="errortext">{props.errors.country}</span>
          </FormGroup>
        </Col>

      </Row>
      {props.showLatLng &&
        <Row>
          <Col sm="3" id="moveup">
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">Latitude *</Label>
                <Input
                  id="afterfocus"
                  style={{ border: "none", outline: "none" }}
                  // draft
                  className={`form-control digits ${props.formData && props.formData.latitude ? "not-empty" : ""
                    }`}
                  value={props.formData && props.formData.latitude}
                  type="text"
                  name="latitude"
                  onChange={props.handleInputChange}
                  onBlur={props.checkEmptyValue}
                  disabled={props.isDisabled}
                />
              </div>
              <span className="errortext">{props.errors.latitude}</span>
            </FormGroup>
          </Col>
          <Col sm="3" id="moveup">
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">Longitude *</Label>
                <Input
                  id="afterfocus"
                  style={{ border: "none", outline: "none" }}
                  // draft
                  className={`form-control digits ${props.formData && props.formData.longitude ? "not-empty" : ""
                    }`}
                  value={props.formData && props.formData.longitude}
                  type="text"
                  name="longitude"
                  onChange={props.handleInputChange}
                  onBlur={props.checkEmptyValue}
                  disabled={props.isDisabled}
                />
              </div>
{/* Sailaja Removed Hard Coded validation message for longitude  */}
              <span className="errortext">{props.errors.longitude}</span>
            </FormGroup>
          </Col>
          {/* <Col sm="3" id="moveup">
            <Button onClick={handleLocation} variant="contained" startIcon={<MyLocationIcon />}>
              Location
            </Button>
          </Col> */}

        </Row>}
    </>
  );
};

AddressComponent.defaultProps = {
  showLatLng: true
};

export default AddressComponent;
