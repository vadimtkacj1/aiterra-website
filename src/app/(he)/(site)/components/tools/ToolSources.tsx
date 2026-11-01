export type ToolSource = { href: string; label: string }

export default function ToolSources({ sources, heading = 'מקורות' }: { sources: ToolSource[]; heading?: string }) {
  return (
    <>
      <h2>{heading}</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
