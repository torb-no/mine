import { text, raw, numeric, matrix, defineMatrixBlock } from './types-fields';
import { defineSectionEntry, defineGlobalSet } from './types-fieldsets';
import { defineRequestCollection, requestQuery, extractFromRequest, } from './request';
import { bvmValidServerData, bvmCorrectExtractedData } from './request.test.data';
import { FieldSetCollection } from './base-fieldset';

describe('test from real example', () => {
    const galleryEntry = defineMatrixBlock({
        typeHandle: 'entry' as const,
        text: text('optional', 'postfixLocalize'),
        // loopingVideo: raw(), // TODO
    });

    const chemicalElement = defineSectionEntry({
        sectionHandle: 'chemicalElement' as const,
        typeHandle: 'chemicalElement' as const,

        number: numeric('required'),
        symbol: text('required'),

        gallery: matrix([galleryEntry]),
        name: text('required', 'postfixLocalize'),
    });

    const filter = defineSectionEntry({
        sectionHandle: 'elementFilter' as const,
        typeHandle: 'elementFilter' as const,

        filterName: text('required'),
        filterId: text('required'),
        video: raw(' url '), // todo
    });

    const adjustmentsBlock = defineMatrixBlock({
        typeHandle: 'shift' as const,
        xBox: numeric('required'),
        yBox: numeric('required'),
    });

    const mainGlobal = defineGlobalSet({
        handle: 'main' as const,
        bottomRowConnectorAdjustments: matrix([adjustmentsBlock], 'required'),
    });

    const requestDefinition = defineRequestCollection({
        elements: [chemicalElement], 
        filters: [filter],
        mainGlobal,
    });
    const requestCollection = requestDefinition  as any as FieldSetCollection[];

    test('query', () => {
        const r = requestQuery(requestCollection, 'en');
        expect(r).toMatch(new RegExp(
            /{\s*/.source +
                /elements: entries\(section: "chemicalElement", \) {\s*/.source +
                    /\.\.\.on chemicalElement_chemicalElement_Entry {\s*/.source +
                        /sectionHandle\s+/.source +
                        /typeHandle\s+/.source +
                        /number\s+/.source +
                        /symbol\s+/.source +
                        /gallery {\s+/.source +
                            /\.\.\.on gallery_entry_BlockType {\s*/.source +
                                /typeHandle\s+/.source +
                                /text_en\s+/.source +
                        /}\s*}\s*/.source +
                        /name_en\s+/.source +
                    /}\s*/.source +
                /}\s*/.source +
                /filters: entries\(section: "elementFilter", \) {\s*/.source +
                    /\.\.\.on elementFilter_elementFilter_Entry {\s*/.source +
                        /sectionHandle\s+/.source +
                        /typeHandle\s+/.source +
                        /filterName\s+/.source +
                        /filterId\s+/.source +
                        /video\s*{\s*url\s*}\s*/.source +
                    /}\s*/.source +
                /}\s*/.source +
                /mainGlobal: globalSets\(handle: "main", \) {\s*/.source +
                    /\.\.\.on main_GlobalSet {\s*/.source +
                        /handle\s+/.source +
                        /bottomRowConnectorAdjustments {\s*/.source +
                            /\.\.\.on bottomRowConnectorAdjustments_shift_BlockType {\s*/.source +
                                /typeHandle\s+/.source +
                                /xBox\s+/.source +
                                /yBox\s+/.source +
                            /}\s*/.source +
                        /}\s*/.source +
                    /}\s*/.source +
                /}\s*/.source +
            /}\s*/.source +
        ''));
    });

    const data = bvmValidServerData.data;

    test('extract', () => {
        expect.assertions(1);
        return expect(
            extractFromRequest(requestCollection, data, 'en')
        ).resolves.toStrictEqual(bvmCorrectExtractedData);
    });
});