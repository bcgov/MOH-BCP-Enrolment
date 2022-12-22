import { Address } from 'moh-common-lib';

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
};
