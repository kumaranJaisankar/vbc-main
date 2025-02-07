import React, { useState, useEffect } from 'react'
import { cloneDeep, includes, isEmpty } from 'lodash'
import moment from 'moment'
import { BillingFilterContent } from './BillingFilterContent'
import { BillingShowSelectedStrings } from './BillingShowSelectedStrings'

export const BillingFilterContainer = (props) => {
  const [options, setOptions] = useState([])
  const [optionKeys, setOptionKeys] = useState([])
  const [filterSelectionOptions, setFilterSelectionOptions] = useState({})
  const [filterDataBkp, setFilterDataBkp] = useState(props.filteredDataBkp)

  const [filterText, setFilterText] = useState({
    payment_id: '',
    payment_method:'',
  })

  useEffect(() => {
    applyFilter(isEmpty(options))
  }, [filterSelectionOptions])

  const onChangeHandler = (e, tableHeader, tableHeaderSubMenu, text) => {
     
    let stringToShow = text
    if (tableHeader === 'payment_id') {
      stringToShow = 'Payment Id ' + text + ' ' + filterText.payment_id
    } else if (tableHeader === 'payment_method') {
      stringToShow = 'Payment Type' + ' ' + text
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
      payment_id: '',
      payment_method:''
    })
    props.setFiltereddata(props.filteredDataBkp)
    setFilterDataBkp(props.filteredData)
  }

  const applyFilter = (isEmptyData = false) => {
    let leadsClone = cloneDeep(props.filteredDataBkp)
    if (leadsClone) {
      let filterLeads = []
      for (let option in filterSelectionOptions) {
        let filterData = []
        for (let i = 0; i < filterSelectionOptions[option].length; i++) {
          let filterData2=[]

          if (option === 'payment_id') {
            if (filterSelectionOptions.payment_id[0] === 'includes') {
              filterData2 = leadsClone.payments.filter(
                (lead) => lead.payment_id.indexOf(filterText.payment_id) > -1,
              )
            } else {
              filterData2 = leadsClone.payments.filter(
                (lead) => lead.payment_id.indexOf(filterText.payment_id) === -1,
              )
            }
          }
          else if (option === 'payment_method') {
            filterData2 = leadsClone.payments.filter(
             (lead) => lead.payment_method === filterSelectionOptions[option][i],
           )
      
         }
         if((filterSelectionOptions[option].length - 1)  == i){
          filterLeads = [...filterData, ...filterData2];
        }else{
          filterData= [...filterData, ...filterData2];
        }
        }
      }

      props.setFiltereddata(isEmptyData ? leadsClone :{...leadsClone,payments:[...filterLeads]})
      props.setLoading(false)
      setFilterDataBkp(isEmptyData ? leadsClone : {...leadsClone,payments:[...filterLeads]})
      console.log('filterDataBkp', filterDataBkp)
    }
  }

  const clearFilterText = (selectedKeys) => {
    if (selectedKeys) {
      let arrSplit1 = selectedKeys.map((a) => a.split('.')[0])
      let arrSplit2 = selectedKeys.map((a) => a.split('.'))

      let filterTextObj = { ...filterText }

      if (!arrSplit1.includes('payment_id')) {
        filterTextObj['payment_id'] = ''
      }
      if (!arrSplit1.includes('name')) {
        filterTextObj['name'] = ''
      }
      setFilterText(filterTextObj)
    }
  }

  return (
    <div style={{ position: 'relative', right: '300px', top: '-65px' }}>
      <BillingFilterContent
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
        franchiseType={props.franchiseType}
        filteredData={props.filteredData}
        filterDataBkp={props.filteredDataBkp}
      />
      {options.length > 0 && (
        <div className="selected-options" style={{left: '-500px',top:'115px',zIndex:"0" }}>
          <BillingShowSelectedStrings
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
