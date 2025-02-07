import React from "react";
import isEmpty from "lodash/isEmpty";
import { isValueZero } from "../../utils";

const useFperormValidation = (requiredFields) => {
  const validate = (inputs) => {
    const errors = {};
    errors["permanent_address"] = {};
    const notRequiredFields = [
      // validaion
      "last_name",
      // "email",
      "alternate_mobile_no",
      "house_no",
      "customer_pic",
      "landmark",
      "street",
      "city",
      "pincode",
      "signature",
      "district",
      "state",
      "address_proof",
      "country",
      "identity_proof",
      "alternate_mobile_number",
      "static_ip_bind"
    ];
    //  Sailaja changed validation msg as guided by QA team on 3rd August
    {/*changed pan card keyname by Marieya */ }
    requiredFields.map((field) => {
      if (!notRequiredFields.includes(field) && !inputs[field]) {
        // errors.addlead = "Mandatory fields cannot be null";
        // if (field === "Aadhar_Card_No" && !inputs.customer_documents[field]) {
        //   errors[field] = "Field is required ";
        // }
        //  else if (field === "pan_card" && !inputs.customer_documents[field]) {
        //     errors[field] = "Pan Number is required ";
        //   } 
        {/*added validation for pan card by Marieya on 27.8.22*/ }
        // if (field === "pan_card" && !inputs.customer_documents[field]) {
        //   errors[field] = "Pan Number is required ";
        // }
        if (field === "plan_CGST" && !isValueZero(inputs[field])) {
          errors[field] = `Required ${field}`;
        } else if (field === "plan_SGST" && !isValueZero(inputs[field])) {
          errors[field] = `Required ${field}`;
        } else if (
          field !== "Aadhar_Card_No" &&
          field !== "pan_card" &&
          field !== "plan_CGST" &&
          field !== "plan_SGST"
        ) {
          errors[field] = `Required ${field}`;
        }
      }
      //Sailaja changed validation message from Only characters allowed to Only Alphabet characters allowed on 16th August
      // First name
        if (field === "first_name" && !inputs.first_name) {
        errors[field] = "Field is required";
      } else if (
        field === "first_name" &&        !/^[a-zA-Z ]+$/i.test(inputs.first_name)
      ) {
        errors[field] = "Only chracters are allowed";
      }
        //(Start)Sailaja Added first name should be more than 2 characters validation on 17th August
        else if (
          field === "first_name" &&          !!inputs.first_name &&          inputs.first_name.length <= 2
        ) {
          errors[field] = "Length cannot be less than 3 characters";
        }
      //(End)Sailaja Added first name should be more than 2 characters validation on 17th August
      if (
        field === "first_name" &&        !!inputs.first_name &&        inputs.first_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters ";
      }

      // Customer Info

      // Sailaja Modified Validation Error message for AAdhar Number on 3rd August
      if (
        field === "Aadhar_Card_No_1" &&
        !inputs.Aadhar_Card_No_1
      ) {
        errors[field] = "Field is required"
      } 
      else if(field == "Aadhar_Card_No_1" &&  !/^([0-9])+$/i.test(inputs?.Aadhar_Card_No_1) 
      ){ 
        errors[field] = "Only digits are allowed"; 
      } 
       else if (
        field === "Aadhar_Card_No_1" &&
        !/^([0-9]){12}$/.test(inputs.Aadhar_Card_No_1)
      ) {
        errors[field] = "Aadhar number should be 12 digits";
      }
      if (
        field === "Aadhar_Card_No_1" &&
        !!inputs.Aadhar_Card_No_1 &&
        inputs.Aadhar_Card_No_1.length > 12
      ) {
        errors[field] = "Length cannot be more than 12";
      }
      //
      // Mobile number


      // if (field === "mobile_no" && !inputs.mobile_no) {
      // errors[field] = "Mobile is required";
      // } else if (field === "mobile_no" && !/^\d{10}$/i.test(inputs.mobile_no)) {
      // errors[field] = "Enter valid mobile number";
      // }

      // if (field === "mobile_no" && !inputs.mobile_no) {
      //   errors[field] = "Field is required";
      // } else if (field === "mobile_no" && !/^\d{10}$/i.test(inputs.mobile_no)) {
      //   errors[field] = "Enter valid number";
      // }
      // if (
      //   field === "mobile_no" &&
      //   !!inputs.mobile_no &&
      //   inputs.mobile_no.length > 10
      // ) {
      //   errors[field] = "Length cannot be more than 10 characters";
      // }
      if (field === "mobile_no" && !inputs.mobile_no) {
        errors[field] = "Field is required";
      } else if (
        field === "mobile_no" &&
        !/^([0-9])+$/i.test(inputs.mobile_no)
      ) {
        errors["mobile_no"] = "Only digits are allowed";
      } else if (
        field === "mobile_no" &&
        !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs.mobile_no)
      ) {
        errors["mobile_no"] = "Please enter valid 10 digits";
      }
      if (
        field === "mobile_no" &&
        !!inputs.mobile_no &&
        inputs.mobile_no.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }
      //alternate_mobile_no

      if (
        field === "alternate_mobile_no" &&
        !!inputs.alternate_mobile_no &&
        !/^\d{10}$/i.test(inputs.alternate_mobile_no)
      ) {
        errors[field] = "Enter valid alternative mobile number";
      }
      if (
        field === "alternate_mobile_no" &&
        !!inputs.alternate_mobile_no &&
        inputs.alternate_mobile_no.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 characters";
      }

      // alternate_mobile_number
      if (
        field === "alternate_mobile_number" &&
        !!inputs.alternate_mobile_number &&
        !/^\d{10}$/i.test(inputs.alternate_mobile_number)
      ) {
        errors[field] = "Enter valid alternative mobile number";
      }
      if (
        field === "alternate_mobile_number" &&
        !!inputs.alternate_mobile_number &&
        inputs.alternate_mobile_number.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 characters";
      }


   

    

    

      //landmark

     
      if (field == "landmark" && !isEmpty(inputs?.permanent_address)) {
        if (field === "landmark" && !inputs?.permanent_address?.landmark) {
          // errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "landmark" &&
          !/^([0-9,a-zA-Z /]+)$/i.test(inputs?.permanent_address?.landmark)

          // !/^([a-zA-Z ]){1,30}$/i.test(inputs.permanent_address.landmark)
        ) {
          errors["permanent_address"][field] = "Alphanumeric characters are allowed";
        }
        if (
          field === "landmark" &&
          inputs?.permanent_address?.landmark?.length > 50
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 50 characters";
        }
      }
      //end
      //street

    

      if (field == "street" && !isEmpty(inputs?.permanent_address)) {
        if (field === "street" && !inputs?.permanent_address?.street) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "street" &&
          !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.permanent_address?.street)
        ) {
          errors["permanent_address"][field] = "Alphanumeric and special characters (, _ : = + / ; . -) only";
        }
        if (field === "street" && inputs?.permanent_address?.street?.length > 50) {
          errors["permanent_address"][field] = "Field cannot be more than 50 characters";
        }
      }

      //h.no

      if (field == "house_no" && !isEmpty(inputs?.permanent_address)) {
        if (field === "house_no" && !inputs?.permanent_address?.house_no) {
          // errors["permanent_address"][field] = "House No is required";
        } else  if (
          field === "house_no" &&
          !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.permanent_address?.house_no)
        ) {
          errors["permanent_address"][field] =
            "Alphanumeric and special characters (, _ : = + / ; . -) only";
        }
        if (
          field === "house_no" &&
          inputs?.permanent_address?.house_no?.length > 200
        ) {
          errors["permanent_address"][field] = "Length cannot be more than 200 characters";
        }
      }
      //city

    

      if (field == "city" && !isEmpty(inputs?.permanent_address)) {
        if (field === "city" && !inputs?.permanent_address?.city) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "city" &&
          !/^([a-zA-Z ]+)$/i.test(inputs?.permanent_address?.city)
        ) {
          errors["permanent_address"][field] = "Only characters are allowed";
        }
        if (field === "city" && inputs?.permanent_address?.city?.length > 50) {
          errors["permanent_address"][field] = "Length cannot be more than 50 characters";
        }
      }
