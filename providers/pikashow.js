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

    // 1. सर्च लॉजिक: बॉलीवुड, हॉलीवुड और सीरीज तीनों को अलग-अलग चेक करेगा
    search: function(query) {
        const categories = ["bollywood", "hollywood", "series"];
        const headers = this.getHeaders();
        
        const promises = categories.map(type => {
            const url = this.mainUrl + "/v1/api/videos?type=" + type + "&channel=pikashow";
            return fetch(url, { headers })
                .then(res => res.json())
                .then(data => {
                    const list = data.records || data.series || [];
                    return list.filter(item => {
                        const title = item.t || item.title || "";
                        return title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
                    }).map(item => ({
                        name: item.t || item.title,
                        poster: item.c || item.cover,
                        // लिंक में टाइप और आईडी दोनों भेज रहे हैं
                        link: "pikashow|" + (item.sortOrder || item.title) + "|" + type,
                        type: type === "series" ? "tv" : "movie",
                        year: item.y || item.year
                    }));
                })
                .catch(() => []);
        });

        return Promise.all(promises).then(results => results.flat());
    },

    // 2. लिंक लॉजिक: यहाँ से 1080p, 720p और 480p के अलग-अलग लिंक निकलेंगे
    loadLinks: function(data) {
        const parts = data.split("|");
        const videoId = parts[1];
        const type = parts[2];
        const headers = this.getHeaders();

        // कोटलिन वाला वीडियो API पाथ
        const url = this.mainUrl + "/v1/api/video?type=" + type + "&videoId=" + videoId + "&title=" + videoId + "&noseasons=1&noepisodes=0";

        return fetch(url, { headers })
            .then(res => res.json())
            .then(json => {
                const links = [];
                if (json.data) {
                    const v = json.data;
                    
                    // अगर API में 'resolutions' की लिस्ट है (जैसा कोटलिन कोड में था)
                    if (v.resolutions && v.resolutions.length > 0) {
                        v.resolutions.forEach(res => {
                            links.push({
                                name: "PikaShow " + (res.label || "HD"),
                                url: res.url,
                                quality: res.label, // 1080p, 720p आदि
                                headers: { "Referer": "https://samui390dod.com/" },
                                type: "m3u8"
                            });
                        });
                    } 
                    // अगर रेजोल्यूशन नहीं है तो डायरेक्ट प्ले URL उठाओ
                    else if (v.playUrl || v.videoUrl) {
                        links.push({
                            name: "PikaShow Default Server",
                            url: v.playUrl || v.videoUrl,
                            quality: v.q || "720p",
                            headers: { "Referer": "https://samui390dod.com/" },
                            type: "m3u8"
                        });
                    }
                }
                return links;
            })
            .catch(() => []);
    }
};

export default Pikashow;
