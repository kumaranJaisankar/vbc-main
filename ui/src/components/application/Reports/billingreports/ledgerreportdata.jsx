import React from "react";
// Sailaja imported moment on 20th March 2023
import moment from 'moment';

export const getLedgerReportTableColumn = () => {
  const ledgerRepotsTableColumns = [
    {
      name: <b className="Table_columns">{"Branch"}</b>,
      // name: "Branch",
      selector: 'branch',
      cell: (row) => {
        return <span>{row.branch ? row.branch.name : "-"}</span>;
      },
      sortable: true,
    },
    {
      // name: "Franchise",
      name: <b className="Table_columns">{"Franchise"}</b>,
      cell: (row) => {
        return <span>{row.franchise ? row.franchise.name : "-"}</span>;
      },
      sortable: true,
    },
    {
      // name: "Plan",
      name: <b className="Table_columns">{"Plan"}</b>,

      cell: (row) => {
        return <span>{row?.service ? row.service : "-"}</span>;
      },
      sortable: true,
    },

    {
      name: <b className="Table_columns">{"Opening Balance"}</b>,
      // name: "Opening Balance",
      cell: (row) => {
        return (
          <span>
            {row.pre_transaction_balance ? row.pre_transaction_balance : "-"}
          </span>
        );
      },
      selector: "pre_transaction_balance",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Credit"}</b>,

      // name: "Credit",
      selector: "credit",

      cell: (row) => {
        return <span>{row.credit ? row.credit : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Debit"}</b>,
      // name: "Debit",
      selector: "debit",
      cell: (row) => {
        return <span>{row.debit ? row.debit : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Type"}</b>,
      // name: "Type",
      cell: (row) => {
        return <span>{row.type ? row.type : "-"}</span>;
      },
      selector: "type",
      sortable: true,
    },
 // Sailaja added Year Format As YYYY  for Reports-> Ledger Reports-> Payment Date column on 20th March 2023

    {
      name: <b className="Table_columns">{"Payment Date"}</b>,
      // name: "Payment Date",
      selector: "payment_date",
      cell: (row) => {
        // return <span>{row.payment_date ? row.payment_date : "-"}</span>;
        return <span className="digits" style={{ textTransform: "initial" }}>
            {moment(row.payment_date).format(" DD MMM YYYY ")}
          </span>

      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"User Name"}</b>,
      // name: "User Name",
      selector: "person",
      cell: (row) => {
        return <span>{row.person ? row.person : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Wallet Amount"}</b>,
      // name: "Wallet Amount",
      selector: "post_transaction_balance",
      cell: (row) => {
        return <span>{row.post_transaction_balance ? row.post_transaction_balance : "-"}</span>;
      },
      sortable: true,
    },
  ];
  return ledgerRepotsTableColumns;
};
