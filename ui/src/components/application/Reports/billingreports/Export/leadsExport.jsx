import React, { useState } from "react";
import MUIButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { downloadExcelFile, downloadPdf } from "../../../leads/Export/index";
import { toast } from "react-toastify";
import { billingaxios,default as axiosBaseURL } from "../../../../../axios";
import { Button, Modal,  ModalFooter, ModalBody } from "reactstrap";
import { REPORTS } from "../../../../../utils/permissions";
import EXPORT from "../../../../../assets/images/export.png";
import Tooltip from '@mui/material/Tooltip';
import { Spinner } from "reactstrap";



var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const LeadsExport = (props) => {
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });

  const { billingLists } = props;
  const { currentTab } = billingLists;
  const [pageLoadData, setPageLoadData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
 

  //  Sailaja added for Payments & Invoice Reports Export Download Button Loader on 3rd May 2023
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  const updateExportData = (payload) => {
    setExportData((prevState) => ({
      ...prevState,
      ...payload,
    }));
  };
  const handleExportDataModalOpen = (downloadAs) => {
    handleClose();
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      downloadAs,
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };
  const headersForExportFile = [
    ["all", "All"],
    ["id", "ID"],
    ["first_name", "First Name"],
    ["last_name", "Last Name"],
    ["mobile_no", "Mobile No"],
    ["alternate_mobile_no", "Alternate Mobile No"],
    ["email", "Email"],
    ["address", "Address"],
    ["lead_source", "Lead Source"],
    ["type", "Type"],
    ["status", "Status"],
    ["assigned_to", "Assigned To"],
    ["notes", "Notes"]
  ];
  //headers for excel
  const headersForExcel = [
    ["all", "All"],
    ["id", "ID"],
    ["first_name", "First Name"],
    ["last_name", "Last Name"],
    ["mobile_no", "Mobile No"],
    ["alternate_mobile_no", "Alternate Mobile No"],
    ["email", "Email"],
    ["address", "Address"],
    ["lead_source", "Lead Source"],
    ["type", "Type"],
    ["status", "Status"],
    ["assigned_to", "Assigned To"],
    ["notes", "Notes"]
  ]
  const handleCheckboxChange = (event) => {
    const { headersListForExport } = exportData;
    if (event.target.checked) {
      if (event.target.defaultValue === "all") {
        let allKeys = headersForExportFile.map((h) => {
          if (h) {
            return h[0];
          }
        });
        updateExportData({
          headersListForExport: [...allKeys],
        });
      } else {
        let list = [...headersListForExport];
        list.push(event.target.defaultValue);
        updateExportData({
          headersListForExport: [...list],
        });
      }
    } else {
      if (event.target.defaultValue === "all") {
        updateExportData({
          headersListForExport: [],
        });
      } else {
        let removedColumnFromHeader = headersListForExport.filter(
          (item) => item !== event.target.defaultValue
        );
        updateExportData({
          headersListForExport: [...removedColumnFromHeader],
        });
      }
    }
  };
  const handleDownload = () => {
    setIsLoading(true);
    const { headersListForExport, downloadAs } = exportData;
    const headers = headersListForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
    const headersForExcelFiltered = headersForExcel.filter(
      (h) => headers.includes(h[0]) && h
    );
    const queryParams = props.getQueryParams();
    axiosBaseURL
      .get(`radius/lead/reports?export=True&${queryParams}`)
      .then((response) => {
        setPageLoadData(response.data, "response.data");
        setIsLoading(false);
        if (downloadAs === "pdf") {
          handleExportDataAsPDF(headersForPDF, response.data?.results);
        } else {
          // downloadExcelFile(response.data, downloadAs, headers);
          downloadExcelFile(response.data?.results, downloadAs, headersForExcelFiltered);
        }
        // Added Close the modal after successful API call on 10th May 2023
        updateExportData({
          uiState: {
            showDropdown: false,
          },
          isExportDataModalOpen: false,
          headersListForExport: [],
          downloadAs: "",
        });
        // End
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error, "exportt")
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
          toast.error(error.response && error.response.data.detail, {
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
        console.log(error)
      });


  };
  const handleExportDataAsPDF = (headersForPDF, pageLoadData) => {
    let titleAddress = "";
    // const {
    //   total_amount,
    //   total_gst,
    // }=props.billingReport?.total_counts;
    // if(props.billingReport?.total_counts){
    //   titleAddress += 
    //   "\n"+
    //   "Invoice Reports" + 
    //   "                                                                                                                                                                  "+"Total Amount" + " :  "+ "   "+total_amount.toFixed(2)  + "     "+"Total GST" + " : "+ "      "+total_gst.toFixed(2) 
    //   // "\n" + 
    //   // "Total Due Amount" + " : "+ " "+total_due_amount +
    //   // "\n" + 
      
    //   // "\n" + 
    //   // "Total Refund" + " : "+ " "+total_refund 
    // }
    const title = `${titleAddress}`;
    // const title = "Invoice Reports";
    downloadPdf(title, headersForPDF, pageLoadData, "Leads");
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

 const handleExportclose = () => {
    updateExportData({
      isExportDataModalOpen: false,
    })
    updateExportData({
      headersListForExport: ([]),
    });
  };
// made changes in pdf by Marieya
  return (
    <div>
      {token.permissions.includes(REPORTS.EXPORT) && (
        <>
        <Tooltip title={"Export"}>
          <MUIButton
            variant="outlined"
            onClick={handleClick}
            className="muibuttons"
          >
           <img src={EXPORT} style={{width:"24px"}}/>
          </MUIButton>
          </Tooltip>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleExportDataModalOpen("csv")}>
              Export CSV
            </MenuItem>
            <MenuItem onClick={() => handleExportDataModalOpen("excel")}>
              Export XLS
            </MenuItem>
            <MenuItem onClick={() => handleExportDataModalOpen("pdf")}>
              Export PDF
            </MenuItem>
          </Menu>
        </>
      )}
      <Modal
        isOpen={exportData.isExportDataModalOpen}
        toggle={() => {
          updateExportData({
            isExportDataModalOpen: !exportData.isExportDataModalOpen,
          });
          updateExportData({
            headersListForExport: ([]),
          });
        }}
        centered
      >
        {/* <ModalHeader
          toggle={() => {
            updateExportData({
              isExportDataModalOpen: !exportData.isExportDataModalOpen,
            })
            updateExportData({
              headersListForExport: ([]),
            });
          }}
        >
        //  Sailaja Changed Reports/Invoice Reports /Export /Confirmation on 28th July
          Confirmation
        </ModalHeader> */}
        <ModalBody>
        {/* <h5>Confirmation</h5> */}
             <h5>Select the Fields Required</h5>
          <hr/>
          <div>
            {headersForExportFile.map((column, index) => {
              if (column) {
                return (
                  <span style={{ display: "block" }}>
                    <label for={column[1]} key={`${column[1]}${index}`}>
                      <input
                        value={column[0]}
                        onChange={handleCheckboxChange}
                        type="checkbox"
                        name={column[1]}
                        checked={exportData.headersListForExport.includes(
                          column[0]
                        )}
                      />
                      &nbsp; {column[1]}
                    </label>
                  </span>
                );
              }
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleExportclose}
            id="resetid"
          >
            Close
          </Button>
          <button
            id="download_button1"
            className="btn btn-primary openmodal"
            // disabled={exportData.headersListForExport.length > 0 ? false : true}
            disabled={isLoading || (exportData.headersListForExport.length > 0 ? false : true)}

            color="primary"
            onClick={() => handleDownload()}
          >
           {isLoading ? <Spinner size="sm" /> : null}
           &nbsp;&nbsp;
           <span className="openmodal">Download</span>
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default LeadsExport;
