
import React, { useState,useEffect } from 'react'
import { X } from 'react-feather'
import { ImportContent } from './ImportContent'

export const ImportContainer = (props) => {
  const [importFileType, setImportFileType] = useState(null)

  useEffect(()=>{
    setImportFileType(null);
  },[props.importDivStatus])

  return (
    <div
      className="import-container"
      style={props.importDivStatus ? { display: '' } : { display: 'none' }}
    >
      <div className="left-header">
        <div className="level-menu outside">
          <ul className="header-level-menu " style={{ width: '245px',
        position: "absolute",left:'4px',top:'56px'
        }}>
            <div
              className="close-circle"
              onClick={() => props.setImportDivStatus(false)}
              style={{ position: 'absolute', right: '5px', zIndex: 202 }}
            >
              <a href="#javascript">
                <X />
              </a>
            </div>

            <li
              onMouseOver={() => setImportFileType('excel')}
              className={`import-li ${
                importFileType === 'excel' ? 'selected' : ' '
              }`}
            >
              <a href="#javascript">
                <span>Excel File</span>
              </a>
              <ImportContent
              setIsImportFlow={props.setIsImportFlow}
              setFiltereddata={props.setFiltereddata}
                file={'excel'}
                importFileType={importFileType}
                importMessage=""
                openCorrectDataPanel={props.openCorrectDataPanel}
                setImportedData={props.setImportedData}
                onUpdate={props.onUpdate}
              />
            </li>
            <li
              onMouseOver={() => setImportFileType('csv')}
              className={`import-li ${
                importFileType === 'csv' ? 'selected' : ' '
              }`}
            >
              <a href="#javascript">
                <span>CSV File</span>
              </a>
              <ImportContent
              setIsImportFlow={props.setIsImportFlow}
              setFiltereddata={props.setFiltereddata}
                file={'csv'}
                importFileType={importFileType}
                importMessage=""
                openCorrectDataPanel={props.openCorrectDataPanel}
                setImportedData={props.setImportedData}
                onUpdate={props.onUpdate}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
