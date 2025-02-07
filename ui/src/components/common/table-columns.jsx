import React, { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Modal, ModalTitle, ModalContent, ModalActions } from "../../mui/modal";

const TableColumns = ({
  open,
  handleClose,
  columns,
  tableName,
  setColumnsToHide,
}) => {
  const [totalColumns, setTotalColumns] = useState(
    columns.map((item) => item.value)
  );

  const handleChange = useCallback(
    (target, value) => {
      const valuesSet = new Set(totalColumns);
      if (target.checked) {
        valuesSet.add(value);
      } else {
        valuesSet.delete(value);
      }
      setTotalColumns([...valuesSet]);
    },
    [totalColumns]
  );

  const handleSave = useCallback(() => {
    setColumnsToHide(totalColumns);
    handleClose();
  }, [totalColumns]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      sx={{ "& .MuiDialog-paper": { width: "30%", maxHeight: 435 } }}
    >
      <ModalTitle onClose={handleClose}>Show/Hide Columns</ModalTitle>
      <ModalContent dividers style={{fontSize:"12px"}}>
        {columns.map((column) => (
          <FormGroup key={column.value}>
            {column.value === "username" ||
            column.value === "register_mobile" ||
            column.value === "action" ||
            column.value === "acctstoptime" ||
            column.value === "link_preview" ||
            column.value === "download_link_preview" ||
            column.value === ""
            ? (
              ""
            ) : (
              <FormControlLabel
                control={
                  <Checkbox checked={totalColumns.includes(column.value)} />
                }
                onChange={({ target }) => handleChange(target, column.value)}
                label={column.name}
              />
            )}
          </FormGroup>
        ))}
      </ModalContent>
      <ModalActions>
        <Button
          variant="secondary"
          className="btn btn-secondary"
          onClick={handleClose}
          id="resetid"
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} id="save_button"> 
          Save
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default TableColumns;
