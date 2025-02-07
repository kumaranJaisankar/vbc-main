// import * as React from "react";
// import Box from "@mui/material/Box";
// import Stepper from "@mui/material/Stepper";
// import Step from "@mui/material/Step";
// import StepLabel from "@mui/material/StepLabel";
// import StepContent from "@mui/material/StepContent";
// import Button from "@mui/material/Button";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import { Card, Divider, TextField } from "@mui/material";
// import {
//   Col,
//   FormGroup,
//   Input,
//   Label,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
//   Row,
// } from "reactstrap";
// import { FileText, Target, Calendar } from "react-feather";
// // import axios from "axios";
// import { toast } from "react-toastify";
// import axios from "../../../axios";
// const steps = [
//   {
//     label: "Notification content",
//     description: `For each ad campaign that you create, you can control how much
//               you're willing to spend on clicks and conversions, which networks
//               and geographical locations you want your ads to show on, and more.`,
//   },
//   {
//     label: "Target Audience",
//     description:
//       "An ad group contains one or more ads which target a shared set of keywords.",
//   },
//   {
//     label: "Scheduling",
//     description: `Try out different ad text to see what brings in the most customers,
//               and learn how to enhance your ads using features like ad extensions.
//               If you run into any problems with your ads, find out how to tell if
//               they're running and how to resolve approval issues.`,
//   },
// ];

// export default function Promotions() {
//   const [schedulType, setScheduleType] = React.useState("DAILY");
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [reviewModal, setReviewModal] = React.useState(false);
//   const [notifiInfo, setNotifiInfo] = React.useState({});
//   const [isRequired, setIsRequired] = React.useState(false);

//   function getBase64(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   }
//   const handleForm = async (e) => {
//     if (
//       e.target.name === "title_message" ||
//       e.target.name === "body" ||
//       e.target.name === "topic" ||
//       e.target.name === "date" ||
//       e.target.name === "time"
//     ) {
//       setNotifiInfo({ ...notifiInfo, [e.target.name]: e.target.value });
//     }
//     if (e.target.name === "image") {
//       console.log(e.target.files[0].name);
//       let preview = await getBase64(e.target.files[0]);
//       setNotifiInfo({
//         ...notifiInfo,
//         [e.target.name]: preview,
//       });
//     }
//   };

//   const handleNext = () => {
//     console.log(Date.now());
//     console.log(activeStep);
//     if (activeStep === 0) {
//       if (notifiInfo.title_message && notifiInfo.body) {
//         setIsRequired(false);
//         setActiveStep((prevActiveStep) => prevActiveStep + 1);
//         console.log("yes");
//       } else {
//         setIsRequired(true);
//       }
//     } else if (activeStep === 1) {
//       if (notifiInfo.topic) {
//         setIsRequired(false);
//         setActiveStep((prevActiveStep) => prevActiveStep + 1);
//         console.log("yes");
//       } else {
//         setIsRequired(true);
//       }
//     } else if (activeStep === 2) {
//       if (schedulType === "Custom") {
//         if (notifiInfo.date && notifiInfo.time) {
//           setIsRequired(false);
//           setReviewModal(true);
//           console.log("yes");
//         } else {
//           setIsRequired(true);
//         }
//       } else {
//         if (notifiInfo.time) {
//           setIsRequired(false);
//           setReviewModal(true);
//           console.log("yes");
//         } else {
//           setIsRequired(true);
//         }
//       }
//     } else {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//   };
//   const firstStep = () => (
//     <FormGroup row>
//       <Col md="12" sm={{ offset: 1 }}>
//         <Label className="d-block" for="edo-ani1">
//           Notification title
//         </Label>
//         <Input
//           id="edo_ani1"
//           name={"title_message"}
//           placeholder="Enter notification title"
//           value={notifiInfo ? notifiInfo.title_message : ""}
//           onChange={(e) => handleForm(e)}
//           onFocus={(e) => console.log()}
//         />
//         {isRequired && !notifiInfo.title_message && (
//           <span style={{ color: "red", fontSize: "10px" }}>
//             *required notification title
//           </span>
//         )}
//       </Col>
//       <br />
//       <Col md="12" sm={{ offset: 1 }}>
//         <Label className="d-block" for="edo-ani2">
//           Notification text
//         </Label>
//         <Input
//           id="edo_ani2"
//           name={"body"}
//           value={notifiInfo ? notifiInfo.body : ""}
//           placeholder="Enter notification text"
//           onChange={(e) => handleForm(e)}
//         />
//         {isRequired && !notifiInfo.body && (
//           <span style={{ color: "red", fontSize: "10px" }}>
//             *required notification text
//           </span>
//         )}
//       </Col>
//       <br />
//       <Col md="12" sm={{ offset: 1 }}>
//         <Label for="exampleFile">Notification image(optional)</Label>

