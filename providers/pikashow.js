// providers/pikashow.js
const Pikashow = {
    id: "pikashow",
    name: "PikaShow",
    mainUrl: "https://manoda.co",

    getMainPage: function() {
        const headers = { "user-agent": "Pikashow/2509030 (Android 13; Channel/pikashow)" };
        return fetch(this.mainUrl + "/v1/api/videos?type=bollywood&channel=pikashow", { headers: headers })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                return data.records.map(function(m) {
                    return {
                        name: m.t,
                        poster: m.c,
                        link: m.sortOrder.toString(),
                        type: "movie"
                    };
                });
            });
    },

    search: function(query) {
        const headers = { "user-agent": "Pikashow/2509030 (Android 13; Channel/pikashow)" };
        return fetch(this.mainUrl + "/v1/api/videos?type=bollywood&channel=pikashow", { headers: headers })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                return data.records
                    .filter(function(m) { return m.t.toLowerCase().indexOf(query.toLowerCase()) !== -1; })
                    .map(function(m) {
                        return { name: m.t, poster: m.c, link: m.sortOrder.toString() };
                    });
            });
    }
};

export default Pikashow;
