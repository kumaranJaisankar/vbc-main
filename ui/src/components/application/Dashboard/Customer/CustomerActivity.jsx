import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
} from "reactstrap";
import { Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import Grid from "@mui/material/Grid";
import CustomerExpiredTable from "./CustomerExpiredTable";
// import { useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';

const CustomerActivity = ({ customerInfo }) => {
  const [expanded1, setexpanded1] = useState(true);
  const [expanded2, setexpanded2] = useState(true);
  const [expanded3, setexpanded3] = useState(true);
  const [expanded4, setexpanded4] = useState(true);
  const Accordion1 = () => {
    setexpanded1(!expanded1);
  };
  const Accordion2 = () => {
    setexpanded2(!expanded2);
  };
  const Accordion3 = () => {
    setexpanded3(!expanded3);
  };
  const Accordion4 = () => {
    setexpanded4(!expanded4);
  };

  // modal
  const [todayConnection, setTodayConnection] = useState(false);
  const todayConnectionModal = () => setTodayConnection(!todayConnection);
  const [expiredTableRange, setExpiredTableRange] = useState("today");

  const totalTicket =
    customerInfo &&
    customerInfo.complaint_counts &&
    customerInfo.complaint_counts.total
      ? customerInfo &&
        customerInfo.complaint_counts &&
        customerInfo.complaint_counts.total
      : "0";
  const doughnutData = {
    labels: ["Open", "In Progress", "Resolved", "Closed","Assigned"],
    datasets: [
      {
        label: "My First Dataset",
        data: [
          customerInfo &&
          customerInfo.complaint_counts &&
          customerInfo.complaint_counts.opn
            ? customerInfo &&
              customerInfo.complaint_counts &&
              customerInfo.complaint_counts.opn
            : "0",
          customerInfo &&
          customerInfo.complaint_counts &&
          customerInfo.complaint_counts.inp
            ? customerInfo &&
              customerInfo.complaint_counts &&
              customerInfo.complaint_counts.inp
            : "0",
          customerInfo &&
          customerInfo.complaint_counts &&
          customerInfo.complaint_counts.rsl
            ? customerInfo &&
              customerInfo.complaint_counts &&
              customerInfo.complaint_counts.rsl
            : "0",
          customerInfo &&
          customerInfo.complaint_counts &&
          customerInfo.complaint_counts.cld
            ? customerInfo &&
              customerInfo.complaint_counts &&
              customerInfo.complaint_counts.cld
            : "0",
            customerInfo &&
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.asn
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.asn
                  : 0
        ],
        backgroundColor: [
          "#344cab",
          "#87a4d8",
          "#c1d7fe",
          "#cddffe",
          "#99ff99",
        ],
      },
    ],
  };


  const doughnutOption = {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
        color: "white",
      },
    },
  };

  const [plugins, setplugins] = useState();
  useEffect(()=>{

    if(!!customerInfo.total_no_of_customers){
      setplugins([{
        beforeDraw: function(chart) {
         var width = chart.width,
             height = chart.height,
             ctx = chart.ctx;
             ctx.restore();
             var fontSize = (height / 210).toFixed(2);
             ctx.font = fontSize + "em sans-serif";
             ctx.textBaseline = "top";
             var text = "Total " + `${totalTicket}`,
             textX = Math.round((width - ctx.measureText(text).width) / 2),
             textY = height / 2.1;
             ctx.fillText(text, textX, textY);
             ctx.save();
        } 
      }])
    }
  }, [customerInfo])

// const complaintRoute = () =>{
//   // <a href="/app/ticket/all/spark_radius">  </a>
// }

