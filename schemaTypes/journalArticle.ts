import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const journalArticle = defineType({
  name: 'journalArticle',
  title: 'Journal Article',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'text',
      rows: 4,
      description: 'A brief summary of the article',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'footnote',
                title: 'Footnote',
                type: 'object',
                fields: [
                  defineField({
                    name: 'text',
                    title: 'Footnote Text',
                    type: 'text',
                    rows: 3,
                    validation: (rule) => rule.required(),
                  }),
                ],
              },
            ],
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'pageRange',
      title: 'Page Range',
      type: 'object',
      fields: [
        defineField({
          name: 'start',
          title: 'Start Page',
          type: 'number',
        }),
        defineField({
          name: 'end',
          title: 'End Page',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'pdf',
      title: 'PDF Version',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Optional PDF version of the article',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author0: 'authors.0',
      author1: 'authors.1',
    },
    prepare({title, author0, author1}) {
      const authors = [author0, author1].filter(Boolean)
      const subtitle = authors.length > 0 ? `by ${authors.join(', ')}` : ''
      return {
        title,
        subtitle: authors.length > 2 ? `${subtitle} et al.` : subtitle,
      }
    },
  },
})
