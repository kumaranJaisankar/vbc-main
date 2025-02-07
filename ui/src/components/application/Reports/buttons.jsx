import React, { useState, useRef, Fragment } from "react";
import { Container } from "reactstrap";
import Stack from "@mui/material/Stack";
import RefreshIcon from "@mui/icons-material/Refresh";
import MUIButton from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
  } from "../../../mui/accordian";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";



const Buttons = () => {
//   const [filteredData, setFiltereddata] = useState(data);
  const [data, setData] = useState([]);
  //refresh button functionality
  const [reportrefresh, setReportrefresh] = useState(0);
  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [downloadAs, setDownloadAs] = useState("");


  const Refreshhandler = () => {
    setReportrefresh(1);
    if (searchInputField.current) searchInputField.current.value = "";
  };
  const searchInputField = useRef(null);
  const ref = useRef();
  //export handleclick functionlaity
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleExportDataModalOpen = (downloadAs) => {
    handleClose();
    setIsExportDataModalToggle(!isExportDataModalOpen);
    // setDownloadableExcelData(filteredData);
    setDownloadAs(downloadAs);
  };

  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
          <div className="edit-profile">
            <Stack direction="row" spacing={2}>
              <MUIButton
                onClick={Refreshhandler}
                variant="outlined"
                startIcon={<RefreshIcon />}
              >
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
            </Stack>
           
          
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default Buttons;
