// Organization structured data (schema.org/Organization)
import JsonLd from './JsonLd'

export default function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AiTerra',
  }
  return <JsonLd data={data} />
}
