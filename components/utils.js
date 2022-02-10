// This gets called on every request
export async function get(url = "") {
  // Fetch data from external API
  return fetch(`${window.location.origin}/api/${url}`);
}
