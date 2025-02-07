import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { iptvaxios } from '../../../../axios';


function BroadcastersTable(props) {
    const [broadCaster,setBroadcaster] = useState([]);
    useEffect(()=>{
        iptvaxios.get(
            "/api/broadcaster/getBroadcasters"
        ).then(
            res=>setBroadcaster(res.data)
        ).catch(
            err=>console.log(err)
        )
    },[props.refresh]);
    const Tablecolumns = [
        {
            name:"Id",
            selector:"id",
            cell: (row) => (
                <>
                  <a
                    onClick={() => props.openCustomizer("3", row)}
                    className="openmodal"
                  >
                    BR{row.id}
                  </a>
                </>
              ),
        },
        {
            name:"Name",
            selector:"name",
            sortable:true
        },
        {
            name:"Email",
            selector:"email",
            sortable:true
        },
        {
            name:"Mobile No",
            selector : "mobile",
            sortable:true
        },
        {
            name:"Contact Person",
            selector: "contactPerson",
            sortable:true
        },
        {
            name:"Address",
            sortable:true,
            cell: (row)=>{return(
                <div 
                    style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                >
                    {`${row.address},${row.city},${row.state},${row.pincode}`}
                </div>
    
            )}
        },
        {
            name:"Created Date",
            sortable:true,
            cell:(row)=>{return(
                <div>
                    {moment(row.createdDate).format("DD MMM YYYY")}
                </div>
            )}
    
        },
        {
            name:"Created By",
            sortable:true,
            selector:"createdBy"
        }
    
    ];
  return (
    <DataTable 
        className='customer-list'
        columns = {Tablecolumns}
        data={broadCaster}
        pagination
    />
  )
}

export default BroadcastersTable;

