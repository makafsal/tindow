document.addEventListener('DOMContentLoaded', () => {
  const linksContainer = document.getElementById('linksContainer');
  const addLinkBtn = document.getElementById('addLinkBtn');
  const linkDialog = document.getElementById('linkDialog');
  const linkForm = document.getElementById('linkForm');
  const cancelBtn = document.getElementById('cancelBtn');
  
  // Load saved links
  loadLinks();
  
  // Open dialog
  addLinkBtn.addEventListener('click', () => {
    linkDialog.showModal();
  });
  
  // Close dialog
  cancelBtn.addEventListener('click', () => {
    linkDialog.close();
  });
  
  // Handle form submission
  linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('linkName').value;
    const url = document.getElementById('linkUrl').value;
    
    if (name && url) {
      addLink(name, url);
      linkForm.reset();
      linkDialog.close();
    }
  });
  
  // Load links from storage
  function loadLinks() {
    chrome.storage.sync.get(['links'], (result) => {
      const links = result.links || [];
      renderLinks(links);
    });
  }
  
  // Add new link to storage
  function addLink(name, url) {
    chrome.storage.sync.get(['links'], (result) => {
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
    chrome.storage.sync.get(['links'], (result) => {
      const links = result.links || [];
      links.splice(index, 1);
      
      chrome.storage.sync.set({ links }, () => {
        renderLinks(links);
      });
    });
  }
  
  // Render all links// In your renderLinks function:
function renderLinks(links) {
  linksContainer.innerHTML = '';
  
  links.forEach((link, index) => {
    const linkElement = document.createElement('a');
    linkElement.href = link.url;
    linkElement.className = 'link-card';
    linkElement.target = '_blank';
    
    let domain;
    try {
      domain = new URL(link.url).hostname;
    } catch (e) {
      domain = '';
    }
    
    // Create image element
    const faviconImg = document.createElement('img');
    faviconImg.className = 'link-card__favicon';
    faviconImg.alt = 'Favicon';
    
    // First try the direct favicon
    faviconImg.src = `https://${domain}/favicon.ico`;
    
    // If that fails, fall back to Google's service with larger size
    faviconImg.onerror = () => {
      faviconImg.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    };
    
    linkElement.innerHTML = `
      <span class="link-card__name">${link.name}</span>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    
    // Insert the img element at the beginning
    linkElement.insertBefore(faviconImg, linkElement.firstChild);
    
    linksContainer.appendChild(linkElement);
    
    // Rest of your event listeners...
  });
}
});