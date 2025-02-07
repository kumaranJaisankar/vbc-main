import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import { connect } from "react-redux";
import Webcam from "react-webcam";
import {
  toggleImageUploadModal1,
  handleChangeFormInput,
  handleChangeDisplayImage1,
  handleChangeFormInput1,
} from "../../../../redux/kyc-form/actions";
import { Close } from "../../../../constant";

//Compressed image sizes
const MAX_WIDTH = 320;
const MAX_HEIGHT = 180;
const MIME_TYPE = "image/jpeg";
const QUALITY = 1;

const PhotoUploadModal1 = (props) => {
  const {
    showImageUploadModal1,
    toggleImageUploadModal1,
    handleChangeFormInput,
    handleChangeDisplayImage1,
    handleChangeFormInput1,
    documentName,
    displayImages,
  } = props;

  const webcamRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [imageToSave, setImageToSave] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    displayImages[documentName]
  );

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  function getBase64UsingCanvas(src, outputFormat) {
    const blobURL = URL.createObjectURL(src);
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = blobURL;
    let dataURL;
    img.onload = function () {
      URL.revokeObjectURL(this.src);
      const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
      var canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      //To view the compressed image size in UI
      /*canvas.toBlob(
        (blob) => {
          // Handle the compressed image. es. upload or save in local state
          displayInfo("Original file", src);
          displayInfo("Compressed file", blob);
        },
        MIME_TYPE,
        QUALITY
      );
      document.getElementById("root").append(canvas);
      */
      

      dataURL = canvas.toDataURL(outputFormat, QUALITY);

      //Setting compressed image to save
      setImageToSave(dataURL);
    };

    // img.src = src;
    // if (img.complete || img.complete === undefined) {
    //   img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    //   img.src = src;
    // }
  }

  async function UploadImage(e) {
    const file = e.target.files[0];
    const blobURL = URL.createObjectURL(file);
    setSelectedImage(blobURL);

    /*
    //Create an helper image object and use the blob URL as source
    const img = new Image();
    img.src = blobURL;
    img.onerror = function () {
      URL.revokeObjectURL(this.src);
      // Handle the failure properly
      console.log("Cannot load image");
    };

    //Use the onload callback to process the image
    let canvas;
    img.onload = function () {
      URL.revokeObjectURL(this.src);
      const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
      canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

    //   canvas.toBlob(
    //     (blob) => {
    //       // Handle the compressed image. es. upload or save in local state
    //       displayInfo('Original file', file);
    //       displayInfo('Compressed file', blob);
    //     },
    //     MIME_TYPE,
    //     QUALITY
    //   );
    //   document.getElementById("root").append(canvas);

    };
    */

    // const preview = await getBase64(file);
    // setImageToSave(preview);

    //Compressed image
    // const canvasPreview = getBase64UsingCanvas(file, MIME_TYPE);
    // setImageToSave(canvasPreview);
    
    //Compressed image and save
    getBase64UsingCanvas(file, MIME_TYPE);
  }

  function calculateSize(img, maxWidth, maxHeight) {
    let width = img.width;
    let height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }
    return [width, height];
  }

  // Utility functions for demo purpose

  function displayInfo(label, file) {
    const p = document.createElement("p");
    p.innerText = `${label} - ${readableBytes(file.size)}`;
    document.getElementById("root").append(p);
  }

  function readableBytes(bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  }

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageCaptured = webcamRef.current.getScreenshot();
      setSelectedImage(imageCaptured);
      setImageToSave(imageCaptured);
    } else {
      setIsOpen(true);
    }
  }, [webcamRef, setSelectedImage, showImageUploadModal1]);

  const toggleModalOpenClose = () => {
    setIsOpen(false);
    toggleImageUploadModal1();
  };

  const handleSaveImage = (e) => {
    let imageCaptured = null;
    if (webcamRef.current) {
       imageCaptured = webcamRef.current.getScreenshot();
      setSelectedImage(imageCaptured);
      setImageToSave(imageCaptured);
      handleChangeDisplayImage1({ name: documentName, value: imageCaptured });
      handleChangeFormInput1({ name: documentName, value: imageCaptured, parent: props.parent });
    }else{
      handleChangeDisplayImage1({ name: documentName, value: selectedImage});
    handleChangeFormInput1({ name: documentName, value: imageToSave, parent: props.parent });
    }
    toggleImageUploadModal1();

  };

  const handleClearImage = (e) => {
    setSelectedImage(null);
    setImageToSave(null);
  };

  return (
    <Modal isOpen={showImageUploadModal1} toggle={toggleModalOpenClose} centered>
      <ModalBody>
        <Row>
          <Col>
            <span class="uploadimagekyc">
              Upload Image
              <Input
                name={"address_proof"}
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
          <Col>
            <img
              src={selectedImage}
              style={{ width: "200px" }}
              className="imgsrc"
            />

          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Button color="" onClick={capture} id="captureimagekyc">
              Capture Photo
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
        <Button color="secondary" onClick={toggleImageUploadModal1} id="resetid">
          {Close}
        </Button>
        <Button onClick={(e) => handleClearImage(e)} id="resetid"> Clear</Button>
        <Button color="primary" onClick={(e) => handleSaveImage(e)}id="save_button" >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { showImageUploadModal1, customer_images } = state.KYCForm;
  return {
    showImageUploadModal1,
    displayImages: customer_images,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleImageUploadModal1: () => dispatch(toggleImageUploadModal1()),
    handleChangeFormInput1: (payload) =>
      dispatch(handleChangeFormInput1(payload)),
    handleChangeDisplayImage1: (payload) =>
      dispatch(handleChangeDisplayImage1(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoUploadModal1);
