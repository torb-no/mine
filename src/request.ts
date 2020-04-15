import { FieldSetCollection, FieldSet, getFieldSetCollection, fieldSetCollectionQuery } from './base-fieldset'

export type RequestCollection = FieldSetCollection[];

// stipulate ARRAY somehow
export const defineRequestCollection = <RD extends {}>(
    definition: RD,
) => {
    const defEntries = Object.entries(definition);
    const result: RequestCollection = defEntries.map(([name, fieldSetSingleOrArray]) => {
        if (Array.isArray(fieldSetSingleOrArray)) {
            const fieldSetArray = fieldSetSingleOrArray as FieldSet[];
            return getFieldSetCollection(name, fieldSetArray, 'multiple');
        }

        const singleFieldSet = fieldSetSingleOrArray as FieldSet;
        return getFieldSetCollection(name, [singleFieldSet], 'single');
    });

    return result as any as RD;
}

export const requestQuery = (
    requestCollection: RequestCollection,
    language: string | undefined,
) => {
    
    const queryInner = requestCollection.reduce((prev, fsi) => (
        `${prev}
${fieldSetCollectionQuery(fsi, language)}` ), '');

    return `{${queryInner}
}`;
}