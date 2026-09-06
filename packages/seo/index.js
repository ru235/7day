export function head({ title, desc, site, path = '/' }) {
  return { title, desc, canonical: site + path };
}
export function faqSchema(faqs) {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
}
export function llmsTxt({ domain, name, tables }) {
  return `# ${name}\n${domain}\n\n## Данные для ИИ\n${tables}\n\nОбновлено: ${new Date().toISOString().slice(0,10)}\n`;
}
