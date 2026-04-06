import fs from 'fs';
const apiKey = "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";
const apiMessages = [
    {
        role: "user",
        parts: [{ text: "Hello" }]
    }
];

try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: apiMessages })
    });
    console.log("Status:", response.status);
    const data = await response.text();
    console.log("Response:", data);
} catch (e) {
    console.log("Error:", e);
}
