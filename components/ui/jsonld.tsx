/**
 * Render a JSON-LD script tag with stringified structured data.
 * Use this on every page that needs schema. AI engines and search engines
 * read these for entity disambiguation, FAQ extraction, and Q&A surfacing.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
