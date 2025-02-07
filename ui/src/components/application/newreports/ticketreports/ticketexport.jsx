import React, {useState } from "react";
import MUIButton from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {toast} from "react-toastify"
import EXPORT from "../../../../assets/images/export.png";

import {
  downloadExcelFile,
  downloadPdf,
} from "../../internaltickets/Export";
import { helpdeskaxios } from "../../../../axios";

import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import { REPORTS } from "../../../../utils/permissions";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const TicketExport = (props) => {
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });

  const { ticketLists } =
    props;
  const { currentTab,  pageLoadDataForFilter } = ticketLists;
  const [pageLoadData, setPageLoadData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
    ["open_for", "Customer ID"],
    ["mobile_number","Mobile Number"],
    ["priority_sla","Priority"],
    ["staatus","Status"],
    ["ticket_category","Category"],
    ["sub_category","SubCategory"],
    ["open_date","Open Date"],
    ["assigned_date","Assigned Date"],
    ["customer_notes","Customer Notes"]
  ];
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
    const { headersListForExport, downloadAs } = exportData;
    const headers = headersListForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
    const queryParams = props.getQueryParams();
    helpdeskaxios.get(`/v2/ticket/export?${queryParams}`)
    .then((response) => {
      setPageLoadData(response.data,"response.data");
      if (downloadAs === "pdf") {
       handleExportDataAsPDF(headersForPDF, response.data);
     }
     else {
       downloadExcelFile(response.data, downloadAs, headers)
     }
    })
    .catch(function (error) {
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
    });
    updateExportData({
      uiState: {
        showDropdown: false,
      },
      isExportDataModalOpen: false,
      headersListForExport: [],
      downloadAs: "",
    });
  };
  const handleExportDataAsPDF = (headersForPDF,pageLoadData) => {
    const title = `${currentTab} Ticket Reports`;
    downloadPdf(title, headersForPDF, pageLoadData, "Ticket Reports");
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

  return (
    <div>
       {token.permissions.includes(REPORTS.EXPORT) && (
     <>
      <MUIButton
        variant="outlined"
        onClick={handleClick}
      >
           <img src={EXPORT} style={{width:"24px"}}/>
      </MUIButton>
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
            });
          }}
        >
          Confirmation
        </ModalHeader> */}
        <ModalBody>
        <h5>Confirmation</h5>
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
          >
            Close
          </Button>
          <Button  
           id="download_button"
          disabled={exportData.headersListForExport.length > 0 ? false : true}
          color="primary" onClick={() => handleDownload()}>
            Download
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TicketExport;
