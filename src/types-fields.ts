import { Field, AdvancedRequirement, UndefinedIfNotRequired, missingDataReturn, PostfixLocalize, BasicRequirement, postfixLocalizeName } from './base-field';
import { InnerFieldSet, innerFieldSetQuery, fieldsFromDefinition, extractFromInnerFieldSets } from './base-fieldset';

// BASIC FIELDS

export const raw = (innerQuery?: string) => {
    const innerQueryActual = innerQuery !== undefined
                                ? `{ ${innerQuery} }`
                                : '';


    const field: Field<any> = {
        kind: 'Field',
        settings: {},
        query: ({ localizedName }) => `${localizedName}${innerQueryActual}`,
        extract: async ({ data }) => data,
    }

    return field as any;
}

type TText = string;
export const text = <RO extends AdvancedRequirement<TText>>(
    requirement?: RO,
    postfixLocalize?: PostfixLocalize,
) => {
    // Actual object we return
    const field: Field<TText> = {
        kind: 'Field',
        settings: { postfixLocalize },
        extract: async ({ name, data }) => {
            if (data === undefined || 
                data === null ||
                (typeof data === 'string' && data.length <= 0)) {
                    return missingDataReturn(name, requirement);
            }
            
            return data;
        },
    }

    // Object we tell the type system we return
    return field as any as TText | UndefinedIfNotRequired<TText, RO>;
}

type TNumeric = number;
export const numeric = <RO extends AdvancedRequirement<TNumeric>>(
    requirement?: RO,
    postfixLocalize?: PostfixLocalize,
) => {
    const field: Field<TNumeric> = {
        kind: 'Field',
        settings: { postfixLocalize },
        extract: async ({ name, data }) => {
            // Will return NaN if argument is not string (or string invalid)
            const result = Number.parseFloat(data as string);

            if (Number.isNaN(result)) {
                // We assume NaN means missing value
                return missingDataReturn(name, requirement);
            }

            return result;
        }
    }

    return field as any as TNumeric | UndefinedIfNotRequired<TNumeric, RO>;
}


// MATRIX

export const defineMatrixBlock = <MB extends { typeHandle: string, }>( 
    definition: MB 
) => {
    const { typeHandle } = definition;

    const result: InnerFieldSet = {
        kind: 'InnerFieldSet',
        fields: fieldsFromDefinition(definition),
        handlePair: {
            term: 'typeHandle',
            handle: typeHandle,
        },
        postfixOnExpr: 'BlockType',
    };

    return result as any as MB;
}

export const matrix = <
    MDBS extends {}[],
    BR extends BasicRequirement,
>(
    definitions: MDBS,
    requirement?: BR, // TODO
    postfixLocalize?: PostfixLocalize,
) => {
    const blocks = definitions as any as InnerFieldSet[];
    blocks.forEach(mb => {
        if (mb.postfixOnExpr !== 'BlockType') {
            throw new Error(`Defintion was not a MatrixBlock (${mb.postfixOnExpr})`)
        }
    })

    const field: Field<MDBS> = {
        kind: 'Field',
        settings: { postfixLocalize },
        query: ({ localizedName, language }) => {

            const innerQuery = blocks.reduce((prev, matrixFieldSet) => (
                `${prev}
                ${innerFieldSetQuery(matrixFieldSet, localizedName, language)}`
            ), '');
            return `${localizedName} {${innerQuery}}`;
        },
        extract: async ({ name, data, language }) => {
            const result = await extractFromInnerFieldSets(
                blocks, 'multiple', data as any, language
            );
            if (result.length <= 0) {
                return missingDataReturn(name, requirement);
            }

            return result;
        }
    }

    return field as any as MDBS | UndefinedIfNotRequired<MDBS, BR>;
}

// Basic types field types. 
// Add: Alternative: Dropdown, Radio Buttons
// Lightswitch, Redactor
// Asssets / SingleAsset: File, Video, Image
// Matrix, Table
// raw (return unknown or any unless you modify it)

// used if you know something should be an object
// export const object, record, row, 
// or not…?

// used if you know something should be an array
// export const array, list, collection, items, vector, tuple, set
// or n

// export const text: FieldType<string> = {
//     extract: ({ serverData, name }) => {
//         if (serverData === undefined || serverData === null) {
//             throw new Error(FIELD_DATA_MISSING)
//         }
//         else if (typeof serverData === 'string') {
//             if (serverData.length > 0) {
//                 return serverData;
//             }
            
//             throw new Error(FIELD_DATA_MISSING);
//         }
        
//         throw new Error(`${name} was not string`);
//     },
// }

// export const float: FieldType<number> = {
//     extract: ({ serverData, name }) => {
//         const str = text.extract({ serverData, name });
//         const result = Number.parseFloat(str);
//         if (Number.isNaN(result)) {
//             throw new Error(`${name} was NaN`);
//         }

//         return result;
//     },
// }

// export const int: FieldType<number> = {
//     extract: ({ serverData, name }) => {
//         const str =  text.extract({ serverData, name });
//         const result = Number.parseInt(str);
//         if (Number.isNaN(result)) {
//             throw new Error(`${name} was NaN`);
//         }

//         return result;
//     },
// }