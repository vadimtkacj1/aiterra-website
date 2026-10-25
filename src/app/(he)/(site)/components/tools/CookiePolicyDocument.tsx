import type { CookieBlock, CookieInline } from '@/lib/cookie-policy'
import ui from './toolUi.module.css'

function Inline({ parts }: { parts: CookieInline[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === 'string' ? (
          part
        ) : (
          <a key={index} href={part.href} rel="noopener" target="_blank">
            {part.text}
          </a>
        ),
      )}
    </>
  )
}

export default function CookiePolicyDocument({ blocks }: { blocks: CookieBlock[] }) {
  return (
    <div className={ui.document} dir="rtl" lang="he">
      {blocks.map((block, index) => {
        if (block.kind === 'title') {
          return (
            <h3 key={index} className={ui.docTitle}>
              {block.text}
            </h3>
          )
        }
        if (block.kind === 'meta') return <p key={index}>{block.text}</p>
        if (block.kind === 'heading') {
          return (
            <h4 key={index} className={ui.docHeading}>
              {block.text}
            </h4>
          )
        }
        if (block.kind === 'paragraph') {
          return (
            <p key={index}>
              <Inline parts={block.parts} />
            </p>
          )
        }
        if (block.kind === 'list') {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Inline parts={item} />
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={index} className={ui.docCredit}>
            <Inline parts={block.parts} />
          </p>
        )
      })}
    </div>
  )
}
