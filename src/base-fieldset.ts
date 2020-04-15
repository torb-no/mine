import { Field, postfixLocalizeName } from './base-field';
import { text } from './types-fields';
import { validateKind } from './helpers';

// BASIC TYPES FOR FIELDSET

// Normal FieldSet that includes both
// inner and outer and can be a part of a 
// request package
export type FieldSet = {
    kind: 'FieldSet',
    inner: InnerFieldSet,
    outer: OuterFieldSet,
}

// Outer FieldSet always used togheter
// with InnerFieldSet using FieldSet type
// It defines the outer part of a FieldSet
export type OuterFieldSet = {
    kind: 'OuterFieldSet',
    filter: {
        [argName: string]: string,
    },
    rootTerm: string,
    handlePair: HandlePair,
}

export type HandlePair = {
    term: string,
    handle: string,
}



// FIELD SET COLLECTION AND HELPER FUNCTION

export type FieldSetCollection = {
    kind: 'FieldSetCollection',
    name: string,
    plurality: 'single' | 'multiple',
    outer: OuterFieldSet,
    inners: InnerFieldSet[],
};

export const getFieldSetCollection = (
    name: string,
    fieldSets: FieldSet[],
    plurality: 'single' | 'multiple',
): FieldSetCollection => {
    if (fieldSets.length === 0) {
        throw new Error(`fieldSets was empty array`)
    }
    fieldSets.every(fs => validateKind(fs, 'FieldSet'));
    
    const { outer } = fieldSets[0];
    const inners = fieldSets.map(fs => fs.inner);
    inners.every(ifs => validateKind(ifs, 'InnerFieldSet'));

    return {
        kind: 'FieldSetCollection',
        name, outer, inners, plurality,
    };
}

const filterExpr = (
    filterArguments?: { 
        [argName: string]: string | undefined
    },
) => {
    if (typeof filterArguments !== 'object') { return '' };
    const argList = Object.entries(filterArguments)
                    .filter(e => e[1] !== undefined);
    if (argList.length < 1) { return '' };

    const expr = argList.reduce(
        (prev, curr) => `${prev}${curr[0]}: "${curr[1]}", `, '');
    return `(${expr})`;
};

export const fieldSetCollectionQuery = (
    fieldSetCollection: FieldSetCollection,
    language: string | undefined,
) => {
    const { name, inners, outer } = fieldSetCollection;
    const { rootTerm, filter } = outer;

    const alias = name;

    const filterQuery = filterExpr(filter);
    
    const innersQuery = inners.reduce((prev, inner) => `${prev}
    ${innerFieldSetQuery(inner, outer.handlePair.handle, language)}`, '');


    return `${alias}: ${rootTerm}${filterQuery} {${innersQuery}
}`
}



// NAMED FIELDS

export type NamedField = {
    name: string,
    field: Field<any>,
};

export const fieldsFromDefinition = <D extends {
    [name: string]: Field<any> | string,
}>( 
    definition: D 
): NamedField[] => Object.entries(definition)
                    .map(([name, field]) => {
                        if (typeof field === 'string') {
                            // Convert hard coded terms into required text fields
                            return { 
                                name, 
                                field: 
                                    text('required') as any as Field<any>, 
                            }
                        } else {
                            return { name, field }
                        }
                    });


export const fieldsQuery = (
    fields: NamedField[],
    language: string | undefined,
) => {
    if (!Array.isArray(fields)) {
        throw new Error('fields was not array');
    }

    return fields.reduce((prev, namedField) => {
        const localizedName = postfixLocalizeName(namedField, language);
        const { field: { query } } = namedField;
    
        const next = query 
                        ? query({ localizedName, language }) 
                        : localizedName;
        return `${prev}
        ${next}`;
    }, '');
}



// INNER FIELD SET

// Inner FieldSet that can be used on it's own
// typically as part of things like matrices, tables, etc…
// or used togheter with Outer (using the FieldSet type)    
// for SectionEntryBlocks
export type InnerFieldSet = {
    kind: 'InnerFieldSet',
    fields: NamedField[],

    handlePair?: HandlePair,

    // The end of the ...on expression
    // Can also sometimes be used alone
    // as the sole content of ...on expression
    postfixOnExpr: string;
}

export const innerFieldSetQuery = (
    innerFieldSet: InnerFieldSet,
    outerHandle: string | undefined,
    language: string | undefined,
) => {
    validateKind(innerFieldSet, 'InnerFieldSet');

    const start = outerHandle !== undefined
                    ? `${outerHandle}_` : '';
    const mid = innerFieldSet.handlePair !== undefined
                    ? `${innerFieldSet.handlePair.handle}_`
                    : '';
    const end = innerFieldSet.postfixOnExpr;
    
    const fieldsExpr = fieldsQuery(innerFieldSet.fields, language);

    return `...on ${start}${mid}${end} {${fieldsExpr}
    }`;
}


// export const fieldSetQuery = (
//     fieldSet
// ) => {

// }
// export const fieldsAndHandlesFrom = <D extends {}>(
//     definition: D,
// ) => {
//     const entries = Object.entries(definition);

//     const fields = entries
//                     .filter(([,e])=> typeof e === 'object')
//                     .map(([name, field]) => ({ name, field }) as NamedField);
    
//     const handles = Object.fromEntries(entries
//                         .filter(([,e]) => typeof e === 'string')) as {
//                             [handleTerm: string]: string,
//                         };

//     return { fields, handles };
// }


// Field function that can be use by
// things like matrix, category, table, asset, etc…
// export const innerFieldSetsField = (

// ) => {

