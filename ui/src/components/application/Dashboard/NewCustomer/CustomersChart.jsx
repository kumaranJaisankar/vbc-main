import React, { useState } from "react";
import { Donut } from "britecharts-react";
import Grid from "@mui/material/Grid";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CustomerExpiredTable from "../Customer/CustomerExpiredTable";
import { Link } from "react-router-dom";

function CustomersDonutChart(props) {

  const logMouseOver = () => console.log("Mouse Over");
  const colorSchema1 = [
    "#4a79e5",
    "#fccd3a",
    "#ff8b7b",
    "#a6a6a6",
    "#ffe346",
    "#c30420",
  ];

  const donutData = () => [
    {
      quantity: props.newCustomerData?.context?.act
        ? props.newCustomerData?.context?.act
        : "0",

      value: props.newCustomerData?.context?.act
        ? props.newCustomerData?.context?.act
        : "0",

      name: "Active",
      id: 1,
    },
    {
      quantity: props.newCustomerData?.context?.spd
        ? props.newCustomerData?.context?.spd
        : "0",
      value: props.newCustomerData?.context?.spd
        ? props.newCustomerData?.context?.spd
        : "0",

      name: "Suspended",
      id: 2,
    },
    {
      quantity: props.newCustomerData?.context?.prov
        ? props.newCustomerData?.context?.prov
        : "0",
      value: props.newCustomerData?.context?.prov
        ? props.newCustomerData?.context?.prov
        : "0",

      name: "Provisioning",
      id: 3,
    },
    {
      quantity: props.newCustomerData?.context?.exp
        ? props.newCustomerData?.context?.exp
        : "0",
      value: props.newCustomerData?.context?.exp
        ? props.newCustomerData?.context?.exp
        : "0",

      name: "Expired",
      id: 4,
    },
    {
      quantity: props.newCustomerData?.context?.hld
        ? props.newCustomerData?.context?.hld
        : "0",
      value: props.newCustomerData?.context?.hld
        ? props.newCustomerData?.context?.hld
        : "0",

      name: "Hold",
      id: 5,
    },
    {
      quantity: props.newCustomerData?.context?.dct
        ? props.newCustomerData?.context?.dct
        : "0",
      value: props.newCustomerData?.context?.dct
        ? props.newCustomerData?.context?.dct
        : "0",

      name: "Deactive",
      id: 6,
    },
  ];

 

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  // modal
  const [todayConnection, setTodayConnection] = useState(false);
  const todayConnectionModal = () => {
    setTodayConnection(!todayConnection);
    handleClose();
  };
  const [expiredTableRange, setExpiredTableRange] = useState("Today");
  {/*added Hold and Deactive in customer chart by Mareiya on 22/8/22 and chnaged online and offline count position*/}
  return (
    <>
      <Grid container>
        <Grid
          item
          xs={6}
          md={6}
          lg={6}
          sm={6}
         
        >
          <Donut
            data={donutData}
            customMouseOver={logMouseOver}
            externalRadius={180 / 2.5}
            internalRadius={180 / 4.5}
            width={150}
            height={200}
            highlightSliceById={1}
            hasFixedHighlightedSlice={true}
            colorSchema={colorSchema1}
            centeredTextFunction={({ value, name }) => `${value} ${name}`}
          />
          <br/>
          {/* <Grid container spacing={1} className="chartdata">
            <Grid
              item
              xs={6}
              sm={6}
              md={6}
              lg={6}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "-2%" }}
            >
              <span className="complaints-dot-3"></span>
              <hgroup className="hgroup">
                <h6>Online <br/> 
                 <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/vbc`,
                    state: { billingDateRange: "online" },
                  }}
                >
                  {props.newCustomerData?.status_counts?.online
                    ? props.newCustomerData?.status_counts?.online
                    : "0"}
                </Link>
                </h6>
              </hgroup>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              md={6}
              lg={6}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "-2%" }}
            >
                  <span className="complaints-dot-4"></span>
              <hgroup className="hgroup">
                <h6  id="dashboard_offline">Offline <br/> 
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/vbc`,
                    state: { billingDateRange: "act&line_status=offline" },
                  }}
                >
                  {props.newCustomerData.status_counts?.offline
                    ? props.newCustomerData.status_counts?.offline
                    : "0"}
                </Link>
                </h6>
              </hgroup>
            </Grid>
          </Grid> */}
        </Grid>
      
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          lg={6}
          style={{
            position: "relative",
            top: "-2px",
            left: "-10px",
            maxHeight: "14rem",
          }}
        >
          <Grid container spacing={1} className="chartdata">
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              lg={8}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "0%" }}
            >
              <span className="complaints-dot-1"></span>
              <hgroup className="hgroup">
                <h6>Active</h6>
              </hgroup>
            </Grid>
            <Grid
              item
              xs={3.5}
              sm={3.5}
              md={3.5}
              lg={3.5}
              style={{ textAlign: "right" }}
            >
              <span>
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`,
                    state: { billingDateRange: "act" },
                  }}
                >
                  {props.newCustomerData?.context?.act
                    ? props.newCustomerData?.context?.act
                    : "0"}
                </Link>
              </span>
            </Grid>
          </Grid>
          {/* <Grid container spacing={1} className="chartdata">
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              lg={8}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "-6%" }}
            >
              <span className="complaints-dot-4"></span>
              <hgroup className="hgroup">
                <h6>Offline</h6>
              </hgroup>

            </Grid>
            <Grid
              item
              xs={3.5}
              sm={3.5}
              md={3.5}
              lg={3.5}
              style={{ textAlign: "right" }}
            >
              <span>
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/vbc`,
                    state: { billingDateRange: "act&line_status=offline" },
                  }}
                >
                  {props.newCustomerData.status_counts?.offline
                    ? props.newCustomerData.status_counts?.offline
                    : "0"}
                </Link>
              </span>
            </Grid>
          </Grid> */}
          {/* <Grid container spacing={1} className="chartdata">
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              lg={8}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "-4%" }}
            >
              <span className="complaints-dot-9"></span>

              <hgroup className="hgroup">
                <h6>Not Yet Logged-In</h6>
                {/* <Button
                  id="demo-positioned-button"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  style={{
                    padding: "0px",
                    height: "14px",
                    position: "relative",
                    left: "-14px",
                    top: "-2px",
                  }}
                >
                  <KeyboardArrowDownIcon />
                </Button> */}
              {/* </hgroup>
            </Grid>
            <Grid
              item
              xs={3.5}
              sm={3.5}
              md={3.5}
              lg={3.5}
              style={{ textAlign: "right" }}
            >
              <span>
               
                  {props.newCustomerData?.status_counts?.nyl
                    ? props.newCustomerData?.status_counts?.nyl
                    : "0"}
               
              </span>
            </Grid>
          </Grid> */} 
          <Grid container spacing={1} className="chartdata">
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              lg={8}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "-4%" }}
            >
              <span className="complaints-dot-5"></span>

              <hgroup className="hgroup">
                <h6>Expired</h6>
                {/* <Button
                  id="demo-positioned-button"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  style={{
                    padding: "0px",
                    height: "14px",
                    position: "relative",
                    left: "-14px",
                    top: "-2px",
                  }}
                >
                  <KeyboardArrowDownIcon />
                </Button> */}
              </hgroup>
            </Grid>
            <Grid
              item
              xs={3.5}
              sm={3.5}
              md={3.5}
              lg={3.5}
              style={{ textAlign: "right" }}
            >
              <span>
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`,
                    state: { billingDateRange: "exp" },
                  }}
                >
                  {props.newCustomerData?.context?.exp
                    ? props.newCustomerData?.context?.exp
                    : "0"}
                </Link>
              </span>
            </Grid>
          </Grid>
          <Grid container spacing={1} className="chartdata">
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              lg={8}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "-8%" }}
            >
              <span className="complaints-dot-2"></span>
              <hgroup className="hgroup">
                <h6>Suspended</h6>
              </hgroup>
            </Grid>
            <Grid
              item
              xs={3.5}
              sm={3.5}
              md={3.5}
              lg={3.5}
              style={{ textAlign: "right" }}
            >
              <span>
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`,
                    state: { billingDateRange: "spd" },
                  }}
                >
                  {props.newCustomerData?.context?.spd
                    ? props.newCustomerData?.context?.spd
                    : "0"}
                </Link>
              </span>
            </Grid>
          </Grid>
          <Grid container spacing={1} className="chartdata">
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              lg={8}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "-10%" }}
            >
              {" "}
              <span className="complaints-dot-6"></span>
              <hgroup className="hgroup">
                <h6>Provisioning</h6>
              </hgroup>
            </Grid>
            <Grid
              item
              xs={3.5}
              sm={3.5}
              md={3.5}
              lg={3.5}
              style={{ textAlign: "right" }}
            >
              <span>
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`,
                    state: { billingDateRange: "prov" },
                  }}
                >
                  {props.newCustomerData?.context?.prov
                    ? props.newCustomerData?.context?.prov
                    : "0"}
                </Link>
              </span>
            </Grid>
          </Grid>
          <Grid container spacing={1} className="chartdata">
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              lg={8}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "-6%" }}
            >
              <span className="complaints-dot-14"></span>
              <hgroup className="hgroup">
                <h6>Hold</h6>
              </hgroup>

            </Grid>
            <Grid
              item
              xs={3.5}
              sm={3.5}
              md={3.5}
              lg={3.5}
              style={{ textAlign: "right" }}
            >
              <span>
              <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`,
                    state: { billingDateRange: "hld" },
                  }}
                >
              {props.newCustomerData?.context?.hld
                    ? props.newCustomerData?.context?.hld
                    : "0"}
                    </Link>
              </span>
            </Grid>
          </Grid>
           <Grid container spacing={1} className="chartdata">
            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              lg={8}
              className="PaddingStyle"
            // style={{ padding: "0px", position: "relative", top: "-6%" }}
            >
              <span className="complaints-dot-13"></span>
              <hgroup className="hgroup">
                <h6>Deactive</h6>
              </hgroup>

            </Grid>
            <Grid
              item
              xs={3.5}
              sm={3.5}
              md={3.5}
              lg={3.5}
              style={{ textAlign: "right" }}
            >
              <span>
              <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`,
                    state: { billingDateRange: "dct" },
                  }}
                >
              {props.newCustomerData?.context?.dct
                    ? props.newCustomerData?.context?.dct
                    : "0"}
                    </Link>
              {/* {props.newCustomerData?.customers_by_status?.dct
                    ? props.newCustomerData?.customers_by_status?.dct
                    : "0"} */}
              </span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>



      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            setExpiredTableRange("Today");
            todayConnectionModal();
          }}
        >
          Today
        </MenuItem>
        <MenuItem
          onClick={() => {
            setExpiredTableRange("Yesterday");
            todayConnectionModal();
          }}
        >
          Yesterday
        </MenuItem>
        <MenuItem
          onClick={() => {
            setExpiredTableRange("Next 7 Days");
            todayConnectionModal();
          }}
        >
          Next 7 Days
        </MenuItem>
      </Menu>
      {/* modal */}
      <Modal
        isOpen={todayConnection}
        toggle={todayConnectionModal}
        centered
        size="lg"
      >
        <ModalFooter>
          <Button color="secondary" onClick={todayConnectionModal} id="resetid">
            {"Close"}
          </Button>
        </ModalFooter>
        <ModalBody>
          <h5 style={{ marginTop: "-65px", width: "fit-content" }}>
            Customers Expiring {expiredTableRange}
          </h5>
          <CustomerExpiredTable expiredTableRange={expiredTableRange} />
        </ModalBody>
      </Modal>
    </>
  );
}

export default CustomersDonutChart;
