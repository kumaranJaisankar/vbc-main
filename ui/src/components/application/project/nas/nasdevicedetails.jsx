import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "reactstrap";
import Card from "@mui/material/Card";
import APP from "../../../../assets/images/appointment/app.svg";
import NAME from "../../../../assets/images/appointment/name.svg";
import BRANCHES from "../../../../assets/images/appointment/branches.svg";
import CHECK from "../../../../assets/images/appointment/check.svg";
import LAYOUT from "../../../../assets/images/appointment/layout.svg";
import HASH from "../../../../assets/images/appointment/hash.svg";
import CONTAINER from "../../../../assets/images/appointment/container.svg";
import CONTROL from "../../../../assets/images/appointment/control.svg";
import TYPE from "../../../../assets/images/appointment/type.svg";

import ADDRESS from "../../../../assets/images/appointment/address.png";
import PreviousDevice from "./previousdevice";
import Accordion from "./accordion";
import { networkaxios } from "../../../../axios";

const NasDeviceDetails = (props) => {
  const [showOLTDetials, setShowOLTDetials] = useState(false);

  //new details state
  const [details, setDetails] = useState();
  const [nasdetails, setNasDetails] = useState();
  const [cpeetails, setCpeDetails] = useState();

  const [connected_details, setConnect_details] = useState([]);
  const [show, setShow] = useState(true);

  const [parsedvalue, setParsedvalue] = useState();
  // const [pa]
  const [loading, setLoading] = useState(false);
  const [cpeheading, setcpeheading] = useState()

  useEffect(() => {
    if (props.nasData) {
      setLoading(true);
      networkaxios
        .get(`network/get/${props.lead.id}/nas`)
        .then((response) => {
          setNasDetails(response.data);
          props.setNasDetailsName(response.data);
          setLoading(false);
          // setConnect_details(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
          // props.setLoading(false)
        });
    } else if (props.cpedata) {
      networkaxios
        .get(`network/get/${props.lead.id}/cpe`)
        .then((response) => {
          setCpeDetails(response.data);
          // setConnect_details(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    } else {
      networkaxios
        .get(`network/get/${props.lead.id}/olt`)
        .then((response) => {
          setDetails(response.data);
          setConnect_details(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }
  }, [props.lead.id]);


  const childdpaddress =
    props.childdpDetails?.house_no +
    "," +
    props.childdpDetails?.street +
    "," +
    "\n" +
    props.childdpDetails?.landmark +
    "," +
    props.childdpDetails?.city +
    "," +
    "\n" +
    props.childdpDetails?.district +
    "," +
    "\n" +
    props.childdpDetails?.state +
    "," +
    "\n" +
    props.childdpDetails?.country +
    "," +
    "\n" +
    props.childdpDetails?.pincode +
    ".";
  const defaultaddress =
    props.defaultchilddpDetails?.house_no +
    "," +
    props.defaultchilddpDetails?.street +
    "," +
    "\n" +
    props.defaultchilddpDetails?.landmark +
    "," +
    props.defaultchilddpDetails?.city +
    "," +
    "\n" +
    props.defaultchilddpDetails?.district +
    "," +
    "\n" +
    props.defaultchilddpDetails?.state +
    "," +
    "\n" +
    props.defaultchilddpDetails?.country +
    "," +
    "\n" +
    props.defaultchilddpDetails?.pincode +
    ".";

  const cpeaddress =
    props.cpeDetails?.house_no +
    "," +
    props.cpeDetails?.street +
    "," +
    "\n" +
    props.cpeDetails?.landmark +
    "," +
    props.cpeDetails?.city +
    "," +
    "\n" +
    props.cpeDetails?.district +
    "," +
    "\n" +
    props.cpeDetails?.state +
    "," +
    "\n" +
    props.cpeDetails?.country +
    "," +
    "\n" +
    props.cpeDetails?.pincode +
    ".";

  const nasaddress =
    props.oltDetails?.house_no +
    "," +
    props.oltDetails?.street +
    "," +
    "\n" +
    props.oltDetails?.landmark +
    "," +
    props.oltDetails?.city +
    "," +
    "\n" +
    props.oltDetails?.district +
    "," +
    "\n" +
    props.oltDetails?.state +
    "," +
    "\n" +
    props.oltDetails?.country +
    "," +
    "\n" +
    props.oltDetails?.pincode +
    ".";

  const address =
    details?.house_no +
    "," +
    details?.street +
    "," +
    "\n" +
    details?.landmark +
    "," +
    details?.city +
    "," +
    "\n" +
    details?.district +
    "," +
    "\n" +
    details?.state +
    "," +
    "\n" +
    details?.country +
    "," +
    "\n" +
    details?.pincode +
    ".";

  const parentdpAddress =
    props.parentdpDetails?.house_no +
    "," +
    props.parentdpDetails?.street +
    "," +
    "\n" +
    props.parentdpDetails?.landmark +
    "," +
    props.parentdpDetails?.city +
    "," +
    "\n" +
    props.parentdpDetails?.district +
    "," +
    "\n" +
    props.parentdpDetails?.state +
    "," +
    "\n" +
    props.parentdpDetails?.country +
    "," +
    "\n" +
    props.parentdpDetails?.pincode +
    ".";




  return (
    <>
      {loading ?
        <Spinner size="lg" id="spinner" style={{
          color: "grey",
          margin: "25em",
          position: "relative",
          left: "12em"
        }}></Spinner>
        :
        <Container fluid={true} style={{ marginTop: "-20px" }}>
          <Row>
            <Col sm="5">
              <Row>
                <Col sm="1">
                  <img src={NAME} />
                </Col>
                <Col sm="4">
                  {!props.oltDetails && props.hide === "nas" ? (
                    <p className="cust_details_new">Name</p>
                  ) : props.hide === "nas" && props.oltDetails.zone ? (
                    <p className="cust_details_new">Name</p>
                  ) : (
                    <p className="cust_details_new">Name</p>
                  )}
                </Col>

                <Col sm="2">
                  <p>:</p>
                </Col>

                <Col sm="4">
                  {props.parentdpDetails && !props.cpeDetails && !props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.parentdpDetails?.name}
                    </p>
                  )}
                  {!props.cpeDetails && props.childdpDetails && (
                    <p className="cust_details_new_1">{props.childdpDetails?.name}</p>
                  )}
                  {!props.cpeDetails && props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{props.defaultchilddpDetails?.name}</p>
                  )}

                  {props.cpeDetails && (
                    <p className="cust_details_new_1">{props.cpeDetails?.hardware_name}</p>
                  )}
                  {!props.oltDetails && props.hide === "nas" && nasdetails && (
                    <p className="cust_details_new_1">{nasdetails?.name}</p>
                  )}
                  {!props.parentdpDetails && props.oltDetails && !props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{props.oltDetails?.name}</p>
                  )}
                </Col>
              </Row>
            </Col>
            <Col sm="1"></Col>
            <Col sm="5">
              <Row>
                <Col sm="1">
                  <img src={CONTROL} />

                </Col>
                <Col sm="4">
                  <p className="cust_details_new">Model</p>
                </Col>
                <Col sm="2">
                  <p>:</p>
                </Col>
                <Col sm="4">
                  {!props.parentdpDetails &&
                    !props.childdpDetails &&
                    !props.cpeDetails &&
                    details && <p className="cust_details_new_1">{details?.device_model}</p>}
                  {props.parentdpDetails && !props.cpeDetails && (
                    <p className="cust_details_new_1">
                      {"---"}
                    </p>
                  )}
                  {!props.cpeDetails && props.childdpDetails && (
                    <p className="cust_details_new_1">{props.childdpDetails?.device_model}</p>
                  )}
                  {!props.cpeDetails && props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{"---"}</p>
                  )}
                  {props.cpeDetails && (
                    <p className="cust_details_new_1">{props.cpeDetails?.model}</p>
                  )}
                  {/* {props.hide === "nas" && nasdetails && (
    <p className="cust_details_new_1">{nasdetails?.branch}</p>
  )} */}

                  {!props.oltDetails && props.hide === "nas" && nasdetails && (
                    <p className="cust_details_new_1">{"---"}</p>
                  )}
                  {!props.parentdpDetails && props.oltDetails && !props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{props.oltDetails?.device_model}</p>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col sm="5">
              <Row>
                <Col sm="1">
                  <img src={HASH} />
                </Col>
                <Col sm="4">
                  {!props.oltDetails && props.hide === "nas" ? (
                    <p className="cust_details_new">Serial No</p>
                  ) : props.hide === "nas" && props.oltDetails.area ? (
                    <p className="cust_details_new">Serial No</p>
                  ) : (
                    <p className="cust_details_new">Serial No</p>
                  )}
                </Col>
                <Col sm="2">
                  <p>:</p>
                </Col>
                <Col sm="4">
                  {!props.parentdpDetails &&
                    !props.childdpDetails &&
                    !props.cpeDetails &&
                    !nasdetails &&
                    details && (
                      <p className="cust_details_new_1">{details?.serial_no}</p>
                    )}
                  {props.parentdpDetails && !props.cpeDetails && !props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.parentdpDetails?.serial_no}
                    </p>
                  )}
                  {!props.cpeDetails && props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.childdpDetails?.serial_no}
                    </p>
                  )}
                  {!props.cpeDetails && props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{props.defaultchilddpDetails?.serial_no}</p>
                  )}
                  {props.cpeDetails && (
                    <p className="cust_details_new_1">
                      {props.cpeDetails?.serial_no}
                    </p>
                  )}
                  {/* {nasdetails && (
              <p className="cust_details_new_1">{nasdetails?.serial_no}</p>
            )} */}
                  {!props.oltDetails && props.hide === "nas" && nasdetails && (
                    <p className="cust_details_new_1">{nasdetails?.serial_no}</p>
                  )}
                  {!props.parentdpDetails && props.oltDetails && !props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">
                      {props.oltDetails?.serial_no}
                    </p>
                  )}
                </Col>

              </Row>
            </Col>
            <Col sm="1"></Col>

            <Col sm="5">
              <Row>
                <Col sm="1">
                  <img src={CHECK} />
                </Col>
                <Col sm="4">
                  {!props.oltDetails && props.hide === "nas" ? (
                    <p className="cust_details_new">Status</p>
                  ) : props.hide === "nas" && props.oltDetails.area ? (
                    <p className="cust_details_new">Status</p>
                  ) : (
                    <p className="cust_details_new">Status</p>
                  )}
                </Col>
                <Col sm="2">
                  <p>:</p>

                </Col>
                <Col sm="4">
                  {!props.parentdpDetails &&
                    !props.childdpDetails &&
                    !props.cpeDetails &&
                    !props.nasdetails &&
                    details && (
                      <p className="cust_details_new_1">{details?.status}</p>
                    )}
                  {props.parentdpDetails && !props.cpeDetails && !props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.parentdpDetails ? props.parentdpDetails?.status : "---"}
                    </p>
                  )}
                  {!props.cpeDetails && props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{props.defaultchilddpDetails?.status}</p>
                  )}
                  {!props.cpeDetails && props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.childdpDetails ? props.childdpDetails?.status : "---"}
                    </p>
                  )}
                  {props.cpeDetails && (
                    <p className="cust_details_new_1">{props.cpeDetails?.status}</p>
                  )}
                  {/* {props.hide === "nas" && nasdetails && (
              <p className="cust_details_new_1">{nasdetails?.status}</p>
            )} */}
                  {!props.oltDetails && props.hide === "nas" && nasdetails && (
                    <p className="cust_details_new_1">{nasdetails?.status}</p>
                  )}
                  {!props.parentdpDetails && props.oltDetails && !props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{props.oltDetails?.status}</p>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col sm="5">
              <Row>
                <Col sm="1">
                  {!props.oltDetails && props.hide === "nas" ? (
                    <img src={BRANCHES} />
                  ) : props.hide === "nas" && props.oltDetails.area ? (
                    <img src={APP} />
                  ) : (
                    <img src={APP} />
                  )}

                </Col>
                <Col sm="4">
                  {!props.oltDetails && props.hide === "nas" ? (
                    <p className="cust_details_new">Branch</p>
                  ) : props.hide === "nas" && props.oltDetails.area ? (
                    <p className="cust_details_new">Zone</p>
                  ) : (
                    <p className="cust_details_new">zone</p>
                  )}
                </Col>
                <Col sm="2">
                  <p>:</p>

                </Col>
                <Col sm="4">
                  {/* <p className="cust_details_new_1">
              {props.parentdpDetails ? "---" : details?.make}
            </p> */}
                  {!props.parentdpDetails &&
                    !props.childdpDetails &&
                    !props.cpeDetails &&
                    details && <p className="cust_details_new_1">{details?.zone}</p>}
                  {props.parentdpDetails && !props.cpeDetails && !props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.parentdpDetails?.zone
                        ? props.parentdpDetails?.zone
                        : "---"}
                    </p>
                  )}
                  {!props.cpeDetails && props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.childdpDetails?.zone
                        ? props.childdpDetails?.zone
                        : "---"}
                    </p>
                  )}
                  {!props.cpeDetails && props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{props.defaultchilddpDetails?.zone}</p>
                  )}
                  {props.cpeDetails && (
                    <p className="cust_details_new_1">{props.cpeDetails?.zone}</p>
                  )}
                  {/* {props.hide === "nas" && nasdetails && (
              <p className="cust_details_new_1">{nasdetails?.nas_type}</p>
            )} */}

                  {!props.oltDetails && props.hide === "nas" && nasdetails && (
                    <p className="cust_details_new_1">{nasdetails?.branch}</p>
                  )}
                  {!props.parentdpDetails && props.oltDetails && !props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{props.oltDetails?.zone}</p>
                  )}
                </Col>

              </Row>
            </Col>
            <Col sm="1">
            </Col>
            <Col sm="5">
              <Row>
                <Col sm="1">
                  <img src={CONTAINER} />

                </Col>
                <Col sm="4">
                  {!props.oltDetails && props.hide === "nas" ? (
                    <p className="cust_details_new">IP Address</p>
                  ) : props.hide === "nas" && props.oltDetails.area ? (
                    <p className="cust_details_new">Make</p>
                  ) : (
                    <p className="cust_details_new">Make</p>
                  )}
                </Col>
                <Col sm="2">
                  <p>:</p>
                </Col>
                <Col sm="4">
                  {!props.parentdpDetails &&
                    !props.childdpDetails &&
                    !props.cpeDetails &&
                    details && (
                      <p className="cust_details_new_1">{details?.make}</p>
                    )}
                  {props.parentdpDetails && !props.cpeDetails && !props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.parentdpDetails?.device_model
                        ? props.parentdpDetails?.make
                        : "---"}
                    </p>
                  )}
                  {props.childdpDetails && !props.cpeDetails && (
                    <p className="cust_details_new_1">
                      {props.childdpDetails?.device_model
                        ? props.childdpDetails?.make
                        : "---"}
                    </p>
                  )}
                  {!props.cpeDetails && props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{
                      props.defaultchilddpDetails?.device_model
                        ? props.defaultchilddpDetails?.make
                        : "---"
                    }</p>
                  )}
                  {props.cpeDetails && (
                    <p className="cust_details_new_1">
                      {props.cpeDetails?.make}
                    </p>
                  )}
                  {props.nasdetails && (
                    <p className="cust_details_new_1">
                      {props.nasdetails?.make}
                    </p>
                  )}
                  {/* {props.hide === "nas" && nasdetails && (
              <p className="cust_details_new_1">{nasdetails?.ip_address}</p>
            )} */}
                  {!props.oltDetails && props.hide === "nas" && nasdetails && (
                    <p className="cust_details_new_1">{nasdetails?.ip_address}</p>
                  )}
                  {!props.parentdpDetails && props.oltDetails && !props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">
                      {props.oltDetails?.make}
                    </p>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col sm="5">
              <Row>
                <Col sm="1">
                  {!props.oltDetails && props.hide === "nas" ? (
                    <img src={TYPE} />

                  ) : props.hide === "nas" && props.oltDetails.device_model ? (
                    <img src={BRANCHES} />
                  ) : (
                    <img src={BRANCHES} />
                  )}
                </Col>
                <Col sm="4">
                  {!props.oltDetails && props.hide === "nas" ? (
                    <p className="cust_details_new">NAS Type</p>
                  ) : props.hide === "nas" && props.oltDetails.device_model ? (
                    <p className="cust_details_new">Area</p>
                  ) : (
                    <p className="cust_details_new">Area</p>
                  )}
                </Col>
                <Col sm="2">
                  <p>:</p>
                </Col>
                <Col sm="4">
                  {/* <p className="cust_details_new_1">{details?.specification}</p> */}
                  {!props.parentdpDetails &&
                    !props.childdpDetails &&
                    !props.cpeDetails &&
                    details && (
                      <p className="cust_details_new_1">{details?.area}</p>
                    )}
                  {props.parentdpDetails && !props.cpeDetails && !props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.parentdpDetails?.area
                        ? props.parentdpDetails?.area
                        : "---"}
                    </p>
                  )}
                  {!props.cpeDetails && props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{props.defaultchilddpDetails?.area}</p>
                  )}
                  {!props.cpeDetails && props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.childdpDetails.area
                        ? props.childdpDetails?.area
                        : "---"}
                    </p>
                  )}
                  {props.cpeDetails && (
                    <p className="cust_details_new_1">
                      {props.cpeDetails?.area}
                    </p>
                  )}
                  {!props.oltDetails && props.hide === "nas" && nasdetails && (
                    <p className="cust_details_new_1">{nasdetails.nas_type}</p>
                  )}
                  {!props.parentdpDetails && props.oltDetails && !props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">
                      {props.oltDetails?.area}
                    </p>
                  )}
                </Col>

              </Row>
            </Col>
            <Col sm="1">
            </Col>
            <Col sm="5">
              <Row>
                <Col sm="1">
                  <img src={LAYOUT} />
                </Col>
                <Col sm="4">
                  <p className="cust_details_new">Specification</p>
                </Col>
                <Col sm="2">
                  <p>:</p>
                </Col>
                <Col sm="4">
                  {!props.parentdpDetails &&
                    !props.childdpDetails &&
                    !props.cpeDetails &&
                    details && (
                      <p className="cust_details_new_1">{details?.specification}</p>
                    )}
                  {props.parentdpDetails && !props.cpeDetails && !props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.parentdpDetails?.specification
                        ? props.parentdpDetails?.specification
                        : "---"}
                    </p>
                  )}
                  {!props.cpeDetails && props.childdpDetails && (
                    <p className="cust_details_new_1">
                      {props.childdpDetails.specification
                        ? props.childdpDetails?.specification
                        : "---"}
                    </p>
                  )}
                  {!props.cpeDetails && props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">{
                      props.defaultchilddpDetails?.specification
                        ? props.defaultchilddpDetails?.specification
                        : "---"
                    }</p>
                  )}
                  {props.cpeDetails && (
                    <p className="cust_details_new_1">
                      {props.cpeDetails?.specification}
                    </p>
                  )}
                  {!props.oltDetails && props.hide === "nas" && nasdetails && (
                    <p className="cust_details_new_1">{"---"}</p>
                  )}
                  {!props.parentdpDetails && props.oltDetails && !props.defaultchilddpDetails && (
                    <p className="cust_details_new_1">
                      {props.oltDetails?.specification}
                    </p>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <span
              className="sidepanel_border"
              style={{ position: "relative", top: "0px" }}
            ></span>
          </Row>
          <>
            {!props.oltDetails && props.hide === "nas"
              ? ""
              : !showOLTDetials && props.oltDetails
                ? ""
                : props.cpeDetails
                  ? ""
                  :
                  <Row>
                    <Col sm="6" className="nasBorder standardCard">
                      <div className="ant-card-head">
                        <p className="ant-card-head-title" style={{ paddingTop: "12px" }}>
                          Capacity Information
                        </p>
                        <div className="ant-card-body">
                          <Row>
                            <Col md="4">
                              <Card className="count_capacity">
                                <p style={{ textAlign: "center" }}>
                                  <span className="total_test"></span>
                                  <br />
                                  <span className="total_count_new">
                                    <span className="payment_symbol"></span>
                                    {props.parentdpDetails && !props.childdpDetails
                                      ? props.parentdpDetails?.no_of_ports
                                      : props.oltDetails && !props.childdpDetails && !props.defaultchilddpDetails
                                        ? props.oltDetails.capacity
                                        : props.childdpDetails && !props.cpeDetails
                                          ? props.childdpDetails.no_of_ports
                                          : props.cpeDetails
                                            ? "---"
                                            : props.defaultchilddpDetails
                                              ? props.defaultchilddpDetails.no_of_ports
                                              : details?.capacity}
                                  </span>
                                </p>
                              </Card>

                              <p className="device_centre">Capacity</p>
                            </Col>
                            {/* <Col md="2"></Col> */}
                            <Col md="4">
                              <Card className="count_slots">
                                <p style={{ textAlign: "center" }}>
                                  <br />
                                  <span className="total_count_new">
                                    <span className="payment_symbol"></span>
                                    {props.parentdpDetails && !props.childdpDetails
                                      ? props.parentdpDetails?.available_ports
                                      : !props.parentdpDetails && props.oltDetails && !props.childdpDetails && !props.defaultchilddpDetails
                                        ? props.oltDetails.avaialable_slots
                                        : props.childdpDetails && !props.cpeDetails
                                          ? props.childdpDetails.available_ports
                                          : props.cpeDetails
                                            ? "---"
                                            : props.defaultchilddpDetails
                                              ? props.defaultchilddpDetails.available_ports
                                              : details?.avaialable_slots}
                                  </span>

                                </p>
                              </Card>
                              <p className="device_centre">Available Slots</p>
                            </Col>
                            <Col sm="4">
                              <Card className="count_cards_new">
                                <p style={{ textAlign: "center" }}>
                                  <span className="total_test"></span>
                                  <br />
                                  <span className="total_count_new">
                                    <span className="payment_symbol"></span>
                                    {props.parentdpDetails && !props.childdpDetails
                                      ? props.parentdpDetails?.occupied_ports
                                      : props.oltDetails && !props.childdpDetails && !props.defaultchilddpDetails
                                        ? props.oltDetails.occupied_slots
                                        : props.childdpDetails && !props.cpeDetails && !props.defaultchilddpDetails
                                          ? props.childdpDetails.occupied_ports
                                          : props.cpeDetails
                                            ? "---"
                                            : props.defaultchilddpDetails
                                              ? props.defaultchilddpDetails.occupied_ports
                                              : details?.occupied_slots}
                                  </span>
                                </p>
                              </Card>
                              <p className="device_centre">Occupied Slots</p>
                            </Col>
                          </Row>
                          <Row>

                            {/* <Col sm="4">
                    <Card className="count_image">
                      <p>
                        <span className="total_test"></span>
                        <br />
                        <span className="total_count_new">
                          <span className="payment_symbol"></span>
                        </span>
                      </p>
                    </Card>
                    <p className="device_centre">Image</p>
                  </Col> */}
                          </Row>
                        </div>
                      </div>
                    </Col>

                    <Col sm="6" className="nasBorder standardCard">
                      <div className="ant-card-head">
                        <p className="ant-card-head-title" style={{ paddingTop: "12px" }}>
                          Address
                        </p>
                        <div className="ant-card-body">
                          <Row>
                            <Col sm="3">
                              <img
                                src={ADDRESS}
                                style={{ width: "60px", marginLeft: "-2em" }}
                              />
                            </Col>
                            <Col sm="9">
                              {props.parentdpDetails && !props.childdpDetails
                                ? parentdpAddress
                                : props.oltDetails && !props.childdpDetails && !props.defaultchilddpDetails
                                  ? nasaddress
                                  : props.childdpDetails && !props.cpeDetails && !props.defaultchilddpDetails
                                    ? childdpaddress
                                    : props.cpeDetails && !props.defaultchilddpDetails
                                      ? cpeaddress
                                      : props.defaultchilddpDetails
                                        ? defaultaddress
                                        : address}
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Row>
            }
          </>

          <br />
          <PreviousDevice
            loaderSpinneer={props.loaderSpinneer}
            setLoaderSpinner={props.setLoaderSpinner}
            details={details}
            address={address}
            parentdpDetails={props.parentdpDetails}
            childdpDetails={props.childdpDetails}
            defaultchilddpDetails={props.defaultchilddpDetails}
            setDefaultchilddpDetails={props.setDefaultchilddpDetails}
            cpeDetails={props.cpeDetails}
            cpeaddress={cpeaddress}
            setOltDetails={props.setOltDetails}
            oltDetails={props.oltDetails}
            setDetails={setDetails}
            setDis={props.setDis}
            dis={props.dis}
            // childdpaddress={childdpaddress}
            showParentDPDetails={props.showParentDPDetails}
            setShowParentDPDetails={props.setShowParentDPDetails}
            hide={props.hide}
            setHide={props.setHide}
            showOLTDetials={showOLTDetials}
            setShowOLTDetials={setShowOLTDetials}
            parentdpInfo={props.parentdpInfo}
            setParentdpInfo={props.setParentdpInfo}
          />
          <Accordion
            cpeheading={cpeheading}
            setcpeheading={setcpeheading}
            loading={loading}
            setLoading={setLoading}
            nasDetailsName={props.nasDetailsName}
            setNasDetailsName={props.setNasDetailsName}
            detailsname={props.detailsname}
            setDeatilsname={props.setDeatilsname}
            nasdetails={nasdetails}
            setNasDetails={setNasDetails}
            details={details}
            setDetails={setDetails}
            setShow={setShow}
            show={show}
            parsedvalue={parsedvalue}
            setParsedvalue={setParsedvalue}
            parentdpDetails={props.parentdpDetails}
            setParentdpDetails={props.setParentdpDetails}
            // showParentDP={props.showParentDP} setShowParentDP={props.setShowParentDP}
            showParentDPDetails={props.showParentDPDetails}
            setShowParentDPDetails={props.setShowParentDPDetails}
            childdpDetails={props.childdpDetails}
            setChilddpDetails={props.setChilddpDetails}
            defaultchilddpDetails={props.defaultchilddpDetails}
            setDefaultchilddpDetails={props.setDefaultchilddpDetails}
            cpeDetails={props.cpeDetails}
            setCpeDetails={props.setCpeDetails}
            oltDetails={props.oltDetails}
            setOltDetails={props.setOltDetails}
            setDis={props.setDis}
            dis={props.dis}
            setRightSidebar={props.setRightSidebar}
            // currentLevel={props.currentLevel} setCurrentLevel={props.setCurrentLevel}
            showChildDP={props.showChildDP}
            setShowChildDP={props.setShowChildDP}
            //new states
            showChildDPDetails={props.showChildDPDetails}
            setShowChildDPDetails={props.setShowChildDPDetails}
            hide={props.hide}
            setHide={props.setHide}
            showOLTDetials={showOLTDetials}
            setShowOLTDetials={setShowOLTDetials}
            parentdpAddress={parentdpAddress}
            parentdpInfo={props.parentdpInfo}
            setParentdpInfo={props.setParentdpInfo}
          />
        </Container>

      }
    </>

  );
};

export default NasDeviceDetails;
