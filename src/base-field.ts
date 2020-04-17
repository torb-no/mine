// BASE FOR FIELD

import { NamedField } from './base-fieldset';

// Field functions (text, float, etc…) will lie about their
// return type to help the type system,
// but what they _actually_ return is a FieldType object
// that also contains a TypeDefinition object
// that contains a Field
export type Field<T> = {
    kind: 'Field',
    settings: FieldSettings,
    query?: ({ localizedName, language }: {
        // Name of this field (localization will)
        // automatically be included
        localizedName: string,
        // Tells field of current language
        // (only used in matrix, etc…) as
        // the name itself is already 
        language?: string        
    }) => string,
    
    // Extract
    // Using promise since we might
    // want to implement time shifted features at some point
    extract: ({ name, data, language }: {
        name: string,
        data: unknown,
        language: string | undefined,
    }) => Promise<T>,
}

export type FieldSettings = {
    postfixLocalize?: PostfixLocalize,
};

// REQUIREMENT SETTINGS

export type BasicRequirement =
    | undefined | 'optional'
    | 'required';

export type AdvancedRequirement<T> =
    | BasicRequirement | { ifMissing: T, };

export const missingDataReturn = (
    name: string,
    requirement: BasicRequirement | AdvancedRequirement<any>
) => {
    if (requirement === undefined || requirement === 'optional') {
        return undefined;
    }
    else if (requirement === 'required') {
        return Promise.reject(new Error(`Required field ${name} missing data`));
    }
    else {
        return requirement.ifMissing;
    }
}

// // Used to lie to the type system to make
// // things easier to work with for the users
// // of this library
export type UndefinedIfNotRequired<
    T,
    RO extends BasicRequirement | AdvancedRequirement<any>
> = RO extends 'required' | { ifMissing: T } ? T : undefined;



// POSTFIXLOCALIZE

export type PostfixLocalize = 'postfixLocalize' | undefined;

export const postfixLocalizeName = (
    namedField: NamedField,
    language: string | undefined,
) => {
    const { name, field: { settings } } = namedField;

    if (settings.postfixLocalize === 'postfixLocalize') {
        if (language !== undefined) {
            return name + '_' + language;
        }
        else {
            throw new Error(`${name} language missing for postfixLocalized field. Remember to set language`);
        }
    }

    return name;
}







// export type Multiple = undefined | 'multiple';
// export type FieldReturnWithMultiple<
//     T,
//     M extends Multiple,
// > = M extends 'multiple' ? T[] : T;




// export const ReturnWhenMissing = <T>(
//     requirement: Requirement<T>
// ) => {
//     if (requirement === 'required') {
//         return 
//     }
//     else if (typeof requirement === 'object' &&
//              requirement.ifMissing !== undefined) {

//     }
// }

//  // Defines an object etract data from server resonses
//  // Used when defining fields in fieldsets
//  // Can optionally provide custom generation of
//  // GraphQL query expression
//  export interface FieldType<T> {
//     // Generate GraphQL expression.
//     // If not provided a the name itself will
//     // simple be used (including localization)
//     query?: (
//         // Name of this field (localization will)
//         // automatically be included
//         name: string,
//         // Used if subfields needs language support (such as Matrix)
//         // Do NOT use to localize THIS field at this level as that
//         // is automatically handled by the surrounding system
//         language?: string
//     ) => string;

//     // Extract and intepret from server data
//     // Throw error when something goes wrong
//     extract: ({ serverData, name }: {
//         serverData: unknown,
//         name: string,
//         language?: string,
//     }) => T,
// }


// // Runtime settings for fields
// export interface FieldSettings {
//     required: boolean,
//     postfixLocalize: boolean,
// }
// export const required = true;
// export const postfixLocalize = true;


// // Type of field alongside settings
// export interface FieldInstance<T> {
//     type: FieldType<T>,
//     settings: FieldSettings,
// }

// // Also including name
// export interface NamedFieldInstance<T> extends FieldInstance<T> {
//     name: string,
// }

// // Used to fail specific promises when data is missing
// // This is useful when a field is set to be optional
// export const FIELD_DATA_MISSING = '__FIELD_DATA_MISSING__';


// // Lie about types here as well?


// // TODO: maybe have field be honest
// // and deconstruct stuff?



// export type UndefinedIfOptional<
//     RO extends RequirementOptions<any>
// > = RO extends undefined 
//     ? undefined : (
//         RO extends 'optional'
//         ? undefined
//         : T
//     )

// export type FieldReturn<T, RO> = RO extends Requirement<any> ? (
//     RO extends undefined 
//         ? undefined 
//         : (RO extends 'optional' 
//             ? undefined 
//             : T
//         )
// ) : never;
// export type FieldReturn<
//     T, RO extends Requirement<any>
// > = RO extends undefined | 'optional' ? T : T;



// RO> = RO extends 'required' 

// // export type TypeOfField<F> = F extends FieldType<infer T> ? T : never;
// // export const field = <
// //     FIELDTYPE extends FieldType<any>,
// //     REQOPT extends 'optional' | 'required' | { ifMissing: TypeOfField<FIELDTYPE>, },
// //     POLOC extends 'postfixLocalize',
// // >(
// //     type: FIELDTYPE,
// //     requiredOptional?: REQOPT,
// //     postfixLocalize?: POLOC,
// // ) => {
// //     // Set UNDEF_IF_OPT to undefined is optional parameter is passed
// //     // such that the field correctly returns field as
// //     // optional if it is set to such
// //     type UNDEF_IF_OPT = 
// //         REQOPT extends 'required' | { ifMissing: TypeOfField<FIELDTYPE> } 
// //         ? TypeOfField<FIELDTYPE> 
// //         : undefined;


// //     type RETRUN_TYPE = TypeOfField<FIELDTYPE> | UNDEF_IF_OPT;
    
// //     // Actual object we return
// //     // When consuming object that uses field
// //     // (FieldSets, i.e. sections, global sets, etc…)
// //     // This will be converted into to actual
// //     // type value by the time the objects are used normally
// //     const actualReturn: FieldInstance<RETRUN_TYPE> ={
// //         type,
// //         settings: {
// //             postfixLocalize:
// //                 postfixLocalize === 'postfixLocalize',
// //             required: 
// //                 requiredOptional === 'required' || 
// //                 typeof requiredOptional == 'object' // { ifMissing: ... }
// //         }
// //     };

// //     // We lie about the return type to make
// //     // the typeside for user easier
// //     // Remember to use (as FieldInstance) when using internally
// //     return actualReturn as RETRUN_TYPE;
// // }

// // Show result of field instances OR string (assumes string is handle)
// // export type TypeOfFieldInstance<FiInsOrHndStr> = 
// //     FiInsOrHndStr extends FieldInstance<infer T> ? T : (
// //         FiInsOrHndStr extends string ? FiInsOrHndStr : never
// //     );

