import React, { useState, useCallback, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../../mui/accordian";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { ModalFooter, ModalBody, Modal } from "reactstrap";
import MUIButton from "@mui/material/Button";
import man from "../../../../assets/images/person_logo_icon.svg";
import CardMedia from "@mui/material/CardMedia";
import ADDRESSPROOF from "../../../../assets/images/addressproof.png"
import { customeraxios } from "../../../../axios";
const DocumentsInfo = ({ user,DocprofileDetails}) => {
  // const [profileDetails, setProfileDetails] = useState(null);
  const [expanded, setExpanded] = React.useState("panel6");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  //   Modal


  const [openDocumentmodal1, setOpenDocumentmodal1] = useState(false);
  const openDoumentImgModal1 = () => setOpenDocumentmodal1(!openDocumentmodal1);

  const [openDocumentmodal2, setOpenDocumentmodal2] = useState(false);
  const openDoumentImgModal2 = () => setOpenDocumentmodal2(!openDocumentmodal2);
  const [openDocumentmodal3, setOpenDocumentmodal3] = useState(false);
  const openDoumentImgModal3 = () => setOpenDocumentmodal3(!openDocumentmodal3);

  const [openDocumentmodal4, setOpenDocumentmodal4] = useState(false);
  const openDoumentImgModal4 = () => setOpenDocumentmodal4(!openDocumentmodal4);


  const profileDetails = DocprofileDetails?.customer_documents


  console.log(user, "user")
  return (
    <Accordion
      style={{
        borderRadius: "15px",
        boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)"
        , flex: "0 0 100%"
      }}
      expanded={expanded === "panel6"}
      onChange={handleChange("panel6")}
    >
      <AccordionSummary aria-controls="panel1a-content" id="last-invoice-info">
        <Typography
          variant="h6"
          className="customerdetailsheading"
        >
          Documents
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="6" lg="6" xl="6">
            <p className="cust_details">Customer Picture</p>
          </Grid>
          <Grid item md="6" lg="6" xl="6" id="eyeicon_alignment" sx={{ textAlign: "end" }}>
            <a
              href={
                profileDetails &&
                  profileDetails.customer_pic_preview
                  ? profileDetails &&
                  profileDetails.customer_pic_preview
                  : " "
              }
              download
            >
              <i className="fa fa-download" style={{ color: "#285295 " }}></i>
            </a>
            &nbsp;&nbsp;&nbsp;
            <i className="fa fa-eye" style={{ color: "#285295 " }} onClick={openDoumentImgModal1}></i>
            <Modal isOpen={openDocumentmodal1} toggle={openDoumentImgModal1} centered>
              <ModalBody style={{ textAlign: "center" }}>
                {profileDetails &&
                  profileDetails.customer_pic_preview ? <img className="documentsCustomerProofs"
                    src={
                      profileDetails &&
                        profileDetails.customer_pic_preview
                        ? profileDetails &&
                        profileDetails.customer_pic_preview
                        : " "
                    }
                    alt={"Customer proof"}
                /> : <CardMedia
                  className="avatarProfilePicture"
                  component="img"
                  image={man}
                  alt=""
                  sx={{ width: 200, height: 200 }}
                />}


              </ModalBody>
              <ModalFooter>
                <MUIButton variant="contained" onClick={openDoumentImgModal1} id="yes_button">
                  Ok
                </MUIButton>
              </ModalFooter>
            </Modal>
          </Grid>
          {/* <Grid item md="6" lg="5" xl="3" id="eyeicon_alignment">
            <img
              src={
                props.profileDetails &&
                props.profileDetails.customer_pic_preview
                  ? props.profileDetails &&
                    props.profileDetails.customer_pic_preview
                  : " "
              }
              alt={"Customer proof"}
              style={{ width: "100px" }}
            />
          </Grid> */}
        </Grid>
        <br />
        <Grid spacing={1} container sx={{ mb: "5px", position: "relative", top: "-34px" }}>
          <Grid item md="6" lg="6" xl="6">
            <p className="cust_details">Signature</p>
          </Grid>
          <Grid item md="6" lg="6" xl="6" id="eyeicon_alignment" sx={{ textAlign: "end" }}>
            <a
              href={
                profileDetails && profileDetails.signature_preview
                  ? profileDetails &&
                  profileDetails.signature_preview
                  : " "
              }
              download
            >
              <i className="fa fa-download" style={{ color: "#285295 " }}></i>
            </a>
            &nbsp;&nbsp;&nbsp;
            <i className="fa fa-eye" style={{ color: "#285295 " }} onClick={openDoumentImgModal2}></i>
            <Modal isOpen={openDocumentmodal2} toggle={openDoumentImgModal2} centered>
              <ModalBody style={{ textAlign: "center" }}>
                {profileDetails &&
                  profileDetails.signature_preview ? <img className="documentsCustomerProofs"
                  src={
                    profileDetails &&
                      profileDetails.signature_preview
                      ? profileDetails &&
                      profileDetails.signature_preview
                      : " "
                  }
                  alt={"Signature proof"}
                /> : <CardMedia
                  className="avatarProfilePicture"
                  component="img"
                  image={man}
                  alt=""
                  sx={{ width: 200, height: 200 }}
                />}


              </ModalBody>
              <ModalFooter>
                <MUIButton variant="contained" onClick={openDoumentImgModal2} id="yes_button">
                  Ok
                </MUIButton>
              </ModalFooter>
            </Modal>
          </Grid>
          {/* <Grid item md="6" lg="5" xl="3">
            <img
              src={
                props.profileDetails && props.profileDetails.signature_preview
                  ? props.profileDetails &&
                    props.profileDetails.signature_preview
                  : " "
              }
              alt={"Signature proof"}
              style={{ width: "100px" }}
            />
          </Grid> */}
        </Grid>
        <Grid spacing={1} container sx={{ mb: "5px", position: "relative", top: "-16px" }}>
          <Grid item md="6" lg="6" xl="6">
            <p className="cust_details">Address Proof</p>
          </Grid>
          <Grid item md="6" lg="6" xl="6" id="eyeicon_alignment" sx={{ textAlign: "end" }}>
            <a
              href={
                profileDetails &&
                  profileDetails.address_proof_preview
                  ? profileDetails &&
                  profileDetails.address_proof_preview
                  : " "
              }
              download
            >
              <i className="fa fa-download" style={{ color: "#285295 " }}></i>
            </a>
            &nbsp;&nbsp;&nbsp;
            <i className="fa fa-eye" style={{ color: "#285295 " }} onClick={openDoumentImgModal3}></i>
            <Modal isOpen={openDocumentmodal3} toggle={openDoumentImgModal3} centered>
              <ModalBody style={{ textAlign: "center" }}>
                {profileDetails &&
                  profileDetails.address_proof_preview ?
                  <img className="documentsCustomerProofs"
                    src={
                      profileDetails &&
                        profileDetails.address_proof_preview
                        ? profileDetails &&
                        profileDetails.address_proof_preview
                        : " "
                    }
                    alt={"Address proof"}
                  /> : <img src={ADDRESSPROOF} style={{ width: "50%" }} />}


              </ModalBody>
              <ModalFooter>
                <MUIButton variant="contained" onClick={openDoumentImgModal3} id="yes_button">
                  Ok
                </MUIButton>
              </ModalFooter>
            </Modal>
          </Grid>
          {/* <Grid item md="6" lg="5" xl="3" id="eyeicon_alignment">
            <img
              src={
                props.profileDetails &&
                props.profileDetails.address_proof_preview
                  ? props.profileDetails &&
                    props.profileDetails.address_proof_preview
                  : " "
              }
              alt={"Address proof"}
              style={{ width: "100px" }}
            />
          </Grid> */}
        </Grid>
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="6 " lg="6" xl="6">
            <p className="cust_details">ID Proof</p>
          </Grid>
          <Grid item md="6" lg="6" xl="6" id="eyeicon_alignment" sx={{ textAlign: "end" }}>
            <a
              href={
                profileDetails && profileDetails.id_proof_preview
                  ? profileDetails &&
                  profileDetails.id_proof_preview
                  : " "
              }
              download
            >
              <i className="fa fa-download" style={{ color: "#285295 " }}></i>
            </a>
            &nbsp;&nbsp;&nbsp;
            <i className="fa fa-eye" style={{ color: "#285295 " }} onClick={openDoumentImgModal4}></i>
            <Modal isOpen={openDocumentmodal4} toggle={openDoumentImgModal4} centered>
              <ModalBody style={{ textAlign: "center" }}>
                {profileDetails &&
                  profileDetails?.id_proof_preview ?
                  <img className="documentsCustomerProofs"
                    src={
                      profileDetails &&
                      profileDetails?.id_proof_preview
                    }
                    alt={"Id proof"}
                  /> : <img src={ADDRESSPROOF} style={{ width: "50%" }} />
                }
              </ModalBody>
              <ModalFooter>
                <MUIButton variant="contained" onClick={openDoumentImgModal4} id="yes_button">
                  Ok
                </MUIButton>
              </ModalFooter>
            </Modal>
          </Grid>
          {/* <Grid item md="6" lg="5" xl="3" id="eyeicon_alignment">
            <img
              src={
                props.profileDetails && props.profileDetails.id_proof_preview
                  ? props.profileDetails &&
                    props.profileDetails.id_proof_preview
                  : " "
              }
              alt={"Id proof"}
              style={{ width: "100px" }}
            />
          </Grid> */}
        </Grid>

      </AccordionDetails>
    </Accordion>
  );
};

export default DocumentsInfo;



