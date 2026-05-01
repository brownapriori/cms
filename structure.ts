import {StructureBuilder, StructureResolverContext} from 'sanity/structure'
import {
  singletonDocumentListItems,
  filteredDocumentListItems,
} from 'sanity-plugin-singleton-management'

export const structure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .title('Content')
    .items([
      ...singletonDocumentListItems({S, context}),
      S.divider(),
      ...filteredDocumentListItems({S, context}),
    ])
