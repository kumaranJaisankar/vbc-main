import React, { useState, useEffect } from "react";
import MUIButton from "@mui/material/Button";
import { Row, Col, Input, Button, Label, Spinner,FormGroup } from "reactstrap"
import { adminaxios, customeraxios, networkaxios } from "../../../../axios";
import { toast } from "react-toastify";
const AreaShiffting = (props) => {
    const [getAreas, setGetAreas] = useState([])
    const [getData, setGetData] = useState()
    const [loader, setLoader] = useState(false)
    const [paymentoption, setsetPaymentOPtion] = useState()
    const [getAreaincpeolt, setGetAreaincpeolt] = useState([]);
const [getlistofoltports, setGetlistofoltports] = useState([]);
const [getlistofpdpports, setGetlistofpdpports] = useState([]);
const [getlistofparentports, setGetlistofparentports] = useState([]);
const [getparentdpflag, setGetparentdpflag] = useState({});
    const handleAreaChange = (event) => {
        setGetData((getData) => ({
            ...getData,
            [event.target.name]: event.target.value,
        }));
        let val = event.target.value;
        let name = event.target.name;
        if (name == "new_area") {
            getlistofparentoltareas(val);
          }
          if (name == "parentolt") {
            getlistofparentoltports(val);
          }
          if (name == "olt_ports") {
            getlistofparentdpports(val);
          }
          if (name === "child_dp") {
            getlistofparentdpportsdisplay(val);
          }
          if (name === "parent_child_dpport") {
            setGetparentdpflag(val);
          }
       
    }
    
    const getlistofparentoltareas = (val) => {
        networkaxios
          .get(`network/area/olts/for/cpe?area=${val}`)
          .then((response) => {
            setGetAreaincpeolt(response.data);
          })
          .catch(function (error) {
            console.error("Something went wrong!", error);
          });
      };
      const getlistofparentoltports = (val) => {
        networkaxios
          .get(`network/oltport/${val}/filter`)
          .then((response) => {
            setGetlistofoltports(response.data);
            // setGetlistofoltportsflag();
          })
          .catch(function (error) {
            console.error("Something went wrong!", error);
          });
      };
      //4
      const getlistofparentdpports = (val) => {
        networkaxios
          .get(`network/oltport/childdps?parent_oltport=${val}`)
          .then((response) => {
            setGetlistofpdpports(response.data);
          })
          .catch(function (error) {
            console.error("Something went wrong!", error);
          });
      };
      //5
      const getlistofparentdpportsdisplay = (val) => {
        networkaxios
          .get(`network/childdpport/${val}/filter`)
          .then((response) => {
            setGetlistofparentports(response.data);
          })
          .catch(function (error) {
            console.error("Something went wrong!", error);
          });
      };
    // area list api
    useEffect(() => {
        adminaxios.get(`franchise/areas/${props?.profileDetails?.area?.franchise?.id}/${props?.profileDetails?.area?.id}`)
            .then((response) => {
                const formattedAreas = response.data.map((areaObj) => areaObj.area);
                setGetAreas(formattedAreas);
            })
    }, [])

    // area to area shifting  post api
    const areaShifting = () => {
        const areaData = { ...getData }
        if (!areaData.new_area || !areaData.parentolt || !areaData.olt_ports || !areaData.child_dp || !areaData.parent_child_dpport || !areaData.payment_method) {
          toast.error("Please fill in all required fields", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
          });
          return;
      }
        console.log(areaData,"areaData");
        delete areaData?.child_dp;
        delete areaData?.olt_ports;
        delete areaData?.parentolt;
        areaData.amount = props?.profileDetails?.area?.franchise?.shifting_charges;
        setLoader(true)
        customeraxios.patch(`customers/off/areashift/${props?.profileDetails?.id}`, areaData).then((res) => {
            setLoader(false)
            props.AreaShifftingModal();
            props.fetchComplaints();
            toast.success("Your area changed successfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
            // window.location.reload();
        }).catch((error) => {
            setLoader(false)
            toast.error("Something went wrong", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            })
        })
    }

    return (
        <>
            <Row>
                <Col sm="3">
                <div className="input_wrap">
                    <Label className="kyc_label">Franchise</Label>
                    <Input value={props?.profileDetails?.area?.franchise?.name}
                        disabled={true}
                    />
                    </div>
                </Col>
                <Col sm="3">
                <div className="input_wrap">
                    <Label className="kyc_label">Area</Label>
                    <Input value={props?.profileDetails?.area?.name}
                        disabled={true}
                    />
                    </div>
                </Col>
                <Col sm="3">
                <div className="input_wrap">
                    <Label className="kyc_label">Area To *</Label>
                    <Input type="select" name="new_area" onChange={handleAreaChange}>
                        <option style={{ display: "none" }}></option>
                        {getAreas?.map((areas) => (
                            <option key={areas.id} value={areas.id}>
                                {areas.name}
                            </option>
                        ))}
                    </Input>
                    </div>
                </Col>
               
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Parent OLT *</Label>
                        <Input
                          type="select"
                          name="parentolt"
                          className={`form-control digits ${
                            getData && getData.parentolt ? "not-empty" : ""
                          }`}
                          onChange={handleAreaChange}
                          // onBlur={checkEmptyValue}
                          value={getData && getData.parentolt}
                        >
                          <option style={{ display: "none" }}></option>
                          {getAreaincpeolt.map((area) => (
                            <option value={area.id}>{area.serial_no}</option>
                          ))}
                        </Input>
                      </div>
                      {/* {errors.parent_slno && (
                        <span className="errortext">{errors.parent_slno}</span>
                      )} */}
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">OLT Ports *</Label>
                        <Input
                          type="select"
                          name="olt_ports"
                          className={`form-control digits ${
                            getData && getData.olt_ports
                              ? "not-empty"
                              : ""
                          }`}
                          onChange={(event) => {
                            handleAreaChange(event);
                          }}
                          // onBlur={checkEmptyValue}
                          value={getData && getData.olt_ports}
                        >
                          <option style={{ display: "none" }}></option>
                          {getlistofoltports.map((items) => (
                            <option value={items.id}>
                              {items.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      {/* <span className="errortext">
                        {selectedConnectType == "OLT" &&
                          getparentoltValue === true &&
                          "This port is unavailable"}
                      </span> */}
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Child DP *</Label>
                        <Input
                          type="select"
                          name="child_dp"
                          className={`form-control digits ${
                            getData && getData.parent_slno ? "not-empty" : ""
                          }`}
                          onChange={handleAreaChange}
                          // onBlur={checkEmptyValue}
                          value={getData && getData.child_dp}
                        >
                          <option style={{ display: "none" }}></option>
                          {getlistofpdpports.map((area) => (
                            <option value={area.id}>{area.serial_no}</option>
                          ))}
                        </Input>
                      </div>
                      {/* {errors.parent_slno && (
                        <span className="errortext">{errors.parent_slno}</span>
                      )} */}
                    </FormGroup>
                  </Col>
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Child DP Ports *</Label>
                        <Input
                          type="select"
                          name="parent_child_dpport"
                          className={`form-control digits ${
                            getData && getData.parent_slno ? "not-empty" : ""
                          }`}
                          onChange={handleAreaChange}
                          // onBlur={checkEmptyValue}
                          value={getData && getData.parent_child_dpport}
                        >
                          <option style={{ display: "none" }}></option>
                          {getlistofparentports.map((area) => (
                            <option value={area.id}>
                              {area.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <span className="errortext">
                        {getparentdpflag === true && "This port is unavailable"}
                      </span>
                    </FormGroup>
                  </Col>
                <Col>
                    <Label className="kyc_label">Shifting Charges</Label>
                    <Input value={props?.profileDetails?.area?.franchise?.shifting_charges}
                        disabled={true}
                    />
                </Col>
            </Row>
            <br />
            <Row>
                    <Col sm="4" >
                        <FormGroup>
                            <div className="input_wrap">
                                <Label className="kyc_label"> Payment Method *</Label>
                                <Input
                                    type="select"
                                    name="payment_method"
                                    className="form-control digits not-empty"
                                    onChange={(event) => {
                                        handleAreaChange(event);
                                        setsetPaymentOPtion(event.target.value);
                                    }}
                                >
                                    <option value="" style={{ display: "none" }}></option>
                                    <option value="GPAY">Google Pay</option>
                                    <option value="PHNPE">PhonePe</option>
                                    <option value="BNKTF">Bank Transfer</option>
                                    <option value="CHEK">Cheque</option>
                                    <option value="CASH">Cash</option>
                                    <option value="PAYTM">PayTM</option>
                                </Input>

                                {/* <span className="errortext">
                                    {errors.payment_method && "Field is required"}
                                </span> */}
                            </div>
                        </FormGroup>
                    </Col>
                    <Col
                        sm="4"
                        hidden={paymentoption != "BNKTF"}
                    >  <Label className="kyc_label"
                    >  Bank Reference No.   </Label>
                        <Input
                            onChange={handleAreaChange}
                            name="bank_reference_no"
                            className="form-control"
                            type="text"
                        />

                        {/* <span className="errortext">
                            {errors.bank_reference_no}
                        </span> */}
                    </Col>
                    <Col
                        sm="4"
                        hidden={paymentoption != "GPAY" && paymentoption != "PHNPE"}
                    >
                        <Label className="kyc_label">UTR No. *</Label>
                        <Input
                            onChange={handleAreaChange}
                            name="upi_reference_no"
                            className="form-control"
                            type="text"
                        />
{/* 
                        <span className="errortext">
                            {errors.upi_reference_no}
                        </span> */}
                    </Col>
                    <Col
                        sm="4"
                        hidden={paymentoption != "CHEK"}
                    >  <Label className="kyc_label"> Cheque No. *</Label>
                        <Input
                            onChange={handleAreaChange}
                            name="check_reference_no"
                            className="form-control"
                            type="text"
                        />

                        {/* <span className="errortext">
                            {errors.check_reference_no}
                        </span> */}
                    </Col>
                </Row>
                <br />
            <hr />
            <Row style={{ textAlign: "end" }}>
                <Col >

                    <Button
                        variant="contained"
                        id="update_button"
                        onClick={areaShifting}
                        style={{ color: "white" }}
                        disabled={loader}
                    >
                        {loader ? <Spinner size="sm"> </Spinner> : null}
                        Submit
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <MUIButton variant="outlined"
                        size="medium"
                        className="cust_action"
                        onClick={() => {
                            props.AreaShifftingModal();
                        }}
                    >
                        Cancel
                    </MUIButton>
                </Col>
            </Row>
            <br />
        </>
    )
}
export default AreaShiffting