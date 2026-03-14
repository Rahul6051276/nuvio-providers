// PikaShow - CloudStream Engine Port for Nuvio
const Pikashow = {
    id: "pikashow",
    name: "PikaShow",
    mainUrl: "https://manoda.co",
    apiKey: "D7C567A34A6A87A5B69F6B2A8C1A3", // यह एक डिफॉल्ट की है

    // सुरक्षा सिग्नेचर (CloudStream वाला लॉजिक)
    getHeaders: function() {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        return {
            "Host": "manoda.co",
            "user-agent": "Pikashow/2509030 (Android 13; Pixel 5; Channel/pikashow)",
            "X-Timestamp": timestamp,
            "X-API-Key": this.apiKey,
            "Accept-Encoding": "gzip",
            "Connection": "Keep-Alive"
        };
    },

    // मूवी ढूंढना (बॉलीवुड, हॉलीवुड, सीरीज अलग-अलग)
    search: function(query) {
        var self = this;
        var categories = ["bollywood", "hollywood", "series"];
        
        var promises = categories.map(function(type) {
            var url = self.mainUrl + "/v1/api/videos?type=" + type + "&channel=pikashow";
            return fetch(url, { headers: self.getHeaders() })
                .then(res => res.json())
                .then(data => {
                    var list = data.records || data.series || [];
                    return list.filter(m => {
                        var title = m.t || m.title || "";
                        return title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
                    }).map(m => ({
                        name: m.t || m.title,
                        poster: m.c || m.cover,
                        link: "pikashow|" + (m.sortOrder || m.title) + "|" + type,
                        type: type === "series" ? "tv" : "movie"
                    }));
                }).catch(() => []);
        });

        return Promise.all(promises).then(results => [].concat.apply([], results));
    },

    // मल्टी-क्वालिटी लिंक (1080p, 720p)
    loadLinks: function(linkData) {
        var parts = linkData.split("|");
        var id = parts[1], type = parts[2];
        var url = this.mainUrl + "/v1/api/video?type=" + type + "&videoId=" + id + "&title=movie&noseasons=1&noepisodes=0";

        return fetch(url, { headers: this.getHeaders() })
            .then(res => res.json())
            .then(json => {
                var streams = [];
                if (json.data) {
                    var v = json.data;
                    // मल्टी क्वालिटी चेक (720p, 1080p)
                    if (v.resolutions && v.resolutions.length > 0) {
                        v.resolutions.forEach(r => {
                            streams.push({
                                name: "PikaShow " + (r.label || "HD"),
                                url: r.url,
                                quality: r.label,
                                headers: { "Referer": "https://samui390dod.com/" },
                                type: "m3u8"
                            });
                        });
                    } else if (v.playUrl || v.videoUrl) {
                        streams.push({
                            name: "PikaShow Server",
                            url: v.playUrl || v.videoUrl,
                            quality: "720p",
                            headers: { "Referer": "https://samui390dod.com/" },
                            type: "m3u8"
                        });
                    }
                }
                return streams;
            }).catch(() => []);
    }
};

export default Pikashow;
