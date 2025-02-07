import jsPDF from "jspdf";
import "jspdf-autotable";
  //   pdf
  import { toast } from 'react-toastify'

  export const downloadPdf = (pdfTitle, headersForPDF, tableData, fileName) => {
	console.log(headersForPDF);
	const unit = "pt";
	const size = "A4"; // Use A1, A2, A3 or A4
	const orientation = "landscape"; // portrait or landscape
  
	const marginLeft = 10;
	const doc = new jsPDF(orientation, unit, size);
  
	doc.setFontSize(15);
  
	const title = `${pdfTitle}`;
  
  
	
	let columns = headersForPDF.map((h) => ({ header: h[1], dataKey: h[0] }));
	let dataBody = tableData.map((elt) => {
	  const data = columns.reduce((acc, colObj) => {
		if (colObj.dataKey === "radius")
		  return {
			...acc,
			[colObj.dataKey]: elt[colObj.dataKey].name,
		  };
		
	
		
		else return { ...acc, [colObj.dataKey]: elt[colObj.dataKey] };
	  }, {});
	  console.log(data);
	  return data;
	});
	console.log(dataBody, ":dataBody")
	console.log(columns, ":columns")
  
	let styledContent = {
	  startY: 50,
	  startX: 10,
	  columnStyles: {
		id: { cellWidth: 40 },
		

	  },
	  body: dataBody,
	  columns,
	};
  
	doc.text(title, marginLeft, 10);
	// doc.autoTable(content);
  
	doc.autoTable(styledContent);
	doc.save(`${fileName}.pdf`);
	toast.success(
		'File downloaded successfully.',{
  
			autoClose:1000
		}
	  )
  };