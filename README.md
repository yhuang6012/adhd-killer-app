# ADHD Reader App

A React Native application designed to help people with ADHD read more effectively by providing various reading assistance features.

## Features

### 🧩 Core PDF Reading
- Open and view local PDF files
- Automatic reading progress saving
- Image display support

### 🔍 Bionic Reading
- Smart text enhancement for better focus
- Adjustable bold ratio for word highlighting
- Customizable minimum word length

### 🅰️ Typography Customization
- Multiple font options:
  - OpenDyslexic (dyslexia-friendly)
  - Lexend (reading fluency optimized)
  - System fonts
- Adjustable font size and line spacing
- Dark/Light theme support

### 🧠 Focus Mode
- Single line/paragraph focus
- Background text dimming
- Auto-scroll support

### 🔊 Text-to-Speech
- Built-in TTS support
- Adjustable reading speed
- Synchronized text highlighting

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/adhd-reader-app.git
cd adhd-reader-app
```

2. Install dependencies:
```bash
yarn install
```

3. Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

4. Start the development server:
```bash
yarn start
```

5. Run the app:
```bash
# For iOS
yarn ios

# For Android
yarn android
```

## Development Requirements

- Node.js 18 or higher
- React Native development environment
- Xcode (for iOS development)
- Android Studio (for Android development)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Main app screens
├── navigation/     # Navigation configuration
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
├── constants/     # App constants and theme
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