// }

// export type DefinitionWithFieldSet = {
//     fieldSet: {

//     },
// }

// export interface FieldSetCollectionDefinition<RFSD extends FieldSetDefinition> {
//     query: ({ language }: {
//         language?: string,
//     }) => string | Error,
//     extract: ({}: {

//     }) => RFSD[],
// }

// interface Todo {
//     title: string;
//     description: string;
//     completed: boolean;
// }

// type TodoPreview = Omit<Todo, 'description'>;

// const todo: TodoPreview = {
//     title: 'Clean room',
//     completed: false,
//     description: 'fasdasd'
// };


// What the user sees
// Never ever use this directly!!!
// Should be extened
// export interface FieldSetDefinition {
//     [fieldName: string]: any;

//     // Extend with:
//     // handle/typeHande: string as const, etc…
// }

// This is what FieldSetDefintions _really_
// look like before transformed for use
// and what we will work with internally in
// base

// idea: FieldSet will be the same type in user side
// while FieldSetDefinition and FieldSetInstancce will be used other places
// Maybe FieldSetResult as well?
// use variables and object key names to differentiate

// Object that tells Mine how to generate GraphQL queries
// and extract data from server





// export type FieldSetDefinitionActual = {
//     _
// }
// export type FieldSetDefinition<F extends {readonly [fieldName: string]: any}> = {
//     fields: F,
// }


// export type FieldSetInstance<T> = {
//     // List of field instances
//     fields: NamedFieldInstance<T>[],

//     // The specific term for for handle for this FieldSet 
//     // (i.e. typeHandle, handle, groupHandle, etc…)
//     handleTerm: string,

//     // The actual specific handle string
//     // that the handleTerm will point to
//     // Basically the canonical name of this type
//     handle: string,
// }

// export type TypeFromFieldSetInstance<F> = F extends FieldSetInstance<infer T> ? T : never; 

// export type FieldDefinitionType
// export type FieldSetDefinitionType<FSD> = {
//     readonly [K in keyof FSD]: TypeOfFieldInstance<FSD[K]>
// }

// export const getFieldSetInstance = <T>(
//     fieldDefinition: T,
// ) => {
//     const entries = Object.entries(fieldDefinition);

//     const handlePair = entries.find(
//         ([, maybeHandle]) => typeof maybeHandle === 'string') as [string, string] | undefined;

//     if (handlePair) {
//         const [handleTerm, handle] = handlePair;
//         const fields = (entries
//             .filter(f => typeof f[1] !=='string') as [string, FieldInstance<any>][])
//             .map(([name, fieldInstance]) => ({
//                 ...fieldInstance,
//                 name,
//             }));

//         if (fields.length < 1) {
//             throw new Error('no fields in field instance');
//         }

//         const result: FieldSetInstance<T> = {
//             handleTerm, handle, fields,
//         };

//         return result;
//     } else {
//         throw new Error('fieldSet did not contain any handleTerm/handle pairs');
//     }
// }

// export const fakeGetFieldSetData = <FSC extends FieldSetCollectionDefinition<any>>(
//     fieldSetCollection: FSC,
// ) => {
//     fieldSetCollection.query
// }

// export const getMultipleFieldSetInstances = (
//     fieldDefinitions: FieldSetDefinition[],
// ) => {
//     const results = fieldDefinitions.map(getFieldSetInstance);

//     const errors = results.filter(e => e instanceof Error);
//     if (errors.length > 0) {
//         const err = new Error(`Error in ${errors.length} fieldSetDefinitions`);
//         console.error(err);
//         return [];
//     }

//     return results as FieldSetInstance[];
// }


// Define handleTerm in FieldSetCollectionType?

// Defines a kind of FieldSet such as
// section, globalSet, matrix, table, etc…
// export type TypeFromFieldSetDefinition<FSD> = FSD extends FieldSetDefinition

// export type InferArrayType<A> = A extends (infer T)[] ? T : never;

// export const getDataFromFieldSetCollection = <FSD extends FieldSetDefinition[]>(
//     FieldSetCollectionType: FieldSetCollectionDefinition<FSD>
// ): FSD[] => {
//     return [];
// }

// export interface FieldSetCollectionDefinition<RFSD extends FieldSetDefinition> {
//     query: ({ language }: {
//         language?: string,
//     }) => string | Error,
//     extract: ({}: {

//     }) => RFSD[],
// }

// export type TypeFromCollection<FSCT> = FSCT extends FieldSetCollectionDefinition<infer FSD> ? FSD : never; 



// export const getFromServer = async <FS extends FieldSetDefinition>(
//     type: FieldSetCollectionType,
//     fieldSets: FS[],
// ): Promise<FS[]> => {

//     return [];
// }


// }

// export const dataFromFieldSet = async <D extends FieldSetDefinition>({ fieldSetDefinition, serverData, language }: {
//     fieldSetDefinition: FieldSetDefinition,
//     serverData: any,
//     language?: string,
// }): Promise<D> => {

//     // const fields = fieldList(fieldSetDefinition);

//     // const fieldResults = Promise.all(
//     //     fields.map(async ({ name, type, settings }) => {
//     //         const result = await type.extract({
//     //             serverData: serverData[postfixLocalizeName(name, settings, language)],
//     //             name,
//     //             language,
//     //         }).catch(err => {
//     //             if (err === FIELD_DATA_MISSING && settings.required !== true) {
//     //                 return undefined;
//     //             }
//     //             else {
//     //                 throw err;
//     //             }
//     //         });

//     //         return result;
//     //     })
//     // );

//     // fieldResults[0]
// }