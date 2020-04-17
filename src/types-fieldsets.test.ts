import { defineSectionEntry } from './types-fieldsets';
import { text } from './types-fields';
import { getFieldSetCollection, fieldSetCollectionQuery, FieldSet } from './base-fieldset';

describe('single section entry', () => {
    const infoStationArticle = defineSectionEntry({
        sectionHandle: 'infoStation',
        typeHandle: 'infoStation' as const,
        uid: text('required'),
        title: text('required'),
        description: text(),
    });

    const infoStationArticleFS = infoStationArticle as any as FieldSet;

    const collection = getFieldSetCollection('infoStation', [infoStationArticleFS], 'multiple');

    test('infoStationArticle', () => {
        const r = fieldSetCollectionQuery(collection, undefined);
        expect(r).toMatch(/infoStation: entries\(section: "infoStation", \)\s+{\s+\.\.\.on infoStation_infoStation_Entry {\s+sectionHandle\s+typeHandle\s+uid\s+title\s+description\s+}\s+}/)
    });
});

// describe('multiple entries section collection', () => {
//     const sectionHandle = 'galleryItem' as const;

//     const videoItem = defineSectionEntry({
//         sectionHandle,
//         typeHandle: 'video',
//         videoURL: text('required'),
//     });

//     const imageItem = defineSectionEntry({
//         sectionHandle,
//         typeHandle: 'image',
//         imageURL: text('required'),
//     });

//     const fieldSetCollection = getFieldSetCollection('gallery', [videoItem, imageItem]);

//     test('query', () => {
//         const r = fieldSetCollectionQuery(fieldSetCollection, undefined);
//         expect(r).toMatch(/dasdsad/);
//     })
// });

// const VideoItem = defineSectionEntry({
//     handle: 'video',
//     videoURL: field(text, 'required'),
// });

// const ImageItem = defineSectionEntry({
//     sectionHandle: 'foo',
//     handle: 'image',
//     imageURL: field(text, 'required'),
// });

// const gallerySection = defineSection({
//     sectionHandle: 'Gallery',
//     sectionDefinitions: [VideoItem, ImageItem],
// });

// test('query', () => {
//     const query = gallerySection.query({
//         language: 'en',
//     });
//     expect(query).toMatch('dasdad');
// })

// // test('sectin')

// // export class ExampleSet implements FieldSetDefinition {
// //     title = field(text, { required });
// //     description = field(text);
// // }

// // const exampleInstance = new ExampleSet();
// // const str = exampleInstance.title;
// // const desc = exampleInstance.description;

// // const r = 

// // const quizVideo = defineSectionEntry({
// //     handle: 'video' as const,
// //     videoURL: field(text, 'required'),
// //     count: field(float, { ifMissing: 0, }),
// // })

// // const quizVideo = sectionEntry({
// //     handle: 'quizVideo' as const,
// //     videoURL: field(text, 'required'),
// // });

// // const quizQuestion = sectionEntry({
// //     handle: 'quizQuestion' as const,
// //     question: field(text, 'required'),
// // });

// // const quizSection = setupSection({ 
// //     sectionHandle: 'quiz', 
// //     sectionDefinitions: [quizVideo, quizQuestion] 
// // });
// // type QuizSection = TypeFromFieldSetCollectionType<typeof quizSection>;


// // const f = getDataFromFieldSetCollection(quizSection);

// // const qs = {} as QuizSection;
// // if (qs.handle === 'quizQuestion') {
// //     qs.question
// // } 

// // const SomeSection = fieldSetCollection(section('Foo'), [QuizQuestion, QuizVideo]);
// // const SomeMatrix = fieldSetCollection(matrix())