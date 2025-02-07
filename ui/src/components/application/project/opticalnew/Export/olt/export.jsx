import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import orderBy from 'lodash/orderBy';
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from 'moment';

export const downloadExcelFile = (data,type,headers) => {
    var wb = XLSX.utils.book_new()
    var ws_name = 'SheetJS'
	let dataModify = [...data];
	if(dataModify){
		dataModify = orderBy(dataModify, ['id'],['asc']);
		dataModify = dataModify.map(row=>{
    // return
			return {
				hardware_category:row.hardware_category,
				branch:row.branch,
				parent_nas:row.parent_nas,
				zone:row.zone?.name,
				franchise:row.franchise?.name,
				area:row.area?.name,
				serial_no:row.serial_no,
				name:row?.name, 
				no_of_ports: row.no_of_ports,
                available_ports:row.available_ports,
                make:row.make,
                device_model:row.device_model,
                capacity:row.capacity,
                olt_use_criteria:row.olt_use_criteria,
                specification:row.specification,
                notes:row.notes
			}
		})
	}

	// const headerKeys = Object.keys(dataModify[0]);
	// const requiredHeaderKeys = headers;
	// let newDataModify = dataModify.map( item => {
	// 	let newItem = {};
	// 	requiredHeaderKeys.forEach( requiredKey => newItem[requiredKey] = item[requiredKey])
	// 	return newItem;
	// });
	// const ws_data = newDataModify;
    // var ws = XLSX.utils.json_to_sheet(ws_data, {header:headers})
	const headerKeys = headers.map(header => header[0]);
	const headerLabels = headers.map(header => header[1]);
	let newDataModify = dataModify.map(item => {
		let newItem = {};
		headerKeys.forEach((key, index) => newItem[headerLabels[index]] = item[key]);
		return newItem;
	});
	var ws = XLSX.utils.json_to_sheet(newDataModify, { header: headerLabels });
    XLSX.utils.book_append_sheet(wb, ws, ws_name)
    XLSX.writeFile(
      wb,
      `olt${type === 'csv' ? '.csv' : '.xlsx'}`,
    )
    toast.success(
      'File downloaded successfully.',{

		autoClose:1000
	}
    )
  }

//pdf changes made by Marieya

  export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
	const VBCLOGO = require("../../../../../../assets/images/vbclogo.png");

	const unit = "pt";
	const size = "A3"; // Use A1, A2, A3 or A4
	const orientation = "landscape"; // portrait or landscape
  
	const marginLeft = 40;
	const doc = new jsPDF(orientation, unit, size);
  
	doc.setFontSize(15);
  
	// const title = `${pdfTitle}`;
	const headers = [[...headersForPDF.map((col) => col[1])]];
  
	const dataKey = headersForPDF.map((col) => col[0]);
  
	const data = tableData?.map((elt) => {
	  return dataKey.map((key) => {
		if (key === "lead_source" || key === "type") return elt[key.name];
		
		else if (key === "address")
		  return `${elt.house_no},${elt.street},${elt.landmark},${elt.city},${elt.district},${elt.state},${elt.country},${elt.pincode}`;
		else return elt[key];
	  });
	});
	let content = {
	  startY: 50,
	  head: headers,
	  body: data,
	};
  
	let columns = headersForPDF.map((h) => ({ header: h[1], dataKey: h[0] }));
	let dataBody = tableData?.map((elt) => {
	  const data = columns.reduce((acc, colObj) => {
		if (colObj.dataKey === "lead_source" || colObj.dataKey === "type")
		  return {
			...acc,
			[colObj.dataKey]: elt[colObj.dataKey].name,
		  };
		 
		  else if (colObj.dataKey === "assigned_to" && elt.assigned_to){
			return { ...acc,assigned_to: moment(elt.assigned_to).format('DD-MMM-YY')}
			
				  }
	 else if (colObj.dataKey === "address") {
		  const address = `${elt.house_no},${elt.street},${elt.landmark},${elt.city},${elt.district},${elt.state},${elt.country},${elt.pincode}`;
		  return {
			...acc,
			address,
		  }
		}
		// Handle franchise
		else if (colObj.dataKey === "franchise" && elt.franchise) {
			return {
			  ...acc,
			  franchise: elt.franchise.name
			};
		  } 
		  // Handle zone
		  else if (colObj.dataKey === "zone" && elt.zone) {
			return {
			  ...acc,
			  zone: elt.zone.name
			};
		  } 
		  // Handle area
		  else if (colObj.dataKey === "area" && elt.area) {
			return {
			  ...acc,
			  area: elt.area.name
			};
		  } 
		  else {
			return { ...acc, [colObj.dataKey]: elt[colObj.dataKey] };
		  }
		}, {});
		return data;
	});

	console.log(dataBody, ":dataBody")
	console.log(columns, ":columns")
  
	let styledContent = {
	  startY: 50,
	  startX: 30,
	  columnStyles: {
		id: { cellWidth: 40 },
		address: { cellWidth: 100 },
		lead_source: { cellWidth: 60 },
		type: { cellWidth: 60 },
		notes: { cellWidth: 60 },
	  },
	  body: dataBody,
	  columns,
	//   headStyles: { fillColor: [20, 20, 20] },
	};
	// doc.setFillColor(0, 0, 255)
	// doc.text(title, marginLeft, 20);
	// doc.addImage(VBCLOGO, 'PNG', 650, 22, 130, 80)
	doc.text(40,40,"OLT");
	doc.autoTable(styledContent);
	doc.save(`${fileName}.pdf`);
	toast.success(
		'File downloaded successfully.',{
  
			autoClose:1000
		}
	  )
  };