//start
// if (field == "pincode" && !isEmpty(inputs?.address)) {
//   if (field === "pincode" && !inputs?.address?.pincode) {
//     errors[field] = "Field is required";
//   } else if (
//     field === "pincode" &&
//     !/^([0-9])+$/i.test(inputs?.address?.pincode)
//   ) {
//     errors[field] = "Only digits are allowed";
//   }
//   else if (
//     field === "pincode" &&
//     inputs?.address &&
//     inputs?.address?.pincode &&
//     inputs?.address?.pincode?.length > 6
//   ) {
//     errors[field] = "Length cannot be more than 6 digits";
//   }
// else  if (
//     field === "pincode" &&
//     inputs?.address &&
//     inputs?.address?.pincode &&
//     inputs?.address?.pincode?.length < 6
//   ) {
//     errors[field] = "Length cannot be less than 6 digits";
//   }
//   // Sailaja Fixed only digits validation even 1 alphabet  entered on 4th March 2023
// } else {
//   if (field === "pincode" && !inputs?.pincode) {
//     errors[field] = "Field is required";
//   } else if (field === "pincode" && !/^([0-9])+$/i.test(inputs?.pincode)) {
//     errors[field] = "Only digits are allowed";
//   }
//   // if(field == "pincode"  !=  !/^[a-zA-Z !\"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/i.test(inputs?.pincode) ){
//   //   errors[field] = "Only digits are allowed";
//   // }
//  else if (
//     field === "pincode" &&
//     !!inputs?.pincode &&
//     inputs?.pincode?.length > 6
//   ) {
//     errors[field] = "Length cannot be more than 6 digits";
//   }

