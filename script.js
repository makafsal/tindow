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

  // Render all links// In your renderLinks function:
  function renderLinks(links) {
    linksContainer.innerHTML = "";

    links.forEach((link, index) => {
      // Create container for the link card and delete button
      const cardContainer = document.createElement("div");
      cardContainer.className = "link-card-container";

      // Create the link element
      const linkElement = document.createElement("a");
      linkElement.href = link.url;
      linkElement.className = "link-card";

      let domain;
      try {
        domain = new URL(link.url).hostname;
      } catch (e) {
        domain = "";
      }

      // Create image element
      const faviconImg = document.createElement("img");
      faviconImg.className = "link-card__favicon";
      faviconImg.alt = "Favicon";
      faviconImg.src = `https://${domain}/favicon.ico`;
      faviconImg.onerror = () => {
        faviconImg.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      };

      // Set link content
      linkElement.innerHTML = `
      <span class="link-card__name">${link.name}</span>
    `;
      linkElement.prepend(faviconImg);

      // Create delete button with SVG
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.dataset.index = index;
      deleteBtn.setAttribute("aria-label", "Delete");
      deleteBtn.innerHTML = `
      <svg class="delete-icon" viewBox="0 0 32 32" width="16" height="16" fill="#ffffff">
        <rect x="12" y="12" width="2" height="12"/>
        <rect x="18" y="12" width="2" height="12"/>
        <path d="M4,6V8H6V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8h2V6ZM8,28V8H24V28Z"/>
        <rect x="12" y="2" width="8" height="2"/>
      </svg>
    `;

      // Add elements to container
      cardContainer.appendChild(linkElement);
      cardContainer.appendChild(deleteBtn);

      // Add to main container
      linksContainer.appendChild(cardContainer);

      // Add delete event listener
      deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteLink(index);
      });
    });
  }
});
