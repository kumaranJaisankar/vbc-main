import React, { useState } from "react";
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
import { Close } from "../../../../constant";

const Idupload = (props) => {
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const Verticalcentermodaltoggle = () => {
    setIsOpen(false);
    setVerticalcenter(!Verticalcenter);
  };

  const webcamRef = React.useRef(null);
  const [imgSrcAadh, setImgSrcAadh] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const capture1 = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc1 = webcamRef.current.getScreenshot();
      setImgSrcAadh(imageSrc1);
    } else {
      setIsOpen(true);
    }
  }, [webcamRef, setImgSrcAadh]);

  const UploadImageaadh = (e) => {
    let imgaadh = URL.createObjectURL(e.target.files[0]);
    setImgSrcAadh(imgaadh);

    props.setFormData((preState) => ({
      ...preState,
      customer_documents: {
        ...preState.customer_documents,
        identity_proof: e.target.files[0],
      },
    }));
  };

  return (
    
      <FormGroup style={{ paddingTop: "15px" }}>
        <Button
          style={{ margin: "20px" }}
          color="primary"
          onClick={Verticalcentermodaltoggle}
        >
          Id Proof Upload
        </Button>
        {imgSrcAadh ? (
          <img
            src={imgSrcAadh}
            alt="Aadhar"
            style={{
              display: "inline-flex",
              margin: "0",
              border: "1px solid #ced4da",
              width: "150px",
            }}
          />
        ) : null}
        {/* <img src={imgSrcAadh} className="uploadstyle" /> */}
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
                  name="customer_documents.identity_proof"
                    onChange={UploadImageaadh}
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
                {/* <img src={imgSrcAadh} style={{ width: "200px" }} /> */}
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
            <Button onClick={() => setImgSrcAadh(null)}> Clear</Button>
            <Button color="primary" onClick={Verticalcentermodaltoggle}>
              Save
            </Button>
          </ModalFooter>
        </Modal>
      </FormGroup>
  );
};
export default Idupload;