// else if  (field === "pincode" &&
// !!inputs?.pincode &&
// inputs?.pincode?.length < 6
// ) {
// errors[field] = "Length cannot be less than 6 digits";
// }
// }

//end


    




      // pincode
      // Sailaja Updated one of the pincode char entries validation as  Please enter valid pincode on 5th August
      if (field == "pincode" && !isEmpty(inputs?.permanent_address)) {
        if (field === "pincode" && !inputs?.permanent_address?.pincode) {
          errors["permanent_address"][field] = "Pincode is required";
        } else if (
          field === "pincode" &&
          !/^([0-9])+$/i.test(inputs?.permanent_address?.pincode)
        ) {
          errors["permanent_address"][field] = "Only digits are allowed";
        } else  if (
          field === "pincode" &&
          inputs?.permanent_address?.pincode?.length > 6
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 6 digits";
        }else  if (
          field === "pincode" &&
          inputs?.permanent_address?.pincode?.length < 6
        ) {
          errors["permanent_address"][field] =
            "Length cannot be less than 6 digits";
        }
      }

      //district

     
     
      if (field == "district" && !isEmpty(inputs?.permanent_address)) {
        if (field === "district" && !inputs?.permanent_address?.district) {
          errors["permanent_address"][field] = "District is required";
        } else if (
          field === "district" &&
          !/^([a-zA-Z _+-\/()]+)$/i.test(inputs?.permanent_address?.district)
          // !/^([0-9,;a-zA-Z _+-\/()]+)$/i.test(inputs?.permanent_address?.district)
        ) {
          errors["permanent_address"][field] = "Please enter characters only";
        }
        if (
          field === "district" &&
          inputs?.permanent_address?.district?.length > 70
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 70 characters";
        }
      }

      //state

     

      if (field == "state" && !isEmpty(inputs?.permanent_address)) {
        if (field === "state" && !inputs?.permanent_address?.state) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "state" &&
          !/^([a-zA-Z ]+)$/i.test(inputs?.permanent_address?.state)
        ) {
          errors["permanent_address"][field] = "Only characters are allowed";
        }
        if (field === "state" && inputs?.permanent_address?.state?.length > 70) {
          errors["permanent_address"][field] = "Length cannot be more than 70 characters";
        }
      }

      //country


      if (field == "country" && !isEmpty(inputs?.permanent_address)) {
        if (field === "country" && !inputs?.permanent_address?.country) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "country" &&
          !/^([a-zA-Z ]+)$/i.test(inputs?.permanent_address?.country)
        ) {
          errors["permanent_address"][field] = "Only characters are allowed";
        }
        if (
          field === "country" &&
          inputs?.permanent_address?.country?.length > 50
        ) {
          errors["permanent_address"][field] = "Length cannot be more than 50 characters";
        }
      }

   
    
     
      //changed mobile no text by Marieya on 20/8/22
      //mob no
      // if (field === "mobile_number" && !inputs.mobile_number) {
      //   errors[field] = "Field is required";
      // } else if (
      //   field === "mobile_number" &&
      //   !/^\d{10}$/i.test(inputs.mobile_number)
      // ) {
      //   errors[field] = "Enter valid number";
      // }
      // if (
      //   field === "mobile_number" &&
      //   !!inputs.mobile_number &&
      //   inputs.mobile_number.length > 10
      // ) {
      //   errors[field] = "Length cannot be more than 10 characters";
      // }

      if (field === "mobile_number" && !inputs.mobile_number) {
        errors[field] = "Field is required";
      } else if (
        field === "mobile_number" &&
        !/^([0-9])+$/i.test(inputs.mobile_number)
      ) {
        errors["mobile_number"] = "Only digits are allowed";
      } else if (
        field === "mobile_number" &&
        !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs.mobile_number)
      ) {
        errors["mobile_number"] = "Please enter valid 10 digits";
      }
      if (
        field === "mobile_number" &&
        !!inputs.mobile_number &&
        inputs.mobile_number.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }

      if (
        field === "email" &&
        !!inputs.email &&
        // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.email)
        !/^([a-z0-9\._])*@([a-z]{3,8})*(\.[a-z]{2,3})+$/.test(inputs.email)
      ) {
        errors[field] = "Enter valid Email";
      }
      if (field === "email" && !!inputs.email && inputs.email.length > 50) {
        errors[field] = "Length cannot be more than 50 characters";
      }

      //email

      // if (field === "email" && !inputs.email) {
      //   errors[field] = "This field is required";
      // } else if (
      //   field === "email" &&
      //   !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(inputs.email)
      // ) {
      //   errors[field] = "Enter valid email";
      // }

      //pws
      if (
        (field === "password") !== "undefined" &&
        (field === "password2") !== "undefined"
      ) {
        if (inputs.password != inputs.password2) {
          // isValid = false;

          errors["password"] = "Passwords don't match";
          errors["password2"] = "Passwords don't match";
        }
      }

      // ^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$

      if (field === "password" && !inputs.password) {
        errors[field] = "Field is required";
      }
      else if (
        field === "password" &&
        !/^\S*$/i.test(inputs.password)

      ) {
        errors[field] = "Enter valid password";
      }
      if (
        field === "password" &&
        !!inputs.password &&
        inputs.password.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }

      //pwd reenter
      if (field === "password2" && !inputs.password2) {
        errors[field] = "Field is required";
      }
      else if (
        field === "password2" &&
        !/^\S*$/i.test(inputs.password2)

      ) {
        errors[field] = "Enter valid password";
      }
      if (
        field === "password2" &&
        !!inputs.password2 &&
        inputs.password2.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }

      //end

      //username
      if (field === "username" && !inputs.username) {
        errors[field] = "Field is required";
      } else if (
        field === "username" &&
        !/^([0-9a-zA-Z _-]){1,30}$/i.test(inputs.username)
      ) {
        errors[field] = "Only Alphanumeric characters and (_ -) are allowed";
      }
      if (
        field === "username" &&
        !!inputs.username &&
        inputs.username.length > 25
      ) {
        errors[field] = "Length cannot be more than 25 characters";
      }
      if (field === "username" && !/^\S*$/i.test(inputs.username)) {
        errors[field] = "Whitespaces are not allowed";
      }
      if (field === "username" && !/^\S*$/i.test(inputs.username)) {
        errors[field] = "Whitespaces are not allowed";
      }


      //radius user name
      if (field === "radius_username" && !inputs.radius_username) {
        errors[field] = "Field is required";
      }
      if (
        field === "radius_username" &&
        !!inputs.radius_username &&
        inputs.radius_username.length > 30
      ) {
        errors[field] = "Length cannot be more than 30 characters";
      }
      //end
      //made change from "Enter Valid Last Name" to "only characters allowed by Marieya on line 948"
      //last name
      if (field === "last_name" && !inputs.last_name) {
        errors[field] = "Field is required";
      } else if (
        field === "last_name" &&
        !!inputs.last_name && !/^[a-zA-Z ]+$/i.test(inputs.last_name)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "last_name" &&
        !!inputs.last_name &&
        inputs.last_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }

      //area
      // if (field === "area" && !inputs.area) {
      //   errors[field] = "Area is required";
      // } else if (
      //   field === "area" &&
      //   !/^([a-zA-Z ]){1,30}$/i.test(inputs.area)
      // ) {
      //   errors[field] = "Please enter valid area";
      // }
      // if (field === "area" && !!inputs.area && inputs.area.length > 20) {
      //   errors[field] = "Length cannot be morethan 20";
      // }

      //roles
      if (field === "roles" && !inputs.roles) {
        errors[field] = "Field is required";
      }
      if (field === "users" && !inputs.users) {
        errors[field] = "Field is required";
      }
      //branch
      // if (field === "branch" && !inputs.branch) {
      //   errors[field] = "This field is required";
      // }
      //aadhar card
      // const validator = require('aadhaar-validator');

      // if(validator.isValidNumber('Aadhar_Card_No')){
      //   errors[field] = "Aadhar No is valid";
      // }
      // else if (
      //   errors[field]= "Bhanu Aadhar No"
      // )
      // validation content for 12 digits added by marieya
      // Sailaja fixed AAdharnumber validation on 4th August  [didn't fire  "Length cannot be morethan 12" validation msg before]  
      if (
        field === "Aadhar_Card_No" &&
        !inputs.customer_documents.Aadhar_Card_No
      ) {
        errors[field] = "Field is required";
      } 
      else if(field == "Aadhar_Card_No" &&    !/^([0-9])+$/i.test(inputs?.customer_documents?.Aadhar_Card_No) 
      ){ 
        errors[field] = "Only digits are allowed";
       } 
        else if (
        field === "Aadhar_Card_No" &&
        !/^([0-9]){12}$/.test(inputs.customer_documents.Aadhar_Card_No)
      ) {
        errors[field] = "Aadhar number should be 12 digits";
      }
      if (
        field === "Aadhar_Card_No" &&
        !!inputs.customer_documents.Aadhar_Card_No &&
        inputs.customer_documents.Aadhar_Card_No.length > 12
      ) {
        errors[field] = "Length cannot be more than 12 digits";
      }
      //end
      // {/*Added Validations Code for Category in Admin by Marieya on 22/8/22*/}
      // if (field === "ticket_category" && !inputs.ticket_category) {
      //   errors[field] = "Category is required";
      // } else if (
      //   field === "ticket_category" &&
      //   !/^([a-zA-Z ]){1,30}$/i.test(inputs.ticket_category)
      // ) {
      //   errors[field] = "Please enter valid name";
      // }
      // if (
      //   field === "ticket_category" &&
      //   !!inputs.ticket_category &&
      //   inputs.ticket_category.length > 20
      // ) {
      //   errors[field] = "Length cannot be more than 20";
      // }
      // {/*end*/}
      {/*added admin ticket category validation code by Marieya on 22.8.22 */ }
      if (field === "new_ticket_category" && !inputs.new_ticket_category) {
        errors[field] = "Field is required";
      } else if (
        field === "new_ticket_category" &&
        !/^[_-a-zA-Z ]+$/i.test(inputs.new_ticket_category)
      ) {
        errors[field] = "Only characters are allowed";
      }
      if (
        field === "new_ticket_category" &&
        !!inputs.new_ticket_category &&
        inputs.new_ticket_category.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }
      {/*end*/ }
      {/*Addded Subject field validation code for admin category by Marieya on 22.8.22*/ }
      if (field === "new_subject" && !inputs.new_subject) {
        errors[field] = "Field is required";
      } else if (
        field === "new_subject" &&
        !/^([a-zA-Z ]){1,30}$/i.test(inputs.new_subject)
      ) {
        errors[field] = "Please enter valid subject";
      }
      if (
        field === "new_subject" &&
        !!inputs.subject &&
        inputs.subject.length > 20
      ) {
        errors[field] = "Length cannot be more than 20";
      }
      {/*end*/ }
      //cate
      if (field === "category" && !inputs.category) {
        errors[field] = "Field is required";
      } else if (
        field === "category" &&
        !/^([a-zA-Z ]){1,30}$/i.test(inputs.category)
      ) {
        errors[field] = "Please enter valid name";
      }
      if (
        field === "category" &&
        !!inputs.category &&
        inputs.category.length > 20
      ) {
        errors[field] = "Length cannot be more than 20";
      }
      if (field === "subject" && !inputs.subject) {
        errors[field] = "Field is required";
      } else if (
        field === "subject" &&
        !/^([a-zA-Z ]){1,30}$/i.test(inputs.subject)
      ) {
        errors[field] = "Please enter valid name";
      }
      if (
        field === "subject" &&
        !!inputs.subject &&
        inputs.subject.length > 20
      ) {
        errors[field] = "Length cannot be more than 20";
      }
      //branch
      // if (field === "country" && !/^[a-zA-Z]+$/i.test(inputs.country)) {
      //   errors[field] = (
      //     <i
      //       style={{ color: "#ff6666", fontSize: "23px" }}
      //       className="icofont icofont-exclamation"
      //     ></i>
      //   );
      // }
      if (field === "landline" && !inputs.landline) {
        errors[field] = "Field is required";
      } else if (field === "landline" && !/^\d{10}$/i.test(inputs.landline)) {
        errors[field] = "Enter valid number";
      }
      if (
        field === "landline" &&
        !!inputs.landline &&
        inputs.landline.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 characters";
      }

      // if (field === "mobile" && !inputs.mobile) {
      //   errors[field] = "Field is required";
      // } else if (field === "mobile" && !/^\d{10}$/i.test(inputs.mobile)) {
      //   errors[field] = "Enter valid number";
      // }
      // if (field === "mobile" && !!inputs.mobile && inputs.mobile?.length > 10) {
      //   errors[field] = "Length cannot be more than 10 characters";
      // }
