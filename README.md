# Wellness Tracker App

A modern, mobile-first **Wellness Tracker Application** designed to help you manage daily habits, track fitness goals, and visualize health trends. This application provides a high-performance, dark-themed experience that works entirely offline using `LocalStorage`, ensuring your data stays private and accessible anytime.

![Project Preview](/public/image.png?raw=true&height=400&width=800)

---

## 🌟 Key Features

- **Daily Habit Dashboard**: Interactive cards to track and log your daily routines in real-time.
- **Goal Management**: Set and update customizable daily targets for water intake, sleep duration, and physical activity.
- **Visual Streak Calendar**: A comprehensive calendar view that uses color-coded heatmaps to visualize your consistency and overall wellness score.
- **Rule-Based Insights**: Receive automated, actionable feedback based on your weekly performance.
- **Dynamic Trend Charts**: High-performance bar and line charts powered by **Chart.js** to monitor your monthly progress.
- **Premium Dark Aesthetic**: A sleek, high-contrast UI designed for visual comfort and modern appeal.
- **Offline First**: Built with `LocalStorage` for instant responsiveness without the need for a backend.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [React-ChartJS-2](https://react-chartjs-2.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Utility**: [date-fns](https://date-fns.org/) for date manipulation

---

## 📖 User Guide

### 1. Daily Tracking
Upon launching the app, you'll see your **Daily Habits**. Simply tap or click on a habit card to mark it as completed or update your progress for the day.

### 2. Setting Goals
Navigate to the **Goal Settings** (under the settings icon) to define your daily success metrics. You can set targets for:
- 💧 **Water Intake** (in Liters)
- 😴 **Sleep Duration** (in Hours)
- 🏃 **Physical Activity** (in Minutes)

### 3. Monitoring Progress
The **Wellness Score** component calculates your overall performance based on habit completion and goal achievements. Use the **Streak Calendar** to identify patterns in your consistency.

### 4. Insights & Trends
Head over to the **Trends** page to view:
- **Weekly Insight Report**: Feedback on where you're excelling and where you can improve.
- **Monthly Progress Chart**: A visual breakdown of how your wellness metrics change over time.

---

## 🛠️ Installation Guide

Follow these steps to set up the project locally:

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.x or higher recommended)
- [npm](https://www.npmjs.com/) (or yarn/pnpm/bun)

### Setup Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/TeamLimitless01/aurobindo_hack_wellness_tracker-.git
   cd wellness
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **View the app**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
src/
├── app/             # Next.js App Router (pages and layouts)
├── components/      # Reusable UI components (HabitCard, Trends, etc.)
├── context/         # React Context for global state management
├── types/           # TypeScript interfaces and types
└── public/          # Static assets
```

---

## 📝 License

This project is open-source and available for educational purposes. Feel free to fork and customize it!

---
*Created with ❤️ for Wellness Enthusiasts.*