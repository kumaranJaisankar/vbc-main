import React, { useEffect, useState } from "react"; //hooks
import { Row, Col, Form, Label, FormGroup } from "reactstrap";
import { Tooltip } from 'antd';
import { customeraxios, servicesaxios } from "../../../../axios";
import moment from "moment";
import { toast } from "react-toastify";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
const displayTotaltime = (seconds) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

  return dDisplay + hDisplay + mDisplay + sDisplay;
};

const OnlineSessionInfo = (props) => {
  const [leadUser, setLeadUser] = useState(null);
  const [service, setService] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    customeraxios
      .get(`customers/v2/list/onlssninfo/customer/${props.lead.user}/${props.lead.username}`)
      .then((res) => {
        setLeadUser(res.data);
      });
  }, [props.lead]);

  const handleChange = (e) => {
    if (e.target.name === "service_plan") {
      const selectedService = service.find((s) => s.id == e.target.value);
      setFormData((prev) => ({
        ...prev,
        service_plan: {
          ...selectedService,
        },
      }));
      setLeadUser((prev) => ({
        ...prev,
        service_plan: {
          ...selectedService,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    let data = { ...formData };
    data.service_plan = data.service_plan.id;
    customeraxios
      .patch("customers/rud/" + id, data)
      .then((res) => {
        props.onUpdate(res.data);
        toast.success("Customer Information edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.setIsdisabled(true);
      })
      .catch(function (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  //service plan
  useEffect(() => {
    servicesaxios
      .get(`/plans/create`)
      .then((res) => {
        setService([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      {
        leadUser && (
          <Form
            onSubmit={(e) => {
              handleSubmit(e, props.lead.id);
            }}
          >
            <Row>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={
                      leadUser &&
                      moment
                        .utc(
                          leadUser &&
                          leadUser.radaact_info &&
                          leadUser.radaact_info.last_login
                        )
                        .format("YYYY-MM-DDThh:mm")
                    }>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="last_login"
                        style={{ border: "none", outline: "none" }}
                        value={
                          leadUser &&
                          moment
                            .utc(
                              leadUser &&
                              leadUser.radaact_info &&
                              leadUser.radaact_info.last_login
                            )
                            .format("DD-MM-YY")
                        }
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={true}
                      ></input>
                      <Label className="placeholder_styling">Online Since</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>


              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.session_id}>

                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="session_id"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.session_id}
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={true}
                      ></input>
                      <Label className="placeholder_styling">Session Id</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.package_name}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="package_name"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.package_name}
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">
                        Running Invoice No
                      </Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">

                    <select
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="select"
                      name="service_plan"
                      style={{ border: "none", outline: "none" }}
                      value={leadUser.service_plan}
                      onChange={handleChange}
                      // onBlur={blur}
                      disabled={props.isDisabled}
                    >
                      {service.map((subcategories) => {
                        if (
                          !!subcategories &&
                          leadUser &&
                          leadUser.service_plan
                        ) {
                          return (
                            <option
                              key={subcategories.id}
                              value={subcategories.id}
                              selected={
                                subcategories.id == leadUser.service_plan.id
                                  ? "selected"
                                  : ""
                              }
                            >
                              {subcategories.package_name}
                            </option>
                          );
                        }
                      })}
                    </select>
                    <Label className="placeholder_styling">Service Plan</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="upload_speed"
                      style={{ border: "none", outline: "none" }}
                      value={leadUser.upload_speed + "Mbps"}
                      onChange={handleChange}
                      id="afterfocus"
                      // onBlur={blur}
                      disabled={props.isDisabled}
                    ></input>
                    <Label className="placeholder_styling">Upload</Label>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="download_speed"
                      style={{ border: "none", outline: "none" }}
                      value={leadUser.download_speed + "Mbps"}
                      onChange={handleChange}
                      id="afterfocus"
                      // onBlur={blur}
                      disabled={props.isDisabled}
                    ></input>
                    <Label className="placeholder_styling">Download</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      type="number"
                      name="total_plan_cost"
                      style={{ border: "none", outline: "none" }}
                      value={parseFloat(
                        leadUser.total_plan_cost
                      ).toFixed(2)}
                      onChange={handleChange}
                      id="afterfocus"
                      // onBlur={blur}
                      disabled={props.isDisabled}
                    ></input>
                    <Label className="placeholder_styling">Total Amount</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.ipaddress}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="ipaddress"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.ipaddress}
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">IP Address</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser &&
                      leadUser.radius_info &&
                      leadUser.radius_info.authentication_protocol}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="authentication_protocol"
                        style={{ border: "none", outline: "none" }}
                        value={
                          leadUser &&
                          leadUser.radius_info &&
                          leadUser.radius_info.authentication_protocol
                        }
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">Protocol</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.mac}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="mac_ip"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.mac}
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">MAC Address</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.package_name}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="package_name"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.package_name}
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">Server Name</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.nas_port}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="nasport_bind"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.nas_port}
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">Nas Port ID</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.nas_ip}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="nas_ip"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.nas_ip}
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">NAS IP</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser &&
                      moment
                        .utc(leadUser.updated_at)
                        .format("YYYY-MM-DDThh:mm")}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="last_update"
                        style={{ border: "none", outline: "none" }}
                        value={
                          leadUser &&
                          moment
                            .utc(leadUser.updated_at)
                            .format("DD-MM-YY")
                        }
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">Last Update</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.session_count}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="number_of_sessions"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.session_count}
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">Sessions</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={displayTotaltime(
                      leadUser.activity_time
                    )}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="total_activity_time"
                        style={{ border: "none", outline: "none" }}
                        value={displayTotaltime(
                          leadUser.activity_time
                        )}
                        onChange={handleChange}
                        id="afterfocus"
                        // onBlur={blur}
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">
                        Total Activity Time
                      </Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="last_logoff"
                      style={{ border: "none", outline: "none" }}

                      value={
                        moment
                          .utc(leadUser.last_logoff)
                          .format("DD-MM-YY")
                      }
                      onChange={handleChange}
                      id="afterfocus"
                      // onBlur={blur}
                      disabled={props.isDisabled}
                    ></input>
                    <Label className="placeholder_styling">
                      Last Logoff
                    </Label>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="acctstoptime"
                      style={{ border: "none", outline: "none" }}
                      value={
                        leadUser &&
                          leadUser.radius &&
                          leadUser.radius.acctstoptime
                          ? "Inactive"
                          : " Active"
                      }
                      onChange={handleChange}
                      id="afterfocus"
                      // onBlur={blur}
                      disabled={props.isDisabled}
                    ></input>
                    <Label className="placeholder_styling">Status</Label>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="packets"
                      style={{ border: "none", outline: "none" }}
                      value={
                        leadUser.packets ? parseFloat(
                          leadUser.packets / 1000 / 1000 / 1000
                        ).toFixed(2) + "GB" : ''
                      }
                      onChange={handleChange}
                      id="afterfocus"
                      // onBlur={blur}
                      disabled={props.isDisabled}
                    ></input>

                    <Label className="placeholder_styling">Consumed</Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <br />

            <Stack direction="row" spacing={2}>
             
             <Button type="submit" variant="contained">
                 Save
               </Button>
                 
               </Stack>
          </Form>
        )
      }
    </>
  );
};

export default OnlineSessionInfo;
