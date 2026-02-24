import {defineType, defineField} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const staff = defineType({
  name: 'staff',
  title: 'Staff & Contributors',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'reference',
      to: [{type: 'role'}],
      description: 'Primary role in the journal',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Currently active member of the journal',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role.title',
    },
  },
})
