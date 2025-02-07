import React, { useState, useEffect } from "react";
import { cloneDeep, includes, isEmpty } from "lodash";
import moment from "moment";
import { CustomerFilterContent } from "./CustomerFilterContent";
import { CustomerShowSelectedStrings } from "./CustomerShowSelectedStrings";

export const CustomerFilterContainer = (props) => {
  const [options, setOptions] = useState([]);
  const [optionKeys, setOptionKeys] = useState([]);
  const [filterSelectionOptions, setFilterSelectionOptions] = useState({});
  const [filterDataBkp, setFilterDataBkp] = useState(props.filteredDataBkp);

  const [filterText, setFilterText] = useState({
    first_name: "",
    last_name: "",
    created_date_from: "",
    created_date_to: "",
  });

  useEffect(() => {
    applyFilter(isEmpty(options));
  }, [filterSelectionOptions, props.apiCallCount]);

  const onChangeHandler = (e, tableHeader, tableHeaderSubMenu, text) => {
    let stringToShow = text;
    if (tableHeader === "first_name") {
      stringToShow = "FIrst name " + text + " " + filterText.first_name;
    } else if (tableHeader === "last_name") {
      stringToShow = "Last Name" + " " + text + " " + filterText.last_name;
    } else if (tableHeader === "name") {
      stringToShow = "Branch" + " " + text;
    } else if (tableHeader === "name") {
      stringToShow = "Zone" + " " + text;
    } else if (tableHeader === "name") {
      stringToShow = "Area" + " " + text;
    }

    if (e.target.checked) {
      const optionArray = [
        ...options,
        {
          stringToShow: stringToShow,
          key: tableHeader + "." + tableHeaderSubMenu,
        },
      ];
      setOptions(optionArray);
      // props.setoptionsOfFilter(optionArray);

      setOptionKeys([...optionKeys, tableHeader + "." + tableHeaderSubMenu]);

      filterSelectionOptionsFunc(
        true,
        filterSelectionOptions,
        tableHeader,
        tableHeaderSubMenu
      );
    } else {
      const optionsArray = [...options];
      const optionsArrayFilter = optionsArray.filter(
        (option) => option.key !== tableHeader + "." + tableHeaderSubMenu
      );
      setOptions(optionsArrayFilter);
      // props.setoptionsOfFilter(optionsArrayFilter);

      let optionKeysArray = [];
      if (optionKeys) {
        optionKeysArray = [...optionKeys];
      }
      const index = optionKeysArray.indexOf(
        tableHeader + "." + tableHeaderSubMenu
      );
      if (index > -1) {
        optionKeysArray.splice(index, 1);
      }
      setOptionKeys(optionKeysArray);

      filterSelectionOptionsFunc(
        false,
        filterSelectionOptions,
        tableHeader,
        tableHeaderSubMenu
      );

      clearFilterText(optionsArrayFilter.map((a) => a.key));
    }
  };

  const filterSelectionOptionsFunc = (
    isAdd,
    filterSelectionOptions,
    tableHeader,
    tableHeaderSubMenu
  ) => {
    const filterSelectionOptionsClone = cloneDeep(filterSelectionOptions);

    if (isAdd) {
      if (!filterSelectionOptionsClone[tableHeader]) {
        filterSelectionOptionsClone[tableHeader] = [];
      }
      if (
        !includes(filterSelectionOptionsClone[tableHeader], tableHeaderSubMenu)
      ) {
        filterSelectionOptionsClone[tableHeader].push(tableHeaderSubMenu);
      }
      setFilterSelectionOptions(filterSelectionOptionsClone);
    } else {
      let filterSelectionOptionsArray = [];
      if (filterSelectionOptions[tableHeader]) {
        filterSelectionOptionsArray = [...filterSelectionOptions[tableHeader]];
      }
      const index2 = filterSelectionOptionsArray.findIndex(
        (item) => item == tableHeaderSubMenu
      );
      if (index2 > -1) {
        filterSelectionOptionsArray.splice(index2, 1);
      }
      filterSelectionOptionsClone[tableHeader] = [];
      filterSelectionOptionsClone[tableHeader].push(
        ...filterSelectionOptionsArray
      );
      setFilterSelectionOptions(filterSelectionOptionsClone);
      return filterSelectionOptionsClone;
    }
  };

  const dateHandler = (date, tableHeader, tableHeaderSubMenu) => {
    const filterSelectionOptionsClone = cloneDeep(filterSelectionOptions);
    if (!filterSelectionOptionsClone[tableHeader]) {
      filterSelectionOptionsClone[tableHeader] = [];
    }

    if (
      !filterSelectionOptionsClone[tableHeader].includes(tableHeaderSubMenu)
    ) {
      filterSelectionOptionsClone[tableHeader].push(tableHeaderSubMenu);
    }
    setFilterSelectionOptions(filterSelectionOptionsClone);
    const formatDate = moment(date).format("DD-MM-YYYY");

    let optionsTemp = [...options];
    let indexOfOptionKey = optionsTemp.findIndex(
      (o) => o.key == tableHeader + "." + tableHeaderSubMenu
    );
    if (indexOfOptionKey >= 0) {
      optionsTemp[indexOfOptionKey] = {
        stringToShow:
          tableHeaderSubMenu.split("_").join(" ") + " " + formatDate,
        key: tableHeader + "." + tableHeaderSubMenu,
      };
    } else {
      optionsTemp.push({
        stringToShow:
          tableHeaderSubMenu.split("_").join(" ") + " " + formatDate,
        key: tableHeader + "." + tableHeaderSubMenu,
      });
    }
    setOptions(optionsTemp);

    setOptionKeys([...optionKeys, tableHeader + "." + tableHeaderSubMenu]);
    // props.setoptionsOfFilter(options);
  };

  const onCreatedCheckboxChange = (e, tableHeader, tableHeaderSubMenu) => {
    const { name } = e.target;
    const checkboxNames = [
      "created_at.Active",
      "created_at.Expired",
      "created_at.Online",
    ];

    const filterSelectionOptionsClone = cloneDeep(filterSelectionOptions);
    if (!filterSelectionOptionsClone[tableHeader]) {
      filterSelectionOptionsClone[tableHeader] = [];
    }

    let optionsTemp = [...options];
    let optionkeysTemp = [...optionKeys];

    optionsTemp = optionsTemp.filter(
      (item) =>
        item.stringToShow !== "Active" &&
        item.stringToShow !== "Expired" &&
        item.stringToShow !== "Online"
    );

    optionkeysTemp = optionkeysTemp.filter(
      (item) => !checkboxNames.includes(item)
    );

    filterSelectionOptionsClone[tableHeader] = filterSelectionOptionsClone[
      tableHeader
    ].filter(
      (item) => item !== "Active" && item !== "Expired" && item !== "Online"
    );

    filterSelectionOptionsClone[tableHeader].push(tableHeaderSubMenu);

    optionsTemp.push({
      stringToShow: tableHeaderSubMenu,
      key: tableHeader + "." + tableHeaderSubMenu,
    });

    optionkeysTemp.push(tableHeader + "." + tableHeaderSubMenu);
    setOptions(optionsTemp);
    setOptionKeys(optionkeysTemp);
    setFilterSelectionOptions(filterSelectionOptionsClone);
  };

  const clearAllFilter = () => {
    setOptions([]);
    // props.setoptionsOfFilter([])
    setOptionKeys([]);
    setFilterSelectionOptions({});
    setFilterText({
      first_name: "",
      last_name: "",
      created_date_from: "",
      created_date_to: "",

zone:"",
area:"",
branch: "",
    });
    props.setFiltereddata(props.filteredDataBkp);
    setFilterDataBkp(props.filteredData);
  };

  const applyFilter = (isEmptyData = false) => {
    let leadsClone = cloneDeep(props.filteredDataBkp);
    if (leadsClone) {
      let filterLeads = [...leadsClone];
      for (let option in filterSelectionOptions) {
        let filterData = [];
        for (let i = 0; i < filterSelectionOptions[option].length; i++) {
          let filterData2 = [];

          if (option === "first_name") {
            if (filterSelectionOptions.first_name[0] === "includes") {
              filterData2 = filterLeads.filter(
                (lead) => lead.first_name.indexOf(filterText.first_name) > -1
              );
            } else {
              filterData2 = filterLeads.filter(
                (lead) => lead.first_name.indexOf(filterText.first_name) === -1
              );
            }
          } else if (option === "last_name") {
            if (filterSelectionOptions.last_name[0] === "includes") {
              filterData2 = filterLeads.filter(
                (lead) => lead.last_name.indexOf(filterText.last_name) > -1
              );
            } else {
              filterData2 = filterLeads.filter(
                (lead) => lead.last_name.indexOf(filterText.last_name) === -1
              );
            }
          } else if (option === "branch") {
            filterData2 = filterLeads.filter((lead) => {
              if (lead && lead.branch) {
                return lead.branch === filterSelectionOptions[option][i];
              }
            });
          } else if (option === "zone") {
            filterData2 = filterLeads.filter((lead) => {
              if (lead && lead.zone) {
                return lead.zone.id === filterSelectionOptions[option][i];
              }
            });
          } else if (option === "area") {
            filterData2 = filterLeads.filter(
              // (lead) =>{
              //   if (lead && lead.area){
              //     return lead.area === filterSelectionOptions[option][i];
              //   }
              // }
              (lead) => {
                if (lead && lead.area) {
                  return lead.area.id === filterSelectionOptions[option][i];
                }
              }
            );
          } else if (option === "created_at") {
            // if () {
            let from = "";
            if (filterSelectionOptions[option].includes("created_date_from")) {
              from = moment(filterText.created_date_from).startOf("day");
            }
            let to = moment();
            if (filterSelectionOptions[option].includes("created_date_to")) {
              to = moment(filterText.created_date_to).endOf("day");
            }

            debugger;
            let statusToBeFiltered = [];
            let active = filterSelectionOptions[option].includes("Active");
            active && statusToBeFiltered.push("ACT");
            let expired = filterSelectionOptions[option].includes("Expired");
            expired &&
              !props.showFilterInAllTab &&
              (function () {
                statusToBeFiltered.push("EXP");
                //added this code for expire for future use also
                statusToBeFiltered.push("ACT");
                //end
              })();
            expired &&
              props.showFilterInAllTab &&
              (function () {
                statusToBeFiltered.push("EXP");
              })();

            let online = filterSelectionOptions[option].includes("Online");
            online && statusToBeFiltered.push(null);

            filterData = from
              ? filterLeads.filter((lead) => {
                  let filterdate = expired ? lead.expiry_date : lead.created;
                  return (
                    moment(filterdate).isBetween(moment(from), moment(to)) ||
                    moment(filterdate).isSame(moment(from)) ||
                    moment(filterdate).isSame(moment(to))
                  );
                })
              : filterLeads;

            filterData =
              statusToBeFiltered.length > 0
                ? filterData.filter(
                    (lead) =>
                      statusToBeFiltered.includes(lead.account_status) ||
                      statusToBeFiltered.includes(lead.radius.acctstoptime)
                  )
                : filterData;
            filterLeads = filterData;

            // filterLeads.push(...filterDataCreated);
            // }
          }

          // else if (option === 'area') {
          //   filterData = leadsClone.filter(
          //     (lead) => lead.area.id === filterSelectionOptions[option][i],
          //   )
          // }

          // filterLeads.push(...filterData);
          // filterLeads = filterData;

          if (filterSelectionOptions[option].length - 1 == i) {
            filterLeads = [...filterData, ...filterData2];
          } else {
            filterData = [...filterData, ...filterData2];
          }
        }
      }

      props.setFiltereddata(isEmptyData ? leadsClone : filterLeads);
      props.setLoading(false);
      // props.setLevelMenu(false)
      setFilterDataBkp(isEmptyData ? leadsClone : filterLeads);
      // props.setData(isEmptyData ? leadsClone : filterLeads);
      console.log("filterDataBkp", filterDataBkp);
    }
  };

  const clearFilterText = (selectedKeys) => {
    if (selectedKeys) {
      let arrSplit1 = selectedKeys.map((a) => a.split(".")[0]);
      let arrSplit2 = selectedKeys.map((a) => a.split("."));

      let filterTextObj = { ...filterText };

      if (!arrSplit1.includes("first_name")) {
        filterTextObj["first_name"] = "";
      }
      if (!arrSplit1.includes("last_name")) {
        filterTextObj["last_name"] = "";
      }
      if (!arrSplit1.includes("created_at")) {
        filterTextObj.created_date_from = "";
        filterTextObj.created_date_to = "";
      }
      setFilterText(filterTextObj);
    }
  };

  const {
    showFilterInAllTab,
    setShowDateRadioButton,
    timeSelectionRadioButtonsComponent,
    setCurrentActiveOrExpired,
    clearAllFilterRadioButton
  } = props;

  return (
    <div style={{ position: "relative", right: "90px", top: "-15px" }}>
      <CustomerFilterContent
        options={options}
        setOptions={setOptions}
        clearAllFilter={clearAllFilter}
        applyFilter={applyFilter}
        setOptionKeys={setOptionKeys}
        optionKeys={optionKeys}
        filterText={filterText}
        setFilterText={setFilterText}
        clearFilterText={clearFilterText}
        filterSelectionOptions={filterSelectionOptions}
        filterSelectionOptionsFunc={filterSelectionOptionsFunc}
        setLevelMenu={props.setLevelMenu}
        levelMenu={props.levelMenu}
        showTypeahead={props.showTypeahead}
        onChangeHandler={onChangeHandler}
        dateHandler={dateHandler}
        onCreatedCheckboxChange={onCreatedCheckboxChange}
        hideApply={true}
        sourceby={props.sourceby}
        branch={props.branch}
        zone={props.zone}
        areaa={props.areaa}
        showFilterInAllTab={showFilterInAllTab}
        setShowDateRadioButton={setShowDateRadioButton}
        timeSelectionRadioButtonsComponent={timeSelectionRadioButtonsComponent}
        setCurrentActiveOrExpired={setCurrentActiveOrExpired}
        clearAllFilterRadioButton={clearAllFilterRadioButton}
      />
      {options.length > 0 && (
        <div
          className="selected-options"
          style={{ left: "-475px", top: "85px" }}
        >
          <CustomerShowSelectedStrings
            options={options}
            setOptions={setOptions}
            applyFilter={applyFilter}
            clearAllFilter={clearAllFilter}
            setOptionKeys={setOptionKeys}
            filterText={filterText}
            setFilterText={setFilterText}
            clearFilterText={clearFilterText}
            filterSelectionOptions={filterSelectionOptions}
            filterSelectionOptionsFunc={filterSelectionOptionsFunc}
            hideApply={true}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerFilterContainer;