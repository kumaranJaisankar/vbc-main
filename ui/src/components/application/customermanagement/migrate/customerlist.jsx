import React from "react";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";

const MigrateCustomerlist = (props) => {

  var customers = props.areaIds;


  const deleteRows = (selected) => {
    props.setClearSelection(false);
    let rows = selected.map((ele) => ele.id);
    props.setCustomerIdChecked([...rows]);
    // props.disable(false);
  };

  const Verticalcentermodaltoggle = () => {
    if (props.Verticalcenter == true) {
      props.setCustomerIdChecked([]);
      props.setClearSelection(true);
      props.disable(false);

    }

    if (props.customerIdChecked.length > 0) {
      let selectedIdsForDelete = [...props.customerIdChecked];
      let notOpenLeadIds = selectedIdsForDelete.filter((id) => {
        let data = props.filteredData.find((d) => d.id == id);
        return data.status !== "OPEN";
      });
      props.setNotOpenLeadIdsForDelete(notOpenLeadIds);
      props.setVerticalcenter(!props.Verticalcenter);
    }
  };
  console.log(props.customerIdChecked, "isChecked");

//   useEffect(()=>{
//     props.setCustomerIdChecked([]);
//   },[])
  const columns = [
    {
      name: <b className="Table_columns">{"ID"}</b>,
      selector: "id",
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Username"}</b>,
      selector: "user",
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"First Name"}</b>,
      selector: "first_name",
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Service Plan"}</b>,
      selector: "service_plan",
      sortable: false,
    },
  ];
//   const checkData = () =>{
    
//  if(setCustomerIdChecked(true))
    
//   }
  return (
    <>
      {props.loading ? (
        <Skeleton
          count={11}
          height={30}
          style={{ marginBottom: "10px", marginTop: "15px" }}
        />
      ) : (
        <>
       <DataTable
          className=""
          columns={columns}
          data={customers}
          selectableRows
          onSelectedRowsChange={({ selectedRows }) => deleteRows(selectedRows)}
          noHeader
          pagination
          noDataComponent={"No Data"}
          selectableRowSelected={(row) => row.id}
        />
        </>
      )}
    </>
  );
};
export default MigrateCustomerlist;

