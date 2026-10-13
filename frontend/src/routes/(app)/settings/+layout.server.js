/** The tab strip only needs the role the signed-in layout already loaded. */
export async function load({ parent }) {
  const data = await parent();
  return { role: data.role ?? '' };
}
