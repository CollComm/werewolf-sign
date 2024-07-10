# Werewolf Sign

![Werewolf Sign](./werewolf_sign_6.jpg)

Werewolf Sign is a web-based interpreter for the Werewolf Hand Gesture Language (WHGL). It uses computer vision and natural language processing to translate hand gestures from video input into text, facilitating silent communication in Werewolf-style games.

## Features

- Interprets 28 unique hand gestures
- Processes video input to extract frames
- Utilizes Claude's vision API for accurate gesture recognition
- Translates gesture sequences into meaningful text
- Web-based interface for easy video upload and interpretation
- Displays results in a clear, tabular format

## Technologies

- Frontend: React.js
- Backend: Express.js
- AI: Claude API (Anthropic)
- Video Processing: ffmpeg

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- ffmpeg

### Setup

1. Clone this repository:
   ```
   git clone https://github.com/CollComm/werewolf-sign.git
   cd werewolf-sign
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
    - In the `backend` directory, create a `.env` file with the following content:
      ```
      ANTHROPIC_API_KEY=your_anthropic_api_key_here
      MAX_FRAMES_TO_PROCESS=30
      FRAME_INTERVAL=1
      ```
    - In the `frontend` directory, create a `.env` file with:
      ```
      REACT_APP_API_URL=http://localhost:3010
      ```

## Usage

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open a web browser and navigate to `http://localhost:3000`

4. Use the interface to upload a video file containing Werewolf hand gestures

5. Click "Interpret Signs" to process the video

6. View the results in the table displayed on the page

## Contributing

Contributions to Werewolf Sign are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- This project uses the Claude API from Anthropic for AI-powered gesture recognition.
- ffmpeg is used for video frame extraction.