import { defineCategory } from './types-category';
import { text } from './types-fields';
import { defineRequestCollection } from './request';

test('single category', () => {
    const articles = defineCategory({
        groupHandle: 'articles' as const,
        title: text('required'),
        description: text(),
    });

    const requestDefinition = defineRequestCollection({
        articles: [articles],
    });
});