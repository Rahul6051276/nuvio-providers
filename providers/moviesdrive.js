const cheerio = require('cheerio-without-node-native');

const TMDB_API_KEY = '439c478a771f35c05022f9feabcca01c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
var MAIN_URL = "https://moviesdrive.forum";

var HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Referer": "https://moviesdrive.forum/",
};

function getStreams(tmdbId, mediaType, season, episode) {
    var type = mediaType || 'movie';
    var endpoint = type === 'tv' ? 'tv' : 'movie';
    var tmdbUrl = TMDB_BASE_URL + '/' + endpoint + '/' + tmdbId + '?api_key=' + TMDB_API_KEY + '&append_to_response=external_ids';

    return fetch(tmdbUrl)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            var title = type === 'tv' ? data.name : data.title;
            var searchStr = (data.external_ids && data.external_ids.imdb_id) ? data.external_ids.imdb_id : title;
            var searchUrl = MAIN_URL + '/searchapi.php?q=' + encodeURIComponent(searchStr);
            return fetch(searchUrl, { headers: HEADERS });
        })
        .then(function(res) { return res.json(); })
        .then(function(json) {
            if (!json || !json.hits || json.hits.length === 0) return [];
            var moviePath = json.hits[0].document.permalink;
            var finalUrl = moviePath.startsWith('http') ? moviePath : MAIN_URL + (moviePath.startsWith('/') ? '' : '/') + moviePath;
            return fetch(finalUrl, { headers: HEADERS });
        })
        .then(function(res) { return res.text(); })
        .then(function(html) {
            var $ = cheerio.load(html);
            var results = [];
            $('h5 a').each(function(i, el) {
                var link = $(el).attr('href');
                if (link && (link.indexOf('hubcloud') !== -1 || link.indexOf('gdflix') !== -1)) {
                    results.push({
                        name: "Moviesdrive Premium",
                        title: "High Speed Stream",
                        url: link,
                        quality: "Multi-Quality",
                        headers: HEADERS
                    });
                }
            });
            return results;
        })
        .catch(function(err) { return []; });
}

module.exports = { getStreams: getStreams };
