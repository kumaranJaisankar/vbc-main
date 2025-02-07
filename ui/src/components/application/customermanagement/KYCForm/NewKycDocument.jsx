import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import FormStep1 from "../KYCForm/PersonalDetails/FormStep1";
import FormStep7 from "../KYCForm/Documents/FormStep7";
import FormStep8 from "../KYCForm/Documents/FormStep8";
import FormStep2 from "../KYCForm/PersonalDetails/FormStep2";
import FormStep3 from "../KYCForm/PersonalDetails/FormStep3";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
}
const NewKycDocument = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
// added breadcrumb css on line 66 by Marieya
  return (
    <>
      <div style={{ padding: "20px" }}>
        <Grid container spacing={1} style={{ position: "relative" }}>
          <Grid item md="12">
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={
                <NavigateNextIcon fontSize="small" className="navigate_icon" />
              }
            >
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color=" #377DF6"
                fontSize="14px"
              >
                Customer Relations
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color=" #377DF6"
                fontSize="14px"
              >
                Customers
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="#00000 !important"
                fontSize="14px"
                className="last_typography"
              >
                Add New Customer
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid container spacing={1} className=" edit-profile data_table"id="breadcrumb_table">
          <Grid container spacing={1}>
            <span className="add_customer">Add Customer</span>
            <Grid item md={12}>
              <AppBar position="static">
                <Tabs value={value} onChange={handleChange}>
                  <Tab label="Personal Details" style={{ color: "black" }} />
                  <Tab label="Service Details" style={{ color: "black" }} />
                  <Tab label="Payment Options" style={{ color: "black" }} />
                </Tabs>
              </AppBar>
              {/* Sailaja on 11th July   Line number 66 id="breadcrumb_table" change the breadcrumb position */}

              <TabPanel value={value} index={0} className="personalDetails">
                <hr style={{ marginTop: "-25px" }} />
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6} md={4}>
                    <span className="add_cust">Customer Photo *</span>
                    <FormStep1 />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <span className="add_cust">Identity Proof *</span>
                    <FormStep7 />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <span className="add_cust">Signature *</span>
                    <FormStep8 />
                  </Grid>
                  <Grid container spacing={1}>
                    <span
                      className="sidepanel_border1"
                      style={{ position: "relative",
                        top: "12%",
                        left: "-1%"}}
                    ></span>
                    <FormStep2 />
                  </Grid>
                  <Grid container spacing={1}>
                    <span
                      className="sidepanel_border1"
                      style={{ position: "relative", top: "4%", left: "-1%" }}
                    ></span>
                  <FormStep3/>

                  </Grid>
                </Grid>
              </TabPanel>
              
              <TabPanel value={value} index={1} className="ServiceDetails">
                Service Details
              </TabPanel>

              <TabPanel value={value} index={2} className="PaymentDetails">
                Payment Options
              </TabPanel>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default NewKycDocument;
