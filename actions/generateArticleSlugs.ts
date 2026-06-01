// ./src/actions/generateArticleSlugs.ts

import {useState} from 'react'
import {useClient} from 'sanity'

function makeArticleCode(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .slice(0, 2)
    .padEnd(2, 'x')
}

function makeSlug({
  volumeNumber,
  year,
  title,
  order,
}: {
  volumeNumber: number
  year: number
  title: string
  order: number
}) {
  const volume = String(volumeNumber).padStart(2, '0')
  const yy = String(year).slice(-2)
  const titleCode = makeArticleCode(title)
  const orderCode = String(order).padStart(2, '0')

  return `v${volume}.${yy}-${titleCode}${orderCode}`
}

export function GenerateArticleSlugsAction(props: any) {
  const {draft, published, onComplete} = props
  const doc = draft || published
  const client = useClient({apiVersion: '2026-05-31'})
  const [isGenerating, setIsGenerating] = useState(false)

  if (doc?._type !== 'volume') {
    return null
  }

  return {
    label: isGenerating ? 'Generating slugs...' : 'Generate article slugs',
    disabled: isGenerating,
    onHandle: async () => {
      setIsGenerating(true)

      try {
        const volumeNumber = doc.number
        const year = doc.year
        const articleRefs = doc.articles || []

        if (!volumeNumber || !year || articleRefs.length === 0) {
          throw new Error('Volume number, year, and articles are required.')
        }

        const articleIds = articleRefs.map((article: any) => article?._ref).filter(Boolean)

        const articles = await client.fetch(
          `*[_type == "journalArticle" && _id in $ids]{
            _id,
            title,
            slug
          }`,
          {ids: articleIds},
        )

        const articleById = new Map(articles.map((article: any) => [article._id, article]))

        let transaction = client.transaction()

        articleRefs.forEach((articleRef: any, index: number) => {
          const articleId = articleRef?._ref
          const article = articleById.get(articleId)

          if (!article || article.slug?.current) {
            return
          }

          const slug = makeSlug({
            volumeNumber,
            year,
            title: article.title || '',
            order: index + 1,
          })

          transaction = transaction.patch(articleId, (patch) =>
            patch.set({
              slug: {
                _type: 'slug',
                current: slug,
              },
            }),
          )
        })

        await transaction.commit()

        onComplete()
      } catch (error) {
        console.error(error)
      } finally {
        setIsGenerating(false)
      }
    },
  }
}
