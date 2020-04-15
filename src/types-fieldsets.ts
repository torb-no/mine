import { FieldSet, fieldsFromDefinition,} from "./base-fieldset";


// SECTIONS

export const defineSectionEntry = <SED extends {
    sectionHandle: string,
    typeHandle: string,
}>( definition: SED ) => {
    const { typeHandle, sectionHandle } = definition;
    
    const result: FieldSet = {
        kind: 'FieldSet',
        inner: {
            kind: 'InnerFieldSet',
            fields: fieldsFromDefinition(definition),
            handlePair: {
                term: 'typeHandle',
                handle: typeHandle,
            },
            postfixOnExpr: 'Entry',
        },
        outer: {
            kind: 'OuterFieldSet',
            rootTerm: 'entries',
            filter: {
                section: sectionHandle,
            },
            handlePair: {
                term: 'sectionHandle',
                handle: sectionHandle,
            },
        },
    };

    // Lie about result to make flow of types easier
    return result as any as SED;
};

export const defineGlobalSet = <GS extends {
    handle: string,
}>( definition: GS ) => {
    const { handle } = definition;

    const result: FieldSet = {
        kind: 'FieldSet',
        inner: {
            kind: 'InnerFieldSet',
            fields: fieldsFromDefinition(definition),
            postfixOnExpr: 'GlobalSet',
        },
        outer: {
            kind: 'OuterFieldSet',
            rootTerm: 'globalSets',
            filter: { handle },
            handlePair: {
                term: 'handle',
                handle,
            }
        },
    };

    return result as any as GS;
}