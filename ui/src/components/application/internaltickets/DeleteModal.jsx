import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
  } from "reactstrap";
  import { toast } from "react-toastify";
  import { helpdeskaxios} from "../../../axios";

const DeleteModal = ({visible, handleVisible, isChecked, tokenAccess, setFiltereddata, setClearSelectedRows,setClearSelection,setIsChecked}) =>{

    // delete api
    const onDelete = () => {
      let dat = { ids: isChecked };
      helpdeskaxios
      .delete(`delete/tickets`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenAccess}`,
        },
        data: JSON.stringify(dat),
      })
        .then((data) => {
          var difference = [];
          if (data.length > 0) {
            difference = [...isChecked].filter((x) => data.indexOf(x) === -1);
          } else {
            difference = [...isChecked];
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
          toast.success("Record Delete Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose:1000
          })
        }).catch((err) => {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose:1000
          });
        });
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
                      <span>T{id},</span>
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
