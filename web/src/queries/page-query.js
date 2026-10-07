const FILE = ["id", "filename_disk", "width", "height", "description"];

export const pageQuery = (namespace) => [
  "content",
  `${namespace}.*`,
  `${namespace}.item.*`,
  ...FILE.map((f) => `${namespace}.item.image.${f}`),
  ...FILE.map((f) => `${namespace}.item.backgroundImage.${f}`),
  ...FILE.map((f) => `${namespace}.item.avatar.${f}`),
  `${namespace}.item.author.first_name`,
  `${namespace}.item.author.last_name`,
  `${namespace}.item.author.avatar.filename_disk`,
  `${namespace}.item.categories.categories_id.id`,
  `${namespace}.item.categories.categories_id.name`,
  `${namespace}.item.categories.categories_id.slug`,
  `${namespace}.item.casinos.casinos_id.id`,
  `${namespace}.item.casinos.sort`,
  `${namespace}.item.authors.authors_id.id`,
  `${namespace}.item.authors.sort`,
  `${namespace}.item.picks.casinos_id.id`,
  `${namespace}.item.picks.label`,
  `${namespace}.item.picks.text`,
  `${namespace}.item.picks.sort`,
];
