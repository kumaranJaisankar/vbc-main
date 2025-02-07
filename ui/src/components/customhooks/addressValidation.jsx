import React from "react";
import isEmpty from "lodash/isEmpty";
import { isValueZero } from "../../utils";

const AddressValidation = (requiredFields) => {
    const validate = (inputs) => {
        const errors = {};
        errors["permanent_address"] = {};
        const notRequiredFields = [
            // validaion
            "last_name",
            // "email",
            "alternate_mobile",
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
          //First Name
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
            //     errors[field] = "Field is required";
            // } else if (field === "mobile_no" && !/^\d{10}$/i.test(inputs.mobile_no)) {
            //     errors[field] = "Enter valid number";
            // }
            // if (
            //     field === "mobile_no" &&
            //     !!inputs.mobile_no &&
            //     inputs.mobile_no.length > 10
            // ) {
            //     errors[field] = "Length cannot be more than 10 characters";
            // }
            if (field === "mobile_no" && !inputs?.mobile_no) {
                errors[field] = "Field is required";
              } else if (
                field === "mobile_no" &&
                !/^([0-9])+$/i.test(inputs?.mobile_no)
              ) {
                errors["mobile_no"] = "Only digits are allowed";
              } else if (
                field === "mobile_no" &&
                !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.mobile_no)
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

            //alternate_mobile in basic info
            if (field == "alternate_mobile" && !isEmpty(inputs)) {
                if (field === "alternate_mobile" && !inputs?.alternate_mobile) {
                  // errors["alternate_mobile"] = "Field is required";
                } else if (
                  field == "alternate_mobile" &&
                  !/^([0-9])+$/i.test(inputs?.alternate_mobile)
                ) {
                  errors["alternate_mobile"] = "Only digits are allowed";
                } else if (
                  field === "alternate_mobile" &&
                  !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.alternate_mobile)
                ) {
                  errors["alternate_mobile"] = "Please enter valid 10 digits";
                }
                if (
                  field === "alternate_mobile" &&
                  !!inputs.alternate_mobile &&
                  inputs?.alternate_mobile?.length > 10
                ) {
                  errors["alternate_mobile"] = "Length cannot be more than 10 digits";
                }
              }
            //end
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



            {/**/ }
            //updated one
            // if (field === "name" && !inputs.name) {
            //     errors[field] = "Name is required";
            // } else if (
            //     field === "name" &&
            //     !/^([0-9,;a-zA-Z _+-\/()]+)$/i.test(inputs.name)
            // )
            //     if (field === "name" && !!inputs.name && inputs.name.length > 20) {
            //         errors[field] = "Length cannot be morethan 20";
            //     }
            if (field === "name" && !inputs.name) {
                errors[field] = "Field is required";
              } else if (
                field === "name" &&
                !/^[a-zA-Z ]+$/i.test(inputs.name)
              ){
                errors[field] = "Only characters are allowed";
              }
              if (
                field === "name" &&
                !!inputs.name &&
                inputs.name.length > 50
              ) {
                errors[field] = "Length cannot be more than 50 characters";
              }
            //old one
            // if (field === "name" && !inputs.name) {
            //   errors[field] = " Name is required";
            // } else if (
            //   field === "name" &&
            //   !/^([a-zA-Z ]){1,30}$/i.test(inputs.name)
            // ) {
            //   errors[field] = "only characters allowed";
            // }
            // if (field === "name" && !!inputs.name && inputs.name.length > 15) {
            //   errors[field] = "Length cannot be morethan 15";
            // }

            //(Start) Sailaja Added form validations for field Admin/username validations  on 16th August


            // Admin/username validations    selector: "username",

            if (field === "username" && !inputs.username) {
                errors[field] = "Field is required";
              } else if (
                field === "username" &&
                !/^([0-9a-zA-Z _-]){1,30}$/i.test(inputs.username)
              ) {
                errors[field] = "Only Alphanumeric characters and (_ -) allowed";
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

            //(Start) Sailaja Added form validations field Admin/email validations for  on 16th August 
            // Admin/email validations    selector: "email",
            if (field === "email" && !inputs.email) {
                errors[field] = "Field is required";
            } else if (
                field === "email" &&
                !!inputs.email &&
                !/^([a-z0-9\._])*@([a-z]{3,8})*(\.[a-z]{2,3})+$/.test(inputs.email)
                // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.email)
            ) {
                errors[field] = "Enter valid Email";
            }
            if (field === "email" && !!inputs.email && inputs.email.length > 40) {
                errors[field] = "Length cannot be more than 40 characters";
            }

            //roles
            if (field === "roles" && !inputs.roles) {
                errors[field] = "Field is required";
            }

            //Sailaja Added form validations Admin/email validations ended on 16th August

            //(End) Sailaja form validations completed 

            // franchise

            if (field === "user_name" && !inputs.user_name) {
                errors[field] = "Field is required";
            } else if (
                field === "user_name" &&
                !/^([a-zA-Z ]){1,30}$/i.test(inputs.user_name)
            ) {
                errors[field] = "only characters are allowed";
            }
            if (
                field === "user_name" &&
                !!inputs.user_name &&
                inputs.user_name.length > 15
            ) {
                errors[field] = "Length cannot be more than 15 characters";
            }














            //landmark

            if (field == "landmark" && !isEmpty(inputs?.address)) {
                if (field === "landmark" && !inputs?.address?.landmark) {
                    // errors[field] = "Field is required";
                } else if (
                    field === "landmark" &&
                    !/^([0-9,a-zA-Z /]+)$/i.test(inputs?.address?.landmark)
                ) {
                    errors[field] = "Alphanumeric characters only";
                }
                if (
                    field === "landmark" &&
                    inputs?.address?.landmark &&
                    inputs?.address?.landmark?.length > 50
                ) {
                    errors[field] = "Length cannot be more than 50 characters";
                }
            } else {
                if (field === "landmark" && !inputs?.landmark) {
                    errors[field] = "Field is required";
                } else if (
                    field === "landmark" &&
                    !/^([0-9,a-zA-Z /]+)$/i.test(inputs?.landmark)
                    // !/^([a-zA-Z ]){1,30}$/i.test(inputs.landmark)
                ) {
                    errors[field] = "Alphanumeric characters only";
                }
                if (
                    field === "landmark" &&
                    !!inputs?.landmark &&
                    inputs?.landmark?.length > 50
                ) {
                    errors[field] = "Length  cannot be more than 50 characters";
                }
            }


            //end
            //street

            if (field == "street" && !isEmpty(inputs.address)) {
                if (field === "street" && !inputs.address.street) {
                    errors[field] = "Field is required";
                } else if (
                    field === "street" &&
                    !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.address?.street)
                ) {
                    errors[field] = "Alphanumeric and special characters (, _ : = + / ; . -) only";
                }
                if (
                    field === "street" &&
                    inputs?.address &&
                    inputs?.address?.street &&
                    inputs?.address?.street.length > 50
                ) {
                    errors[field] = "Length cannot be more than 50 characters";
                }
            } else {
                if (field === "street" && !inputs?.street) {
                    errors[field] = "Field is required";
                } else if (
                    field === "street" &&
                    !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.street)
                ) {
                    errors[field] = "Alphanumeric and special characters (, _ : = + / ; . -) only";
                }
                if (
                    field === "street" &&
                    !!inputs?.street &&
                    inputs?.street?.length > 50
                ) {
                    errors[field] = "Length cannot be more than 50 characters";
                }
            }


            //h.no
            if (field == "house_no" && !isEmpty(inputs?.address)) {
                if (field === "house_no" && !inputs?.address?.house_no) {
                    // errors[field] = "House number is required";
                } else if (
                    field === "house_no" &&
                    !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.address?.house_no)
                ) {
                    errors[field] = "Alphanumeric and special characters (, _ : = + / ; . -) only";
                }
                if (
                    field === "house_no" &&
                    inputs.address &&
                    inputs.address?.house_no &&
                    inputs.address?.house_no?.length > 200
                ) {
                    errors[field] = "Length cannot be more than 200 characters";
                }
            } else {
                if (field === "house_no" && !inputs?.house_no) {
                    // errors[field] = "House number is required";
                } else  if (
                    field === "house_no" &&
                    !!/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.house_no)
                ) {
                    errors[field] = "Alphanumeric and special characters (, _ : = + / ; . -) only";
                }
                if (
                    field === "house_no" &&
                    !!inputs?.house_no &&
                    inputs?.house_no?.length > 200
                ) {
                    errors[field] = "Length cannot be more than 200 characters";
                }
            }



            //city

            if (field == "city" && !isEmpty(inputs?.address)) {
                if (field === "city" && !inputs?.address?.city) {
                    errors[field] = "Field is required";
                } else if (
                    field === "city" &&
                    !/^([a-zA-Z ]+)$/i.test(inputs?.address?.city)
                ) {
                    errors[field] = "Only characters are allowed";
                }
                if (
                    field === "city" &&
                    inputs.address &&
                    inputs.address?.city &&
                    inputs.address?.city?.length > 50
                ) {
                    errors[field] = "Length cannot be more than 50 characters";
                }
            } else {
                if (field === "city" && !inputs?.city) {
                    errors[field] = "Field is required";
                } else if (
                    field === "city" &&
                    !/^([a-zA-Z ]+)$/i.test(inputs?.city)
                ) {
                    errors[field] = "Only characters are allowed";
                }
                if (field === "city" && !!inputs?.city && inputs?.city?.length > 50) {
                    errors[field] = "Length cannot be more than 50 characters";
                }
            }




            //  static ip


            if (field == "static_ip_bind" && !isEmpty(inputs.radius_info)) {

                if (
                    field === "static_ip_bind" &&
                    inputs.radius_info &&
                    inputs.radius_info.static_ip_bind &&
                    inputs.radius_info.static_ip_bind.includes('_')
                ) {
                    errors[field] = "please enter valid static ip";
                }
            }





            // pincode

            if (field == "pincode" && !isEmpty(inputs?.address)) {
                if (field === "pincode" && !inputs?.address?.pincode) {
                    errors[field] = "Field is required1";
                } else if (
                    field === "pincode" &&
                    !/^([0-9])+$/i.test(inputs?.address?.pincode)
                ) {
                    errors[field] = "Only digits are allowed";
                }else if (
                    field === "pincode" &&
                    inputs?.address &&
                    inputs?.address?.pincode &&
                    inputs?.address?.pincode?.length > 6
                ) {
                    errors[field] = "Length cannot be more than 6 digits";
                }else  if (
                    field === "pincode" &&
                    inputs?.address &&
                    inputs?.address?.pincode &&
                    inputs?.address?.pincode?.length < 6
                ) {
                    errors[field] = "Length cannot be less than 6 digits";
                }
            } else {
                if (field === "pincode" && !inputs?.pincode) {
                    errors[field] = "Field is required2";
                } else if (field === "pincode" && !/^([0-9])+$/i.test(inputs?.pincode)) {
                    errors[field] = "Only digits are allowed";
                }else if (
                    field === "pincode" &&
                    !!inputs?.pincode &&
                    inputs?.pincode?.length > 6
                ) {
                    errors[field] = "Length cannot be more than 6 digits";
                }else if (
                    field === "pincode" &&
                    !!inputs?.pincode &&
                    inputs?.pincode?.length < 6
                ) {
                    errors[field] = "Length cannot be less than 6 digits";
                }
            }


            //district

            if (field == "district" && !isEmpty(inputs?.address)) {
                if (field === "district" && !inputs?.address?.district) {
                    errors[field] = "Field is required";
                } else if (
                    field === "district" &&
                    !/^([a-zA-Z _+-\/()]+)$/i.test(inputs?.address?.district)
                ) {
                    errors[field] = "Only characters are allowed";
                }
                if (
                    field === "district" &&
                    inputs?.address &&
                    inputs?.address?.district &&
                    inputs?.address?.district?.length > 70
                ) {
                    errors[field] = "Length cannot be more than 70 characters";
                }
            }
            else {
                if (field === "district" && !inputs?.district) {
                    errors[field] = "Field is required";
                } else if (
                    field === "district" &&
                    !/^([a-zA-Z _+-\/()]+)$/i.test(inputs?.district)
                ) {
                    errors[field] = "Only characters are allowed";
                }
                if (
                    field === "district" &&
                    !!inputs?.district &&
                    inputs?.district?.length > 70
                ) {
                    errors[field] = "Length cannot be more than 70 characters";
                }
            }


            //state

            if (field == "state" && !isEmpty(inputs?.address)) {
                if (field === "state" && !inputs?.address?.state) {
                    errors[field] = "Field is required";
                } else if (
                    field === "state" &&
                    !/^([a-zA-Z ]+)$/i.test(inputs?.address?.state)
                ) {
                    errors[field] = "Only characters are allowed";
                }
                if (
                    field === "state" &&
                    inputs.address &&
                    inputs.address?.state &&
                    inputs.address?.state?.length > 70
                ) {
                    errors[field] = "Length cannot be more than 70 characters";
                }
            } else {
                if (field === "state" && !inputs?.state) {
                    errors[field] = "Field is required";
                } else if (
                    field === "state" &&
                    !/^([a-zA-Z ]+)$/i.test(inputs?.state)
                ) {
                    errors[field] = "Only characters are allowed";
                }
                if (field === "state" && !!inputs?.state && inputs?.state?.length > 70) {
                    errors[field] = "Length cannot be more than 70 characters";
                }
            }



            //country

            if (field == "country" && !isEmpty(inputs?.address)) {
                if (field === "country" && !inputs?.address?.country) {
                    errors[field] = "Field is required";
                } else if (
                    field === "country" &&
                    !/^([a-zA-Z ]+)$/i.test(inputs?.address?.country)
                ) {
                    errors[field] = "Only characters are allowed";
                }
                if (
                    field === "country" &&
                    inputs?.address &&
                    inputs?.address?.country &&
                    inputs?.address?.country?.length > 50
                ) {
                    errors[field] = "Length cannot be more than 50 characters";
                }
            } else {
                if (field === "country" && !inputs?.country) {
                    errors[field] = "Field is required";
                } else if (
                    field === "country" &&
                    !/^([a-zA-Z ]+)$/i.test(inputs?.country)
                ) {
                    errors[field] = "Only characters are allowed";
                }
                if (
                    field === "country" &&
                    !!inputs?.country &&
                    inputs?.country?.length > 50
                ) {
                    errors[field] = "Length cannot be more than 50 characters";
                }
            }






            //installation charges
            if (field === "installation_charges" && !inputs.installation_charges) {
                errors[field] = "Field is required";
            } else if (
                field === "installation_charges" &&
                !/^([0-9]+)$/i.test(inputs.installation_charges)
            ) {
                errors[field] = "Only digits are allowed";
            }
            // security charges
            if (field === "security_deposit" && !inputs.security_deposit) {
                errors[field] = "Field is required";
            } else if (
                field === "security_deposit" &&
                !/^([0-9]+)$/i.test(inputs.security_deposit)
            ) {
                errors[field] = "Only digits are allowed";
            } if (
                field === "security_deposit" &&
                !!inputs.security_deposit &&
                inputs.security_deposit.length > 8
              ) {
                errors[field] = "Length cannot be more than 8 digits";
              }

            //identity_proof
            if (field === "identity_proof" && !isEmpty(inputs.customer_documents)) {
                if (
                    field === "identity_proof" &&
                    !inputs.customer_documents.identity_proof
                ) {
                    errors[field] = "Field is required";
                }
            }

            //address_proof
            if (field === "address_proof" && !isEmpty(inputs.customer_documents)) {
                if (
                    field === "address_proof" &&
                    !inputs.customer_documents.address_proof
                ) {
                    errors[field] = "Field is required";
                }
            }

            //signature

            if (field === "signature" && !isEmpty(inputs.customer_documents)) {
                if (field === "signature" && !inputs.customer_documents.signature) {
                    errors[field] = "Field is required";
                }
            }

            //postal_code

            if (field === "postal_code" && !inputs.postal_code) {
                errors[field] = "Field is required";
            } else if (
                field === "postal_code" &&
                !/^([0-9])+$/i.test(inputs.postal_code)
            ) {
                errors[field] = "Only digits are allowed";
            }
            //changed mobile no text by Marieya on 20/8/22
            //mob no
            // if (field === "mobile_number" && !inputs.mobile_number) {
            //     errors[field] = "Field is required";
            // } else if (
            //     field === "mobile_number" &&
            //     !/^\d{10}$/i.test(inputs.mobile_number)
            // ) {
            //     errors[field] = "Enter valid number";
            // }
            // if (
            //     field === "mobile_number" &&
            //     !!inputs.mobile_number &&
            //     inputs.mobile_number.length > 10
            // ) {
            //     errors[field] = "Length cannot be more than 10 characters";
            // }
            if (field === "mobile_number" && !inputs?.mobile_number) {
                errors[field] = "Field is required";
              } else if (
                field === "mobile_number" &&
                !/^([0-9])+$/i.test(inputs?.mobile_number)
              ) {
                errors["mobile_number"] = "Only digits are allowed";
              } else if (
                field === "mobile_number" &&
                !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.mobile_number)
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
                !/^([a-z0-9\._])*@([a-z]{3,8})*(\.[a-z]{2,3})+$/.test(inputs.email)
                // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.email)
            ) {
                errors[field] = "Enter valid Email";
            }
            if (field === "email" && !!inputs.email && inputs.email.length > 40) {
                errors[field] = "Length cannot be more than 40 characters";
            }

            //email


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
                // errors[field] = "Field Is Required";
              } else if (
                field === "last_name" &&        !/^[a-zA-Z ]+$/i.test(inputs.last_name)
              ) {
                errors[field] = "Only chracters are allowed";
              } else if (
                field === "last_name" &&                !!inputs.last_name &&                inputs.last_name.length > 50
            ) {
                errors[field] = "Length cannot be more than 50 characters";
            }


          

            // validation content for 12 digits added by marieya
            // Sailaja fixed AAdharnumber validation on 4th August  [didn't fire  "Length cannot be morethan 12" validation msg before]  
            if (
                field === "Aadhar_Card_No" &&
                !inputs.customer_documents.Aadhar_Card_No
            ) {
                errors[field] = "Field is required";
            } 
            else if(field == "Aadhar_Card_No" &&  !/^([0-9])+$/i.test(inputs?.customer_documents?.Aadhar_Card_No) 
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

            {/*added admin ticket category validation code by Marieya on 22.8.22 */ }
            if (field === "new_ticket_category" && !inputs.new_ticket_category) {
                errors[field] = "Field is required";
            } else if (
                field === "new_ticket_category" &&
                !/^([a-zA-Z ]){1,30}$/i.test(inputs.new_ticket_category)
            ) {
                errors[field] = "Please enter valid category";
            }
            if (
                field === "new_ticket_category" &&
                !!inputs.new_ticket_category &&
                inputs.new_ticket_category.length > 20
            ) {
                errors[field] = "Length cannot be more than 20";
            }
            {/*end*/ }
            {/*Addded Subject field validation code for admin category by Marieya on 22.8.22*/ }
            if (field === "new_subject" && !inputs.new_subject) {
                errors[field] = "Fieldrequired";
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

            if (field === "landline" && !inputs.landline) {
                errors[field] = "Landline is required";
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
            //     errors[field] = "Field is required";
            // } else if (field === "mobile" && !/^\d{10}$/i.test(inputs.mobile)) {
            //     errors[field] = "Enter valid number";
            // }
            // if (field === "mobile" && !!inputs.mobile && inputs.mobile?.length > 10) {
            //     errors[field] = "Length cannot be more than 10 characters";
            // }
            if (field === "mobile" && !inputs?.mobile) {
                errors[field] = "Field is required";
              } else if (
                field === "mobile" &&
                !/^([0-9])+$/i.test(inputs?.mobile)
              ) {
                errors["mobile"] = "Only digits are allowed";
              } else if (
                field === "mobile" &&
                !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.mobile)
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
            //     errors[field] = "Filed is required";
            // } else if (
            //     field === "register_mobile" &&
            //     // !/^\d{10}$/i.test(inputs.register_mobile)
            //     !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.register_mobile)
            // ) {
            //     errors[field] = "Enter valid number";
            // }
            // if (
            //     field === "register_mobile" &&
            //     !!inputs.register_mobile &&
            //     inputs?.register_mobile?.length > 10
            // ) {
            //     errors[field] = "Length cannot be more than 10 characters";
            // }
            //Sailaja changed email as Email in 3rd August
            //registered_email
            if (field === "registered_email" && !inputs.registered_email) {
                errors[field] = "Field is required";
            } else if (
                field === "registered_email" &&
                // !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(inputs.registered_email)
                !/^([A-Za-z0-9\._])*@([A-Za-z]{3,8})*(\.[A-Za-z]{2,3})+$/.test(inputs.registered_email)
                // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.registered_email)
            ) {
                errors[field] = "Enter valid Email";
            }

            //service plan time








            if (field === "h_no" && !inputs.h_no) {
                errors[field] = "Field is required";
            } else if (
                field === "h_no" &&
                !/^([0-9 a-zA-Z _+-\/]+)$/i.test(inputs.h_no)
            ) {
                errors[field] = "Enter valid house number";
            }
            //priority

            //cpe
            if (field === "customer_name" && !inputs.customer_name) {
                errors[field] = "Field is required";
            } else if (
                field === "customer_name" &&
                !/^([a-zA-Z ]){1,30}$/i.test(inputs.customer_name)
            ) {
                errors[field] = "only characters are allowed";
            }
            if (
                field === "customer_name" &&
                !!inputs.customer_name &&
                inputs.customer_name.length > 15
            ) {
                errors[field] = "Length cannot be more than 15 characters";
            }
            //hardware name

            //end
            //areas in franchise
            if (field === "areas" && !inputs.areas) {
                errors[field] = "Field is required";
            }
            if (field === "areas" && !!inputs.areas && inputs.areas.length === 0) {
                errors[field] = "Selection is required";
            }
            //end

            // area validation in customer kyc form
            if (field === "area" && !inputs.area) {
                errors[field] = "Field is required";
            }

        });

        if (isEmpty(errors?.permanent_address)) {
            delete errors["permanent_address"];
        }
        return errors;
    };

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

export default AddressValidation;
