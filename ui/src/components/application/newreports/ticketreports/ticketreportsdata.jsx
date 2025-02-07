import React from "react";
import moment from 'moment';
const stickyColumnStyles = {
  whiteSpace: "nowrap",
  position: "sticky",
  zIndex: "1",
  backgroundColor: "white",
};

export const getTicketReportTableColumn = () => {
  const ticketRepotsTableColumns = [

    {
      name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>{"Customer ID"}</b>,

      // name: "",
      selector: "open_for",
      // cell: (row) => (
      //   <a onClick={() => handleRowIdClick(row)} 
      //   className="openmodal"
      //   >
      //     {row.open_for}
      //   </a>
      // ),
      sortable: true,
    },
    {
      name: <b className="Table_columns .align_right_column">{"Mobile"}</b>,

      // name: "",
      selector: "mobile_number",
      sortable: true,
    },
    // {
    //   name: "Open For",
    //   selector: "open_for",
    //   sortable: true,
    // },
    {
      name: <b className="Table_columns">{"Priority"}</b>,

      // name: "Priority",
      selector: "priority_sla.name",
      sortable: true,
    },
    {
      name: <b className="Table_columns align_left_column">{"Status"}</b>,

      // name: "",
      selector: "status",
      sortable: true,
      // cell: (row) => {
      //   let statusObj = ticketStatus.find((s) => s.id == row.status);

      //   return <span>{statusObj ? statusObj.name : "-"}</span>;
      // },
      cell: (row) => (
        <div style={{ whiteSpace: "nowrap" }}>
          {row.status === "OPN" ? (
            <span>
              &nbsp; Open
            </span>
          ) : row.status === "ASN" ? (
            <span>

              &nbsp; Assigned
            </span>
          ) : row.status === "RSL" ? (
            <span>

              &nbsp; Resolved
            </span>
          ) : row.status === "INP" ? (
            <span>
              {" "}

              &nbsp; In-Progress
            </span>
          ) : row.status === "CLD" ? (
            <span>

              &nbsp; Closed
            </span>
          ) : (
            ""
          )}
        </div>
      ),
    },
    
          {
      name: <b className="Table_columns">{"Category"}</b>,

      // name: "",
      selector: "ticket_category.category",
      sortable: true,
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Sub Category"}</b>,

      // name: "",
      selector: "sub_category.name",
      sortable: true,
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Assigned To"}</b>,

      // name: "",
      selector: "assigned_to.username",
      sortable: true,
      cell: (row) => {
        return (
          <span>{row.assigned_to ? row.assigned_to.username : "N/A"}</span>
        );
      },
    },

    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Open Date"}</b>,

      // name: "",
      selector: "open_date",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.open_date).format("DD MMM YY")}
        </span>
      ),
    },

    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Assigned Date"}</b>,

      // name: "",
      selector: "assigned_date",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.assigned_date).format("DD MMM YY")}
        </span>
      ),
      sortable: true,
    },
//Sailaja Commented Notes Column Start
    // {
    //   name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }} >{"Customer Notes"}</b>,

    //   // name: "",
    //   selector: "customer_notes",
    //   sortable: true,
    // },
    // {
    //   name: <b className="Table_columns">{"Notes"}</b>,

    //   // name: "",
    //   selector: "notes",
    //   sortable: true,
    // },
    //Sailaja Commented Notes Column end
    {
      name: <b className="Table_columns">{"Watchlist"}</b>,

      // name: "",
      selector: "watchlists",
      sortable: true,
      cell: (row) => {
        const users = row.watchlists.map((list) => list.user.username);
        return <span>{users.join(",")}</span>;
      }
    }
  ];
  return ticketRepotsTableColumns;
};