import React, { useState, useEffect } from 'react'
import { cloneDeep, includes, isEmpty } from 'lodash'
import moment from 'moment'
import { BranchFilterContent } from './BranchFilterContent'
import { BranchShowSelectedStrings } from './BranchShowSelectedStrings'

export const BranchFilterContainer = (props) => {
  const [options, setOptions] = useState([])
  const [optionKeys, setOptionKeys] = useState([])
  const [filterSelectionOptions, setFilterSelectionOptions] = useState({})
  const [filterDataBkp, setFilterDataBkp] = useState(props.filteredDataBkp)

  const [filterText, setFilterText] = useState({
    // mobile: '',
    name: '',
  })

  useEffect(() => {
    applyFilter(isEmpty(options))
  }, [filterSelectionOptions])

  const onChangeHandler = (e, tableHeader, tableHeaderSubMenu, text) => {
    let stringToShow = text
    // if (tableHeader === 'mobile') {
    //   stringToShow = 'Mobile No.' + text + ' ' + filterText.mobile
    // } else 
    if (tableHeader === 'name') {
      stringToShow = 'Name' + ' ' + text + ' ' + filterText.name
    } 
    // else if (tableHeader === 'lead_source') {
    //   stringToShow = 'Lead Source' + ' ' + text
    // }

    if (e.target.checked) {
      const optionArray = [
        ...options,
        {
          stringToShow: stringToShow,
          key: tableHeader + '.' + tableHeaderSubMenu,
        },
      ]
      setOptions(optionArray)
      // props.setoptionsOfFilter(optionArray);

      setOptionKeys([...optionKeys, tableHeader + '.' + tableHeaderSubMenu])

      filterSelectionOptionsFunc(
        true,
        filterSelectionOptions,
        tableHeader,
        tableHeaderSubMenu,
      )
    } else {
      const optionsArray = [...options]
      const optionsArrayFilter = optionsArray.filter(
        (option) => option.key !== tableHeader + '.' + tableHeaderSubMenu,
      )
      setOptions(optionsArrayFilter)
      // props.setoptionsOfFilter(optionsArrayFilter);

      let optionKeysArray = []
      if (optionKeys) {
        optionKeysArray = [...optionKeys]
      }
      const index = optionKeysArray.indexOf(
        tableHeader + '.' + tableHeaderSubMenu,
      )
      if (index > -1) {
        optionKeysArray.splice(index, 1)
      }
      setOptionKeys(optionKeysArray)

      filterSelectionOptionsFunc(
        false,
        filterSelectionOptions,
        tableHeader,
        tableHeaderSubMenu,
      )

      clearFilterText(optionsArrayFilter.map((a) => a.key))
    }
  }

  const filterSelectionOptionsFunc = (
    isAdd,
    filterSelectionOptions,
    tableHeader,
    tableHeaderSubMenu,
  ) => {
    const filterSelectionOptionsClone = cloneDeep(filterSelectionOptions)

    if (isAdd) {
      if (!filterSelectionOptionsClone[tableHeader]) {
        filterSelectionOptionsClone[tableHeader] = []
      }
      if (
        !includes(filterSelectionOptionsClone[tableHeader], tableHeaderSubMenu)
      ) {
        filterSelectionOptionsClone[tableHeader].push(tableHeaderSubMenu)
      }
      setFilterSelectionOptions(filterSelectionOptionsClone)
    } else {
      let filterSelectionOptionsArray = []
      if (filterSelectionOptions[tableHeader]) {
        filterSelectionOptionsArray = [...filterSelectionOptions[tableHeader]]
      }
      const index2 = filterSelectionOptionsArray.indexOf(tableHeaderSubMenu)
      if (index2 > -1) {
        filterSelectionOptionsArray.splice(index2, 1)
      }
      filterSelectionOptionsClone[tableHeader] = []
      filterSelectionOptionsClone[tableHeader].push(
        ...filterSelectionOptionsArray,
      )
      setFilterSelectionOptions(filterSelectionOptionsClone)
    }
  }

  const dateHandler = (date, tableHeader, tableHeaderSubMenu) => {
    const filterSelectionOptionsClone = cloneDeep(filterSelectionOptions)
    if (!filterSelectionOptionsClone[tableHeader]) {
      filterSelectionOptionsClone[tableHeader] = []
    }

    filterSelectionOptionsClone[tableHeader].push(tableHeaderSubMenu)
    setFilterSelectionOptions(filterSelectionOptionsClone)
    const formatDate = moment(date).format('DD-MM-YYYY')

    let optionsTemp = [...options]
    let indexOfOptionKey = optionsTemp.findIndex(
      (o) => o.key == tableHeader + '.' + tableHeaderSubMenu,
    )
    if (indexOfOptionKey >= 0) {
      optionsTemp[indexOfOptionKey] = {
        stringToShow:
          tableHeaderSubMenu.split('_').join(' ') + ' ' + formatDate,
        key: tableHeader + '.' + tableHeaderSubMenu,
      }
    } else {
      optionsTemp.push({
        stringToShow:
          tableHeaderSubMenu.split('_').join(' ') + ' ' + formatDate,
        key: tableHeader + '.' + tableHeaderSubMenu,
      })
    }
    setOptions(optionsTemp)

    setOptionKeys([...optionKeys, tableHeader + '.' + tableHeaderSubMenu])
    // props.setoptionsOfFilter(options);
  }

  const clearAllFilter = () => {
    setOptions([])
    // props.setoptionsOfFilter([])
    setOptionKeys([])
    setFilterSelectionOptions({})
    setFilterText({
      mobile: '',
      name: '',
      // created_date_from: '',
      // created_date_to: '',
    })
    props.setFiltereddata(props.filteredDataBkp)
    setFilterDataBkp(props.filteredData)
  }

  const applyFilter = (isEmptyData = false) => {
    let leadsClone = cloneDeep(props.filteredDataBkp)
    if (leadsClone) {
      let filterLeads = []
      for (let option in filterSelectionOptions) {
        for (let i = 0; i < filterSelectionOptions[option].length; i++) {
          let filterData = []
          // if (option === 'mobile') {
          //   if (filterSelectionOptions.mobile[0] === 'includes') {
          //     filterData = leadsClone.filter(
          //       (lead) => lead.mobile.indexOf(filterText.mobile) > -1,
          //     )
          //   } else {
          //     filterData = leadsClone.filter(
          //       (lead) => lead.mobile.indexOf(filterText.mobile) === -1,
          //     )
          //   }
          // } else 
          if (option === 'name') {
            if (filterSelectionOptions.name[0] === 'includes') {
              filterData = leadsClone.filter(
                (lead) => lead.name.indexOf(filterText.name) > -1,
              )
            } else {
              filterData = leadsClone.filter(
                (lead) => lead.name.indexOf(filterText.name) === -1,
              )
            }
          } 
          // else if (option === 'lead_source') {
          //   filterData = leadsClone.filter(
          //     (lead) => lead.lead_source.id === filterSelectionOptions[option][i],
          //   )
          // }

          filterLeads.push(...filterData)
        }
        // if (option === 'created_at') {
        //   let from = filterText.created_date_from
        //   let to = filterText.created_date_to

        //   let filterDataCreated = leadsClone.filter(
        //     (lead) =>
        //       moment(lead.created_at).isBetween(moment(from), moment(to)) ||
        //       moment(lead.created_at).isSame(moment(from), 'day') ||
        //       moment(lead.created_at).isSame(moment(to), 'day'),
        //   )
        //   filterLeads.push(...filterDataCreated)
        // }
      }

      props.setFiltereddata(isEmptyData ? leadsClone : filterLeads)
      props.setLoading(false)
      // props.setLevelMenu(false)
      setFilterDataBkp(isEmptyData ? leadsClone : filterLeads)
    }
  }

  const clearFilterText = (selectedKeys) => {
    if (selectedKeys) {
      let arrSplit1 = selectedKeys.map((a) => a.split('.')[0])
      let arrSplit2 = selectedKeys.map((a) => a.split('.'))

      let filterTextObj = { ...filterText }

      // if (!arrSplit1.includes('mobile')) {
      //   filterTextObj['mobile'] = ''
      // }
      if (!arrSplit1.includes('name')) {
        filterTextObj['name'] = ''
      }
      // if (!arrSplit1.includes('created_at')) {
      //   filterTextObj.created_date_from = ''
      //   filterTextObj.created_date_to = ''
      // }
      setFilterText(filterTextObj)
    }
  }

  return (
    <div style={{ position: 'relative', right: '300px', top: '-8px' ,zIndex:"1"}}>
      <BranchFilterContent
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
        hideApply={true}
        sourceby={props.sourceby}
      />
      {/* Sailaja fixed filter box position by changing top position 75px t0 41px on 10th August */}
      {options.length > 0 && (
        <div className="selected-options " style={{ left: '-1000px',top:'41px',zIndex:"0"}}>
          <BranchShowSelectedStrings
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
  )
}
