import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const paper = defineType({
  name: 'paper',
  title: 'Digital Paper',
  type: 'document',
  icon: DocumentIcon,
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
          type: 'reference',
          to: [{type: 'staff'}],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'text',
      rows: 4,
      description: 'A brief summary of the paper',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          marks: {
            decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}],
          },
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Date when the paper was published online',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pdf',
      title: 'PDF Version',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Optional PDF version of the paper',
    }),
  ],
  orderings: [
    {
      title: 'Published Date, Descending',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author0: 'authors.0.name',
      author1: 'authors.1.name',
      publishedAt: 'publishedAt',
    },
    prepare({title, author0, author1, publishedAt}) {
      const authors = [author0, author1].filter(Boolean)
      const subtitle = authors.length > 0 ? `by ${authors.join(', ')}` : ''
      return {
        title,
        subtitle: authors.length > 2 ? `${subtitle} et al.` : subtitle,
      }
    },
  },
})
