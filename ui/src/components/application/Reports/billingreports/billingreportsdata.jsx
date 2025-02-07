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
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Branch"}</b>,
        
        
        cell: (row) => {
          return <span>{row.branch ? row.branch : "-"}</span>;
        },
        sortable: true,
      },
    {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Franchise Name"}</b>,
        
        
        cell: (row) => {
          return <span>{row.franchise ? row.franchise : "-"}</span>;
        },
        sortable: true,
      },
      {
      name: <b className="Table_columns">{"User ID"}</b>,

        cell: (row) => {
          return <span>{row.customer_username?row.customer_username:""}</span>;
        },
       
        sortable: true,
      },
      
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Mobile No."}</b>,

       
        cell: (row) => {
          return <span>{row.mobile_number}</span>;
        },
        sortable: true,
      },
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Customer Name"}</b>,

        cell: (row) => {
          return <span>{row.customer_name?row.customer_name:"-"}</span>;
        },
        sortable: true,
      },
  
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Payment ID"}</b>,

        cell: (row) => {
          return <span>{row.payment_id}</span>;
        },
        sortable: true,
      },
      // {
      // name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Payment Method"}</b>,
        
  
      //   cell: (row) => {
      //     return <span>{row.pickup_type}</span>;
      //   },
      //   sortable: true,
      // },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Payment Method"}</b>,
        sortable: false,
        cell: (row) => (
          // return (
          // // <span id="payment_method_col_right" >{row.pickup_type}</span>;
          <div style={{ whiteSpace: "nowrap" }}>
            {row.pickup_type === "ONL" ? (
              <span>
                &nbsp; Online
              </span>
            ) : row.pickup_type === "OFL" ? (
              <span>
  
                &nbsp; Offline
              </span>
  
            ) : (
              ""
            )}
          </div>
        ),
      },
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Payment Type"}</b>,

        cell: (row) => {
          return <span>{row.payment_method ? row.payment_method : "-"}</span>;
        },
        sortable: true,
      },
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Name"}</b>,

        cell: (row) => {
          return <span>{row.collected_by_name ? row.collected_by_name : "-"}</span>;
        },
        sortable: true,
      },
      {
        name: <b className="Table_columns">{"Collected By"}</b>,
        cell: (row) => {
          return <span>{row?.collected_by_username ? row.collected_by_username : "-"}</span>;
        },
        sortable: false,
      },
      {
        name: <b className="Table_columns">{"UTR No."}</b>,
        cell: (row) => {
          return <span>{row?.upi_reference_no ? row.upi_reference_no : "-"}</span>;
        },
        sortable: false,
      },
      {
        name: <b className="Table_columns">{"Cheque No."}</b>,
        cell: (row) => {
          return <span>{row?.check_reference_no ? row.check_reference_no : "-"}</span>;
        },
        sortable: false,
      },
      {
        name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Transaction No."}</b>,
        cell: (row) => {
          return <span>{row?.transaction_no ? row.transaction_no : "-"}</span>;
        },
        sortable: false,
      },                  
      // Sailaja Modified Year Format As YYYY  for Reports -> Revenue & Invoice Reports-> Collected Date column on 20th March 2023
      // Sailaja Added condition for Null field displays "-" instead of invalid date on 21st March 2023  (displays in Production invoice & Revenue Reports Collected Datefields)    
        {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Collected Date"}</b>,

        selector: "completed_date",
        cell: (row) => (
          <span>{row.completed_date ?  
            <>
            {moment(row.completed_date).format("DD MMM YYYY")} 
            </>
             : "-"}</span>

        ),
        sortable: true,
      },
      {
        name: <b className="Table_columns"  style={{ whiteSpace: "nowrap" }}>{"₹ Package Amount"}</b>,
        cell: (row) => {
          return <span id="type_col_left">{row.plan_cost ? +row.plan_cost : "-"}</span>;
        },
        sortable: false,
      },
      {
        name: <b className="Table_columns" id="type_col_left" style={{ whiteSpace: "nowrap" }}>{"CGST"}</b>,
        cell: (row) => {
          return <span id="type_col_left">{row?.cgst_amount ? row.cgst_amount : "-"}</span>;
        },
        sortable: false,
      },
      {
        name: <b className="Table_columns" id="type_col_left">{"SGST"}</b>,
        cell: (row) => {
          return <span id="type_col_left">{row?.sgst_amount ? row?.sgst_amount : "-"}</span>;
        },
        sortable: false,
      },
      {
        name: <b className="Table_columns" >{"Total GST"}</b>,
        cell: (row) => {
          return <span >{row  ? row.cgst_amount + row.sgst_amount  :"-"}</span>;
        },
        sortable: false,
      },
      {
        name: <b className="Table_columns"  id ="installation_col_right"style={{ whiteSpace: "nowrap" }}>{"Installation Charges"}</b>,
        cell: (row) => {
          return <span>{row  ? row.installation_charges  :"-"}</span>;
        },
        sortable: false,
      }, {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Security Deposit"}</b>,
        cell: (row) => {
          return <span >{row  ? row.security_deposit  :"-"}</span>;
        },
        sortable: false,
      },
      {
        name: <b className="Table_columns"  style={{ whiteSpace: "nowrap" }}>{"₹ Total Amount"}</b>,
        cell: (row) => {
          return <span id="type_col_left">{row.amount ? +row.amount : "-"}</span>;
        },
        sortable: false,
      },
   // Sailaja Modified Year Format As YYYY  for Reports -> Revenue & Invoice Reports-> Security Deposit Refund On column on 20th March 2023

      {
        name: <b className="Table_columns">{"Security Deposit Refund On"}</b>,
  
          cell: (row) => {
            return <span>{row.security_deposit_refund_date ?  
              <>
              {moment(row.security_deposit_refund_date).format("DD MMM YYYY")} 
              </>
               : "N/A"}</span>;
          },
          sortable: true,
        },
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Due Amount"}</b>,

        cell: (row) => {
          return <span>{row.due_amount ? "₹" + row.due_amount : "-"}</span>;
        },
        sortable: true,
      },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Static IP Cost"}</b>,
        cell: (row) => {
          return <span >{row.static_ip_total_cost === null ? "---": row.static_ip_total_cost } </span>;
        },
        sortable: false,
      },
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Payment Status"}</b>,

        cell: (row) => {
          return <span>{row.status ? row.status : "-"}</span>;
        },
        sortable: true,
      },
      // {
      // name: <b className="Table_columns">{"Download"}</b>,

      //   selector: "invoice",
      //   cell: (row) => {
      //     console.log(row, "row .........");
      //     return (
      //       <a href={row.invoice && row.invoice.inv_download} download>
      //         <i className="fa fa-download"></i>
      //       </a>
      //     );
      //   },
      //   sortable: true,
      // },
      // {
      // name: <b className="Table_columns">{"Preview"}</b>,

      //   ignoreRowClick: true,
      //   cell: (row) => {
      //     return (
      //       <a
      //         href={row.invoice && row.invoice.inv_preview}
      //         target="_blank"
      //         rel="noreferrer noopener"
      //         style={{ position: "absolute" }}
      //       >
      //         <i className="fa fa-eye"></i>
      //       </a>
      //     );
      //   },
      //   sortable: true,
      // },
  
  ];
  return billingRepotsTableColumns;
};