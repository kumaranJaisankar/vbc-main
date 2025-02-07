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

    // Sailaja added nowrap style for Franchise Name on 19th July
    {
      name: <b className="CustomerTable_columns" style={{whiteSpace:"nowrap"}}>{"Franchise Name"}</b>,
      selector: "name",
      width: "130px",
      sortable: true,
    },
    {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}} >{"Franchise Code"}</b>,
  
      selector: "code",
      sortable: true,
    },
    {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}} >{"Branch"}</b>,
      cell: (row) => (
        <span >
          {" "}
          {(row?.branch?.name)}
        </span>
      ),
      selector: "branch",
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
        // Sailaja added nowrap style for Renewal Balance on 19th July

    {
      name: <b className="CustomerTable_columns" >{"Renewal Balance(₹)"}</b>,

      selector: "renewal_amount",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"No.of Customers"}</b>,
      selector: "customer_count",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Status"}</b>,

      selector: "status.name",
      sortable: true,
    },
    {
      name: <b className="Table_columns"style={{whiteSpace:"nowrap"}}>{"SMS Gateway"}</b>,
      selector: "sms_gateway_type.name",
      sortable: true,
    },
     // Sailaja added Year Format As YYYY  for Reports-> Franchise Reports-> Created At column on 20th March 2023
    {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Created At"}</b>,

      selector: "created_at",
      cell: (row) => (
        <span className="digits" style={{ whiteSpace:"nowrap",textTransform: "initial" }}>
          {" "}
          {moment(row.created_at).format("DD MMM YYYY")}
        </span>
      ),
      sortable: true,
    },
  // Sailaja added Year Format As YYYY  for Reports-> Franchise Reports-> Updated At column on 20th March 2023
    {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Updated  At"}</b>,

      selector: "updated_at",
      cell: (row) => (
        <span className="digits" style={{ whiteSpace:"nowrap" , textTransform: "initial" }}>
          {" "}
          {moment(row.updated_at).format("DD MMM YYYY")}
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