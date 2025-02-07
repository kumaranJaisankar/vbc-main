import React from "react";
import Link from "@mui/material/Link";
import moment from "moment";
import { FRANCHISE } from "../../../../utils/permissions";
// import {nasType} from "../../project/nas/nasdropdown"

export const getNewFranchiseTableColumns = ({
    // NewFranchiseNameClickHandler,
    // RefreshHandler,
    // openCustomizer
  }) => {
    var storageToken = localStorage.getItem("token");
    if (storageToken !== null) {
      var token = JSON.parse(storageToken);
    }


    // const franchiseStatus = {
    //   INACTIVE: "In Active",
    //   ACTIVE: "Active",
    // };
    // const stickyColumnStyles = {
    //   whiteSpace: "nowrap",
    //   position: "sticky",
    //   zIndex: "1",
    //   backgroundColor: "white",
    // };
    const NewFranchiseTableColumns = [
      {
        name: (
          <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>
            {"Opening Balance"}
          </b>
        ),
        cell: (row) => (
          <>
                {row.opening_balance}
          </>
        ),
        // style: {
        //   ...stickyColumnStyles,
        //   left: "48px !important",
        // },
        selector: "name",
        sortable: true,
      },
      {
        name: (
          <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>
            {"Credit"}
          </b>
        ),
        selector: "code",
        cell: (row) => {
          return <span>{row.credit_amount ? `₹${row.credit_amount}` : "---"}</span>;
        },
        sortable: true,
        // style: {
        //   ...stickyColumnStyles,
        //   left: "165px !important",
        // },
      },
      {
        name: (
          <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>
            {"Debit"}
          </b>
        ),
        selector: "code",
        cell: (row) => {
          return <span>{row.debit_amount ? `₹${row.debit_amount}` : "---"}</span>;
        },
        sortable: true,
        // style: {
        //   ...stickyColumnStyles,
        //   left: "165px !important",
        // },
      },
      {
        name: <b className="Table_columns">{"Type"}</b>,
        selector: "type",
        cell: (row) => {
          return <span  style={{ whiteSpace: "initial" }}>{row.type ? row.type : "-"}</span>;
        },
        sortable: true,
        // style: {
        //   ...stickyColumnStyles,
        //   left: "275px !important",
        //   borderRight: "1px solid #CECCCC",
        // },
      },
      {
        name: <b className="Table_columns">{"Payment Date"}</b>,
        selector: "payment_date",
        sortable: true,
      },
      {
        name: <b className="Table_columns">{"User Name"}</b>,
        cell: (row) => (
          <span className="franchise_osbalance">{row?.person}</span>
        ),
        sortable: true,
      },
      {
        name: <b className="Table_columns">{"Plan"}</b>,
        cell: (row) => (
          <span className="franchise_osbalance">
            {row.service ? row.service : "---"}
          </span>
        ),
        sortable: true,
      },      
      {
        name: <b className="Table_columns">{"Wallet Amount"}</b>,
        cell: (row) => (
          <span className="franchise_osbalance">{row?.wallet_amount}</span>
        ),
        sortable: true,
      }
    ];
    return NewFranchiseTableColumns;
  };
  