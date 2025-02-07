import React from "react";
import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import { toast } from "react-toastify";
import { networkaxios } from "../../../../axios";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


const DeleteModal = ({
  visible,
  handleVisible,
  isChecked,
  tokenAccess,
  setFiltereddata,
  setClearSelectedRows,
  setClearSelection,
  setIsChecked,
  selectedTab,
  setisDeleted,
  selecteddpradiobutton,
  setFailed,
  filteredData,
  Refreshhandler,
  serialNo,
  clearSelectedRows,
  clearSelection
}) => {
  // delete apii
  // const onDelete = async () => {
  //   let dat = { id: isChecked[0] };
  //   // let ser = {serial_no: isChecked[0]};
  //   setisDeleted(false);
  //   let deleteUrl = selectedTab;
  //   if (selectedTab == "dp") {
  //     deleteUrl = selecteddpradiobutton;
  //   }
  //   networkaxios
  //     .delete(`network/${deleteUrl}/delete`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${tokenAccess}`,
  //       },
  //       data: JSON.stringify(dat),
  //     })
  //     .then((data) => {
  //       if (data.status === 200) {
  //         toast.success("Sucessfully Deleted");
  //         Refreshhandler();
  //         var difference = [];
  //         if (Array.isArray(data) && data.length > 0) {
  //           difference = [...isChecked].filter((x) => dat.id === x);
  //           setFailed([...data]);
  //         } else if (!Array.isArray(data)) {
  //           toast.error(data);
  //         } else {
  //           difference = [...isChecked];
  //         }
  //         setFiltereddata((prevState) => {
  //           var newdata = prevState.filter(
  //             (el) => difference.indexOf(el.id) === -1
  //           );
  //           return newdata;
  //         });
  //         setisDeleted(true);
  //         handleVisible();
  //         setClearSelectedRows(true);
  //         setIsChecked([]);
  //         setClearSelection(true);
  //         if (data.length > 0) {
  //         }
  //       }
  //     })
  //     .catch((e) => {
  //       toast.error("error delete");
  //     });
  // };
  const noDelete = () => {
    setClearSelectedRows(!clearSelectedRows);
    setClearSelection(!clearSelection);
  };
  const onDelete = async () => {
    let dat = { id: isChecked[0] };
    setisDeleted(false);
    let deleteUrl = selectedTab;
    if (selectedTab == "dp") {
      deleteUrl = selecteddpradiobutton;
    }
    networkaxios
      .delete(`network/${deleteUrl}/delete`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenAccess}`,
        },
        data: JSON.stringify(dat),
      })
      .then((data) => {
        if (data.status === 200) {
          toast.success("Sucessfully Deleted");
          Refreshhandler();
          var difference = [];
          if (Array.isArray(data) && data.length > 0) {
            difference = [...isChecked].filter((x) => dat.id === x);
            setFailed([...data]);
          } else if (!Array.isArray(data)) {
            toast.error(data);
          } else {
            difference = [...isChecked];
          }
          setFiltereddata((prevState) => {
            var newdata = prevState?.results?.filter(
              (el) => difference.indexOf(el.id) === -1
            );
            return {
              ...prevState,
              results: newdata
            };
          });
          setisDeleted(true);
          handleVisible();
          setClearSelectedRows(true);
          setIsChecked([]);
          setClearSelection(true);
          if (data.length > 0) {
          }
        }
      })
      .catch((e) => {
        toast.error("error delete");
      });
  };

  return (
    <Modal isOpen={visible} toggle={handleVisible} centered>
<ModalHeader toggle={handleVisible}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <HighlightOffIcon color="error" fontSize="inherit" style={{ fontSize: 25, marginRight: '10px' }} />
    Delete Confirmation
  </div>
</ModalHeader>      <ModalBody>
        {isChecked.map((id) => (
          <div>
            <p className="delete-font">
              You are about to delete {" "}
              <strong>
                {selectedTab.toUpperCase()}
                {id}
              </strong>{" "}
              device with Serial No <strong>{serialNo}</strong>.
            </p>
          </div>
        ))}
      </ModalBody>

      <ModalFooter>
        <div>
          <Button
            color="secondary"
            // onClick={handleVisible}
            onClick={() => {
              handleVisible();
              noDelete();
            }}
            id="resetid"
            style={{ marginRight: "10px" }}
          >
            Close
          </Button>
          <Button id="yes_button" onClick={() => onDelete()} style={{width: 'max-content'}}>
            Delete
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
