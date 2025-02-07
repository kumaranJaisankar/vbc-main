import React from "react";
import Grid from "@mui/material/Grid";
import { Card, CardHeader, CardBody, Spinner } from "reactstrap";
// import DateRange from "./index";
import { Link } from "react-router-dom";
import CustomersDonutChart from "./CustomersChart";
const CustomerCard = React.memo((props) => {
  return (
    <>
      <Grid item xs={12} sm={12} lg={12} xl={12} md={12}>
        <Card
          style={{
            borderRadius: "10px",
            flex: "0 0 100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          {false ? (
            <Grid container spacing={2} className="loadercenter">
              <Spinner size="lg" className="dashboard_spinner">
                {" "}
              </Spinner>
            </Grid>
          ) : (
            <>
              <CardHeader style={{ padding: "5px", borderBottom: "0px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                    {/* <div style={{ display: "flex" }}>
                  <div
                    className="dashboard-font"
                    style={{
                      position: "relative",
                      left: "15px",
                      // marginBottom: "10px",
                      marginTop: "5px",
                    }}
                  >
                    CUSTOMERS
                  </div>{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </div> */}
                    {/* <Grid
                  item
                  xs={6}
                  md={6}
                  sm={6}
                  lg={6}
                  style={{
                    position: "relative",
                    left: "12px",
                    paddingTop: "0px",
                  }}
                >
                  <p
                    className="customer_count"
                    style={{
                      marginTop: "-5px",
                      marginBottom: "0px",
                      fontSize: "20px",
                    }}
                  >
                    <span>{props.newCustomerData?.context?.all}</span>
                  </p>
                </Grid> */}
                  </Grid>
                  <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                    {/* <Link
                      to={{
                        pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`,
                      }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "-10px",
                          marginTop: "5px",
                          zIndex: "1",
                        }}
                        class="fa fa-arrow-right"
                      ></i>
                    </Link> */}
                  </Grid>
                </Grid>
              </CardHeader>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ color: "#19345fab" }}>Total Active Students</h2>
                <h1 style={{ fontSize: "70px", color: "#1890ff8c" }}>
                  {props.studentCount ? props.studentCount : 0}
                </h1>
              </div>
              {/* <CardBody style={{ padding: "0px", margin: "0px" }}>
                <CustomersDonutChart
                  // setNewCustomerData={props.setNewCustomerData}
                  newCustomerData={props.newCustomerData}
                  // customerData={props.customerData}
                  // setHeaderData={props.setHeaderData}
                />
              </CardBody> */}
            </>
          )}
        </Card>
      </Grid>
    </>
  );
});

export default CustomerCard;
