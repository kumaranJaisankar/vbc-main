import React, { Fragment, useEffect, useState, useMemo } from "react";
import {
  Row,
  Col,
  Label,
  ModalFooter,
  Button,
  Modal,
  ModalBody,
  Dropdown,
  Spinner,
} from "reactstrap";
import { franchiseaxios } from "../../../../axios";
import isEmpty from "lodash/isEmpty";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { getNewFranchiseTableColumns } from "./data";
import DatePicker from "react-datepicker";
import moment from "moment";
import { downloadExcelFile, downloadPdf } from "./Export";
import EXPORT from "../../../../assets/images/export.png";
import MUIButton from "@mui/material/Button";
import { FRANCHISE } from "../../../../utils/permissions";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const DownloadLedgerNew = (props) => {
  const [franchiseLists, updateFranchiseLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    totalRows: "",
    currentTab: "all",
  });
  console.log(franchiseLists, "franchiseLists");
  const [basedondate, setBasedondate] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [pdfData, setPdfData] = useState();
  const [formData, setFormData] = useState({
    startdate: null,
    enddate: null,
  });
  const [leadUser, setLeadUser] = useState(props.lead);

  //export functionality
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // Added handleClick for Download Export on 11th May 2023
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [download, setDownload] = useState({});
  const [pdfDatanew, setPdfDataNew] = useState({});
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadAs, setDownloadAs] = useState("");
  const [headersForExport, setHeadersForExport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredData, setFiltereddata] = useState(data);
  const [pageLoadData, setPageLoadData] = useState([]);
  const [filteredDataForModal, setFilteredDataForModal] =
    useState(filteredData);
  const [exportData, setExportData] = useState({
    isExportDataModalOpen: false,
    headersListForExport: [],
    downloadAs: "",
    uiState: {
      showDropdown: false,
    },
  });
  //export functionality

  const headersForExportFile = [
    ["all", "All"],
    ["opening_balance", "Opening Balance"],
    ["credit_amount", "Credit"],
    ["debit_amount", "Debit"],
    ["type", "Type"],
    ["payment_date", "Payment Date"],
    ["person", "User Name"],
    ["service", "Plan Name"],
    ["wallet_amount", "Wallet Amount"],
  ];

  const headersForExcel = [
    ["all", "All"],
    ["opening_balance", "Opening Balance"],
    ["credit_amount", "Credit"],
    ["debit_amount", "Debit"],
    ["type", "Type"],
    ["payment_date", "Payment Date"],
    ["person", "User Name"],
    ["service", "Plan Name"],
    ["wallet_amount", "Wallet Amount"],
  ];

  const handleExportDataAsPDF = (headersForPDF, franchise, transactions) => {
    // Check if franchise and transactions exist before proceeding
    if (franchise && transactions) {
      const { id, name, address } = franchise;
      const {
        house_no,
        landmark,
        street,
        city,
        district,
        state,
        country,
        pincode,
      } = address;

      const formattedAddress = `Address: ${house_no}, ${landmark}, ${street}, ${city}, ${district}, ${state}, ${country}, ${pincode}`;

      const { payment_date, wallet_amount } =
        transactions[transactions.length - 1];

      const creditTotal = transactions.reduce((total, transaction) => {
        if (
          transaction?.credit &&
          typeof transaction?.credit_amount === "number"
        ) {
          return total + transaction.credit_amount;
        }
        return total;
      }, 0);

      const debitTotal = transactions.reduce((total, transaction) => {
        if (
          transaction?.debit &&
          typeof transaction?.debit_amount === "number"
        ) {
          return total + transaction.debit_amount;
        }
        return total;
      }, 0);
      const downloadfirstobject = transactions[0];

      let titleAddress = "";
      if (address) {
        titleAddress +=
          "\n" +
          "                                               " +
          "                                                  " +
          "\n" +
          "\n" +
          " " +
          "\n" +
          "\n" +
          "\n" +
          "ID                           : F" +
          id +
          "\n" +
          "Franchise Name     : " +
          name +
          "\n" +
          "Address                  : " +
          house_no +
          ", " +
          landmark +
          "\n" +
          "                                 " +
          street +
          ", " +
          city +
          "\n" +
          "                                 " +
          district +
          ", " +
          state +
          "\n" +
          "                                 " +
          country +
          ", " +
          pincode +
          "\n" +
          "Credit Total  : " +
          creditTotal +
          "    Debit Total  : " +
          debitTotal +
          "    Wallet Amount      : " +
          wallet_amount +
          "    From  : " +
          downloadfirstobject.payment_date +
          "    To    : " +
          downloadfirstobject.payment_date;
      }

      downloadPdf(titleAddress, headersForPDF, transactions, "Ledger");

      const { isExportDataModalOpen } = exportData;
      updateExportData({
        isExportDataModalOpen: !isExportDataModalOpen,
      });
    } else {
      console.log("Error: franchise or transactions is undefined");
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

    const queryParams = getQueryParams();
    franchiseaxios
      .get(`wallet/transactions/${props.lead.id}?export=true&${queryParams}`)
      .then((response) => {
        setPdfData(response.data);
        console.log(response.data, "ledgerresponse");
        setPageLoadData(response.data.transactions, "response.data");
        setIsLoading(false);
        if (downloadAs === "pdf") {
          handleExportDataAsPDF(
            headersForPDF,
            response.data.franchise,
            response.data.transactions
          );
        } else {
          downloadExcelFile(
            response.data.transactions,
            downloadAs,
            headersForExcelFiltered
          );
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
        console.log(error, "exportt");
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
        console.log(error);
      });
  };

  const updateExportData = (payload) => {
    setExportData((prevState) => ({
      ...prevState,
      ...payload,
    }));
  };
  const handleExportDataModalOpen = (downloadAs) => {
    console.log("click");
    handleClose();
    const { isExportDataModalOpen } = exportData;
    setDownloadableExcelData(download.transactions);
    updateExportData({
      downloadAs,
      isExportDataModalOpen: !isExportDataModalOpen,
    });
  };
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
  const tableColumns = getNewFranchiseTableColumns({});

  useEffect(() => {
    fetchFranchiseLists();
  }, [
    formData,
    props.BasicLineTab === "5",
    franchiseLists.currentPageNo,
    franchiseLists.currentItemsPerPage,
  ]);
  const fetchFranchiseLists = () => {
    const source = axios.CancelToken.source();
    setLoader(true);

    updateFranchiseLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();
    franchiseaxios
      .get(`wallet/transactions/${props.lead.id}?${queryParams}`, {
        cancelToken: source.token,
      })
      .then((response) => {
        setLoader(false);
        const { data } = response;
        const { count, next, previous, page, results } = data;
        const updatedPageLoadData = [...results]; // Always update with the latest results
        // setDownload(updatedPageLoadData);

        updateFranchiseLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          pageLoadData: updatedPageLoadData,
          prevURI: previous,
          nextURI: next,
          totalRows: count,
        }));
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        updateFranchiseLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          prevURI: null,
          nextURI: null,
        }));
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is403Error = errorString.includes("403");
        if (is500Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (is403Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        console.error("Something went wrong!", error);
      })
      .finally(function () {
        updateFranchiseLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };
  // Handling rows per page with handlePerRowsChange()
  const handlePerRowsChange = (newPerPage, page) => {
    updateFranchiseLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handleExportclose = () => {
    setIsExportDataModalToggle(false);
    setHeadersForExport([]);
  };
  //Handling pages with handlePageChange()
  const handlePageChange = (page) => {
    updateFranchiseLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };
  const getQueryParams = () => {
    const { currentPageNo, currentItemsPerPage } = franchiseLists;
    const { startdate, enddate } = formData; // get the dates from state

    let queryParams = "";
    // queryParams += connection;
    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    if (startdate) {
      const startDateStr = `${startdate.getFullYear()}-${(
        "0" +
        (startdate.getMonth() + 1)
      ).slice(-2)}-${("0" + startdate.getDate()).slice(-2)}`;
      queryParams += `${queryParams ? "&" : ""}start_date=${startDateStr}`;
    }
    if (enddate) {
      const endDateStr = `${enddate.getFullYear()}-${(
        "0" +
        (enddate.getMonth() + 1)
      ).slice(-2)}-${("0" + enddate.getDate()).slice(-2)}`;
      queryParams += `${queryParams ? "&" : ""}end_date=${endDateStr}`;
    }
    return queryParams;
  };
  // On change of start date
  const onChangeStartDate = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      startdate: date,
    }));
  };
  // On change of end date
  const onChangeEndDate = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      enddate: date,
    }));
  };

  return (
    <Fragment>
      <Row>
        <Col sm="3" style={{ marginTop: "-18px" }} className="filter-col">
          <Label className="kyc_label">From Date</Label>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            wrapperClassName="date-picker"
            selected={formData && formData.startdate}
            onChange={onChangeStartDate} // Changed here
            //   onChange={(date) =>
            //     setFormData((prevState) => ({
            //       ...prevState,
            //       startdate: date,
            //     }))
            //   }
            name="startdate"
          />
        </Col>

        {/* <FormGroup>
                    <div className="input_wrap">
                    <Input
                        className={`form-control-digits not-empty`}
                        // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                        value={formData && formData.startdate}
                        onChange={selectdate}
                        type="date"
                        id="meeting-time"
                        name="startdate"
                    />
                    <Label for="meeting-time" className="placeholder_styling">
                        From Date
                    </Label>
                    </div>
                </FormGroup> */}
        <Col sm="3" style={{ marginTop: "-18px" }} className="filter-col">
          <Label className="kyc_label">To Date</Label>
          <DatePicker
            wrapperClassName="date-picker"
            dateFormat="yyyy/MM/dd"
            selected={formData && formData.enddate}
            onChange={onChangeEndDate} // Changed here
            //   onChange={(date) =>
            //     setFormData((prevState) => ({
            //       ...prevState,
            //       enddate: date,
            //     }))
            //   }
            minDate={moment(formData.startdate).toDate()}
            name="enddate"
          />
        </Col>

        <Col sm="4" style={{ textAlign: "end" }}>
          {token.permissions.includes(FRANCHISE.EXPORT) && (
            <>
              <Tooltip title={"Export"}>
                <MUIButton
                  className="muibuttons"
                  variant="outlined"
                  onClick={handleClick}
                  style={{ height: "50px" }}
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
        </Col>
      </Row>

      <br />
      <Row style={{ zIndex: 1 }}>
        <DataTable
          // className="franchise-list"
          columns={tableColumns}
          data={franchiseLists.pageLoadData || []}
          noHeader
          //   onSelectedRowsChange={({ selectedRows }) =>
          //     handleSelectedRows(selectedRows)
          //   }
          progressComponent={
            <SkeletonLoader loading={franchiseLists.uiState.loading} />
          }
          selectableRows
          //   selectableRowsComponent={NewCheckbox}
          //   conditionalRowStyles={conditionalRowStyles}
          clearSelectedRows={false}
          progressPending={franchiseLists.uiState.loading}
          paginationTotalRows={franchiseLists.totalRows}
          pagination
          paginationServer
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          noDataComponent={"No Data"}
        />
      </Row>
      <Modal
        isOpen={exportData.isExportDataModalOpen}
        toggle={() => {
          updateExportData({
            isExportDataModalOpen: !exportData.isExportDataModalOpen,
          });
          updateExportData({
            headersListForExport: [],
          });
        }}
        centered
      >
        <ModalBody>
          {/* <h5>Confirmation</h5> */}
          <h5>Select the Fields Required</h5>
          <hr />
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
          <Button color="secondary" onClick={handleExportclose} id="resetid">
            Close
          </Button>
          <button
            id="download_button1"
            className="btn btn-primary openmodal"
            // disabled={exportData.headersListForExport.length > 0 ? false : true}
            disabled={
              isLoading ||
              (exportData.headersListForExport.length > 0 ? false : true)
            }
            color="primary"
            onClick={() => handleDownload()}
          >
            {isLoading ? <Spinner size="sm" /> : null}
            &nbsp;&nbsp;
            <span className="openmodal">Download</span>
          </button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};
const SkeletonLoader = ({ loading }) => {
  const tableData = useMemo(
    () => (loading ? Array(10).fill({}) : []),
    [loading]
  );

  return (
    <Box sx={{ width: "100%", pl: 2, pr: 2 }}>
      {tableData.map((_) => (
        <Skeleton height={50} />
      ))}
    </Box>
  );
};

export default DownloadLedgerNew;
