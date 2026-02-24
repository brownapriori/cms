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
          type: 'reference',
          to: [{type: 'staff'}],
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
  ],
  preview: {
    select: {
      title: 'title',
      author0: 'authors.0.name',
      author1: 'authors.1.name',
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
