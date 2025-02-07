import React, { useState, useEffect, useMemo } from "react";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import REFRESH from "../../../assets/images/refresh.png";
import AddIcon from "@mui/icons-material/Add";
import AddOffers from "./AddOffers";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import debounce from "lodash.debounce";
import Tooltip from "@mui/material/Tooltip";

import { SERVICEPLAN } from "../../../utils/permissions";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}
export const ServiceHeaderButtons = (props) => {
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    props.updateserviceLists((prevState) => ({
      ...prevState,
      appliedServiceFilters: {
        ...prevState.appliedServiceFilters,
        package_name: {
          ...prevState.appliedServiceFilters.package_name,
          value: {
            ...prevState.appliedServiceFilters.package_name.value,
            strVal: searchUser || "",
            label: searchUser,
          },
        },
      },
    }));
  }, [searchUser]);

  const changeHandler = (event) => {
    setSearchUser(event.target.value);
  };

  const debouncedChangeHandler = useMemo(() => {
    return debounce(changeHandler, 500);
  }, []);
  return (
    <React.Fragment>
      <div>
        <Stack direction="row" spacing={2}>
          <span className="all_cust">Internet Service Plan</span>
          {/* <AddOffers /> */}
          <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
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
                placeholder="Search With Package Name"
                inputProps={{ "aria-label": "search google maps" }}
                onChange={debouncedChangeHandler}
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
            <Tooltip title={"Refresh"}>
              <MUIButton
                onClick={props.RefreshHandler}
                variant="outlined"
                className="muibuttons"
              >
                <img src={REFRESH} style={{ width: "20px" }} />
              </MUIButton>
            </Tooltip>
            {token.permissions.includes(SERVICEPLAN.SERVICECREATE) && (
              <button
                className="btn btn-primary openmodal"
                id="newbuuon"
                type="submit"
                onClick={() => props.openCustomizer("2")}
              >
                <b>
                  <span
                    className="openmodal"
                    style={{ fontSize: "16px", marginLeft: "-9px" }}
                  >
                    New &nbsp;&nbsp;
                  </span>
                </b>
                <i
                  className="icofont icofont-plus openmodal"
                  style={{
                    cursor: "pointer",
                  }}
                ></i>
              </button>
            )}

            {props.activeTab === "IN" || props.activeTab === "OFFER" ? (
              ""
            ) : (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <MUIButton
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={props.addCombo === 0}
                  style={{ height: "40px" }}
                >
                  New Combo
                </MUIButton>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <MUIButton
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={props.addCombo === 0}
                  style={{ height: "40px" }}
                >
                  Existing Combo
                </MUIButton>
              </>
            )}
            {token.permissions.includes(SERVICEPLAN.SERVICE_PACKAGE_STATUS) && (
              <>
                &nbsp;&nbsp; &nbsp;
                {props.activeTab === "ACT" || props.activeTab === "OFFER" ? (
                  ""
                ) : (
                  <MUIButton
                    variant="outlined"
                    disabled={props.addCombo === 0}
                    onClick={props.callAPIforActiveInctive}
                    style={{ height: "40px" }}
                  >
                    Active
                  </MUIButton>
                )}
                {props.activeTab === "IN" || props.activeTab === "OFFER" ? (
                  ""
                ) : (
                  <MUIButton
                    variant="outlined"
                    disabled={props.addCombo === 0}
                    onClick={props.callAPIforActiveInctive}
                    style={{ height: "40px" }}
                  >
                    Inactive
                  </MUIButton>
                )}
              </>
            )}
          </Stack>
        </Stack>
      </div>
    </React.Fragment>
  );
};
