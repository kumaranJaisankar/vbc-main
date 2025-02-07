import React from "react";
import Slider from "rc-slider";
import Grid from "@mui/material/Grid";
import "rc-slider/assets/index.css";
import CachedIcon from "@mui/icons-material/Cached";
import Tooltip from "@mui/material/Tooltip";

const Header = (props) => {
  const marks = {
    30: {
      label: (
        <span
          style={{ position: "relative", top: "-12px" }}
          value="last30days"
          onClick={(e) => {
            props.headerDaterangeselection(30);
            props.setChangeDate("last30days");
            if (props.invoiceDownload) {
              props.SetInvoiceDownload(!props.invoiceDownload);
            }
            if (props.customerState) {
              props.setCustomerState(!props.customerState);
            }
          }}
        >
          <p>Last 30 Days</p>
        </span>
      ),
    },
    50: {
      label: (
        <span
          style={{ position: "relative", top: "-12px" }}
          value="last15days"
          onClick={(e) => {
            props.headerDaterangeselection(50);
            props.setChangeDate("last15days");
            if (props.invoiceDownload) {
              props.SetInvoiceDownload(!props.invoiceDownload);
            }
            if (props.customerState) {
              props.setCustomerState(!props.customerState);
            }
          }}
        >
          <p>Last 15 Days</p>
        </span>
      ),
    },
    68: {
      label: (
        <span
          style={{ position: "relative", top: "-12px", left: "10px" }}
          value="last7days"
          onClick={(e) => {
            props.headerDaterangeselection(68);
            props.setChangeDate("last7days");
            if (props.invoiceDownload) {
              props.SetInvoiceDownload(!props.invoiceDownload);
            }
            if (props.customerState) {
              props.setCustomerState(!props.customerState);
            }
          }}
        >
          <p>Last 7 Days</p>
        </span>
      ),
    },
    88: {
      label: (
        <span
          style={{ position: "relative", top: "-12px" }}
          value="today"
          onClick={(e) => {
            props.headerDaterangeselection(88);
            props.setChangeDate("today");
            if (props.invoiceDownload) {
              props.SetInvoiceDownload(!props.invoiceDownload);
            }
            if (props.customerState) {
              props.setCustomerState(!props.customerState);
            }
          }}
        >
          <p>Today</p>
        </span>
      ),
    },
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ position: "relative", top: "23px" }}
        className="responsiveHeader"
      >
        <Grid xs={8} sm={8} lg={8} xl={8} md={8}>
          <p
            style={{
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontWeight: 800,
              fontSize: "24px",
              position: "relative",
              left: "1%",
              top: "-18%",
            }}
          >
            Dashboard
          </p>
        </Grid>
        <Grid
          item
          xs={3.5}
          sm={3.5}
          lg={3.5}
          xl={3.5}
          md={3.5}
          style={{ padding: "25px 0 35px 0" }}
          className="viewResult_responsive"
        >
          <Grid xs={12} sm={12} lg={12} xl={12}>
            <p className="view_results">.</p>
          </Grid>
          <Grid xs={12} sm={12} lg={12} xl={12}>
            {/* <Slider
              style={{ position: "relative", top: "-65px" }}
              min={20}
              // defaultValue={88}
              value={props.sliderValue}
              marks={marks}
              step={null}
              onChange={(e) => {
                props.headerDaterangeselection(e);
                props.setSliderValue(e);
              }}
            /> */}
          </Grid>
        </Grid>
        <Grid xs={0.5} sm={0.5} lg={0.5} xl={0.5} md={0.5}>
          <Tooltip title={"Refresh"}>
            <CachedIcon
              onClick={props.handleReloadClick}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
};
export default Header;
