import React from "react";
import Link from "@mui/material/Link";
import moment from "moment";
import { FRANCHISE } from "../../../../utils/permissions";
import {nasType} from "../../project/nas/nasdropdown"

// getNewFranchiseTableColumns() for Columns in NewFranchise DataTable
export const getNewFranchiseTableColumns = ({
  NewFranchiseNameClickHandler,
  RefreshHandler,
  openCustomizer
}) => {
  var storageToken = localStorage.getItem("token");
  if (storageToken !== null) {
    var token = JSON.parse(storageToken);
  }

  // getAddress for Address column
  const getAddress = (row) => {
    const { address } = row;
    return `${address ? address.house_no : ""},
    ${address ? address.landmark : ""},
    ${address ? address.street : ""},
    ${address ? address.city : ""},
    ${address ? address.district : ""},
    ${address ? address.state : ""},
    ${address ? address.country : ""},
    ${address ? address.pincode : ""}`;
  };

  const franchiseStatus = {
    INACTIVE: "In Active",
    ACTIVE: "Active",
  };
  const stickyColumnStyles = {
    whiteSpace: "nowrap",
    position: "sticky",
    zIndex: "1",
    backgroundColor: "white",
  };
  const NewFranchiseTableColumns = [
    {
      name: (
        <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>
          {"Franchise Name"}
        </b>
      ),
      cell: (row) => (
        <>
          {token.permissions.includes(FRANCHISE.READ) ? (
            <a
              style={{ whiteSpace: "initial" }}
              onClick={() => openCustomizer("3", row)}
              // id="columns_right"
              className="openmodal"
            >
              {row.name}
            </a>
          ) : (
            <div style={{ whiteSpace: "initial" }} id="columns_right">
              {row.name}
            </div>
          )}
        </>
      ),
      style: {
        ...stickyColumnStyles,
        left: "48px !important",
      },
      selector: "name",
      sortable: true,
    },
    {
      name: (
        <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>
          {"Franchise Code"}
        </b>
      ),
      selector: "code",
      cell: (row) => {
        return <span>{row.code}</span>;
      },
      sortable: true,
      style: {
        ...stickyColumnStyles,
        left: "165px !important",
      },
    },

    {
      name: <b className="Table_columns">{"Type"}</b>,
      selector: "type.name",
      cell: (row) => {
        return <span  style={{ whiteSpace: "initial" }}>{row.type ? row.type.name : "-"}</span>;
      },
      sortable: true,
      style: {
        ...stickyColumnStyles,
        left: "275px !important",
        borderRight: "1px solid #CECCCC",
      },
    },
    {
      name: <b className="Table_columns">{"Status"}</b>,
      selector: "status.name",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Invoice Code"}</b>,
      cell: (row) => (
        <span className="franchise_osbalance">{row?.invoice_code}</span>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"GST Codes"}</b>,
      selector: "gst_codes",
      sortable: true,
      cell: (row) => {
        const users = row.gst_codes?.map((list) => list.name);
        if (users && users.length > 0) {
          return <span>{users.join(",")}</span>;
        } else {
          return <span>---</span>;
        }
      },
    },    
    {
      name: (
        <b
          className="Table_columns "
          style={{ whiteSpace: "nowrap" }}
        >
          {"Active Customers"}
        </b>
      ),
      selector: "customer_count",
      cell: (row) => (
        <span className="franchise_osbalance">{row.customer_count}</span>
      ),
      sortable: false,
    },
    {
      name: (
        <b
          className="Table_columns "
          style={{ whiteSpace: "nowrap" }}
        >
          ₹{"Current Balance"}
        </b>
      ),
      cell: (row) => {
        return <span className="franchise_osbalance">{row.wallet_amount !== null ? row.wallet_amount : '-'} </span>
      },
   
      selector: "wallet_amount",
      sortable: false,
    },
    {
      name: (
        <b
          className="Table_columns "
          style={{ whiteSpace: "nowrap" }}
        >
          ₹{"Renewal Balance"}
        </b>
      ),
      cell: (row) => {
        return (
          <span className="franchise_osbalance">
  {row.renewal_amount !== null ? row.renewal_amount : '-'}
</span>
        );
      },
      selector: "renewal_amount",
      sortable: false,
    },

    {
      name: (
        <b
          className="Table_columns "
        >
          ₹{"Outstanding Balance"}
        </b>
      ),
      cell: (row) => {
        return (
          <span className="franchise_osbalance">
          {row.outstanding_balance !== null ? row.outstanding_balance : '-'}
        </span>
        );
      },
      selector: "outstanding_balance",
      sortable: false,
    },
    
    {
      name:  <b className="Table_columns" >{"NAS Type"}</b>,
      selector: "nas_type",
      sortable: true,
      cell: (row) => {
        let nastypeObj = nasType.find((s) => s.id == row.nas_type);
        return <span >{nastypeObj ? nastypeObj.name : "-"}</span>;
      },
    },
    {
      name: <b className="Table_columns" >{"Email"}</b>,
      cell: (row) => {
        return <span >{row.email === false ? "False" : "True"}</span>;
      },
      selector: "email",
      sortable: true,
    },
    {
      name: <b className="Table_columns" >{"SMS"}</b>,
      cell: (row) => {
        return <span>{row?.sms  === true? "True" : "False"}</span>;
      },
      selector: "sms",
      sortable: true,
    },
    {
      name: <b className="Table_columns" >{"Whatsapp"}</b>,
      cell: (row) => {
        return <span >{row.whatsapp_flag === false ? "False" : "True"}</span>;
      },
      selector: "whatsapp_flag",
      sortable: true,
    },
    //Sailaja Changed Created Date as Created on 19th July
     // Sailaja Modified Year Format As YYYY  for Franchise ->Created column on 20th March 2023

    {
      name: (
        <b
          className="Table_columns "
          style={{ position: "relative", right: "45px" }}
        >
          {"Created"}
        </b>
      ),
      selector: "created_at",
      cell: (row) => (
        <span
          className="digits "
          style={{
            textTransform: "initial",
            position: "relative",
            right: "45px",
          }}
        >
          {" "}
          {moment(row.created_at).format("DD MMM YYYY")}
        </span>
      ),
      sortable: false,
    },
    //Sailaja Changed Updated Date as Updated on 19th July
    // Sailaja Modified Year Format As YYYY  for Franchise ->Updated column on 20th March 2023
    {
      name: (
        <b
          className="Table_columns"
          style={{ position: "relative", right: "100px" }}
        >
          {"Updated"}
        </b>
      ),
      selector: "updated_at",
      cell: (row) => (
        <span
          className="digits franchise_columns"
          style={{
            textTransform: "initial",
            position: "relative",
            right: "100px",
          }}
        >
          {" "}
          {moment(row.updated_at).format("DD MMM YYYY")}
        </span>
      ),
      sortable: false,
    },

    {
      name: <b className="Table_columns franchise_columns1">{"Branch"}</b>,
      selector: "branch.name",
      cell: (row) => {
        return (
          <span className="franchise_columns1">
            {row.branch ? row.branch.name : "-"}
          </span>
        );
      },
      sortable: true,
    },

    {
      name: <b className="Table_columns franchise_columns1">{"SMS Gateway"}</b>,
      selector: "sms_gateway_type.name",
      cell: (row) => {
        return (
          <span className="franchise_columns1">
            {row.sms_gateway_type ? row.sms_gateway_type.name : "-"}
          </span>
        );
      },
      sortable: true,
    },

    {
      name: <b className="Table_columns franchise_columns1">{"Address"}</b>,
      sortable: true,
      cell: (row) => (
        <div className="ellipsis franchise_columns1" title={getAddress(row)}>
          {getAddress(row)}
        </div>
      ),
    },
  ];
  return NewFranchiseTableColumns;
};

