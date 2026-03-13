const name = "Vegamovies";
const id = "vegamovies";

async function getSources(movieId) {
    const baseUrl = "https://vegamovies.actor";
    try {
        // यह वेबसाइट से मूवी पेज लोड करेगा
        const response = await fetch(`${baseUrl}/${movieId}`);
        const html = await response.text();
        
        // यह कोड खास तौर पर .m3u8 वाले स्ट्रीमिंग लिंक्स को ढूंढेगा
        const links = [];
        const m3u8Regex = /https?:\/\/[^\s"'<>]+?\.m3u8[^\s"'<>]*/g;
        
        let match;
        while ((match = m3u8Regex.exec(html)) !== null) {
            links.push({
                name: "Vega Streaming Server",
                url: match[0],
                type: "hls" // m3u8 के लिए HLS टाइप ज़रूरी है
            });
        }
        
        return links;
    } catch (error) {
        console.error("Scraper Error:", error);
        return [];
    }
}
