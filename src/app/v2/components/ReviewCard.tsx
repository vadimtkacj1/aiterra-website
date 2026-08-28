import type { ComponentPropsWithoutRef } from 'react'
import { GoogleGlyph, QuoteMark, StarIcon } from './icons'
import type { ReviewItem } from '../content'
import styles from './ReviewCard.module.css'

const MAX_RATING = 5

type ReviewCardProps = ComponentPropsWithoutRef<'figure'> & {
  review: ReviewItem
  ratingLabel: string
  active?: boolean
}

export default function ReviewCard({
  review,
  ratingLabel,
  active = false,
  className,
  ...rest
}: ReviewCardProps) {
  return (
    <figure {...rest} aria-current={active} className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <QuoteMark className={styles.quote} />
        <GoogleGlyph className={styles.source} />
      </div>

      <span className={styles.rating} role="img" aria-label={ratingLabel}>
        {Array.from({ length: MAX_RATING }, (unused, index) => (
          <StarIcon
            key={index}
            className={index < review.rating ? styles.star : styles.starOff}
          />
        ))}
      </span>

      <blockquote className={styles.body}>
        {review.body.map((segment, index) =>
          segment.accent ? (
            <strong key={`${index}-${segment.text}`} className={styles.accent}>
              {segment.text}
            </strong>
          ) : (
            <span key={`${index}-${segment.text}`}>{segment.text}</span>
          ),
        )}
      </blockquote>

      <figcaption className={styles.author}>
        <span
          className={styles.avatar}
          style={review.avatar ? undefined : { background: review.tint }}
          aria-hidden="true"
        >
          {review.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={review.avatar} alt="" className={styles.avatarImage} />
          ) : (
            review.author.slice(0, 1)
          )}
        </span>

        <span className={styles.authorText}>
          <span className={styles.name}>{review.author}</span>
          <span className={styles.when}>{review.when}</span>
        </span>
      </figcaption>
    </figure>
  )
}
