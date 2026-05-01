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
      name: 'submissionsBannerActive',
      title: 'Call to Submissions Banner Active',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ 
      name: 'submissionsVolume',
      title: 'Submissions Volume',
      type: 'reference',
      to: [{type: 'volume'}],
      description: 'The volume currently accepting submissions',
      hidden: ({document}) => !document?.submissionsBannerActive,
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
          type: 'string',
        }),
        defineField({
          name: 'contents',
          title: 'Contents',
          type: 'text',
          rows: 3,
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
