import React from "react";
import Link from "@mui/material/Link";
export const assignUser = [
  {
    id: "LAT",
    name: "Assign Later",
  },
  {
    id: "NOW",
    name: "Assign Now",
  },
];

export const frequency = [
  {
    id: "DAILY",
    name: "Daily",
  },
  {
    id: "WEEK",
    name: "Weekly",
  },
  {
    id: "MONTH",
    name: "Monthly",
  },
];

export const selectAdmin = [
  {
    id: "ADMIN",
    name: "Admin",
  },
  {
    id: "SUP",
    name: "Support",
  },
];

export const leadStatus = [
  {
    id: "OPEN",
    name: "Open Lead",
  },
  {
    id: "QL",
    name: "Feasible Lead",
  },
  {
    id: "UQL",
    name: "Non Feasible Lead",
  },
  {
    id: "CBNC",
    name: "Closed But Not Converted",
  },
  {
    id: "CNC",
    name: "Closed and Converted",
  },

  {
    id: "LC",
    name: "Lead Conversion",
  },
];

export const getLeadListsTableColumns = ({
  leadIdClickHandler,
  RefreshHandler
}) => {
  const leadListsTableColumns = [
    {
      name: "ID",
      selector: "id",
      cell: (row) => (
        <Link
          component="button"
          variant="body2"
          underline="none"
          row={row}
          refresh={RefreshHandler}
          onClick={() => leadIdClickHandler(row)}
        >
          L{row.id}
        </Link>
      ),
    
    },
    {
      name: "First Name",
      selector: "first_name",
      sortable: true,
    },
    {
      name: "Last Name",
      selector: "last_name",
      sortable: true,
    },

    {
      name: "Mobile",
      selector: "mobile_no",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: (row) => {
        let statusObj = leadStatus.find((s) => s.id == row.status);

        return (
          <span
           
          >
            {statusObj ? statusObj.name : "-"}
          </span>
        );
      },
    },
    {
      name: "Source",
      selector: "lead_source.name",
      sortable: true,
      cell: (row) => {
        return <span>{row.lead_source ? row.lead_source.name : "-"}</span>;
      },
    },
    {
      name: "Type",
      selector: "type.name",
      sortable: true,
      cell: (row) => {
        return <span>{row.type ? row.type.name : "-"}</span>;
      },
    },
    {
      name: "Address",
      sortable: true,
      cell: (row) => {
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >{`${row.house_no},${row.street},${row.landmark},${row.city},${row.district},${row.state},${row.country},${row.pincode}`}</div>
        );
      },
    },
    {
      name: "Assigned To",
      selector: "assigned_to",
      sortable: true,
      cell: (row) => {
        // let statusObj = assignedTo.find((s) => s.id == row.assigned_to);

        return <span>{row.assigned_to ? row.assigned_to : "-"}</span>;
      },
    },
    {
      name: "Notes",
      selector: "notes",
      sortable: true,
    },
  ];

  return leadListsTableColumns;
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
      }
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

    lead_source: {
      value: {
        type: "array",
        results: [],
      }
    },
 
  };
}