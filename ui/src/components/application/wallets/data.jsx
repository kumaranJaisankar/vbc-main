import React from "react";
import Link from "@mui/material/Link";
// Sailaja imported moment on 20th March 2023
import moment from 'moment';



export const getWalletListsTableColumns = ({
    walletIdClickHandler,
  Refreshhandler
}) => {
  const walletListsTableColumns = [
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Name"}</b>,
      selector: "name",
      sortable: true,
    },
    {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Entity ID"}</b>,
        selector: "entity_id",
        sortable: true,
        cell: (row) => (
            <Link
              component="button"
              variant="body2"
              underline="none"
              row={row}
              refresh={Refreshhandler}
              onClick={() => walletIdClickHandler(row)}
            >
              {row.entity_id}
            </Link>
          ),
      },
     
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"User Name"}</b>,
      cell: (row) => {
        return <span>{row.person}</span>;
      },
      selector: "person",
      sortable: true,
    },
    {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Type"}</b>,
        selector: "type",
        sortable: true,
      },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Mode"}</b>,
        selector: "mode",
        sortable: true,
      },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Amount"}</b>,
        selector: "amount",
        sortable: true,
      },
      // Sailaja added Year Format As YYYY  for Wallet-> Payment Date column on 20th March 2023

      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Payment Date"}</b>,
        selector: "payment_date",
        cell: (row) => (
          <span className="digits" style={{ whiteSpace: "nowrap",textTransform: "initial" }}>
            {moment(row.payment_date).format(" DD MMM YYYY ")}
          </span>
        ),
        sortable:true,
      },
      {
        name: "",
        selector: "",
      },
      {
        name: "",
        selector: "",
      },

  ];

  return walletListsTableColumns;
};


export const getAppliedFiltersObj = () => {
  return {
    branch: {
      value: {
        type: "array",
        results: [],
      }
    },
    
    
  };
}