import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  Label,
  Table,
  Form,
  ModalHeader,
} from "reactstrap";
import moment from "moment";
import { Search } from "../../../constant";

import { toast } from "react-toastify";

import { customeraxios, billingaxios } from "../../../axios";

const Revenue = (props) => {
  const [currentPlan, setCurrentPlan] = useState({});
  const [showpayment, setShowPayment] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [sucModal, setSucModal] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  // plan upgarde
  useEffect(() => {
    customeraxios.get("/customers/plan/update/" + props.id).then((res) => {
      setCurrentPlan(res.data);
    });
  }, []);

  const amountpayable =
    parseFloat(props.serviceobjdata.total_plan_cost).toFixed(2) -
    parseFloat(currentPlan.balance).toFixed(2);
  const submitdata = () => {
    if (!!selectedPaymentId) {
      // successModal();
      setSucModal(true);
      setAlertMessage("Your payment is processing...");
      setLoadingPay(true);
      const obj = {
        amount: amountpayable,
        // cgst: props.serviceobjdata.plan_cgst,
        // sgst: props.serviceobjdata.plan_sgst,
        // installation: currentPlan.installation_charges,
        // security: 0,
        gst_calculated: "true",
        source: "IP",
        gateway_id: selectedPaymentId,
      };
      billingaxios.post("payment/", obj).then((response) => {
        
        console.log(response.data, "payment");
        setCurrentPlan({});
        
        // props.Verticalcentermodaltoggle1();
        paymentId(response.data);
      });
    } else {
      console.log("errors try again");
    }
  };

  const submit = (invoice_id) => {
    let objForCreateUser = {
      plan: currentPlan.id,
      payment_id: invoice_id,
      amount: amountpayable,
      paid_date: "",
    };

    customeraxios
      .patch("/customers/plan/update/" + props.id, objForCreateUser)
      .then((res) => {
        setSucModal(false);
        props.setServiceobjdata({});
        console.log(res);
        console.log(res.data);
        toast.success("Successfully Plan Update", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const paymentId = (response) => {
    if (response.status == 2) {
      let billingbaseurl = process.env.REACT_APP_API_URL_BILLING.split("//")[1];
      console.log(billingbaseurl, "billingbaseurl");
      let protocol = window.location.protocol ? "wss:" : "ws:";
      var ws = new WebSocket(
        `${protocol}//${billingbaseurl}/ws/${response.payment_id}/listen/payment/status`
      );
      ws.onopen = () => {
        console.log("socket cnxn successful");
      };
      ws.onclose = (e) => {
        console.log("socket closed", e);
      };
      ws.onmessage = (e) => {
        console.log(e.data);
        let responseData = JSON.parse(e.data);
        if (responseData.status == 1) {
          toast.success("Payment is completed", {
            position: toast.POSITION.TOP_RIGHT,
          });
          ws.close();
          submit(responseData.invoice_id);
          setLoadingPay(false);
          props.Verticalcentermodaltoggle1();
        }
      };
    }
  };

  const successModal = () => {
    if (sucModal) {
      setLoadingPay(false);
    }
    setSucModal(!sucModal);
  };
  // filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = props.serviceplanobj.filter((data) => {
      console.log(data);
      if (
        data.plan_cost.search(value) != -1 ||
        data.package_name.toLowerCase().search(value) != -1
      )
        return data;
    });
    props.setServiceplanobj(result);
  };

  const searchInputField = useRef(null);

  return (
    <>
      <Modal
        isOpen={props.serviceobj}
        toggle={props.Verticalcentermodaltoggle1}
        centered
        style={{ maxWidth: "1000px" }}
      >
        <ModalBody>
          <Form>
            <input
              className="form-control"
              type="text"
              placeholder="Search for Plan or Enter Amount"
              // Sailaja Added capitalize each work as per QA Team advice on 6th March
              onChange={(event) => handlesearchChange(event)}
              ref={searchInputField}
              style={{
                border: "1px solid #ced4da",
                backgroundColor: "white",
              }}
            />
            <Search className="search-icon" />
          </Form>
          <Row
            style={{
              marginTop: "30px",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            <Col sm="9">
              <div className="table-responsive">
                <Table className="table-border-vertical">
                  <thead>
                    <tr>
                      <th scope="col">{"Package Name"}</th>
                      <th scope="col">{"Fup Limit"}</th>
                      <th scope="col">{"Upload speed"}</th>
                      <th scope="col">{"Download Speed"}</th>
                      <th scope="col">{"Plan Cost"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.serviceplanobj.map((services) => (
                      <tr>
                        <td scope="row">
                          {" "}
                          <>
                            <Label className="d-block" for="edo-ani1">
                              <Input
                                className="radio_animated"
                                type="radio"
                                id="edo-ani1"
                                key={services.id}
                                value={services.id}
                                name="package_name"
                                onChange={(e) =>
                                  props.setServiceobjdata(services)
                                }
                              />
                              {services.package_name}
                            </Label>
                          </>
                        </td>
                        <td>{parseFloat(services.fup_limit).toFixed(0)}</td>
                        <td>
                          {parseFloat(services.upload_speed).toFixed(0) + "GB"}
                        </td>
                        <td>
                          {parseFloat(services.download_speed).toFixed(0) +
                            "GB"}
                        </td>
                        <td>
                          ₹{parseFloat(services.total_plan_cost).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>

            <Col sm="3">
              {Object.keys(props.serviceobjdata).length > 0 ? (
                <>
                  <h5> New Plan</h5>

                  <p>
                    {" "}
                    Plan Cost: ₹
                    {props.serviceobjdata &&
                      parseFloat(props.serviceobjdata.total_plan_cost).toFixed(
                        2
                      )}
                  </p>
                  <p>
                    {" "}
                    Upload Speed:
                    {props.serviceobjdata &&
                      parseFloat(props.serviceobjdata.upload_speed).toFixed(0) +
                        "GB"}
                  </p>
                  <p>
                    {" "}
                    Download Speed:
                    {props.serviceobjdata &&
                      parseFloat(props.serviceobjdata.download_speed).toFixed(
                        0
                      ) + "GB"}
                  </p>
                  <p>
                    {" "}
                    FUP Limit:
                    {props.serviceobjdata &&
                      parseFloat(props.serviceobjdata.fup_limit).toFixed(2)}
                  </p>
                </>
              ) : (
                ""
              )}

              {Object.keys(currentPlan).length > 0 && (
                <>
                  <h5>Current Plan</h5>
                  <p>
                    {" "}
                    Package Name:
                    {currentPlan && currentPlan.plan_name}
                  </p>
                  <p>
                    {" "}
                    Plan Cost: ₹
                    {currentPlan &&
                      parseFloat(currentPlan.plan_cost).toFixed(2)}
                  </p>
                  <p>
                    {" "}
                    Upload Speed:
                    {currentPlan.upload_speed &&
                      parseFloat(currentPlan.upload_speed).toFixed(0) + "GB"}
                  </p>
                  <p>
                    {" "}
                    Download Speed:
                    {currentPlan.download_speed &&
                      parseFloat(currentPlan.download_speed).toFixed(0) + "GB"}
                  </p>
                  <p>
                    {" "}
                    Fup Limit:
                    {currentPlan.fup_limit &&
                      parseFloat(currentPlan.fup_limit).toFixed(0) + "GB"}
                  </p>
                  <p>
                    {" "}
                    Usage Cost: ₹
                    {currentPlan.usage_cost &&
                      parseFloat(currentPlan.usage_cost).toFixed(0)}
                  </p>
                  <p>
                    {" "}
                    Plan Start Date:
                    {currentPlan.plan_start_date &&
                      moment(currentPlan.plan_start_date).format("l")}
                  </p>
                  <p>
                    {" "}
                    No.of consumption Days:
                    {currentPlan.total_days &&
                      parseFloat(currentPlan.total_days).toFixed(0)}
                  </p>
                  <p>
                    {" "}
                    Remaining Balance: ₹
                    {currentPlan.balance &&
                      parseFloat(currentPlan.balance).toFixed(0)}
                  </p>

                  {Object.keys(props.serviceobjdata).length > 0 && (
                    <p>
                      <b>
                        {" "}
                        Amount to be Payable: ₹
                        {props.serviceobjdata &&
                          parseFloat(amountpayable).toFixed(2)}
                      </b>{" "}
                    </p>
                  )}
                </>
              )}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              props.Verticalcentermodaltoggle1();
              props.setServiceobjdata({});
            }}
          >
            {"Cancel"}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              // setCurrentPlan({});
              // props.setServiceobjdata({});
              // props.Verticalcentermodaltoggle1();
              // submitdata();
              setShowPayment(true);
            }}
          >
            {/* {"Send payment link & change plan"} */}
            {loadingPay
              ? " Payment Processing "
              : "Send payment link & change plan "}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={sucModal} toggle={successModal} centered>
        <ModalHeader toggle={successModal}>Processing Request</ModalHeader>
        <ModalBody>
          <p>{alertMessage}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary">OK</Button>
        </ModalFooter>
      </Modal>
     
    </>
  );
};
export default Revenue;
