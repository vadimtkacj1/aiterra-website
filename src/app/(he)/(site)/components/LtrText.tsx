const LTR_SPAN = /<span dir="ltr">(.*?)<\/span>/

export default function LtrText({ text }: { text: string }) {
  return text.split(LTR_SPAN).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} dir="ltr">
        {part}
      </span>
    ) : (
      part
    ),
  )
}
