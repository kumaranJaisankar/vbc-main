import moment from 'moment';

export const getConvertedDataByMonth =(data, noDate=false)=>{
    const monthObject = {
        January: {},
        February: {},
        March: {},
        April: {},
        May: {},
        June: {},
        July: {},
        August: {},
        September: {},
        October: {},
        November: {},
        December: {}
    }
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    for (let i = 0; i < data.length; i++) {

        var date = moment(data[i].date);
        let checkMonth = date.format("M") - 1;
        let checkDate = date.format("D");
        let newData = { ...monthObject[months[checkMonth]] };
        newData[checkDate] = { ...data[i] };

        monthObject[months[checkMonth]] = {
            ...newData
        };
    }

    return monthObject;

}



export const getConvertedDataByMonthNodate =(data)=>{
    const monthObject = {
        January: [],
        February: [],
        March: [],
        April: [],
        May: [],
        June: [],
        July: [],
        August: [],
        September: [],
        October: [],
        November: [],
        December: []
    }
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    for (let i = 0; i < data.length; i++) {

        var date = moment(data[i].date,'YYYY-MM');
        let checkMonth = date.format("M") - 1;
        let newData = [ ...monthObject[months[checkMonth]] ];
       newData.push(data[i]);

        monthObject[months[checkMonth]] = [
            ...newData
        ];
    }

    return monthObject;

}


export const getConvertedDataByMonthKeyYear =(data, noDate=false)=>{
    const monthObject = {}
    //     January: {},
    //     February: {},
    //     March: {},
    //     April: {},
    //     May: {},
    //     June: {},
    //     July: {},
    //     August: {},
    //     September: {},
    //     October: {},
    //     November: {},
    //     December: {}
    // }
    // const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    for (let i = 0; i < data.length; i++) {

        var date = moment(data[i].month);
        // let checkMonth = date.format("M") - 1;
        // let checkDate = date.format("D"); 
        let objKey = moment(date).format("MMM YY");
       // let newData = { ...monthObject[months[checkMonth]] };
       monthObject[objKey] = { ...data[i] };

    }


    return monthObject;

}