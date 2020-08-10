import { FieldSetCollection, FieldSet, getFieldSetCollection, fieldSetCollectionQuery, extractFromInnerFieldSets } from './base-fieldset'

export const defineRequestCollection = <RD extends {}>(
    definition: RD,
) => {
    const defEntries = Object.entries(definition);
    const result: FieldSetCollection[] = defEntries.map(([name, fieldSetSingleOrArray]) => {
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
    requestCollection: FieldSetCollection[],
    language: string | undefined,
) => {
    
    const queryInner = requestCollection.reduce((prev, fsi) => (
        `${prev}
${fieldSetCollectionQuery(fsi, language)}` ), '');

    return `{${queryInner}
}`;
}

export const extractFromRequest = async (
    fieldSetCollection: FieldSetCollection[],
    data: any,
    language: string | undefined,
) => {
    const extractedEntries = await Promise.all(
        fieldSetCollection.map(async (fsc): Promise<[string, any]> => {
            const relevantData = data[fsc.name];
            if (relevantData === undefined) {
                const err = new Error(`${fsc.name} did not have any data associated`);
                console.error({ err, data });
                return Promise.reject(err);
            }

            const { inners, plurality } = fsc;
            const extracted = await extractFromInnerFieldSets(inners, plurality, data[fsc.name], language);
            return [fsc.name, extracted];
        })
    );

    const result = Object.fromEntries(extractedEntries);

    return result;
}

export const getRequest = async <RD extends {}>(
    definition: RD,
    mineConnection: MineConnection,
) => {
    const requestCollection = definition as any as FieldSetCollection[];
    requestCollection.forEach(rc => {
        if (rc.kind !== 'FieldSetCollection') {
            throw new Error('definition was not a valid RequestCollection');
        }
    });

    const langDumm = undefined;
    const query = requestQuery(requestCollection, langDumm);
    const data = await mineConnection.get({ query });

    return data as RD;
}

export const setupMineConnection = ({ baseURL }: {
    baseURL: string,
}) => ({
    baseURL,
    get: async ({ query }: {
        query: string,
    }): Promise<any> => {
        const url = `${baseURL}/api`;
        // TODO: Add preview token

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/graphql',
            },
            body: query,
        });
        if (!response.ok) {
            return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
        }

        const json = await response.json();
        const { data, errors } = json;
        if (Array.isArray(errors)) {
            throw new Error(errors.reduce((acc, err) => acc + '\n' + err.message, ''));
            // return Promise.reject(errObj);
        }
        if (data === undefined || data === null) {
            throw new Error('No data from server');
        }

        return data;
    },
})
export type MineConnection = ReturnType<typeof setupMineConnection>;