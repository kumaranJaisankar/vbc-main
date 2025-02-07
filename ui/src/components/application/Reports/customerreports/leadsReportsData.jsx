import React, { useEffect, useState } from "react";
import moment from 'moment';
import KYCCIRCLE from "../../../../assets/images/Customer-Circle-img/KycCircle.png";
import DCTCIRCLE from "../../../../assets/images/Customer-Circle-img/DctCircle.png";
import PROVCIRCLE from "../../../../assets/images/Customer-Circle-img/ProvisioningCircle.png";
import HLDCIRCLE from "../../../../assets/images/Customer-Circle-img/HoldCircle.png";
import SPDCIRCLE from "../../../../assets/images/Customer-Circle-img/SuspendedCircle.png";
import { Typography } from "@mui/material";
export const getLeadsReportTableColumn = () => {
 
  const stickyColumnStyles = {
    whiteSpace: "nowrap",
    position: "sticky",
    zIndex: "1",
    backgroundColor: "white",
  }
  const leadStatus = {
    OPEN: "Open",
    CBNC: "Closed But Not Converted",
    LC: "Lead Conversion",
    CNC: "Closed And Converted",
    UQL: "Non Feasible Lead",
    QL: "Qualified Lead",
  };

  const leadsRepotsTableColumns = [
    {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"First Name"}</b>,
        
        
        cell: (row) => {
          return <span  style={{whiteSpace:"nowrap" }}>{row.first_name ? row.first_name : "-"}</span>;
        },
        sortable: true,
      },
    {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Last Name"}</b>,
        
        
        cell: (row) => {
          return <span>{row.last_name ? row.last_name : "-"}</span>;
        },
        sortable: true,
      },
      
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Mobile Number."}</b>,

       
        cell: (row) => {
          return <span>{row.mobile_no}</span>;
        },
        sortable: true,
      },
      // {
      // name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Email"}</b>,

      //   cell: (row) => {
      //     return <span>{row.email?row.email:"-"}</span>;
      //   },
      //   sortable: true,
      // },
  
      // {
      // name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Status"}</b>,

      //   cell: (row) => {
      //     return <span>{row.status}</span>;
      //   },
      //   sortable: true,
      // },
      {
        name: (
          <b className="Table_columns" >
            {"Email"}
          </b>
        ),
        selector: "email",
        cell: (row) => (
          <div
            className="ellipsis "
            title={row.email}
            style={{ color: "#285295" }}
           
          >
            {row.email}
          </div>
        ),
        sortable: false,
      },
      {
        name: (
          <b className="Table_columns"  style={{ whiteSpace: "nowrap" }}>
            {"Status"}
          </b>
        ),
        selector: "status",
        sortable: false,
        cell: (row) => {
          return (
            <div  style={{ whiteSpace: "nowrap" }} className="">
              {row.status === "OPEN" ? (
                <img src={PROVCIRCLE} />
              ) : row.status === "LC" ? (
                <img src={KYCCIRCLE} />
              ) : row.status === "CNC" ? (
                <img src={DCTCIRCLE} />
              ) : row.status === "UQL" ? (
                <img src={SPDCIRCLE} />
              ) : row.status === "CBNC" ? (
                <img src={HLDCIRCLE} />
              ) : row.status === "QL" ? (
                <span className="figma_circle" />
              ) : (
                ""
              )}
              &nbsp; &nbsp;
              <Typography variant="caption">{leadStatus[row.status]}</Typography>
            </div>
          );
        },
        // cell: (row) => {
        //   let statusObj = leadStatusJson.find((s) => s.id == row.status);
  
        //   return <span>{statusObj ? statusObj.name : "-"}</span>;
        // },
      },
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap", marginLeft:"50px",marginRight:"40px"}}>{"Source"}</b>,
        
  
        cell: (row) => {
          return <span style={{whiteSpace:"nowrap", marginLeft:"50px",marginRight:"40px"}}>{row?.lead_source?.name}</span>;
        },
        sortable: true,
      },
      
      {
      name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Type"}</b>,

        cell: (row) => {
          return <span>{row?.type?.name ? row?.type?.name : "-"}</span>;
        },
        sortable: true,
      },
      // {
      // name: <b className="Table_columns" style={{whiteSpace:"nowrap"}}>{"Address"}</b>,

      //   cell: (row) => {
      //     return <span>{row.collected_by_name ? row.collected_by_name : "-"}</span>;
      //   },
      //   sortable: true,
      // },
      // {
      //   name: <b className="Table_columns">{"Assigned To"}</b>,
      //   cell: (row) => {
      //     return <span>{row?.assigned_to ? row.assigned_to : "-"}</span>;
      //   },
      //   sortable: false,
      // },
      {
        name: <b className="Table_columns">{"Address"}</b>,
        sortable: false,
  
        cell: (row) => (
          <div
            className="ellipsis First_Letter"
            title={`${row.house_no},${row.street},${row.landmark},${row.city},${row.district},${row.state},${row.country},${row.pincode}`}
          >
            {`${row.house_no},${row.street},${row.landmark},${row.city},${row.district},${row.state},${row.country},${row.pincode}`}
          </div>
        ),
      },
  
      {
        name: <b className="Table_columns">{"Assigned To"}</b>,
        selector: "assigned_to",
        sortable: false,
        cell: (row) => {
          return <span>{row.assigned_to ? row.assigned_to : "---"}</span>;
        },
      },
      {
        name: <b className="Table_columns">{"Notes"}</b>,
        cell: (row) => {
          return <span>{row?.notes ? row.notes : "-"}</span>;
        },
        sortable: false,
      },
  
  ];
  return leadsRepotsTableColumns;
};