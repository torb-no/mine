
// throws error if invalid
export const validateKind = (
    obj: any,
    kind: string,
) => {
    // Check if object-like
    if (typeof obj !== 'object') {
        console.error(obj);
        throw new Error(`${kind} was not object`)
    }

    if (obj.kind !== kind) {
        console.error(obj);
        throw new Error(`Object was not of kind ${kind}`)
    }
}