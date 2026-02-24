import {defineType, defineField} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const role = defineType({
  name: 'role',
  title: 'Role',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g., Editor-in-Chief, Managing Editor, Contributing Author',
    }),
    defineField({
      name: 'hierarchy',
      title: 'Hierarchy Order',
      type: 'number',
      description:
        'Lower numbers appear first. Items in the same hierarchy will appear in the same row.',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description:
        'Lower numbers appear first. Items in the same row will be ordered according to their display order.',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      hierarchy: 'hierarchy',
      order: 'order',
    },
    prepare({title, hierarchy, order}) {
      return {
        title,
        subtitle: `H: ${hierarchy} / O: ${order}`,
      }
    },
  },
})
