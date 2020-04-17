import { text, numeric } from './types-fields';
import { fieldsQuery, InnerFieldSet, innerFieldSetQuery, getFieldSetCollection, FieldSet, OuterFieldSet, FieldSetCollection, fieldSetCollectionQuery, fieldsFromDefinition } from './base-fieldset';


const outerHandle = 'testHandleOuter' as const;

const defWithoutLanguage = {
    outerHandle,
    innerHandle: 'withoutLanguage',
    temperature: numeric('required'),
    code: text(),
};
const defWithoutLanguageFields = fieldsFromDefinition(defWithoutLanguage as any);

const defWithLanguage = {
    outerHandle,
    innerHandle: 'withLanguage',
    temperature: numeric('required'),
    code: text(),
    title: text('optional', 'postfixLocalize'),
};
const defWithLanguageFields = fieldsFromDefinition(defWithLanguage as any);

const innerWithoutLang: InnerFieldSet = {
    kind: 'InnerFieldSet',
    fields: defWithoutLanguageFields,
    handlePair: {
        term: 'innerHandle',
        handle: 'withoutLanguage',
    },
    postfixOnExpr: 'Entry',
};

const innerWithLang: InnerFieldSet = {
    kind: 'InnerFieldSet',
    fields: defWithLanguageFields,
    handlePair: {
        term: 'innerHandle',
        handle: 'withLanguage',
    },
    postfixOnExpr: 'Entry',
};

const outer: OuterFieldSet = {
    kind: 'OuterFieldSet',
    filter: {},
    rootTerm: 'topOfTheBlock',
    handlePair: {
        term: 'section',
        handle: 'defsMightHaveLang',
    },
}



describe('fieldsQuery',() => {
    test('def without language', () => {
        const r = fieldsQuery(defWithoutLanguageFields, undefined);
        expect(r).toMatch(/outerHandle\s+innerHandle\s+temperature\s+code/);
    });

    test('def with language (valid)', () => {
        const r = fieldsQuery(defWithLanguageFields, 'en');
        expect(r).toMatch(/outerHandle\s+innerHandle\s+temperature\s+code\s+title_en/);
    });

    test('def missing language', () => {
        expect(() => {
            fieldsQuery(defWithLanguageFields, undefined);
        }).toThrow();
    });
});

test('innerFieldSetQuery', () => {
    const r = innerFieldSetQuery(innerWithoutLang, undefined, undefined);
    expect(r).toMatch(/\.\.\.on withoutLanguage_Entry {\s+outerHandle\s+innerHandle\s+temperature\s+code\s+}/);
});

describe('FieldSetCollection', () => {
    test('getFieldSetCollection (invalids)', () => {
        expect(() => {
            getFieldSetCollection('', [], 'single')
        }).toThrow('fieldSets was empty array');
    });

    const fieldSets: FieldSet[] = [
        { 
            kind: 'FieldSet',
            inner: innerWithoutLang, 
            outer 
        }, { 
            kind: 'FieldSet',
            inner: innerWithLang,
            outer,
        }
    ];

    const fieldSetCollection: FieldSetCollection = {
        kind: 'FieldSetCollection',
        name: 'possiblyWithLang',
        plurality: 'multiple',
        inners: [innerWithoutLang, innerWithLang],
        outer,
    };

    describe('getFieldSetCollection (valid)', () => {
        

        test('multiple', () => {
            const r = getFieldSetCollection('possiblyWithLang', fieldSets, 'multiple');
            expect(r).toStrictEqual(fieldSetCollection);
        });
    });

    describe('fieldSetCollectionQuery (single)', () => {
        const name = 'singleWithoutLang';

        const singleFieldSetWithoutLanguage: FieldSet = {
            kind: 'FieldSet',
            inner: innerWithoutLang, outer,
        }
        
        const singleFieldSetWithoutLanguageCollection: FieldSetCollection = {
            kind: 'FieldSetCollection',
            plurality: 'multiple',
            name,
            inners: [innerWithoutLang],
            outer,
        };

        test('getFields', () => {    
            const r = getFieldSetCollection(name, [singleFieldSetWithoutLanguage], 'multiple');
            expect(r).toStrictEqual(singleFieldSetWithoutLanguageCollection);
        });

        test('query', () => {
            const fsc = getFieldSetCollection(name, [singleFieldSetWithoutLanguage],'multiple');
            const r = fieldSetCollectionQuery(fsc, undefined);
            expect(r).toMatch(/topOfTheBlock\s+{\s+\.\.\.on defsMightHaveLang_withoutLanguage_Entry {\s+outerHandle\s+innerHandle\s+temperature\s+code\s+}\s+}/)
        })
    });
});

// describe('getFieldSetInstance', () => {
//     const defInstance = new TestDefinition();

//     // TODO MAKE IT USE THE SAME INSTANCE 
//     // (but modify after) and test this!
    
//     const fieldSetInstance = getFieldSetInstance(defInstance) as FieldSetInstance;
//     test('valid instance', () => {
//         const { handle, handleTerm, fields } = fieldSetInstance;

//         expect(handle).toBe('testHandle');
//         expect(handleTerm).toBe('handle');

//         const title = fields.find(f => f.name === 'title');
//         expect(title).toBeTruthy();
//         expect(title?.settings.required).toBe(true);
//         expect(title?.type).toBe(text);

//         const description = fields.find(f => f.name === 'description');
//         expect(description).toBeTruthy();
//         expect(description!.settings.required).toBe(false);
//         expect(description!.type).toBe(text);
//     });

//     test('no handle pair', () => {
//         const noPair = {
//             ...defInstance,
//             handle: undefined,
//         };
//         const err = getFieldSetInstance(noPair) as Error;
//         expect(err).toBeInstanceOf(Error);
//         expect(err.message).toMatch('fieldSet did not contain any handleTerm/handle pairs');
//     });
// });