import React, { useState, useRef, useMemo, useEffect } from "react";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { franchiseaxios } from "../../../../axios";
import { downloadExcelFile, downloadPdf } from "../Export";
import { Spinner } from "reactstrap";

import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Row,
} from "reactstrap";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import REFRESH from "../../../../assets/images/refresh.png";
import EXPORT from "../../../../assets/images/export.png";
import Tooltip from "@mui/material/Tooltip";
import { FRANCHISE } from "../../../../utils/permissions";
import FILTERS from "../../../../assets/images/filters.png";
import debounce from "lodash.debounce";
import { FranchiseFilterContainer } from "../franchisefilter/FranchiseFilterContainer";
import Allfranchisefilters from "./franchsieFilters";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

// HeaderButtons for NewFranchise
export const FranchiseHeaderButtons = (props) => {
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });
  const [levelMenu, setLevelMenu] = useState(false);

  // const [headersForExport, setHeadersForExport] = useState([]);
  const { RefreshHandler, walletLists, filtersData } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { franchiseLists, updateFranchiseLists } = props;
  const { currentTab, pageLoadDataForFilter } = franchiseLists;
  const [pageLoadData, setPageLoadData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [searchUser, setSearchUser] = useState({ value: "", name: "open_for" });

  //  Sailaja added for Security Deposit Export Download Button Loader on 3rd May 2023
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (event) => {
    const { headersListForExport } = exportData;
    if (event.target.checked) {
      if (event.target.defaultValue === "all") {
        let allKeys = props.headersForExportFile.map((h) => {
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

  const handleExportDataAsPDF = (headersForPDF, pageLoadData) => {
    const title = `${currentTab} Franchise`;
    downloadPdf(title, headersForPDF, pageLoadData, "Franchise");
    const { isExportDataModalOpen } = exportData;
    updateExportData({
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };

  const handleDownload = () => {
    setIsLoading(true);
    const { headersListForExport, downloadAs } = exportData;
    const headers = headersListForExport.filter((header) => header !== "all");
    const headersForPDF = props.headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
    const headersForExcelFiltered = props.headersForExcel.filter(
      (h) => headers.includes(h[0]) && h
    );
    console.log(headersForPDF, ":headersForPDF");

    const queryParams = props.getQueryParams();
    franchiseaxios
      .get(`accounts/reports/franchise/export?${queryParams}`)
      .then((response) => {
        setPageLoadData(response.data, "response.data");
        setIsLoading(false);
        if (downloadAs === "pdf") {
          handleExportDataAsPDF(headersForPDF, response.data);
        } else {
          // downloadExcelFile(response.data, downloadAs, headers);
          downloadExcelFile(response.data, downloadAs, headersForExcelFiltered);
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
      });
  };

  const updateExportData = (payload) => {
    setExportData((prevState) => ({
      ...prevState,
      ...payload,
    }));
  };

  const changeHandler = (event) => {
    setSearchUser((prevState) => {
      return {
        ...prevState,
        value: event.target.value,
      };
    });
  };
  const debouncedChangeHandler = useMemo(() => {
    return debounce(changeHandler, 500);
  }, []);

  useEffect(() => {
    updateFranchiseLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        name: {
          ...prevState.appliedFilters.name,
          value: {
            ...prevState.appliedFilters.name.value,
            strVal: searchUser.value || "",
            label: searchUser.value,
            name: searchUser.name,
          },
        },
      },
    }));
  }, [searchUser]);

  return (
    <React.Fragment>
      <div>
        <Stack direction="row" spacing={2}>
          <p className="all_cust">Franchise</p>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ flex: 1 }}
            spacing={2}
          >
            <Paper
              component="div"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
                height: "40px",
                boxShadow: "none",
                border: "1px solid #E0E0E0",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                inputProps={{ "aria-label": "search google maps" }}
                placeholder="Search With Franchise Name"
                onChange={debouncedChangeHandler}
              // onChange={(event) => handlesearchChange(event)}
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
            {token.permissions.includes(FRANCHISE.EXPORT) && (
              <>
                <Tooltip title={"Export"}>
                  <MUIButton
                    className="muibuttons"
                    variant="outlined"
                    onClick={handleClick}
                    style={{ height: "40px" }}
                  >
                    <img src={EXPORT} className="Header_img" />
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

            <Tooltip title={"Refresh"}>
              <MUIButton
                className="muibuttons"
                onClick={RefreshHandler}
                variant="outlined"
                style={{ height: "40px" }}
              >
                <img src={REFRESH} className="Header_img" />
              </MUIButton>
            </Tooltip>
            {token.permissions.includes(FRANCHISE.CREATE) && (
              <button
                onClick={() => props.openCustomizer("2")}
                id="newbuuon"
                className="btn btn-primary openmodal"
                type="submit"
              >
                <span style={{ marginLeft: "-20px" }} className="openmodal">
                  &nbsp;&nbsp; New{" "}
                </span>
                <i
                  className="icofont icofont-plus openmodal"
                  style={{
                    paddingLeft: "10px",
                    cursor: "pointer",
                  }}
                ></i>
              </button>
            )}
          </Stack>
        </Stack>
        <br />
        <Row>
          {token.permissions.includes(FRANCHISE.FILTERS) && (
            <>
              <Allfranchisefilters
                franchisestatus={props.franchisestatus}
                franchisesms={props.franchisesms}
                franchisetype={props.franchisetype}
                inputs={props.inputs}
                setInputs={props.setInputs}
                fetchFranchiseLists={props.fetchFranchiseLists}
                loader={props.loader} 
                setLoader={props.setLoader}
              // branchfilter={props.branchfilter}
              // setBranchfilter={props.setBranchfilter}
              />
            </>
          )}
        </Row>
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
   Select the Fields Required
             </ModalHeader>
          <ModalBody>
            <div>
              {props.headersForExportFile.map((column, index) => {
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
            <button
              color="primary"
              id="download_button1"
              className="btn btn-primary openmodal"
              onClick={() => handleDownload()}
              // disabled={
              //   exportData.headersListForExport.length > 0 ? false : true
              // }
              disabled={
                isLoading || (exportData.headersListForExport.length > 0 ? false : true)}>
              {isLoading ? <Spinner size="sm" /> : null}
              &nbsp;&nbsp;
              <span className="openmodal">Download</span>
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};
