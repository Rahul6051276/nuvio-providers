const Pikashow = {
    id: "pikashow",
    name: "PikaShow",
    mainUrl: "https://manoda.co",

    getHeaders: function() {
        return {
            "Host": "manoda.co",
            "user-agent": "Pikashow/2509030 (Android 13; Pixel 5; Channel/pikashow)"
        };
    },

    // यह फंक्शन ही पक्का करेगा कि "Fetching from..." में नाम आए
    search: function(query) {
        const types = ["bollywood", "hollywood", "series"];
        const headers = this.getHeaders();
        
        // हम सभी कैटेगरीज को एक साथ चेक करेंगे
        const promises = types.map(type => 
            fetch(this.mainUrl + "/v1/api/videos?type=" + type + "&channel=pikashow", { headers })
                .then(res => res.json())
                .then(data => {
                    const records = data.records || data.series || [];
                    return records.filter(m => {
                        const title = m.t || m.title || "";
                        return title.toLowerCase().includes(query.toLowerCase());
                    }).map(m => ({
                        name: m.t || m.title,
                        poster: m.c || m.cover,
                        link: "pikashow:" + (m.sortOrder || m.title) + ":" + type,
                        type: type === "series" ? "tv" : "movie"
                    }));
                })
                .catch(() => [])
        );

        return Promise.all(promises).then(results => results.flat());
    },

    loadLinks: function(data) {
        const parts = data.split(":");
        const id = parts[1];
        const type = parts[2];
        
        // लिंक निकालने का कोटलिन वाला लॉजिक
        const url = this.mainUrl + "/v1/api/video?type=" + type + "&videoId=" + id + "&title=" + id + "&noseasons=1&noepisodes=0";
        
        return fetch(url, { headers: this.getHeaders() })
            .then(res => res.json())
            .then(json => {
                if (json.data && (json.data.playUrl || json.data.videoUrl)) {
                    return [{
                        name: "PikaShow Premium Server",
                        url: json.data.playUrl || json.data.videoUrl,
                        headers: { "Referer": "https://samui390dod.com/" },
                        type: "m3u8"
                    }];
                }
                return [];
            }).catch(() => []);
    }
};

export default Pikashow;
