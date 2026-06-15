# 🔴 Mars Rover Photo Explorer

A stunning, dark-themed web app for browsing real photos from NASA's Mars rovers.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

## Features

- **4 Rovers** — Curiosity, Opportunity, Perseverance, Spirit
- **Flexible Filters** — Search by Sol (Martian day) or Earth date
- **Camera Filter** — Dynamically shows only cameras available for the selected rover
- **Responsive Grid** — 4 columns on desktop, 2 on tablet, 1 on mobile
- **Photo Lightbox** — Full-size images with metadata and keyboard navigation (← →)
- **Load More** — Paginated results from NASA's API
- **Error Handling** — Graceful error and empty-state displays
- **Space Aesthetic** — Dark theme with starfield background and glassmorphic cards

## Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd mars-rover-explorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API key

Copy the example env file and add your NASA API key:

```bash
cp .env.example .env
```

Edit `.env` and replace `your_api_key_here` with your key from [api.nasa.gov](https://api.nasa.gov).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── RoverSelector.jsx   # Rover picker cards
│   ├── FilterBar.jsx       # Sol/date/camera filters
│   ├── PhotoGrid.jsx       # Responsive photo grid + loading/error states
│   ├── PhotoModal.jsx      # Lightbox with metadata
│   └── LoadMoreButton.jsx  # Pagination
├── data/
│   └── roverCameras.js     # Static rover & camera data
├── hooks/
│   └── useRoverPhotos.js   # API fetch logic
├── App.jsx                 # Main layout
├── main.jsx                # Entry point
└── index.css               # Tailwind + custom theme
```

## Deployment (Vercel)

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add environment variable `VITE_NASA_API_KEY` in Vercel dashboard
4. Deploy!

## API Reference

This app uses the [NASA Mars Rover Photos API](https://api.nasa.gov).

## License

MIT
