import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Label, Input ,Spinner} from "reactstrap";
// import {Globe} from "feather-icons";
import { default as axiosBaseURL, helpdeskaxios } from "../../../../axios";
import useFormValidation from "../../../customhooks/FormValidation";
// import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { ADMINISTRATION } from "../../../../utils/permissions";
import ErrorModal from "../../../common/ErrorModal";
import { Sorting } from "../../../common/Sorting";


var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const SubCateDetails = (props) => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
   //to disable button
   const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  const [selectCategory, setSelectCategory] = useState([]);

  useEffect(() => {
    setLeadUser(props.lead);
    setDisable(false)
  }, [props.lead]);

  useEffect(() => {
    setLeadUser(props.lead);
    setIsdisabled(true);
    setDisable(false)
  }, [props.rightSidebar]);

  useEffect(() => {
    axiosBaseURL
      .get("accounts/department/list")
      // .then((res) => setData(res.data))
      .then((res) => {
        // console.log(res);
        setLeadUser(res.data);
      });
  }, []);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value.charAt(0).toUpperCase() +  e.target.value.slice(1) }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };



  // const handleSubmit = (e, id) => {
  //   // if (e.key === "Enter" || e.key === "NumpadEnter") {
  //   e.preventDefault();
  //   helpdeskaxios.patch(`rud/${id}/ticket/subcategory`, leadUser).then((res) => {
  //     console.log(res);
  //     console.log(res.data);
  //     props.onUpdate(res.data);
  //     setIsdisabled(true);
  //   });
  //   // }
  // };
  const subcateDetails = (id) => {
    setDisable(true)
    setIsdisabled(true);
    if (!isDisabled) {
      helpdeskaxios
        .patch(`rud/${id}/ticket/subcategory`, leadUser)
        .then((res) => {
          setDisable(false)
          console.log(res);
          console.log(res.data);
          props.onUpdate(res.data);
          // Modified by Marieya
          // toast.success("Ticket subcategory was added successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setShowModal(true);
          setModalMessage("Ticket subcategory was edited successfully");
          setIsdisabled(true);
          props.Refreshhandler();
        })
        // .catch(function (error) {
        //   setDisable(false)
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        //   console.error("Something went wrong!", error);
        // });
        .catch(function (error) {
          const errorString = JSON.stringify(error);
          const is500Error = errorString.includes("500");
          const is400Error = errorString.includes("400");
          
          setDisable(false)
          setIsdisabled(false);
          if (is500Error) {
            setModalMessage("Internal Server Error");
          } else if (is400Error) {
            setModalMessage("Something went wrong");
          } else {
            setModalMessage("Something went wrong");
          }
          setShowModal(true);
          console.error("Something went wrong", error);
        });        
      // }
    }
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
 {/*Added new keyname for priority name by Marieya*/}
 let newinputsData = { ...leadUser }
 newinputsData.sub_category_name = newinputsData.name
    const validationErrors = validate(newinputsData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      subcateDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
  };

  const requiredFields = ["sub_category_name"];
  const { validate, Error } = useFormValidation(requiredFields);

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  useEffect(()=>{
    if(props.openCustomizer){
      setErrors({});
    }
  }, [props.openCustomizer]);


  useEffect(() => {
    helpdeskaxios
      .get(`list/category`)
      .then((res) => {
        // setSelectCategory([...res.data]);
        // Sailaja sorting the Admin/ Sub Category(Edit Panel)-> Category Dropdown data as alphabetical order on 24th March 2023  
      setSelectCategory(Sorting([...res?.data],'category'));
      })
      .catch((error) => {
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is400Error = errorString.includes("400");
  
        if (is500Error) {
            setModalMessage("Internal Server Error");
        } else if (is400Error) {
            setModalMessage("Something went wrong");
        }
        setShowModal(true); 
      });
    }, []);
  return (
    <Fragment>
      {token.permissions.includes(ADMINISTRATION.TICKETSUBCATUPDATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "8px", right: "64px" }} id="edit_icon"
          onClick={clicked}
        />
      )}
      <br />
      <Container fluid={true}>
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row style={{marginTop:"3%"}}>
            <Col md="4" id="moveup">
              <div className="input_wrap">
                {/* <Label>Name</Label> */}
                <Label className="kyc_label">Sub Category *</Label>
                <Input
                  // className={`form-control digits not-empty`}
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="text"
                  name="name"
                  style={{
                    border: "none",
                    outline: "none",
                    textTransform: "capitalize",
                  }}
                  value={leadUser && leadUser.name}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={isDisabled}
                />

              </div>
              <span className="errortext">{errors.sub_category_name}</span>
            </Col>
            <Col md="4" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Category *</Label>
                <select
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="select"
                  name="ticket_category"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.ticket_category}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={isDisabled}
                >
                  {selectCategory.map((leadtype) => {
                    if (!!leadtype && leadUser && leadUser.ticket_category) {
                      return (
                        <option
                          key={leadtype.id}
                          value={leadtype.id}
                          selected={
                            leadtype.id == leadUser.ticket_category.id ? "selected" : ""
                          }
                        >
                          {leadtype.category}
                        </option>
                      );
                    }
                  })}
                </select>
             
              </div>
            </Col>
          </Row>
          <Row style={{marginTop:"-2%"}}>
          <span className="sidepanel_border" style={{position:"relative", top:"25px"}}></span>

          </Row>
          <br />
          <button type="submit" name="submit" class="btn btn-primary" id="save_button" disabled={isDisabled}>
          {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp;
          &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            onClick={props.dataClose}
            id="resetid"
          >
            Cancel
          </button>
        </Form>
        <ErrorModal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          message={modalMessage}
          action={() => setShowModal(false)}
        />
      </Container>
    </Fragment>
  );
};

export default SubCateDetails;