//new number validation
if (field === "mobile" && !inputs.mobile) {
  errors[field] = "Field is required";
} else if (
  field === "mobile" &&
  !/^([0-9])+$/i.test(inputs.mobile)
) {
  errors["mobile"] = "Only digits are allowed";
} else if (
  field === "mobile" &&
  !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs.mobile)
) {
  errors["mobile"] = "Please enter valid 10 digits";
}
if (
  field === "mobile" &&
  !!inputs.mobile &&
  inputs.mobile.length > 10
) {
  errors[field] = "Length cannot be more than 10 digits";
}


      //priyanka's form validation.
      if (field === "register_mobile" && !inputs?.register_mobile) {
        errors[field] = "Field is required";
      } else if (
        field === "register_mobile" &&
        !/^([0-9])+$/i.test(inputs?.register_mobile)
      ) {
        errors["register_mobile"] = "Only digits are allowed";
      } else if (
        field === "register_mobile" &&
        !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.register_mobile)
      ) {
        errors["register_mobile"] = "Please enter valid 10 digits";
      }
      if (
        field === "register_mobile" &&
        !!inputs.register_mobile &&
        inputs.register_mobile.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }
      // if (field === "register_mobile" && !inputs?.register_mobile) {
      //   errors[field] = "Field is required";
      // } else if (
      //   field === "register_mobile" &&
      //   // !/^\d{10}$/i.test(inputs.register_mobile)
      //   !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.register_mobile)
      // ) {
      //   errors[field] = "Only digits are allowed";
      // }
      // if (
      //   field === "register_mobile" &&
      //   !!inputs.register_mobile &&
      //   inputs?.register_mobile?.length > 10
      // ) {
      //   errors[field] = "Length cannot be more than 10 characters";
      // }
      //Sailaja changed email as Email in 3rd August
      //registered_email
      if (field === "registered_email" && !inputs.registered_email) {
        errors[field] = "Field is required";
      } else if (
        field === "registered_email" &&
        // !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(inputs.registered_email)
        !/^([a-z0-9\._])*@([a-z]{3,8})*(\.[a-z]{2,3})+$/.test(inputs.registered_email)
        // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.registered_email)
      ) {
        errors[field] = "Enter valid Email";
      }

      //service plan time

      //package name

      if (field === "package_name" && !inputs.package_name) {
        errors[field] = "Field is required";
      } else if (
        field === "package_name" &&
        !/^[_a-zA-Z0-9 ]+$/i.test(inputs.package_name)
      ) {
        errors[field] = "Alphanumeric and special characters (, _ : = + / ; . -) only";
      }

      if (
        field === "package_name" &&
        !!inputs.package_name &&
        inputs.package_name.length > 70
      ) {
        errors[field] = "Length cannot be more than 70";
      }

      //download_speed

      if (field === "download_speed" && !inputs.download_speed) {
        errors[field] = "Field is required";
      } else if (
        field === "download_speed" &&
        !/^([0-9]+)$/i.test(inputs.download_speed)
      ) {
        errors[field] = "Enter valid Download speed";
      }

      //upload_speed
      if (field === "upload_speed" && !inputs.upload_speed) {
        errors[field] = "Field is required";
      } else if (
        field === "upload_speed" &&
        !/^([0-9]+)$/i.test(inputs.upload_speed)
      ) {
        errors[field] = "Enter valid Upload speed";
      }
      //fup_limit
      if (field === "fup_limit" && !inputs.fup_limit) {
        errors[field] = "Field is required";
      } else if (
        field === "fup_limit" &&
        !/^([0-9]+)$/i.test(inputs.fup_limit)
      ) {
        errors[field] = "Enter valid FUP Limit ";
      }

      //time_unit
      if (field === "time_unit" && !inputs.time_unit) {
        errors[field] = "Field is required";
      } else if (
        field === "time_unit" &&
        !/^([0-9]+)$/i.test(inputs.time_unit)
      ) {
        errors[field] = "Enter valid time unit ";
      }
      //plan_cost
      if (field === "plan_cost" && !inputs.plan_cost) {
        errors[field] = "Field is required";
      } else if (
        field === "plan_cost" &&
        !/^[0-9]*\.?[0-9]*$/i.test(inputs.plan_cost)
      ) {
        errors[field] = "Enter valid plan cost";
      }

      //plan_cgst

      if (
        field === "plan_CGST" &&
        !isValueZero(inputs.plan_CGST) &&
        !inputs.plan_CGST
      ) {
        errors[field] = "Field is required";
      } else if (
        field === "plan_CGST" &&
        !/^([0-9]+)$/i.test(inputs.plan_CGST)
      ) {
        errors[field] = "Enter valid plan cgst";
      }

      //plan_sgst
      if (
        field === "plan_SGST" &&
        !isValueZero(inputs.plan_SGST) &&
        !inputs.plan_SGST
      ) {
        errors[field] = "Field is required";
      } else if (
        field === "plan_SGST" &&
        !/^([0-9]+)$/i.test(inputs.plan_SGST)
      ) {
        errors[field] = "Enter valid plan sgst";
      }

      //franchi service
      // if (field === "franchise" && !inputs.name) {
      //   errors[field] = " franchise is required";
      // } else if (
      //   field === "franchise" &&
      //   !/^([a-zA-Z ]){1,30}$/i.test(inputs.franchise)
      // ) {
      //   errors[field] = "only characters allowed";
      // }
      // if (
      //   field === "franchise" &&
      //   !!inputs.franchise &&
      //   inputs.franchise.length > 15
      // ) {
      //   errors[field] = "Length cannot be morethan 15";
      // }

      if (field === "h_no" && !inputs.h_no) {
        errors[field] = "Field is required";
      } else if (
        field === "h_no" &&
        !/^([0-9 a-zA-Z _+-\/]+)$/i.test(inputs.h_no)
      ) {
        errors[field] = "Enter valid house number";
      }
      //priority
      {/*Changed text on line 1313 and 1319 by Marieya for priority */ }
      if (
        field === "escalation_notification_message" &&
        !inputs.escalation_notification_message
      ) {
        errors[field] = "Field is required";
      }
      if (
        field === "notification_frequency" &&
        !inputs.notification_frequency
      ) {
        errors[field] = "Field is required";
      }
      //added by Marieya for response time in priority on 22/8/22
      if (field === "priority_response_time" && !inputs.priority_response_time) {
        errors[field] = "Field is required";
      }
      //end
      //added by Marieya for resolution time in priority on 22/8/22
      if (field === "priority_resolution_time" && !inputs.priority_resolution_time) {
        errors[field] = "Field is required";
      }
      //end
      if (field === "response_time" && !inputs.response_time) {
        errors[field] = "Field is required";
      }
      if (field === "resolution_time" && !inputs.resolution_time) {
        errors[field] = "Field is required";
      }
      //cpe
      if (field === "customer_name" && !inputs.customer_name) {
        errors[field] = "Field is required";
      } else if (
        field === "customer_name" &&
        !/^([a-zA-Z ]){1,30}$/i.test(inputs.customer_name)
      ) {
        errors[field] = "Only characters are allowed";
      }
      if (
        field === "customer_name" &&
        !!inputs.customer_name &&
        inputs.customer_name.length > 15
      ) {
        errors[field] = "Length cannot be more than 15 characters";
      }
      //hardware name
      // if (field === "hardware_name" && !inputs.hardware_name) {
      //   errors[field] = "Hardware name is required";
      // } else if (
      //   field === "hardware_name" &&
      //   !/^([a-zA-Z ]){1,30}$/i.test(inputs.hardware_name)
      // ) {
      //   errors[field] = "only characters allowed";
      // }
      // if (
      //   field === "hardware_name" &&
      //   !!inputs.hardware_name &&
      //   inputs.hardware_name.length > 15
      // ) {
      //   errors[field] = "Length cannot be morethan 15";
      // }
      //make
      if (field === "make" && !inputs.make) {
        errors[field] = "Field is required";
      } else if (
        field === "make" &&
        !/^([a-zA-Z ]){1,30}$/i.test(inputs.make)
      ) {
        errors[field] = "Only characters are allowed";
      }
      if (field === "make" && !!inputs.make && inputs.make.length > 15) {
        errors[field] = "Length cannot be more than 15 characters";
      }
      //serail no in dp details
      // if (field === "serial_no" && !inputs.serial_no) {
      //   errors[field] = "Serial No is required";
      // }
      //test validation
      if (field === "serial_no" && !inputs.serial_no) {
        errors[field] = "Field is required";
      }
      else if (
        field === "serial_no" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[_a-zA-Z0-9.]+$/i.test(inputs.serial_no)

      ) {
        errors[field] = "Enter valid Serial No";
      }
      if (
        field === "serial_no" &&
        !!inputs.serial_no &&
        inputs.serial_no.length > 100
      ) {
        errors[field] = "Length cannot be more than 100 characters";
      }

      //end


      //end
      //no of prts validation
      if (field === "no_of_ports" && !inputs.no_of_ports) {
        errors[field] = "Field is required";
      } else if (field === "no_of_ports" && inputs.no_of_ports == 0) {
        errors[field] = "Enter valid number";
      }

      //capacity
      if (field === "capacity" && !inputs.capacity) {
        errors[field] = "Field is required";
      } else if (field === "capacity" && inputs.capacity == 0) {
        errors[field] = "Enter valid number";
      }
      //end
      //NAS Hardware name field validation by Mareiya on 17/8/22
      if (field === "nas_hardware_name" && !inputs.nas_hardware_name) {
        errors[field] = "Field is required";
      }
      else if (
        field === "nas_hardware_name" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[_a-zA-Z0-9.]+$/i.test(inputs.nas_hardware_name)

      ) {
        errors[field] = "Enter valid Name";
      }
      if (
        field === "nas_hardware_name" &&
        !!inputs.nas_hardware_name &&
        inputs.nas_hardware_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //end

      //parent nas 
      if (field === "parent_nas" && !inputs.parent_nas) {
        errors[field] = "Field is required";
      }
      else if (
        field === "parent_nas" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[_a-zA-Z0-9.]+$/i.test(inputs.parent_nas)

      ) {
        errors[field] = "Enter valid Name";
      }
      if (
        field === "parent_nas" &&
        !!inputs.parent_nas &&
        inputs.parent_nas.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //end
      //end
      //olt Hardware name field validation by Mareiya on 17/8/22

      if (field === "olt_nas_name" && !inputs.olt_nas_name) {
        errors[field] = "Field is required";
      }
      else if (
        field === "olt_nas_name" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[_a-zA-Z0-9.]+$/i.test(inputs.olt_nas_name)

      ) {
        errors[field] = "Enter valid Name";
      }
      if (
        field === "olt_nas_name" &&
        !!inputs.olt_nas_name &&
        inputs.olt_nas_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //end
      //dp details validation

      if (field === "nas_name" && !inputs.nas_name) {
        errors[field] = "Field is required";
      }
      else if (
        field === "nas_name" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[_a-zA-Z0-9.]+$/i.test(inputs.nas_name)

      ) {
        errors[field] = "Enter valid Name";
      }
      if (
        field === "nas_name" &&
        !!inputs.nas_name &&
        inputs.nas_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }

      //end
      //CPE Hardware Name filed validation by Marieya on 17/8/22

      if (field === "cpe_nas_name" && !inputs.cpe_nas_name) {
        errors[field] = "Field is required";
      }
      else if (
        field === "cpe_nas_name" &&
        // !/^\S*$/i.test(inputs.cpe_nas_name)
        !/^[_a-zA-Z0-9.]+$/i.test(inputs.cpe_nas_name)

      ) {
        errors[field] = "Enter valid Name";
      }
      if (
        field === "cpe_nas_name" &&
        !!inputs.cpe_nas_name &&
        inputs.cpe_nas_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //end 
      //radius health check password
      if (field === "radius_password" && !inputs.radius_password) {
        errors[field] = "Field is required";
      } else if (
        field === "radius_password" &&
        !!inputs.radius_password &&
        inputs.radius_password.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //
      //end
      //offlinePayment
      if (field === "collected_by" && !inputs.collected_by) {
        errors[field] = "Field is required";
      }
      //
      //line 1422 is added by Marieya on 17/8/22
      //validation for franchise name
  if (field === "franc_name" && !inputs.franc_name) {
        errors[field] = "Field is required";
      } else if (
        field === "franc_name" &&
        !/^[_-a-zA-Z ]+$/i.test(inputs.franc_name)
      ) {
        errors[field] = "Only characters are allowed";
      }
      if (
        field === "franc_name" &&
        !!inputs.franc_name &&
        inputs.franc_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }
      //validation for wallet amount
      if (field === "amount" && !inputs.amount) {
        errors[field] = "Field is required";
      }
      if (field === "paid_to" && !inputs.paid_to) {
        errors[field] = "Field is required";
      }

      if (field === "payment_receipt" && !inputs.payment_receipt) {
        errors[field] = "Field is required";
      }
      //end
      //end
      //areas in franchise
      if (field === "areas" && !inputs.areas) {
        errors[field] = "Field is required";
      }
      if (field === "areas" && !!inputs.areas && inputs.areas.length === 0) {
        errors[field] = "Selection is required";
      }
      //end

      // Add Offer

      if (field === "offer_name" && !inputs.offer_name) {
        errors[field] = "Field is required";
      }
      else if (
        field === "offer_name" &&
        !/^([0-9,;a-zA-Z _+-\/()]+)$/i.test(inputs.offer_name)
      ) {
        errors["offer_name"][field] = "Please enter characters only";
      }
      // End
      // area validation in customer kyc form
      if (field === "area" && !inputs.area) {
        errors[field] = "Field is required";
      }
      //
      //nas name validation

      // if (field === "n_name" && !inputs.n_name) {
      //   errors[field] = "This field is required";
      // }
      // if (
      //   field === "n_name" &&
      //   !!inputs.n_name &&
      //   inputs.n_name.length > 20
      // ) {
      //   errors[field] = "Length cannot be morethan 20";
      // }s
      //

      // number length less than 5//
      {/*added validation for zone area code by Marieya on 22/8/22 */ }
      if (field === "zone_area_code" && !inputs.zone_area_code) {
        errors[field] = "Field is required";
      } else if (
        field === "zone_area_code" &&
        !/^\d+$/.test(inputs.zone_area_code)
      ) {
        errors[field] = "Only digits are  allowed";
      } else if (
        field === "zone_area_code" &&
        !!inputs.zone_area_code &&
        inputs.zone_area_code.length > 9
      ) {
        errors[field] = "Length cannot be more than 9 digits";
      }
      {/*end*/ }
      //validation for code in add area, changed text on line 1626 by Marieya
      if (field === "area_code" && !inputs.area_code) {
        errors[field] = "Field is required";
      } else if (
        field === "area_code" &&
        !/^\d+$/.test(inputs.area_code)
      ) {
        errors[field] = "Only numbers allowed";
      } else if (
        field === "area_code" &&
        !!inputs.area_code &&
        inputs.area_code.length > 9
      ) {
        errors[field] = "Length cannot be morethan 9";
      }
      //end

      //model
      if (field === "model" && !inputs.model) {
        errors[field] = "Field is required";
      } else if (
        field === "model" &&
        !/^([a-zA-Z ]){1,30}$/i.test(inputs.model)
      ) {
        errors[field] = "Only characters are allowed";
      }
      if (field === "model" && !!inputs.model && inputs.model.length > 15) {
        errors[field] = "Length cannot be more than 15 characters";
      }
    });

    if (isEmpty(errors?.permanent_address)) {
      delete errors["permanent_address"];
    }
    return errors;
  };


  //Email errors
  //  const errors1 = {};
  //  if (!inputs.email) {
  //      errors1.email = 'Check Email';
  //  } else if (
  //      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputs.email)
  //  ) {
  //      errors1.email = 'Invalid email address';

  //  }

  const Error = (props) => {
    return (
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "75%",
        }}
      >
        {props.children}
      </div>
    );
  };
  return { validate, Error };
};

export default useFperormValidation;