export const getAppliedFiltersObj = () => {
  return {
    first_name: {
      value: {
        type: "text",
        strVal: "",
        label: "First name {containsplaceholder} {nameplaceholder}",
      },
      contains: {
        type: "bool",
        strVal: false,
      },
    },
    username: {
      value: {
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      },
    },
    last_name: {
      value: {
        type: "text",
        strVal: "",
        label: "Last name {containsplaceholder} {nameplaceholder}",
      },
      contains: {
        type: "bool",
        strVal: false,
      },
    },

    gst_number: {
      value: {
        type: "text",
        strVal: "",
        label: "GST {containsplaceholder} {nameplaceholder}",
      },
      contains: {
        type: "bool",
        strVal: false,
      },
    },
    created_at_status: {
      value: {
        type: "text",
        strVal: "",
        label: "{statusplaceholder}",
      },
    },
    created_at_from_date: {
      value: {
        type: "date",
        strVal: "",
        label: "Created from date {dateplaceholder}",
      },
    },
    created_at_to_date: {
      value: {
        type: "date",
        strVal: "",
        label: "Created to date {dateplaceholder}",
      },
    },
    expiry_date: {
      value: {
        type: "date",
        strVal: null,
        label: "Expiry from {dateplaceholder}",
      },
    },
    expiry_date_end: {
      value: {
        type: "date",
        strVal: null,
        label: "Expiry to {dateplaceholder}",
      },
    },
    branch: {
      value: {
        type: "array",
        results: [],
      },
    },
    zone: {
      value: {
        type: "array",
        results: [],
      },
    },
    area: {
      value: {
        type: "array",
        results: [],
      },
    },
  };
};

export const getAdditionalFiltersObj = () => {
  return {
    name: {
      value: {
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      },
    },
  };
};
