export default function schemaHowTo(data) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data?.title,
    description: data?.description,
    step: data?.items.map((step) => ({
      "@type": "HowToStep",
      name: step.title,
      itemListElement: [
        {
          "@type": "HowToDirection",
          text: step.description,
        },
      ],
    })),
  };
}
