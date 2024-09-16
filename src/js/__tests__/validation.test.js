import { validateCoordinates } from '../geolocation/validation';

describe('validateCoordinates', () => {
    test.each([
        [ '51.50851, -0.12572' ],
        [ '51.50851,-0.12572' ],
        [ '[51.50851, -0.12572]' ]
    ])('should handle coords %s correctly', (input) => {
        expect(validateCoordinates(input)).toEqual({ 
            latitude: 51.50851, 
            longitude: -0.12572 
        });
    });
});
