import {defineType, defineField, defineArrayMember} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const staff = defineType({
  name: 'staff',
  title: 'Staff',
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
      name: 'roles',
      title: 'Roles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'role'}],
        }),
      ],
      description: 'All roles this person has in the journal',
      validation: (rule) => rule.required().min(1),
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
      role0: 'roles.0.title',
      role1: 'roles.1.title',
    },
    prepare({title, role0, role1}) {
      const roles = [role0, role1].filter(Boolean)
      return {
        title,
        subtitle: roles.length ? roles.join(', ') : '',
      }
    },
  },
})
