import React, {
    Fragment,
    useEffect,
    useState,
    useLayoutEffect,
    useRef,
  } from "react";
  import Skeleton from "react-loading-skeleton";
  // import Breadcrumb from "../../layout/breadcrumb";
  import * as XLSX from "xlsx";
  import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Modal,
    ModalHeader,
    ModalFooter,
    TabContent,
    TabPane,
    Nav,
    NavLink,
    ModalBody,
  } from "reactstrap";
  import {
    Search,
    ModalTitle,
    CopyText,
    Cancel,
    Close,
    SaveChanges,
    VerticallyCentered,
  } from "../../../constant";
  import axios from "axios";
  import {default as axiosBaseURL } from "../../../axios";
  import {adminaxios} from "../../../axios";
 import AddBranch from './addbranch'
  import { CopyToClipboard } from "react-copy-to-clipboard";
  import { toast } from "react-toastify";
  import DataTable from "react-data-table-component";
  // import DataTableExtensions from "react-data-table-component-extensions";
  // import "react-data-table-component-extensions/dist/index.css";

  import { useSelector, useDispatch } from "react-redux";
  import { useHistory } from "react-router-dom";
  // import { columns } from "../../../data/supportdb";
  import DatePicker from "react-datepicker";
  import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
  import { classes } from "../../../data/layouts";
  import PermissionDetails from './permissiondetails';

  var storageToken = localStorage.getItem("token");
  var tokenAccess="";
   if (storageToken !== null) {
    var token = JSON.parse(storageToken) ;
    var tokenAccess = token?.access;
  }

  const tableData = [
    {
        id:"1",
        name: "Product Menu",
        status: {
          add:true,
          edit:true,
          delete:true
        },
        creat_on:"2018-04-18T00:00:00"
    },
    {
      id:"6",
      name: "Category Menu",
      status: {
        add:false,
        edit:true,
        delete:true
      },
      creat_on:"2018-04-18T00:00:00"
  },
    {
        id:"2",
        name: "Category Menu",
        status: {
          add:false,
          edit:true,
          delete:true
        },
        creat_on:"2018-04-18T00:00:00"
    },
    {
        id:"3",
        name: "Subcategory Menu",
        status: {
          add:false,
          edit:false,
          delete:false
        },
        creat_on:"2018-04-18T00:00:00"
    },
    {
        id:"4",
        name: "Sales  Menu",
        status: {
          add:false,
          edit:false,
          delete:false
        },
        creat_on:"2018-04-18T00:00:00"
    },
    {
        id:"5",
        name: "Vendor Menu",
        status: {
          add:true,
          edit:false,
          delete:false
        },
        creat_on:"2018-04-18T00:00:00"
    },
   
]

  const Permission = (props, initialValues) => {
    const [activeTab1, setActiveTab1] = useState("1");
    const [rightSidebar, setRightSidebar] = useState(true);
    const [data, setData] = useState([]);
    const [filteredData, setFiltereddata] = useState(data);
    const [loading, setLoading] = useState(false);
    // const [exportData, setExportData] = useState({ columns: columns,exportHeaders:[]})
    // const [exportData, setExportData] = useState({ columns: columns, data: [] });
    const [lead, setLead] = useState([]);
    const width = useWindowSize();

    const [modal, setModal] = useState();
    const [Verticalcenter, setVerticalcenter] = useState(false);
    const [failed, setFailed] = useState([]);
    const [isChecked, setIsChecked] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [clearSelectedRows, setClearSelectedRows] = useState(false);

    const [checkedata,setCheckedata] = useState([...tableData]);
 
    const configDB = useSelector((content) => content.Customizer.customizer);
    const mix_background_layout = configDB.color.mix_background_layout;
    const [sidebar_type, setSidebar_type] = useState(
      configDB.settings.sidebar.type
    );
    const Verticalcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);
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

    useEffect(() => {
      setLoading(true);
      const defaultLayoutObj = classes.find(
        (item) => Object.values(item).pop(1) === sidebar_type
      );
      const modifyURL =
        process.env.PUBLIC_URL +
        "/dashboard/default/" +
        Object.keys(defaultLayoutObj).pop();
      const id =
        window.location.pathname === "/"
          ? history.push(modifyURL)
          : window.location.pathname.split("/").pop();
      // fetch object by getting URL
      const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
      const layout = id ? layoutobj : defaultLayoutObj;
      DefaultLayout = defaultLayoutObj;
      handlePageLayputs(layout);

      axiosBaseURL
        .get(`/accounts/branch/list`)
        // .then((res) => setData(res.data))
        .then((res) => {
          setData(res.data);
          setFiltereddata(res.data);
          setLoading(false);
          setRefresh(0);
        });
    }, [refresh]);

    useEffect(() => {
      setExportData({
        ...exportData,
        data: filteredData,
      });
    }, [filteredData]);

    const update = (newRecord) => {
      setLoading(true);
      axiosBaseURL
        .get(`/accounts/branch/list`)
        // .then((res) => setData(res.data))
        .then((res) => {
          setData(res.data);
          setFiltereddata(res.data);
          setLoading(false);
          setRefresh(0);
        });
      //setData([...data, newRecord]);
      // setFiltereddata([...data, newRecord]);
      //setFiltereddata((prevFilteredData) => [newRecord, ...prevFilteredData]);
      closeCustomizer();
    };

    const filterUpdate = (filteredData) => {
      setData([...filteredData]);
      setFiltereddata([...filteredData]);
      closeCustomizer();
    };

    const detailsUpdate = (updatedata) => {
      setData([...data, updatedata]);
      // setFiltereddata((prevFilteredData) => [...prevFilteredData, updatedata]);
      setFiltereddata((prevFilteredData) =>
        prevFilteredData.map((data) =>
          data.id == updatedata.id ? updatedata : data
        )
      );
      closeCustomizer();
    };

    //   //filter
    const handlesearchChange = (event) => {
      let value = event.target.value.toLowerCase();
      let result = [];
      result = data.filter((data) => {
        if (
          data.mobile_no.search(value) != -1 ||
          data.first_name.search(value) != -1 ||
          data.email.search(value) !== -1
        )
          return data;
      });
      setFiltereddata(result);
    };

    // delete api
    const onDelete = () => {
      axiosBaseURL.delete("/accounts/users", {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${tokenAccess}`,
        },
        body: JSON.stringify({ ids: isChecked }),
      })
        .then((response) => response.json())
        .then((data) => {
          var difference = [];
          if (data.length > 0) {
            difference = [...isChecked].filter((x) => data.indexOf(x) === -1);
            setFailed([...data]);
          } else {
            difference = [...isChecked];
          }
          setFiltereddata((prevState) => {
            var newdata = prevState.filter(
              (el) => difference.indexOf(el.id) === -1
            );
            return newdata;
          });
          Verticalcentermodaltoggle();
          setClearSelectedRows(true);

          setIsChecked([]);
          if (data.length > 0) {
          }
        });
    };

    //delete
    const deleteRows = (selected) => {
      let rows = selected.map((ele) => ele.id);
      setIsChecked([...rows]);
    };

    const toggle = () => {
      setModal(!modal);
    };
    const closeCustomizer = () => {
      setRightSidebar(!rightSidebar);
      document.querySelector(".customizer-contain").classList.remove("open");
    };

    const openCustomizer = (type, id) => {
      if (id) {
        setLead(id);
      }
      setActiveTab1(type);
      setRightSidebar(!rightSidebar);
      if (rightSidebar) {
        document.querySelector(".customizer-contain").classList.add("open");

        // document.querySelector(".customizer-links").classList.add('open');
      }

      
      
    };

const checkboxHandler = (newRecord, leadInfo) =>{
  let checkedataClone = [...checkedata];

  let leadFindIndex = checkedataClone.findIndex(lead=>lead.id === leadInfo.id);
  let leadFind = checkedataClone.find(lead=>lead.id === leadInfo.id);

  leadFind.status = {...newRecord};
  checkedataClone[leadFindIndex] = leadFind
  setCheckedata([...checkedataClone]);
}

    const handlePageLayputs = (type) => {
      let key = Object.keys(type).pop();
      let val = Object.values(type).pop();
      document.querySelector(".page-wrapper").className = "page-wrapper " + val;
      dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
      localStorage.setItem("layout", key);
      history.push(key);
    };

    //refresh
    const Refreshhandler = () => {
      setRefresh(1);
      searchInputField.current.value = "";
    };

    const searchInputField = useRef(null);

    //imports

    const columns = [
      {
        name: "ID",
        selector: "id",
          cell: (row) => (
            <a onClick={() => openCustomizer("3", row)} style={{cursor:"pointer", color:"blue"}}>{row.id}</a>
          ),
        sortable: true,
      },
      {
        name: "Name",
        selector: "name",
        sortable: true,
      },
     
      {
        name: 'Lead',
        selector: 'status',
        sortable: true,
        center:true,
        cell:(row)=>{
          if(row.status){
            let values = Object.values(row.status); 
            if(values.includes(true)){
              if(values.every(v=>v===true)){
                return <i className="fa fa-circle font-success f-12" />;
              }else{
                return <i className="fa fa-circle font-warning f-12" />;
              }
            }else{
              return <i className="fa fa-circle font-danger f-12" />;
            }
          }
         
        }
    },
   
    {
      name: "Customer",
      // selector: "mobile",
      sortable: true,
    },
    {
      name: "Franchise",
      // selector: "address",
      sortable: true,
    },
   

    ];




  

    const [exportData, setExportData] = useState({
      columns: columns,
      exportHeaders: [],
    });

    return (
      <Fragment>
        <div className="customizer-links" style={{ top: "22%" }}>
          <Nav
            className="flex-column nac-pills"
            style={{
              backgroundColor: "#7366ff ",
              borderRadius: "8px 0px 0px 8px",
            }}
          >
            <NavLink onClick={() => openCustomizer("1")}>
              <div className="settings">
                <i
                  className="icon-panel shadow-lg"
                  style={{
                    transform: "rotate(90deg)",
                    color: "white",
                    fontSize: "35px",
                    padding: "2px 5px",
                  }}
                ></i>
              </div>
              <span> Filters </span>
            </NavLink>
          </Nav>
        </div>
        <br />
        <Container fluid={true}>
          <div className="edit-profile">
            <Row>
              <Col md="8" style={{ paddingBottom: "20px", paddingLeft: "34px" }}>
                <div role="group" class="btn-group">
                  {/* <button
                    class="btn btn-primary"
                    type="submit"
                    onClick={() => openCustomizer("3")}
                  >
                    <i
                      className="icofont icofont-plus"
                      style={{
                        color: "white",
                        fontSize: "21px",
                        cursor: "pointer",
                      }}
                    ></i>
                    &nbsp;&nbsp; details
                  </button> */}

                  <button
                    class="btn btn-primary"
                    type="submit"
                    onClick={() => openCustomizer("2")}
                  >
                    <i
                      className="icofont icofont-plus"
                      style={{
                        color: "white",
                        fontSize: "21px",
                        cursor: "pointer",
                      }}
                    ></i>
                    &nbsp;&nbsp; New
                  </button>
                 
                  <button
                    class="btn btn-primary"
                    onClick={Verticalcentermodaltoggle}
                    //  onClick={() => onDelete()}
                  >
                    <i
                      // onClick={Verticalcentermodaltoggle}
                      className="icofont icofont-ui-delete"
                      style={{
                        color: "white",
                        fontSize: "21px",
                        cursor: "pointer",
                      }}
                      // {VerticallyCentered}
                    ></i>
                    &nbsp;&nbsp; Delete
                  </button>
                  {/* modal */}
                  <Modal
                    isOpen={Verticalcenter}
                    toggle={Verticalcentermodaltoggle}
                    centered
                  >
                    <ModalHeader toggle={Verticalcentermodaltoggle}>
                      Confirmation
                    </ModalHeader>
                    <ModalBody>
                      <p>Are you sure you want to delete?</p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        onClick={Verticalcentermodaltoggle}
                      >
                        {Close}
                      </Button>
                      <Button color="primary" onClick={() => onDelete()}>
                        Yes
                      </Button>
                    </ModalFooter>
                  </Modal>
                  <button class="btn btn-primary" onClick={Refreshhandler}>
                    <i
                      className="icofont icofont-refresh"
                      style={{
                        color: "white",
                        fontSize: "22px",
                        cursor: "pointer",
                      }}
                    ></i>
                    &nbsp;&nbsp;Refresh
                  </button>

                  <button class="btn btn-primary" type="submit">
                    <i
                      className="fa fa-filter"
                      style={{
                        color: "white",
                        fontSize: "21px",
                        cursor: "pointer",
                      }}
                    ></i>
                    &nbsp;&nbsp; Filter
                  </button>
                </div>
              </Col>

              <Col md="4">
                <Form>
                  {/* <Col sm="12"> */}
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search With name , code or email..."
                    onChange={(event) => handlesearchChange(event)}
                    ref={searchInputField}
                    style={{
                      border: "none",
                      backgroundColor: "white",
                    }}
                  />
                  <Search className="search-icon" />
                  {/* </Col> */}
                </Form>
              </Col>

              <Col md="12">
                <Card style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  <Col xl="12">
                    <nav aria-label="Page navigation example">
                      {loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "15px" }}
                        />
                      ) : (
                        <div>
                          <DataTable
                            columns={columns}
                            persistTableHead

                            // striped={true}
                            center={true}
                            data={checkedata}
                            // data={filteredData}
                            // noHeader
                            selectableRows
                            onSelectedRowsChange={({ selectedRows }) =>
                              deleteRows(selectedRows)
                            }
                            clearSelectedRows={clearSelectedRows}
                            pagination
                          />
                        </div>
                      )}
                    </nav>
                    {/* <nav aria-label="Page navigation example">
                      {loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "15px" }}
                        />
                      ) : (
                        // <DataTable
                        //   // Skeleton={true}
                        //   style={{ marginTop: "-42px" }}
                        //   columns={supportColumns}
                        //   data={filteredData}
                        //   // striped={true}
                        //   // center={true}
                        //   clearSelectedRows={clearSelectedRows}
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                      />
                      <DataTableExtensions
                        {...exportData}
                        print={false}
                        filter={false}
                      >
                        <DataTable
                          columns={columns}
                          data={filteredData}
                          noHeader
                          // striped={true}
                          // center={true}
                          // clearSelectedRows={clearSelectedRows}

                          selectableRows
                          onSelectedRowsChange={({ selectedRows }) =>
                            deleteRows(selectedRows)
                          }
                          clearSelectedRows={clearSelectedRows}
                          pagination
                        />
                      )}
                      </DataTableExtensions>
                    </nav> */}
                  </Col>
                  <br />
                </Card>
              </Col>

              <Row>
                <Col md="12">
                  <div className="customizer-contain">
                    <div className="tab-content" id="c-pills-tabContent">
                      <div
                        className="customizer-header"
                        style={{ padding: "0px", border: "none" }}
                      >
                        <br />
                        <i className="icon-close" onClick={closeCustomizer}></i>
                        <br />
                        <Modal
                          isOpen={modal}
                          toggle={toggle}
                          className="modal-body"
                          centered={true}
                        >
                          <ModalHeader toggle={toggle}>{ModalTitle}</ModalHeader>
                          <ModalFooter>
                            <CopyToClipboard text={JSON.stringify(configDB)}>
                              <Button
                                color="primary"
                                className="notification"
                                onClick={() =>
                                  toast.success("Code Copied to clipboard !", {
                                    position: toast.POSITION.BOTTOM_RIGHT,
                                    autoClose:1000
                                  })
                                }
                              >
                                {CopyText}
                              </Button>
                            </CopyToClipboard>
                            <Button color="secondary" onClick={toggle}>
                              {Cancel}
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </div>
                      <div className=" customizer-body custom-scrollbar">
                        <TabContent activeTab={activeTab1}>
                          <TabPane tabId="1">
                            <h6 style={{ textAlign: "center" }}>Filters</h6>
                            {/* <MyLeads
                              onUpdate={(data) => filterUpdate(data)}
                              ref={searchInputField}
                            /> */}
                          </TabPane>
                          {/* <TabPane tabId="2">
                            <h6 style={{ textAlign: "center" }}> Add Branch </h6>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  <AddBranch
                                    dataClose={closeCustomizer}
                                    onUpdate={(data) => update(data)}
                                  />
                                </div>
                              </li>
                            </ul>
                          </TabPane> */}
                          <TabPane tabId="3">
                            <PermissionDetails
                            
                              lead={lead}
                              onUpdate={(data) => detailsUpdate(data)}
                              checkboxHandler={(data,lead) => checkboxHandler(data,lead)}
                              

                            />
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Row>
          </div>
        </Container>
      </Fragment>
    );
  };

  export default Permission;
