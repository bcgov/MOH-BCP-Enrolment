// File contains functions that all modules will use
import { format } from 'date-fns';

/**
 * Helper function to display information
 * (used for optional fields to display N/A when not populated)
 */
export function setNotApplicable( str: string ): string {
  return str ? str : 'N/A';
}

// Format the date to be displayed in form January 01, 1999
export function formatDateForDisplay(inputDate): string {
  return inputDate ? format(inputDate, 'MMMM dd, yyyy') : null;
}


// Converts the date to the format required by the JSON schema
export function convertToJSONDate( dt: Date ) {
  if ( dt ) {
    return format( dt, 'yyyy-MM-dd' );
  }
  return null;
}

// Strips formatting characters from phone numbers
export function stripPhoneFormatting( str: string ) {
  if ( str ) {
    return str.replace(' ', '').replace('(', '').replace(')', '').replace('-', '');
  }
  return null;
}

// Formats a 10 digit phone number as (555) 555-5555 for display; any other value is returned unchanged
export function formatPhoneForDisplay( str: string ): string {
  const digits = str ? str.replace(/\D/g, '') : '';
  return digits.length === 10 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : str;
}

// Strips spaces from postal code
export function stripPostalCodeSpaces( str: string ) {
  if ( str ) {
    return str.replace(' ', '');
  }
  return null;
}

export function prepareDeclarationTextForAPI( str: string): string {
  let text =  str.replace(/(?:<\/li>|<ol class='no-bullets'>|<\/ol>|<em>|<\/em>)/g, ''); // remove html characters
  text =  text.replace(/<li>(i?v?i{0,3}\.)/g, '$1\t'); // add \t character between roman numeral and first word
  return text;
}

export function convertToYesNo(value: boolean): string {
  return value ? 'Yes' : 'No';
}
