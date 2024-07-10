require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');

const app = express();
const upload = multer({ dest: process.env.TEMP_UPLOAD_DIR || 'uploads/' });

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const WHGL_SYSTEM_PROMPT = `
You are an expert in interpreting hand gestures for the Werewolf Hand Gesture Language (WHGL). 
Analyze the image and determine which of the following gestures it most closely matches. 
Respond only with the number or keyword associated with the gesture. If no gesture matches, respond with "Unknown".

Werewolf Hand Gesture Language definitions:
1. One index finger pointing up
2. Two fingers (index and middle finger) pointing up
3. Three fingers (index, middle, and ring finger) pointing up
4. Four fingers (index, middle, ring finger and little fingers) pointing up
5. Five fingers (thumb, index, middle, ring, little fingers) pointing up
6. Two fingers (thumb, little fingers) pointing up
7. Index and middle finger pressed together while the thumb is positioned along the side of the index finger
8. Thumb and index finger pointing up
9. Index finger and thumb form a circle, while the other fingers are curled into the palm
10. Fist with all fingers curled into the palm
11. Index finger pointing down
12. Two fingers (index, middle fingers) pointing down
13. Three fingers (index, middle and ring fingers) pointing down
14. Four fingers (index, middle, ring and little fingers) pointing down
15. Five fingers (thumb, index, middle, ring, and little fingers) pointing down
kill: All fingers extended and pointing to the top right or top left
yes: Thumb pointing up
no: Thumb pointing down
Seer: OK gesture, where the thumb and index finger form a circle, and the remaining fingers are extended upwards
Cupid: Thumb, index and little finger up, while ring and middle finger down
Hunter: Thumb finger pointing to the top left, index and middle fingers pointing to the top right (or vice versa)
Guard: Index, middle fingers pointing to the top left, ring, little fingers pointing to the top right
Witch: All fingers slightly curled and spread apart, making a claw-like gesture
Idiot: Middle and ring fingers up
Sheriff: Index and little fingers up
Traitor: Little finger up
push: All fingers extended and pointing up
hide: All fingers extended and pointing to right or left
`;

app.post('/api/interpret', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
    }

    const videoPath = req.file.path;
    const framesDir = `${videoPath}_frames`;

    // Extract frames from the video using the FRAME_INTERVAL setting
    await new Promise((resolve, reject) => {
        const frameInterval = process.env.FRAME_INTERVAL || 1;
        const maxFrames = process.env.MAX_FRAMES_TO_PROCESS || 30;
        exec(`mkdir ${framesDir} && ffmpeg -i ${videoPath} -vf fps=1/${frameInterval} -frames:v ${maxFrames} ${framesDir}/frame%03d.jpg`, (error) => {
            if (error) {
                console.error('Error extracting frames:', error);
                reject(error);
            } else {
                console.log('Frames extracted successfully');
                resolve();
            }
        });
    });

    const frameFiles = fs.readdirSync(framesDir);
    const maxFramesToProcess = Math.min(frameFiles.length, process.env.MAX_FRAMES_TO_PROCESS || 30);
    console.log(`Processing ${maxFramesToProcess} frames out of ${frameFiles.length} extracted`);

    const interpretations = [];

    for (const frame of frameFiles) {
        const framePath = `${framesDir}/${frame}`;
        const imageBuffer = fs.readFileSync(framePath);
        const base64Image = imageBuffer.toString('base64');

        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1000,
            temperature: 0,
            system: WHGL_SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: "image/jpeg",
                                data: base64Image
                            }
                        },
                        {
                            type: "text",
                            text: "What Werewolf Hand Gesture is shown in this image?"
                        }
                    ]
                }
            ]
        });
        // Extract the text content from the response
        const interpretation = msg.content[0].type === 'text' ? msg.content[0].text.trim() : 'Unknown';
        console.log(`Frame ${frame} interpreted as: ${interpretation}`);
        interpretations.push(interpretation);
    }

    // Clean up
    fs.rmSync(framesDir, { recursive: true, force: true });
    fs.unlinkSync(videoPath);

    res.json({ interpretations });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));