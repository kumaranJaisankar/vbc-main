import React, { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import moment from "moment";
import { HELP_DESK } from '../../../utils/permissions';
var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

export const getTicketListsTableColumns = ({ticketIdClickHandler,RefreshHandler}) => {
  const ticketListsTableColumns = [
    {
      name: "ID",
      selector: "id",
     
      cell: (row) => (
        <>
          {
            token.permissions.includes(HELP_DESK.UPDATE)
              ? <Link 
              component="button"
          variant="body2"
          underline="none"
          row={row}
          refresh={RefreshHandler}
              onClick={() => ticketIdClickHandler(row)} 
                className="openmodal"
              >
                T{row.id}
              </Link>
              : row.id
          }
        </>
      ),
    },
    {
      name: "Customer ID",
      selector: "open_for",
      sortable: true,
    },
    {
      name: "Mobile",
      selector: "mobile_number",
      sortable: true,
    },
    {
      name: "Priority",
      selector: "priority_sla.name",
      sortable: true,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: (row) => {
      
        return <span>{row.status ? row.status : "-"}</span>;
      },
    },
    {
      name: "Category",
      selector: "ticket_category.category",
      sortable: true,
    },
    {
      name: "Subcategory",
      selector: "sub_category.name",
      sortable: true,
    },
    {
      name: "Assigned To",
      selector: "assigned_to.username",
      sortable: true,
      cell: (row) => {
        return (
          <span>{row.assigned_to ? row.assigned_to.username : "N/A"}</span>
        );
      },
    },

    {
      name: "Open Date",
      selector: "open_date",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.open_date).format("MMM Do YY, h:mm a")}
        </span>
      ),
    },

    {
      name: "Assigned Date",
      selector: "assigned_date",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.assigned_date).format("MMM Do YY, h:mm a")}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Customer Notes",
      selector: "customer_notes",
      sortable: true,
    },
    {
      name: "Notes",
      selector: "notes",
      sortable: true,
    },
    {
      name: "Watchlist",
      selector: "watchlists",
      sortable: true,
      cell: (row) => {
        const users = row.watchlists.map((list) => list.user.username);
        return <span>{users.join(",")}</span>;
      },
    },
  ];
  return ticketListsTableColumns;

};
