import React from "react";
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
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import SettingsIcon from "@mui/icons-material/Settings";
import { customeraxios } from "../../../../axios";
import MUIButton from "@mui/material/Button";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import {
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Row,
  Col,
  Modal,
} from "reactstrap";
import { CUSTOMER_LIST } from "../../../../utils/permissions";
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
  const [errResponse, SetErrResonse] = useState();
  // modal
  const [planUndo, setPlanUndo] = useState();
  const PreviousplanUndo = () => setPlanUndo(!planUndo);
  const [loader, setLoader] = useState(false);
  const [modaldata, setModaldata] = useState(
    "Are you sure you want to raise a CREDIT NOTE for the below invoice ?"
  );
  const [modaldata1, setModaldata1] = useState(
    "CREDIT NOTE already issued for this invoice"
  );
  // API Call
  const RaiseNote = () => {
    setLoader(true);
    customeraxios
      .get(`/customers/credit/note/info/${profileDetails?.id}`)
      .then((res) => {
        let creditNoteUrl='';
        if (res.status === 200 && res?.data && res?.data?.cstmr_previous_status!==null) {
         
          if(res?.data?.cstmr_previous_status==="EXP"){
            creditNoteUrl='customers/enh/off/expired/cstmr/plan/renew/undo'
          }
          // if(res?.data?.cstmr_previous_status==="ACT"){
          //   creditNoteUrl ='customers/enh/off/plan/renew/undo'
          // }
          // if(res?.data?.cstmr_previous_status === "INS"){
          //   creditNoteUrl ='customers/enh/off/plan/renew/undo'
          // }
          else{
            creditNoteUrl ='customers/enh/off/plan/renew/undo'
          }
          setLoader(true);
          const data = {
            customer_id: profileDetails.id,
          };
          customeraxios
            .patch(
              `${creditNoteUrl}/${row?.id}`,
              data
            )
            .then((res) => {
              setLoader(false);
              PreviousplanUndo();
              fetchComplaints();
              window.location.reload();
              setModaldata(res?.data?.msg);
              toast.success(res?.data?.msg, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
              });
            })
            .catch((error) => {
              setLoader(false);
              setModaldata(error.response.data.msg);
              SetErrResonse(error);
              const errorString = JSON.stringify(error);
              const is500Error = errorString.includes("500");
              const is404Error = errorString.includes("400");
              if (error.response && error.response.data.msg) {
                toast.error(error.response && error.response.data.msg, {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              } else if (is500Error) {
                toast.error("Something went wrong", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              } else if (is404Error) {
                toast.error("API mismatch", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              } else {
                toast.error("Something went wrong", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              }
            });
        } else {
          setLoader(false);
          toast.error("Credit note is not available for this Invoice", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };
  return (
    <>
      <IconButton
        aria-label="settings"
        aria-controls="settings-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          key="action1"
          onClick={() => {
            PreviousplanUndo();
            handleClose();
          }}
          // onClick={handleClose}
        >
          Raise CN
        </MenuItem>
      </Menu>

      <Modal
        toggle={PreviousplanUndo}
        isOpen={planUndo}
        centered
        size="lg"
        backdrop="static"
      >
        <ModalBody>
        {row?.credit_note_raised ? (
        // If creditmot is true, display modalData1
        <h6>{modaldata1}</h6>
      ) : (
        // If creditmot is false, display modalData
        <h6>{modaldata}</h6>
      )}
          {/* <h6>{modaldata}</h6> */}
          <br />
          <p>
            {" "}
            Invoice Id :<b> {row?.invoice_id}</b>
          </p>
          <p>
            {" "}
            Payment id : <b>{row?.payment?.payment_id}</b>
          </p>
          <p>
            {" "}
            Status : <b>{row?.payment?.status}</b>
          </p>
          <p>
            {" "}
            Payment Method : <b>{row?.payment?.payment_method}</b>
          </p>
          <p>
            {" "}
            FInal Invoice Amount : <b>{row?.payment?.amount}</b>
          </p>
        </ModalBody>
        <ModalFooter>
          <Row style={{ textAlign: "end" }}>
          {row?.credit_note_raised ? 
          <Col>
              <MUIButton
                variant="contained"
                id="update_button"
                style={{ color: "white" }}
                //className="cust_action"
                onClick={() => {
                  PreviousplanUndo();
                }}
              >
                {"Okay"}
              </MUIButton>
            </Col>
            :<Col>
            {errResponse ? (
              ""
            ) : (
              <Button
                variant="contained"
                id="update_button"
                onClick={RaiseNote}
                style={{ color: "white" }}
                disabled={loader}
              >
                {loader ? <Spinner size="sm"> </Spinner> : null}
                Proceed &nbsp; &nbsp; &nbsp;
              </Button>
            )}
            &nbsp;&nbsp;&nbsp;
            <MUIButton
              variant="outlined"
              size="medium"
              className="cust_action"
              onClick={() => {
                PreviousplanUndo();
              }}
            >
              {errResponse ? "Okay" : "Cancel"}
            </MUIButton>
          </Col>}
          </Row>
        </ModalFooter>
      </Modal>
    </>
  );
};

const LatestInvoice = ({ profileDetails, fetchComplaints }) => {
  const [expanded, setExpanded] = React.useState("panel8");

  const columns = [
    {
      name: <b className="cust_table_columns">{"Payment ID"}</b>,
      selector: "payment.payment_id",
      sortable: true,
      cell: (row) => <span>{row && row.payment?.payment_id}</span>,
    },
    {
      name: <b className="cust_table_columns">{"Status"}</b>,
      selector: "payment.status",
      sortable: true,
      cell: (row) => <span>{row && row.payment?.status}</span>,
    },
    {
      name: <b className="cust_table_columns">{"Payment Method"}</b>,
      selector: "payment.payment_method",
      sortable: true,
      cell: (row) => <span>{row && row.payment?.payment_method}</span>,
    },
    {
      name: <b className="cust_table_columns">{"Final Invoice Amount"}</b>,
      selector: "payment.amount",
      sortable: true,
      cell: (row) => <span>{row && row.payment?.amount}</span>,
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

      // name: "Preview",
      ignoreRowClick: true,
      cell: (row) => (
        <span>
          {/* <div onClick={() => inoiceDownload()}> */}
          {row.invoice && row?.invoice?.inv_preview ? (
            <>
              <a
                href={row.invoice && row?.invoice?.inv_preview}
                target="_blank"
                rel="noreferrer noopener"
                style={{ position: "absolute" }}
              >
                <i style={{ marginLeft: "15px" }} className="fa fa-eye"></i>
              </a>
            </>
          ) : (
            <>
              <a
                href={row.invoice && row?.invoice?.inv_preview}
                target="_blank"
                rel="noreferrer noopener"
                style={{ position: "absolute" }}
              >
                <i
                  className="fa fa-eye"
                  style={{
                    marginLeft: "15px",
                    position: "relative",
                    top: "-10px",
                  }}
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
          {row.invoice && row?.invoice?.inv_download ? (
            <>
              <a href={row.invoice && row?.invoice?.inv_download} download>
                <i
                  style={{ marginLeft: "15px" }}
                  className="fa fa-download"
                ></i>
              </a>
            </>
          ) : (
            <>
              {" "}
              <a href={row.invoice && row?.invoice?.inv_download} download>
                <i
                  className="fa fa-download"
                  style={{ marginLeft: "15px" }}
                ></i>
              </a>
            </>
          )}
        </span>
      ),
      sortable: true,
    },
    {
      name: <b className="cust_table_columns">{"Action"}</b>,
      selector: "",
      sortable: true,
      cell: (row) => (
        <>
          {token.permissions.includes(CUSTOMER_LIST.CLIENT_CN) ? (
            <ActionCell
              row={row}
              profileDetails={profileDetails}
              fetchComplaints={fetchComplaints}
            />
          ) : (
            "---"
          )}
        </>
      ),
    },
  ];

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
            Invoices
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {profileDetails?.invoices ? (
            <>
              <DataTable
                columns={columns}
                data={profileDetails?.invoices}
                className="invoice_list"
              />
            </>
          ) : (
            <Box>
              <Skeleton />
              <Skeleton animation="wave" height={30} />{" "}
              <Skeleton animation="wave" height={30} />{" "}
              <Skeleton animation="wave" height={30} />{" "}
              <Skeleton animation="wave" height={30} />{" "}
              <Skeleton animation="wave" height={30} />{" "}
              <Skeleton animation="wave" height={30} />{" "}
              <Skeleton animation="wave" height={30} />
              <Skeleton animation={false} />
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default LatestInvoice;
