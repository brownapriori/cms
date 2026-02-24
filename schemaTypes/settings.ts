import {defineType, defineField, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Journal Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Journal Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'email',
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'string',
          description: 'Username without @',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'string',
          description: 'Username without @',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
