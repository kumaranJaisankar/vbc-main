
import isEmpty from 'lodash/isEmpty';


export const isEmptyStr = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    return true;
  }
  return false;
};

export const apiParams = {
  regulatoryZone: 'regulatory_zone',
  zipCode: 'zip_code',
  timeZone: 'time_zone',
  orgId: 'org_id',
  referencePoint: 'reference_point',
  administrativeAreaLevel1: 'administrative_area_level_1',
  administrativeAreaLevel2: 'administrative_area_level_2',
  administrativeAreaLevel3: 'administrative_area_level_3',
  postalCode: 'postal_code',
  streetNumber: 'street_number',
  sublocalityLevel1: 'sublocality_level_1',
  sublocalityLevel2: 'sublocality_level_2'
};

export const defaultForm = {
  locality: 'long_name',
  [apiParams.administrativeAreaLevel1]: 'long_name',
  [apiParams.administrativeAreaLevel2]: 'long_name',
  [apiParams.administrativeAreaLevel3]: 'long_name',
  country: 'long_name',
  [apiParams.postalCode]: 'short_name',
  political: 'short_name'
};

export const streetAddressForm = {
  [apiParams.streetNumber]: 'short_name',
  premise: 'short_name',
  route: 'short_name',
  political: 'short_name',
  sublocality: 'short_name',
  [apiParams.sublocalityLevel1]: 'long_name',
  [apiParams.sublocalityLevel2]: 'long_name'
};


export const transformAdress = (place)=>{
    let finalAddress = {
        address: ''
      };
      let addressText = '';
      const addressComponents = place.address_components;
      for (let addressComponent of addressComponents) {
        for (let addressType of addressComponent.types) {
          let val;
          if (defaultForm[addressType]) {
            val = addressComponent[defaultForm[addressType]];
            finalAddress[addressType] = val;
          } else if (streetAddressForm[addressType]) {
            val = addressComponent[streetAddressForm[addressType]];
            addressText = `${isEmptyStr(addressText)? `${addressText}, `: ''}${val}`;
            finalAddress.address = addressText;
            finalAddress[addressType] = val;
          }
        }
      }
      finalAddress.address = 
        isEmpty(place.formatted_address)?
        finalAddress.address:
        place.formatted_address
      ;

      return finalAddress
}