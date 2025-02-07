import { useState, useCallback, useEffect } from "react";
import { helpdeskaxios } from "../axios";
import { useHistory, useLocation } from "react-router-dom";
import { getAppliedHelpdeskFiltersObj } from "../components/application/internaltickets/ticket.constants";
import moment from "moment";

const useDataTable = ({
  filterSchema = {},
  activeTab = "all",
  tabFilterName = "ticket_category",
  tabFilterName1 = "status",
  api,
  fetch,
  initialValues,

} = {}) => {
  const history = useHistory();
  const location = useLocation();
  const id = window.location.pathname.split("/").pop();
  const [reportsbranch, setReportsbranch] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [assigntoFilter, setAssignTOFIlter] = useState([]);
  //zone and area filter state
  const [zoneValue, setZoneValue] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [previousBranch, setPreviousBranch] = useState(null);
  const [sendFranchise, setSendFranchise] = useState(true);
  const [sendZone, setSendZone] = useState(true);
  const [sendArea, setSendArea] = useState(true);
  const handleBranchSelect = (event) => {
    setPreviousBranch(inputs.branch);
    setSendFranchise(false);
    setSendZone(false);
    setSendArea(false);
    // Update your 'inputs' state with the selected branch value
  };
  const [loader, setLoader] = useState(false);

  const handleFranchiseSelect = (event) => {
    setPreviousBranch(inputs.franchise);
    setSendFranchise(true);
    setSendZone(false);
    setSendArea(false);
    // Update your 'inputs' state with the selected franchise value
  };

  const handleZoneSelect = (event) => {
    setSendZone(true);
    setSendArea(false);
  };
  const handleAreaSelect = (event) => {
    setSendArea(true);
  };

  const [tableData, setTableData] = useState(
    {
      uiState: { loading: false },
      currentPageNo: 1,
      currentItemsPerPage: 10,
      pageLoadData: [],
      prevURI: null,
      nextURI: null,
      totalRows: 0,
      counts: null,
      tabCounts: {},
      currentTab: "all",
      appliedHelpdeskFilters: { ...getAppliedHelpdeskFiltersObj() },
    },
    location?.state?.billingDateRange
  );
  // /
  const [inputs, setInputs] = useState(initialValues);
  const [customstartdate, setCustomstartdate] = useState(location?.state?.pathFrom ==='complaintCard'?location?.state?.customstartdate: moment().format("YYYY-MM-DD"));
  const [customenddate, setCustomenddate] = useState(location?.state?.pathFrom ==='complaintCard'?location?.state?.customenddate : moment().format("YYYY-MM-DD"));

  const [loadingTable, setLoadingTable] = useState(false);
  const [appliedFilterSchema, setAppliedFilterSchema] = useState(filterSchema);

  const storageToken = localStorage.getItem("token");
  const token = JSON.parse(storageToken);

  let ShowAreas = false;
  if (
    (token && token.user_type === "Zonal Manager") ||
    (token && token.user_type === "Staff") ||
    (token && token.user_type === "Help Desk") ||
    (token && token.user_type === "Franchise Owner")
  ) {
    ShowAreas = true;
  }
  //   const getQueryParams = useCallback(
  //     (selectedTab, isPageLimit = true) => {
  //       const { currentPageNo, currentItemsPerPage, appliedHelpdeskFilters } =
  //         tableData;

  //       //   let queryParams = "";
  //       // if (currentItemsPerPage) {
  //       //     queryParams += `limit=${currentItemsPerPage}`;
  //       //   }
  //       //   if (currentPageNo) {
  //       //     queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
  //       //   }
  //       // let queryParams = `?limit=${currentItemsPerPage}&page=${currentPageNo}`;
  //       let queryParams = "";
  //       if (currentItemsPerPage && isPageLimit) {
  //         queryParams += `limit=${currentItemsPerPage}`;
  //       }
  //       if (currentPageNo && isPageLimit) {
  //         queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
  //       }


  //       // if (selectedTab !== "all") {
  //       //   queryParams += `&${tabFilterName1}=${selectedTab}`;
  //       // }

  //       if (selectedTab == "all") {
  //         queryParams += ``;
  //       }else if(selectedTab == "opn" || selectedTab == "inp" || selectedTab == "asn" || selectedTab == "rsl" ||selectedTab == "cld") {
  //         queryParams += `&status=${selectedTab}`;
  //       }

  //       // query params for closed date

  //       //end


  //       // category list
  //       if (inputs && inputs.catrgoryLists === "ALL1") {
  //         queryParams += ``;
  //       } else if (inputs && inputs.catrgoryLists) {
  //         queryParams += `&${tabFilterName}=${inputs.catrgoryLists}`;
  //       }

  //       //  subcat

  //       if (inputs && inputs.subcatlists === "ALL2") {
  //         queryParams += ``;
  //       } else if (inputs && inputs.subcatlists) {
  //         queryParams += `&subcategory=${inputs.subcatlists}`;
  //       }

  //       // status

  //       if (inputs && inputs.status === "ALL3") {
  //         queryParams += ``;
  //       } else if (inputs && inputs.status) {
  //         queryParams += `&status=${inputs.status}`;
  //       }
  //       // priority
  //       if (inputs && inputs.priority === "ALL4") {
  //         queryParams += ``;
  //       } else if (inputs && inputs.priority) {
  //         queryParams += `&priority_sla=${inputs.priority}`;
  //       }

  //       // branch
  //       if (inputs && inputs.branch === "ALL5") {
  //         queryParams += ``;
  //       } else if (inputs && inputs.branch) {
  //         queryParams += `&branch=${inputs.branch}`;
  //       }
  //       // franchise
  //       if (inputs && inputs.franchiselistt === "ALL6") {
  //         queryParams += ``;
  //       } else if (inputs && inputs.franchiselistt && sendFranchise) {
  //         queryParams += `&franchise=${inputs.franchiselistt}`;
  //       }

  //       // zone
  //       if (inputs && inputs.zone === "ALL7") {
  //         queryParams += ``;
  //       } else if (ShowAreas && inputs && inputs.zone ) {
  //         queryParams += `&zone=${zoneValue}`;
  //       } else if (inputs && inputs.zone && sendZone) {
  //         queryParams += `&zone=${inputs.zone}`;
  //       }


  //       // area

  //       // zone
  //       if (inputs && inputs.area === "ALL8") {
  //         queryParams += ``;
  //       } else if (inputs && inputs.area && sendArea) {
  //         queryParams += `&area=${inputs.area}`;
  //       }



  //       // assign to
  //       if (inputs && inputs.assign === "ALL10") {
  //         queryParams += ``;
  //       } else if (inputs && inputs.assign) {
  //         queryParams += `&assigned=${inputs.assign}`;
  //       }

  //       //quer params for Technician Comment 
  //       if (inputs && inputs.technician_comment === "ALL11") {
  //         queryParams += ``;
  //       } else if (inputs && inputs.technician_comment) {
  //         queryParams += `&technician_comment=${inputs.technician_comment}`;
  //       }



  //       //end
  //       // query params for open date
  //       // if (customstartdate && inputs && inputs.date === "open_date" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day" &&  inputs.resolved_date_end != "3_day" && inputs.resolved_date_end != "greater_than_3") {
  //       //   queryParams += `${queryParams ? "&" : ""}open_date=${customstartdate}`;
  //       // } else if (customstartdate && inputs && inputs.date === "closed_date" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day" &&  inputs.resolved_date_end != "3_day" && inputs.resolved_date_end != "greater_than_3") {
  //       //   queryParams += `${queryParams ? "&" : ""
  //       //     }closed_date=${customstartdate}`;
  //       // } 
  //       // else if( inputs &&  inputs.date === "open_date" && inputs.resolved_date_end === "greater_than_3"){
  //       //   queryParams += `${
  //       //     queryParams ? "&" : ""
  //       //   }d1=${customstartdate}`;
  //       // }
  //       // else if (customstartdate && inputs && inputs.date === "both") {
  //       //   queryParams += `${queryParams ? "&" : ""
  //       //     }closed_date=${customstartdate}`;
  //       //   queryParams += `${queryParams ? "&" : ""}open_date=${customstartdate}`;
  //       // } 
  //       // else if (customstartdate) {
  //       //   queryParams += `${queryParams ? "&" : ""
  //       //     }created_date=${customstartdate}`;
  //       // } else if (
  //       //   moment().format("YYYY-MM-DD") &&
  //       //   inputs &&
  //       //   inputs.date === "open_date"
  //       // ) {
  //       //   queryParams += `${
  //       //     queryParams ? "&" : ""
  //       //   }open_date_end=${moment().format("YYYY-MM-DD")}`;
  //       // }  else if (
  //       //   moment().format("YYYY-MM-DD") &&
  //       //   inputs &&
  //       //   inputs.date === "closed_date"
  //       // ) {
  //       //   queryParams += `${
  //       //     queryParams ? "&" : ""
  //       //   }closed_date_end=${moment().format("YYYY-MM-DD")}`;
  //       // } 

  // //open date query params
  // if (customstartdate && inputs && inputs.date === "open_date"&& inputs.resolved_date_end != "greater_than_3" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day"&& inputs.resolved_date_end != "3_day") {
  //   queryParams += `${queryParams ? "&" : ""}open_date=${customstartdate}`; 
  // }

  // else if (customstartdate && inputs && inputs.date === "closed_date") {
  //   queryParams += `${queryParams ? "&" : ""
  //     }closed_date=${customstartdate}`;
  //   } else if( customstartdate && inputs && inputs.date == "open_date" && inputs.resolved_date_end === "greater_than_3"){
  //     queryParams += `${
  //       queryParams ? "&" : ""
  //     }d1=${customstartdate}`;
  //   }else if( customstartdate && inputs && inputs.date === "open_date" && inputs.resolved_date_end === "1_day"){
  //     queryParams += `${
  //       queryParams ? "&" : ""
  //     }d1=${customstartdate}`;
  //   }
  //   else if( customstartdate && inputs && inputs.date == "open_date" && inputs.resolved_date_end === "2_day"){
  //     queryParams += `${
  //       queryParams ? "&" : ""
  //     }d1=${customstartdate}`;
  //   }else if( customstartdate && inputs && inputs.date == "open_date" && inputs.resolved_date_end === "3_day"){
  //     queryParams += `${
  //       queryParams ? "&" : ""
  //     }d1=${customstartdate}`;
  //   }
  //   // else if (customstartdate  && inputs && inputs.date === "open_date" && inputs.resolved_date_end === "1_day" && inputs.daterange != "yesterday" && inputs.daterange != "lastweek") {
  //   //   queryParams += `${queryParams ? "&" : ""}open_date=${customstartdate}`;

  //   // }
  //   else if (customstartdate ) {
  //   queryParams += `${queryParams ? "&" : ""
  //     }created_date=${customstartdate}`;
  // } else if (
  //   moment().format("YYYY-MM-DD") &&
  //   inputs &&
  //   inputs.date === "open_date"
  // ) {
  //   queryParams += `${
  //     queryParams ? "&" : ""
  //   }open_date_end=${moment().format("YYYY-MM-DD")}`;
  // }  else if (
  //   moment().format("YYYY-MM-DD") &&
  //   inputs &&
  //   inputs.date === "closed_date"
  // ) {
  //   queryParams += `${
  //     queryParams ? "&" : ""
  //   }closed_date_end=${moment().format("YYYY-MM-DD")}`;
  // } 
  // //end



  //       // query params for open end date
  //       if (customenddate && inputs && inputs.date === "open_date" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day" &&  inputs.resolved_date_end != "3_day" && inputs.resolved_date_end != "greater_than_3") {
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }open_date_end=${customenddate}`; 
  //       }else if (customenddate && inputs && inputs.date === "closed_date" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day" &&  inputs.resolved_date_end != "3_day" && inputs.resolved_date_end != "greater_than_3") {
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }closed_date_end=${customenddate}`;
  //       }   else if(  inputs &&  inputs.date === "open_date" && inputs.resolved_date_end === "1_day"  ){
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }d2=${moment(customenddate).format("YYYY-MM-DD")}`
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }days=${1}`;
  //       }
  //        else if( inputs &&  inputs.date === "open_date" && inputs.resolved_date_end === "2_day"  ){
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }d2=${moment(customenddate).format("YYYY-MM-DD")}`
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }days=${2}`;
  //       } else if(  inputs &&  inputs.date === "open_date" && inputs.resolved_date_end === "3_day"  ){
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }d2=${moment(customenddate).format("YYYY-MM-DD")}`
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }days=${3}`;
  //       } else if( inputs &&  inputs.date === "open_date" && inputs.resolved_date_end === "greater_than_3"){
  //           queryParams += `${
  //             queryParams ? "&" : ""
  //           }d2=${customenddate}`;
  //           queryParams += `${
  //             queryParams ? "&" : ""
  //           }days=${4}`;
  //         } else if (customenddate) {
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }created_date_end=${customenddate}`;
  //       }  else if (moment().format("YYYY-MM-DD") && inputs &&inputs.resolved_date_end === "1_day"){
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }days=${1}`;
  //       }  else if (moment().format("YYYY-MM-DD") && inputs &&inputs.resolved_date_end === "2_day"){
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }days=${2}`;
  //       }  else if (moment().format("YYYY-MM-DD") && inputs &&inputs.resolved_date_end === "3_day"){
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }days=${3}`;
  //       } else if (moment().format("YYYY-MM-DD") && inputs &&inputs.resolved_date_end === "greater_than_3"){
  //         queryParams += `${
  //           queryParams ? "&" : ""
  //         }days=${4}`;
  //       } 
  // //end





  //       if (customenddate) {
  //         queryParams += ``;
  //       } else if (location?.state?.customenddate) {
  //         queryParams += `&created_date_end=${location?.state?.customenddate}`;
  //       }
  //       Object.keys(appliedFilterSchema).forEach((item) => {
  //         const filterType = appliedFilterSchema[item]?.type;
  //         if (filterType === "array") {
  //           if (appliedFilterSchema[item]?.results.length > 0) {
  //             queryParams += `&${item}=${appliedFilterSchema[item]?.results
  //               .map((item) => item.id)
  //               .join(",")}`;
  //           }
  //         }
  //         if (filterType === "date" || filterType === "string") {
  //           if (appliedFilterSchema[item]?.strVal) {
  //             queryParams += `&${item}=${appliedFilterSchema[item]?.strVal}`;
  //           }
  //         }

  //       });
  //       // if (appliedHelpdeskFilters.open_for.value.strVal) {
  //       //   queryParams += `${queryParams ? "&" : ""}open_for=${appliedHelpdeskFilters.open_for.value.strVal} `;
  //       // }
  //       if (appliedHelpdeskFilters.open_for.value.strVal) {
  //         queryParams += `${queryParams ? "&" : ""}${appliedHelpdeskFilters.open_for.value.name
  //           }=${appliedHelpdeskFilters.open_for.value.strVal}`;
  //       }
  //       return queryParams;
  //     },
  //     [tableData, appliedFilterSchema, inputs, customstartdate, customenddate]
  //   );

  const getQueryParams1 = () => {
    const {
      currentPageNo,
      currentItemsPerPage, appliedHelpdeskFilters
    } = tableData;

    let queryParams = "";

    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }




    if (activeTab == "all") {
      queryParams += ``;
    }
    else if (activeTab == "opn" || activeTab == "inp" || activeTab == "asn" || activeTab == "rsl" || activeTab == "cld") {
      queryParams += `&status=${activeTab}`;
    }

    if (inputs && inputs.catrgoryLists === "ALL1") {
      queryParams += ``;
    } else if (inputs && inputs.catrgoryLists) {
      queryParams += `&${tabFilterName}=${inputs.catrgoryLists}`;
    }

    //  subcat

    if (inputs && inputs.subcatlists === "ALL2") {
      queryParams += ``;
    } else if (inputs && inputs.subcatlists) {
      queryParams += `&subcategory=${inputs.subcatlists}`;
    }

    // status

    if (inputs && inputs.status === "ALL3") {
      queryParams += ``;
    } else if (inputs && inputs.status) {
      queryParams += `&status=${inputs.status}`;
    }
    // priority
    if (inputs && inputs.priority === "ALL4") {
      queryParams += ``;
    } else if (inputs && inputs.priority) {
      queryParams += `&priority_sla=${inputs.priority}`;
    }

    // branch
    if (inputs && inputs.branch === "ALL5") {
      queryParams += ``;
    } else if (inputs && inputs.branch) {
      queryParams += `&branch=${inputs.branch}`;
    }
    // franchise
    if (inputs && inputs.franchiselistt === "ALL6") {
      queryParams += ``;
    } else if (inputs && inputs.franchiselistt && sendFranchise) {
      queryParams += `&franchise=${inputs.franchiselistt}`;
    }

    // zone
    if (inputs && inputs.zone === "ALL7") {
      queryParams += ``;
    } else if (ShowAreas && inputs && inputs.zone) {
      queryParams += `&zone=${zoneValue}`;
    } else if (inputs && inputs.zone && sendZone) {
      queryParams += `&zone=${inputs.zone}`;
    }


    // area

    // zone
    if (inputs && inputs.area === "ALL8") {
      queryParams += ``;
    } else if (inputs && inputs.area && sendArea) {
      queryParams += `&area=${inputs.area}`;
    }



    // assign to
    if (inputs && inputs.assign === "ALL10") {
      queryParams += ``;
    } else if (inputs && inputs.assign) {
      queryParams += `&assigned=${inputs.assign}`;
    }

    //quer params for Technician Comment 
    if (inputs && inputs.technician_comment === "ALL11") {
      queryParams += ``;
    } else if (inputs && inputs.technician_comment) {
      queryParams += `&technician_comment=${inputs.technician_comment}`;
    }



    //end
    // query params for open date
    // if (customstartdate && inputs && inputs.date === "open_date" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day" &&  inputs.resolved_date_end != "3_day" && inputs.resolved_date_end != "greater_than_3") {
    //   queryParams += `${queryParams ? "&" : ""}open_date=${customstartdate}`;
    // } else if (customstartdate && inputs && inputs.date === "closed_date" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day" &&  inputs.resolved_date_end != "3_day" && inputs.resolved_date_end != "greater_than_3") {
    //   queryParams += `${queryParams ? "&" : ""
    //     }closed_date=${customstartdate}`;
    // } 
    // else if( inputs &&  inputs.date === "open_date" && inputs.resolved_date_end === "greater_than_3"){
    //   queryParams += `${
    //     queryParams ? "&" : ""
    //   }d1=${customstartdate}`;
    // }
    // else if (customstartdate && inputs && inputs.date === "both") {
    //   queryParams += `${queryParams ? "&" : ""
    //     }closed_date=${customstartdate}`;
    //   queryParams += `${queryParams ? "&" : ""}open_date=${customstartdate}`;
    // } 
    // else if (customstartdate) {
    //   queryParams += `${queryParams ? "&" : ""
    //     }created_date=${customstartdate}`;
    // } else if (
    //   moment().format("YYYY-MM-DD") &&
    //   inputs &&
    //   inputs.date === "open_date"
    // ) {
    //   queryParams += `${
    //     queryParams ? "&" : ""
    //   }open_date_end=${moment().format("YYYY-MM-DD")}`;
    // }  else if (
    //   moment().format("YYYY-MM-DD") &&
    //   inputs &&
    //   inputs.date === "closed_date"
    // ) {
    //   queryParams += `${
    //     queryParams ? "&" : ""
    //   }closed_date_end=${moment().format("YYYY-MM-DD")}`;
    // } 

    //open date query params
    if (customstartdate && inputs && inputs.date === "open_date" && inputs.resolved_date_end != "greater_than_3" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day" && inputs.resolved_date_end != "3_day") {
      queryParams += `${queryParams ? "&" : ""}open_date=${customstartdate}`;
    }

    else if (customstartdate && inputs && inputs.date === "closed_date") {
      queryParams += `${queryParams ? "&" : ""
        }closed_date=${customstartdate}`;
    } else if (customstartdate && inputs && inputs.date == "open_date" && inputs.resolved_date_end === "greater_than_3") {
      queryParams += `${queryParams ? "&" : ""
        }d1=${customstartdate}`;
    } else if (customstartdate && inputs && inputs.date === "open_date" && inputs.resolved_date_end === "1_day") {
      queryParams += `${queryParams ? "&" : ""
        }d1=${customstartdate}`;
    }
    else if (customstartdate && inputs && inputs.date == "open_date" && inputs.resolved_date_end === "2_day") {
      queryParams += `${queryParams ? "&" : ""
        }d1=${customstartdate}`;
    } else if (customstartdate && inputs && inputs.date == "open_date" && inputs.resolved_date_end === "3_day") {
      queryParams += `${queryParams ? "&" : ""
        }d1=${customstartdate}`;
    }
    // else if (customstartdate  && inputs && inputs.date === "open_date" && inputs.resolved_date_end === "1_day" && inputs.daterange != "yesterday" && inputs.daterange != "lastweek") {
    //   queryParams += `${queryParams ? "&" : ""}open_date=${customstartdate}`;

    // }
    else if (customstartdate) {
      queryParams += `${queryParams ? "&" : ""
        }created_date=${customstartdate}`;
    } else if (
      moment().format("YYYY-MM-DD") &&
      inputs &&
      inputs.date === "open_date"
    ) {
      queryParams += `${queryParams ? "&" : ""
        }open_date_end=${moment().format("YYYY-MM-DD")}`;
    } else if (
      moment().format("YYYY-MM-DD") &&
      inputs &&
      inputs.date === "closed_date"
    ) {
      queryParams += `${queryParams ? "&" : ""
        }closed_date_end=${moment().format("YYYY-MM-DD")}`;
    }
    //end



    // query params for open end date
    if (customenddate && inputs && inputs.date === "open_date" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day" && inputs.resolved_date_end != "3_day" && inputs.resolved_date_end != "greater_than_3") {
      queryParams += `${queryParams ? "&" : ""
        }open_date_end=${customenddate}`;
    } else if (customenddate && inputs && inputs.date === "closed_date" && inputs.resolved_date_end != "1_day" && inputs.resolved_date_end != "2_day" && inputs.resolved_date_end != "3_day" && inputs.resolved_date_end != "greater_than_3") {
      queryParams += `${queryParams ? "&" : ""
        }closed_date_end=${customenddate}`;
    } else if (inputs && inputs.date === "open_date" && inputs.resolved_date_end === "1_day") {
      queryParams += `${queryParams ? "&" : ""
        }d2=${moment(customenddate).format("YYYY-MM-DD")}`
      queryParams += `${queryParams ? "&" : ""
        }days=${1}`;
    }
    else if (inputs && inputs.date === "open_date" && inputs.resolved_date_end === "2_day") {
      queryParams += `${queryParams ? "&" : ""
        }d2=${moment(customenddate).format("YYYY-MM-DD")}`
      queryParams += `${queryParams ? "&" : ""
        }days=${2}`;
    } else if (inputs && inputs.date === "open_date" && inputs.resolved_date_end === "3_day") {
      queryParams += `${queryParams ? "&" : ""
        }d2=${moment(customenddate).format("YYYY-MM-DD")}`
      queryParams += `${queryParams ? "&" : ""
        }days=${3}`;
    } else if (inputs && inputs.date === "open_date" && inputs.resolved_date_end === "greater_than_3") {
      queryParams += `${queryParams ? "&" : ""
        }d2=${customenddate}`;
      queryParams += `${queryParams ? "&" : ""
        }days=${4}`;
    } else if (customenddate) {
      queryParams += `${queryParams ? "&" : ""
        }created_date_end=${customenddate}`;
    } else if (moment().format("YYYY-MM-DD") && inputs && inputs.resolved_date_end === "1_day") {
      queryParams += `${queryParams ? "&" : ""
        }days=${1}`;
    } else if (moment().format("YYYY-MM-DD") && inputs && inputs.resolved_date_end === "2_day") {
      queryParams += `${queryParams ? "&" : ""
        }days=${2}`;
    } else if (moment().format("YYYY-MM-DD") && inputs && inputs.resolved_date_end === "3_day") {
      queryParams += `${queryParams ? "&" : ""
        }days=${3}`;
    } else if (moment().format("YYYY-MM-DD") && inputs && inputs.resolved_date_end === "greater_than_3") {
      queryParams += `${queryParams ? "&" : ""
        }days=${4}`;
    }
    //end





    if (customenddate) {
      queryParams += ``;
    } else if (location?.state?.customenddate) {
      queryParams += `&created_date_end=${location?.state?.customenddate}`;
    }
    Object.keys(appliedFilterSchema).forEach((item) => {
      const filterType = appliedFilterSchema[item]?.type;
      if (filterType === "array") {
        if (appliedFilterSchema[item]?.results.length > 0) {
          queryParams += `&${item}=${appliedFilterSchema[item]?.results
            .map((item) => item.id)
            .join(",")}`;
        }
      }
      if (filterType === "date" || filterType === "string") {
        if (appliedFilterSchema[item]?.strVal) {
          queryParams += `&${item}=${appliedFilterSchema[item]?.strVal}`;
        }
      }

    });
    // if (appliedHelpdeskFilters.open_for.value.strVal) {
    //   queryParams += `${queryParams ? "&" : ""}open_for=${appliedHelpdeskFilters.open_for.value.strVal} `;
    // }
    if (appliedHelpdeskFilters.open_for.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}${appliedHelpdeskFilters.open_for.value.name
        }=${appliedHelpdeskFilters.open_for.value.strVal}`;
    }

    return queryParams;
  };

  // conut api call
  const [complaiCount, setComplaintCount] = useState({})
  useEffect(() => {
    const queryParams = getQueryParams1();
    console.log(queryParams, "queryParams")
    helpdeskaxios.get(`v2/enh/list/count?tabs=opn,asn,cld,inp,rsl&${queryParams}`).then((res) => {
      setComplaintCount(res.data?.context)
    })
  }, [])



  const handleSearch = (myArray) => {
    const queryParams = getQueryParams1();
    helpdeskaxios
      .get(`v2/enh/list/count?tabs=opn,asn,cld,inp,rsl&${queryParams}`)
      .then((res) => {
        setComplaintCount(res?.data?.context, "countss");
        console.log(myArray); // log the array passed to handleSearch
      });
  };
  const myArray = [inputs,
    customstartdate,
    customenddate,];

  // const fetchTableData = useCallback(

  //   async (selectedTab) => {
  //     // setLoadingTable(true);
  //     // setLoading(true);
  //     setLoader(true);
  //     const queryParams = getQueryParams(selectedTab);
  //     setTableData((prevState) => ({
  //       ...prevState,
  //       uiState: {
  //         loading: true,
  //       },
  //     }))
  //     const response = await fetch
  //       .get(`${api}?${queryParams}`)

  //       .then((response) => {
  //         setLoader(false);
  //         const { data } = response;
  //         const {
  //           counts,
  //           count,
  //           next,
  //           previous,
  //           page,
  //           results,
  //           status_counts,
  //         } = data;

  //         setTableData((previousTableData) => ({
  //           ...previousTableData,
  //           currentPageNo: page,
  //           tabCounts: { ...counts },
  //           pageLoadData: [...results],
  //           prevURI: previous,
  //           nextURI: next,
  //           pageLoadDataForFilter: [...results],
  //           totalRows: count,
  //           counts,
  //           tabCounts: { ...status_counts },
  //           uiState: {
  //             loading: false,
  //           },
  //         }));
  //       })
  //       .catch((error) => {
  //         setLoader(false);
  //         setTableData((previousTableData) => ({
  //           ...previousTableData,
  //           currentPageNo: 1,
  //           currentItemsPerPage: 10,
  //           pageLoadData: [],
  //           pageLoadDataForFilter: [],
  //           prevURI: null,
  //           nextURI: null,
  //         }))

  //       });
  //     //   setLoading(false);
  //     // setLoadingTable(false);
  //   },
  //   [getQueryParams, setTableData,  api, setInputs]
  // );




  const fetchTableData = () => {
    setTableData((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams1();

    helpdeskaxios
      .get(`${api}?${queryParams}`)
      .then((response) => {
        // props.setTotalCount(response.data)
        const { count, counts, next, previous, page, results } = response.data;
        setTableData((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: count,
        }));
        setTableData((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: count,
        }));
      })
      .catch(function (error) {

      })
      .finally(function () {
        setTableData((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };
  useEffect(() => {
    fetchTableData(activeTab);
  }, [
    tableData.currentItemsPerPage,
    tableData.currentPageNo,
    appliedFilterSchema,
    activeTab,
    tableData.appliedHelpdeskFilters,
    // inputs,
    // customstartdate,
    // customenddate,
  ]);

  const handlePageChange = useCallback(
    (page) =>
      setTableData((previousTableData) => ({
        ...previousTableData,
        currentPageNo: page,
      })),
    []
  );

  const handlePerRowsChange = useCallback(
    (newPerPage, page) =>
      setTableData((previousTableData) => ({
        ...previousTableData,
        currentPageNo: page,
        currentItemsPerPage: newPerPage,
      })),
    []
  );

  return {
    tableData,
    loadingTable,
    appliedFilterSchema,
    fetchTableData,
    myArray,
    handleSearch,
    setAppliedFilterSchema,
    handlePageChange,
    handlePerRowsChange,
    getQueryParams1,
    setTableData,
    // debouncedChangeHandler,
    setReportsbranch,
    reportsbranch,
    activeTab,
    categoryList,
    setCategoryList,
    inputs,
    setInputs,
    customstartdate,
    customenddate,
    setCustomstartdate,
    setCustomenddate,
    setAssignTOFIlter,
    assigntoFilter,
    zoneValue,
    setZoneValue,
    ShowAreas,
    complaiCount,
    handleBranchSelect,
    handleFranchiseSelect,
    handleZoneSelect,
    handleAreaSelect,
    loader, setLoader
    // setLoading,
    // loading
  };
};

export default useDataTable;
