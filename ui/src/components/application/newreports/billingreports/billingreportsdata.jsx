import React from "react";
import moment from 'moment';

export const getBillingReportTableColumn = () => {

  const stickyColumnStyles = {
    whiteSpace: "nowrap",
    position: "sticky",
    zIndex: "1",
    backgroundColor: "white",
  }

  const billingRepotsTableColumns = [
    {
        name: "Franchise Name",
        
        cell: (row) => {
          return <span>{row.franchise ? row.franchise : "-"}</span>;
        },
        sortable: true,
      },
      {
        name: "User ID",
        cell: (row) => {
          return <span>{row.customer_username?row.customer_username:""}</span>;
        },
       
        sortable: true,
      },
      
      {
        name: "Mobile No.",
       
        cell: (row) => {
          return <span>{row.mobile_number}</span>;
        },
        sortable: true,
      },
      {
        name: "Customer Name",
        cell: (row) => {
          return <span>{row.customer_name?row.customer_name:"-"}</span>;
        },
        sortable: true,
      },
  
      {
        name: "Payment ID",
        cell: (row) => {
          return <span>{row.payment_id}</span>;
        },
        sortable: true,
      },
      {
        name: "Payment Method",
  
        cell: (row) => {
          return <span>{row.pickup_type}</span>;
        },
        sortable: true,
      },
     
      {
        name: "Payment Type",
        cell: (row) => {
          return <span>{row.payment_method ? row.payment_method : "-"}</span>;
        },
        sortable: true,
      },
  
      {
        name: "Collected By",
        cell: (row) => {
          return <span>{row.collected_by_username ? row.collected_by_username : "-"}</span>;
        },
        sortable: true,
      },
      // Sailaja Modified Year Format As YYYY on 20th March 2023

      {
        name: "Collected Date",
        selector: "completed_date",
        cell: (row) => (
          <span className="digits" style={{ textTransform: "initial" }}>
            {moment(row.completed_date).format("DD MMM YYYY")}
          </span>
        ),
        sortable: true,
      },
      {
        name: "Amount",
        cell: (row) => {
          return <span>{row.amount ? "₹" + row.amount : "-"}</span>;
        },
        sortable: true,
      },
      {
        name: "Due Amount",
        cell: (row) => {
          return <span>{row.due_amount ? "₹" + row.due_amount : "-"}</span>;
        },
        sortable: true,
      },
      {
        name: "Payment Status",
        cell: (row) => {
          return <span>{row.status ? row.status : "-"}</span>;
        },
        sortable: true,
      },
      {
        name: "Download",
        selector: "invoice",
        cell: (row) => {
          console.log(row, "row .........");
          return (
            <a href={row.invoice && row.invoice.inv_download} download>
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
  return billingRepotsTableColumns;
};