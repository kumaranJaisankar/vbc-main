import React,{useEffect} from "react";
import DataTable from "react-data-table-component";
import Typography from "@mui/material/Typography";
import moment from "moment";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../../mui/accordian";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { toast } from "react-toastify";
import SettingsIcon from '@mui/icons-material/Settings';
import { customeraxios } from "../../../../axios";
import MUIButton from "@mui/material/Button";
import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import { ModalBody, ModalFooter, Button, Spinner, Row, Col, Modal } from "reactstrap";
import { CUSTOMER_LIST } from "../../../../utils/permissions";
import { billingaxios } from "../../../../axios";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const ActionCell = ({ row, profileDetails, fetchComplaints }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // modal buttons
  const [errResponse, SetErrResonse] = useState()
  // modal 
  const [planUndo, setPlanUndo] = useState()
  const PreviousplanUndo = () => setPlanUndo(!planUndo)
  const [loader, setLoader] = useState(false)
  const [modaldata, setModaldata] = useState('Are you sure you want to raise a CREDIT NOTE for the below invoice ?')
  // API Call 

  return (
    <>
      
    </>
  );
}

const Recipts = ({ profileDetails, fetchComplaints }) => {
    const [receiptsData, setReceiptsData] = useState([]);
  const [expanded, setExpanded] = React.useState("panel8");
console.log(profileDetails,"profileDetails11")


const openrecipts = () => {
    billingaxios.get(`payment/receipt/list/${profileDetails?.user?.username}`).then((res) => {
        setReceiptsData(res.data);  // Assuming res.data contains the fetched data array
    }).catch((error) => {
        console.log("error");
    })
}

useEffect(()=>{
    openrecipts()
},[])

const columns = [
    {
      name: <b className="cust_table_columns">{"Payment ID"}</b>,
      selector: "payment_id.payment_id",
      sortable: true,
      cell: (row) => (<span>
        {row.payment_id?.payment_id}
      </span>)
    },
    {
      name: <b className="cust_table_columns">{"Status"}</b>,
      selector: "payment_id.status",
      sortable: true,
      cell: (row) => (<span>
        {row.payment_id?.status}
      </span>)
    },
    {
      name: <b className="cust_table_columns">{"Payment Method"}</b>,
      selector: "payment_id.payment_method",
      sortable: true,
      cell: (row) => (<span>
        {row.payment_id?.payment_method}
      </span>)
    },
    {
      name: <b className="cust_table_columns">{"Final Recipt Amount"}</b>,
      selector: "payment_id.amount",
      sortable: true,
      cell: (row) => (<span>
        {row.payment_id?.amount}
      </span>)
    },
    {
        name: <b className="cust_table_columns">{"Created At"}</b>,
        selector: "created_at",
        cell: (row) => (
          <span className="digits" style={{ textTransform: "initial" }}>
            {" "}
            {moment(row.created_at).format("DD MMM YYYY")}
          </span>
        ),
        sortable: true,
      },
      {
        name: <b className="cust_table_columns">{"Preview"}</b>,
          ignoreRowClick: true,
        cell: (row) => (
          <span>
            {/* <div onClick={() => inoiceDownload()}> */}
            {row.receipt && row?.receipt?.receipt_preview ? (
              <>
                <a
  
                  href={row.receipt && row?.receipt?.receipt_preview}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ position: "absolute" }}
                >
                  <i
                    style={{ marginLeft: "15px" }}
                    className="fa fa-eye"
                  ></i>
                </a>
              </>
            ) : (
              <>
                <a
                  href={row.receipt && row?.receipt?.receipt_preview}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ position: "absolute" }}
                >
                  <i className="fa fa-eye"
                    style={{ marginLeft: "15px", position: "relative", top: "-10px" }}
                  ></i>
                </a>
              </>
            )}
            {/* </div> */}
          </span>
        ),
        sortable: true,
      },
      //added css for eye icon on line 126 by marieya
      {
        name: <b className="cust_table_columns">{"Download"}</b>,
  
        // name: "Download",
        selector: "name",
        cell: (row) => (
          <span>
            {row.receipt && row?.receipt?.receipt_download ? (
              <>
                <a href={row.receipt && row?.receipt?.receipt_download} download>
                  <i
                    style={{ marginLeft: "15px" }}
                    className="fa fa-download"
                  ></i>
                </a>
              </>
            ) : (
              <>
                {" "}
                <a href={row.receipt && row?.receipt?.receipt_download} download>
                  <i className="fa fa-download"
                    style={{ marginLeft: "15px" }}
                  ></i>
                </a>
              </>
            )}
          </span>
        ),
        sortable: true,
      },];


  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // added loader by Marieya
  return (
    <>
      <Accordion
        style={{
          borderRadius: "15px",
          boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)",
        }}
        expanded={expanded === "panel8"}
        onChange={handleChange("panel8")}
      >
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h6" className="customerdetailsheading">
          Receipts
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {profileDetails?.invoices ? <>
            <DataTable columns={columns} data={receiptsData}
              className="invoice_list"
            />
          </>
            :
            <Box >
              <Skeleton />
              <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} />
              <Skeleton animation={false} />
            </Box>}
        </AccordionDetails>
      </Accordion>


    </>
  );
};

export default Recipts;
