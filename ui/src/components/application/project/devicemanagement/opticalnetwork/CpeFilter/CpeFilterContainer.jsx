import React, { useState, useEffect } from 'react'
import { cloneDeep, includes, isEmpty } from 'lodash'
import moment from 'moment'
import { CpeFilterContent } from './CpeFilterContent'
import { CpeShowSelectedStrings } from './CpeShowSelectedStrings'

export const CpeFilterContainer = (props) => {
  const [options, setOptions] = useState([])
  const [optionKeys, setOptionKeys] = useState([])
  const [filterSelectionOptions, setFilterSelectionOptions] = useState({})
  const [filterDataBkp, setFilterDataBkp] = useState(props.filteredDataBkp)

  const [filterText, setFilterText] = useState({
    hardware_name: '',
    branch: '',
    // created_date_from: '',
    // created_date_to: '',
  })

  useEffect(() => {
    applyFilter(isEmpty(options))
  }, [filterSelectionOptions])

  const onChangeHandler = (e, tableHeader, tableHeaderSubMenu, text) => {
    let stringToShow = text
    if (tableHeader === 'hardware_name') {
      stringToShow = 'Hardware Name' + text + ' ' + filterText.hardware_name
    } else if (tableHeader === 'branch') {
      stringToShow = 'Branch' + ' ' + text + ' ' + filterText.branch
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
      hardware_name: '',
      branch: '',
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
          if (option === 'hardware_name') {
            if (filterSelectionOptions.hardware_name[0] === 'includes') {
              filterData = leadsClone.filter(
                (lead) => lead.hardware_name.indexOf(filterText.hardware_name) > -1,
              )
            } else {
              filterData = leadsClone.filter(
                (lead) => lead.hardware_name.indexOf(filterText.hardware_name) === -1,
              )
            }
          } else if (option === 'branch') {
            if (filterSelectionOptions.branch[0] === 'includes') {
              filterData = leadsClone.filter(
                (lead) => lead.parent_dpe.parent_oltport.parent_olt.nas.branch.indexOf(filterText.branch) > -1,
              )
            } else {
              filterData = leadsClone.filter(
                (lead) => lead.parent_dpe.parent_oltport.parent_olt.nas.branch.indexOf(filterText.branch) === -1,
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
      console.log('filterDataBkp', filterDataBkp)
    }
  }

  const clearFilterText = (selectedKeys) => {
    if (selectedKeys) {
      let arrSplit1 = selectedKeys.map((a) => a.split('.')[0])
      let arrSplit2 = selectedKeys.map((a) => a.split('.'))

      let filterTextObj = { ...filterText }

      if (!arrSplit1.includes('hardware_name')) {
        filterTextObj['hardware_name'] = ''
      }
      if (!arrSplit1.includes('branch')) {
        filterTextObj['branch'] = ''
      }
      // if (!arrSplit1.includes('created_at')) {
      //   filterTextObj.created_date_from = ''
      //   filterTextObj.created_date_to = ''
      // }
      setFilterText(filterTextObj)
    }
  }

  return (
    <div style={{ position: 'relative', right: '90px', top: '-15px' }}>
      <CpeFilterContent
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
      {options.length > 0 && (
        <div className="selected-options" style={{ left: '-415px',top:'63px' }}>
          <CpeShowSelectedStrings
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