//         <Input
//           id="exampleFile"
//           name="image"
//           type="file"
//           accept="image/jpg, image/jpeg, image/png"
//           onChange={handleForm}
//         />
//         {notifiInfo.image && (
//           <img
//             alt="preview"
//             src={notifiInfo.image}
//             width={250}
//             height={150}
//             style={{ marginTop: "10px" }}
//           />
//         )}
//       </Col>

//       <br />
//     </FormGroup>
//   );
//   const secondStep = () => (
//     <Row>
//       <Col md="12" sm={{ offset: 1 }}>
//         <FormGroup>
//           <Label for="exampleSelect">Audience type</Label>
//           <Input
//             id="exampleSelect"
//             name="topic"
//             value={notifiInfo.topic ? notifiInfo.topic : ""}
//             placeholder="Select audience type"
//             type="select"
//             onChange={(e) => handleForm(e)}
//             onSelect={(e) => console.log(e)}
//           >
//             <option value={""}></option>
//             <option value={"vbc_users"}>All customers</option>
//             {/* <option value={"view"}>Franchise users</option> */}
//           </Input>
//           {isRequired && !notifiInfo.topic && (
//             <span style={{ color: "red", fontSize: "10px" }}>
//               *required audience type
//             </span>
//           )}
//         </FormGroup>
//       </Col>
//     </Row>
//   );

//   const thirdStep = () => {
//     return (
//       <FormGroup>
//         <div>
//           <Label for="select">Send to eligible users</Label>
//           <Input
//             id="select"
//             name="select"
//             type="select"
//             onChange={(e) => {
//               e.preventDefault();
//               console.log(e.target.value);
//               setScheduleType(e.target.value);
//             }}
//           >
//             <option value={"DAILY"}>Daily</option>
//             <option value={"WEEKLY"}>Weekly</option>
//             <option value="MONTHLY">Monthly</option>
//             <option value="ONE-TIME-TASK">One Time Task</option>
//           </Input>
//         </div>
//         <br />

//         <div
//           style={{
//             display: "flex",
//             alignItems: "flex-end",
//             justifyContent: "space-evenly",
//           }}
//         >
//           <div>
//             <h5>{schedulType} </h5>
//             <span>start date</span>
//             <div style={{ display: "inline" }}>
//               <input
//                 name="date"
//                 type="date"
//                 value={notifiInfo.date ? notifiInfo.date : ""}
//                 onChange={(e) => handleForm(e)}
//                 style={{
//                   padding: "8px 5px",
//                   borderRadius: "8px",
//                   marginLeft: "10px",
//                 }}
//                 min={`${new Date().toISOString().slice(0, 10)}`}
//               />
//               {isRequired && !notifiInfo.date && (
//                 <span
//                   style={{
//                     color: "red",
//                     fontSize: "10px",
//                     display: "block",
//                     textAlign: "center",
//                   }}
//                 >
//                   *required date
//                 </span>
//               )}
//             </div>
//           </div>

//           <h4> At </h4>
//           <div>
//             <input
//               type="time"
//               name="time"
//               value={notifiInfo.time ? notifiInfo.time : ""}
//               onChange={(e) => handleForm(e)}
//               style={{ padding: "8px 5px", borderRadius: "8px" }}
//             />
//             {isRequired && !notifiInfo.time && (
//               <span
//                 style={{ color: "red", fontSize: "10px", display: "block" }}
//               >
//                 *required time
//               </span>
//             )}
//           </div>
//         </div>
//         {/* <Input
//           id="exampleDatetime"
//           name="datetime"
//           placeholder="datetime placeholder"
//           type="datetime"
//         /> */}
//       </FormGroup>
//     );
//   };

