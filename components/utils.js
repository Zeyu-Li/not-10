// This gets called on every request
export async function get(url = "") {
  // Fetch data from external API
  return fetch(`${window.location.origin}/api/${url}`);
}

// The player's secret for a game; kept out of the URL so it isn't shared with the link or sent to analytics.
const tokenKey = (id) => `not-10:${id}`;
export const saveToken = (id, token) =>
  sessionStorage.setItem(tokenKey(id), token);
export const loadToken = (id) => sessionStorage.getItem(tokenKey(id));
