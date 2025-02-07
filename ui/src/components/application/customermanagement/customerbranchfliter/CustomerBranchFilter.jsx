import React, { useState, useEffect } from 'react'
import { cloneDeep, includes, isEmpty } from 'lodash'
import moment from 'moment'
import { CustomerBranchContent } from './CustomerBranchContent'
import { CustomerShowSelectedStrings } from './CustomerShowSelectedStrings'

export const CustomerBranchContainer = (props) => {
  const [options, setOptions] = useState([])
  const [optionKeys, setOptionKeys] = useState([])
  const [filterSelectionOptions, setFilterSelectionOptions] = useState({})
  const [filterDataBkp, setFilterDataBkp] = useState(props.filteredDataBkp)

  const [filterText, setFilterText] = useState({
    first_name: '',
    last_name:'',
   
  })

  useEffect(() => {
    applyFilter(isEmpty(options));
  }, [filterSelectionOptions, props.apiCallCount])

  const onChangeHandler = (e, tableHeader, tableHeaderSubMenu, text) => {
    let stringToShow = text
    if (tableHeader === 'first_name') {
      stringToShow = 'FIrst name ' + text + ' ' + filterText.first_name
    } else if (tableHeader === 'last_name') {
      stringToShow = 'Last Name' + ' ' + text + ' ' + filterText.last_name
    } 
    else if (tableHeader === 'name') {
      stringToShow = 'Branch' + ' ' + text
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
      // props.setoptionsOfFilter(optionArray);

      setOptionKeys([...optionKeys, tableHeader + '.' + tableHeaderSubMenu])
      props.setSelectedOptionsWithKeys([...optionKeys, tableHeader + '.' + tableHeaderSubMenu]);

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
      props.setSelectedOptionsWithKeys([...optionKeysArray]);

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
    // props.setoptionsOfFilter(options);
  }

  const clearAllFilter = () => {
    //localStorage.removeItem('branchFilter');
    setOptions([])
    // props.setoptionsOfFilter([])
    setOptionKeys([])
    props.setSelectedOptionsWithKeys([]);
    setFilterSelectionOptions({})
    setFilterText({
      first_name: '',
      last_name:'',
     
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
          if (option === 'first_name') {
            if (filterSelectionOptions.first_name[0] === 'includes') {
              filterData = leadsClone.filter(
                (lead) => lead.first_name.indexOf(filterText.first_name) > -1,
              )
            } else {
              filterData = leadsClone.filter(
                (lead) => lead.first_name.indexOf(filterText.first_name) === -1,
              )
            }
          } else if (option === 'last_name') {
            if (filterSelectionOptions.last_name[0] === 'includes') {
              filterData = leadsClone.filter(
                (lead) => lead.last_name.indexOf(filterText.last_name) > -1,
              )
            } else {
              filterData = leadsClone.filter(
                (lead) => lead.last_name.indexOf(filterText.last_name) === -1,
              )
            }
          } 
          else if (option === 'branch') {
            filterData = leadsClone.filter(
              (lead) => {
                if(lead && lead.branch){
                  return lead.branch === filterSelectionOptions[option][i];
                }

              }
            )
          } else if (option === 'franchise') {
            filterData = leadsClone.filter(
              (lead) => {
                if(lead && lead.franchise){
                  
                  return lead.franchise.name  == filterSelectionOptions[option][i];
                }

              }
            )
          }
       

          filterLeads.push(...filterData)
        }
       
      }

      if(!isEmpty(options)){
        props.setFiltereddata(isEmptyData ? leadsClone : filterLeads)
      }else if(isEmpty(options)){
        props.setFiltereddata(leadsClone)
      }
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

      if (!arrSplit1.includes('first_name')) {
        filterTextObj['first_name'] = ''
      }
      if (!arrSplit1.includes('last_name')) {
        filterTextObj['last_name'] = ''
      }
    
      setFilterText(filterTextObj)
    }
  }

  return (
    <div style={{ position: 'absolute', left: '120px', top: '-15px' }}>
      <CustomerBranchContent
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
        branchFilter={props.branchFilter}
        franchises={props.franchises}
        
      />
      {options.length > 0 && (
        <div className="selected-options" style={{ left: '-475px',top:'85px'}}>
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
            setSelectedOptionsWithKeys={props.setSelectedOptionsWithKeys}
          />
        </div>
      )}
    </div>
  )
}
