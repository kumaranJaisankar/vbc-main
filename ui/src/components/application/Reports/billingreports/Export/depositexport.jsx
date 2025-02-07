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
				branch: row.branch ? row.branch.name : "",
                franchise:row.franchise ? row.franchise.name : "",
                pre_transaction_balance:(row.pre_transaction_balance).toFixed(2) ? (row.pre_transaction_balance).toFixed(2) : "0",
                credit:row.credit,
                debit: row.debit,
                type:row.type,
                payment_date: row.payment_date,
                person:row.person,
                post_transaction_balance:row.post_transaction_balance

			}
		})
	}
	// const headerKeys = Object.keys(dataModify[0]);
	// Extract the backend keys from the headers array
	const headerKeys = headers.map(header => header[0]);
	// Extract the frontend labels from the headers array
	const headerLabels = headers.map(header => header[1]);
	let newDataModify = dataModify.map(item => {
		let newItem = {};
		headerKeys.forEach((key, index) => newItem[headerLabels[index]] = item[key]);
		return newItem;
	});
	// const requiredHeaderKeys = headers;
	// let newDataModify = dataModify.map( item => {
	// 	let newItem = {};
	// 	requiredHeaderKeys.forEach( requiredKey => newItem[requiredKey] = item[requiredKey])
	// 	return newItem;
	// });
	// const ws_data = newDataModify;
	// console.log(ws_data)
	var ws = XLSX.utils.json_to_sheet(newDataModify, { header: headerLabels });
    // var ws = XLSX.utils.json_to_sheet(ws_data, {header:headers})
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
	const size = "A3"; // Use A1, A2, A3 or A4
	const orientation = "landscape"; // portrait or landscape
  
	const marginLeft = 40;
	const doc = new jsPDF(orientation, unit, size);
  
	doc.setFontSize(15);
  
	// const title = `${pdfTitle}`;
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
          else if (colObj.dataKey === "franchise" && elt.franchise) {
            return { ...acc, franchise: elt.franchise ? elt.franchise.name:"" };
          }
		  else if (colObj.dataKey === "branch" && elt.branch) {
            return { ...acc, branch: elt.branch ? elt.branch.name:"" };
          }
		  else if (colObj.dataKey === "payment_date" && elt.payment_date){
			return { ...acc,payment_date: moment(elt.payment_date).format('DD-MMM-YY')}
			
				  }
		 if (colObj.dataKey === "address" && elt.address) {
		  const address = `${elt.address.house_no},${elt.address.street},${elt.address.landmark},${elt.address.city},${elt.address.district},${elt.address.state},${elt.address.country},${elt.address.pincode}`;
		  return {
			...acc,
			address,	
		  };
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
  
	// doc.text(title, marginLeft, 20);
	// doc.autoTable(content);
	doc.text(40,40,"Ledger");
	doc.autoTable(styledContent);
	doc.save(`${fileName}.pdf`);
	toast.success(
		'File downloaded successfully.',{
  
			autoClose:1000
		}
	  )
  };