// PikaShow Provider - Rahul Edition
const Pikashow = {
    id: "pikashow",
    name: "PikaShow",
    mainUrl: "https://manoda.co",

    // ऐप के लिए हेडर्स (Headers)
    getHeaders: function () {
        return {
            "Host": "manoda.co",
            "user-agent": "Pikashow/2509030 (Android 13; Pixel 5; Channel/pikashow)"
        };
    },

    // मूवी और सीरीज ढूंढने का काम (सर्च)
    search: function (query) {
        var self = this;
        var categories = ["bollywood", "hollywood", "series"];
        
        // तीनों फोल्डर (बॉलीवुड, हॉलीवुड, सीरीज) को एक-एक करके चेक करना
        var promises = categories.map(function (type) {
            var url = self.mainUrl + "/v1/api/videos?type=" + type + "&channel=pikashow";
            
            return fetch(url, { headers: self.getHeaders() })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    var list = data.records || data.series || [];
                    return list.filter(function (item) {
                        var title = item.t || item.title || "";
                        return title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
                    }).map(function (item) {
                        return {
                            name: item.t || item.title,
                            poster: item.c || item.cover,
                            // आईडी और टाइप को जोड़कर लिंक बनाना
                            link: "pik|" + (item.sortOrder || item.title) + "|" + type,
                            type: type === "series" ? "tv" : "movie"
                        };
                    });
                })
                .catch(function () { return []; });
        });

        return Promise.all(promises).then(function (results) {
            // सबको एक साथ जोड़कर वापस भेजना
            return [].concat.apply([], results);
        });
    },

    // वीडियो प्ले करने के लिए लिंक निकालना
    loadLinks: function (linkData) {
        var parts = linkData.split("|");
        var id = parts[1];
        var type = parts[2];
        var url = this.mainUrl + "/v1/api/video?type=" + type + "&videoId=" + id + "&title=" + id + "&noseasons=1&noepisodes=0";

        return fetch(url, { headers: this.getHeaders() })
            .then(function (res) { return res.json(); })
            .then(function (json) {
                var streams = [];
                if (json.data) {
                    var v = json.data;
                    
                    // अगर 1080p, 720p आदि मौजूद हैं
                    if (v.resolutions && v.resolutions.length > 0) {
                        v.resolutions.forEach(function (r) {
                            streams.push({
                                name: "PikaShow " + (r.label || "HD"),
                                url: r.url,
                                quality: r.label,
                                headers: { "Referer": "https://samui390dod.com/" },
                                type: "m3u8"
                            });
                        });
                    } else if (v.playUrl || v.videoUrl) {
                        // अगर रेजोल्यूशन नहीं है तो डायरेक्ट लिंक
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
            })
            .catch(function () { return []; });
    }
};

// अंत में इसे एक्सपोर्ट करना (यह लाइन सबसे जरूरी है)
export default Pikashow;
