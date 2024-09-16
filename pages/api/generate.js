import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const generateAction = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userInput } = req.body;

    if (!userInput || userInput.length < 10) {
        return res.status(400).json({ error: 'User input must be at least 10 characters long.' });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant and personal trainer that generates workout routines." },
                { role: "user", content: `Generate a workout routine based on the following description: ${userInput}` }
            ],
            temperature: 0.7,
            max_tokens: 2048,
            frequency_penalty: 0.1,
            presence_penalty: 0.1,
            top_p: 0.8
        });

        const output = completion.choices[0].message.content;

        if (!output) {
            throw new Error('No workout generated');
        }

        res.status(200).json({ output: { text: output } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while generating the workout.' });
    }
};

export default generateAction;