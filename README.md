# Werewolf Sign

Werewolf Sign is a Python-based interpreter for the Werewolf Hand Gesture Language (WHGL). It uses computer vision and natural language processing to translate hand gestures from video input into text, facilitating silent communication in Werewolf-style games.

## Features

- Interprets 28 unique hand gestures
- Processes video input to extract frames
- Utilizes Claude's vision API for accurate gesture recognition
- Translates gesture sequences into meaningful text

## Installation

1. Clone this repository: git clone https://github.com/CollComm/werewolf-sign.git
2. Install the required packages: pip install -r requirements.txt

## Usage

```python
from werewolf_sign_interpreter import main

video_path = "path_to_your_werewolf_sign_video.mp4"
result = main(video_path)
print("Translated Werewolf Signs:", result)

## Contributing

Contributions to Werewolf Sign are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
