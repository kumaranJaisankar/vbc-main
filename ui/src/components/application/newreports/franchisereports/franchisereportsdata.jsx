import React from "react";
import moment from 'moment';
const stickyColumnStyles = {
  whiteSpace: "nowrap",
  position: "sticky",
  zIndex: "1",
  backgroundColor: "white",
};


export const getFranchiseReportTableColumn = () => {
  const customerRepotsTableColumns = [
    // {
    //   name: "",
    //   selector: "action",
    //   style: {
    //     ...stickyColumnStyles,
    //     left: "0",
    //   },
    //   width: '80px',
    //   center: true,

    // },
    {
      name: <b className="CustomerTable_columns">{"Franchise Name"}</b>,
      selector: "name",
      width: "130px",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Franchise Code"}</b>,
  
      selector: "code",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Type"}</b>,

      selector: "type.name",
      sortable: true,
    },
    {
      name: <b className="CustomerTable_columns">{"Wallet Amount(₹)"}</b>,
      selector: "wallet_amount",
      sortable: true,
    },
    {
      name: <b className="CustomerTable_columns">{"Renewal Balance(₹)"}</b>,

      selector: "renewal_amount",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"No.Of Customers"}</b>,
      selector: "customer_count",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Status"}</b>,

      selector: "status.name",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"SMS Gateway"}</b>,
      selector: "sms_gateway_type.name",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Created At"}</b>,

      selector: "created_at",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.created_at).format("DD MMM YY")}
        </span>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Updated  At"}</b>,

      selector: "updated_at",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.updated_at).format("DD MMM YY")}
        </span>
      ),
      sortable: true,
    },
    // {
    //   name: "Address",
    //   selector: "ad",
    //   sortable: true,
    // },
  ];
  return customerRepotsTableColumns;
};