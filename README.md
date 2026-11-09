# SalesPulse - Executive Sales Analytics Dashboard

A modern, responsive, single-page sales analytics dashboard built with **pure vanilla HTML, CSS, and JavaScript**.

No external frontend frameworks, no backend server, zero CSS variables, and persistent data powered entirely by the browser's native **WebStorage (`localStorage`)**.

---

## Features

- **Executive KPI Cards**: Real-time tracking of Total Revenue, Net Realized Profit, Gross Margin %, Completed Orders, Average Order Value (AOV), and Refund Rate with period-over-period trend badges.
- **Visual Analytics**:
  - **Revenue & Profit Trajectory**: Interactive line/area chart with daily billing trends and net profit.
  - **Category Breakdown**: Doughnut distribution across business units (Software, Hardware, Services, Consulting, Subscriptions).
  - **Channel Volume**: Bar chart comparing Direct Sales, Online Store, Partner, and Wholesale channels.
  - **Quota Attainment & Intel**: Monthly pacing tracker toward a \$150k target with automated forecast calculations.
- **Interactive Drill-Down & Filters**:
  - Filter by Period: *This Month*, *Last 30 Days*, *Last 7 Days*, *This Quarter*, *All Time*, or *Custom Date Range*.
  - Filter by Category and Acquisition Channel.
  - Active filter chips with one-click removal.
- **Sales Ledger & CRUD Operations**:
  - Live search across customers, emails, product names, and order IDs.
  - Sortable columns (Date, Customer, Amount, Profit, Status).
  - Add and Edit transaction modal with instant validation.
  - Delete with safety confirmation modal.
  - Full persistence across page reloads via `localStorage`.
- **Data Portability**:
  - **Export CSV**: Instant RFC-4180 compliant CSV export of filtered data.
  - **Backup & Restore JSON**: Export full database snapshot or restore from a JSON file.
  - **Print / PDF**: Clean executive print stylesheet (`@media print`) for presentations and PDF reports.
- **Offline Resilient**: Built-in HTML5 2D Canvas fallback engine that renders all visual charts even without an internet connection or CDN access.

---

## Tech Stack

- **HTML5**: Semantic single-page layout.
- **CSS3**: Modern responsive layout using Flexbox and Grid with direct hex/rgb literal styling (**strictly zero CSS variables**).
- **JavaScript (ES6+)**: Modular IIFE architecture, pure vanilla JavaScript DOM and event management.
- **Storage**: Browser WebStorage API (`localStorage`).
- **Visualization**: Chart.js via CDN with native HTML5 Canvas fallback.

---

## Getting Started

1. Clone or download this repository.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
   - No build tools, package managers, or local servers required!

---

## License

MIT License. Free to use for personal and commercial projects.
