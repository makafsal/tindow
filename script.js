document.addEventListener("DOMContentLoaded", () => {
  const linksContainer = document.getElementById("linksContainer");
  const addLinkBtn = document.getElementById("addLinkBtn");
  const linkDialog = document.getElementById("linkDialog");
  const linkForm = document.getElementById("linkForm");
  const cancelBtn = document.getElementById("cancelBtn");

  // Load saved links
  loadLinks();

  // Open dialog
  addLinkBtn.addEventListener("click", () => {
    linkDialog.showModal();
  });

  // Close dialog
  cancelBtn.addEventListener("click", () => {
    linkDialog.close();
  });

  // Handle form submission
  linkForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("linkName").value;
    const url = document.getElementById("linkUrl").value;

    if (name && url) {
      addLink(name, url);
      linkForm.reset();
      linkDialog.close();
    }
  });

  // Load links from storage
  function loadLinks() {
    chrome.storage.sync.get(["links"], (result) => {
      const links = result.links || [];
      renderLinks(links);
    });
  }

  // Add new link to storage
  function addLink(name, url) {
    chrome.storage.sync.get(["links"], (result) => {
      const links = result.links || [];
      const newLink = { name, url };
      links.push(newLink);

      chrome.storage.sync.set({ links }, () => {
        renderLinks(links);
      });
    });
  }

  // Delete a link
  function deleteLink(index) {
    chrome.storage.sync.get(["links"], (result) => {
      const links = result.links || [];
      links.splice(index, 1);

      chrome.storage.sync.set({ links }, () => {
        renderLinks(links);
      });
    });
  }

  async function getBestFavicon(domain, name) {
    const sources = [
      // Direct favicon (often largest available)
      `https://${domain}/favicon.ico`,

      // Apple touch icon (often high res)
      `https://${domain}/apple-touch-icon.png`,

      // Favicon Kit
      `https://api.faviconkit.com/${domain}/256`,

      // Clearbit (logos)
      `https://logo.clearbit.com/${domain}?size=200`,

      // Google fallback
      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    ];

    // Try each source until we find one that works
    for (const src of sources) {
      try {
        const exists = await testImage(src);
        if (exists) return src;
      } catch (e) {
        continue;
      }
    }

    return ""; // Return empty if none found
  }

  function testImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // Updated renderLinks function
  async function renderLinks(links) {
    linksContainer.innerHTML = "";

    for (const [index, link] of links.entries()) {
      const linkElement = document.createElement("a");
      linkElement.href = link.url;
      linkElement.className = "link-card";
      linkElement.target = "_blank";

      let domain;
      try {
        domain = new URL(link.url).hostname;
      } catch (e) {
        domain = "";
      }

      const faviconUrl = domain ? await getBestFavicon(domain, link.name) : "";

      linkElement.innerHTML = `
      ${
        faviconUrl
          ? `<img src="${faviconUrl}" alt="Favicon" class="link-card__favicon" loading="lazy">`
          : ""
      }
      <span class="link-card__name">${link.name}</span>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;

      linksContainer.appendChild(linkElement);

      // Add delete event listener
      linkElement
        .querySelector(".delete-btn")
        .addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteLink(index);
        });
    }
  }
});
