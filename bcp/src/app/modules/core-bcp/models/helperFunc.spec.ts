import {setNotApplicable, formatDateForDisplay, convertToJSONDate, stripPhoneFormatting, stripPostalCodeSpaces} from './helperFunc';

describe('setNotApplicable', () => {
    it('should return value when value passed is defined', () => {
        expect(setNotApplicable('test')).toEqual('test');
    });

    it('should return N/A for undefined value', () => {
        expect(setNotApplicable(undefined)).toEqual('N/A');
        expect(setNotApplicable(null)).toEqual('N/A');
        expect(setNotApplicable('')).toEqual('N/A');
    });
});


describe('formatDateForDisplay', () => {
    it('should return date in readable format', () => {
        expect(formatDateForDisplay(new Date('January 1, 2019'))).toEqual('January 01, 2019');
        expect(formatDateForDisplay(new Date('January 10, 2019'))).toEqual('January 10, 2019');
        expect(formatDateForDisplay(new Date('December 1, 2019'))).toEqual('December 01, 2019');
        expect(formatDateForDisplay(new Date('February 29, 2020'))).toEqual('February 29, 2020');
    });

    it('should return null when value is undefined', () => {
        expect(formatDateForDisplay(undefined)).toEqual(null);
        expect(formatDateForDisplay(null)).toEqual(null);
    });
});

describe('convertToJSONDate', () => {
    it('should return date in readable format', () => {
        expect(convertToJSONDate(new Date('January 1, 2019'))).toEqual('2019-01-01');
        expect(convertToJSONDate(new Date('December 1, 2019'))).toEqual('2019-12-01');
    });

    it('should return null when value is undefined', () => {
        expect(convertToJSONDate(undefined)).toEqual(null);
        expect(convertToJSONDate(null)).toEqual(null);
    });
});


describe('stripPhoneFormatting', () => {
    it('should strip phone formatting', () => {
        expect(stripPhoneFormatting('1234567890')).toEqual('1234567890');
        expect(stripPhoneFormatting('(123) 456-7890')).toEqual('1234567890');
        // Doesn't work for "(123)-456-789", "(123) 456 - 789", or "( 123 ) 456 - 789".
    });

    it('should return null when phone number is undefined', () => {
        expect(stripPhoneFormatting(undefined)).toEqual(null);
        expect(stripPhoneFormatting(null)).toEqual(null);
    });
});

describe('stripPostalCodeSpaces', () => {
    it('should strip postal code space formatting', () => {
        expect(stripPostalCodeSpaces('A1A 1A1')).toEqual('A1A1A1');
    });

    it('should return null when postal code is undefined', () => {
        expect(stripPostalCodeSpaces(undefined)).toEqual(null);
        expect(stripPostalCodeSpaces(null)).toEqual(null);
    });
});
