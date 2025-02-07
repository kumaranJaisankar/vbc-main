// // import React, { useState, useEffect } from 'react'
// // import { cloneDeep, includes, isEmpty } from 'lodash'
// // import moment from 'moment'
// // import { TestFranchiseFilterContent } from './TestFranchiseFilterContent'
// // import { TestFranchiseShowSelectedStrings } from './TestFranchiseShowSelectedStrings'

// // export const TestFranchiseFilterContainer = (props) => {
// //   const [options, setOptions] = useState([])
// //   const [optionKeys, setOptionKeys] = useState([])
// //   const [filterSelectionOptions, setFilterSelectionOptions] = useState({})
// //   const [filterDataBkp, setFilterDataBkp] = useState(props.filteredDataBkp)

// //   const [filterText, setFilterText] = useState({
// //     name: '',
// //   })

// //   useEffect(() => {
// //     applyFilter(isEmpty(options))
// //   }, [filterSelectionOptions])

// //   const onChangeHandler = (e, tableHeader, tableHeaderSubMenu, text) => {
// //     let stringToShow = text
// //     if (tableHeader === 'name') {
// //       stringToShow = 'Franchise Name ' + text + ' ' + filterText.name
// //     // } else if (tableHeader === 'name') {
// //     //   stringToShow = 'Name' + ' ' + text + ' ' + filterText.name
// //     }
// //     else if (tableHeader === 'type') {
// //       stringToShow = 'Type ' + ' ' + text
// //     }

// //     if (e.target.checked) {
// //       const optionArray = [
// //         ...options,
// //         {
// //           stringToShow: stringToShow,
// //           key: tableHeader + '.' + tableHeaderSubMenu,
// //         },
// //       ]
// //       setOptions(optionArray)
// //       // props.setoptionsOfFilter(optionArray);

// //       setOptionKeys([...optionKeys, tableHeader + '.' + tableHeaderSubMenu])

// //       filterSelectionOptionsFunc(
// //         true,
// //         filterSelectionOptions,
// //         tableHeader,
// //         tableHeaderSubMenu,
// //       )
// //     } else {
// //       const optionsArray = [...options]
// //       const optionsArrayFilter = optionsArray.filter(
// //         (option) => option.key !== tableHeader + '.' + tableHeaderSubMenu,
// //       )
// //       setOptions(optionsArrayFilter)
// //       // props.setoptionsOfFilter(optionsArrayFilter);

// //       let optionKeysArray = []
// //       if (optionKeys) {
// //         optionKeysArray = [...optionKeys]
// //       }
// //       const index = optionKeysArray.indexOf(
// //         tableHeader + '.' + tableHeaderSubMenu,
// //       )
// //       if (index > -1) {
// //         optionKeysArray.splice(index, 1)
// //       }
// //       setOptionKeys(optionKeysArray)

// //       filterSelectionOptionsFunc(
// //         false,
// //         filterSelectionOptions,
// //         tableHeader,
// //         tableHeaderSubMenu,
// //       )

// //       clearFilterText(optionsArrayFilter.map((a) => a.key))
// //     }
// //   }

// //   const filterSelectionOptionsFunc = (
// //     isAdd,
// //     filterSelectionOptions,
// //     tableHeader,
// //     tableHeaderSubMenu,
// //   ) => {
// //     const filterSelectionOptionsClone = cloneDeep(filterSelectionOptions)

// //     if (isAdd) {
// //       if (!filterSelectionOptionsClone[tableHeader]) {
// //         filterSelectionOptionsClone[tableHeader] = []
// //       }
// //       if (
// //         !includes(filterSelectionOptionsClone[tableHeader], tableHeaderSubMenu)
// //       ) {
// //         filterSelectionOptionsClone[tableHeader].push(tableHeaderSubMenu)
// //       }
// //       setFilterSelectionOptions(filterSelectionOptionsClone)
// //     } else {
// //       let filterSelectionOptionsArray = []
// //       if (filterSelectionOptions[tableHeader]) {
// //         filterSelectionOptionsArray = [...filterSelectionOptions[tableHeader]]
// //       }
// //       const index2 = filterSelectionOptionsArray.findIndex((item)=> item == tableHeaderSubMenu)
// //       if (index2 > -1) {
// //         filterSelectionOptionsArray.splice(index2, 1)
// //       }
// //       filterSelectionOptionsClone[tableHeader] = []
// //       filterSelectionOptionsClone[tableHeader].push(
// //         ...filterSelectionOptionsArray,
// //       )
// //       setFilterSelectionOptions(filterSelectionOptionsClone)
// //     }
// //   }

