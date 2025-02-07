import React, { useState } from "react";
import { Row, Col, CardHeader } from "reactstrap";
import Card from "@mui/material/Card";
import OLT from "../../../../assets/images/appointment/olt.png";
import DP from "../../../../assets/images/appointment/dp.png";
import NAS from "../../../../assets/images/appointment/nas.png";
import { networkaxios } from "../../../../axios";

const PreviousDevice = (props) => {
  const clickBack = () => {
    props.setShowOLTDetials(false);
  };

  // const parentOLTaddress = [
  //   props.parentdpDetails?.parent_olt
  // ]
  const pdpconnectedcdpaddress =
    props.childdpDetails?.parent_dp?.house_no +
    "," +
    props.childdpDetails?.parent_dp?.street +
    "," +
    "\n" +
    props.childdpDetails?.parent_dp?.landmark +
    "," +
    props.childdpDetails?.parent_dp?.city +
    "," +
    "\n" +
    props.childdpDetails?.parent_dp?.district +
    "," +
    "\n" +
    props.childdpDetails?.parent_dp?.state +
    "," +
    "\n" +
    props.childdpDetails?.parent_dp?.country +
    "," +
    "\n" +
    props.childdpDetails?.parent_dp?.pincode +
    ".";

  const pdpconnecteddefaultaddress =
    props.defaultchilddpDetails?.parent_dp?.house_no +
    "," +
    props.defaultchilddpDetails?.parent_dp?.street +
    "," +
    "\n" +
    props.defaultchilddpDetails?.parent_dp?.landmark +
    "," +
    props.defaultchilddpDetails?.parent_dp?.city +
    "," +
    "\n" +
    props.defaultchilddpDetails?.parent_dp?.district +
    "," +
    "\n" +
    props.defaultchilddpDetails?.parent_dp?.state +
    "," +
    "\n" +
    props.defaultchilddpDetails?.parent_dp?.country +
    "," +
    "\n" +
    props.defaultchilddpDetails?.parent_dp?.pincode +
    ".";
  const parentOLTaddress12 =
    props.cpeDetails?.parent_childdp?.house_no +
    "," +
    props.cpeDetails?.parent_childdp?.street +
    "," +
    "\n" +
    props.cpeDetails?.parent_childdp?.landmark +
    "," +
    props.cpeDetails?.parent_childdp?.city +
    "," +
    "\n" +
    props.cpeDetails?.parent_childdp?.district +
    "," +
    "\n" +
    props.cpeDetails?.parent_childdp?.state +
    "," +
    "\n" +
    props.cpeDetails?.parent_childdp?.country +
    "," +
    "\n" +
    props.cpeDetails?.parent_childdp?.pincode +
    ".";
  const parentOLTaddress =
    props.parentdpDetails?.parent_olt?.house_no +
    "," +
    props.parentdpDetails?.parent_olt?.street +
    "," +
    "\n" +
    props.parentdpDetails?.parent_olt?.landmark +
    "," +
    props.parentdpDetails?.parent_olt?.city +
    "," +
    "\n" +
    props.parentdpDetails?.parent_olt?.district +
    "," +
    "\n" +
    props.parentdpDetails?.parent_olt?.state +
    "," +
    "\n" +
    props.parentdpDetails?.parent_olt?.country +
    "," +
    "\n" +
    props.parentdpDetails?.parent_olt?.pincode +
    ".";

  return (
    <>
      {!props.oltDetails && props.hide === "nas" ? (
        ""
      ) : !props.showOLTDetials && props.oltDetails ? (
        ""
      ) : (
        <>
          {!props.cpeDetails &&
            !props.childdpDetails &&
            !props.parentdpDetails &&
            !props.defaultchilddpDetails && (
              <Row style={{ height: "16em" }}>
                <Col sm="12" className="nasBorder standardCard">
                  <div className="ant-card-head">
                    <p
                      className="ant-card-head-title"
                      style={{ paddingTop: "12px" }}
                    >
                      {`(${props.oltDetails?.name})  Is Connected to :`}
                    </p>
                    <Card
                      style={{
                        boxShadow: "none",
                        border: "1px solid #e8e8e8",
                        borderRadius: "none",
                      }}
                    >
                      <Row className="device_row">
                        <p>NAS</p> &nbsp;
                        <p>:</p> &nbsp;
                        <p>
                          {props.oltDetails
                            ? props.oltDetails.parent_nas.name
                            : props.details?.parent_nas?.name}
                        </p>
                      </Row>
                      <hr style={{ width: "100%", marginTop: "-7px" }} />
                      <Row>
                        <Col sm="6">
                          <Row>
                            <Col sm="4">
                              <img
                                src={NAS}
                                style={{
                                  width: "106px",
                                  position: "relative",
                                  height: "81px",
                                  top: "-12px",
                                }}
                              ></img>
                            </Col>
                            <Col sm="8">
                              <Row></Row>
                              <Row>
                                <Col sm="6">
                                  <p>Serial No</p>
                                </Col>
                                <Col sm="2" style={{ marginLeft: "-4em" }}>
                                  <p>:</p>
                                </Col>
                                &nbsp;
                                <Col sm="6" style={{ marginLeft: "-2em" }}>
                                  <p>
                                    {props.oltDetails
                                      ? props.oltDetails.parent_nas.serial_no
                                      : props.details?.parent_nas?.serial_no}
                                  </p>
                                </Col>
                              </Row>
                              <Row></Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col sm="6"></Col>
                      </Row>
                    </Card>
                  </div>
                </Col>
                
              </Row>
            )}
          {!props.cpeDetails &&
            !props.childdpDetails &&
            props.parentdpDetails?.parent_olt && (
              <Row style={{ height: "16em" }}>
                <Col sm="12" className="nasBorder standardCard">
                <div className="ant-card-head">
                    <p
                      className="ant-card-head-title"
                      style={{ paddingTop: "12px" }}
                    >
                      {`(${props.parentdpInfo?.name})  Is Connected to :`}
                    </p>
                    <Card
                      style={{
                        boxShadow: "none",
                        border: "1px solid #e8e8e8",
                        borderRadius: "none",
                      }}
                    >
                      <Row className="device_row">
                        <p>Optical Line Terminal</p> &nbsp;
                        <p>:</p> &nbsp;
                        <p>
                        {props.parentdpDetails?.parent_olt?.name}
                        </p>
                      </Row>
                      <hr style={{ width: "100%", marginTop: "-7px" }} />
                      <Row>
                        <Col sm="6">
                          <Row>
                            <Col sm="4">
                            <img
                                  src={OLT}
                                  style={{ width: "60px", height: "60px", marginLeft:"10px" }}
                                ></img>
                            </Col>
                            <Col sm="8">
                              <Row></Row>
                              <Row>
                              <Col sm="6">
                                  <p>Serial No</p>
                                </Col>
                                <Col sm="2" style={{ marginLeft: "-4em" }}>
                                  <p>:</p>
                                </Col>
                                &nbsp;
                                <Col sm="6" style={{ marginLeft: "-2em" }}>
                                  <p>
                                  {props.parentdpDetails?.parent_olt?.serial_no}
                                  </p>
                                </Col>
                              </Row>
                              <Row>
                              <Col sm="6">
                                  <p>Available Slots</p>
                                </Col>
                                <Col sm="2" style={{ marginLeft: "-4em" }}>
                                  <p>:</p>
                                </Col>
                                &nbsp;
                                <Col sm="6" style={{ marginLeft: "-2em" }}>
                                  
                                  <p>
                                  {
                                    props.parentdpDetails?.parent_olt
                                      ?.avaialable_slots
                                  }                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col sm="6">
                        <i
                                  aria-label="icon: environment"
                                  class="anticon anticon-environment"
                                  style={{ paddingLeft: "2px" ,position:"relative",top:"-5px"}}
                                >
                                  <svg
                                    viewBox="64 64 896 896"
                                    focusable="false"
                                    class=""
                                    data-icon="environment"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>
                                  </svg>
                                </i>
                                &nbsp;
                                &nbsp;
                              {parentOLTaddress}
                        </Col>
                      </Row>
                    </Card>

                    </div>
                </Col>
              </Row>
            )}
          {!props.cpeDetails &&
            props.childdpDetails?.parent_dp &&
            !props.defaultchilddpDetails && (
              <Row style={{ height: "16em" }}>
            <Col sm="12" className="nasBorder standardCard">
  <div className="ant-card-head">
    <p className="ant-card-head-title" style={{ paddingTop: "12px" }}>
      {`(${props.childdpDetails?.name})  Is Connected to :`}
    </p>
 
  <Card
    style={{
      boxShadow: "none",
      border: "1px solid #e8e8e8",
      borderRadius: "none",
    }}
  >
    <Row className="device_row">
      <p>Parent Distribution Point</p> &nbsp;
      <p>:</p> &nbsp;
      <p>{props.childdpDetails?.parent_dp?.name}</p>
    </Row>
    <hr style={{ width: "100%", marginTop: "-7px" }} />
    <Row>
      <Col sm="6">
        <Row>
          <Col sm="4">
            <img src={DP} style={{ width: "60px", height: "60px",marginLeft:"10px" }}></img>
          </Col>
          <Col sm="8">
            <Row></Row>
            <Row>
              <Col sm="6">
                <p>Serial No</p>
              </Col>
              <Col sm="2" style={{ marginLeft: "-4em" }}>
                <p>:</p>
              </Col>
              &nbsp;
              <Col sm="6" style={{ marginLeft: "-2em" }}>
                <p>{props.childdpDetails?.parent_dp?.serial_no}</p>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Available Slots</p>
              </Col>
              <Col sm="2" style={{ marginLeft: "-4em" }}>
                <p>:</p>
              </Col>
              &nbsp;
              <Col sm="6" style={{ marginLeft: "-2em" }}>
                <p>{props.childdpDetails?.parent_dp?.available_ports} </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col sm="6">
        <i
          aria-label="icon: environment"
          class="anticon anticon-environment"
          style={{ paddingLeft: "2px" }}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            class=""
            data-icon="environment"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>
          </svg>
        </i>
        &nbsp;&nbsp;
        {pdpconnectedcdpaddress}
      </Col>
    </Row>
  </Card>
  </div>
</Col>
 </Row>
            )}
          {props.cpeDetails?.parent_childdp ? (
            ""
          ) : (
            <>
              {props.defaultchilddpDetails?.parent_dp && (
                <Row >
                  <Col sm="12" className="nasBorder standardCard">
                  <div className="ant-card-head">
                    <p
                      className="ant-card-head-title"
                      style={{ paddingTop: "12px" }}
                    >
                      {`(${props.defaultchilddpDetails?.name})  Is Connected to :`}
                    </p>
                    <Card
    style={{
      boxShadow: "none",
      border: "1px solid #e8e8e8",
      borderRadius: "none",
    }}
  >
    <Row className="device_row">
      <p>Parent Distribution Point</p> &nbsp;
      <p>:</p> &nbsp;
      <p>{props.defaultchilddpDetails?.parent_dp?.name}</p>
    </Row>
    <hr style={{ width: "100%", marginTop: "-7px" }} />
    <Row>
      <Col sm="6">
        <Row>
          <Col sm="4">
            <img src={DP} style={{ width: "60px", height: "60px",marginLeft:"10px" }}></img>
          </Col>
          <Col sm="8">
            <Row></Row>
            <Row>
              <Col sm="6">
                <p>Serial No</p>
              </Col>
              <Col sm="2" style={{ marginLeft: "-4em" }}>
                <p>:</p>
              </Col>
              &nbsp;
              <Col sm="6" style={{ marginLeft: "-2em" }}>
                <p>    {
                  props.defaultchilddpDetails?.parent_dp
                    ?.serial_no
                }</p>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Available Slots</p>
              </Col>
              <Col sm="2" style={{ marginLeft: "-4em" }}>
                <p>:</p>
              </Col>
              &nbsp;
              <Col sm="6" style={{ marginLeft: "-2em" }}>
                <p>     {
                  props.defaultchilddpDetails?.parent_dp
                    ?.available_ports
                } </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col sm="6">
      <i
                aria-label="icon: environment"
                class="anticon anticon-environment"
                style={{ paddingLeft: "2px" }}
              >
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  class=""
                  data-icon="environment"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>
                </svg>
              </i>
              &nbsp;&nbsp;
              {pdpconnecteddefaultaddress}
      </Col>
    </Row>
  </Card>
                    </div>
                  </Col>
                </Row>
              )}
            </>
          )}{" "}
          {props.cpeDetails?.parent_childdp && (
            <Row style={{ height: "16em" }}>
           <Col sm="12" className="nasBorder standardCard">
           <div className="ant-card-head">
                    <p
                      className="ant-card-head-title"
                      style={{ paddingTop: "12px" }}
                    >
                      {`(${props.cpeDetails?.hardware_name})  Is Connected to :`}
                    </p>
                    <Card
    style={{
      boxShadow: "none",
      border: "1px solid #e8e8e8",
      borderRadius: "none",
    }}
  >
    <Row className="device_row">
      <p>Child Distribution Point</p> &nbsp;
      <p>:</p> &nbsp;
      <p>{props.cpeDetails?.parent_childdp?.name}</p>
    </Row>
    <hr style={{ width: "100%", marginTop: "-7px" }} />
    <Row>
      <Col sm="6">
        <Row>
          <Col sm="4">
            <img src={DP} style={{ width: "60px", height: "60px" ,marginLeft:"10px"}}></img>
          </Col>
          <Col sm="8">
            <Row></Row>
            <Row>
              <Col sm="6">
                <p>Serial No</p>
              </Col>
              <Col sm="2" style={{ marginLeft: "-4em" }}>
                <p>:</p>
              </Col>
              &nbsp;
              <Col sm="6" style={{ marginLeft: "-2em" }}>
                <p> {props.cpeDetails?.parent_childdp?.serial_no}
</p>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Available Slots</p>
              </Col>
              <Col sm="2" style={{ marginLeft: "-4em" }}>
                <p>:</p>
              </Col>
              &nbsp;
              <Col sm="6" style={{ marginLeft: "-2em" }}>
                <p>   {
                  props.cpeDetails?.parent_childdp
                    ?.available_ports
                } </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col sm="6">
      {/* <i
          aria-label="icon: environment"
          class="anticon anticon-environment"
          style={{ paddingLeft: "2px" }}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            class=""
            data-icon="environment"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>
          </svg>
        </i>
        &nbsp;&nbsp;
        {pdpconnectedcdpaddress} */}
          <i
                aria-label="icon: environment"
                class="anticon anticon-environment"
                style={{ paddingLeft: "2px" }}
              >
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  class=""
                  data-icon="environment"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>
                </svg>
              </i>
              &nbsp;&nbsp;
              {parentOLTaddress12}
      </Col>
    </Row>
  </Card>
                    </div>
</Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default PreviousDevice;
