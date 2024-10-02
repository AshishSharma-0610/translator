import express from 'express';
import cors from 'cors';
import { translate } from '@vitalets/google-translate-api';


const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post('/translate', async (req, res) => {
    try {
        const { text, from, to } = req.body;
        const { text: translatedText } = await translate(text, { from, to });
        res.json({ translatedText });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});