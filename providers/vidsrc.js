const name = "Pikashow Server (Vidsrc)";
const id = "vidsrc_pika";

async function getSources(movieId, type) {
    // यह वही सर्वर है जिससे पिकासो और बड़ी साइट्स लिंक लेती हैं
    const baseUrl = "https://vidsrc.to/embed";
    
    try {
        const url = type === "movie" 
            ? `${baseUrl}/movie/${movieId}` 
            : `${baseUrl}/tv/${movieId}`;

        return [{
            name: "Pikashow Multi-Server",
            url: url,
            type: "embed" 
        }];
    } catch (error) {
        return [];
    }
}
