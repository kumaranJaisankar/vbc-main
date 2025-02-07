import React from 'react'
import DataTable from 'react-data-table-component';
import {leadStatus} from "../../leads/ConstatantData";
const colors = {LC:'#aef59d', New_lead: '#C4DDFB', Converted_lead:'#C4FBC4'}

const columns = [
    {
        name: 'Lead name',
        selector: row => row.name,
        width:'20%'
    },
    {
        name: 'Joined Date',
        selector: row => row.date,
        width:'20%'
    },
    {
        name: 'Phone',
        selector: row => row.phone,
        width:'15%'
    },
    {
        name: 'Source',
        selector: row => row.source,
    },
    {
        name: 'Status',
        selector: row => row.status,
        cell: (row) => {
            let statusObj = leadStatus.find((s) => s.id == row.status);
    
            return (
              <span
               
              >
                {statusObj ? statusObj.name : "-"}
              </span>
            );
          },
        // cell:row=>{
        //     return (
        //         <span className="badge  pull-left digits" style={{backgroundColor: colors[row.status]}}>
        //         {row.status}
        //       </span>
        //     )
        // },
    },
    {
        name: 'Type',
        selector: row => row.type,
        width:'10%'
    },
];

function CLTable({data}) {
    return (
        <DataTable
            columns={columns}
            data={data}
        />
    );
};

export default CLTable;