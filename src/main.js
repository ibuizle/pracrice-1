function loadPartial(selector, url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${url}`);
      }
      return response.text();
    })
    .then(html => {
      const container = document.querySelector(selector);
      if (container) {
        container.innerHTML = html;
      }
    })
    .catch(err => console.error(err));
}

// УВАГА: файли лежать у корені,
// тому шляхи такі, а не ./partials/header.html
loadPartial("#header", "./header.html");
loadPartial("#footer", "./footer.html");

// Далі можеш додати свою логіку пошуку зображень
// ...
