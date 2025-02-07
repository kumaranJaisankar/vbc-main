import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import { toast } from "react-toastify";
import { default as axiosBaseURL } from "../../../axios";

const DeleteModal = ({ visible, handleVisible, isChecked, tokenAccess, setFiltereddata,
  setClearSelectedRows, setClearSelection, setIsChecked, notOpenLeadIdsForDelete }) => {

  // delete api
  const onDelete = () => {
    let newisChecked = [...isChecked];
    let newnotOpenLeadIdsForDelete = [...notOpenLeadIdsForDelete];
    const finalIds = newisChecked.filter(
      (id) => !newnotOpenLeadIdsForDelete.includes(id)
    );

    let dat = { ids: finalIds };
    axiosBaseURL.delete(`radius/lead/delete/multiple`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenAccess}`,
        },
        data: JSON.stringify(dat),
      })
      .then((data) => {
        var difference = [];
        if (data.length > 0) {
          difference = [...finalIds].filter((x) => data.indexOf(x) === -1);
        } else {
          difference = [...finalIds];
        }
        setFiltereddata((prevState) => {
          var newdata = prevState.filter(
            (el) => difference.indexOf(el.id) === -1
          );
          return newdata;
        });
        handleVisible();
        setClearSelectedRows(true);
        setIsChecked([]);

        setClearSelection(true);
        if (data.length > 0) {
        }
        toast.success('delete successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        })
      }).catch(() => {
        toast.error('fail to delete', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        })
      })
  };


  return (
    <Modal
      isOpen={visible}
      toggle={handleVisible}
      centered
    >
      <ModalHeader toggle={handleVisible}>
        Confirmation
      </ModalHeader>
      <ModalBody>
        <div>
          {isChecked.map((id) => (
            <p>
              {" "}
              <span>L{id},</span>
              {notOpenLeadIdsForDelete.includes(id) && (
                <span className="errortext">
                  You can't delete this leads because already assigned
                </span>
              )}
            </p>
          ))}
        </div>
        <p>Are you sure you want to delete?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleVisible}>
          Close
        </Button>
        <Button color="primary" onClick={() => onDelete()}>
          Yes
        </Button>
      </ModalFooter>
    </Modal>)
};

export default DeleteModal;
