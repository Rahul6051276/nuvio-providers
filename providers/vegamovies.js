const name = "Vegamovies";
const id = "vegamovies";

async function search(query) {
    const url = `https://vegamovies.actor/?s=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const html = await response.text();
    // यहाँ वेबसाइट से डेटा निकालने का लॉजिक रहेगा
    return []; 
}

// यह एक बेसिक स्ट्रक्चर है जिसे Nuvio ऐप पहचानता है
