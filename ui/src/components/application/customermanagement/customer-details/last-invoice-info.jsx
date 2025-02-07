import React, { useEffect, useCallback, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../../mui/accordian";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import pick from "lodash.pick";
import moment from "moment";
import { customeraxios,billingaxios } from "../../../../axios";
import MUIButton from "@mui/material/Button";

const lastInvoiceKeys = {
  customer_status: "Status",
  invoice_created_date: "Invoice Date",
  renew_date: "Last Renewal",
  customer_expiry_date:"Expiry Date",
  payment_method: "Payment Method",
  amount: "Final Invoice Amount",
};

const LastInvoiceInfo = ({ user, updateInfoCount,username ,profileDetails}) => {
  const [lastInvoiceInfo, setLastInvoiceInfo] = useState(null);
  const [invoiceDownload, setInvoiceDownload] = useState();
  const [invoicepreview, setInvoicePreview] = useState("");


  const fetchInvoiceInfo = useCallback(async (id,username) => {
    try {
      const response = await customeraxios.get(
        `customers/last/invoice/info/${id}`
      );
      setLastInvoiceInfo(
        pick(response.data, [...Object.keys(lastInvoiceKeys)])
      );
    } catch (e) {
      setLastInvoiceInfo(null);
    }
  }, []);

  useEffect(() => {
    fetchInvoiceInfo(user);
    // fetchInvoicedownload(username);
    inoiceDownload(username)
  }, [user, updateInfoCount, profileDetails, username]);

  const [expanded, setExpanded] = React.useState("panel4");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };


  // const fetchInvoicedownload = useCallback(async (username) => {
  //   try {
  //     const response = await billingaxios.get(
  //       `/payment/invoice/list/${username}`
  //     );
  //     setInvoiceDownload(response);
  //   } catch (e) {
  //     setInvoiceDownload(null);
  //   }
  // }, []);


  


  // const downloadfirstobject = invoiceDownload && invoiceDownload.data[0];
  // const previewfirstobject = invoiceDownload && invoiceDownload.data[0];


const inoiceDownload = () =>{
  billingaxios.get(`/payment/invoice/list/${username}`).then((response) => {
    setInvoicePreview(response && response.data && response.data[0].invoice && response.data[0].invoice.inv_preview)
    setInvoiceDownload(response && response.data && response.data[0].invoice && response.data[0].invoice.inv_download)
   
  })
}

  return (
    <Accordion
      style={{
        borderRadius: "15px",
        boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)",
        flex: "0 0 100%",
      }}
      expanded={expanded === "panel4"}
      onChange={handleChange("panel4")}
    >
      <AccordionSummary aria-controls="panel1a-content" id="last-invoice-info">
        <Typography variant="h6" className="customerdetailsheading">
          Last Invoice Info
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ lineHeight: "3rem" }}>
        {lastInvoiceInfo &&
          Object.keys(lastInvoiceInfo).map((item) => (
            <Grid spacing={1} container key={item} sx={{ mb: "5px" }}>
              <Grid item md="12">
                <p>
                  <span>{lastInvoiceKeys[item]}</span>
                  <br />

                  <span style={{ fontWeight: "500" }}>
                    {item === "invoice_created_date" || item === "renew_date" || item === "customer_expiry_date"
                      ? moment(lastInvoiceInfo[item]).format("DD MMM YY")
                      : lastInvoiceInfo[item]}
                  </span>
                </p>
                <hr />
              </Grid>
            </Grid>
          ))}
           {/* <p>Final Invoice Amount <br/>
          <span><b>{profileDetails && profileDetails.radius_info && profileDetails.radius_info.GSTIN ? profileDetails && profileDetails.radius_info && profileDetails.radius_info.GSTIN : "---"}</b></span>
          </p>
          <hr /> */}
          <p>GST IN <br/>
          <span><b>{profileDetails && profileDetails.user_advance_info && profileDetails.user_advance_info.GSTIN ? profileDetails && profileDetails.user_advance_info && profileDetails.user_advance_info.GSTIN : "---"}</b></span>
          </p>
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="2">
          </Grid>
          <Grid item md="6" style={{textAlign: "center"}}>
            {/* <MUIButton variant="outlined"><a href={downloadfirstobject && downloadfirstobject.invoice && downloadfirstobject.invoice.inv_download}>Download Invoice <i className="fa fa-download"></i></a></MUIButton> */}
            <MUIButton variant="outlined" onClick={()=>inoiceDownload()} ><a href={invoiceDownload}>Download <i className="fa fa-download"></i></a></MUIButton>
         
          </Grid>
          <Grid item md="4">
            {/* <MUIButton variant="outlined"><a href={previewfirstobject && previewfirstobject.invoice && previewfirstobject.invoice.inv_preview} target="_blank">Preview  <i className="fa fa-eye"></i></a></MUIButton> */}
          <MUIButton variant="outlined" onClick={()=>inoiceDownload()} ><a href={invoicepreview} target="_blank" >Preview <i className="fa fa-eye"></i></a></MUIButton>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default LastInvoiceInfo;
