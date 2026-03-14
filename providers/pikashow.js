// PikaShow Provider for Nuvio
const pikashow = {
    id: "pikashow",
    name: "PikaShow",
    mainUrl: "https://manoda.co",
    
    // कोटलिन कोड से निकाले गए हेडर्स
    getHeaders: () => {
        return {
            "Host": "manoda.co",
            "user-agent": "Pikashow/2509030 (Android 13; Pixel 5; Channel/pikashow)",
            "Referer": "https://samui390dod.com/",
            "Origin": "https://samui390dod.com"
        };
    },

    // सर्च और होम पेज लॉजिक
    search: async (query) => {
        const url = `https://manoda.co/v1/api/videos?type=bollywood&channel=pikashow`;
        const res = await fetch(url, { headers: pikashow.getHeaders() });
        const data = await res.json();
        
        return data.records.map(m => ({
            title: m.t,
            url: m.url || m.sortOrder.toString(),
            poster: m.c,
            year: m.y,
            type: "movie"
        })).filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
    },

    // लिंक निकालने का लॉजिक (Load Links)
    loadLinks: async (id) => {
        // यहाँ हम सीधे वीडियो API को कॉल करेंगे जैसा कोटलिन में था
        const videoApi = `https://manoda.co/v1/api/video?type=bollywood&videoId=${id}&title=movie&noseasons=1&noepisodes=0`;
        const res = await fetch(videoApi, { headers: pikashow.getHeaders() });
        const json = await res.json();
        
        if (json.data && json.data.playUrl) {
            return [{
                name: "PikaShow Server",
                url: json.data.playUrl,
                quality: "720p",
                type: "m3u8"
            }];
        }
        return [];
    }
};

export default pikashow;
