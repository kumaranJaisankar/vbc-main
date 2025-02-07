import React from "react";
import Link from "@mui/material/Link";
import moment from 'moment';



export const getNewBillingListsTableColumns = ({
    newBillingIdClickHandler,
  RefreshHandler,
}) => {
  const NewBillingtListsTableColumns = [
    {
      name: "Franchise Name",
      cell: (row) => {
        return <span>{row.franchise ? row.franchise : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: "User ID",
      selector: "username",
      sortable: true,
      cell: (row) => {
        return <span>{row.username}</span>;
      }
    },
    {
      name: "First Name",
      selector: "first_name",
      sortable: true,
      cell: (row) => {
        return <span>{row.first_name}</span>;
      }
    },
    {
      name: "Mobile No.",
      selector: "mobile_number",
      sortable: true,
      cell: (row) => {
      return <span>{row.mobile_number}</span>;
      }
    },
    {
      name: "Payment Id",
      selector: "payment_id",
      cell: (row) => (
        <Link component="button" variant="body2" underline="none" row={row}  refresh={RefreshHandler}  onClick={() => newBillingIdClickHandler(row)}>
        S{row.payment_id}
      </Link>
      ),
      sortable: true,
     
    },

      {
        name: "Online Payment",
        cell: (row) => {
          return (
            <span>{row.online_payment_mode ? row.online_payment_mode : "-"}</span>
          );
        },
        sortable: true,
      },
      {
        name: "Payment Type",
        cell: (row) => {
          return <span>{row.payment_method ? row.payment_method : "-"}</span>;
        },
        sortable: true,
      },
  
      {
        name: "Collected By",
        cell: (row) => {
          return <span>{row.collected_by ? row.collected_by : "-"}</span>;
        },
        sortable: true,
      },

      {
        name: "Collected Date",
        selector: "completed_date",
        cell: (row) => (
          <span className="digits" style={{ textTransform: "initial" }}>
            {moment(row.completed_date).format(" DD MMM YY, h:mm:ss a")}
          </span>
        ),
        sortable: true,
      },
  
      {
        name: "Amount",
        cell: (row) => {
          return <span>{row.amount ? "₹" + row.amount : "-"}</span>;
        },
        sortable: true,
      },
      {
        name: "Due Amount",
        cell: (row) => {
          return <span>{row.due_amount ? "₹" + row.due_amount : "-"}</span>;
        },
        sortable: true,
      },
      {
        name: "Payment Status",
        cell: (row) => {
          return <span>{row.status ? row.status : "-"}</span>;
        },
        sortable: true,
      },
      {
        name: "Download",
        selector: "invoice",
        cell: (row) => {
          console.log(row, "row .........");
          return (
            <a href={row.invoice && row.invoice.inv_download} download>
              <i className="fa fa-download"></i>
            </a>
          );
        },
        sortable: true,
      },
      {
        name: "Preview",
        ignoreRowClick: true,
        cell: (row) => {
          return (
            <a
              href={row.invoice && row.invoice.inv_preview}
              target="_blank"
              rel="noreferrer noopener"
              style={{ position: "absolute" }}
            >
              <i className="fa fa-eye"></i>
            </a>
          );
        },
        sortable: true,
      },

  ];
  return NewBillingtListsTableColumns;
  
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