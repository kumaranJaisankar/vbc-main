import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import orderBy from 'lodash/orderBy';
import { statusType} from "../../../customermanagement/data";
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

			let d = new Date(row.expiry_date)
			let p = new Date(row.plan_updated)
			let c = new Date(row.created)
			let addressTrim = ''
			if(row.address) {

				 addressTrim = `${row.address.house_no},${row.address.street},${row.address.landmark},${row.address.city},${row.address.district},${row.address.state},${row.address.pincode},${row.address.country}`;
			}
			
		
			return {
				first_name:row.first_name,
				register_mobile:row.register_mobile,
				registered_email:row.registered_email,
				branch:row.branch,
				last_invoice_id:row.last_invoice_id,
				account_type:row.account_type,
				account_status:row.account_status,
				username:row.username,
				// package_name:row.package_name?.package_name || "",
				// download_speed:row.package_name?.download_speed || "",
				// upload_speed:row.package_name?.upload_speed || "",
				package_name:row.package_name,
				download:row.download,
				upload:row.upload,
				plan_updated:(p.getFullYear() + "-" +  (p.getMonth() + 1) + "-" +  p.getDate()),
				expiry_date:(d.getFullYear() + "-" +  (d.getMonth() + 1) + "-" +  d.getDate()),
				// user_advance_info:row.user_advance_info.GSTIN,
				address:addressTrim,
			 // Added Missing Columns for export by Marieya
				zone : row.zone,
				area : row.area,
				franchise: row.franchise,
				user_advance_info : row?.user_advance_info?.security_deposit,
				user_advance_info : row?.user_advance_info?.installation_charges,
				created : (c.getFullYear() + "-" +  (c.getMonth() + 1) + "-" +  c.getDate())
				//end
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
	// console.log(ws_data)

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
      `Customers ${type === 'csv' ? '.csv' : '.xlsx'}`,
    )
    toast.success(
      'File downloaded successfully.',{

		  autoClose:1000
	  }
    )
  }


//   pdf
//pdf size is changed by Marieya

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
  
	const data = tableData.map((elt) => {
	  return dataKey.map((key) => {
		if (key === "radius") return elt[key.name];
		 else if (key === "status")
		  return statusType.find((s) => s.id == elt.account_status).name;
		  else if (key === "service_plan") return elt[key]?.package_name || "";
		  else if (key === "service_plan") return elt[key]?.upload_speed || ""

		else if (key === "address" && elt.address)
		  return `${elt.address.house_no},${elt.address.street},${elt.address.landmark},${elt.address.city},${elt.address.district},${elt.address.state},${elt.address.country},${elt.address.pincode}`;
		else return elt[key];
	  });
	});
	let content = {
	  startY: 50,
	  head: headers,
	  body: data,
	};
  
	let columns = headersForPDF.map((h) => ({ header: h[1], dataKey: h[0] }));
	let dataBody = tableData.map((elt) => {
	  const data = columns.reduce((acc, colObj) => {
		if (colObj.dataKey === "radius")
		  return {
			...acc,
			[colObj.dataKey]: elt[colObj.dataKey].name,
		  };

		//   else if(colObj.dataKey === "radius_info" && elt.radius_info){
		// 	return { ...acc, radius_info: elt.radius_info.static_ip_bind };
		// }
		else if (colObj.dataKey === "status") {
		  const statusObj = statusType.find((s) => s.id == elt.account_status);
		  return {
			...acc,
			status: statusObj.name,
		  };
		} else if (colObj.dataKey === "address" && elt.address) {
		  const address = `${elt.address.house_no},${elt.address.street},${elt.address.landmark},${elt.address.city},${elt.address.district},${elt.address.state},${elt.address.country},${elt.address.pincode}`;
		  return {
			...acc,
			address,
		  };
		} else if (colObj.dataKey === "service_plan" && elt.service_plan){
			return {...acc, service_plan: elt.service_plan?.package_name || ""}
		} else if (colObj.dataKey === "user_advance_info" && elt.user_advance_info){
			return {...acc, user_advance_info: elt.user_advance_info?.security_deposit || ""}
		} 
		else if (colObj.dataKey === "user_advance_info" && elt.user_advance_info){
			return {...acc, user_advance_info: elt.user_advance_info?.installation_charges || ""}
		} 
		// else if (colObj.dataKey === "user_advance_info" && elt.user_advance_info) {
		// 	return { ...acc, user_advance_info: elt.user_advance_info.GSTIN };
		//   }

		else if (colObj.dataKey === "upload_speed" && elt.service_plan || colObj.dataKey === "download_speed" && elt.service_plan){
			return {...acc,  upload_speed: elt.service_plan?.upload_speed || "" , download_speed:elt.service_plan?.download_speed || ""}

		}		else if(colObj.dataKey === "expiry_date" && elt.expiry_date){
			return{...acc,expiry_date: moment(elt.expiry_date).format('YYYY-MM-DD')}
		} 
		else if (colObj.dataKey === "plan_updated" && elt.plan_updated){
		return{...acc,plan_updated: moment(elt.plan_updated).format('YYYY-MM-DD')}
		}else if (colObj.dataKey === "created" && elt.created){
			return{...acc,created: moment(elt.created).format('YYYY-MM-DD')}
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
		username: { cellWidth:100},
		first_name:{ cellWidth:40},
		package_name:{cellWidth:80},
		register_mobile: { cellWidth:65},
		branch:{ cellWidth: 60},
		service_plan:{ cellWidth:60},
		account_type: { cellWidth:60},
		last_invoice_id:{ cellWidth:80},
		upload_speed:{ cellWidth:30},
		download_speed: { cellWidth:30},
		account_status: { cellWidth:60},
		expiry_date:{ cellWidth:60},
		registered_email:{ cellWidth:60},
		plan_updated:{ cellWidth:65},
		// columns added by marieya
		zone:{cellWidth:60},
		area:{cellWidth:60},
		franchise:{cellWidth:80},
		created : {cellWidth:60},
	    installation_charges : {cellWidth:60}

		// GSTIN: { cellWidth:100},

	  },
	  body: dataBody,
	  columns,
	};
	doc.text(40,40,"Customers");
  
	// doc.text(title, marginLeft, 20);
	// doc.autoTable(content);
  
	doc.autoTable(styledContent);
	doc.save(`${fileName}.pdf`);
	toast.success(
		'File downloaded successfully.',{
  
			autoClose:1000
		}
	  )
  };