// //   const dateHandler = (date, tableHeader, tableHeaderSubMenu) => {
// //     const filterSelectionOptionsClone = cloneDeep(filterSelectionOptions)
// //     if (!filterSelectionOptionsClone[tableHeader]) {
// //       filterSelectionOptionsClone[tableHeader] = []
// //     }

// //     filterSelectionOptionsClone[tableHeader].push(tableHeaderSubMenu)
// //     setFilterSelectionOptions(filterSelectionOptionsClone)
// //     const formatDate = moment(date).format('DD-MM-YYYY')

// //     let optionsTemp = [...options]
// //     let indexOfOptionKey = optionsTemp.findIndex(
// //       (o) => o.key == tableHeader + '.' + tableHeaderSubMenu,
// //     )
// //     if (indexOfOptionKey >= 0) {
// //       optionsTemp[indexOfOptionKey] = {
// //         stringToShow:
// //           tableHeaderSubMenu.split('_').join(' ') + ' ' + formatDate,
// // 
// //       }
// //     } else {        key: tableHeader + '.' + tableHeaderSubMenu,
// //       optionsTemp.push({
// //         stringToShow:
// //           tableHeaderSubMenu.split('_').join(' ') + ' ' + formatDate,
// //         key: tableHeader + '.' + tableHeaderSubMenu,
// //       })
// //     }
// //     setOptions(optionsTemp)

// //     setOptionKeys([...optionKeys, tableHeader + '.' + tableHeaderSubMenu])
// //     // props.setoptionsOfFilter(options);
// //   }

// //   const clearAllFilter = () => {
// //     setOptions([])
// //     // props.setoptionsOfFilter([])
// //     setOptionKeys([])
// //     setFilterSelectionOptions({})
// //     setFilterText({
// //       name: '',
// //       // name: '',
// //       // created_date_from: '',
// //       // created_date_to: '',
// //     })
// //     props.setFiltereddata(props.filteredDataBkp)
// //     setFilterDataBkp(props.filteredData)
// //   }

// //   const applyFilter = (isEmptyData = false) => {
// //     let leadsClone = cloneDeep(props.filteredDataBkp)
// //     if (leadsClone) {
// //       let filterLeads = []
// //       for (let option in filterSelectionOptions) {
// //         for (let i = 0; i < filterSelectionOptions[option].length; i++) {
// //           let filterData = []
// //           if (option === 'name') {
// //             if (filterSelectionOptions.name[0] === 'includes') {
// //               filterData = leadsClone.filter(
// //                 (lead) => lead.name.indexOf(filterText.name) > -1,
// //               )
// //             } else {
// //               filterData = leadsClone.filter(
// //                 (lead) => lead.name.indexOf(filterText.name) === -1,
// //               )
// //             }
// //           }
// //            else if (option === 'name') {
// //             if (filterSelectionOptions.name[0] === 'includes') {
// //               filterData = leadsClone.filter(
// //                 (lead) => lead.name.indexOf(filterText.name) > -1,
// //               )
// //             } else {
// //               filterData = leadsClone.filter(
// //                 (lead) => lead.name.indexOf(filterText.name) === -1,
// //               )
// //             }
// //           }
// //           else if (option === 'type') {
// //             filterData = leadsClone.filter(
// //               (lead) => lead.type.id === filterSelectionOptions[option][i],
// //             )
// //           }

// //           filterLeads.push(...filterData)
// //         }
// //         if (option === 'created_at') {
// //           let from = filterText.created_date_from
// //           let to = filterText.created_date_to

