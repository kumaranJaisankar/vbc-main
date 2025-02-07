import React, { useState, useEffect } from 'react'
import { cloneDeep, includes, isEmpty } from 'lodash'
import moment from 'moment'
import { FilterContent } from './FilterContent'
import { ShowSelectedStrings } from './ShowSelectedStrings'
import Box from '@mui/material/Box';


export const FilterContainer = (props) => {
  const [options, setOptions] = useState([])
  const [optionKeys, setOptionKeys] = useState([])
  const [filterSelectionOptions, setFilterSelectionOptions] = useState({})
  const [filterDataBkp, setFilterDataBkp] = useState(props.filteredDataBkp)

  const [filterText, setFilterText] = useState({
    first_name: '',
    last_name: '',
    created_date_from: '',
    created_date_to: '',
  })

  useEffect(() => {
    applyFilter(isEmpty(options))
  }, [filterSelectionOptions])

  const onChangeHandler = (e, tableHeader, tableHeaderSubMenu, text) => {
    let stringToShow = text
    if (tableHeader === 'first_name') {
      stringToShow = 'First name ' + text + ' ' + filterText.first_name
    } else if (tableHeader === 'last_name') {
      stringToShow = 'Last Name' + ' ' + text + ' ' + filterText.last_name
    } else if (tableHeader === 'lead_source') {
      stringToShow = 'Lead Source' + ' ' + text
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
      const index2 = filterSelectionOptionsArray.findIndex((item)=> item == tableHeaderSubMenu)
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
      first_name: '',
      last_name: '',
      created_date_from: '',
      created_date_to: '',
    })
    props.setFiltereddata(props.filteredDataBkp)
    setFilterDataBkp(props.filteredData)
  }

  const applyFilter = (isEmptyData = false) => {
    let leadsClone = cloneDeep(props.filteredDataBkp)
    if (leadsClone) {
      let filterLeads = [...leadsClone];
      for (let option in filterSelectionOptions) {
        let filterData = []
        for (let i = 0; i < filterSelectionOptions[option].length; i++) {
          let filterData2=[]
          if (option === 'first_name') {
            if (filterSelectionOptions.first_name[0] === 'includes') {
              filterData2 = filterLeads.filter(
                (lead) => lead.first_name.indexOf(filterText.first_name) > -1,
              )
            } else {
              filterData2 = filterLeads.filter(
                (lead) => lead.first_name.indexOf(filterText.first_name) === -1,
              )
            }
          } else if (option === 'last_name') {
            if (filterSelectionOptions.last_name[0] === 'includes') {
              filterData2 = filterLeads.filter(
                (lead) => lead.last_name.indexOf(filterText.last_name) > -1,
              )
            } else {
              filterData2 = filterLeads.filter(
                (lead) => lead.last_name.indexOf(filterText.last_name) === -1,
              )
            }
          } else if (option === 'lead_source') {
             filterData2 = filterLeads.filter(
              (lead) => lead.lead_source.id === filterSelectionOptions[option][i],
            )
       
          }else  if (option === 'created_at') {
            let from = filterText.created_date_from;
            let to = !!filterText.created_date_to ? filterText.created_date_to : moment();
  
             filterData2 = filterLeads.filter(
              (lead) =>
                moment(lead.created_at).isBetween(moment(from), moment(to)) ||
                moment(lead.created_at).isSame(moment(from), 'day') ||
                moment(lead.created_at).isSame(moment(to), 'day'),
            )

          }
          if((filterSelectionOptions[option].length - 1)  == i){
            filterLeads = [...filterData, ...filterData2];
          }else{
            filterData= [...filterData, ...filterData2];
          }
        
        }
       
      }

      props.setFiltereddata(isEmptyData ? leadsClone : filterLeads)
      props.setLoading(false)
      setFilterDataBkp(isEmptyData ? leadsClone : filterLeads)
    }
  }

  const clearFilterText = (selectedKeys) => {
    if (selectedKeys) {
      let arrSplit1 = selectedKeys.map((a) => a.split('.')[0])
      let arrSplit2 = selectedKeys.map((a) => a.split('.'))

      let filterTextObj = { ...filterText }

      if (!arrSplit1.includes('first_name')) {
        filterTextObj['first_name'] = ''
      }
      if (!arrSplit1.includes('last_name')) {
        filterTextObj['last_name'] = ''
      }
      if (!arrSplit1.includes('created_at')) {
        filterTextObj.created_date_from = ''
        filterTextObj.created_date_to = ''
      }
      setFilterText(filterTextObj)
    }
  }

  return (
    <div style={{ position: 'relative' }} >
      <FilterContent
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
        // <div className="selected-options" style={{ left: '-81px' ,zIndex:"0", marginTop:"-1rem"}}>
              <Box sx={{ marginTop: '3%' }} >     
             <ShowSelectedStrings 
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
          </Box>

        // </div>
      )}
    </div>
  )
}
