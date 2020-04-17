import { postfixLocalizeName, Field, } from './base-field';
import { NamedField } from './base-fieldset';
import { text } from './types-fields';

describe('postfixLocalizeName', () => {
    const name = 'john';

    test('no localization', () => {
        const field: NamedField = {
            name,
            field: text('required') as any as Field<any>,
        }
        const r = postfixLocalizeName(field, undefined);
        expect(r).toBe(name);
    });

    const fieldWithLocalization: NamedField = {
        name,
        field: text('required', 'postfixLocalize') as any as Field<any>,
    }

    test('localization en', () => {
        const r = postfixLocalizeName(fieldWithLocalization, 'en');
        expect(r).toBe(name + '_en');
    });

    test('missing language', () => {
        expect(() => {
            postfixLocalizeName(fieldWithLocalization, undefined)
        }).toThrow(/language missing for postfixLocalized field\. Remember to set language/);
    })
});