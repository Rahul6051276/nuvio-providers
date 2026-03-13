// Vidsrc Scraper for Nuvio - Hindi & Multi-Audio Version
const name = "Pikashow Multi-Audio";
const id = "vidsrc_pika";

async function getStreams(tmdbId, mediaType = 'movie', seasonNum = null, episodeNum = null) {
    // हम 2 अलग सर्वर्स का उपयोग करेंगे ताकि हिंदी मिलने के चांस बढ़ जाएँ
    const servers = [
        {
            name: "Pikashow Server 1 (Multi)",
            url: mediaType === 'movie' 
                ? `https://vidsrc.xyz/embed/movie/${tmdbId}` 
                : `https://vidsrc.xyz/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`
        },
        {
            name: "Pikashow Server 2 (Hindi)",
            url: mediaType === 'movie' 
                ? `https://vidsrc.to/embed/movie/${tmdbId}` 
                : `https://vidsrc.to/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`
        }
    ];

    return servers.map(s => ({
        name: s.name,
        title: "Check Audio Settings for Hindi",
        url: s.url,
        type: "embed",
        headers: {
            'Referer': 'https://vidsrc.xyz/',
            'User-Agent': 'Mozilla/5.0'
        }
    }));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getStreams };
} else {
    global.VidsrcScraperModule = { getStreams };
}
