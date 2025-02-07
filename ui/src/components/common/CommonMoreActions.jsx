import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ACTION from "../../assets/images/circle.png"

const MoreActions = ({  }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // dropdown
  const onActionClickHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
     
      <img src={ACTION}  onClick={onActionClickHandler} className="action_Drop"/>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <>
          <MenuItem>
            <span className="more_actions1">{"No Actions"}</span>
          </MenuItem>
        </>
      </Menu>
    </>
  );
};

export default MoreActions;
