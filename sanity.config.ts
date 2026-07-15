import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {singletonTools} from 'sanity-plugin-singleton-management'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {sanitizedPdfAssetSource} from './components/SanitizedPdfAssetSource'

import {GenerateArticleSlugsAction} from './actions/generateArticleSlugs'

export default defineConfig({
  name: 'default',
  title: 'A Priori',

  projectId: 'x0eiwhvz',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), singletonTools()],

  form: {
    file: {
      // Return only the sanitized source so no upload path can bypass it.
      // Existing assets remain attached to documents; this only controls the picker.
      assetSources: () => [sanitizedPdfAssetSource],
      directUploads: false,
    },
  },

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'volume') {
        return [...prev, GenerateArticleSlugsAction]
      }

      return prev
    },
  },
})
