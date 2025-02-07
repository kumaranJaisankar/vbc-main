import React, { useState, useEffect } from 'react'
import { cloneDeep, includes, isEmpty } from 'lodash'
import moment from 'moment'
import { OpticalNetworkFilterContent } from './OpticalNetworkFilterContent'
import { OpticalNetworkShowSelectedStrings } from './OpticalNetworkShowSelectedStrings'

export const OpticalNetworkFilterContainer = (props) => {
  const [options, setOptions] = useState([])
  const [optionKeys, setOptionKeys] = useState([])
  const [filterSelectionOptions, setFilterSelectionOptions] = useState({})
  const [filterDataBkp, setFilterDataBkp] = useState(props.filteredDataBkp)

  const [filterText, setFilterText] = useState({
    open_date:'',
    created_date_from: '',
    created_date_to: '',
    assigned_date_from:'',
    assigned_date_to:'',
    name:'',
  })
  
  useEffect(() => {
    applyFilter(isEmpty(options))
  }, [filterSelectionOptions])

  const onChangeHandler = (e, tableHeader, tableHeaderSubMenu, text) => {
    let stringToShow = text
     if(tableHeader === 'zone') {
      stringToShow = 'Zone : ' + ' ' + text
    }
    else if (tableHeader === 'name') {
      stringToShow = 'Hardware name ' + text + ' ' + filterText.name
    }

    if (e.target.checked) {
      const optionArray = [
        ...options,
        {
          stringToShow: stringToShow,
          key: tableHeader + '.' + tableHeaderSubMenu,
        },
      ]
      setOptions(optionArray)
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
  }

  const clearAllFilter = () => {
    setOptions([])
    setOptionKeys([])
    setFilterSelectionOptions({})
    setFilterText({
      open_date:'',
      created_date_from: '',
      created_date_to: '',
      assigned_date_from:'',
      assigned_date_to:'',
      name:''
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
          
           if (option === 'zone') {
            filterData = leadsClone && leadsClone?.filter(
              (lead) => lead.zone === filterSelectionOptions[option][i],
            )
          }
          if (option === 'name') {
            if (filterSelectionOptions.name[0] === 'includes') {
              filterData = leadsClone && leadsClone?.filter(
                (lead) => lead.name.indexOf(filterText.name) > -1,
              )
            } else {
              filterData = leadsClone && leadsClone?.filter(
                (lead) => lead.name.indexOf(filterText.name) === -1,
              )
            }
          }
          filterLeads.push(...filterData)
        }
        if (option === 'open_date') {
          let from = filterText.created_date_from
          let to = filterText.created_date_to

          let filterDataCreated = leadsClone.filter(
            (lead) =>
              moment(lead.open_date).isBetween(moment(from), moment(to)) ||
              moment(lead.open_date).isSame(moment(from), 'day') ||
              moment(lead.open_date).isSame(moment(to), 'day'),
          )
          filterLeads.push(...filterDataCreated)
        }
        if (option === 'assigned_date') {
          let from = filterText.assigned_date_from
          let to = filterText.assigned_date_to

          let filterDataCreated = leadsClone.filter(
            (lead) =>
              moment(lead.assigned_date).isBetween(moment(from), moment(to)) ||
              moment(lead.assigned_date).isSame(moment(from), 'day') ||
              moment(lead.assigned_date).isSame(moment(to), 'day'),
          )
          filterLeads.push(...filterDataCreated)
        }
      }

      props.setFiltereddata(isEmptyData ? leadsClone : filterLeads)
      props.setLoading(false)
      setFilterDataBkp(isEmptyData ? leadsClone : filterLeads)
    }
  }

  const clearFilterText = (selectedKeys) => {
    if (selectedKeys) {
      let filterTextObj = { ...filterText }
      let arrSplit1 = selectedKeys.map((a) => a.split('.')[0])
      let arrSplit2 = selectedKeys.map((a) => a.split('.'))
      if (!arrSplit1.includes('name')) {
        filterTextObj['name'] = ''
      }
      setFilterText(filterTextObj)
    }
  }

  return (
    <div style={{  right: '90px', top: '-15px' }}>
      <OpticalNetworkFilterContent
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
        zone={props.zone}
      />
      {/* Sailaja Changed clear filter bar position on 20th July */}
      {options.length > 0 && (
        <div className="selected-options" style={{ 
          left: '64px',top:'224px'
         ,zIndex:"0", marginTop:"-1rem"
        }}>
          
          <OpticalNetworkShowSelectedStrings
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
