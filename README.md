# Mijo

> **Mijo** is a vegetarian nutrition planner and tracker. It helps you plan meals and follow daily nutrition goals.

![Mijo screenshot](screenshot.png)

---

## Highlights

### Advanced Nutrition Analysis

Mijo calculates daily nutrition totals in real time:

* **Macronutrients and energy**: calories, protein, carbohydrates, fat, and fiber.
* **Essential vitamins**: vitamins A, C, B9, B6, E, and K.
* **Key minerals**: iron, calcium, zinc, magnesium, and selenium.
* **Amino acid profile**: lysine, methionine, leucine, and threonine.
* **Essential fatty acids**: omega-3 and omega-6 tracking.

### Personalized Profiles and Goals

* **Needs calculator**: generates personalized targets from age, sex, height, weight, and activity level.
* **Adjustable calorie goals**: supports deficit, maintenance, and surplus targets.
* **Meal targets**: shows how each meal contributes to the full day.

### Meal Planning and History

* **Seasonal food catalog**: search and select from plant-based foods with seasonal indicators.
* **Favorite meals**: save common food combinations and reuse them quickly.
* **Daily history**: track past days and validate the current day with a nutrition completion score.
* **Helpful empty states**: contextual guidance appears when no meal has been planned yet.

### Local Data and Portability

* **Local persistence**: meals, history, and profiles are stored in browser localStorage.
* **JSON import/export**: back up data or transfer it to another device.

---

## Tech Stack

Mijo is built with:

* **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Primitives**: [Radix UI](https://www.radix-ui.com/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## Quick Start

### Prerequisites

Install [Node.js](https://nodejs.org/) on your machine.

### Installation

Install dependencies:

```bash
npm install
```

### Development Commands

Start the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Run type checking and build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```text
src/
+-- components/          # Reusable UI components
|   +-- layout/          # Main layout and utility navigation
|   +-- views/           # Primary application views
+-- data/                # Vegetarian food catalog and nutrient metadata
+-- hooks/               # Local state and browser persistence hooks
+-- types/               # TypeScript domain interfaces
+-- utils/               # Nutrition calculations and shared utilities
+-- App.tsx              # Application root
+-- main.tsx             # Application entry point
+-- index.css            # Tailwind 4 setup and theme styles
```

---

## Data Privacy

Mijo runs entirely on the client side. Nutrition data and personal profile data stay in the browser and are stored locally on the device.
