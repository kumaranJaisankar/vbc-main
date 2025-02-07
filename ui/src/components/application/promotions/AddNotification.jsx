import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  ModalFooter,
} from "reactstrap";
import { FileText, Target, Calendar } from "react-feather";
import axios, { adminaxios } from "../../../axios";
import { toast } from "react-toastify";
import { Sorting } from "../../common/Sorting";

function AddNotification(props) {
  const [schedulType, setScheduleType] = useState("ONE-TIME-TASK");
  const [notifiInfo, setNotifiInfo] = useState({});
  const [isRequired, setIsRequired] = useState(false);
  const [showModal, setModal] = useState(false);
  const [reportsbranch, setReportsbranch] = useState([]);
  const [franchiseList, setFranchiseList] = useState([]);
  const [imgPreview, setImgPreview] = useState("");
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // setReportsbranch([...res.data]);
        // Sailaja sorting the Finance-> Billing History -> Branch Dropdown data as alphabetical order on 28th March 2023
        setReportsbranch(Sorting([...res.data], "name"));
      })
      .catch((err) => console.log(err));
  }, []);

  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        console.log(response.data, "data");
        // setOnfilterbranch(response.data);
        // Sailaja sorting the  Customer List Franchise Dropdown data as alphabetical order on 24th March 2023
        setFranchiseList(Sorting(response?.data, "name"));
        // console.log(setOnfilterbranch, "data");
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const MAX_WIDTH = 320;
  const MAX_HEIGHT = 180;
  const MIME_TYPE = "image/jpeg";
  const QUALITY = 1;
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
      // return dataURL;
      //Setting compressed image to save
      // setImageToSave(dataURL);
      setNotifiInfo({
        ...notifiInfo,
        ["image"]: dataURL,
      });
    };
    return img.onload;
  }

  const handleForm = async (e) => {
    if (
      e.target.name === "title_message" ||
      e.target.name === "body" ||
      e.target.name === "topic" ||
      e.target.name === "date" ||
      e.target.name === "time" ||
      e.target.name === "branch" ||
      e.target.name === "franchise"
    ) {
      setNotifiInfo({ ...notifiInfo, [e.target.name]: e.target.value });
    }
    if (e.target.name === "image") {
      console.log(e.target.files[0].name);
      let file = e.target.files[0];
      // let preview = await getBase64(e.target.files[0]);
      getBase64UsingCanvas(file, MIME_TYPE);

      // setNotifiInfo({
      //   ...notifiInfo,
      //   [e.target.name]: imgPreview,
      // });
    }
  };

  const branchname = (id) => {
    var getName = reportsbranch.filter((e) => {
      if (e.id == id) {
        return e.name;
      }
    });
    return getName[0].name;
  };

  const setNotification = async () => {
    var body = {
      title: notifiInfo.title_message,
      body: notifiInfo.body,

      topic:
        notifiInfo.franchise === "ALL"
          ? `${branchname(notifiInfo.branch)}_ALL`
          : `${notifiInfo.franchise}_ALL`,
      scheduled_date: `${notifiInfo.date} ${notifiInfo.time}`,
      task_type: schedulType,
      image: notifiInfo.image ? notifiInfo.image : "",
      // created_by: 19521,
    };
    axios
      .post("/radius/push/notification/schedule/create", body)
      .then(function (response) {
        toast.success("Scheduled notification successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        setModal(false);
        props.closeCustomizer();
        setNotifiInfo({});
        console.log(response);
      })
      .catch(function (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        console.log(error);
      });
  };

  const publichNotification = () => {
    if (
      notifiInfo.title_message &&
      notifiInfo.body &&
      notifiInfo.date &&
      notifiInfo.time &&
      notifiInfo.branch &&
      notifiInfo.franchise
    ) {
      setIsRequired(false);
      setModal(true);
    } else {
      setIsRequired(true);
    }
  };

  return (
    <FormGroup row>
      <Col md="3">
        <Label className="d-block kyc_label" for="edo-ani1">
          Notification title*
        </Label>
        <Input
          id="edo_ani1"
          name={"title_message"}
          placeholder="Enter notification title"
          value={notifiInfo.title_message ? notifiInfo.title_message : ""}
          onChange={(e) => handleForm(e)}
        />
        {isRequired && !notifiInfo.title_message && (
          <span style={{ color: "red", fontSize: "10px" }}>
            *required notification title
          </span>
        )}
      </Col>
      <br />
      <Col md="4">
        <Label className="d-block kyc_label" for="edo-ani2">
          Notification text*
        </Label>
        <Input
          id="edo_ani2"
          name={"body"}
          value={notifiInfo.body ? notifiInfo.body : ""}
          placeholder="Enter notification text"
          onChange={(e) => handleForm(e)}
        />
        {isRequired && !notifiInfo.body && (
          <span style={{ color: "red", fontSize: "10px" }}>
            *required notification text
          </span>
        )}
      </Col>
      <br />
      {/* <Col md="3">
        <FormGroup>
          <Label for="exampleSelect">Audience type</Label>
          <Input
            id="exampleSelect"
            name="topic"
            value={notifiInfo.topic ? notifiInfo.topic : ""}
            placeholder="Select audience type"
            type="select"
            onChange={(e) => handleForm(e)}
          >
            <option value={""}></option>
            <option value={"vbc_users"}>All customers</option>
            {/* <option value={"view"}>Franchise users</option> 
          </Input>
          {isRequired && !notifiInfo.topic && (
            <span style={{ color: "red", fontSize: "10px" }}>
              *required audience type
            </span>
          )}
        </FormGroup>
      </Col> */}
      <Col sm="2">
        <FormGroup>
          <div className="input_wrap">
            <Label className="kyc_label">Branch*</Label>
            <Input
              type="select"
              name="branch"
              className="form-control digits"
              onChange={(e) => {
                getlistoffranchises(e.target.value);
                handleForm(e);
                console.log(e.currentTarget);
                // handleInputChange(e);
                // props.handleBranchSelect(e);
              }}
              value={notifiInfo.branch ? notifiInfo.branch : ""}
            >
              <option style={{ display: "none" }}></option>
              {!reportsbranch && <option value={"ALL"}>All</option>}
              {reportsbranch.map((branchreport) => (
                <>
                  <option key={branchreport.id} value={branchreport.id}>
                    {branchreport.name}
                  </option>
                </>
              ))}
            </Input>
            {isRequired && !notifiInfo.branch && (
              <span style={{ color: "red", fontSize: "10px" }}>
                *required branch
              </span>
            )}
          </div>
        </FormGroup>
      </Col>

      <Col sm="2">
        <FormGroup>
          <div className="input_wrap">
            <Label className="kyc_label">Franchise*</Label>
            <Input
              type="select"
              name="franchise"
              className="form-control digits"
              onChange={(e) => {
                handleForm(e);
              }}
              value={notifiInfo.franchise ? notifiInfo.franchise : ""}
            >
              <option style={{ display: "none" }}></option>
              <option value={"ALL"}>All</option>
              {franchiseList.map((reportonfranchise) => (
                <option
                  key={reportonfranchise.id}
                  value={reportonfranchise.name}
                >
                  {reportonfranchise.name}
                </option>
              ))}
            </Input>
            {isRequired && !notifiInfo.franchise && (
              <span style={{ color: "red", fontSize: "10px" }}>
                *required fracnhise
              </span>
            )}
          </div>
        </FormGroup>
      </Col>

      <Col md="4">
        <Label
          style={{ marginTop: "10px" }}
          for="exampleFile"
          className="kyc_label"
        >
          Notification image(optional)
        </Label>

        <Input
          style={{ marginBottom: "15px" }}
          id="exampleFile"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleForm}
        />
      </Col>
      <Col md="3">
        {" "}
        {notifiInfo.image && (
          <img
            alt="preview"
            src={notifiInfo.image}
            width={250}
            height={150}
            style={{ marginTop: "10px" }}
          />
        )}
      </Col>
      <br />
      <Col md="12">
        <Divider />
      </Col>
      <br />
      <Col md="5">
        <div>
          <Label for="select" className="kyc_label">
            Task type*
          </Label>

          <Input
            id="select"
            name="select"
            type="select"
            onChange={(e) => {
              setScheduleType(e.target.value);
            }}
          >
            <option value="ONE-TIME-TASK">One Time Task</option>
            <option value={"DAILY"}>Daily</option>
            <option value={"WEEKLY"}>Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </Input>
        </div>
        <br />

        {/* <Input
          id="exampleDatetime"
        name="datetime"
        placeholder="datetime placeholder"
        type="datetime"
      /> */}
      </Col>
      <Col md="4"></Col>
      <Col md="5">
        <FormGroup>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
            }}
          >
            <h5>{schedulType} </h5>
            <div>
              <div style={{ display: "inline" }}>
                <Label>start date</Label>
                <Input
                  name="date"
                  type="date"
                  value={notifiInfo.date ? notifiInfo.date : ""}
                  onChange={(e) => handleForm(e)}
                  style={{
                    padding: "8px 5px",
                    borderRadius: "8px",
                  }}
                  min={`${new Date().toISOString().slice(0, 10)}`}
                />
                {isRequired && !notifiInfo.date && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "10px",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    *required date
                  </span>
                )}
              </div>
            </div>

            <h4> At </h4>
            <div>
              <Input
                type="time"
                name="time"
                value={notifiInfo.time ? notifiInfo.time : ""}
                onChange={(e) => handleForm(e)}
                style={{ padding: "8px 5px", borderRadius: "8px" }}
              />
              {isRequired && !notifiInfo.time && (
                <span
                  style={{ color: "red", fontSize: "10px", display: "block" }}
                >
                  *required time
                </span>
              )}
            </div>
          </div>
        </FormGroup>
      </Col>
      <br />
      <Col md="12">
        <Divider />
      </Col>
      <Col md="1">
        <Button
          color="secondary"
          style={{ marginTop: "15px", marginRight: "15px" }}
          onClick={() => setNotifiInfo({})}
        >
          Reset
        </Button>
      </Col>
      <Col md="1">
        <Button
          color="primary"
          style={{ marginTop: "15px" }}
          onClick={() => publichNotification()}
        >
          Publish
        </Button>
      </Col>
      <Modal isOpen={showModal} centered>
        <ModalHeader>Review message</ModalHeader>
        <ModalBody>
          <div>
            <Row>
              <h3 style={{ fontSize: "16px", marginLeft: "15px" }}>
                Notification content
              </h3>
            </Row>
            <Row>
              <Col md="1">
                {" "}
                <FileText />
              </Col>
              <Col md="10">
                <p>{notifiInfo.title_message}</p>
              </Col>
            </Row>
            <Divider />
          </div>
          <br />
          <div>
            <Row>
              <h3 style={{ fontSize: "16px", marginLeft: "15px" }}>Topic</h3>
            </Row>
            <Row>
              <Col md="1">
                {" "}
                <Target />
              </Col>
              <Col md="10">
                <p>
                  Subscribers of{" "}
                  {notifiInfo.franchise === "ALL"
                    ? `${branchname(notifiInfo.branch)}_ALL`
                    : `${notifiInfo.franchise}_ALL`}{" "}
                  topic
                </p>
              </Col>
            </Row>
            <Divider />
          </div>
          <br />
          <div>
            <Row>
              <h3 style={{ fontSize: "16px", marginLeft: "15px" }}>
                Scheduling
              </h3>
            </Row>
            <Row>
              <Col md="1">
                {" "}
                <Calendar />
              </Col>
              <Col md="10">
                <p>
                  Send on {notifiInfo.date} at {notifiInfo.time}
                </p>
              </Col>
            </Row>
            <Divider />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setModal(false)}>Back</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setNotification()}
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </FormGroup>
  );
}

export default AddNotification;
