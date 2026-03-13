// Vixsrc Scraper for Nuvio Local Scrapers
// Multi-Audio Version (Hindi + English)
// Standalone version - No external dependencies

const TMDB_API_KEY = "68e094699525b18a70bab2f86b1fa706";
const BASE_URL = 'https://vixsrc.to';

function makeRequest(url, options = {}) {
    const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json,*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        ...options.headers
    };

    return fetch(url, {
        method: options.method || 'GET',
        headers: defaultHeaders,
        ...options
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response;
    });
}

function getTmdbInfo(tmdbId, mediaType) {
    const url = `https://api.themoviedb.org/3/${mediaType === 'tv' ? 'tv' : 'movie'}/${tmdbId}?api_key=${TMDB_API_KEY}`;
    return makeRequest(url).then(response => response.json());
}

function extractStreamFromPage(contentType, contentId, seasonNum, episodeNum) {
    let vixsrcUrl = contentType === 'movie' 
        ? `${BASE_URL}/movie/${contentId}` 
        : `${BASE_URL}/tv/${contentId}/${seasonNum}/${episodeNum}`;
    
    let subtitleApiUrl = contentType === 'movie'
        ? `https://sub.wyzie.ru/search?id=${contentId}`
        : `https://sub.wyzie.ru/search?id=${contentId}&season=${seasonNum}&episode=${episodeNum}`;

    console.log(`[Vixsrc] Fetching Multi-Audio Source: ${vixsrcUrl}`);

    return makeRequest(vixsrcUrl, { headers: { 'Accept': 'text/html' } })
    .then(response => response.text())
    .then(html => {
        let masterPlaylistUrl = null;

        if (html.includes('window.masterPlaylist')) {
            const urlMatch = html.match(/url:\s*['"]([^'"]+)['"]/);
            const tokenMatch = html.match(/['"]?token['"]?\s*:\s*['"]([^'"]+)['"]/);
            const expiresMatch = html.match(/['"]?expires['"]?\s*:\s*['"]([^'"]+)['"]/);

            if (urlMatch && tokenMatch && expiresMatch) {
                const baseUrl = urlMatch[1];
                const token = tokenMatch[1];
                const expires = expiresMatch[1];

                // FIXED: Removed '&lang=en' to allow all audio tracks (Hindi/English)
                if (baseUrl.includes('?b=1')) {
                    masterPlaylistUrl = `${baseUrl}&token=${token}&expires=${expires}&h=1`;
                } else {
                    masterPlaylistUrl = `${baseUrl}?token=${token}&expires=${expires}&h=1`;
                }
            }
        }

        if (!masterPlaylistUrl) {
            const m3u8Match = html.match(/(https?:\/\/[^'"\s]+\.m3u8[^'"\s]*)/);
            if (m3u8Match) masterPlaylistUrl = m3u8Match[1];
        }

        return masterPlaylistUrl ? { masterPlaylistUrl, subtitleApiUrl } : null;
    });
}

function getStreams(tmdbId, mediaType = 'movie', seasonNum = null, episodeNum = null) {
    return getTmdbInfo(tmdbId, mediaType)
    .then(() => extractStreamFromPage(mediaType, tmdbId, seasonNum, episodeNum))
    .then(streamData => {
        if (!streamData) return [];

        const { masterPlaylistUrl } = streamData;
        return [{
            name: "Vixsrc Multi-Audio",
            title: "Hindi / English (Auto Quality)",
            url: masterPlaylistUrl,
            quality: 'Auto',
            type: 'direct',
            headers: {
                'Referer': BASE_URL,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        }];
    })
    .catch(error => {
        console.error(`[Vixsrc] Error: ${error.message}`);
        return [];
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getStreams };
} else {
    global.VixsrcScraperModule = { getStreams };
}
