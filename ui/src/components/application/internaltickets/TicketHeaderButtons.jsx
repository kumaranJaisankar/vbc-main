import React, { useState } from "react";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterIcon from "@mui/icons-material/FilterAlt";
import { helpdeskaxios } from "../../../axios";
import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import { downloadExcelFile, downloadPdf } from "./Export";
export const TicketHeaderButtons = (props) => {
  const [levelMenu, setLevelMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
  };

  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });

  // export
  const updateExportData = (payload) => {
    setExportData((prevState) => ({
      ...prevState,
      ...payload,
    }));
  };

  const { ticketLists } = props;

  const { currentTab } = ticketLists;
  const [pageLoadData, setPageLoadData] = useState([]);
  const headersForExportFile = [
    ["all", "All"],
    ["id", "ID"],
    ["open_for", "Customer ID"],
    ["mobile_number", "Mobile"],
    ["open_date", "Open Date"],
    ["ticket_category", "Ticket Category"],
    ["sub_category", "Sub Category"],
    ["priority_sla", "Priority"],
    ["assigned_date", "Assigned Date"],
    ["status", "Status"],
    ["customer_notes", "Customer Notes"],
    ["notes", "Notes"],
    ["watchlists", "Watchlists"],
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

  const handleExportDataModalOpen = (downloadAs) => {
    handleClose();
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      downloadAs,
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };

  const handleExportDataAsPDF = (headersForPDF,pageLoadData) => {
    const title = `${currentTab} Tickets`;
    downloadPdf(title, headersForPDF, pageLoadData, "Ticekts");
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };

  const handleDownload = () => {
    const { headersListForExport, downloadAs } = exportData;
    const headers = headersListForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );


    const queryParams = props.getQueryParams();
    helpdeskaxios.get(`v2/ticket/export?${queryParams}`)
      .then((response) => {
        setPageLoadData(response.data, "response.data");
        if (downloadAs === "pdf") {
          handleExportDataAsPDF(headersForPDF, response.data);
        }
        else {
          downloadExcelFile(response.data, downloadAs, headers)
        }


      })
   
    updateExportData({
      uiState: {
        showDropdown: false,
      },
      isExportDataModalOpen: false,
      headersListForExport: [],
      downloadAs: "",
    });
  };


  return (
    <React.Fragment>
      <div>
        <Stack direction="row" spacing={2}>
          <button
            style={{
              whiteSpace: "nowrap",
              fontSize: "medium",
            }}
            className="btn btn-primary openmodal"
            type="submit"
            onClick={() => props.openCustomizer("2")}
          >
            <span style={{ marginLeft: "-10px" }} className="openmodal">
              &nbsp;&nbsp; New
            </span>
            <i
              className="icofont icofont-plus openmodal"
              style={{
                paddingLeft: "10px",
                cursor: "pointer",
              }}
            ></i>
          </button>
          <MUIButton variant="outlined" startIcon={<RefreshIcon />} onClick={props.RefreshHandler}>
            Refresh
          </MUIButton>
          <MUIButton
            variant="outlined"
            onClick={handleClick}
            startIcon={<ExitToAppIcon />}
            endIcon={<ArrowDropDownIcon />}
          >
            Export
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
              Export csv
            </MenuItem>
            <MenuItem onClick={() => handleExportDataModalOpen("excel")}>
              Export xls
            </MenuItem>
            <MenuItem onClick={() => handleExportDataModalOpen("pdf")}>
              Export pdf
            </MenuItem>
          </Menu>

          <MUIButton
            onClick={() => OnLevelMenu(levelMenu)}
            variant="outlined"
            startIcon={<FilterIcon />}
            endIcon={<ArrowDropDownIcon />}
          >
            More Filters
          </MUIButton>
          <MUIButton
            variant="outlined"
            disabled={true}
            startIcon={<DeleteIcon />}
          ></MUIButton>
        </Stack>

        <Modal
          isOpen={exportData.isExportDataModalOpen}
          toggle={() => {
            updateExportData({
              isExportDataModalOpen: !exportData.isExportDataModalOpen,
            });
          }}
          centered
        >
          <ModalHeader
            toggle={() => {
              updateExportData({
                isExportDataModalOpen: !exportData.isExportDataModalOpen,
              });
            }}
          >
            Confirmation
          </ModalHeader>
          <ModalBody>
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
              onClick={() =>
                updateExportData({
                  isExportDataModalOpen: false,
                })
              }
            >
              Close
            </Button>
            <Button color="primary" onClick={() => handleDownload()}>
              Download
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};
