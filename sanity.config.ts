import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {singletonTools} from 'sanity-plugin-singleton-management'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'A Priori',

  projectId: 'x0eiwhvz',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), singletonTools()],

  schema: {
    types: schemaTypes,
  },
})
