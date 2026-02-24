import {defineType, defineField, defineArrayMember} from 'sanity'
import {BookIcon} from '@sanity/icons'

export const volume = defineType({
  name: 'volume',
  title: 'Volume',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'number',
      title: 'Volume Number',
      type: 'number',
      validation: (rule) => rule.required().positive().integer(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) =>
        rule
          .required()
          .integer()
          .min(1900)
          .max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional theme or title for this volume',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'articles',
      title: 'Articles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'journalArticle'}],
        }),
      ],
      description: 'Journal articles included in this volume',
    }),
    defineField({
      name: 'pdf',
      title: 'PDF',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Complete volume as PDF',
    }),
  ],
  orderings: [
    {
      title: 'Volume Number, Descending',
      name: 'numberDesc',
      by: [{field: 'number', direction: 'desc'}],
    },
    {
      title: 'Year, Descending',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      number: 'number',
      year: 'year',
      title: 'title',
      media: 'coverImage',
    },
    prepare({number, year, title, media}) {
      return {
        title: `Volume ${number} (${year})`,
        subtitle: title || '',
        media,
      }
    },
  },
})
