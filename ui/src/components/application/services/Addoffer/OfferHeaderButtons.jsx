import React from "react";
import Stack from "@mui/material/Stack";
import { SERVICEPLAN } from "../../../../utils/permissions";
import REFRESH from "../../../../assets/images/refresh.png";
import MUIButton from "@mui/material/Button";
import Tooltip from '@mui/material/Tooltip';
const storageToken = localStorage.getItem("token");
const token = JSON.parse(storageToken);

const OfferHeaderButtons = (props) => {
  return (
    <React.Fragment>
      <div className="edit-profile">
        <Stack direction="row" spacing={2}>
          <span className="all_cust">Service Plan</span>
          <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
            <Tooltip title={"Refresh"}>
              <MUIButton
              onClick={props.RefreshHandler}
                variant="outlined"
                className="muibuttons"
              >
                <img src={REFRESH} className="Header_img" />
              </MUIButton>
            </Tooltip>
            {token.permissions.includes(SERVICEPLAN.OFFERCREATE) && (
              <button
                id="newbuuon"
                className="btn btn-primary openmodal"
                type="submit"
                onClick={() => props.openCustomizer("2")}
              >

                <b>
                  <span className="openmodal" style={{ fontSize: "16px", marginLeft: "-9px" }}>
                    New &nbsp;&nbsp;
                  </span>
                </b>
                <i
                  className="icofont icofont-plus openmodal"
                  style={{
                    cursor: "pointer"
                  }}
                ></i>
              </button>
            )}
          </Stack>
        </Stack>
      </div>
    </React.Fragment>
  );
};

export default OfferHeaderButtons;
