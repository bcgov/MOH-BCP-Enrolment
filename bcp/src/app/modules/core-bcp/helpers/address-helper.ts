import { Address, GeoAddressResult } from 'moh-common-lib-angular';

// The library dropped the ready-made common-geocoder-input component; common-street
// with [useGeoCoder]="true" is the replacement, but it emits a GeoAddressResult
// instead of an Address. Every (select) handler that used to receive an Address
// from the geocoder converts through here so downstream consumers see the same shape.
export const geoResultToAddress = (result: GeoAddressResult): Address => {
  const address = new Address();
  address.street = result.street;
  address.city = result.city;
  address.province = result.province;
  address.country = result.country;
  return address;
};

export const getFullAddressText = (address: Address): string => {
  let str = '';
  if (!address) {
    return null;
  }
  if (address.addressLine1) {
    str += address.addressLine1 + ' ';
  }
  if (address.addressLine2) {
    str += address.addressLine2 + ' ';
  }
  if (address.addressLine3) {
    str += address.addressLine3 + ' ';
  }
  str = str.trim();
  return str;
}
