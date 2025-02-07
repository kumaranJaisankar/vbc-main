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

			let addressTrim = ''
			if(row.address) {

				 addressTrim = `${row.address.house_no},${row.address.street},${row.address.landmark},${row.address.city},${row.address.district},${row.address.state},${row.address.pincode},${row.address.country}`;
			}
		
			return {
				id:row.id,
                franchise:row.franchise,
                customer_username:row.customer_username,
				customer_name:row.customer_name,
                mobile_number:row.mobile_number,
                payment_id:row.payment_id,
                pickup_type:row.pickup_type,
                payment_method:row.payment_method,
                collected_by:row.collected_by,
                completed_date:row.completed_date,
                amount:row.amount,
                due_amount:row.due_amount,
                status:row.status,

			}
		})
	}
	const headerKeys = Object.keys(dataModify[0]);
	const requiredHeaderKeys = headers;
	let newDataModify = dataModify.map( item => {
		let newItem = {};
		requiredHeaderKeys.forEach( requiredKey => newItem[requiredKey] = item[requiredKey])
		return newItem;
	});
	const ws_data = newDataModify;
	console.log(ws_data)
    var ws = XLSX.utils.json_to_sheet(ws_data, {header:headers})
    XLSX.utils.book_append_sheet(wb, ws, ws_name)
    XLSX.writeFile(
      wb,
      `Spark Radius${type === 'csv' ? '.csv' : '.xlsx'}`,
    )
    toast.success(
      'File downloaded successfully.',{

		  autoClose:1000
	  }
    )
  }


//   pdf


export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
	console.log(headersForPDF);
	const unit = "pt";
	const size = "A4"; // Use A1, A2, A3 or A4
	const orientation = "landscape"; // portrait or landscape
  
	const marginLeft = 40;
	const doc = new jsPDF(orientation, unit, size);
  
	doc.setFontSize(15);
  
	const title = `${pdfTitle}`;
	const headers = [[...headersForPDF.map((col) => col[1])]];
  
	const dataKey = headersForPDF.map((col) => col[0]);
  
	
  
	let columns = headersForPDF.map((h) => ({ header: h[1], dataKey: h[0] }));
	let dataBody = tableData.map((elt) => {
	  const data = columns.reduce((acc, colObj) => {
		if (colObj.dataKey === "radius")
		  return {
			...acc,
			[colObj.dataKey]: elt[colObj.dataKey].name,
		  };
         
		 if (colObj.dataKey === "address" && elt.address) {
		  const address = `${elt.address.house_no},${elt.address.street},${elt.address.landmark},${elt.address.city},${elt.address.district},${elt.address.state},${elt.address.country},${elt.address.pincode}`;
		  return {
			...acc,
			address,
		  };
		} 
        else if(colObj.dataKey === "completed_date" && elt.completed_date){
			return{...acc,completed_date: moment(elt.completed_date).format('DD MMM YY')}
		}
		
		else return { ...acc, [colObj.dataKey]: elt[colObj.dataKey] };
	  }, {});
	  console.log(data);
	  return data;
	});
	console.log(dataBody);
  
	let styledContent = {
	  startY: 50,
	  startX: 30,
	  columnStyles: {
		id: { cellWidth: 40 },

	  },
	  body: dataBody,
	  columns,
	};
  
	doc.text(title, marginLeft, 20);
	// doc.autoTable(content);
  
	doc.autoTable(styledContent);
	doc.save(`${fileName}.pdf`);
	toast.success(
		'File downloaded successfully.',{
  
			autoClose:1000
		}
	  )
  };