const name = "Pikashow Pro (Vidsrc)";
const id = "vidsrc_pika";

async function getSources(movieId, type) {
    // यहाँ 'vidsrc.xyz' या 'vidsrc.pm' का उपयोग करें, ये ज़्यादा स्टेबल हैं
    const baseUrl = "https://vidsrc.xyz/embed";
    
    try {
        const url = type === "movie" 
            ? `${baseUrl}/movie/${movieId}` 
            : `${baseUrl}/tv/${movieId}`;

        return [{
            name: "Pikashow Multi-Source",
            url: url,
            type: "embed",
            headers: {
                "Referer": "https://vidsrc.xyz/",
                "User-Agent": "Mozilla/5.0"
            }
        }];
    } catch (error) {
        return [];
    }
}
