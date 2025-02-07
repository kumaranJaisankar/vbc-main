import React from "react";

export const getLedgerReportTableColumn = () => {
  const ledgerRepotsTableColumns = [
    {
      name: "Branch",
      cell: (row) => {
        return <span>{row.branch ? row.branch.name : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "Franchise",
      cell: (row) => {
        return <span>{row.franchise ? row.franchise.name : "-"}</span>;
      },
      sortable: true,
    },
  
    {
      name: "Opening Balance",
      cell: (row) => {
        return (
          <span>
            {row.pre_transaction_balance ? row.pre_transaction_balance : "-"}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Credit",
      cell: (row) => {
        return <span>{row.credit ? row.credit : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "Debit",
      cell: (row) => {
        return <span>{row.debit ? row.debit : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "Type",
      cell: (row) => {
        return <span>{row.type ? row.type : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "Payment Date",
      cell: (row) => {
        return <span>{row.payment_date ? row.payment_date : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "User Name",
      cell: (row) => {
        return <span>{row.person ? row.person : "-"}</span>;
      },
      sortable: true,
    },
    {
        name: "Wallet Amount",
        cell: (row) => {
          return <span>{row.post_transaction_balance ? row.post_transaction_balance : "-"}</span>;
        },
        sortable: true,
      },
  ];
  return ledgerRepotsTableColumns;
};
