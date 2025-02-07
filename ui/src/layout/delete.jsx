let columnNames =[];
let records =[];
for(let index in rows){
    if(index ==0){
        columnNames = rows[index].split(",");
    }else{
    let obj= {};
    let dataColumns = rows[index].split(",");
    for(let i in dataColumns){
        obj[columnNames[i]]= dataColumns[i];
    }
    records.push(obj);
    }
}