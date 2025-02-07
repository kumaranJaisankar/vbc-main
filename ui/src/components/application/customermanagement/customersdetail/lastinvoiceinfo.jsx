import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  ModalHeader,
} from "reactstrap";
import moment from "moment";
import { customeraxios } from "../../../../axios";
import { toast } from "react-toastify";
import LastInvoiceDownload from "./lastinoicedownload";
import { Tooltip } from 'antd';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const LastInvoiceInfo = (props) => {
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [lastInvoiceInfo, setLastInvoiceInfo] = useState(null);
  const Renewcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);
  const Renewcentermodaltoggle1 = () => setRenewobj(!renewobj);
  const [renewobj, setRenewobj] = useState();
  const [renewstatus, setRenewStatus] = useState("");
  const [name, setName] = useState("");
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));
  const Activatemodaltoggle = () => setActivebutton(!activebutton);
  const [activebutton, setActivebutton] = useState();

  useEffect(() => {
    customeraxios
      .get(`customers/last/invoice/info/${props.lead.user}`)
      .then((res) => {
        setLastInvoiceInfo(res.data);
      });
  }, [props]);

  useEffect(() => {
    setName(localStorage.getItem("Name"));
    if (localStorage.getItem("layout_version") === "dark-only") {
    }
  }, []);

  const handleChange = (e) => {
    setLastInvoiceInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    let data = { };

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

  const datasubmit = (e, id) => {
    e.preventDefault();
    customeraxios
      .patch("/customers/status/update/" + id)
      .then((res) => {
        setRenewStatus(res.data);
      })
      .catch(function (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  return (
    <>
      {
        lastInvoiceInfo && (
          <>
            <Row>
              <Button
                variant="contained"
                onClick={Renewcentermodaltoggle}
                style={{ marginLeft: "15px" }}
              >
                {"Buffer Time"}
              </Button>{" "}
              &nbsp;&nbsp;
            </Row>
            <br />
            <Form
              onSubmit={(e) => {
                handleSubmit(e, props.lead.id);
              }}
            >
              <Row>
                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Tooltip title={lastInvoiceInfo.customer_status}>
                        <input
                          className={`form-control digits not-empty`}
                          type="text"
                          name="account_status"
                          style={{ border: "none", outline: "none" }}
                          value={lastInvoiceInfo.customer_status}
                          onChange={handleChange}
                          id="afterfocus"
                          disabled={true}
                        ></input>
                        <Label className="placeholder_styling">Status</Label>
                      </Tooltip>
                    </div>
                  </FormGroup>
                </Col>

                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Tooltip title={
                        moment.utc(lastInvoiceInfo.invoice_created_date).format("YYYY-MM-DDThh:mm")
                      }>
                        <input
                          className={`form-control digits not-empty`}
                          type="text"
                          name="invoice_created_date"
                          style={{ border: "none", outline: "none" }}
                          value={
                            moment(lastInvoiceInfo.invoice_created_date).format("DD-MM-YY")
                          }
                          onChange={handleChange}
                          id="afterfocus"
                          disabled={true}
                        ></input>
                        <Label className="placeholder_styling">Invoice Date</Label>
                      </Tooltip>
                    </div>
                  </FormGroup>
                </Col>

                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Tooltip title={
                        moment
                          .utc(lastInvoiceInfo.customer_plan_updated)
                          .format("YYYY-MM-DDThh:mm")
                        }
                      >
                        <input
                          className={`form-control digits not-empty`}
                          type="text"
                          name="customer_plan_updated"
                          style={{ border: "none", outline: "none" }}
                          value={
                            moment
                              .utc(lastInvoiceInfo.customer_plan_updated)
                              .format("DD-MM-YY")
                          }
                          onChange={handleChange}
                          id="afterfocus"
                          disabled={true}
                        ></input>
                        <Label className="placeholder_styling">Last Renewal</Label>
                      </Tooltip>
                    </div>
                  </FormGroup>
                </Col>

                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Tooltip title={
                        moment
                          .utc(lastInvoiceInfo.customer_expiry_date)
                          .format("YYYY-MM-DDThh:mm")
                      }
                      >
                        <input
                          className={`form-control digits not-empty`}
                          type="text"
                          name="customer_expiry_date"
                          style={{ border: "none", outline: "none" }}
                          value={
                            moment
                              .utc(lastInvoiceInfo.customer_expiry_date)
                              .format("DD-MM-YY")
                          }
                          onChange={handleChange}
                          id="afterfocus"
                          // onBlur={blur}
                          disabled={true}
                        ></input>
                        <Label className="placeholder_styling">Expiry Date</Label>
                      </Tooltip>
                    </div>
                  </FormGroup>
                </Col>

                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Tooltip title={parseFloat(lastInvoiceInfo.amount).toFixed(2)}>
                        <input
                          className={`form-control digits not-empty`}
                          type="number"
                          name="amount"
                          style={{ border: "none", outline: "none" }}
                          value={parseFloat(
                            lastInvoiceInfo.amount
                          ).toFixed(2)}
                          onChange={handleChange}
                          id="afterfocus"
                          disabled={true}
                        ></input>
                        <Label className="placeholder_styling">
                          Final Invoice Amount
                        </Label>
                      </Tooltip>
                    </div>
                  </FormGroup>
                </Col>

                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Tooltip title={lastInvoiceInfo.payment_method}>
                        <input
                          className={`form-control digits not-empty`}
                          type="text"
                          name="payment_method"
                          style={{ border: "none", outline: "none" }}
                          value={lastInvoiceInfo.payment_method}
                          onChange={handleChange}
                          id="afterfocus"
                          disabled={true}
                        ></input>
                        <Label className="placeholder_styling">Payment Method</Label>
                      </Tooltip>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <br />
              <Row hidden={props.renew === "RPAY"}>
                <Col>
                  <Label>Renewed By</Label>

                  <input
                    className="form-control"
                    type="text"
                    name="first_name"
                    onChange={handleChange}
                    maxLength="15"
                    disabled={true}
                    value={authenticated ? auth0_profile.name : name}
                  ></input>
                </Col>
                <Col>
                  <Label>Renew Date</Label>
                  <input
                    type="text"
                    name="created_at"
                    style={{ border: "none", outline: "none" }}
                    value={moment().format("DD-MM-YY")}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                </Col>
                <Col>
                  <Label>Invoice No</Label>
                  <input
                    type="text"
                    name="customer_last_invoice"
                    style={{ border: "none", outline: "none" }}
                    
                    value={lastInvoiceInfo.customer_last_invoice}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                </Col>
              </Row>
              <br />
              <Row>
                {props && props.lead ?
                  <LastInvoiceDownload lead={props.lead} />
                  : null}
              </Row>

              <br />
              <Stack direction="row" spacing={2}>
             
             <Button type="submit" variant="contained">
                 Save
               </Button>
                 
               </Stack>
            </Form>
            {/* rewnew modal */}
            <Modal isOpen={Verticalcenter} toggle={Renewcentermodaltoggle} centered>
              <ModalBody>
                <p>Are you sure you want use this renewed? </p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={Renewcentermodaltoggle}>
                  {"Cancel"}
                </Button>
                <Button
                  color="primary"
                  onClick={(e) => {
                    datasubmit(e, props.lead.id);
                    Renewcentermodaltoggle(e);
                    props.setRenew("renewed");
                    Renewcentermodaltoggle1();
                  }}
                >
                  {"Yes"}
                </Button>
              </ModalFooter>
            </Modal>

            {/* success */}
            <Modal isOpen={renewobj} toggle={Renewcentermodaltoggle1} centered>
              <ModalBody>
                <p>
                  {renewstatus.message} till{" "}
                  {moment.utc(renewstatus.extended_period).format("YYYY-MM-DD")}{" "}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => {
                    Renewcentermodaltoggle1();
                  }}
                >
                  {"ok"}
                </Button>
              </ModalFooter>
            </Modal>

            {/* activate button modal */}
            <Modal isOpen={activebutton} toggle={Activatemodaltoggle} centered>
              <ModalHeader>{"Plan update"}</ModalHeader>
              <ModalBody>
                <p>Are you sure want to update plan ?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={Activatemodaltoggle}>
                  {"No"}
                </Button>
                <Button color="primary">{"Yes"}</Button>
              </ModalFooter>
            </Modal>
          </>
        )
      }
    </>
  );
};

export default LastInvoiceInfo;