// let navigate = useNavigate(); 
// const routeChange = () =>{ 
//   let path = `/app/ticket/all/spark_radius`; 
//   navigate(path);
// }
  return (
    <>
      <Grid
        container
        spacing={1}
        className="Main-grid"
      >
        <Grid item md="6">
          {!!plugins && (
            <Doughnut
              data={doughnutData}
              options={doughnutOption}
              width={380}
            height={190}
              plugins={plugins}
            />
          )}
        </Grid>
        <Grid item md="1"></Grid>
        {/* <Grid item md="5">
          <Grid container spacing={1} style={{ borderBottom: "2px solid" }}>
            <Grid item md="8">
              <p>
                <b>Total </b>
              </p>
            </Grid>
            <Grid item md="4">
              <p style={{ textAlign: "end" }}>
                {" "}
                <b>{totalTicket}</b>
              </p>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray " }}
          >
            <Grid
              item
              md="7"
              className="dashboardstatus"
              style={{ display: "flex" }}
            >
              Open{" "}
            </Grid>
            <Grid
              item
              md="5"
              className="dashboardstatus"
              style={{ textAlign: "right" }}
            >
              <p style={{ fontWeight: "bold" }}>
                {customerInfo &&
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.opn
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.opn
                  : 0}
              </p>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray " }}
          >
            <Grid
              item
              md="7"
              className="dashboardstatus"
              style={{ display: "flex" }}
            >
              In Progress{" "}
            </Grid>
            <Grid
              item
              md="5"
              className="dashboardstatus"
              style={{ textAlign: "right" }}
            >
              <p style={{ fontWeight: "bold" }}>
                {customerInfo &&
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.inp
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.inp
                  : 0}
              </p>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray " }}
          >
            <Grid
              item
              md="7"
              className="dashboardstatus"
              style={{ display: "flex" }}
            >
              Resolved{" "}
            </Grid>
            <Grid
              item
              md="5"
              className="dashboardstatus"
              style={{ textAlign: "right" }}
            >
              <p style={{ fontWeight: "bold" }}>
                {customerInfo &&
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.rsl
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.rsl
                  : 0}
              </p>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray " }}
          >
            <Grid
              item
              md="7"
              className="dashboardstatus"
              style={{ display: "flex" }}
            >
              Closed{" "}
            </Grid>
            <Grid
              item
              md="5"
              className="dashboardstatus"
              style={{ textAlign: "right" }}
            >
              <p style={{ fontWeight: "bold" }}>
                {customerInfo &&
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.cld
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.cld
                  : 0}
              </p>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray " }}
          >
            <Grid
              item
              md="7"
              className="dashboardstatus"
              style={{ display: "flex" }}
            >
              Assigned{" "}
            </Grid>
            <Grid
              item
              md="5"
              className="dashboardstatus"
              style={{ textAlign: "right" }}
            >
              <p style={{ fontWeight: "bold" }}>
                {customerInfo &&
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.asn
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.asn
                  : 0}
              </p>
            </Grid>
          </Grid>
        </Grid> */}

<Grid item xs="5" style={{paddingTop:"36px"}}>
        
        <Grid container spacing={1} style={{borderBottom:"2px solid" }}>
          <Grid item xs="8">
            <p style={{marginBottom:"0em"}}>
              <b>Total</b>
               </p>
          </Grid>
          
          <Grid item xs="4">
            <p style={{ textAlign:"end",marginBottom:"0em"}} className="dashboardstatus"><b>{totalTicket}</b></p>
          </Grid>
        </Grid>
       
        <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
          <Grid item xs="8"  className="Grid-checkbox">
       <Grid className="Active-checkbox-color"></Grid>
        <Grid className="dashboardstatus" style={{marginBottom:"0em"}}>Open </Grid>  
         <Grid item md="5" className="dashboardstatus" style={{textAlign:"right"}}></Grid> 
          </Grid>
         
          <Grid item xs="4">    
          {/* <a href="/app/ticket/all/spark_radius">   */}
            <p style={{ textAlign:"end",marginBottom:"0em"}} className="dashboardstatus">
              {
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.opn
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.opn
                  : 0}
                  
                  </p>
          {/* </a>  */}
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
          <Grid item xs="8" className="Grid-checkbox">
          <p className="Deactive-checkbox-color"></p>
            <p className="dashboardstatus" style={{marginBottom:"0em"}}>In Progress </p>
          </Grid>
          <Grid item xs="4">
            <p style={{ textAlign:"end",marginBottom:"0em"}} className="dashboardstatus">{customerInfo &&
                      customerInfo.complaint_counts &&
                      customerInfo.complaint_counts.inp
                        ? customerInfo &&
                          customerInfo.complaint_counts &&
                          customerInfo.complaint_counts.inp
                        : 0}</p>
          </Grid>
        </Grid>
        
        <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
          <Grid item xs="8"  className="Grid-checkbox">
          <p className="Expired-checkbox-color"></p>
            <p className="dashboardstatus" style={{marginBottom:"0em"}}>Resolved</p>
          </Grid>
          <Grid item xs="4">
            <p style={{ textAlign:"end",marginBottom:"0em"}} className="dashboardstatus">{customerInfo &&
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.rsl
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.rsl
                  : 0}</p>
          </Grid>
        </Grid>
        
        <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
          <Grid item xs="8" className="Grid-checkbox">
          <p className="Offline-checkbox-color"></p>
            <p className="dashboardstatus" style={{marginBottom:"0em"}}>Closed</p>
          </Grid>
          <Grid item xs="4">
            <p style={{ textAlign:"end",marginBottom:"0em"}} className="dashboardstatus">{ customerInfo &&
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.cld
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.cld
                  : 0}</p>
          </Grid>
        </Grid>
        
        <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
          <Grid item xs="8"  className="Grid-checkbox">
          <p className="Online-checkbox-color"></p>
            <p className="dashboardstatus" style={{marginBottom:"0em"}}>Assigned</p>
          </Grid>
          <Grid item xs="4">
            <p style={{ textAlign:"end",marginBottom:"0em"}} className="dashboardstatus">{ customerInfo &&
                customerInfo.complaint_counts &&
                customerInfo.complaint_counts.asn
                  ? customerInfo &&
                    customerInfo.complaint_counts &&
                    customerInfo.complaint_counts.asn
                  : 0}</p>
          </Grid>
        </Grid>
        
      </Grid>
      </Grid>
      {/* Today */}
      {/* <Accordion defaultActiveKey="0">
        <Card style={{ padding: "0px" }}>
          <CardHeader className="" style={{ backgroundColor: "#d9d9d9" }}>
            <h5 className="mb-0">
              <span style={{ fontSize: "12px" }}>{"Today"}</span>
              <Accordion.Toggle
                as={Card.Header}
                className="btn btn-link txt-white "
                color="primary"
                eventKey="0"
                onClick={Accordion1}
                aria-expanded={expanded1}
                style={{ padding: "0rem", float: "right" }}
              >
                <i className="fa fa-minus"></i>
              </Accordion.Toggle>
            </h5>
          </CardHeader>

          <Accordion.Collapse eventKey="0">
            <div className="table-responsive">
              <Table>
                <tbody>
                  <tr>
                    <td>{"New Connections"}</td>
                    <td style={{ textAlign: "end" }}>
                      {customerInfo && customerInfo.today_activations
                        ? customerInfo && customerInfo.today_activations
                        : "0"}
                    </td>
                  </tr>
                  <tr  onClick={()=>{
                        setExpiredTableRange('today');
                        todayConnectionModal();
                      }}>
                    <td>{"Expiry"}</td>
                    <td
                      style={{ textAlign: "end", cursor:"pointer",color:"#1565c0",fontWeight:"bold"}}
                     
                    >
                      {customerInfo && customerInfo.today_expiry
                        ? customerInfo && customerInfo.today_expiry
                        : "0"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Renewals"}</td>

                    <td style={{ textAlign: "end" }}>
                      {customerInfo &&
                      customerInfo.today_renewal &&
                      customerInfo.today_renewal.count
                        ? customerInfo &&
                          customerInfo.today_renewal &&
                          customerInfo.today_renewal.count
                        : "0"}{" "}
                      / ₹{" "}
                      {customerInfo &&
                      customerInfo.today_renewal &&
                      customerInfo.today_renewal.amount
                        ? customerInfo &&
                          customerInfo.today_renewal &&
                          customerInfo.today_renewal.amount.toFixed(2)
                        : "0"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Payments"}</td>
                    <td style={{ textAlign: "end",color: "rgba(113, 111, 111, 0.7)" }}>
                    <Link to={`${process.env.PUBLIC_URL}/app/billingandpayments/billing/spark_radius`}>

                      {customerInfo &&
                        customerInfo.today_payments &&
                        customerInfo.today_payments.reduce(
                          (a, v) => (a = a + v.count),
                          0
                        )}{" "}
                      / ₹{" "}
                      {customerInfo &&
                        customerInfo.today_payments &&
                        customerInfo.today_payments
                          .reduce((a, v) => (a = a + v.amount), 0)
                          .toFixed(2)}
                    </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>{"Online Pay"}</td>
                    <td style={{ textAlign: "end" }}>
                      {" "}
                      {customerInfo &&
                        customerInfo.today_payments &&
                        customerInfo.today_payments
                          .filter((item) => item.pickup_type === "ONL")
                          .reduce((acc, curr) => {
                            if (curr) {
                              acc = acc + curr.count;
                            }
                            return acc;
                          }, 0)}{" "}
                      / ₹{" "}
                      {customerInfo &&
                        customerInfo.today_payments &&
                        customerInfo.today_payments
                          .filter((item) => item.pickup_type === "ONL")
                          .reduce((acc, curr) => {
                            if (curr) {
                              acc = acc + curr.amount;
                            }
                            return acc;
                          }, 0)
                          .toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion> */}
      {/* Yesterday */}
      {/* <Accordion defaultActiveKey="1">
        <Card style={{ padding: "0px" }}>
          <CardHeader className="" style={{ backgroundColor: "#d9d9d9" }}>
            <h5 className="mb-0">
              <span style={{ fontSize: "12px" }}> {"Yesterday"}</span>
              <Accordion.Toggle
                as={Card.Header}
                className="btn btn-link txt-white "
                color="primary"
                eventKey="1"
                onClick={Accordion2}
                aria-expanded={expanded2}
                style={{ padding: "0rem", float: "right" }}
              >
                <i className="fa fa-minus"></i>
              </Accordion.Toggle>
            </h5>
          </CardHeader>
          <Accordion.Collapse eventKey="1">
            <div className="table-responsive">
              <Table>
                <tbody>
                  <tr>
                    <td>{"New Connections"}</td>
                    <td style={{ textAlign: "end" }}>
                      {customerInfo && customerInfo.yesterday_activations
                        ? customerInfo && customerInfo.yesterday_activations
                        : "0"}
                    </td>
                  </tr>
                  <tr  onClick={()=>{
                        setExpiredTableRange('yesterday');
                        todayConnectionModal();
                      }}>
                    <td>{"Expiry"}</td>
                    <td style={{ textAlign: "end" ,cursor:"pointer",color:"#1565c0",fontWeight:"bold"}}>
                      {customerInfo && customerInfo.yesterday_expiry
                        ? customerInfo && customerInfo.yesterday_expiry
                        : "0"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Renewals"}</td>
                    <td style={{ textAlign: "end" }}>
                      {customerInfo &&
                      customerInfo.yesterday_renewal &&
                      customerInfo.yesterday_renewal.yesterday_renwals
                        ? customerInfo &&
                          customerInfo.yesterday_renewal &&
                          customerInfo.yesterday_renewal.yesterday_renwals
                        : "0"}{" "}
                      / ₹{" "}
                      {customerInfo &&
                      customerInfo.yesterday_renewal &&
                      customerInfo.yesterday_renewal.amount
                        ? customerInfo &&
                          customerInfo.yesterday_renewal &&
                          customerInfo.yesterday_renewal.amount.toFixed(2)
                        : "0"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Payments"}</td>
                    <td style={{ textAlign: "end" }}>
                      {customerInfo &&
                        customerInfo.yesterday_payments &&
                        customerInfo.yesterday_payments.reduce(
                          (a, v) => (a = a + v.count),
                          0
                        )}{" "}
                      / ₹{" "}
                      {customerInfo &&
                        customerInfo.yesterday_payments &&
                        customerInfo.yesterday_payments
                          .reduce((a, v) => (a = a + v.amount), 0)
                          .toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Online Pay"}</td>

                    <td style={{ textAlign: "end" }}>
                      {" "}
                      {customerInfo &&
                        customerInfo.yesterday_payments &&
                        customerInfo.yesterday_payments
                          .filter((item) => item.pickup_type === "ONL")
                          .reduce((acc, curr) => {
                            if (curr) {
                              acc = acc + curr.count;
                            }
                            return acc;
                          }, 0)}{" "}
                      / ₹{" "}
                      {customerInfo &&
                        customerInfo.yesterday_payments &&
                        customerInfo.yesterday_payments
                          .filter((item) => item.pickup_type === "ONL")
                          .reduce((acc, curr) => {
                            if (curr) {
                              acc = acc + curr.amount;
                            }
                            return acc;
                          }, 0)
                          .toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion> */}
      {/* Complaint */}
      {/* <Accordion defaultActiveKey="2">
        <Card style={{ padding: "0px" }}> */}
      {/* <CardHeader className="" style={{ backgroundColor: "#d9d9d9" }}>
            <h5 className="mb-0">
              <span style={{ fontSize: "12px" }}>{"Complaint"}</span>
              <Accordion.Toggle
                as={Card.Header}
                className="btn btn-link txt-white "
                color="primary"
                eventKey="2"
                onClick={Accordion3}
                aria-expanded={expanded3}
                style={{ padding: "0rem", float: "right" }}
              >
                <i className="fa fa-minus"></i>
              </Accordion.Toggle>
            </h5>
          </CardHeader> */}
      {/* <Accordion.Collapse eventKey="2"> */}
      {/* <div className="table-responsive">
              <Table>
                <tbody>
                  <tr>
                    <td>{"Open"}</td>
                    <td style={{ textAlign: "end" }}>
                      {customerInfo &&
                      customerInfo.complaint_counts &&
                      customerInfo.complaint_counts.opn
                        ? customerInfo &&
                          customerInfo.complaint_counts &&
                          customerInfo.complaint_counts.opn
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td>{"In Progress"}</td>
                    <td style={{ textAlign: "end" }}>
                      {customerInfo &&
                      customerInfo.complaint_counts &&
                      customerInfo.complaint_counts.inp
                        ? customerInfo &&
                          customerInfo.complaint_counts &&
                          customerInfo.complaint_counts.inp
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Resolved"}</td>
                    <td style={{ textAlign: "end" }}>
                      {customerInfo &&
                      customerInfo.complaint_counts &&
                      customerInfo.complaint_counts.rsl
                        ? customerInfo &&
                          customerInfo.complaint_counts &&
                          customerInfo.complaint_counts.rsl
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Closed"}</td>
                    <td style={{ textAlign: "end" }}>
                      {customerInfo &&
                      customerInfo.complaint_counts &&
                      customerInfo.complaint_counts.cld
                        ? customerInfo &&
                          customerInfo.complaint_counts &&
                          customerInfo.complaint_counts.cld
                        : 0}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div> */}
      {/* </Accordion.Collapse>
        </Card>
      </Accordion> */}
      {/* <Accordion defaultActiveKey="3">
        <Card style={{ padding: "0px" }}>
          <CardHeader className="" style={{ backgroundColor: "#d9d9d9" }}>
            <h5 className="mb-0">
              <span style={{ fontSize: "12px" }}>
                {" "}
                {"Upcoming user expiry"}
              </span>
              <Accordion.Toggle
                as={Card.Header}
                className="btn btn-link txt-white "
                color="primary"
                eventKey="3"
                onClick={Accordion4}
                aria-expanded={expanded4}
                style={{ padding: "0rem", float: "right" }}
              >
                <i className="fa fa-minus"></i>
              </Accordion.Toggle>
            </h5>
          </CardHeader>
          <Accordion.Collapse eventKey="3">
            <div className="table-responsive">
              <Table>
                <tbody>
                <tr  onClick={()=>{
                        setExpiredTableRange('tomorrow');
                        todayConnectionModal();
                      }}>
                    <td>{"Tomorrow Expiry"}</td>
                    <td style={{ textAlign: "end",cursor:"pointer",color:"#1565c0" ,fontWeight:"bold"}}>
                      {customerInfo &&
                      customerInfo.upcoming_user_expiry_tomorrow
                        ? customerInfo &&
                          customerInfo.upcoming_user_expiry_tomorrow
                        : "0"}
                    </td>
                  </tr>
                  <tr  onClick={()=>{
                        setExpiredTableRange('next 7 days');
                        todayConnectionModal();
                      }}>
                    <td>{"Next 7 Days"}</td>
                    <td style={{ textAlign: "end" ,cursor:"pointer",color:"#1565c0",fontWeight:"bold"}}>
                      {customerInfo &&
                      customerInfo.upcoming_user_expiry_next7days
                        ? customerInfo &&
                          customerInfo.upcoming_user_expiry_next7days
                        : "0"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion> */}

      {/* modal */}
      <Modal
        isOpen={todayConnection}
        toggle={todayConnectionModal}
        centered
        size="lg"
      >
        <ModalHeader>customers expiring {expiredTableRange} </ModalHeader>
        <ModalBody>
          <CustomerExpiredTable expiredTableRange={expiredTableRange} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" id ="resetid"onClick={todayConnectionModal}>
            {"Close"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default CustomerActivity;
