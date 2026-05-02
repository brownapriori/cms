import {defineType, defineField, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  options: {
    singleton: true,
  },
  fields: [
    defineField({
      name: 'mastheadOrdinal',
      title: 'Masthead Ordinal',
      type: 'string',
      description: 'The ordinal in "The ___ Editorial Board", e.g. "9th"',
    }),
    defineField({
      name: 'featuredArticles',
      title: 'Featured Articles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'journalArticle'}],
        }),
      ],
      description: 'Articles featured on the home page (max 8)',
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'submissions',
      title: 'Submissions',
      type: 'object',
      fields: [
        defineField({
          name: 'open',
          title: 'Submissions Open',
          type: 'string',
          options: {
            list: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
            layout: 'radio',
          },
          initialValue: 'no',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'volumeNumber',
          title: 'Volume Number',
          type: 'number',
          description: 'The volume number currently accepting submissions',
          validation: (rule) => rule.integer().positive(),
          hidden: ({parent}) => parent?.open !== 'yes',
        }),
        defineField({
          name: 'submissionLink',
          title: 'Submission Link',
          type: 'url',
          hidden: ({parent}) => parent?.open !== 'yes',
        }),
        defineField({
          name: 'deadline',
          title: 'Submission Deadline',
          type: 'date',
          hidden: ({parent}) => parent?.open !== 'yes',
        }),
        defineField({
          name: 'nextOpenDate',
          title: 'Next Open Date',
          type: 'string',
          description: 'e.g. "fall 2026" — shown on the submissions page when closed',
          hidden: ({parent}) => parent?.open !== 'no',
        }),
      ],
    }),
    defineField({
      name: 'readVolumeCTA',
      title: 'Read Volume CTA',
      type: 'object',
      fields: [
        defineField({
          name: 'volumeNumber',
          title: 'Volume Number',
          type: 'number',
          description: 'The volume number this CTA links to',
          validation: (rule) => rule.integer().positive(),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          description: 'Bold text renders in red',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'block',
              styles: [{title: 'Normal', value: 'normal'}],
              lists: [],
              marks: {
                decorators: [{title: 'Bold (Red)', value: 'strong'}],
                annotations: [],
              },
            }),
          ],
        }),
        defineField({
          name: 'contents',
          title: 'Contents',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'block',
              styles: [{title: 'Normal', value: 'normal'}],
              lists: [],
              marks: {
                decorators: [
                  {title: 'Bold', value: 'strong'},
                  {title: 'Italic', value: 'em'},
                ],
                annotations: [],
              },
            }),
          ],
        }),
        defineField({
          name: 'position',
          title: 'Position',
          type: 'string',
          options: {
            list: [
              {title: 'Below navigation bar', value: 'belowNav'},
              {title: 'Below featured articles', value: 'belowFeatured'},
            ],
            layout: 'radio',
          },
          initialValue: 'belowNav',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {title: title ?? 'Site Settings'}
    },
  },
})
