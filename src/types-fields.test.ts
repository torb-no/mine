import { defineMatrixBlock, text, matrix, numeric } from './types-fields';
import { Field } from './base-field';


describe('matrix', () => {
    describe('single', () => {
        const elementListBlock = defineMatrixBlock({
            typeHandle: 'list',
            listId: text('required'),
            startTime: numeric('required'),
        });
        
        const elementList = matrix([elementListBlock]);
        const elementListField = elementList as any as Field<typeof elementList>;
        const language = undefined;

        test('query', () => {
            // Works on geolab server installation!
            const r = elementListField.query !== undefined && elementListField.query({
                localizedName: 'elementLists',
                language,
            });
            expect(r).toMatch(/elementLists\s*{\s+\.\.\.on\s+elementLists_list_BlockType\s+{\s+typeHandle\s+listId\s+startTime\s*}\s*}/);
        });

        const elementListServerData = [
            {
              "typeHandle": "list",
              "listId": "water",
              "startTime": "7"
            },
            {
              "typeHandle": "list",
              "listId": "organic",
              "startTime": "11"
            },
            {
              "typeHandle": "list",
              "listId": "all",
              "startTime": "16"
            }
        ];

        const elementListExtractedData = [
            {
              "typeHandle": "list",
              "listId": "water",
              "startTime": 7
            },
            {
              "typeHandle": "list",
              "listId": "organic",
              "startTime": 11
            },
            {
              "typeHandle": "list",
              "listId": "all",
              "startTime": 16
            }
        ];

        test('extract', () => {
            expect.assertions(1);
            return expect(
                elementListField.extract({
                    name: 'elementList',
                    data: elementListServerData,
                    language,
                })
            ).resolves.toStrictEqual(elementListExtractedData);
        });
    });

    describe('multiple', () => {
        const matrixHandle = 'quiz';

        const textAnswer = defineMatrixBlock({
            matrixHandle,
            typeHandle: 'text' as const,
            text: text(),
        });

        const imageAnswer = defineMatrixBlock({
            matrixHandle,
            typeHandle: 'image' as const,
            image: text(),
        });

        const quiz = matrix([textAnswer, imageAnswer], 'required');
        const quizField = quiz as any as Field<typeof quiz>;

        test('query', () => {
            const r = quizField.query !== undefined && quizField.query({
                localizedName: 'quiz',
                language: undefined,
            });
            expect(r).toMatch(/quiz\s*{\s+\.\.\.on quiz_text_BlockType\s+{\s+matrixHandle\s+typeHandle\s+text\s+}\s+\.\.\.on quiz_image_BlockType\s+{\s+matrixHandle\s+typeHandle\s+image\s+}\s*}/)
        });
    });
})

// import { text, float } from '../types-fields';
// import { FIELD_DATA_MISSING } from '../base-field';

// describe('text', () => {
//     const name = 'phoebe';
//     const serverData = 'towel';

//     test('valid', () => {
//         expect.assertions(1);

//         return expect(text.extract({
//             name,
//             serverData, 
//         })).resolves.toMatch(serverData);
//     });

//     test('undefined', () => {
//         expect.assertions(1);
//         return expect(text.extract({
//             name,
//             serverData: undefined,
//         })).rejects.toMatch(FIELD_DATA_MISSING);
//     });

//     test('null', () => {
//         expect.assertions(1);
//         return expect(text.extract({
//             name,
//             serverData: null,
//         })).rejects.toMatch(FIELD_DATA_MISSING);
//     });

//     test('not string', () => {
//         expect.assertions(1);
//         return expect(text.extract({
//             name,
//             serverData: 42,
//         })).rejects.toBeInstanceOf(Error);
//     });
// });

// describe('float', () => {
//     const name = 'pi';

//     test('valid', () => {
//         expect.assertions(1);
//         return expect(float.extract({
//             name, 
//             serverData: '3.14'
//         })).resolves.toBe(3.14);
//     });

//     test('undefined', () => {
//         expect.assertions(1);
//         return expect(float.extract({
//             name,
//             serverData: undefined,
//         })).rejects.toMatch(FIELD_DATA_MISSING);
//     });

//     test('NaN', () => {
//         expect.assertions(1);
//         return expect(float.extract({
//             name,
//             serverData: 'towle',
//         })).rejects.toBeInstanceOf(Error);
//     });
// });