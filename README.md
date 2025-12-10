# Flight Tracker

A real-time flight tracking application allowing users to search for flights by IATA code and visualize their path on an interactive map.

![alt text](/public/image.png)

## Introduction

Flight Tracker is a modern web application built to provide real-time flight status and trajectory visualization. By integrating with the Aviationstack API, it offers users up-to-the-minute details on flight schedules, airline information, and airport data. The application features a dynamic map interface that simulates aircraft movement between origin and destination, providing an engaging and intuitive user experience.

## Features

- **Real-Time Flight Search**: Instantly look up flights using their IATA designator (e.g., AA123).
- **Interactive Map**: Visualizes flight paths on a global map using Leaflet.
- **Live Tracking Simulation**: extrapolates aircraft position based on scheduled departure and arrival times.
- **Detailed Flight Info**: Displays airline, flight status, origin, and destination details.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Polished UI**: Features a modern, glassmorphic design system with smooth animations.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/) & [Leaflet](https://leafletjs.com/)
- **API**: [Aviationstack API](https://aviationstack.com/)
- **Icons**: React Icons / Custom SVG
- **State Management**: React Hooks (Context/Local State)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Aviationstack API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flight-tracker.git
   cd flight-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   AVIATIONSTACK_API_KEY=your_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open the App**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is licensed under the MIT License.
