import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import orderBy from 'lodash/orderBy';
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from 'moment';

// export const downloadExcelFile = (data, type, headers) => {
// 	var wb = XLSX.utils.book_new()
// 	var ws_name = 'SheetJS'
// 	let dataModify = [...data];
// 	if (dataModify) {
// 		dataModify = orderBy(dataModify, ['id'], ['asc']);
// 		dataModify = dataModify.map(row => {

// 			let addressTrim = ''
// 			if (row.address) {

// 				addressTrim = `${row.address.house_no},${row.address.street},${row.address.landmark},${row.address.city},${row.address.district},${row.address.state},${row.address.pincode},${row.address.country}`;
// 			}

// 			return {
// 				id: row.id,
// 				branch:row.branch,
// 				franchise: row.franchise,
// 				customer_username: row.customer_username,
// 				customer_name: row.customer_name,
// 				mobile_number: row.mobile_number,
// 				payment_id: row.payment_id,
// 				pickup_type: row.pickup_type,
// 				payment_method: row.payment_method,
// 				package_name:row?.package_name,
// 				collected_by_name:row.collected_by_name,
// 				collected_by_username: row.collected_by_username,
// 				upi_reference_no:row.upi_reference_no,
// 				transaction_no:row.transaction_no,
// 				check_reference_no:row.check_reference_no,
// 				completed_date: row.completed_date,
// 				security_deposit_refund_date : row.security_deposit_refund_date,
// 				installation_charges:row?.installation_charges,
// 				security_deposit:row?.security_deposit,
// 				amount: row.amount,
// 				due_amount: row.due_amount,
// 				static_ip_total_cost:row.static_ip_total_cost,
// 				status: row.status,

// 			}
// 		})
// 	}
// 	const headerKeys = Object.keys(dataModify[0]);
// 	const requiredHeaderKeys = headers;
// 	let newDataModify = dataModify.map(item => {
// 		let newItem = {};
// 		requiredHeaderKeys.forEach(requiredKey => newItem[requiredKey] = item[requiredKey])
// 		return newItem;
// 	});
// 	const ws_data = newDataModify;
// 	console.log(ws_data)
// 	var ws = XLSX.utils.json_to_sheet(ws_data, { header: headers })
// 	XLSX.utils.book_append_sheet(wb, ws, ws_name)
// 	XLSX.writeFile(
// 		wb,
// 		`Spark Radius${type === 'csv' ? '.csv' : '.xlsx'}`,
// 	)
// 	toast.success(
// 		'File downloaded successfully.', {

// 		autoClose: 1000
// 	}
// 	)
// }

export const downloadExcelFile = (data, type, headers) => {
	var wb = XLSX.utils.book_new();
	var ws_name = 'SheetJS';
	let dataModify = [...data];
	if (dataModify) {
		dataModify = orderBy(dataModify, ['id'], ['asc']);
		dataModify = dataModify.map(row => {
			let addressTrim = '';
			if (row.address) {
				addressTrim = `${row.address.house_no},${row.address.street},${row.address.landmark},${row.address.city},${row.address.district},${row.address.state},${row.address.pincode},${row.address.country}`;
			}
			return {
				id: row.id,
				branch:row.branch,
				franchise: row.franchise,
				customer_username: row.customer_username,
				customer_name: row.customer_name,
				mobile_number: row.mobile_number,
				payment_id: row.payment_id,
				pickup_type: row.pickup_type,
				payment_method: row.payment_method,
				package_name:row?.package_name,
				collected_by_name:row.collected_by_name,
				collected_by_username: row.collected_by_username,
				upi_reference_no:row.upi_reference_no,
				transaction_no:row.transaction_no,
				check_reference_no:row.check_reference_no,
				completed_date: row.completed_date,
				security_deposit_refund_date : row.security_deposit_refund_date,
				installation_charges:row?.installation_charges,
				security_deposit:row?.security_deposit,
				amount: row.amount,
				due_amount: row.due_amount,
				static_ip_total_cost:row.static_ip_total_cost,
				status: row.status,
			};
		});

		// Extract the backend keys from the headers array
		const headerKeys = headers.map(header => header[0]);
		// Extract the frontend labels from the headers array
		const headerLabels = headers.map(header => header[1]);

		let newDataModify = dataModify.map(item => {
			let newItem = {};
			headerKeys.forEach((key, index) => newItem[headerLabels[index]] = item[key]);
			return newItem;
		});

		var ws = XLSX.utils.json_to_sheet(newDataModify, { header: headerLabels });
		XLSX.utils.book_append_sheet(wb, ws, ws_name);
		XLSX.writeFile(
			wb,
			`Spark Radius${type === 'csv' ? '.csv' : '.xlsx'}`,
		);

		toast.success(
			'File downloaded successfully.', {
				autoClose: 1000
			}
		);
	}
};

//   pdf


export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
	const VBCLOGO = require("../../../../../assets/images/rupee1.png");
	const VBCLOGO1 = require("../../../../../assets/images/rupee1.png");

	const unit = "pt";
	const size = "A2"; // Use A1, A2, A3 or A4
	const orientation = "landscape"; // portrait or landscape

	const marginLeft = 40;
	const doc = new jsPDF(orientation, unit, size);
	// doc.addFont('/fonts/awesome/fontawesome-webfont.ttf', 'FontAwesome', 'normal', 'StandardEncoding');
	doc.setFont('FontAwesome');
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
			else if (colObj.dataKey === "completed_date" && elt.completed_date) {
				return { ...acc, completed_date: moment(elt.completed_date).format('DD MMM YY') }
			}
			else if (colObj.dataKey === "security_deposit_refund_date" && elt.security_deposit_refund_date) {
				return { ...acc, security_deposit_refund_date: moment(elt.security_deposit_refund_date).format('DD MMM YY') }
			}
			else return { ...acc, [colObj.dataKey]: elt[colObj.dataKey] };
		}, {});
		console.log(data);
		return data;
	});
	console.log(dataBody);

	let styledContent = {
		startY: 50,
		startX: 70,
		columnStyles: {
			id: { cellWidth: 40 },
			customer_username: { cellWidth: 60 },
			customer_name: { cellWidth: 100 },
			franchise: { cellWidth: 80 },


		},
		body: dataBody,
		columns,
	};

	doc.text(title, marginLeft, 20);
	// doc.autoTable(content);
	doc.addImage(VBCLOGO, 'PNG', 840, 27, 10, 10);
	doc.addImage(VBCLOGO1, 'PNG', 1005, 27, 10, 10);
	doc.autoTable(styledContent);
	doc.save(`${fileName}.pdf`);
	toast.success(
		'File downloaded successfully.', {

		autoClose: 1000
	}
	)
};