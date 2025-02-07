import React, { Fragment, useEffect, useState } from "react";
// import Breadcrumb from "../../layout/breadcrumb";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import axios from "axios";
import { franchiseaxios } from "../../../axios";
import DatePicker from "react-datepicker";
const MyFranchise = (props, initialValues) => {
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState({
    user_name: "",
    // branch:"",
    // area:"",
    // leadsource: "",
  });

  const handleChange = (event) => {
    const target = event.target;
    var value = target.value;
    const name = target.name;
    // console.log({[name]:value})

    if (target.type === "checkbox") {
    } else {
      setFilter((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
    // console.log({[name]:value})
  };

  const handleStatusChange = function (e) {
    //  
    // 
    var formgroup = e.target.closest(".form-group");
    var filterArray = [...formgroup.querySelectorAll("input[type=checkbox]")]
      .filter((input) => input.checked)
      .map((input) => input.name);
    setFilter((preState) => ({
      ...preState,
      [formgroup.dataset.name]: filterArray,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(filter);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    franchiseaxios
      .get(
        "franchise/create",
        {
          params: filter,
          paramsSerializer: function paramsSerializer(params) {
            console.log(params);
            var str = "";
            for (var key in params) {
              if (params[key] instanceof Array) {
                str = str + "&" + key + "=" + params[key].join(`&${key}=`);
              } else {
                str = str + "&" + key + "=" + params[key];
              }
            }
            str = str.slice(1);
            console.log(str);
            return str;
          },
        },
        config
      )
      .then((response) => {
        console.log(response);
        // props.onUpdate(response.data);
        props.onUpdate(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };

  var expanded = false;

  let toggleCheckboxes = (e) => {
    e.stopPropagation();
    var checkboxes = e.target
      .closest(".form-group")
      .querySelector(".checkboxes");
    function a(e) {
      if (!checkboxes.contains(e.target)) {
        hideCheckboxes();
      }
    }
    function b(e) {
      if (!checkboxes.contains(e.target)) {
        e.preventDefault();
        hideCheckboxes();
      }
    }
    function showCheckboxes() {
      document.body.addEventListener("focusin", a);
      document.body.addEventListener("click", b);
      checkboxes.style.display = "block";
      expanded = true;
    }
    function hideCheckboxes() {
      document.body.removeEventListener("focusin", a);
      document.body.removeEventListener("click", b);
      checkboxes.style.display = "none";
      expanded = false;
    }

    if (!expanded) {
      showCheckboxes();
    } else {
      hideCheckboxes();
    }
  };

  var expandeds = false;
  let franchiseCheckboxes = (e) => {
    e.stopPropagation();
    var checkboxes = document.getElementById("selectfranchise");
    function a(e) {
      if (!checkboxes.contains(e.target)) {
        hideCheckboxes();
      }
    }
    function b(e) {
      if (!checkboxes.contains(e.target)) {
        e.preventDefault();
        hideCheckboxes();
      }
    }
    function showCheckboxes() {
      document.body.addEventListener("focusin", a);
      document.body.addEventListener("click", b);
      checkboxes.style.display = "block";
      expandeds = true;
    }
    function hideCheckboxes() {
      document.body.removeEventListener("focusin", a);
      document.body.removeEventListener("click", b);
      checkboxes.style.display = "none";
      expandeds = false;
    }

    if (!expandeds) {
      showCheckboxes();
    } else {
      hideCheckboxes();
    }
  };

  var expandeds1 = false;
  let leadsourceCheckboxes = (e) => {
    e.stopPropagation();
    var checkboxes = document.getElementById("selectleadsource");
    function a(e) {
      if (!checkboxes.contains(e.target)) {
        hideCheckboxes();
      }
    }
    function b(e) {
      if (!checkboxes.contains(e.target)) {
        e.preventDefault();
        hideCheckboxes();
      }
    }
    function showCheckboxes() {
      document.body.addEventListener("focusin", a);
      document.body.addEventListener("click", b);
      checkboxes.style.display = "block";
      expandeds1 = true;
    }
    function hideCheckboxes() {
      document.body.removeEventListener("focusin", a);
      document.body.removeEventListener("click", b);
      checkboxes.style.display = "none";
      expandeds1 = false;
    }

    if (!expandeds1) {
      showCheckboxes();
    } else {
      hideCheckboxes();
    }
  };

  var expandeds2 = false;
  let branchCheckboxes = (e) => {
    e.stopPropagation();
    var checkboxes = document.getElementById("selectbranch");
    function a(e) {
      if (!checkboxes.contains(e.target)) {
        hideCheckboxes();
      }
    }
    function b(e) {
      if (!checkboxes.contains(e.target)) {
        e.preventDefault();
        hideCheckboxes();
      }
    }
    function showCheckboxes() {
      document.body.addEventListener("focusin", a);
      document.body.addEventListener("click", b);
      checkboxes.style.display = "block";
      expandeds2 = true;
    }
    function hideCheckboxes() {
      document.body.removeEventListener("focusin", a);
      document.body.removeEventListener("click", b);
      checkboxes.style.display = "none";
      expandeds1 = false;
    }

    if (!expandeds2) {
      showCheckboxes();
    } else {
      hideCheckboxes();
    }
  };
  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col sm="12">
              <Form onSubmit={submit}>
                <Row>
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          className="form-control"
                          name="user_name"
                          value={filter.user_name}
                          type="text"
                          // onClick={(e)=>searchFilter(e)}
                          onChange={handleChange}
                          onBlur={checkEmptyValue}
                        />
                        <Label className="placeholder_styling">User Name</Label>
                      </div>
                    </FormGroup>
                  </Col>

                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          className="form-control"
                          name="franchise_name"
                          value={filter.franchise_name}
                          type="text"
                          // onClick={(e)=>searchFilter(e)}
                          onChange={handleChange}
                          onBlur={checkEmptyValue}
                        />
                        <Label className="placeholder_styling">
                          Franchise Name
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>

                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          className="form-control"
                          name="franchise_code"
                          value={filter.franchise_code}
                          type="text"
                          // onClick={(e)=>searchFilter(e)}
                          onChange={handleChange}
                          onBlur={checkEmptyValue}
                        />
                        <Label className="placeholder_styling">
                          Franchise Code
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm="4">
                    <FormGroup
                      style={{ position: "relative" }}
                      data-name="type"
                    >
                      <div
                        class="selectstatusBox form-control"
                        onClick={(e) => toggleCheckboxes(e)}
                      >
                        <select
                          style={{ border: "none", backgroundColor: "white" }}
                        >
                          <option>Type</option>
                        </select>
                        <div class="overSelect"></div>
                      </div>
                      <div
                        id="selectstatus"
                        onChange={handleStatusChange}
                        className="checkboxes"
                      >
                        <label>
                          <input type="checkbox" name="BULK" />
                          &nbsp; BULK
                        </label>
                        <label>
                          <input type="checkbox" name="DEP" />
                          &nbsp; DEP
                        </label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                <br />
                <br />
                <div className="text-left">
                  <button className="btn btn-primary" type="submit">
                    Search
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default MyFranchise;

// import React, { Fragment, useEffect, useState, useLayoutEffect } from "react";
// // import Breadcrumb from "../../layout/breadcrumb";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Media,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   TabContent,
//   TabPane,
//   Nav,
//   NavLink,
// } from "reactstrap";
// import axios from "axios";
// import AddFranchise from "./addfranchise";
// // import MyLeads from "./myleads";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import { toast } from "react-toastify";

// import {
//   Search,
//   ModalTitle,
//   Configuration,
//   CopyText,
//   Cancel,FranchiseHeader
// } from "../../../constant";
// import { useSelector, useDispatch } from "react-redux";
// import { useHistory } from "react-router-dom";
// import {

//   ADD_SIDEBAR_TYPES,

// } from "../../../redux/actionTypes";
// import { classes } from "../../../data/layouts";

// const MyFranchise = (props, initialValues) => {
//   const [activeTab1, setActiveTab1] = useState("1");
//   const [rightSidebar, setRightSidebar] = useState(true);
//   const [data, setData] = useState([]);
//   //filter
//   const [filteredData, setFilteredData] = useState(data);
//   //
//   const width = useWindowSize();
//   const [modal, setModal] = useState();
//   const configDB = useSelector((content) => content.Customizer.customizer);
//   const [sidebar_type, setSidebar_type] = useState(
//     configDB.settings.sidebar.type
//   );

//   let history = useHistory();

//   const dispatch = useDispatch();

//   let DefaultLayout = {};

//   function useWindowSize() {
//     const [size, setSize] = useState([0, 0]);
//     useLayoutEffect(() => {
//       function updateSize() {
//         setSize(window.innerWidth);
//       }
//       window.addEventListener("resize", updateSize);
//       updateSize();
//       return () => window.removeEventListener("resize", updateSize);
//     }, []);
//     return size;
//   }

//   useEffect(() => {
//     const defaultLayoutObj = classes.find(
//       (item) => Object.values(item).pop(1) === sidebar_type
//     );
//     // somecases taken static url so need to modified
//     const modifyURL =
//       process.env.PUBLIC_URL +
//       "/dashboard/default/" +
//       Object.keys(defaultLayoutObj).pop();
//     // fetch id from URL
//     const id =
//       window.location.pathname === "/"
//         ? history.push(modifyURL)
//         : window.location.pathname.split("/").pop();

//     // fetch object by getting URL
//     const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
//     const layout = id ? layoutobj : defaultLayoutObj;
//     DefaultLayout = defaultLayoutObj;
//     handlePageLayputs(layout);
//     axios
//       .get(`${process.env.PUBLIC_URL}/api/user-edit-table.json`)
//       .then((res) =>{
//         setData(res.data);
//         setFilteredData(res.data);
//       } )
//   }, []);

//   const handleSubmit = (event) => {
//     event.preventDefault();

//   };
//   const toggle = () => {
//     setModal(!modal);
//   };
//   const closeCustomizer = () => {
//     setRightSidebar(!rightSidebar);
//     document.querySelector(".customizer-contain").classList.remove("open");
//     // document.querySelector(".customizer-links").classList.remove('open');
//   };
//   const openCustomizer = (type) => {
//     setActiveTab1(type);
//     setRightSidebar(!rightSidebar);
//     if (rightSidebar) {
//       document.querySelector(".customizer-contain").classList.add("open");
//       // document.querySelector(".customizer-links").classList.add('open');
//     }
//   };

//   const handlePageLayputs = (type) => {
//     let key = Object.keys(type).pop();
//     let val = Object.values(type).pop();
//     document.querySelector(".page-wrapper").className = "page-wrapper " + val;
//     dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
//     localStorage.setItem("layout", key);
//     history.push(key);
//   };

//   //filter
//   const handlesearchChange = (event) => {
//     // setSearchTerm(e.target.value);
//     let value = event.target.value.toLowerCase();
//     let result = [];
//     // console.log(value);
//     result = data.filter((data) => {
//       console.log(data);
//       if(data.date.search(value) != -1||data.price.search(value) != -1)
//       return data
//       // return data.date.search(value) != -1;
//     });
//     setFilteredData(result);
//   };

//   function checkEmptyValue(e) {
//     if (e.target.value == "") {
//       e.target.classList.remove("not-empty");
//     } else {
//       e.target.classList.add("not-empty");
//     }
//   }

//   return (
//     <Fragment>
//      <br />
//       <Container fluid={true}>
//       <div className="edit-profile">
//            <Row>
//              <Col sm="12">
//                <Form className="card" onSubmit={handleSubmit}>

//                 <CardBody>
//                   <Row>
//                     <Col sm="4">
//                       <FormGroup>
//                         <Label className="form-label">Franchise Name</Label>
//                         <Input className="form-control" type="text" />
//                       </FormGroup>
//                     </Col>
//                     <Col sm="4">
//                       <FormGroup>
//                         <Label className="form-label">User Name</Label>
//                         <Input className="form-control" type="text" />
//                       </FormGroup>
//                     </Col>

//                     <Col sm="4">
//                     <FormGroup>
//                       {/* <Label className="form-label">Name</Label> */}
//                       <div className="input_wrap">
//                         <Input
//                         name="franchise_code"
//                           className="form-control"
//                           type="text"
//                           onBlur={checkEmptyValue}
//                         // onChange={handleInputChange}

//                         />
//                         <Label className="placeholder_styling">
//                           Franchise Code
//                         </Label>
//                       </div>
//                     </FormGroup>
//                     </Col>
//                     </Row>

//                     <Col sm="4">
//                   <FormGroup>
//                     <div className="input_wrap">
//                       <Input
//                         type="select"
//                         name="type"
//                         className="form-control digits"
//                         onBlur={checkEmptyValue}
//                         // onChange={handleInputChange}
//                       >
//                         <option value=""></option>
//                         <option value="BULK">Bulk</option>
//                         <option value="DEP">Deposit</option>
//                       </Input>
//                       <Label className="placeholder_styling">
//                          Type
//                       </Label>
//                     </div>
//                   </FormGroup>
//                 </Col>
//                     <Row>

//                     </Row>

//                   <div className="text-left">
//                     <button className="btn btn-primary" type="submit">
//                       Search
//                     </button>
//                   </div>
//                 </CardBody>
//                 {/* </Card> */}
//               </Form>
//             </Col>
//           </Row>
//         </div>
//       </Container>
//     </Fragment>
//   );
// };

// export default MyFranchise;
