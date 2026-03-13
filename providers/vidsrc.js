const name = "Pikashow Server (Vidsrc)";
const id = "vidsrc_pika";

async function getStreams(tmdbId, mediaType = 'movie', seasonNum = null, episodeNum = null) {
    const url = mediaType === 'movie' 
        ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}` 
        : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&sea=${seasonNum}&epi=${episodeNum}`;

    return [{
        name: "Pikashow Multi-Audio",
        url: url,
        type: "embed"
    }];
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getStreams };
} else {
    global.VidsrcScraperModule = { getStreams };
}
