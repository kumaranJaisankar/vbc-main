import React from "react";
import isEmpty from "lodash/isEmpty";
import { isValueZero } from "../../utils";

const useFormValidation = (requiredFields) => {
  const validate = (inputs) => {
    const errors = {};
    errors["permanent_address"] = {};
    const notRequiredFields = [
      // validaion
      "last_name",
      // "email",
      "alternate_mobile_no",
      // "client_id",
      // "key_id",
      "alternate_email",
      "alternate_mobile",
      "worknotes",
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
      // "longitude",
      // "latitude",
      "identity_proof",
      "alternate_mobile_number",
      "static_ip_bind",
      "Aadhar_Card_No",
      "pan_cards",
      "Aadhar_Card_No_Doc",
    ];
    //  Sailaja changed validation msg as guided by QA team on 3rd August
    {
      /*changed pan card keyname by Marieya */
    }
    requiredFields.map((field) => {
      if (!notRequiredFields.includes(field) && !inputs[field]) {
        // errors.addlead = "Mandatory fields cannot be null";
        // if (field === "Aadhar_Card_No" && !inputs.customer_documents[field]) {
        //   errors[field] = "Aadhar Number is required ";
        // }
        //  else if (field === "pan_card" && !inputs.customer_documents[field]) {
        //     errors[field] = "Pan Number is required ";
        //   }
        {
          /*added validation for pan card by Marieya on 27.8.22*/
        }
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
      // First name
      if (field === "first_name" && !inputs.first_name) {
        errors[field] = "Field is required";
      } else if (
        field === "first_name" &&
        !/^[a-zA-Z ]+$/i.test(inputs.first_name)
      ) {
        errors[field] = "Only characters are allowed";
      }
      //(Start)Sailaja Added first name should be more than 2 characters validation on 17th August
      else if (
        field === "first_name" &&
        !!inputs.first_name &&
        inputs.first_name.length <= 2
      ) {
        errors[field] = "Length cannot be less than 3 characters";
      }
      //(End)Sailaja Added first name should be more than 2 characters validation on 17th August
      if (
        field === "first_name" &&
        !!inputs.first_name &&
        inputs.first_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters ";
      }

      // First name
      // if (field === "first_name" && !inputs.first_name) {
      //   errors[field] = "Field is required";
      // } else if (
      //   field === "first_name" &&
      //   !/^[a-zA-Z ]+$/i.test(inputs.first_name)
      // ) {
      //   errors[field] = "Only alphabets are allowed";

      //   //(Start)Sailaja Added first name should be more than 2 characters validation on 17th August
      //   if (
      //     field === "first_name" &&
      //     !!inputs.first_name &&
      //     inputs.first_name.length <= 2
      //   ) {
      //     errors[field] = "Length cannot be less than 3 characters";
      //   }
      // }
      // //(End)Sailaja Added first name should be more than 2 characters validation on 17th August
      // if (
      //   field === "first_name" &&
      //   !!inputs.first_name &&
      //   inputs.first_name.length > 50
      // ) {
      //   errors[field] = "Length cannot be more than 50 characters ";
      // }

      // Customer Info

      // Sailaja Modified Validation Error message for AAdhar Number on 3rd August
      if (field === "Aadhar_Card_No_1" && !inputs.Aadhar_Card_No_1) {
        errors[field] = "Field is required";
      } else if (
        field == "Aadhar_Card_No_1" &&
        !/^([0-9])+$/i.test(inputs?.Aadhar_Card_No_1)
      ) {
        errors[field] = "Only digits are allowed";
      } else if (
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
      //   errors[field] = "Length cannot be more than 10 digits";
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
        errors["mobile_no"] = "Enter valid 10 digits";
      }
      if (
        field === "mobile_no" &&
        !!inputs.mobile_no &&
        inputs.mobile_no.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }

      //end
      //alt_email by marieya
      if (field == "alternate_email" && !isEmpty(inputs)) {
        if (field === "alternate_email" && !inputs?.alternate_email) {
          // errors["alternate_email"] = "Email ID  is required";
        } else if (
          field === "alternate_email" &&
          !/^([A-Za-z0-9\._])*@([A-Za-z]{3,8})*(\.[A-Za-z]{3,5})+$/.test(
            inputs.alternate_email.toLowerCase()
          )
          // !/^([a-z0-9\._])*@([a-z]{5,8})*(\.[a-z]{2,3})+$/.test(inputs.alternate_email.toLowerCase())
          // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.alternate_email)
        ) {
          errors["alternate_email"] = "Enter valid Alternate Email";
          // "Lowercase of [a-z,0-9] and special characters[-,.] are allowed"
        } else if (
          field === "alternate_email" &&
          !/^([A-Za-z0-9\._])*@([A-Za-z]{3,8})*(\.[A-Za-z]{3,5})+$/.test(
            inputs.alternate_email.toLowerCase()
          )

          // !/^([A-Z0-9\._])*@([a-z]{5,8})*(\.[a-z]{2,3})+$/.test(inputs.alternate_email.toLowerCase())
          // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.alternate_email)
        ) {
          errors["alternate_email"] = "Enter valid Alternate Email";
        }
        if (
          field === "alternate_email" &&
          !!inputs.alternate_email &&
          inputs.alternate_email.length > 50
        ) {
          errors[field] = "Length cannot be more than  50 characters";
        }
      }
      //end
      //kyc alternate mobile number by marieya
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
          errors["alternate_mobile"] = "Enter valid 10 digits";
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

      // if (
      //   field === "alternate_mobile_no" &&
      //   !!inputs.alternate_mobile_no &&
      //   !/^\d{10}$/i.test(inputs.alternate_mobile_no)
      // ) {
      //   errors[field] = "Enter valid alternative mobile number";
      // }
      // if (
      //   field === "alternate_mobile_no" &&
      //   !!inputs.alternate_mobile_no &&
      //   inputs.alternate_mobile_no.length > 10
      // ) {
      //   errors[field] = "Length cannot be more than 10 digits";
      // }
      // new alternate_mobile_no
      if (field == "alternate_mobile_no" && !isEmpty(inputs)) {
        if (field === "alternate_mobile_no" && !inputs?.alternate_mobile_no) {
          // errors["alternate_mobile"] = "Field is required";
        } else if (
          field == "alternate_mobile_no" &&
          !/^([0-9])+$/i.test(inputs?.alternate_mobile_no)
        ) {
          errors["alternate_mobile_no"] = "Only digits are allowed";
        } else if (
          field === "alternate_mobile_no" &&
          !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.alternate_mobile_no)
        ) {
          errors["alternate_mobile_no"] = "Enter valid 10 digits";
        }
        if (
          field === "alternate_mobile_no" &&
          !!inputs.alternate_mobile_no &&
          inputs?.alternate_mobile_no?.length > 10
        ) {
          errors["alternate_mobile_no"] =
            "Length cannot be more than 10 digits";
        }
      }

      // alternate_mobile_number
      if (field == "alternate_mobile_number" && !isEmpty(inputs)) {
        if (
          field === "alternate_mobile_number" &&
          !inputs?.alternate_mobile_number
        ) {
          // errors["alternate_mobile"] = "Field is required";
        } else if (
          field == "alternate_mobile_number" &&
          !/^([0-9])+$/i.test(inputs?.alternate_mobile_number)
        ) {
          errors["alternate_mobile_number"] = "Only digits are allowed";
        } else if (
          field === "alternate_mobile_number" &&
          !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.alternate_mobile_number)
        ) {
          errors["alternate_mobile_number"] = "Enter valid 10 digits";
        }
        if (
          field === "alternate_mobile_number" &&
          !!inputs.alternate_mobile_number &&
          inputs?.alternate_mobile_number?.length > 10
        ) {
          errors["alternate_mobile_number"] =
            "Length cannot be more than 10 digits";
        }
      }

      // pan card

      if (field == "pan_cards" && !isEmpty(inputs)) {
        if (field === "pan_cards" && !inputs?.pan_cards) {
          // errors["alternate_mobile"] = "Field is required";
        } else if (
          field == "pan_cards" &&
          !/^([0-9a-zA-Z])+$/i.test(inputs?.pan_cards)
        ) {
          errors["pan_cards"] = "Enter Valid Pan Number";
        } else if (
          field === "pan_cards" &&
          !/^([0-9a-zA-Z]){10}$/.test(inputs?.pan_cards)
        ) {
          errors["pan_cards"] = "Pan number should be 10 Characters";
        }
        if (
          field === "pan_cards" &&
          !!inputs.pan_cards &&
          inputs?.pan_cards?.length > 10
        ) {
          errors["pan_cards"] = "Length cannot be more than 10 ";
        }
      }
      // aadhar card number

      if (field == "Aadhar_Card_No_Doc" && !isEmpty(inputs)) {
        if (field === "Aadhar_Card_No_Doc" && !inputs?.Aadhar_Card_No_Doc) {
          // errors["alternate_mobile"] = "Field is required";
        } else if (
          field == "Aadhar_Card_No_Doc" &&
          !/^([0-9])+$/i.test(inputs?.Aadhar_Card_No_Doc)
        ) {
          errors["Aadhar_Card_No_Doc"] = "Only digits are allowed";
        } else if (
          field === "Aadhar_Card_No_Doc" &&
          !/^([0-9]){12}$/.test(inputs?.Aadhar_Card_No_Doc)
        ) {
          errors["Aadhar_Card_No_Doc"] = "Aadhar number should be 12 digits";
        }
        if (
          field === "Aadhar_Card_No_Doc" &&
          !!inputs.Aadhar_Card_No_Doc &&
          inputs?.Aadhar_Card_No_Doc?.length > 12
        ) {
          errors["Aadhar_Card_No_Doc"] = "Length cannot be more than 12 digits";
        }
      }
      // if (
      //   field === "alternate_mobile_number" &&
      //   !!inputs.alternate_mobile_number &&
      //   !/^\d{10}$/i.test(inputs.alternate_mobile_number)
      // ) {
      //   errors[field] = "Enter valid alternative mobile number";
      // }
      // if (
      //   field === "alternate_mobile_number" &&
      //   !!inputs.alternate_mobile_number &&
      //   inputs.alternate_mobile_number.length > 10
      // ) {
      //   errors[field] = "Length cannot be more than 10 digits";
      // }
      //olt specification
      if (field === "specification" && !inputs.specification) {
        errors[field] = "Field is required";
      } else if (
        field === "specification" &&
        !/^([0-9a-zA-Z-_ )]+)$/i.test(inputs.specification)
      ) {
        errors[field] = "Alphanumeric and special characters (_ -) only";
      }
      if (
        field === "specification" &&
        !!inputs.specification &&
        inputs.specification.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //end

      // shiffting_charges

      if (field === "shifting_charges" && !inputs.shifting_charges) {
        errors[field] = "Field is required";
      } else if (
        field === "shifting_charges" &&
        !/^([0-9]+)$/i.test(inputs.shifting_charges)
      ) {
        errors[field] = "Only digits are allowed";
      }

      // franchise_wallet_limit
      if (
        field === "franchise_wallet_limit" &&
        !inputs.franchise_wallet_limit
      ) {
        errors[field] = "Field is required";
      } else if (
        field === "franchise_wallet_limit" &&
        !/^([0-9]+)$/i.test(inputs.franchise_wallet_limit)
      ) {
        errors[field] = "Only digits are allowed";
      }

      // branch_wallet_limit

      if (field === "branch_wallet_limit" && !inputs.branch_wallet_limit) {
        errors[field] = "Field is required";
      } else if (
        field === "branch_wallet_limit" &&
        !/^([0-9]+)$/i.test(inputs.branch_wallet_limit)
      ) {
        errors[field] = "Only digits are allowed";
      }

      // customer_wallet_limit

      if (field === "customer_wallet_limit" && !inputs.customer_wallet_limit) {
        errors[field] = "Field is required";
      } else if (
        field === "customer_wallet_limit" &&
        !/^([0-9]+)$/i.test(inputs.customer_wallet_limit)
      ) {
        errors[field] = "Only digits are allowed";
      }

      // if (
      //   field === "shiffting_charges" &&
      //   !!inputs.shiffting_charges &&
      //   inputs.shiffting_charges.length > 20
      // ) {
      //   errors[field] = "Length cannot be more than 20 characters";
      // }

      // house number

      if (field === "house_no" && !inputs.house_no) {
        // errors[field] = "House number is required";
      } else if (
        field === "house_no" &&
        field === "house_no" &&
        !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.house_no)
      ) {
        errors[field] =
          "Alphanumeric and special characters (, _ : = + / ; . -) only";
      } else if (
        field === "house_no" &&
        !!inputs?.house_no &&
        inputs?.house_no?.length > 200
      ) {
        errors[field] = "Length cannot be more than 200 characters";
      }

      // area:"",

      // if (field === "area" && !inputs.area) {
      //   errors[field] = "Area is required";
      // } else if (
      //   field === "area" &&
      //   !/^([^-\s][a-zA-Z ]){2,30}$/i.test(inputs.area)
      // ) {
      //   errors[field] = "Enter valid area";
      // }

      // pin code
      // if (field === "pin_code" && !inputs.pin_code) {
      //   errors[field] = "Pincode is required";
      // } else if (field === "pin_code" && !/^\d{6}$/i.test(inputs.pin_code)) {
      //   errors[field] = "Enter valid pincode";
      // }

      {
        /*Validation code for Sub category field added by Marieya on 22/8/22 */
      }

      if (field === "sub_category_name" && !inputs.sub_category_name) {
        errors[field] = "Field is required";
      } else if (
        field === "sub_category_name" &&
        !/^[0-9 a-zA-Z _-]+$/i.test(inputs.sub_category_name)
        // !/^([_a-zA-Z  \/()]+)$/i.test(inputs.sub_category_name)
      ) {
        errors[field] = "	Alphanumeric and special characters (_ -) only ";
      } else if (
        field === "sub_category_name" &&
        !!inputs.sub_category_name &&
        inputs.sub_category_name.length > 30
      ) {
        errors[field] = "Length cannot be more than 30 characters";
      }
      {
        /*end*/
      }
      {
        /*Validation code for Priority field added by Marieya on 22/8/22 */
      }

      if (field === "priority_name" && !inputs.priority_name) {
        errors[field] = "Field is required";
      } else if (
        field === "priority_name" &&
        !/^([a-zA-Z ]+)$/i.test(inputs.priority_name)
        // !/^([0-9,;a-zA-Z _+-\/()]+)$/i.test(inputs.priority_name)
      ) {
        errors[field] = "Only characters are allowed";
      }
      if (
        field === "priority_name" &&
        !!inputs.priority_name &&
        inputs.priority_name.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 characters";
      }
      {
        /*end*/
      }
      {
        /*Validation code for Franchise Type field added by Marieya on 22/8/22 */
      }

      if (field === "franchise_type_name" && !inputs.franchise_type_name) {
        errors[field] = "Field is required";
      } else if (
        field === "franchise_type_name" &&
        !/^[-_a-zA-Z ]+$/i.test(inputs.franchise_type_name)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "franchise_type_name" &&
        !!inputs.franchise_type_name &&
        inputs.franchise_type_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      {
        /*end*/
      }
      {
        /*Validation code for Status Name field added by Marieya on 22/8/22 */
      }

      if (field === "sms_gateway_name" && !inputs.sms_gateway_name) {
        errors[field] = "Field is required";
      } else if (
        field === "sms_gateway_name" &&
        !/^[a-zA-Z ]+$/i.test(inputs.sms_gateway_name)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "sms_gateway_name" &&
        !!inputs.sms_gateway_name &&
        inputs.sms_gateway_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      {
        /*end*/
      }

      //admin status
      {
        /*Validation code for Status Name field added by Marieya on 22/8/22 */
      }

      if (field === "status_name" && !inputs.status_name) {
        errors[field] = "Field is required";
      } else if (
        field === "status_name" &&
        !/^[a-zA-Z ]+$/i.test(inputs.status_name)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "status_name" &&
        !!inputs.status_name &&
        inputs.status_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      {
        /*end*/
      }
      // admin franchise
      {
        /*Validation code for Department Name field added by Marieya on 22/8/22 */
      }

      if (field === "department_name" && !inputs.department_name) {
        errors[field] = "Field is required";
      } else if (
        field === "department_name" &&
        !/^[-_a-zA-Z ]+$/i.test(inputs.department_name)
        // !/^([0-9,;a-zA-Z _-\/()]+)$/i.test(inputs.department_name)
      ) {
        errors[field] = "Alphabets and special characters ( _ -) only";
      } else if (
        field === "department_name" &&
        !!inputs.department_name &&
        inputs.department_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      {
        /*end*/
      }

      {
        /*Validation code for Zone Name field added by Marieya on 22/8/22 */
      }

      // Sailaja Modified "zone_name" Only Alphanumeric characters and (_ -) are allowed validations on 3rd March

      if (field === "zone_name" && !inputs.zone_name) {
        errors[field] = "Field is required";
      } else if (
        field === "zone_name" &&
        !/^([0-9a-zA-Z-_ ]+)$/i.test(inputs.zone_name)
      ) {
        errors[field] = "Alphanumeric and special characters ( _  -) only";
      } else if (
        field === "zone_name" &&
        !!inputs.zone_name &&
        inputs.zone_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      {
        /*end*/
      }
      {
        /*Lead Type Name field added by Marieya 22/8/22*/
      }
      // Sailaja Modified "lead_type_name" only chars are allowed validations on 3rd March
      if (field === "lead_type_name" && !inputs.lead_type_name) {
        errors[field] = "Field is required";
      } else if (
        field === "lead_type_name" &&
        !/^([a-zA-Z ]+)$/i.test(inputs.lead_type_name)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "lead_type_name" &&
        !!inputs.lead_type_name &&
        inputs.lead_type_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      {
        /*end*/
      }
      {
        /*Lead Source Name filed added by Marieya 22/8/22*/
      }
      if (field === "lead_source_name" && !inputs.lead_source_name) {
        errors[field] = "Field is required";
      } else if (
        field === "lead_source_name" &&
        !/^([a-zA-Z ]+)$/i.test(inputs.lead_source_name)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "lead_source_name" &&
        !!inputs.lead_source_name &&
        inputs.lead_source_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      {
        /*end*/
      }
      {
        /*Lead Source details  Name field added by Marieya 22/8/22*/
        // Sailaja added "lead_source_details_name" for lead source edit on 3rd March
      }
      if (
        field === "lead_source_details_name" &&
        !inputs.lead_source_details_name
      ) {
        errors[field] = "Field is required";
      } else if (
        field === "lead_source_details_name" &&
        !/^([a-zA-Z ]+)$/i.test(inputs.lead_source_details_name)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "lead_source_details_name" &&
        !!inputs.lead_source_details_name &&
        inputs.lead_source_details_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      {
        /*end*/
      }
      {
        /*Lead Type Details Name field added by Marieya 22/8/22*/
      }

      // Sailaja Modified "lead_type_details_name" only chars are allowed validations on 3rd March
      if (
        field === "lead_type_details_name" &&
        !inputs.lead_type_details_name
      ) {
        errors[field] = "Field is required";
      } else if (
        field === "lead_type_details_name" &&
        !/^([a-zA-Z ]+)$/i.test(inputs.lead_type_details_name)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "lead_type_details_name" &&
        !!inputs.lead_type_details_name &&
        inputs.lead_type_details_name.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      {
        /*end*/
      }
      {
        /**/
      }
      //area name
      // Sailaja Modified "areaname" Only Alphanumeric characters and (_ -)  are allowed validations on 3rd March

      if (field === "areaname" && !inputs.areaname) {
        errors[field] = "Field is required";
      } else if (
        field === "areaname" &&
        !/^([0-9a-zA-Z-_ ]+)$/i.test(inputs.areaname)
      ) {
        errors[field] = "Alphanumeric and special characters ( _  -) only";
      } else if (
        field === "areaname" &&
        !!inputs.areaname &&
        inputs.areaname.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //end
      // payment_gateway_name
      // Sailaja added Payment Gateway Name on 13th March 2023
      if (field === "entity_id") {
        if (inputs.entity !== "admin") {
          if (!inputs.entity_id) {
            errors["entity_id"] = "Field is required";
          }
          // Add other entity_id specific validations here if needed...
        }
      }

      if (field === "payment_gateway_name" && !inputs.payment_gateway_name) {
        errors[field] = "Field is required";
      } else if (
        field === "payment_gateway_name" &&
        !/^[-_a-zA-Z0-9 ]+$/i.test(inputs.payment_gateway_name)
      ) {
        errors[field] = "Alphanumeric and special characters (_  -) only";
      }
      if (
        field === "payment_gateway_name" &&
        !!inputs.payment_gateway_name &&
        inputs.payment_gateway_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }
      // End
      //  Sailaja Added Branch Name * Field validations on 13th March 2023
      //updated one
      if (field === "name" && !inputs.name) {
        errors[field] = "Field is required";
      } else if (field === "name" && !/^[-_a-zA-Z ]+$/i.test(inputs.name)) {
        errors[field] = "Alphabets and special characters (_  -) only";
      }
      if (field === "name" && !!inputs.name && inputs.name.length > 50) {
        errors[field] = "Length cannot be more than 50 characters";
      }
      // if (field === "name" && !!inputs.name && inputs.name.length > 20) {
      //   errors[field] = "Length cannot be more than 20 characters";
      // }
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
      //   errors[field] = "Length cannot be more than 15";
      // }

      //(Start) Sailaja Added form validations for field Admin/username validations  on 16th August

      // Admin/username validations    selector: "username",

      if (field === "username" && !inputs.username) {
        errors[field] = "Field is required";
      } else if (field === "username" && !/^\S*$/i.test(inputs.username)) {
        errors[field] = "Whitespaces are not allowed";
      } else if (
        field === "username" &&
        !/^([0-9a-zA-Z _-]){1,30}$/i.test(inputs.username)
      ) {
        errors[field] = "Alphanumeric and special characters (_  -) only";
      } else if (
        field === "username" &&
        !!inputs.username &&
        inputs.username.length > 25
      ) {
        errors[field] = "Length cannot be more than 25 characters";
      }

      //(Start) Sailaja Added form validations field Admin/email validations for  on 16th August
      //Sailaja Added form validations Admin/email validations ended on 16th August
      // Admin/email validations    selector: "email",
      if (field === "email" && !inputs.email) {
        errors[field] = "Field is required";
      } else if (
        field === "email" &&
        !!inputs.email &&
        !/^([A-Za-z0-9\._])*@([A-Za-z]{3,8})*(\.[A-Za-z]{2,3})+$/.test(
          inputs.email
        )
        // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.email)
      ) {
        errors[field] = "Enter valid Email";
      }
      if (field === "email" && !!inputs.email && inputs.email.length > 50) {
        errors[field] = "Length cannot be more than 50 characters";
      }

      //roles
      if (field === "roles" && !inputs.roles) {
        errors[field] = "Field is required";
      }

      // Sailaja Added form validations Branch Code on 4th March 2023
      // Sailaja Added WhiteSpaces for Branch Code on 13th March 2023
      //branch_code
      if (field === "branch_code" && !inputs.branch_code) {
        errors[field] = "Field is required";
      } else if (
        field === "branch_code" &&
        !/^\S*$/i.test(inputs.branch_code)
      ) {
        errors[field] = "Whitespaces are not allowed";
      } else if (
        field === "branch_code" &&
        !/^([0-9 a-zA-Z _-]+)$/i.test(inputs.branch_code)
      ) {
        errors[field] = "Alphanumeric and special characters (_ -) only";
      } else if (
        field === "branch_code" &&
        !!inputs.branch_code &&
        inputs.branch_code.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 characters";
      }

      // Sailaja Added latitude validations for Globally on 6th March 2023

      if (field == "latitude" && !isEmpty(inputs?.address)) {
        if (field === "latitude" && !inputs?.address?.latitude) {
          errors[field] = "Field is required";
        } else if (
          field === "latitude" &&
          !/^([0-9.])+$/i.test(inputs?.address?.latitude)
        ) {
          errors[field] = "Only digits are allowed";
        } else if (
          field === "latitude" &&
          inputs?.address &&
          inputs?.address?.latitude &&
          inputs?.address?.latitude?.length > 15
        ) {
          errors[field] = "Length cannot be more than 15 characters";
        }
      } else {
        if (field === "latitude" && !inputs?.latitude) {
          errors[field] = "Field is required";
        } else if (
          field === "latitude" &&
          !/^([0-9.])+$/i.test(inputs?.latitude)
        ) {
          errors[field] = "Only digits are allowed";
        } else if (
          field === "latitude" &&
          !!inputs?.latitude &&
          inputs?.latitude?.length > 15
        ) {
          errors[field] = "Length cannot be more than 15 characters";
        }
      }

      if (field == "latitude" && !isEmpty(inputs?.permanent_address)) {
        if (field === "latitude" && !inputs?.permanent_address?.latitude) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "latitude" &&
          !/^([0-9.])+$/i.test(inputs?.permanent_address?.latitude)
        ) {
          errors["permanent_address"][field] = "Only digits are allowed";
        } else if (
          field === "latitude" &&
          inputs?.permanent_address?.latitude?.length > 15
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 15 characters";
        }
      }
      // Sailaja Added longitude validations for Globally on 6th March 2023

      if (field == "longitude" && !isEmpty(inputs?.address)) {
        if (field === "longitude" && !inputs?.address?.longitude) {
          errors[field] = "Field is required";
        } else if (
          field === "longitude" &&
          !/^([0-9.])+$/i.test(inputs?.address?.longitude)
        ) {
          errors[field] = "Only digits are allowed";
        } else if (
          field === "longitude" &&
          inputs?.address &&
          inputs?.address?.longitude &&
          inputs?.address?.longitude?.length > 15
        ) {
          errors[field] = "Length cannot be more than 15 characters";
        }
      } else {
        if (field === "longitude" && !inputs?.longitude) {
          errors[field] = "Field is required";
        } else if (
          field === "longitude" &&
          !/^([0-9.])+$/i.test(inputs?.longitude)
        ) {
          errors[field] = "Only digits are allowed";
        } else if (
          field === "longitude" &&
          !!inputs?.longitude &&
          inputs?.longitude?.length > 15
        ) {
          errors[field] = "Length cannot be more than 15 characters";
        }
      }

      if (field == "longitude" && !isEmpty(inputs?.permanent_address)) {
        if (field === "longitude" && !inputs?.permanent_address?.longitude) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "longitude" &&
          !/^([0-9.])+$/i.test(inputs?.permanent_address?.longitude)
        ) {
          errors["permanent_address"][field] = "Only digits are allowed";
        } else if (
          field === "longitude" &&
          inputs?.permanent_address?.longitude?.length > 15
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 15 characters";
        }
      }

      //(End) Sailaja form validations completed

      // franchise
      console.log(field, "super");
      if (field === "service_plan" && !inputs.service_plan) {
        errors[field] = "field is required";
      }
      if (field === "user_name" && !inputs.user_name) {
        errors[field] = "User Name is required";
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
        errors[field] = "Length cannot be more than 15";
      }

      //Franchise code validation in franchise list by Marieya on 18/8/22

      // if (field === "code" && !inputs.code) {
      //   errors[field] = "Field is required";
      // } else if (
      //   field === "code" &&
      //   !/^([0-9 a-zA-Z _+-\/]+)$/i.test(inputs.code)
      // ) {
      //   errors[field] = "Please enter valid franchise code";
      // }
      // if (field === "code" && !!inputs.code && inputs.code.length > 20) {
      //   errors[field] = "Franchise code cannot be more than 20 characters";
      // }

      // invoice code

      if (field === "invoice_code" && !inputs.invoice_code) {
        errors[field] = "Recommended one character";
      } else if (
        field === "invoice_code" &&
        !/^([A-Z]{1,2})$/i.test(inputs.invoice_code)
      ) {
        errors[field] = "Ony characters are allowed";
      }
      if (
        field === "invoice_code" &&
        !!inputs.invoice_code &&
        inputs.invoice_code.length > 2
      ) {
        errors[field] = "Length cannot be more than 2 characters";
      }
      // Sailaja Restricted WhiteSpaces in invoice code
      if (field === "invoice_code" && !/^\S*$/i.test(inputs.invoice_code)) {
        errors[field] = "Whitespaces are not allowed";
      }

      //franchise_code
      // Sailaja Modified Franchise code on 4th March 2023
      if (field === "franchise_code" && !inputs.franchise_code) {
        errors[field] = "Field is required";
      } else if (
        field === "franchise_code" &&
        !/^([0-9a-zA-Z_-]+)$/i.test(inputs.franchise_code)
      ) {
        errors[field] = "Alphanumeric and special characters (_ -) only";
      }
      if (
        field === "franchise_code" &&
        !!inputs.franchise_code &&
        inputs.franchise_code.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 characters";
      }
      // Sailaja Restricted WhiteSpaces in franchise code
      if (field === "franchise_code" && !/^\S*$/i.test(inputs.franchise_code)) {
        errors[field] = "Whitespaces are not allowed";
      }
      //franchise name
      // if (field === "name" && !inputs.name) {
      //   errors[field] = "Field is required";
      // } else if (
      //   field === "name" &&
      //   !/^[a-zA-Z ]+$/i.test(inputs.name)
      // ){
      //   errors[field] = "Only characters are allowed";
      // }
      // if (
      //   field === "name" &&
      //   !!inputs.name &&
      //   inputs.name.length > 50
      // ) {
      //   errors[field] = "Length cannot be more than 50 characters";
      // }

      if (field === "franchise_name" && !inputs.franchise_name) {
        errors[field] = "Field is required";
      } else if (
        field === "franchise_name" &&
        !/^[_-a-zA-Z ]+$/i.test(inputs.franchise_name)
      ) {
        errors[field] = "Only characters are allowed";
      }
      if (
        field === "franchise_name" &&
        !!inputs.franchise_name &&
        inputs.franchise_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }

      //revenue_sharing

      if (field === "revenue_sharing" && !inputs.revenue_sharing) {
        errors[field] = "Field is required";
      } else if (
        field === "revenue_sharing" &&
        !/^([0-9]+)$/i.test(inputs.revenue_sharing)
      ) {
        errors[field] = "Enter valid revenue sharing";
      }
      //renewal_bal

      if (field === "renewal_bal" && !inputs.renewal_bal) {
        errors[field] = "Field is required";
      } else if (
        field === "renewal_bal" &&
        !/^([0-9]+)$/i.test(inputs.renewal_bal)
      ) {
        errors[field] = "Enter valid Renewal balance";
      }

      //outstanding_bal
      if (field === "outstanding_bal" && !inputs.outstanding_bal) {
        errors[field] = "Field is required";
      } else if (
        field === "outstanding_bal" &&
        !/^([0-9]+)$/i.test(inputs.outstanding_bal)
      ) {
        errors[field] = "Enter valid Outstanding balance";
      }

      //sms_balance

      if (field === "sms_balance" && !inputs.sms_balance) {
        errors[field] = "Field is required";
      } else if (
        field === "sms_balance" &&
        !/^([0-9]+)$/i.test(inputs.sms_balance)
      ) {
        errors[field] = "Enter valid SMS balance";
      }

      // add role name

      if (field === "role_name" && !inputs.role_name) {
        errors[field] = "Field is required";
      } else if (
        field === "role_name" &&
        !/^[_-a-zA-Z ]+$/i.test(inputs.role_name)
      ) {
        errors[field] = "Alphabets and special characters ( _ -) only";
      } else if (
        field === "role_name" &&
        !!inputs.role_name &&
        inputs.role_name.length > 30
      ) {
        errors[field] = "Length cannot be more than 30 characters";
      }
      // role_desc
      if (field === "role_desc" && !inputs.role_desc) {
        errors[field] = "Field is required";
      } else if (
        field === "role_desc" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[-_a-zA-Z0-9 ]+$/i.test(inputs.role_desc)
      ) {
        errors[field] = "Alphanumeric and special characters ( _  -) only";
      }
      if (
        field === "role_desc" &&
        !!inputs.role_desc &&
        inputs.role_desc.length > 30
      ) {
        errors[field] = "Length cannot be more than 30 characters";
      }

      //end
      //landmark

      if (field == "landmark" && !isEmpty(inputs?.address)) {
        if (field === "landmark" && !inputs?.address?.landmark) {
          errors[field] = "Field is required";
        } else if (
          field === "landmark" &&
          !/^([0-9,a-zA-Z /]+)$/i.test(inputs?.address?.landmark)
          // !/^[^-\s][a-zA-Z_\s-]+$/i.test(inputs?.address?.landmark)
        ) {
          errors[field] = "Alphanumeric characters are allowed";
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
          errors[field] = "Alphanumeric characters are allowed";
        }
        if (
          field === "landmark" &&
          !!inputs?.landmark &&
          inputs?.landmark?.length > 50
        ) {
          errors[field] = "Length cannot be more than 50 characters";
        }
      }

      if (field == "landmark" && !isEmpty(inputs?.permanent_address)) {
        if (field === "landmark" && !inputs?.permanent_address?.landmark) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "landmark" &&
          !/^([0-9,a-zA-Z /]+)$/i.test(inputs?.permanent_address?.landmark)

          // !/^([a-zA-Z ]){1,30}$/i.test(inputs.permanent_address.landmark)
        ) {
          errors["permanent_address"][field] =
            "Alphanumeric characters are allowed";
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

      if (field == "street" && !isEmpty(inputs.address)) {
        if (field === "street" && !inputs.address.street) {
          errors[field] = "Field is required";
        } else if (
          field === "street" &&
          !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.address?.street)
        ) {
          errors[field] =
            "Alphanumeric and special characters (, _ : = + / ; . -) only";
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
          errors[field] =
            "Alphanumeric and special characters (, _ : = + / ; . -) only";
        }
        if (
          field === "street" &&
          !!inputs?.street &&
          inputs?.street?.length > 50
        ) {
          errors[field] = "Length cannot be more than 50 characters";
        }
      }

      if (field == "street" && !isEmpty(inputs?.permanent_address)) {
        if (field === "street" && !inputs?.permanent_address?.street) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "street" &&
          !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(
            inputs?.permanent_address?.street
          )
        ) {
          errors["permanent_address"][field] =
            "Alphanumeric and special characters (, _ : = + / ; . -) only";
        }
        if (
          field === "street" &&
          inputs?.permanent_address?.street?.length > 50
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 50 characters";
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
          errors[field] =
            "Alphanumeric and special characters (, _ : = + / ; . -) only";
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
        } else if (
          field === "house_no" &&
          !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.house_no)
        ) {
          errors[field] =
            "Alphanumeric and special characters (, _ : = + / ; . -) only";
        } else if (
          field === "house_no" &&
          !!inputs?.house_no &&
          inputs?.house_no?.length > 200
        ) {
          errors[field] = "Length cannot be more than 200 characters";
        }
      }
      //permanent address
      if (field == "house_no" && !isEmpty(inputs?.permanent_address)) {
        if (field === "house_no" && !inputs?.permanent_address?.house_no) {
          // errors["permanent_address"][field] = "House No is required";
        } else if (
          field === "house_no" &&
          !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(
            inputs?.permanent_address?.house_no
          )

          // !/^([0-9,; a-zA-Z _+-\/]+)$/i.test(inputs?.permanent_address?.house_no)
        ) {
          errors["permanent_address"][field] =
            "Alphanumeric and special characters (, _ : = + / ; . -) only";
        }
        if (
          field === "house_no" &&
          inputs?.permanent_address?.house_no?.length > 200
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 200 characters";
        }
      }
      //city

      if (field == "city" && !isEmpty(inputs?.address)) {
        if (field === "city" && !inputs?.address?.city) {
          errors[field] = "Field is required";
        } else if (
          field === "city" &&
          !/^([a-zA-Z ]+)$/i.test(inputs?.address?.city)
          // !/^([a-zA-Z _+-\/()]+)$/i.test(inputs?.address?.city)
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
        } else if (field === "city" && !/^([a-zA-Z ]+)$/i.test(inputs?.city)) {
          errors[field] = "Only characters are allowed";
        }
        if (field === "city" && !!inputs?.city && inputs?.city?.length > 70) {
          errors[field] = "Length cannot be more than 50 characters";
        }
      }

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
          errors["permanent_address"][field] =
            "Length cannot be more than 50 characters";
        }
      }

      //  static ip

      if (field == "static_ip_bind" && !isEmpty(inputs.radius_info)) {
        if (
          field === "static_ip_bind" &&
          inputs.radius_info &&
          inputs.radius_info.static_ip_bind &&
          inputs.radius_info.static_ip_bind.includes("_")
        ) {
          errors[field] = "please enter valid static ip";
        }
      }

      // pincode

      if (field == "pincode" && !isEmpty(inputs?.address)) {
        if (field === "pincode" && !inputs?.address?.pincode) {
          errors[field] = "Field is required";
        } else if (
          field === "pincode" &&
          !/^([0-9])+$/i.test(inputs?.address?.pincode)
        ) {
          errors[field] = "Only digits are allowed";
        }
        // if (
        //   (field == "pincode") !=
        //   !/^[a-zA-Z !\"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/i.test(
        //     inputs?.address?.pincode
        //   )
        // ) {
        //   errors[field] = "Only digits are allowed";
        // }
        else if (
          field === "pincode" &&
          inputs?.address &&
          inputs?.address?.pincode &&
          inputs?.address?.pincode?.length > 6
        ) {
          errors[field] = "Length cannot be more than 6 digits";
        } else if (
          field === "pincode" &&
          inputs?.address &&
          inputs?.address?.pincode &&
          inputs?.address?.pincode?.length < 6
        ) {
          errors[field] = "Length cannot be less than 6 digits";
        }
        // Sailaja Fixed only digits validation even 1 alphabet  entered on 4th March 2023
      } else {
        if (field === "pincode" && !inputs?.pincode) {
          errors[field] = "Field is required";
        } else if (
          field === "pincode" &&
          !/^([0-9])+$/i.test(inputs?.pincode)
        ) {
          errors[field] = "Only digits are allowed";
        }
        // if(field == "pincode"  !=  !/^[a-zA-Z !\"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/i.test(inputs?.pincode) ){
        //   errors[field] = "Only digits are allowed";
        // }
        else if (
          field === "pincode" &&
          !!inputs?.pincode &&
          inputs?.pincode?.length > 6
        ) {
          errors[field] = "Length cannot be more than 6 digits";
        } else if (
          field === "pincode" &&
          !!inputs?.pincode &&
          inputs?.pincode?.length < 6
        ) {
          errors[field] = "Length cannot be less than 6 digits";
        }
      }
      // Sailaja Updated one of the pincode char entries validation as  Please enter valid pincode on 5th August
      if (field == "pincode" && !isEmpty(inputs?.permanent_address)) {
        if (field === "pincode" && !inputs?.permanent_address?.pincode) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "pincode" &&
          !/^([0-9])+$/i.test(inputs?.permanent_address?.pincode)
        ) {
          errors["permanent_address"][field] = "Only digits are allowed";
        }
        // if (
        //   (field == "pincode") !=
        //   !/^[a-zA-Z !\"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/i.test(
        //     inputs?.permanent_address?.pincode
        //   )
        // ) {
        //   errors["permanent_address"][field] = "Only digits are allowed";
        // }
        if (
          field === "pincode" &&
          inputs?.permanent_address?.pincode?.length > 6
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 6 digits";
        }
      }
      if (
        field === "pincode" &&
        inputs?.permanent_address?.pincode?.length < 6
      ) {
        errors["permanent_address"][field] =
          "Length cannot be less than 6 digits";
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
      } else {
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

      if (field == "district" && !isEmpty(inputs?.permanent_address)) {
        if (field === "district" && !inputs?.permanent_address?.district) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "district" &&
          !/^([a-zA-Z _+-\/()]+)$/i.test(
            // !/^([0-9,;a-zA-Z _+-\/()]+)$/i.test(
            inputs?.permanent_address?.district
          )
        ) {
          errors["permanent_address"][field] = "Only characters are allowed";
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
        if (
          field === "state" &&
          !!inputs?.state &&
          inputs?.state?.length > 70
        ) {
          errors[field] = "Length cannot be more than 70 characters";
        }
      }

      if (field == "state" && !isEmpty(inputs?.permanent_address)) {
        if (field === "state" && !inputs?.permanent_address?.state) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "state" &&
          !/^([a-zA-Z ]+)$/i.test(inputs?.permanent_address?.state)
        ) {
          errors["permanent_address"][field] = "Only characters are allowed";
        }
        if (
          field === "state" &&
          inputs?.permanent_address?.state?.length > 70
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 70 characters";
        }
      }

      //country

      if (field == "country" && !isEmpty(inputs?.address)) {
        if (field === "country" && !inputs?.address?.country) {
          errors[field] = "Field is required";
        } else if (
          field === "country" &&
          !/^([a-zA-Z ]+)$/i.test(inputs?.address?.country)

          // !/^([a-zA-Z ])$/i.test(inputs?.address?.country)
        ) {
          errors[field] = "Only charcters are allowed";
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
          errors[field] = "Only charcters are allowed";
        }
        if (
          field === "country" &&
          !!inputs?.country &&
          inputs?.country?.length > 50
        ) {
          errors[field] = "Length cannot be more than 50 characters";
        }
      }

      if (field == "country" && !isEmpty(inputs?.permanent_address)) {
        if (field === "country" && !inputs?.permanent_address?.country) {
          errors["permanent_address"][field] = "Field is required";
        } else if (
          field === "country" &&
          !/^([a-zA-Z ]+)$/i.test(inputs?.permanent_address?.country)
        ) {
          errors["permanent_address"][field] = "Only charcters are allowed";
        }
        if (
          field === "country" &&
          inputs?.permanent_address?.country?.length > 50
        ) {
          errors["permanent_address"][field] =
            "Length cannot be more than 50 characters";
        }
      }

      //customer_pic
      if (field === "customer_pic" && !isEmpty(inputs.customer_documents)) {
        if (
          (field === "customer_pic" &&
            !inputs.customer_documents?.customer_pic) ||
          isEmpty(inputs.customer_documents?.customer_pic)
        ) {
          errors[field] = "Field is required";
        }
      }

      //plan_setup_intial_cost

      if (
        field === "plan_setup_intial_cost" &&
        !inputs.plan_setup_intial_cost
      ) {
        errors[field] = "Field is required";
      } else if (
        field === "plan_setup_intial_cost" &&
        !/^([0-9]+)$/i.test(inputs.plan_setup_intial_cost)
      ) {
        errors[field] = "Only digits are allowed";
      }

      //installation charges
      if (field === "installation_charges" && !inputs.installation_charges) {
        errors[field] = "Field is required";
      } else if (
        field === "installation_charges" &&
        !/^([0-9.]+)$/i.test(inputs.installation_charges)
      ) {
        errors[field] = "Only digits are allowed";
      }
      if (
        field === "installation_charges" &&
        !!inputs.installation_charges &&
        inputs.installation_charges.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }
      // security charges
      if (field === "security_deposit" && !inputs.security_deposit) {
        errors[field] = "Field is required";
      } else if (
        field === "security_deposit" &&
        !/^([0-9.]+)$/i.test(inputs.security_deposit)
      ) {
        errors[field] = "Only digits are allowed";
      }
      if (
        field === "security_deposit" &&
        !!inputs.security_deposit &&
        inputs.security_deposit.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }
      //key id
      // if (field == "key_id" && !isEmpty(inputs)) {
      //   if (field === "key_id" && !inputs?.key_id) {
      //     // errors["alternate_mobile"] = "Field is required";
      //   } else if (
      //   field === "key_id" &&
      //   !/^([0-9]+)$/i.test(inputs.key_id)
      // ) {
      //   errors[field] = "Only digits are allowed";
      // }
      // else if (
      //   field === "key_id" &&
      //   !!inputs.key_id &&
      //   inputs.key_id.length > 10
      // ) {
      //   errors[field] = "Length cannot be more than 10 digits";
      // }
      // }
      if (field === "key_id" && !inputs.key_id) {
        errors[field] = "Field is required";
      }
      if (field === "client_id" && !inputs.client_id) {
        errors[field] = "Field is required";
      }
      if (field === "request_hash_key" && !inputs.request_hash_key) {
        errors[field] = "Field is required";
      }
      if (field === "request_salt_key" && !inputs.request_salt_key) {
        errors[field] = "Field is required";
      }
      if (field === "resphashkey" && !inputs.resphashkey) {
        errors[field] = "Field is required";
      }
      if (field === "responsesaltkey" && !inputs.responsesaltkey) {
        errors[field] = "Field is required";
      }
      // if (field == "client_id" && !isEmpty(inputs)) {
      //   if (field === "client_id" && !inputs?.client_id) {
      //     // errors["alternate_mobile"] = "Field is required";
      //   } else if (
      //   field === "client_id" &&
      //   !/^([0-9a-zA-Z]+)$/i.test(inputs.client_id)
      // ) {
      //   errors[field] = "Alphanumeric characters are allowed";
      // }
      // else if (
      //   field === "client_id" &&
      //   !!inputs.client_id &&
      //   inputs.client_id.length > 10
      // ) {
      //   errors[field] = "Length cannot be more than 10 Characters";
      // }
      // }
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
        !/^\d{6}$/i.test(inputs.postal_code)
      ) {
        errors[field] = "Enter valid pincode";
      }
      //changed mobile no text by Marieya on 20/8/22
      //mob no
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
        errors["mobile_number"] = "Enter valid 10 digits";
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
        !/^([A-Za-z0-9\._])*@([A-Za-z]{3,8})*(\.[A-Za-z]{2,3})+$/.test(
          inputs.email
        )
        // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.email)
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
      if (
        (field === "cleartext_password") !== "undefined" &&
        (field === "password_confirm") !== "undefined"
      ) {
        if (inputs.cleartext_password != inputs.password_confirm) {
          // isValid = false;

          errors["cleartext_password"] = "Passwords don't match";
          errors["password_confirm"] = "Passwords don't match";
        }
      }

      if (field === "cleartext_password" && !inputs.cleartext_password) {
        errors[field] = "Field is required";
      } else if (
        field === "cleartext_password" &&
        !/^\S*$/i.test(inputs.cleartext_password)
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

      // ^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$

      if (field === "password" && !inputs.password) {
        errors[field] = "Field is required";
      } else if (field === "password" && !/^\S*$/i.test(inputs.password)) {
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
      } else if (field === "password2" && !/^\S*$/i.test(inputs.password2)) {
        errors[field] = "Enter valid password";
      }
      if (
        field === "password2" &&
        !!inputs.password2 &&
        inputs.password2.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //pwd reenter
      if (field === "password_confirm" && !inputs.password_confirm) {
        errors[field] = "Field is required";
      } else if (
        field === "password_confirm" &&
        !/^\S*$/i.test(inputs.password_confirm)
      ) {
        errors[field] = "Enter valid password";
      }
      if (
        field === "password_confirm" &&
        !!inputs.password_confirm &&
        inputs.password_confirm.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }

      // if (field === "password" && !inputs.) {
      //   errors[field] = "This field is required";
      // } else if (
      //   field === "username" &&
      //   !/^([a-zA-Z ]){1,30}$/i.test(inputs.username)
      // ) {
      //   errors[field] = "Enter valid name";
      // }
      //end

      //username
      if (field === "username" && !inputs.username) {
        errors[field] = "Field is required";
      } else if (
        field === "username" &&
        !/^([0-9a-zA-Z _-]){1,30}$/i.test(inputs.username)
      ) {
        errors[field] = "Alphanumeric and special characters ( _  -) only";
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
      // if (field === "radius_username" && !inputs.radius_username) {
      //   errors[field] = "Field is required";
      // }
      // if (
      //   field === "radius_username" &&
      //   !!inputs.radius_username &&
      //   inputs.radius_username.length > 30
      // ) {
      //   errors[field] = "Length cannot be more than 30";
      // }

      if (field === "radius_username" && !inputs.radius_username) {
        errors[field] = "Field is required";
      } else if (
        field === "radius_username" &&
        !/^([0-9a-zA-Z _-]){1,30}$/i.test(inputs.radius_username)
      ) {
        errors[field] = "Alphanumeric and special characters ( _  -) only";
      }
      if (
        field === "radius_username" &&
        !!inputs.radius_username &&
        inputs.radius_username.length > 25
      ) {
        errors[field] = "Length cannot be more than 25 characters";
      }
      if (
        field === "radius_username" &&
        !/^\S*$/i.test(inputs.radius_username)
      ) {
        errors[field] = "Whitespaces are not allowed";
      }

      //end
      //made change from "Enter Valid Last Name" to "only characters allowed by Marieya on line 948"
      //last name
      if (field === "last_name" && !inputs.last_name) {
        errors[field] = "Field is required";
      } else if (
        field === "last_name" &&
        !!inputs.last_name &&
        !/^[a-zA-Z ]+$/i.test(inputs.last_name)
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
      //   errors[field] = "Length cannot be more than 20 characters";
      // }

      //roles
      if (field === "roles" && !inputs.roles) {
        errors[field] = "Field is required";
      }
      if (field === "users" && !inputs.users) {
        errors[field] = "Field is required";
      }
      //select branch
      if (field === "select_branch" && !inputs.select_branch) {
        errors[field] = "Selection is required";
      }
      //emd
      //franchise
      if (field === "select_franchise" && !inputs.select_franchise) {
        errors[field] = "Selection is required";
      }
      //
      //Zone
      if (field === "select_zone" && !inputs.select_zone) {
        errors[field] = "Selection is required";
      }
      //emd
      // if (field === "branch" && !inputs.branch) {
      //   errors[field] = "Field 5is required";
      // } else if (
      //   field === "branch" &&
      //   !/^([0-9 a-zA-Z _+-\/]+)$/i.test(inputs.branch)
      // ) {
      //   errors[field] = "Ony characters are allowed";
      // }
      // if (
      //   field === "branch" &&
      //   !!inputs.branch &&
      //   inputs.branch.length > 15
      // ) {
      //   errors[field] = "Length cannot be more than 15 Alphanumeric characters";
      // }

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
      // Sailaja fixed AAdharnumber validation on 4th August  [didn't fire  "Length cannot be more than 12" validation msg before]
      if (
        field === "Aadhar_Card_No" &&
        !inputs.customer_documents.Aadhar_Card_No
      ) {
        errors[field] = "Field is required";
      } else if (
        field == "Aadhar_Card_No" &&
        !/^([0-9])+$/i.test(inputs?.customer_documents?.Aadhar_Card_No)
      ) {
        errors[field] = "Only digits are allowed";
      } else if (
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
      //   errors[field] = "Length cannot be more than 20 characters";
      // }
      // {/*end*/}
      {
        /*added admin ticket category validation code by Marieya on 22.8.22 */
      }
      if (field === "new_ticket_category" && !inputs.new_ticket_category) {
        errors[field] = "Field is required";
      } else if (
        field === "new_ticket_category" &&
        !/^[_-a-zA-Z ]+$/i.test(inputs.new_ticket_category)
      ) {
        errors[field] = "Alphabets and special characters ( _ -) only";
      }
      if (
        field === "new_ticket_category" &&
        !!inputs.new_ticket_category &&
        inputs.new_ticket_category.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }
      {
        /*end*/
      }
      {
        /*Addded Subject field validation code for admin category by Marieya on 22.8.22*/
      }
      if (field === "new_subject" && !inputs.new_subject) {
        errors[field] = "Field is required";
      } else if (
        field === "new_subject" &&
        !/^[a-zA-Z ]+$/i.test(inputs.new_subject)
      ) {
        errors[field] = "Only characters are allowed";
      }
      if (
        field === "new_subject" &&
        !!inputs.subject &&
        inputs.subject.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }
      {
        /*end*/
      }
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
        errors[field] = "Length cannot be more than 20 characters";
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
        errors[field] = "Length cannot be more than 20 characters";
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
        errors[field] = "Landline is required";
      } else if (field === "landline" && !/^\d{10}$/i.test(inputs.landline)) {
        errors[field] = "Enter valid number";
      }
      if (
        field === "landline" &&
        !!inputs.landline &&
        inputs.landline.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }

      // if (field === "mobile" && !inputs.mobile) {
      //   errors[field] = "Field is required";
      // } else if (field === "mobile" && !/^\d{10}$/i.test(inputs.mobile)) {
      //   errors[field] = "Enter valid number";
      // }
      // if (field === "mobile" && !!inputs.mobile && inputs.mobile?.length > 10) {
      //   errors[field] = "Length cannot be more than 10 digits";
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
        errors["mobile_no"] = "Enter valid 10 digits";
      }
      if (
        field === "mobile_no" &&
        !!inputs.mobile_no &&
        inputs.mobile_no.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }

      // KYC Mobile Number

      if (field === "register_mobile" && !inputs?.register_mobile) {
        errors[field] = "Field is required";
      } else if (
        field == "register_mobile" &&
        !/^([0-9])+$/i.test(inputs?.register_mobile)
      ) {
        errors[field] = "Only digits are allowed";
      } else if (
        field === "register_mobile" &&
        !/^(?!(0|1|2|3|4|5))[0-9]{10}$/i.test(inputs?.register_mobile)
      ) {
        errors[field] = "Enter valid 10 digits";
      }
      if (
        field === "register_mobile" &&
        !!inputs.register_mobile &&
        inputs?.register_mobile?.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }
      //

      //Sailaja changed email as Email in 3rd August
      //registered_email
      if (field === "registered_email" && !inputs.registered_email) {
        errors[field] = "Field is required";
      } else if (
        field === "registered_email" &&
        // !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(inputs.registered_email)
        // !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.registered_email)
        !/^([A-Za-z0-9\._])*@([A-Za-z]{3,8})*(\.[A-Za-z]{2,3})+$/.test(
          inputs.registered_email
        )
      ) {
        errors[field] = "Enter valid Email";
      }
      if (
        field === "registered_email" &&
        !!inputs.registered_email &&
        inputs.registered_email.length > 50
      ) {
        errors[field] = "Length cannot be more than  50 characters";
      }

      //service plan time

      //package name

      if (field === "package_name" && !inputs.package_name) {
        errors[field] = "Field is required";
      } else if (
        field === "package_name" &&
        !/^\S*$/i.test(inputs.package_name)
      ) {
        errors[field] = "Whitespaces are not allowed";
      } else if (
        field === "package_name" &&
        !/^[_a-zA-Z0-9 ]+$/i.test(inputs.package_name)
      ) {
        errors[field] = "Only Aplhanumeric characters and ( _ ) are allowed";
      } else if (
        field === "package_name" &&
        !!inputs.package_name &&
        inputs.package_name.length > 70
      ) {
        errors[field] = "Length cannot be more than 70 characters";
      }
      // Sailaja added Max-Length for download speed on 13th March 2023
      //download_speed

      if (field === "download_speed" && !inputs.download_speed) {
        errors[field] = "Field is required";
      } else if (
        field === "download_speed" &&
        !/^([0-9]+)$/i.test(inputs.download_speed)
      ) {
        errors[field] = "Enter valid Download speed";
      } else if (
        field === "download_speed" &&
        !!inputs.download_speed &&
        inputs.download_speed.length > 5
      ) {
        errors[field] = "Length cannot be more than 5 digits";
      }
      // Sailaja added Max-Length for Upload speed on 13th March 2023
      //upload_speed
      if (field === "upload_speed" && !inputs.upload_speed) {
        errors[field] = "Field is required";
      } else if (
        field === "upload_speed" &&
        !/^([0-9]+)$/i.test(inputs.upload_speed)
      ) {
        errors[field] = "Enter valid Upload speed";
      } else if (
        field === "upload_speed" &&
        !!inputs.upload_speed &&
        inputs.upload_speed.length > 5
      ) {
        errors[field] = "Length cannot be more than 5 digits";
      }

      //fup_limit
      // Sailaja added Max-Length for FUP speed on 13th March 2023

      if (field === "fup_limit" && !inputs.fup_limit) {
        errors[field] = "Field is required";
      } else if (
        field === "fup_limit" &&
        !/^([0-9]+)$/i.test(inputs.fup_limit)
      ) {
        errors[field] = "Enter valid FUP Limit ";
      } else if (
        field === "fup_limit" &&
        !!inputs.fup_limit &&
        inputs.fup_limit.length > 5
      ) {
        errors[field] = "Length cannot be more than 5 digits";
      }
      // time_unit

      // Sailaja added Max-Length for Offer Period  on 13th March 2023
      // Backend key name : time_unit
      if (field === "time_unit" && !inputs.time_unit) {
        errors[field] = "Field is required";
      } else if (
        field === "time_unit" &&
        !/^([0-9]+)$/i.test(inputs.time_unit)
      ) {
        errors[field] = "Enter valid time unit ";
      } else if (
        field === "time_unit" &&
        !!inputs.time_unit &&
        inputs.time_unit.length > 5
      ) {
        errors[field] = "Length cannot be more than 5 digits";
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
      //   errors[field] = "Length cannot be more than 15";
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
      {
        /*Changed text on line 1313 and 1319 by Marieya for priority */
      }
      if (
        field === "escalation_notification_message" &&
        !inputs.escalation_notification_message
      ) {
        errors[field] = "Field is required";
      } else if (
        field === "escalation_notification_message" &&
        !/^([a-zA-Z ]+)$/i.test(inputs.escalation_notification_message)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "escalation_notification_message" &&
        !!inputs.escalation_notification_message &&
        inputs.escalation_notification_message.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }

      //Notification Frequency
      if (
        field === "notification_frequency" &&
        !inputs.notification_frequency
      ) {
        errors[field] = "Field is required";
      } else if (
        field == "notification_frequency" &&
        !/^([0-9])+$/i.test(inputs?.notification_frequency)
      ) {
        errors[field] = "Only digits are allowed";
      } else if (
        field === "notification_frequency" &&
        !!inputs.notification_frequency &&
        inputs.notification_frequency.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 digits";
      }

      //end

      // if (
      //   field === "escalation_notification_message" &&
      //   !inputs.escalation_notification_message
      // ) {
      //   errors[field] = "Field is required";
      // }
      // if (
      //   field === "notification_frequency" &&
      //   !inputs.notification_frequency
      // ) {
      //   errors[field] = "Field is required";
      // }
      //added by Marieya for response time in priority on 22/8/22
      if (
        field === "priority_response_time" &&
        !inputs.priority_response_time
      ) {
        errors[field] = "Field is required";
      }
      //end
      //added by Marieya for resolution time in priority on 22/8/22
      if (
        field === "priority_resolution_time" &&
        !inputs.priority_resolution_time
      ) {
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
        errors[field] = "only characters are allowed";
      }
      if (
        field === "customer_name" &&
        !!inputs.customer_name &&
        inputs.customer_name.length > 15
      ) {
        errors[field] = "Length cannot be more than 15";
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
      //   errors[field] = "Length cannot be more than 15";
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
      if (field === "make" && !!inputs.make && inputs.make.length > 20) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //serail no in dp details
      // if (field === "serial_no" && !inputs.serial_no) {
      //   errors[field] = "Serial No is required";
      // }

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
      } else if (
        field === "nas_hardware_name" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[-_a-zA-Z0-9. ]+$/i.test(inputs.nas_hardware_name)
      ) {
        errors[field] = "Alphanumeric and special characters ( _ -) only";
      }
      if (
        field === "nas_hardware_name" &&
        !!inputs.nas_hardware_name &&
        inputs.nas_hardware_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }
      //end

      // description
      // Sailaja Added space for IP POOL description field on Enter valid description on 1st March 2023

      if (field === "description" && !inputs.description) {
        errors[field] = "Field is required";
      } else if (
        field === "description" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[-_a-zA-Z0-9 .]+$/i.test(inputs.description)
      ) {
        errors[field] = "Alphanumeric characters are allowed";
      }
      if (
        field === "description" &&
        !!inputs.description &&
        inputs.description.length > 500
      ) {
        errors[field] =
          "Length cannot be more than 500 alphanumeric characters";
      }

      //customer notes
      if (field === "customer_notes" && !inputs.customer_notes) {
        errors[field] = "Field is required";
      } else if (
        field === "customer_notes" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[-_a-zA-Z0-9. ]+$/i.test(inputs.customer_notes)
      ) {
        errors[field] = "Alphanumeric and speacial characters (_ - .) only";
      }
      if (
        field === "customer_notes" &&
        !!inputs.customer_notes &&
        inputs.customer_notes.length > 500
      ) {
        errors[field] =
          "Length cannot be more than 500 alphanumeric characters";
      }

      //work notes

      if (field === "worknotes" && !inputs.worknotes) {
        // errors[field] = "worknotes is required";
      } else if (
        field === "worknotes" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[-_a-zA-Z0-9. ]+$/i.test(inputs.worknotes)
      ) {
        errors[field] = "Alphanumeric and speacial characters (_ - .) only";
      }
      if (
        field === "worknotes" &&
        !!inputs.worknotes &&
        inputs.worknotes.length > 500
      ) {
        errors[field] =
          "Length cannot be more than 500 alphanumeric characters";
      }

      // notes

      if (field === "notes" && !inputs.notes) {
        errors[field] = "Field is required";
      } else if (
        field === "notes" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[-_a-zA-Z0-9., ]+$/i.test(inputs.notes)
      ) {
        errors[field] = "Alphanumeric and special characters (, _  . -) only";
      }
      if (field === "notes" && !!inputs.notes && inputs.notes.length > 500) {
        errors[field] = "Length cannot be more than 500 characters";
      }

      // pool name
      // Sailaja Added space for Pool Name field on 1st March 2023
      if (field === "nas_pool_name" && !inputs.nas_pool_name) {
        errors[field] = "Field is required";
      } else if (
        field === "nas_pool_name" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[-_a-zA-Z. ]+$/i.test(inputs.nas_pool_name)
      ) {
        errors[field] = "Only characters are allowed";
      }

      if (
        field === "nas_pool_name" &&
        !!inputs.nas_pool_name &&
        inputs.nas_pool_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }

      //parent nas
      if (field === "parent_nas" && !inputs.parent_nas) {
        errors[field] = "Hardware Name is required";
      } else if (
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
      // Sailaja Modifications on NETWORK NAS Module
      // Sailaja Added Validations for NAS/Secret * field on 2nd March 2023
      if (field === "secret" && !inputs.secret) {
        errors[field] = "Field is required";
      } else if (
        field === "secret" &&
        field === "secret" &&
        !/^([0-9,a-zA-Z @_-]+)$/i.test(inputs?.secret)
      ) {
        errors[field] = "Alphanumeric and special characters (@ _ -) only";
      }
      if (field === "secret" && !/^\S*$/i.test(inputs?.secret)) {
        errors[field] = "Whitespaces are not allowed";
      } else if (
        field === "secret" &&
        !!inputs?.secret &&
        inputs?.secret?.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }

      // Sailaja Added Validations for NAS/status field on 2nd March 2023
      if (field === "status" && !inputs.status) {
        errors[field] = "Selection is required";
      }
      // Sailaja Added Validations for  NAS/ip_address field on 2nd March 2023
      if (field === "ip_address" && !inputs.ip_address) {
        errors[field] = "Field is required";
      }
      // Sailaja Added Validations for  NAS/ accounting_interval_time  field on 2nd March 2023
      if (
        field === "accounting_interval_time" &&
        !inputs.accounting_interval_time
      ) {
        errors[field] = "Field is required";
      }
      // Sailaja Added Validations for  NAS/ serial_no  field on 2nd March 2023

      if (field === "serial_no" && !inputs.serial_no) {
        errors[field] = "Field is required";
      } else if (
        field === "serial_no" &&
        field === "serial_no" &&
        !/^([0-9,a-zA-Z_-]+)$/i.test(inputs?.serial_no)
      ) {
        errors[field] = "Alphanumeric and special characters (_ -) only";
      }
      if (field === "serial_no" && !/^\S*$/i.test(inputs.serial_no)) {
        errors[field] = "Whitespaces are not allowed";
      }
      if (
        field === "serial_no" &&
        !!inputs.serial_no &&
        inputs.serial_no.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      //end

      // Sailaja Modifications on NETWORK OLT Module

      // Sailaja Added Validations for  NAS/ hardware_category  field on 2nd March 2023
      if (field === "hardware_category" && !inputs.hardware_category) {
        errors[field] = "Selection is required";
      }

      //olt Hardware name field validation by Mareiya on 17/8/22

      if (field === "olt_nas_name" && !inputs.olt_nas_name) {
        errors[field] = "Field is required";
      } else if (
        field === "olt_nas_name" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[_-a-zA-Z0-9. ]+$/i.test(inputs.olt_nas_name)
      ) {
        errors[field] = "Alphanumeric and special characters (_ -) only";
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
      } else if (
        field === "nas_name" &&
        // !/^\S*$/i.test(inputs.nas_name)
        !/^[_-a-zA-Z0-9. ]+$/i.test(inputs.nas_name)
      ) {
        errors[field] = "Alphanumeric and special characters ( _ - ) only";
      }
      if (
        field === "nas_name" &&
        !!inputs.nas_name &&
        inputs.nas_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
      }

      //end
      //CPE Hardware Name filed validation by Marieya on 17/8/22

      if (field === "cpe_nas_name" && !inputs.cpe_nas_name) {
        errors[field] = "Field is required";
      } else if (
        field === "cpe_nas_name" &&
        // !/^\S*$/i.test(inputs.cpe_nas_name)
        !/^[_-a-zA-Z0-9. ]+$/i.test(inputs.cpe_nas_name)
      ) {
        errors[field] = "Alphanumeric and special characters ( _ -) only";
      }
      if (
        field === "cpe_nas_name" &&
        !!inputs.cpe_nas_name &&
        inputs.cpe_nas_name.length > 50
      ) {
        errors[field] = "Length cannot be more than 50 characters";
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

      // else if (
      //   field === "radius_password" &&
      //   !/^[_-a-zA-Z ]+$/i.test(inputs.radius_password)
      // ) {
      //   errors[field] = "Only characters are allowed";
      // }
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
        errors[field] = "Please select area";
      }
      //end

      // Add Offer

      if (field === "offer_name" && !inputs.offer_name) {
        errors[field] = "Field is required";
      } else if (
        field === "offer_name" &&
        !/^([0-9a-zA-Z-_+ ]+)$/i.test(inputs.offer_name)
      ) {
        errors[field] = "Alphanumeric and special character ( + _ -) only";
      }
      if (
        field === "offer_name" &&
        !!inputs.offer_name &&
        inputs.offer_name.length > 10
      ) {
        errors[field] = "Length cannot be more than 10 characters";
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
      //   errors[field] = "Length cannot be more than 20 characters";
      // }
      //

      // number length less than 5//
      {
        /*added validation for zone area code by Marieya on 22/8/22 */
      }
      if (field === "zone_area_code" && !inputs.zone_area_code) {
        errors[field] = "Field is required";
      } else if (
        field === "zone_area_code" &&
        !/^\d+$/.test(inputs.zone_area_code)
      ) {
        errors[field] = "Only digits are allowed";
      } else if (
        field === "zone_area_code" &&
        !!inputs.zone_area_code &&
        inputs.zone_area_code.length > 5
      ) {
        errors[field] = "Length cannot be more than 5 digits";
      }
      // else if (
      //   field === "zone_area_code" &&
      //   !!inputs.zone_area_code &&
      //   inputs.zone_area_code.length < 5
      // ) {
      //   errors[field] = "Length cannot be less than 5 digits";
      // }
      {
        /*end*/
      }
      //validation for code in add area, changed text on line 1626 by Marieya
      if (field === "area_code" && !inputs.area_code) {
        errors[field] = "Field is required";
      } else if (field === "area_code" && !/^\d+$/.test(inputs.area_code)) {
        errors[field] = "Only digits are allowed";
      } else if (
        field === "area_code" &&
        !!inputs.area_code &&
        inputs.area_code.length > 5
      ) {
        errors[field] = "Length cannot be more than 5 digits";
      }
      // else if (
      //   field === "area_code" &&
      //   !!inputs.area_code &&
      //   inputs.area_code.length < 5
      // ) {
      //   errors[field] = "Length cannot be less than 5 digits";
      // }

      //end

      // cost for ip in ippool
      //
      if (field === "cost_per_ip" && !inputs.cost_per_ip) {
        errors[field] = "Field is required";
      } else if (
        field === "cost_per_ip" &&
        //  !/^([0-9]{2,7})*(\.[0-9]{1,2})+$/.test(inputs.cost_per_ip)
        !/^([0-9].+)$/i.test(inputs.cost_per_ip)
      ) {
        errors[field] = "Only digits are allowed";
      } else if (
        field === "cost_per_ip" &&
        !!inputs.cost_per_ip &&
        inputs.cost_per_ip.length > 8
      ) {
        errors[field] = "Length cannot be more than 7 digits";
      }
      // //  Sailaja Added Add NAS Secret * Field validations on 1st March 2023 Keyword :

      if (field === "house_no" && !inputs.house_no) {
        // errors[field] = "House number is required";
      } else if (
        field === "house_no" &&
        field === "house_no" &&
        !/^([0-9,a-zA-Z (,)_:=+/;.-]+)$/i.test(inputs?.house_no)
      ) {
        errors[field] =
          "Alphanumeric and special characters (, _ : = + / ; . -) only";
      } else if (
        field === "house_no" &&
        !!inputs?.house_no &&
        inputs?.house_no?.length > 200
      ) {
        errors[field] = "Length cannot be more than 200 characters";
      }

      //device_model
      if (field === "device_model" && !inputs.device_model) {
        errors[field] = "Field is required";
      } else if (
        field === "device_model" &&
        !/^[a-zA-Z ]+$/i.test(inputs.device_model)
        // !/^([a-zA-Z ]){1,30}$/i.test(inputs.model)
      ) {
        errors[field] = "Only characters are allowed";
      } else if (
        field === "device_model" &&
        !!inputs.device_model &&
        inputs.device_model.length > 20
      ) {
        errors[field] = "Length cannot be more than 20 characters";
      }
      // });

      // phone pay

      if (field === "upi_reference_no" && !inputs.upi_reference_no) {
        errors[field] = "Field is required";
      }
      if (
        field === "upi_reference_no" &&
        !!inputs.upi_reference_no &&
        inputs.upi_reference_no.length > 30
      ) {
        errors[field] = "Length cannot be more than 30 characters ";
      }

      // check_reference_no

      if (field === "check_reference_no" && !inputs.check_reference_no) {
        errors[field] = "Field is required";
      }
      if (
        field === "check_reference_no" &&
        !!inputs.check_reference_no &&
        inputs.check_reference_no.length > 30
      ) {
        errors[field] = "Length cannot be more than 30 characters ";
      }

      // bank_reference_no

      if (field === "bank_reference_no" && !inputs.bank_reference_no) {
        errors[field] = "Field is required";
      }
      if (
        field === "bank_reference_no" &&
        !!inputs.bank_reference_no &&
        inputs.bank_reference_no.length > 30
      ) {
        errors[field] = "Length cannot be more than 30 characters ";
      }

      //model
      if (field === "model" && !inputs.model) {
        errors[field] = "Field is required";
      } else if (
        field === "model" &&
        // !/^[a-zA-Z ]+$/i.test(inputs.device_model)
        !/^([a-zA-Z ])+$/i.test(inputs.model)
      ) {
        errors[field] = "Only characters are allowed";
      }
      if (field === "model" && !!inputs.model && inputs.model.length > 20) {
        errors[field] = "Length cannot be more than 20 characters";
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

export default useFormValidation;

// test