//   const switchCase = (index, step) => {
//     switch (index) {
//       case 0:
//         return firstStep();

//       case 1:
//         return secondStep();
//       case 2:
//         return thirdStep();

//       default:
//         return <Typography>{step.description}</Typography>;
//     }
//   };

//   const setNotification = async () => {
//     console.log("click");
//     axios
//       .post("/radius/push/notification/schedule/create", {
//         title: notifiInfo.title_message,
//         body: notifiInfo.body,
//         topic: notifiInfo.topic,
//         scheduled_date: `${notifiInfo.date} ${notifiInfo.time}`,
//         task_type: schedulType,
//         image: notifiInfo.image ? notifiInfo.image : "",
//       })
//       .then(function (response) {
//         toast.success("Scheduled notification successfully", {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 1000,
//         });
//         setReviewModal(false);
//         console.log(response);
//       })
//       .catch(function (error) {
//         toast.error("Something went wrong", {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 1000,
//         });
//         console.log(error);
//       });
//     console.log("dat");
//     // fetch("http://127.0.0.1:8000/fcm/pushnotification/", {
//     //   method: "POST",

//     //   body: JSON.stringify({
//     //     title: "React Test",
//     //     message: "This message is from react js",
//     //     user: "134565000671234560006",
//     //   }),
//     // })
//     //   .then((res) => console.log(res))
//     //   .catch((e) => console.log(e));
//   };

//   return (
//     <React.Fragment>
//       <br />

//       <Card sx={{ mt: 5, p: 5 }}>
//         <h3>Compose Promotions</h3>
//         <Row>
//           <Col md="6">
//             {" "}
//             <Box sx={{ maxWidth: 400 }}>
//               <Stepper activeStep={activeStep} orientation="vertical">
//                 {steps.map((step, index) => (
//                   <Step key={step.label}>
//                     <StepLabel
//                       optional={
//                         index === 2 ? (
//                           <Typography variant="caption">Last step</Typography>
//                         ) : null
//                       }
//                     >
//                       {step.label}
//                     </StepLabel>
//                     <StepContent>
//                       {switchCase(index, step)}
//                       <Box sx={{ mb: 2 }}>
//                         <div>
//                           <Button
//                             variant="contained"
//                             onClick={handleNext}
//                             sx={{ mt: 1, mr: 1 }}
//                           >
//                             {index === steps.length - 1 ? "Review" : "Continue"}
//                           </Button>
//                           <Button
//                             disabled={index === 0}
//                             onClick={handleBack}
//                             sx={{ mt: 1, mr: 1 }}
//                           >
//                             Back
//                           </Button>
//                         </div>
//                       </Box>
//                     </StepContent>
//                   </Step>
//                 ))}
//               </Stepper>
//               {activeStep === steps.length && (
//                 <Paper square elevation={0} sx={{ p: 3 }}>
//                   <Typography>
//                     All steps completed - you&apos;re finished
//                   </Typography>
//                   <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
//                     Reset
//                   </Button>
//                 </Paper>
//               )}
//             </Box>
//           </Col>
//           <Col md="1">
//             <Divider orientation="vertical" />
//           </Col>
//           <Col md="5">
//             <div
//               style={{
//                 width: "100px",
//                 backgroundColor: "gray",
//                 height: "100px",
//               }}
//             ></div>
//           </Col>
//         </Row>
//         <Divider />
//         <Modal isOpen={reviewModal} centered>
//           <ModalHeader>Review message</ModalHeader>
//           <ModalBody>
//             <div>
//               <Row>
//                 <h3 style={{ fontSize: "16px", marginLeft: "15px" }}>
//                   Notification content
//                 </h3>
//               </Row>
//               <Row>
//                 <Col md="1">
//                   {" "}
//                   <FileText />
//                 </Col>
//                 <Col md="10">
//                   <p>{notifiInfo.title_message}</p>
//                 </Col>
//               </Row>
//               <Divider />
//             </div>
//             <br />
//             <div>
//               <Row>
//                 <h3 style={{ fontSize: "16px", marginLeft: "15px" }}>
//                   Target audience
//                 </h3>
//               </Row>
//               <Row>
//                 <Col md="1">
//                   {" "}
//                   <Target />
//                 </Col>
//                 <Col md="10">
//                   <p>Subscribers of VBC topic</p>
//                 </Col>
//               </Row>
//               <Divider />
//             </div>
//             <br />
//             <div>
//               <Row>
//                 <h3 style={{ fontSize: "16px", marginLeft: "15px" }}>
//                   Scheduling
//                 </h3>
//               </Row>
//               <Row>
//                 <Col md="1">
//                   {" "}
//                   <Calendar />
//                 </Col>
//                 <Col md="10">
//                   <p>
//                     Send on {notifiInfo.date} at {notifiInfo.time}
//                   </p>
//                 </Col>
//               </Row>
//               <Divider />
//             </div>
//           </ModalBody>
//           <ModalFooter>
//             <Button onClick={() => setReviewModal(false)}>Back</Button>

