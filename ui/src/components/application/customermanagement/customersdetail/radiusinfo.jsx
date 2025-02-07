import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Form, Label, FormGroup } from "reactstrap";
import moment from "moment";
import { Tooltip } from 'antd';
import { customeraxios } from "../../../../axios";
import { toast } from "react-toastify";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
const RadiusInfo = (props) => {
  const [leadUser, setLeadUser] = useState(null);

  useEffect(() => {
    customeraxios
      .get(`customers/v2/list/radiusinfo/${props.lead.radius_info}`)
      .then((res) => {
        setLeadUser(res.data);
      });
  }, [props]);

  const handleChange = useCallback((e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    customeraxios
      .patch(`customers/rud/${props.lead.id}`, leadUser)
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
  }, [leadUser, props]);

  return (
    <>
      {
        leadUser && (
          <Form
            onSubmit={handleSubmit}
          >
            <Row>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={
                      moment
                        .utc(leadUser.created)
                        .format("YYYY-MM-DDThh:mm")
                    }>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="created_at"
                        style={{ border: "none", outline: "none" }}
                        value={moment(leadUser.created).format("DD-MM-YY")}
                        onChange={handleChange}
                        id="afterfocus"
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">Auto Renew</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.authentication_protocol
                    }>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="authentication_protocol"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.authentication_protocol}
                        onChange={handleChange}
                        id="afterfocus"
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">
                        Authentication Protocol
                      </Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.mac_bind}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="mac_bind"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.mac_bind}
                        onChange={handleChange}
                        id="afterfocus"
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">MAC Bind</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.ip_mode}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="ip_mode"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.ip_mode}
                        onChange={handleChange}
                        id="afterfocus"
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">IP Mode</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.ip_address}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="ip_address"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.ip_address}
                        onChange={handleChange}
                        id="afterfocus"
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
                    <Tooltip title={leadUser.static_ip_bind}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="static_ip_bind"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.static_ip_bind}
                        onChange={handleChange}
                        id="afterfocus"
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">Static IP Bind</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.nasport_bind}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="nasport_bind"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.nasport_bind}
                        onChange={handleChange}
                        id="afterfocus"
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">Nas Port Bind</Label>
                    </Tooltip>
                  </div>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Tooltip title={leadUser.option_82}>
                      <input
                        className={`form-control digits not-empty`}
                        type="text"
                        name="option_82"
                        style={{ border: "none", outline: "none" }}
                        value={leadUser.option_82}
                        onChange={handleChange}
                        id="afterfocus"
                        disabled={props.isDisabled}
                      ></input>
                      <Label className="placeholder_styling">Option82 Bind</Label>
                    </Tooltip>
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

export default RadiusInfo;
