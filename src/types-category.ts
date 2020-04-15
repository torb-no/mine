import { FieldSet, fieldsFromDefinition, innerFieldSetQuery } from './base-fieldset';
import { Field, BasicRequirement, PostfixLocalize } from './base-field';

export const defineCategory = <
    CD extends { groupHandle: string, },
>( definition: CD ) => {
    const { groupHandle } = definition;

    const result: FieldSet = {
        kind: 'FieldSet',
        inner: {
            kind: 'InnerFieldSet',
            fields: fieldsFromDefinition(definition),
            postfixOnExpr: 'Category',
        },
        outer: {
            kind: 'OuterFieldSet',
            rootTerm: 'categories',
            filter: {
                group: groupHandle,
            },
            handlePair: {
                term: 'groupHandle',
                handle: groupHandle,
            }
        }
    }

    return result as unknown as CD;
}

// Field function
export const category = <
    CDS extends {}[],
    BR extends BasicRequirement,
>(
    definitions: CDS,
    requirement?: BR,
    postfixLocalize?: PostfixLocalize,
) => {
    const categoryGroups = definitions as any as FieldSet[];

    // Confirm that we actually got a group
    categoryGroups.forEach(cg => {
        if (cg.outer.rootTerm !== 'categories') {
            throw new Error('Definition was not category');
        }
    });

    const result: Field<CDS> = {
        kind: 'Field',
        settings: { postfixLocalize },
        query: ({ localizedName, language }) => {
            const innerQuery = categoryGroups.reduce((prev, cg) => {
                const { inner } = cg;
                return `${prev}
                ${innerFieldSetQuery(inner, localizedName, language)}`
            }, '');
            return `${localizedName} {${innerQuery}}`;
        },
        extract: async () => {
            return [{}] as CDS;
        },
    };

    // Lie about the return value to help type system
    return result as any as CDS[];
}

// const cat = defineCategory({
//     typeHandle: 'infoStation' as const,
//     uid: uid(),
//     title: text('required'),
//     intro: text('required'),
// });

// const f = category(cat);

// import { FieldSetDefinition, FieldSetCollectionDefinition, getDataFromFieldSetCollection } from './base-fieldset';
// import { FieldType, field } from './base-field';
// import { text } from './types-fields';

// export interface CategoryDefinition extends FieldSetDefinition {

// }

// // const categoryDefault = {
// //     title: field(text, 'required'),
// //     uid: field()
// // }

// export const defineCategory = <C extends CategoryDefinition>(
//     definition: C,
// ): [FieldType<C>, FieldSetCollectionDefinition<C>] => {

//     const categoryType: FieldType<C> = {
//         extract: async () => ({}) as C,
//     }
    
//     const categoryFieldSetCollectionType: FieldSetCollectionDefinition<C> = {
        
//     } as FieldSetCollectionDefinition<C>;

//     return [categoryType, categoryFieldSetCollectionType];
// }

// // const setupCategorySet = <>

// const [categoryType, categorySet] = defineCategory({
//     title: field(text, 'required'),
//     uid: field(text, 'required'),
// });

// export const example = {
//     category: field(categoryType, 'required'),
// }

// // const b = getDataFromFieldSetCollection(categorySet)


// // const categorySet