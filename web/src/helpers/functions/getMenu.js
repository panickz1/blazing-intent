export default async function getMenu(menus, key) {
  return Array.isArray(menus) ? menus.find((menu) => menu.key === key) : undefined;
}
