// Simple client-side search for Jekyll site
(function() {
  let searchData = [];
  let searchInput = document.querySelector('.search-input');
  let searchResults = null;

  // Load search data
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      searchData = data;
    })
    .catch(error => console.error('Error loading search data:', error));

  // Create search results dropdown
  function createResultsDropdown() {
    if (searchResults) return;

    searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      margin-top: 0.5rem;
      max-height: 400px;
      overflow-y: auto;
      display: none;
      z-index: 1000;
    `;

    document.querySelector('.search-container').style.position = 'relative';
    document.querySelector('.search-container').appendChild(searchResults);
  }

  // Perform search
  function performSearch(query) {
    if (!query || query.length < 2) {
      hideResults();
      return;
    }

    const results = searchData.filter(item => {
      const titleMatch = item.title && item.title.toLowerCase().includes(query.toLowerCase());
      const contentMatch = item.content && item.content.toLowerCase().includes(query.toLowerCase());
      const descMatch = item.description && item.description.toLowerCase().includes(query.toLowerCase());
      return titleMatch || contentMatch || descMatch;
    }).slice(0, 8); // Limit to 8 results

    displayResults(results, query);
  }

  // Display search results
  function displayResults(results, query) {
    if (!searchResults) createResultsDropdown();

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: #9ca3af;">
          No results found for "${query}"
        </div>
      `;
      searchResults.style.display = 'block';
      return;
    }

    searchResults.innerHTML = results.map(result => {
      const excerpt = getExcerpt(result.content, query);
      return `
        <a href="${result.url}" style="
          display: block;
          padding: 1rem;
          color: #e5e5e5;
          text-decoration: none;
          border-bottom: 1px solid #27272a;
          transition: background 0.2s;
        " onmouseover="this.style.background='#27272a'" onmouseout="this.style.background='transparent'">
          <div style="font-weight: 600; color: #FFD700; margin-bottom: 0.25rem;">
            ${highlightMatch(result.title, query)}
          </div>
          <div style="font-size: 0.85rem; color: #9ca3af; line-height: 1.4;">
            ${excerpt}
          </div>
        </a>
      `;
    }).join('');

    searchResults.style.display = 'block';
  }

  // Get excerpt with highlighted match
  function getExcerpt(content, query) {
    if (!content) return '';

    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return content.substring(0, 120) + '...';

    const start = Math.max(0, index - 60);
    const end = Math.min(content.length, index + query.length + 60);
    let excerpt = content.substring(start, end);

    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    return highlightMatch(excerpt, query);
  }

  // Highlight matched text
  function highlightMatch(text, query) {
    if (!text) return '';
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span style="background: rgba(255, 215, 0, 0.2); color: #FFD700;">$1</span>');
  }

  // Hide results
  function hideResults() {
    if (searchResults) {
      searchResults.style.display = 'none';
    }
  }

  // Event listeners
  if (searchInput) {
    // Search on input
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        hideResults();
      }
    });

    // Keyboard shortcut (Cmd+K or Ctrl+K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }

      // Escape to close
      if (e.key === 'Escape') {
        hideResults();
        searchInput.blur();
      }
    });

    // Navigate results with arrow keys
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && searchResults && searchResults.style.display === 'block') {
        e.preventDefault();
        const firstLink = searchResults.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
  }
})();
