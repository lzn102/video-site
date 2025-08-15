# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Next.js-based multimedia processing tool that provides online video and audio processing capabilities. The application offers four main features:
1. Video audio extraction
2. Speech to subtitle conversion
3. Subtitle translation
4. Video and audio merging

The application is built with Next.js, uses native CSS for styling, and integrates FFmpeg for multimedia processing.

## Project Structure

```
nextjs-app/
├── pages/              # Page components and API routes
│   ├── api/            # Backend API endpoints
│   ├── index.js        # Homepage
│   ├── extract.js      # Video audio extraction page
│   ├── transcribe.js   # Speech to subtitle page
│   ├── translate.js    # Subtitle translation page
│   └── merge.js        # Video audio merge page
├── components/         # Reusable UI components
├── contexts/           # React Context providers
├── lib/                # Utility functions and libraries
├── styles/             # CSS stylesheets
└── public/             # Static assets
```

## Common Development Commands

- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm run start`
- Run linting: `npm run lint`

## Key Technologies

- Next.js 15+ for React framework
- Native CSS for styling (no CSS-in-JS or preprocessors)
- FFmpeg for multimedia processing
- Multer for file upload handling
- next-connect for API route middleware

## Architecture Patterns

1. **File-based routing**: Pages in the `pages/` directory automatically become routes
2. **API routes**: Backend functionality in `pages/api/` with separate files for each endpoint
3. **Component-based UI**: Reusable components in the `components/` directory
4. **Context API**: State management using React Context in the `contexts/` directory
5. **Utility functions**: Multimedia processing functions in the `lib/` directory

## Important Implementation Details

1. **Multimedia Processing**: Uses FFmpeg through the `fluent-ffmpeg` library for all processing operations
2. **File Handling**: Uses Multer middleware for file uploads with temporary storage in `/tmp`
3. **Multilingual Support**: Implements language switching with React Context and localStorage persistence
4. **API Structure**: Each feature has a dedicated API endpoint in `pages/api/`
5. **Frontend Components**: Reusable UploadForm component handles file selection and upload for all features

## Development Considerations

1. FFmpeg must be installed on the system for multimedia processing to work
2. File processing is done in temporary directories and files are cleaned up after processing
3. The application uses client-side language preference storage in localStorage
4. API endpoints return processed files directly as downloads rather than storing them
5. All processing is synchronous and blocking - no queue system is implemented

## Testing

No specific testing framework is configured in this project. Testing would need to be added if required.