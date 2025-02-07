import React, { useState, useRef, useEffect } from "react";
import { classes } from "../../../../data/layouts";
import SignaturePad from "react-signature-canvas";
import {
  toggleSignatureUploadSideBar,
  handleChangeFormInput,
  handleChangeDisplayImage,
} from "../../../../redux/kyc-form/actions";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import {
  Row,
  Input,
  Label,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
} from "reactstrap";

import { connect } from "react-redux";

import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import isEmpty from 'lodash/isEmpty';

const SignatureUploadSideBar = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    handleChangeDisplayImage,
    handleChangeFormInput,
    documentName,
    closeCustomizer,
    customer_images
  } = props;
  const [checkedmodal, setCheckedmodal] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEpmtySignature, setIsEmptySignature] = useState(false);

  // const sigCanvas = () =>{
  //   useRef({});
  //   // setIsdisabled(false);
  // } 
  const sigCanvas = useRef({});
  const clear = () => {
    sigCanvas.current.clear();
    setIsEmptySignature(false)
  }

  // useEffect(()=>{
  //   if (!isEmpty(sigCanvas.current)) {
  //     if(sigCanvas.current.isEmpty()){
  //       setIsEmptySignature(true)
  //     }else{
  //       setIsEmptySignature(false)
  //     }
  //   }
  // },[sigCanvas])

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  //signature image save
  const save = () => {
    const signDataURL = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    setModal(false);
  
    closeCustomizer();
    handleChangeDisplayImage({ name: documentName, value: signDataURL });
    handleChangeFormInput({
      name: documentName,
      value: signDataURL,
      parent: props.parent,
    });
    setIsEmptySignature(false)
  };

  const toggle = () => {
    setModal(!modal);
  };

  const displayImage = customer_images[documentName];
  return (
    <div className="customizer-contain">
      <div className="tab-content" id="c-pills-tabContent">
        <div
          className="customizer-header"
          style={{border:"none", padding:"0px 25px", borderTopLeftRadius:"20px"}}
        >
          <br />
          <i className="icon-close" onClick={closeCustomizer}
          style={{
            marginTop: "18px",
            float: "right",
            marginRight: "31px",
            cursor: "pointer",
            color: "#000000",
            fontSize: "medium",
            fontWeight: "Bold",
          }}
          ></i>
          <br />
          <span className="terms_conditions">
            {" "}
            Terms And Conditions{" "}
          </span>
        </div>
        <div className=" customizer-body custom-scrollbar">
         
          <Row className="sign_text" style={{ paddingLeft: "3%", paddingRight: "30%" , paddingBottom:"4%"}}>
            <b>
              By accessing or using the Service you agree to be bound by these
              Terms. If you disagree with any part of the terms then you may not
              access the Service.
            </b>
          </Row>
          <Row style={{ paddingLeft: "3%", paddingRight: "30%", paddingBottom:"8%"  }}>
            <Label>
              <b style={{position:"relative" , top:"-6%"}}>1. Changes</b>
              <br />
              <span style={{position:"relative" , top:"0%"}}>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material we will try to
              provide at least 30 (change this)​ day's notice prior to any new
              terms taking effect. What constitutes a material change will be
              determined at our sole discretion.
                </span>              
              <br />
              <b style={{position:"relative" , top:"10%"}}>2.Purchases</b>
              <br />
              <span style={{position:"relative" , top:"15%"}}>
              If you wish to purchase any product or service made available
              through the Service ("Purchase"), you may be asked to supply
              certain information relevant to your Purchase including, without
              limitation
              </span>
             
              <br />
          
              <b style={{position:"relative" , top:"27%"}}>3.Contact Us</b>
              <br />
              <span style={{position:"relative" , top:"34%"}}>
              If you have any questions about these Terms, please contact us.
              </span>
            </Label>
          </Row>
          <br />
          <ul className="layout-grid layout-types" style={{ border: "none" }}>
            <li
              data-attr="compact-sidebar"
              onClick={(e) => handlePageLayputs(classes[0])}
            >
              <div className="layout-img">
                <div
                  className="checkbox checkbox-dark m-squar"
                  style={{
                    paddingLeft: "3%",
                    paddingRight: "30%",
                  }}
                >
                  <Input
                    id="inline-sqr-1"
                    type="checkbox"
                    checked={checkedmodal}
                    onClick={() => setCheckedmodal(!checkedmodal)}
                  />
                  <Label className="mt-0" for="inline-sqr-1">
                    I have read and agree to the Terms and Conditions
                  </Label>
                  <br />
                  <br />
                  <Row style={{marginTop:"-4%"}}>
          <span className="sign_border" style={{position:"relative",top:"0px"}}></span>

                    <Button
                      color="primary"
                      type="button"
                      style={{ marginTop: "-10px" }}
                      onClick={() => setModal(!modal)}
                      disabled={!checkedmodal}
                      id="accept_button"
                    >
                      Accept and Sign
                    </Button>
                  </Row>
                  {checkedmodal && modal ? (
                    
                    <div>
                      <Modal isOpen={modal} toggle={toggle} backdrop="static">
                      <ModalBody toggle={toggle}>
                      <h5>Signature</h5>
                          <hr/>
                        </ModalBody>

                        <SignaturePad ref={sigCanvas} onEnd={() => { setIsEmptySignature(true)}}/>

                        <ModalFooter>
                          <Button color="secondary" onClick={clear} id="resetid">
                            Clear
                          </Button>
                          <Button
                             color="primary"
                            style={{ backgroundColor: "#7366ff" }}
                            onClick={() => save()}
                            disabled={!isEpmtySignature}
                            id="save_button"
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </Modal>{" "}
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { customer_images } = state.KYCForm;
    return {
      customer_images
    };
  };


const mapDispatchToProps = (dispatch) => {
  return {
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
    handleChangeDisplayImage: (payload) =>
      dispatch(handleChangeDisplayImage(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignatureUploadSideBar);