// //           let filterDataCreated = leadsClone.filter(
// //             (lead) =>
// //               moment(lead.created_at).isBetween(moment(from), moment(to)) ||
// //               moment(lead.created_at).isSame(moment(from), 'day') ||
// //               moment(lead.created_at).isSame(moment(to), 'day'),
// //           )
// //           filterLeads.push(...filterDataCreated)
// //         }
// //       }

// //       props.setFiltereddata(isEmptyData ? leadsClone : filterLeads)
// //       props.setLoading(false)
// //       // props.setLevelMenu(false)
// //       setFilterDataBkp(isEmptyData ? leadsClone : filterLeads)
// //       console.log('filterDataBkp', filterDataBkp)
// //     }
// //   }

// //   const clearFilterText = (selectedKeys) => {
// //     if (selectedKeys) {
// //       let arrSplit1 = selectedKeys.map((a) => a.split('.')[0])
// //       let arrSplit2 = selectedKeys.map((a) => a.split('.'))

// //       let filterTextObj = { ...filterText }

// //       if (!arrSplit1.includes('name')) {
// //         filterTextObj['name'] = ''
// //       }
// //       if (!arrSplit1.includes('name')) {
// //         filterTextObj['name'] = ''
// //       }
// //       // if (!arrSplit1.includes('created_at')) {
// //       //   filterTextObj.created_date_from = ''
// //       //   filterTextObj.created_date_to = ''
// //       // }
// //       setFilterText(filterTextObj)
// //     }
// //   }

// import React, { useState, useEffect } from "react";
// import moment from "moment";
// import { cloneDeep, includes, isEmpty } from "lodash";
// import { TestFranchiseFilterContent } from "./TestFranchiseFilterContent";
// import { TestFranchiseShowSelectedStrings } from "./TestFranchiseShowSelectedStrings";

// export const TestFranchiseFilterContainer = (props) => {
//   const [options, setOptions] = useState([]);
//   const [optionKeys, setOptionKeys] = useState([]);
//   const [testFilterSelectionOptions, setTestFilterSelectionOptions] = useState({});
//   const [testFilterDataBkp, setTestFilterDataBkp] = useState(
//     props.testFilteredDataBkp
//   );
//   const [testFilterText, setTestFilterText] = useState({
//     name: "",
//   });

//   useEffect(() => {
//     TestApplyfilter(isEmpty(options));
//   }, [testFilterSelectionOptions]);

//   const onChangeTestHandler = (e, tableHeader, tableHeaderSubMenu, text) => {
//     let stringToShow = text;
//     if (tableHeader === "name") {
//       stringToShow = "Franchise Name" + text + "" + testFilterText.name;
//     } else if (tableHeader === "name") {
//       stringToShow = "Name" + "" + text;
//     }
//     if (e.target.checked) {
//       const optionArray = [...options,
//      {
//           stringToShow: stringToShow,
//           key: tableHeader + '' + tableHeaderSubMenu,
//       },
//     ]
//     setOptions(optionArray)
//     //props.setoptionsOfFilter(optionArray);
//     setOptionKeys([...optionKeys,tableHeader + '.' + tableHeaderSubMenu])
//     testFilterSelectionOptionsFunc(
//         true,
//         testFilterSelectionOptions,
//         tableHeader,
//         tableHeaderSubMenu
//         )
//     } else {
//         const optionsArray =[...options]
//         const optionsArrayFilter = optionsArray.filter(
//             (option) => option.key !== tableHeader + '.' + tableHeaderSubMenu,
//         )
//         setOptions(optionsArrayFilter)
//         //props.setoptionsOfFilter(optionsArrayFilter);
//         let optionKeysArray = []
//         if (optionKeys){
//             optionKeysArray = [...optionKeys]
//         }
//         const index = optionKeysArray.indexOf(
//             tableHeader + '.' + tableHeaderSubMenu,
//         )
//         if (index > -1){
//             optionKeysArray.splice(index, 1)
//         }
//         setOptionKeys(optionKeysArray)

//         testFilterSelectionOptionsFunc(
//             false,
//             testFilterSelectionOptions,
//             tableHeader,
//             tableHeaderSubMenu,
//         )
//         clearTestFilterText(optionsArrayFilter.map((a) => a.key))
//     } 
//   }

