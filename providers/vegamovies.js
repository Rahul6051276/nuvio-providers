const name = "Vegamovies";
const id = "vegamovies";

async function getSources(movieId) {
    const baseUrl = "https://vegamovies.actor";
    try {
        const response = await fetch(`${baseUrl}/${movieId}`);
        const html = await response.text();
        
        // यह हिस्सा वेबसाइट के 'Download' बटन्स को ढूंढेगा
        const links = [];
        const regex = /href="(https?:\/\/v-cloud\.club\/[^\"]+)"/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
            links.push({
                name: "V-Cloud Server",
                url: match[1]
            });
        }
        return links;
    } catch (error) {
        return [];
    }
}
