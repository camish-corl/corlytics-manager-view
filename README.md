# Figma Design Prototype

This is a prototype based on the Figma design for a Results page. The prototype implements the design system tokens and styling from the original Figma file.

## Features

- **Design System Compliance**: Uses exact color tokens, typography, and spacing from the Figma design
- **Responsive Design**: Adapts to different screen sizes
- **Interactive Elements**: Hover states and button interactions
- **Modern UI**: Clean, professional interface with proper visual hierarchy

## Design System

The prototype uses the following design tokens from the Figma file:

### Colors
- Primary: `#2c5c65` (Cyan-28)
- Text: `#212529` (Azure-15)
- Secondary Text: `#7c858c` (Grey-52)
- Background: `#f5f8fa` (Grey-97)
- White: `#ffffff`

### Typography
- Font Family: Helvetica
- Font Sizes: 12px, 13px, 14px, 16px
- Font Weights: 400 (Regular), 700 (Bold)

### Spacing
- XS: 8px
- Small: 10px, 12px
- Medium: Various spacing values

## Quick Start (HTML Version)

The easiest way to view the prototype is to open the `index.html` file in your browser:

1. Simply double-click on `index.html` or drag it into your browser
2. The prototype will load immediately with all styling and interactions

## React Version Setup

If you want to run the React version with full development features:

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── index.html              # Standalone HTML version (ready to use)
├── src/                    # React version source code
│   ├── components/
│   │   ├── Results.tsx      # Main Results component
│   │   └── Results.css      # Component styles
│   ├── App.tsx              # Main App component
│   ├── App.css              # App styles
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles and design tokens
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## Build for Production (React Version)

```bash
npm run build
```

## Technologies Used

### HTML Version
- Pure HTML/CSS/JavaScript
- CSS Custom Properties (Design Tokens)
- Responsive Design

### React Version
- React 18
- TypeScript
- Vite
- CSS Custom Properties (Design Tokens)
- Responsive Design

## Design Notes

The prototype faithfully recreates the Figma design with:
- Exact color matching using CSS custom properties
- Proper typography hierarchy with Helvetica font
- Consistent spacing and layout using design tokens
- Interactive states for buttons and filters
- Responsive breakpoints for mobile devices
- Hover effects and transitions

## Interactive Features

- **Filter Buttons**: Click to switch between All, Recent, and Popular filters
- **Pagination**: Click page numbers to navigate through results
- **Action Buttons**: View and Share buttons with hover effects
- **Responsive Design**: Adapts layout for mobile devices

## Browser Compatibility

The prototype works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge 