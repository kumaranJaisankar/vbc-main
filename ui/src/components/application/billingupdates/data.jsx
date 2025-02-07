import React from "react";
import moment from 'moment';

export const getBillingReportTableColumn = ({handleDownload,handlePreview,handleDownloadReciept,handlePreviewReciept}) => {

  const stickyColumnStyles = {
    whiteSpace: "nowrap",
    position: "sticky",
    zIndex: "1",
    backgroundColor: "white",
  }

// changes in column width by marieya & added sticky columns
  const billingRepotsTableColumns = [
    {
      name: <b className="Table_columns"   style={{ whiteSpace: "nowrap" }}>{"Customer ID"}</b>,
      cell: (row) => {
        return <span style={{ whiteSpace: "initial" }}>{row.customer_username ? row.customer_username : "-"}</span>;
      },
      width: "140px",
      sortable: true,
      style: {
        ...stickyColumnStyles,
        left: "48px !important",
      },
    },
     
    {
      name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>{"Branch"}</b>,
      selector: "branch",
      cell: (row) => (
        <div className="ellipsis" title={row?.branch}>
          {row?.branch}
        </div>
      ),
     
      sortable: true,
      width: "110px",
      style: {
        ...stickyColumnStyles,
        left: "187px !important",
      },
    },
    {
      name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>{"Franchise"}</b>,
      selector: "Franchise",
      cell: (row) => (
        <div className="ellipsis" title={row?.franchise}>
          {row?.franchise}
        </div>
      ),
     
      sortable: true,
      width: "110px",
      style: {
        ...stickyColumnStyles,
        // left: "210px",
        left: "296px",
        width: "100px",
      },
    },
    {
      name: <b className="CustomerTable_columns"  style={{ whiteSpace: "nowrap" }}>{"Customer Name"}</b>,
      selector: "customer_name",
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={row?.customer_name}>
          {row?.customer_name}
        </div>
      ),
   
      style: {
        ...stickyColumnStyles,
        left: "405px !important",
        borderRight: "1px solid #CECCCC",
      },
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Mobile No."}</b>,
      selector: "mobile_number",
      sortable: true,
      cell: (row) => {
        return <span>{row.mobile_number}</span>;
      },
      // style: {
      //   ...stickyColumnStyles,
      //   left: "409px !important",
      //   borderRight: "1px solid #CECCCC",
      // },
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Payment ID"} </b>,
      selector: "payment_id",
      cell: (row) => (
          <span>{row?.payment_id}</span>
      ),
      sortable: true,

    },
    {
      name: <b className="Table_columns" id="payment_method_col_right" style={{ whiteSpace: "nowrap" }}>{"Payment Method"}</b>,
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
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Payment Status"}</b>,
      cell: (row) => {
        return <span>{row.status ? row.status : "-"}</span>;
        // return <span>{"Success"}</span>;

      },
      sortable: false,
    },
    {
      name: <b className="Table_columns"  style={{ whiteSpace: "nowrap" }}>{"Payment Type"}</b>,
      cell: (row) => {
        return <span id="type_col_right">{row.payment_method ? row.payment_method : "-"}</span>;
      },
      sortable: false,
    },
    {
      name: <b className="Table_columns"  style={{ whiteSpace: "nowrap" }}>{"Package Name"}</b>,
      cell: (row) => (
        <span id="type_col_left">{row.package_name ? row.package_name : "-"}</span>
      ),
      
      sortable: false,
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
  //  Sailaja Modified Static IP Cost Column name on 20th March 2023
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Static IP Cost"}</b>,
      cell: (row) => {
        // return <span >{row  ? row.static_ip_total_cost  :"-"}</span>;
        return <span >{row.static_ip_total_cost === null ? "---": row.static_ip_total_cost } </span>;
      },
      sortable: false,
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Online Payment"}</b>,
      cell: (row) => {
        return (
          <span >{row.online_payment_mode ? row.online_payment_mode : "-"}</span>
        );
      },
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Name"}</b>,
      cell: (row) => {
        return <span>{row?.collected_by_name ? row.collected_by_name : "-"}</span>;
      },
      sortable: false,
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
    }, {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap",position:"relative",left:"-13px"}}>{"Bank Reference No."}</b>,
      cell: (row) => {
        return <span>{row?.bank_reference_no ? row.bank_reference_no : "-"}</span>;
      },
      sortable: false,
    },
    // Sailaja Modified Year Format As YYYY  for Billing History -> Collected Date column on 20th March 2023
    // Sailaja Added whiteSpace property for Billing History -> Collected Date column on 20th March 2023

    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Collected Date"}</b>,
      selector: "completed_date",
      cell: (row) => (
        <span className="digits" style={{  whiteSpace: "nowrap",textTransform: "initial" }}>
          {moment(row.completed_date).format("DD MMM YYYY")}
        </span>
      ),
      sortable: false,
    },

    {
      name: <b className="Table_columns">{"Due Amount"}</b>,
      cell: (row) => {
        return <span>{row.due_amount ? "₹" + row.due_amount : "-"}</span>;
      },
      sortable: false,
    },

    {
      name: <b className="Table_columns">{"Download"}</b>,
      selector: "file_path",
      cell: (row) => {
        return (
          
          <a onClick={() => {handleDownload(row)}} >
        {row.file_path === null?  <i className="fa fa-download"></i>:<i className="fa fa-download" style={{color:"blue"}}></i>}
      </a>
        );
      },
     
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Preview"}</b>,
      ignoreRowClick: true,
      cell: (row) => {
        return (
          <a
          onClick={() => {handlePreview(row)}}
            target="_blank"
            rel="noreferrer noopener"
            style={{ position: "absolute" }}
          >

            {row.file_path === null?<i className="fa fa-eye"></i>:<i className="fa fa-eye" style={{color:"blue"}}></i>}
          </a>
        );
      },
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Download Reciept"}</b>,
      selector: "receipt_file_path",
      cell: (row) => {
        return (
          
          <a onClick={() => {handleDownloadReciept(row)}} >
        {row?.receipt_file_path === null?  <i className="fa fa-download"></i>:<i className="fa fa-download" style={{color:"blue"}}></i>}
      </a>
        );
      },
     
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Preview Reciept"}</b>,
      ignoreRowClick: true,
      cell: (row) => {
        return (
          <a
          onClick={() => {handlePreviewReciept(row)}}
            target="_blank"
            rel="noreferrer noopener"
            style={{ position: "absolute" }}
          >

            {row?.receipt_file_path === null?<i className="fa fa-eye"></i>:<i className="fa fa-eye" style={{color:"blue"}}></i>}
          </a>
        );
      },
      sortable: false,
    },
  ];
  return billingRepotsTableColumns;
};

export const getAppliedServiceFiltersObj = () => {
  return {   
    customer_username:{
      value:{
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      }
    }
  }
}