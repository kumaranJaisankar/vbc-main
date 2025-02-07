import React, { Fragment, useState, useRef, useEffect } from 'react'
import {
  Container,
  Input,
  Button,
  Table,
} from 'reactstrap'
import { toast } from 'react-toastify'
import { default as axiosBaseURL } from '../../../../axios'
import useFormValidation from '../../../customhooks/FormValidation'

const MANDATORY_FIELDS = [
  'district',
  'first_name',
  'house_no',
  'lead_source',
  'mobile_no',
  'notes',
  'pincode',
  'state',
  'street',
  'city',
  'landmark',
  'type',
]

export const CorrectLeadRow = (props) => {
  const [formData, setFormData] = useState([])
  const [inputs, setInputs] = useState()

  const handleInputChange = (event, rowId) => {
    event.persist()
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }))
    const target = event.target
    var value = target.value
    const name = target.name
    const formDataClone = [...formData]
    const index = formDataClone.findIndex((tr) => tr.row == rowId)
    const editObject = formDataClone[index].data
    editObject[name] = value
    formDataClone[index].data = editObject
    setFormData(formDataClone)
  }

  useEffect(() => {
    if (props.inVaildData) {
      setFormData(props.inVaildData)
    }
  }, [props.inVaildData])

  const { validate } = useFormValidation(MANDATORY_FIELDS)

  const saveMissingFieldsFunc = () => {
    const formDataClone = [...formData]
    const newFormData = [];
    formDataClone.forEach(row => {
    	const validationErrors = validate(row.data);
      const fieldsKeys = Object.keys(validationErrors);
      const index = fieldsKeys.indexOf('addlead')
      if(index>=0){
        fieldsKeys.splice(index,1);
      }
    	newFormData.push({...row,missingFields:fieldsKeys, errors: validationErrors});
    })
    setFormData(newFormData)
    let callAPI = true;
    const data = newFormData.map((row) => {
      if(row.missingFields.length>0){
        callAPI = false;
      }
      return row.data
    })
    if(callAPI){
      axiosBaseURL
      .post('/radius/lead/uploadcsv/partial', data)
      .then((response) => {
        response.data.forEach(d=>{  
          props.onUpdate({...d})
        });

        toast.success('data update Successfully !');
        props.dataClose()
      })
      .catch(function (error) {
        toast.error('Something went wrong!')
      })
    }

  }

  function checkEmptyValue(e) {
    if (e.target.value == '') {
      e.target.classList.remove('not-empty')
    } else {
      e.target.classList.add('not-empty')
    }
  }

  const form = useRef(null)
  return (
    <Fragment>
      <br />
      <div className="show-rows-and-fields">
        <p>
          Below Fields are missing. Please fill all fields and click on save
          button.
        </p>
      </div>
      <Container fluid={true} style={{ overflow: 'auto' }}>
        <Table className="correact-lead-row-table">
          <thead>
            <td>First Name</td>
            <td>Last Name</td>
            <td>Mobile</td>
            <td>House No.</td>
            <td>Street</td>
            <td>City</td>
            <td>Landmark</td>
            <td>District</td>
            <td>State</td>
            <td>Pincode</td>
            <td>Lead Source</td>
            <td>Lead Type</td>
            <td>Notes</td>
          </thead>
          {formData.map((row,i) => (
            <tr key={i}>
              <td>
                <Input
                  className={`form-control ${
                    !row.missingFields.includes('first_name') ? '' : 'input-field-error'
                  }`}
                  type="text"
                  name="first_name"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.first_name}
                  maxLength="15"
                  required
                />
                {row.missingFields.includes('first_name') &&
                 <span className="errortext">{row.errors['first_name']}</span>}
              </td>
              <td>
                <Input
                  className="form-control"
                  type="text"
                  name="last_name"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.last_name}
                  maxLength="15"
                />
              </td>
              <td>
                <Input
                  className={`form-control ${
                    !row.missingFields.includes('mobile_no') ? '' : 'input-field-error'
                  }`}
                  type="text"
                  name="mobile_no"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.mobile_no}
                  maxLength="15"
                />
                  {row.missingFields.includes('mobile_no') &&
                 <span className="errortext">{row.errors['mobile_no']}</span>}
              </td>
              <td>
                <Input
                 className={`form-control ${
                  !row.missingFields.includes('house_no') ? '' : 'input-field-error'
                }`}
                  type="text"
                  name="house_no"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.house_no}
                  maxLength="15"
                />
                  {row.missingFields.includes('house_no') &&
                 <span className="errortext">{row.errors['house_no']}</span>}
              </td>
              <td>
                <Input
                    className={`form-control ${
                      !row.missingFields.includes('street') ? '' : 'input-field-error'
                    }`}
                  type="text"
                  name="street"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.street}
                  maxLength="15"
                />
                 {row.missingFields.includes('street') &&
                 <span className="errortext">{row.errors['street']}</span>}
              </td>
              <td>
                <Input
                    className={`form-control ${
                      !row.missingFields.includes('city') ? '' : 'input-field-error'
                    }`}
                  type="text"
                  name="city"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.city}
                  maxLength="15"
                />
                   {row.missingFields.includes('city') &&
                 <span className="errortext">{row.errors['city']}</span>}
              </td>
              <td>
                <Input
                  className={`form-control ${
                    !row.missingFields.includes('landmark') ? '' : 'input-field-error'
                  }`}
                  type="text"
                  name="landmark"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.landmark}
                  maxLength="15"
                />
                   {row.missingFields.includes('landmark') &&
                 <span className="errortext">{row.errors['landmark']}</span>}
              </td>
              <td>
                <Input
                 className={`form-control ${
                  !row.missingFields.includes('district') ? '' : 'input-field-error'
                }`}
                  type="text"
                  name="district"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.district}
                  maxLength="15"
                />
                  {row.missingFields.includes('district') &&
                 <span className="errortext">{row.errors['district']}</span>}
              </td>
              <td>
                <Input
                  className={`form-control ${
                    !row.missingFields.includes('state') ? '' : 'input-field-error'
                  }`}
                  type="text"
                  name="state"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.state}
                  maxLength="15"
                />
                 {row.missingFields.includes('state') &&
                 <span className="errortext">{row.errors['state']}</span>}
              </td>
              <td>
                <Input
                    className={`form-control ${
                      !row.missingFields.includes('pincode') ? '' : 'input-field-error'
                    }`}
                  type="text"
                  name="pincode"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.pincode}
                  maxLength="15"
                />
                  {row.missingFields.includes('pincode') &&
                 <span className="errortext">{row.errors['pincode']}</span>}
              </td>
              <td>
                <Input
                   className={`form-control ${
                    !row.missingFields.includes('lead_source') ? '' : 'input-field-error'
                  }`}
                  type="text"
                  name="lead_source"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.lead_source}
                  maxLength="15"
                />
                 {row.missingFields.includes('lead_source') &&
                 <span className="errortext">{row.errors['lead_source']}</span>}
              </td>
              <td>
                <Input
                  className={`form-control ${
                    !row.missingFields.includes('type') ? '' : 'input-field-error'
                  }`}
                  type="text"
                  name="type"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.type}
                  maxLength="15"
                />
                 {row.missingFields.includes('type') &&
                 <span className="errortext">{row.errors['type']}</span>}
              </td>
              <td>
                <Input
                  className={`form-control ${
                    !row.missingFields.includes('notes') ? '' : 'input-field-error'
                  }`}
                  type="text"
                  name="notes"
                  onChange={(e) => handleInputChange(e, row.row)}
                  onBlur={checkEmptyValue}
                  value={row.data.notes}
                  maxLength="15"
                />
                  {row.missingFields.includes('notes') &&
                 <span className="errortext">{row.errors['notes']}</span>}
              </td>
            </tr>
          ))}
        </Table>
       
      </Container>
      <Button
          color="btn btn-primary"
          className="mr-3"
          onClick={saveMissingFieldsFunc}
          style={{marginTop:'20px'}}
        >
          Save
        </Button>
    </Fragment>
  )
}
