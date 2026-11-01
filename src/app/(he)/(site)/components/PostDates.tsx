import { formatPostDate } from '../blogCategory'

type PostDatesProps = {
  published: string
  modified?: string
  publishedPrefix: string
  updatedPrefix: string
  locale?: 'he' | 'en'
}

export default function PostDates({
  published,
  modified,
  publishedPrefix,
  updatedPrefix,
  locale = 'he',
}: PostDatesProps) {
  return (
    <>
      <span>
        {publishedPrefix} <time dateTime={published}>{formatPostDate(published, locale)}</time>
      </span>
      {modified && modified > published ? (
        <span>
          {updatedPrefix} <time dateTime={modified}>{formatPostDate(modified, locale)}</time>
        </span>
      ) : null}
    </>
  )
}