//             <Button
//               color="primary"
//               variant="contained"
//               onClick={() => setNotification()}
//             >
//               Publish
//             </Button>
//           </ModalFooter>
//         </Modal>
//       </Card>
//     </React.Fragment>
//   );
// }

import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
// import { BranchFilterContainer } from "./BranchFilter/BranchFilterContainer";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  ModalBody,
} from "reactstrap";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { ModalTitle, CopyText, Cancel, Close } from "../../../constant";
import axios, { adminaxios } from "../../../axios";
// import AddBranch from "./addbranch";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { logout_From_Firebase } from "../../../utils";
import PermissionModal from "../../common/PermissionModal";
// import "react-data-table-component-extensions/dist/index.css";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
// import { AllBranchDetails } from "./branchdetails/allbranchdetails";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FILTERS from "../../../assets/images/filters.png";
import REFRESH from "../../../assets/images/refresh.png";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { BRANCH } from "../../../utils/permissions";
import Tooltip from "@mui/material/Tooltip";
import AddBranch from "../administration/addbranch";
import { AllBranchDetails } from "../administration/branchdetails/allbranchdetails";
import AddNotification from "./AddNotification";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const Promotions = () => {
  const [listOfNotification, setListnotification] = useState([]);
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(listOfNotification);
  // const [filteredNotifiData,setFilteredNotifiData]
  const [loading, setLoading] = useState(false);

  const [lead, setLead] = useState([]);

  const [modal, setModal] = useState();
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();

  // draft
  const [isDirty, setIsDirty] = useState(false);
  const [isDirtyModal, setisDirtyModal] = useState(false);
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  //end

  const [Verticalcenter, setVerticalcenter] = useState(false);

  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);

  const configDB = useSelector((content) => content.Customizer.customizer);

  const Verticalcentermodaltoggle = () => {
    if (Verticalcenter == true) {
      setIsChecked([]);
      setClearSelection(true);
    }

    if (isChecked.length > 0) {
      setVerticalcenter(!Verticalcenter);
    } else {
      toast.error("Please select any record", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      // return false;
    }
  };

  let history = useHistory();

  const dispatch = useDispatch();

  let DefaultLayout = {};

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  // logout
  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };
  //filtering data by making a backup
  useEffect(() => {
    if (data) {
      setData(data);
      setFiltereddataBkp(data);
      // setFiltereddata(data);
    }
  }, [data]);
  //end

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = listOfNotification.filter((data) => {
      if (
        data.title.toLowerCase().search(value) != -1 ||
        (data && data.topic && data.topic.toLowerCase().search(value) != -1)
      )
        return data;
    });
    setFiltereddata(result);
  };

  // delete api

  //delete
  const deleteRows = (selected) => {
    setClearSelection(false);

    let rows = selected.map((ele) => ele.id);
    setIsChecked([...rows]);
  };

  const toggle = () => {
    setModal(!modal);
  };
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //refresh
  const Refreshhandler = () => {
    getNotificationData();
    // setRefresh(1);
    if (searchInputField.current) {
      searchInputField.current.value = "";
    }
  };
  //draft vustomizers
  // removed draft code from closeCustomizer by Marieya
  const closeCustomizer = () => {
    Refreshhandler();
    // draft
    if (isDirty) {
      setisDirtyModal(true);
    } else {
      setisDirtyModal(false);
      setRightSidebar(!rightSidebar);
      document.querySelector(".customizer-contain").classList.remove("open");
      setIsDirty(false);
    }
  };

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    // draft store value
    const getLocalDraftKey = localStorage.getItem("branchDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain").classList.add("open");

    // document.querySelector(".customizer-links").classList.add('open');
    // }
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  const searchInputField = useRef(null);

  //imports
  const dateTimeFormatter = (timestamp) => {
    const dateObject = new Date(timestamp);
    const date = dateObject.toISOString().split("T")[0];
    const time = dateObject.toTimeString().split(" ")[0];
    return `${date} ${time}`;
  };
  const dateTimeFormatterForSchedule = (timestamp) => {
    const dt = new Date(timestamp);
    let date = dt.toISOString().split("T")[0];
    let time = dt.toISOString().split("T")[1].split(".")[0];
    return `${date} ${time}`;
  };

  const columns = [
    {
      name: <b className="Table_columns">{"Title"}</b>,
      selector: "title",
      width: "150px",
      cell: (row) => <span>{row.title}</span>,

      sortable: true,
    },

    {
      name: <b className="Table_columns">{"Body"}</b>,
      selector: "body",
      width: "200px",
      cell: (row) => {
        return (
          <Tooltip title={row.body}>
            <span
              style={{
                width: "200px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxLines: 2,
                lineClamp: 2,
              }}
            >
              {row.body}
            </span>
          </Tooltip>
        );
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Topic"}</b>,
      cell: (row) => {
        return <span>{row.topic}</span>;
      },
      selector: "code",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Task type"}</b>,
      cell: (row) => {
        return <>{row.task_type ? <span>{row.task_type}</span> : "--"}</>;
      },
      selector: "invoice_code",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"scheduled date"}</b>,
      cell: (row) => {
        return <span>{dateTimeFormatterForSchedule(row.scheduled_date)}</span>;
      },
      selector: "invoice_code",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"created at"}</b>,
      cell: (row) => {
        return <span>{dateTimeFormatter(row.created_at)}</span>;
      },
      selector: "invoice_code",
      sortable: true,
    },

    {
      name: <b className="Table_columns">{"isSent"}</b>,
      cell: (row) => {
        return <span>{row.isSent ? "True" : "False"}</span>;
      },
      selector: "email",
      sortable: true,
    },
  ];

  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });
  //filter show and hide level menu
  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
  };

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");

    if (concernedElement && concernedElement.contains(event.target)) {
      setLevelMenu(true);
      // setImportDivStatus(true);
    } else {
      if (event.target.className !== "btn btn-primary nav-link") {
        if (event.target.className !== "icon-filter") {
          setLevelMenu(false);
          //   setImportDivStatus(true);
        }
      }
    }
  });

  // draft end
  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  //download export files
  const handleSelectedRows = (selectedRows) => {
    const tempFilteredData =
      listOfNotification.map((item) => ({ ...item, selected: false })) || [];
    const selectedIds = selectedRows.map((item) => item.id);
    const temp = tempFilteredData.map((item) => {
      if (selectedIds.includes(item.id)) return { ...item, selected: true };
      else return { ...item, selected: false };
    });
    console.log(tempFilteredData);
    console.log(temp);
    // console.log(selectedRows);
    setFiltereddata(temp);
  };
  // scroll top
  const ref = useRef();
  function getNotificationData() {
    setLoading(true);
    axios
      .get("/radius/push/notification/schedule/create")
      .then(function (response) {
        setListnotification(response.data);
        setFiltereddata(response.data);
        setLoading(false);
        console.log(response);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  }

  useEffect(() => {
    ref.current.scrollIntoView(0, 0);
    getNotificationData();
  }, []);

  //onside click hide sidebar
  const box = useRef(null);
  // useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (
            rightSidebar &&
            !event.target.className.includes("openmodal") &&
            !event.target.className.includes("react-datepicker__day") &&
            !event.target.className.includes(
              "react-datepicker__navigation--previous"
            )
          ) {
            closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }

  //end
  //new export states
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //end

  // function for checkbox selection in dataTable
  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        type="checkbox"
        class="new-checkbox"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="booty-check" />
    </div>
  ));
  //end

  //  Sailaja on 11th July   Line number 672 id="breadcrumb_margin" change the breadcrumb position

  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
          <Grid container spacing={1} id="breadcrumb_margin">
            <Grid item md="12">
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={
                  <NavigateNextIcon
                    fontSize="small"
                    className="navigate_icon"
                  />
                }
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                >
                  Business Operations
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  classNmae="last_typography !important"
                >
                  Push notification
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          {/* Sailaja on 11th July   Line number 707 id="breadcrumb_table" change the breadcrumb position  */}

          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2}>
              <span className="all_cust">Push notification</span>
              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
                <Paper
                  component="div"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 350,
                    height: "40px",
                    boxShadow: "none",
                    border: "1px solid #E0E0E0",
                  }}
                >
                  {" "}
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search google maps" }}
                    placeholder="Search With title or  topic"
                    onChange={(event) => handlesearchChange(event)}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
                <Tooltip title={"Refresh"}>
                  <MUIButton
                    className="muibuttons"
                    onClick={Refreshhandler}
                    variant="outlined"
                    style={{ height: "40px" }}
                  >
                    <img src={REFRESH} />
                  </MUIButton>
                </Tooltip>

                <button
                  className="btn btn-primary openmodal"
                  id="newbuuon"
                  type="submit"
                  onClick={() => openCustomizer("2")}
                >
                  <div>
                    <span
                      className="openmodal"
                      style={{
                        fontSize: "16px",
                        position: "relative",
                        left: "-27%",
                      }}
                    >
                      New
                    </span>
                    <i
                      className="icofont icofont-plus openmodal"
                      style={{
                        cursor: "pointer",
                      }}
                    ></i>
                  </div>
                </button>
              </Stack>
            </Stack>

            <Row>
              {/*Sailaja given marginTop:"4%" style for set filter box position on 10th August   */}
              <Col md="12" style={{ marginTop: "4%" }}>
                <Card style={{ borderRadius: "0", boxShadow: "none" }}>
                  <Col xl="12" style={{ padding: "0" }}>
                    <nav aria-label="Page navigation example">
                      {loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "15px" }}
                        />
                      ) : (
                        <div className="data-table-wrapper">
                          <Col md="8"></Col>

                          <DataTable
                            className="branch-lists"
                            columns={columns}
                            data={filteredData}
                            noHeader
                            selectableRows
                            selectableRowsComponent={NewCheckbox}
                            // striped={true}
                            // center={true}
                            // clearSelectedRows={clearSelectedRows}

                            // selectableRows
                            onSelectedRowsChange={({ selectedRows }) => (
                              handleSelectedRows(selectedRows),
                              deleteRows(selectedRows)
                            )}
                            clearSelectedRows={clearSelectedRows}
                            pagination
                            noDataComponent={"No Records"}
                            // clearSelectedRows={clearSelection}
                            conditionalRowStyles={conditionalRowStyles}
                          />
                        </div>
                      )}
                    </nav>
                  </Col>
                  <br />
                </Card>
              </Col>

              <Row>
                <Col md="12">
                  <div
                    className="customizer-contain"
                    ref={box}
                    style={{
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                    }}
                  >
                    <div className="tab-content" id="c-pills-tabContent">
                      <div
                        className="customizer-header"
                        style={{
                          border: "none",
                          borderTopLeftRadius: "20px",
                        }}
                      >
                        <br />
                        <i
                          className="icon-close"
                          onClick={() => {
                            closeCustomizer();
                          }}
                        ></i>
                        <br />
                      </div>
                      <div className=" customizer-body custom-scrollbar">
                        <TabContent activeTab={activeTab1}>
                          <TabPane tabId="2">
                            <div id="headerheading">
                              {" "}
                              Add Push notification schedule
                            </div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  {activeTab1 == "2" && (
                                    <AddNotification
                                      closeCustomizer={closeCustomizer}
                                    />
                                    // <AddBranch
                                    //   dataClose={closeCustomizer}
                                    //   onUpdate={(data) => update(data)}
                                    //   rightSidebar={rightSidebar}
                                    //   setIsDirtyFun={setIsDirtyFun}
                                    //   setformDataForSaveInDraft={
                                    //     setformDataForSaveInDraft
                                    //   }
                                    //   lead={lead}
                                    // />
                                  )}
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
                {/* modal */}

                {/* modal for insufficient permissions */}

                {/* end */}
                {/* draft modal start*/}

                {/* draft modal end */}
              </Row>
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default Promotions;