//   const testFilterSelectionOptionsFunc =(
//       isAdd,
//       testFilterSelectionOptions,
//       tableHeader,
//       tableHeaderSubMenu,
//   ) =>{
//       const testFilterSelectionOptionsClone = cloneDeep(testFilterSelectionOptions)

//       if(isAdd){
//           if(!testFilterSelectionOptionsClone[tableHeader]){
//             testFilterSelectionOptionsClone[tableHeader] = []
//           }
//           if(
//               !includes(testFilterSelectionOptionsClone[tableHeader],tableHeaderSubMenu)
//           ){
//             testFilterSelectionOptionsClone[tableHeader].push(tableHeaderSubMenu)
//           }
//           setTestFilterSelectionOptions(testFilterSelectionOptionsClone)
//       } else {
//           let testFilterSelectionOptionsArray = []
//           if(testFilterSelectionOptions[tableHeader]){
//               testFilterSelectionOptionsArray =[...testFilterSelectionOptions[tableHeader]]
//           }
//           const index2 = testFilterSelectionOptionsArray.findIndex((item)=> item == tableHeaderSubMenu)
//           if(index2 > -1){
//               testFilterSelectionOptionsArray.splice(index2, 1)
//           }
//           testFilterSelectionOptionsClone[tableHeader] = []
//           testFilterSelectionOptionsClone[tableHeader].push(
//               ...testFilterSelectionOptionsArray,
//           )
//           setTestFilterSelectionOptions(testFilterSelectionOptionsClone)
//       }
//   }

//    const dateHandler = (date, tableHeader, tableHeaderSubMenu) =>{
//        const testFilterSelectionOptionsClone = cloneDeep(testFilterSelectionOptions)
//        if(!testFilterSelectionOptionsClone[tableHeader]){
//         testFilterSelectionOptionsClone[tableHeader] = []
//        }
//        testFilterSelectionOptionsClone[tableHeader].push(tableHeaderSubMenu)
//        setTestFilterSelectionOptions(testFilterSelectionOptionsClone)
//        const formatDate = moment(date).format('DD-MM-YYYY')

//        let testOptionsTemp = [...options]
//        let indexOfOptionKey =  testOptionsTemp.findIndex(
//            (o) => o.key == tableHeader + '.' + tableHeaderSubMenu,
//        )
//        if(indexOfOptionKey >= 0){
//            testOptionsTemp[indexOfOptionKey]={
//            stringToShow:
//            tableHeaderSubMenu.split('_').join(' ') + ' ' + formatDate,
//            key: tableHeader + '.' + tableHeaderSubMenu,
//        }
//     } else{
//         testOptionsTemp.push({
//             stringToShow:
//             tableHeaderSubMenu.split('_').join(' ') + ' ' + formatDate,
//             key: tableHeader + '.' + tableHeaderSubMenu,
//         })
//     } 
//     setOptions(testOptionsTemp)
  
//      setOptionKeys([...optionKeys,tableHeader + '.' + tableHeaderSubMenu])
//     //  props.setOptionsOfFilter(options);
// }
//   const clearAllTestFilter = () => {
//     setOptions([]);
//     //props.setoptionsOfFilter([])
//     setOptionKeys([]);
//     setTestFilterSelectionOptions({});
//     setTestFilterText({
//       name: "",
//       // name : '',
//       // created_date_from: '',
//       // created_date_to: '',
//     });
//     props.setFiltereddata(props.testFilterDataBkp);
//     setTestFilterDataBkp(props.testFilterDataBkp);
//   };

