// CreatorsLab Search Functionality
let fuse = null;
let searchData = [];

// Load search index
async function loadSearchIndex() {
    try {
        const response = await fetch('/data/search-index.json?' + Date.now());
        searchData = await response.json();
        
        // Initialize Fuse.js
        const options = {
            keys: [
                { name: 'title', weight: 0.3 },
                { name: 'content', weight: 0.2 },
                { name: 'keywords', weight: 0.4 },
                { name: 'section', weight: 0.1 }
            ],
            threshold: 0.4,
            includeScore: true,
            minMatchCharLength: 2,
            ignoreLocation: true,
            shouldSort: true
        };
        fuse = new Fuse(searchData, options);
    } catch (error) {
        console.error('Error loading search index:', error);
    }
}

// Initialize search on page load
window.addEventListener('load', function() {
    loadSearchIndex();
    
    const searchIcon = document.getElementById('searchIcon');
    const searchInputWrapper = document.getElementById('searchInputWrapper');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchIcon || !searchInputWrapper || !searchInput || !searchResults) {
        return; // Search elements not found on this page
    }
    
    // Toggle search input when icon is clicked
    searchIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = searchInputWrapper.classList.toggle('active');
        searchIcon.setAttribute('aria-expanded', isActive);
        if (isActive) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            searchResults.classList.remove('active');
        }
    });
    
    // Perform search as user types
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        if (!fuse) {
            searchResults.innerHTML = '<div class="search-no-results">Search is loading...</div>';
            searchResults.classList.add('active');
            return;
        }
        
                // Perform search
                let results = fuse.search(query);
                
                // Boost location-related results for location queries
                const locationKeywords = ['location', 'locations', 'where', 'near me', 'local', 'area', 'city', 'address', 'center', 'facility'];
                const isLocationQuery = locationKeywords.some(keyword => 
                    query.toLowerCase().includes(keyword.toLowerCase())
                );
                
                if (isLocationQuery) {
                    // Boost location-related results
                    results = results.sort((a, b) => {
                        const aIsLocation = a.item.keywords.some(keyword => 
                            locationKeywords.includes(keyword.toLowerCase())
                        );
                        const bIsLocation = b.item.keywords.some(keyword => 
                            locationKeywords.includes(keyword.toLowerCase())
                        );
                        
                        if (aIsLocation && !bIsLocation) return -1;
                        if (!aIsLocation && bIsLocation) return 1;
                        return a.score - b.score;
                    });
                }
                
                // Display results
                if (results.length === 0) {
                    searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
                } else {
                    searchResults.innerHTML = results.slice(0, 8).map(result => {
                        const item = result.item;
                        return `
                            <a href="${item.url}" class="search-result-item" role="option" tabindex="0">
                                <div class="search-result-section">${item.section}</div>
                                <div class="search-result-title">${item.title}</div>
                                <div class="search-result-content">${item.content}</div>
                            </a>
                        `;
                    }).join('');
        }
        
        searchResults.classList.add('active');
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInputWrapper.contains(e.target) && !searchIcon.contains(e.target)) {
            searchInputWrapper.classList.remove('active');
            searchResults.classList.remove('active');
        }
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInputWrapper.classList.remove('active');
            searchResults.classList.remove('active');
            searchInput.value = '';
        }
        
        // Arrow key navigation
        const items = Array.from(searchResults.querySelectorAll('.search-result-item'));
        if (items.length === 0) return;
        
        const currentFocus = document.activeElement;
        let index = items.indexOf(currentFocus);
        if (index === -1) index = 0;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            index = index < items.length - 1 ? index + 1 : 0;
            items[index].focus();
            items[index].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            index = index > 0 ? index - 1 : items.length - 1;
            items[index].focus();
            items[index].scrollIntoView({ block: 'nearest' });
        }
    });
});

