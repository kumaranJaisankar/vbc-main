import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { billingaxios } from "../../../../axios";
import "jspdf-autotable";
import { downloadPdf } from "./exportinvoicd";
import moment from "moment";
import Button from "@mui/material/Button";
const LastInvoiceDownload = (props) => {
  console.log(props, "leaddata")
  const [invoiceDownload, SetInvoiceDownload] = useState(false);
  const [inovicedata, setInvoiceData] = useState();


  console.log(inovicedata, 'adasdadas');

  const pdfTitle = "Invoice Information";
  const headersForPDF = [
    ["id", "ID"],
    ["name", "Name"],
  ];
  const fileName = "LastInvoice";
  const columns = [
  
    {
      name: "User ID",
      selector: "user.username",
      sortable: true,
    },
   
    {
      name: "Username",
      selector: "user.name",
      sortable: true,
    },
    {
      name: "Invoice Id",
      selector: "invoice_id",
      sortable: true,
    },
    {
      name: "Created at",
      selector: "created_at",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.created_at).format("MMM Do YY, h:mm:ss a")}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Payment Id",
      selector: "payment.payment_id",
      sortable: true,
    },
    {
      name: "Amount",
      selector: "payment.amount",
      sortable: true,
    },
    {
      name: "Download",
      selector: "name",
      cell: (row) => {
        return (
         
          <a
        href={row.invoice && row.invoice.inv_download}
        download
      >
        <i className="fa fa-download"></i>
      </a>
        );
      },
      sortable: true,
    },
    
    {
      name: "Preview",
      ignoreRowClick: true,
      cell: (row) => {
       
        return (
        
          <a 
          href={row.invoice && row.invoice.inv_preview}
          target="_blank"
          rel="noreferrer noopener"
          style={{ position: "absolute" }}       
      >
       <i className="fa fa-eye"></i>
      </a>
        );
      },
      sortable: true,
    },

  ];

  const headersForExportFile = ["id", "name"];

  const handleExportDataAsPDF = (
    pdfTitle,
    headersForPDF,
    tableData,
    fileName
  ) => {
    const title = `All Billing`;
    downloadPdf(pdfTitle, headersForPDF, tableData, fileName);
  };

  const handleDownload = (pdfTitle, headersForPDF, tableData, fileName) => {
    console.log(headersForPDF, ":headersForPDF");
    handleExportDataAsPDF(pdfTitle, headersForPDF, tableData, fileName);
  };

  useEffect(() => {
    if(props.lead && props.lead.username) {
      billingaxios.get(`/payment/invoice/list/${props.lead && props.lead.username}`).then((res) => {
        console.log(res, "responsedata")
        setInvoiceData(res.data);
      });
    }
  }, [props.lead]);
 

  return (
    <>
      <Button variant="contained" onClick={() => SetInvoiceDownload(!invoiceDownload)} style={{marginLeft:"15px"}}
      >
        Invoice View/Download
      </Button>
      {invoiceDownload ? (
        <DataTable columns={columns} data={inovicedata}  style={{marginLeft:"15px"}}/>
      ) : (
        ""
      )}
    </>
  );
};
export default LastInvoiceDownload;
