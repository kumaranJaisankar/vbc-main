import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import Webcam from "react-webcam";
import { Close } from "../../../constant";
import FormIconComponent from "../../utilitycomponents/formiconcomponent/FormIconComponent";

const Addressproof = (props) => {
  const [imageUploadAd, setImageUploadAd] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const Verticalcentermodaltoggle = () => {
    setIsOpen(false);
    setVerticalcenter(!Verticalcenter);
  };

  const webcamRef = React.useRef(null);
  const [imgSrcAadhProof, setImgSrcAadhProof] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const capture1 = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc1 = webcamRef.current.getScreenshot();
      setImgSrcAadhProof(imageSrc1);
    } else {
      setIsOpen(true);
    }
  }, [webcamRef, setImgSrcAadhProof]);

  async function UploadImageaadhproof (e)  {
    let imgaadhproof = URL.createObjectURL(e.target.files[0]);
    setImgSrcAadhProof(imgaadhproof);
    let preview = await getBase64(e.target.files[0]);

    console.log(preview,"aadhar");

    props.setFormData((preState) => ({
      ...preState,
      customer_documents: {
        ...preState.customer_documents,
        address_proof:  preview,
      },
    }));
  };

  useEffect(() => {
    setImageUploadAd(props.formData.customer_documents.address_proof);
  }, []);


  function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
  return (
      <FormGroup style={{ paddingTop: "15px" }} className="form-image-upload">
        <div>
        <FormIconComponent
          handleClearImageClick={(e) => {
            setImgSrcAadhProof(null);
            setImageUploadAd(null);
          }}
          iconName={imageUploadAd ? "addressImageUpload" : "addressProof"}
          textBelowIcon={"Add address proof"}
          onClick={Verticalcentermodaltoggle}
          imageData={imageUploadAd ? imageUploadAd : null}
          alt={"Aadhar"}
        />
        </div>
        <span className="errortext">{props.errors.address_proof}</span>
        &nbsp;&nbsp;
        <Modal
          isOpen={Verticalcenter}
          toggle={Verticalcentermodaltoggle}
          centered
        >
          <ModalBody>
            <Row>
              <Col>
                <span class="uploadimagekyc">
                  Upload Image
                  <Input
                  name="customer_documents.address_proof"
                    onChange={UploadImageaadhproof}
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
              <Col>
                <img src={imgSrcAadhProof} style={{ width: "200px" }} />
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Button color="primary" onClick={capture1}>
                  Capture photo
                </Button>
              </Col>
              <Col>
                {isOpen && (
                  <Webcam
                    width={200}
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                  />
                )}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={Verticalcentermodaltoggle}>
              {Close}
            </Button>
            <Button onClick={() => setImgSrcAadhProof(null)}> Clear</Button>
            <Button color="primary" 
            onClick= {() => {Verticalcentermodaltoggle()
              setImageUploadAd(imgSrcAadhProof)}}
            >
              Save
            </Button>
          </ModalFooter>
        </Modal>
      </FormGroup>
  );
};
export default Addressproof;
