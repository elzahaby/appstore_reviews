document.addEventListener('DOMContentLoaded', () => {
    function renderReviewsWidgets() {
        const reviewContainers = document.querySelectorAll('div[data-app-id]');

        reviewContainers.forEach(container => {
            const appId = container.getAttribute('data-app-id');
            //const appName = container.getAttribute('data-app-name') || 'App Name'; // Default value if not provided
            let country = container.getAttribute('data-country');
            const reviewCount = container.getAttribute('data-count') || 5;
            const showMore = container.getAttribute('data-see-more') === 'true';
            const appStoreUrl = container.getAttribute('data-app-store-url') || '';

            // Default to auto country detection if no country is set
            if (!country || country === 'auto') {
                country = detectUserCountry() || 'us'; // Fallback to 'us' if detection fails
            }

            if (!appId) {
                container.innerHTML = '<p>Error: No app ID provided.</p>';
                return;
            }

            fetch(`https://itunes.apple.com/${country}/rss/customerreviews/id=${appId}/sortBy=mostRecent/json`)
                .then(response => response.json())
                .then(data => {
                    const reviews = data.feed.entry;
                    if (reviews) {
                        let reviewsHTML = '';
                        const reviewList = reviews.slice(0, reviewCount);
                        reviewList.forEach(review => {
                            const title = review.title?.label || '';
                            const rating = review['im:rating']?.label || 0;
                            const content = review.content?.label || '';
                            const reviewer = review.author?.name?.label || 'Anonymous';

                            reviewsHTML += `
                                <div class="review col mb-3 p-3 border rounded" itemprop="review" itemscope itemtype="https://schema.org/Review">
                                    ${title ? `<h5 itemprop="name">${title}</h5>` : ''}
                                    <div class="d-flex align-items-center mb-2">
                                        <div class="rating me-2" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
                                            <meta itemprop="ratingValue" content="${rating}" />
                                            <meta itemprop="bestRating" content="5" />
                                            ${[1, 2, 3, 4, 5].map(i => (i <= rating ? '&#9733;' : '&#9734;')).join('')}
                                        </div>
                                        <small class="text-muted" itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">${reviewer}</span></small>
                                    </div>
                                    <p itemprop="reviewBody">${content}</p>
                                </div>
                            `;
                        });

                        container.innerHTML = reviewsHTML;

                        if (showMore && reviews.length > reviewCount) {
                            const seeMoreLink = document.createElement('a');
                            seeMoreLink.className = 'link mt-3';
                            seeMoreLink.href = appStoreUrl;
                            seeMoreLink.target = '_blank';
                            seeMoreLink.textContent = 'See More';
                            container.appendChild(seeMoreLink);
                        }
                    } else {
                        container.innerHTML = '<p>No reviews found.</p>';
                    }
                })
                .catch(() => {
                    container.innerHTML = '<p>Error fetching reviews.</p>';
                });
        });
    }

    function observeWidgets() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (
                    mutation.type === 'attributes' &&
                    (mutation.attributeName === 'data-app-id' || mutation.attributeName === 'data-country' || mutation.attributeName === 'data-count' || mutation.attributeName === 'data-see-more' || mutation.attributeName === 'data-app-store-url')
                ) {
                    renderReviewsWidgets();
                }
            });
        });

        const reviewContainers = document.querySelectorAll('div[data-app-id]');
        reviewContainers.forEach(container => {
            observer.observe(container, { attributes: true });
        });
    }

    function detectUserCountry() {
        try {
            const region = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[1];
            return region ? region.toLowerCase() : 'us'; // Default to 'us' if no region is detected
        } catch {
            return 'us'; // Fallback to 'us' in case of any error
        }
    }

    renderReviewsWidgets();
    observeWidgets();
});