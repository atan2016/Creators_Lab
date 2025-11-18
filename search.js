// CreatorsLab Search Functionality
let fuse = null;
let searchData = [];

// Load search index
async function loadSearchIndex() {
    try {
        const response = await fetch('/search-index.json?' + Date.now());
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
        searchInputWrapper.classList.toggle('active');
        if (searchInputWrapper.classList.contains('active')) {
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
                            <div class="search-result-item" data-url="${item.url}">
                                <div class="search-result-section">${item.section}</div>
                                <div class="search-result-title">${item.title}</div>
                                <div class="search-result-content">${item.content}</div>
                            </div>
                        `;
                    }).join('');
            
            // Add click handlers to results
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', function() {
                    window.location.href = this.dataset.url;
                });
            });
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
        const items = searchResults.querySelectorAll('.search-result-item');
        if (items.length === 0) return;
        
        const currentFocus = searchResults.querySelector('.search-result-item:hover');
        let index = Array.from(items).indexOf(currentFocus);
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            index = index < items.length - 1 ? index + 1 : 0;
            items[index].scrollIntoView({ block: 'nearest' });
            // Simulate hover effect
            items.forEach(item => item.style.background = '');
            items[index].style.background = '#f0fdf4';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            index = index > 0 ? index - 1 : items.length - 1;
            items[index].scrollIntoView({ block: 'nearest' });
            // Simulate hover effect
            items.forEach(item => item.style.background = '');
            items[index].style.background = '#f0fdf4';
        } else if (e.key === 'Enter' && index >= 0) {
            e.preventDefault();
            window.location.href = items[index].dataset.url;
        }
    });
});

