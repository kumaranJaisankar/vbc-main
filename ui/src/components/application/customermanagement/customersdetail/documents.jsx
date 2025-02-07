import React, { useEffect, useState } from "react";
import { Row, Col, Form, Label, FormGroup, Input, Spinner } from "reactstrap";
import { customeraxios } from "../../../../axios";
import { toast } from "react-toastify";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ADDRESSPROOF from "../../../../assets/images/addressproof.png";
import man from "../../../../assets/images/person_logo_icon.svg";
import CardMedia from "@mui/material/CardMedia";
import useFormValidation from "../../../customhooks/FormValidation";
const DocumentsList = (props) => {
  const [documents, setDocuments] = useState({});
  const [newDocuments, setNewDocuments] = useState({});
  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    customeraxios
      .get(`customers/get/documents/${props.lead.user.id}`)
      .then((res) => {
        setDocuments(res.data);
      });
  }, [props]);

  const handleChange = (e) => {
    setDocuments((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setNewDocuments((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitDocuments = () => {
    let data = { ...newDocuments };
    //  newDocuments.Aadhar_Card_No_1=newDocuments.Aadhar_Card_No;

    //  let data = {...newDocuments};

    // let data = {
    //   // adding id
    data.id = documents.id;
    // };//comment
    setDisable(true);
    customeraxios
      .patch("customers/get/documents/" + props.lead.user.id, data)
      .then((res) => {
        props.fetchComplaints();
        props.onUpdate(data);
        setDisable(false);
        toast.success("Customer Information edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.setIsdisabled(true);
      })
      .catch(function (error) {
        setDisable(false);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  // upload img

  async function UploadImage(e) {
    let preview = await getBase64(e.target.files[0]);

    setDocuments((preState) => ({
      ...preState,
      customer_pic_preview: preview,
      customer_pic: preview,
    }));
    setNewDocuments((prev) => ({
      ...prev,
      customer_pic_preview: preview,
      customer_pic: preview,
    }));
  }

  async function UploadImage1(e) {
    let preview = await getBase64(e.target.files[0]);

    setDocuments((preState) => ({
      ...preState,
      address_proof_preview: preview,
      address_proof: preview,
    }));
    setNewDocuments((prev) => ({
      ...prev,
      address_proof_preview: preview,
      address_proof: preview,
    }));
  }

  async function UploadImage2(e) {
    let preview = await getBase64(e.target.files[0]);

    setDocuments((preState) => ({
      ...preState,
      id_proof_preview: preview,
      identity_proof: preview,
    }));

    setNewDocuments((prev) => ({
      ...prev,
      id_proof_preview: preview,
      identity_proof: preview,
    }));
  }
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  // enabled Aadhar field by Marieya
  const requiredFields = ["pan_cards", "Aadhar_Card_No_Doc"];
  const { validate, Error } = useFormValidation(requiredFields);

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    let newareadata = { ...newDocuments };
    newareadata.pan_cards = newareadata.pan_card;
    newareadata.Aadhar_Card_No_Doc = newareadata.Aadhar_Card_No;
    const validationErrors = validate(newareadata);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      submitDocuments(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  return (
    <>
      {documents && (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Label className="desc_label">Signature</Label>
              <br />

              <img
                src={documents.signature_preview}
                style={{ height: "100px", width: "inherit" }}
              />
            </Col>

            <Col>
              <FormGroup style={{ marginTop: "7%" }}>
                <div className="input_wrap">
                  <input
                    type="text"
                    className={`form-control digits not-empty`}
                    name="Aadhar_Card_No"
                    style={{ border: "none", outline: "none" }}
                    value={documents.Aadhar_Card_No}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                  ></input>
                  <Label className="form_label">Aadhar Number</Label>
                </div>
                <span className="errortext">{errors.Aadhar_Card_No_Doc}</span>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup style={{ marginTop: "7%" }}>
                <div className="input_wrap">
                  <input
                    type="text"
                    onInput={(e) =>
                      (e.target.value = ("" + e.target.value).toUpperCase())
                    }
                    className={`form-control digits not-empty`}
                    name="pan_card"
                    style={{ border: "none", outline: "none" }}
                    value={documents.pan_card}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    // disabled={props.isDisabled}
                  ></input>
                  <Label className="form_label">PAN Card</Label>
                </div>
                <span className="errortext">{errors.pan_cards}</span>
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Label className="desc_label">ID Proof</Label>
              <br />
              {documents.id_proof_preview ? (
                <img
                  src={documents.id_proof_preview}
                  style={{ height: "140px" }}
                />
              ) : (
                <img src={ADDRESSPROOF} style={{ width: "50%" }} />
              )}
            </Col>
            <Col>
              <Label className="desc_label">Address Proof</Label>
              <br />
              {documents.address_proof_preview ? (
                <img
                  src={documents.address_proof_preview}
                  style={{ height: "140px" }}
                />
              ) : (
                <img src={ADDRESSPROOF} style={{ width: "50%" }} />
              )}
              &nbsp;
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <span class="uploadimagekyc">
                Re Upload
                <Input
                  name="identity_proof"
                  onChange={UploadImage2}
                  className="form-control"
                  accept="image/*"
                  type="file"
                  id="upload"
                  style={{
                    paddingTop: "3px",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    opacity: "0",
                    cursor: "pointer",
                  }}
                />
              </span>
            </Col>
            <Col>
              <span class="uploadimagekyc">
                Re Upload
                <Input
                  name="address_proof"
                  onChange={UploadImage1}
                  accept="image/*"
                  className="form-control"
                  type="file"
                  id="upload"
                  style={{
                    paddingTop: "3px",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    opacity: "0",
                    cursor: "pointer",
                  }}
                />
              </span>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Label className="desc_label">Customer Photo</Label>
              <br />
              {documents.customer_pic_preview ? (
                <img
                  src={documents.customer_pic_preview}
                  style={{ height: "140px" }}
                />
              ) : (
                <CardMedia
                  className="avatarProfilePicture"
                  component="img"
                  image={man}
                  alt=""
                  sx={{ width: 200, height: 200, border: "1px solid" }}
                />
              )}
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <span class="uploadimagekyc">
                Re Upload
                <Input
                  name="customer_pic"
                  onChange={UploadImage}
                  className="form-control"
                  accept="image/*"
                  type="file"
                  id="upload"
                  style={{
                    paddingTop: "3px",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    opacity: "0",
                    cursor: "pointer",
                  }}
                />
              </span>
            </Col>
          </Row>
          <br />

          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              id="save_button"
              disabled={disable}
            >
              {disable ? <Spinner size="sm"> </Spinner> : null}
              Save
            </Button>
          </Stack>
        </Form>
      )}
    </>
  );
};

export default DocumentsList;
