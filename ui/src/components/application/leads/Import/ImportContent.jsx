import React, { useState, useEffect } from 'react'
import { CardBody, Form } from 'reactstrap'
import { Upload } from 'react-feather'
import { cloneDeep, pick } from 'lodash'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import { default as axiosBaseURL } from '../../../../axios'
import Spark_RadiusCsv from './Spark_RadiusCsv.csv'
import Spark_RadiusExcel from './Spark_Radius.xls'
import useFormValidation from '../../../customhooks/FormValidation'

const MANDATORY_FIELDS = [
  'district',
  'first_name',
  'house_no',
  'lead_source',
  'mobile_no',
  'notes',
  'pincode',
  'state',
  'street',
  'city',
  'landmark',
  'type',
]

export const ImportContent = (props) => {
  const [excelData, setExcelData] = useState([])
  const [invalidList, setinvalidList] = useState([])
  const [selectedFileCsv, setSelectedFileCsv] = useState(null)
  const [selectedFileExcel, setSelectedFileExcel] = useState(null)
  const [importStatus, setImportStatus] = useState({
    csv: {
      message: '',
      error: false,
      totalRows: 0,
    },
    excel: {
      message: '',
      error: false,
      totalRows: 0,
    },
  })
  //imports
  useEffect(() => {
    setExcelData([])
    setSelectedFileCsv([])
    setSelectedFileExcel([])
    setImportStatus({
      csv: {
        message: '',
        error: false,
      },
      excel: {
        message: '',
        error: false,
      },
    })
    setinvalidList([])
  }, [props.importFileType])

  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/)
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/,
    )

    const list = []
    const invalidListRows = []

    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/,
      )
      if (headers && row.length == headers.length) {
        const obj = {}
        for (let j = 0; j < headers.length; j++) {
          let d = row[j]
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1)
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1)
          }
          if (headers[j]) {
            obj[headers[j]] = d
          }
        }
        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          if (getMissingFields(obj)[0].length>0) {
            let missingFieldsAndErrors = getMissingFields(obj)
            let objInvalid = {
              row: i,
              data: obj,
              missingFields: missingFieldsAndErrors[0],
              errors: missingFieldsAndErrors[1]
            }
            invalidListRows.push(objInvalid)
          } else {
            list.push(obj)
          }
        }
      }
    }

    setExcelData([...list])

    setinvalidList(invalidListRows)

    let importStatusClone = cloneDeep(importStatus)
    importStatusClone[props.importFileType].totalRows =
      dataStringLines.length - 2

    if (invalidListRows.length > 0) {
      importStatusClone[props.importFileType].message = 'Error: Missing Fields'
      importStatusClone[props.importFileType].error = true
      props.setImportedData(list, invalidListRows)
      props.openCorrectDataPanel()
      setImportStatus(importStatusClone)
    }

    if (list.length > 0 && invalidList.length === 0) {
      excelform(list, invalidListRows, dataStringLines.length - 2)
    }
  }

  const { validate } = useFormValidation(MANDATORY_FIELDS)
  
  const getMissingFields = (obj) => {
    const objMandatoryFields = pick(
      obj,
     [...MANDATORY_FIELDS]
    )

    	const validationErrors = validate(objMandatoryFields);
      const fieldsKeys = Object.keys(validationErrors);
      const index = fieldsKeys.indexOf('addlead')
      if(index>=0){
        fieldsKeys.splice(index,1);
      }
    

    return [fieldsKeys, validationErrors]
  }

  const excelform = (data, invalidListRows, totalRows) => {
    axiosBaseURL
      .post('/radius/lead/uploadcsv/partial', data)
      .then((response) => {
        response.data.created.forEach(d=>{  
          props.onUpdate({...d},invalidListRows)
        });
        let importStatusClone = cloneDeep(importStatus)
        importStatusClone[props.importFileType].message = 'Success'
        importStatusClone[props.importFileType].error = false
        importStatusClone[props.importFileType].totalRows = totalRows

        if (invalidListRows.length === 0) {
          setImportStatus(importStatusClone)
          toast.success('File Upload Successfully !')
        }
      })
      .catch(function (error) {
        toast.error('Please Select valid file !')

        let importStatusClone = cloneDeep(importStatus)
        importStatusClone[props.importFileType].message = 'something wrong'
        importStatusClone[props.importFileType].error = true

        setImportStatus(importStatusClone)

        console.error('Something went wrong!', error)
      })
  }

  // handle file upload
  const handleFileUpload = (e) => {
    let importStatusClone = cloneDeep(importStatus)
    importStatusClone[props.importFileType].message = 'importing'
    importStatusClone[props.importFileType].error = false

    let file
    if (props.importFileType === 'csv') {
      file = selectedFileCsv
    } else {
      file = selectedFileExcel
    }
    try {
      const reader = new FileReader()
      reader.onload = (evt) => {
         
        const bstr = evt.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 })
        processData(data)
      }

      reader.readAsBinaryString(file)
    } catch (e) {
      toast.error('Please Select valid file !')
    }
  }

  const getFile = () => {
    if (props.importFileType === 'csv') {
      openFileDialog('.csv', onFileChange)
    } else {
      openFileDialog('.xlsx,.xls', onFileChange)
    }
  }

  function openFileDialog(accept, callback) {
    var inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept = accept
    inputElement.addEventListener('change', callback)
    inputElement.dispatchEvent(new MouseEvent('click'))
  }

  const onFileChange = (event) => {
    if (props.importFileType === 'csv') {
      setSelectedFileCsv(event.target.files[0])
    } else {
      setSelectedFileExcel(event.target.files[0])
    }
  }

  const downloadExcelFile = () => {
    var wb = XLSX.utils.book_new()
    var ws_name = 'SheetJS'
    const ws_data = invalidList.map((list) => list.data)
    var ws = XLSX.utils.json_to_sheet(ws_data)
    XLSX.utils.book_append_sheet(wb, ws, ws_name)
    XLSX.writeFile(
      wb,
      `FailedRows${props.importFileType === 'csv' ? '.csv' : '.xlsx'}`,
    )
    toast.success(
      'File downloaded successfully. please fill missing fields and upload again!',
    )
  }
  return (
    <CardBody
      className="filter-cards-view animate-chk header-level-sub-menu submenu-div "
      style={{
        visibility: props.file === props.importFileType ? 'visible' : 'hidden',
        zIndex: '999',
      }}
    >
      <span style={{ padding: '5px' }}>{props.file}</span>

      <div className="import-file-container file-content">
        <div className="media-body">
          <Form className="d-inline-flex">
            <div className="btn btn-primary" onClick={getFile}>
              {' '}
              <Upload />
              {'Upload File'}
            </div>
            <div style={{ height: '0px', width: '0px', overflow: 'hidden' }}>
              <input
                id={`file-${props.importFileType}`}
                accept={props.importFileType === 'csv' ? '.csv' : '.xlsx,.xls'}
                type="file"
                onChange={(e) => onFileChange(e)}
              />
            </div>
          </Form>

          <div
            className="btn btn-primary ml-1"
            onClick={(e) => {
              handleFileUpload(e);    
              props.setIsImportFlow(true);
            }}
          >
            {'Import'}
          </div>
          <div className="file-info">
            {props.importFileType === 'csv' &&
              selectedFileCsv != null &&
              selectedFileCsv.name}
          </div>
          <div className="file-info">
            {props.importFileType === 'excel' &&
              selectedFileExcel != null &&
              selectedFileExcel.name}
          </div>
        </div>

        <a
          href={
            props.importFileType === 'csv' ? Spark_RadiusCsv : Spark_RadiusExcel
          }
          download
        >
          Download sample {props.importFileType} file
        </a>
        <hr />
        {importStatus[props.importFileType] &&
          !importStatus[props.importFileType]['error'] &&
          excelData.length > 0 &&
          importStatus[props.importFileType] &&
          importStatus[props.importFileType].totalRows > 0 && (
            <p className="row-success">
              {importStatus[props.importFileType].totalRows -
                invalidList.length}{' '}
              Rows successfully import
            </p>
          )}
        {importStatus[props.importFileType] &&
          importStatus[props.importFileType]['error'] && (
            <>
              <div className="import-errors" style={{ textAlign: 'left' }}>
                <div>
                 
                  <p className="row-fail">
                    {invalidList.length} Rows failed to import
                  </p>
                </div>
                <hr />
                <div style={{ textAlign: 'center' }}>Download Failed Rows</div>
                <a
                  href="#"
                  onClick={downloadExcelFile}
                  className="anchor-failed-file"
                >
                  {`FailedRows${
                    props.importFileType === 'csv' ? '.csv' : '.xlsx'
                  }`}
                </a>
              </div>
            </>
          )}
      </div>
    </CardBody>
  )
}
