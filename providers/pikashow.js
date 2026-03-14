const Pikashow = {
    id: "pikashow",
    name: "PikaShow",
    mainUrl: "https://manoda.co",

    // कोटलिन वाले सुरक्षा हेडर्स
    getHeaders: function() {
        return {
            "Host": "manoda.co",
            "user-agent": "Pikashow/2509030 (Android 13; Pixel 5; Channel/pikashow)",
            "Accept-Encoding": "gzip",
            "Connection": "Keep-Alive"
        };
    },

    // होमपेज और सर्च (दोनों के लिए एक ही लॉजिक)
    getMainPage: function() {
        return this.search("bollywood"); 
    },

    search: function(query) {
        const url = this.mainUrl + "/v1/api/videos?type=bollywood&channel=pikashow";
        
        return fetch(url, { headers: this.getHeaders() })
            .then(res => res.json())
            .then(data => {
                if (!data.records) return [];
                return data.records.map(m => ({
                    name: m.t,
                    poster: m.c,
                    // हम 'id' और 'type' को लिंक में स्टोर कर रहे हैं
                    link: "pikashow:" + m.sortOrder + ":bollywood",
                    type: "movie"
                }));
            });
    },

    // वीडियो लिंक निकालने के लिए (असली जादू यहाँ है)
    loadLinks: function(data) {
        const parts = data.split(":");
        const videoId = parts[1];
        const type = parts[2];

        // कोटलिन वाली वीडियो API
        const videoApi = this.mainUrl + "/v1/api/video?type=" + type + "&videoId=" + videoId + "&title=movie&noseasons=1&noepisodes=0";

        return fetch(videoApi, { headers: this.getHeaders() })
            .then(res => res.json())
            .then(json => {
                const results = [];
                if (json.data) {
                    const v = json.data;
                    // अगर डायरेक्ट लिंक मिलता है
                    const streamUrl = v.playUrl || v.videoUrl || v.url;
                    
                    if (streamUrl) {
                        results.push({
                            name: "PikaShow - " + (v.q || "HD"),
                            url: streamUrl,
                            headers: {
                                "Referer": "https://samui390dod.com/",
                                "Origin": "https://samui390dod.com",
                                "user-agent": v.uastr || "Mozilla/5.0"
                            },
                            type: streamUrl.includes("m3u8") ? "m3u8" : "mp4"
                        });
                    }
                }
                return results;
            });
    }
};

export default Pikashow;