//   const TestApplyfilter = (isEmptyData = false) => {
//     let leadsClone = cloneDeep(props.testFilteredDataBkp);
//     if (leadsClone) {
//       let filterLeads = [];
//       for (let options in testFilterSelectionOptions) {
//         for (let i = 0; i < testFilterSelectionOptions[options].length; i++) {
//           let filterData = [];
//           if (options == "name") {
//             if (testFilterSelectionOptions.name[0] == "includes") {
//               filterData = leadsClone.filter(
//                 (lead) => lead.name.indexOf(testFilterText.name) > -1
//               );
//             } else {
//               filterData = leadsClone.filter(
//                 (lead) => lead.name.indexOf(testFilterText) === -1
//               );
//             }
//           } else if (options === "name") {
//             if (testFilterSelectionOptions.name[0] == "inclues") {
//               filterData = leadsClone.filter(
//                 (lead) => lead.name.indexOf(testFilterText) > -1
//               );
//             } else {
//               filterData = leadsClone.filter(
//                 (lead) => lead.name.indexOf(testFilterText) === -1
//               );
//             }
//           } else if (options == "type") {
//             filterData = leadsClone.filter(
//               (lead) => lead.type.id === testFilterSelectionOptions[options][i]
//             );
//           }
//           filterLeads.push(...filterData);
//         }
//         if (options === "created_at") {
//           let from = testFilterText.created_at_from;
//           let to = testFilterText.created_at_to;

//           let filterDataCreated = leadsClone.filter(
//             (lead) =>
//               moment(lead.created_at).isBetween(moment(from), moment(to)) ||
//               moment(lead.created_at).isSame(moment(from), "day") ||
//               moment(lead.created_at).isSame(moment(from), "day")
//           );
//           filterLeads.push(...filterDataCreated);
//         }
//       }
//       props.setFiltereddata(isEmptyData ? leadsClone : filterLeads);
//       props.setLoading(false);
//       //  props.setLevelMenu(false)
//       setTestFilterDataBkp(isEmptyData ? leadsClone : filterLeads);
//       console.log("TestFilterDataBkp", testFilterDataBkp);
//     }
//   };

//   const clearTestFilterText = (selectedKeys) => {
//     if (selectedKeys) {
//       let arrSplit1 = selectedKeys.map((a) => a.split(".")[0]);
//       let arrSplit2 = selectedKeys.map((a) => a.split("."));
//       let filterTextObj = { ...testFilterText};

//       if (!arrSplit1.includes("name")) {
//         filterTextObj["name"] = "";
//       }
//       if (!arrSplit1.includes("name")) {
//         filterTextObj["name"] = "";
//       }
//       if (!arrSplit1.includes("created_at")) {
//         filterTextObj.created_date_from = "";
//         filterTextObj.created_date_to = "";
//       }
//       setTestFilterText(filterTextObj);
//     }
//   };

//   return (
//     <div style={{ position: "relative", right: "90px", top: "-15px" }}>
//       <TestFranchiseFilterContent
//         options={options}
//         setOptions={setOptions}
//         clearAllTestFilter={clearAllTestFilter}
//         TestApplyfilter={TestApplyfilter}
//         setOptionKeys={setOptionKeys}
//         optionKeys={optionKeys}
//         testFilterText={testFilterText}
//         setTestFilterText={setTestFilterText}
//         clearTestFilterText={clearTestFilterText}
//         testFilterSelectionOptions={testFilterSelectionOptions}
//         testFilterSelectionOptionsFunc={testFilterSelectionOptionsFunc}
//         setLevelMenu={props.setLevelMenu}
//         levelMenu={props.levelMenu}
//         showTypeahead={props.showTypeahead}
//         onChangeTestHandler={onChangeTestHandler}
//         dateHandler={dateHandler}
//         hideApply={true}
//         sourceby={props.sourceby}
//         franchiseType={props.franchiseType}
//       />
//       {options.length > 0 && (
//         <div
//           className="selected-options"
//           style={{ left: "-453px", top: "75px", zIndex: "0" }}
//         >
//           <TestFranchiseShowSelectedStrings
//             options={options}
//             setOptions={setOptions}
//             TestApplyfilter={TestApplyfilter}
//             clearAllTestFilter={clearAllTestFilter}
//             setOptionKeys={setOptionKeys}
//             testFilterText={testFilterText}
//             setTestFilterText={setTestFilterText}
//             clearTestFilterText={clearTestFilterText}
//             testFilterSelectionOptions={testFilterSelectionOptions}
//             testFilterSelectionOptionsFunc={testFilterSelectionOptionsFunc}
//             hideApply={true}
//           />
//         </div>
//       )}
//     </div>
//   );
// };
// // export default TestFranchiseFilterContainer;
