import React, { useEffect, useMemo, useState } from "react";
import MUIButton from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { downloadExcelFile, downloadPdf } from "./Export";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  Label,
  Row,
  Col,
  FormGroup,
} from "reactstrap";
import { adminaxios } from "../../../axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";


  const NewBillingHeaderButtons = (props) => {
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });

  const { RefreshHandler, walletLists, updateFranchiseLists, filtersData } =
    props;
//   const { currentTab, pageLoadDataForFilter } = walletLists;
  const [pageLoadData, setPageLoadData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [calender, setCalender] = useState(false);
  //state for custom start and end date
  const [customenddate, setCustomenddate] = useState(new Date());
  const [customstartdate, setCustomstartdate] = useState(new Date());
  const [refresh, setRefresh] = useState(0);

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const headersForExportFile = [
    ["all", "All"],
    ["username", "ID"],
    ["franchise", "Franchise Name"],
    ["payment_id", "Payment Id"],
    ["mobile_number", "Mobile"],
    ["pickup_type", "Payment Method"],
    // ["online_payment_mode", "Online Payment Method"],
    ["amount", "Amount"],
    ["due_amount", "Due Amount"],
    ["collected_by", "CollectedBy"],
    ["completed_date", "Collected Date"],
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
  const handleExportDataAsPDF = (headersForPDF, pageLoadData) => {
    const title = `Franchise Reports`;
    downloadPdf(title, headersForPDF, pageLoadData, "Franchise Reports");
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
    adminaxios
      .get(`wallet/transactions/export?${queryParams}`)
      .then((response) => {
        setPageLoadData(response.data, "response.data");
        if (downloadAs === "pdf") {
          handleExportDataAsPDF(headersForPDF, response.data);
        } else {
          downloadExcelFile(response.data, downloadAs, headers);
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
      });
  };

  const updateExportData = (payload) => {
    setExportData((prevState) => ({
      ...prevState,
      ...payload,
    }));
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // fucntionality for date range selection
  const basedonrangeselector = (e, value) => {
    //today
    let reportstartdate = moment().format("YYYY-MM-DD");
    let reportenddate = moment(new Date(), "DD-MM-YYYY").add(1, "day");

    if (e.target.value === "today") {
      reportstartdate = moment().format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
            setCalender(false);

    }
    //yesterday
    else if (e.target.value === "yesterday") {
      reportstartdate = moment().subtract(1, "d").format("YYYY-MM-DD");

      reportenddate = moment().subtract(1, "d").format("YYYY-MM-DD");
      setCalender(false);

    }
    //last 7 days
    else if (e.target.value === "last7days") {
      reportstartdate = moment().subtract(7, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
      setCalender(false);
    }
    //last week
    else if (e.target.value === "lastweek") {
      reportstartdate = moment()
        .subtract(1, "weeks")
        .startOf("week")
        .format("YYYY-MM-DD");

      reportenddate = moment()
        .subtract(1, "weeks")
        .endOf("week")
        .format("YYYY-MM-DD");
        setCalender(false);
    }
    //last 30 days
    else if (e.target.value === "last30days") {
      reportstartdate = moment().subtract(30, "d").format("YYYY-MM-DD");
      setCalender(false);
    }
    //end
    // last month
    else if (e.target.value === "lastmonth") {
      reportstartdate = moment()
        .subtract(1, "months")
        .startOf("months")
        .format("YYYY-MM-DD");

      reportenddate = moment()
        .subtract(1, "months")
        .endOf("months")
        .format("YYYY-MM-DD");
      setCalender(false);

    } else if (e.target.value === "custom") {
      setCalender(true);
      // reportstartdate = e.target.value;

      // reportenddate = e.target.value;
    }
    if(e.target.value !== "custom"){
      setCustomstartdate(reportstartdate);
      setCustomenddate(reportenddate);
      props.setWalletHeaderenddate(reportenddate);
  
      props.setWalletHeaderstartdate(reportstartdate);

    }
    // setCustomstartdate(reportstartdate);
    // setCustomenddate(reportenddate);
    // props.setWalletHeaderenddate(reportenddate);

    // props.setWalletHeaderstartdate(reportstartdate);
  };
  //end

  const handlesearchChange = (event) => {
    // let value = event.target.value.toLowerCase();
    // let result = [];

    // let newdata = { ...data };
    // result = newdata.all_transactions.filter((newdata) => {
    //   console.log(data);
    //   if (newdata.name.toLowerCase().search(value) != -1) return newdata;
    // });
    // setFilteredTableData({ all_transactions: result });
    // console.log(result, "result");
  };
  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      setCustomstartdate(e.target.value);
      props.setWalletHeaderstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      setCustomenddate(e.target.value);
      props.setWalletHeaderenddate(e.target.value);
    }
  };
  // const Verticalcentermodaltoggle = () => {}
  return (
    <div>
      <Stack direction="row" spacing={2}>
        <MUIButton
          style={{ height: "37px" }}
          onClick={props.RefreshHandler}
          variant="outlined"
          startIcon={<RefreshIcon />}
        >
          Refresh
        </MUIButton>
        <MUIButton
          style={{ height: "37px" }}
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
        <div className="input_wrap">
          <Input
            className={`form-control-digits not-empty`}
            type="select"
            name=""
            onChange={basedonrangeselector}
            style={{
              width: "max-content",
              border: "1px solid rgba(25, 118, 210, 0.5",
              borderRadius: "4px",
            }}
          >
            <option value="" style={{ display: "none" }}></option>
            <option value="today" selected>
              Today
            </option>
            <option value="yesterday">Yesterday</option>
            <option value="lastweek">Last Week</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="lastmonth">Last Month</option>
            <option value="custom">Custom</option>
          </Input>
          <Label
            for="meeting-time"
            className="placeholder_styling"
            style={{
              color: "#1976d2",
              fontWeight: "500",
              fontSize: "0.875rem",
            }}
          >
            Date Range
          </Label>
        </div>
        <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
              <Paper
                component="div"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  inputProps={{ "aria-label": "search google maps" }}
                  placeholder="Search With Payment ID"
                  onChange={(event) => handlesearchChange(event)}
                />
                <IconButton
                  type="submit"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Stack> 
           {/* </Stack> */}
        {calender ? (
          <div style={{ display: "flex", marginRight: "108px" }}>
            <Col sm="6">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    onChange={customHandler}
                    // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                    // value={data1 && data1.start_date}
                    type="date"
                    id="meeting-time"
                    name="start_date"
                    value={!!customstartdate && customstartdate}
                  />
                  <Label for="meeting-time" className="placeholder_styling">
                    Start Date
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    onChange={customHandler}
                    id="meeting-time"
                    name="end_date"
                    type="date"
                    value={!!customenddate && customenddate}
                  />
                  <Label for="meeting-time" className="placeholder_styling">
                    End Date
                  </Label>
                </div>
              </FormGroup>
            </Col>
          </div>
        ) : (
          ""
        )}
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
          <Button color="primary" onClick={() => handleDownload()}
           disabled={exportData.headersListForExport.length > 0 ? false : true}
          >
            Download
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default NewBillingHeaderButtons;
