 export const timeConvert = (num)=>
 { 
  var hours = Math.floor(num / 60);  
  var minutes = num % 60;
  if(hours ==0){
    return parseInt(minutes)+'m';  
  }else{
    return parseInt(hours) +"."+ parseInt(minutes)+'h';  
  }
       
}