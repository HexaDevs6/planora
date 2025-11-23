// ============================================================================
// 📊 PLANORA CHARTS DOCUMENTATION
// ============================================================================
//
// This document explains how to use every chart component inside Planora.
// Each chart includes:
// - A description
// - Recommended use cases
// - Required data structure
// - A fully working usage example
//
// All charts are:
// - Wrapped inside ChartCard (Planora-styled UI)
// - Powered by Recharts
// - Fully responsive
// - Light/Dark mode compatible
// - Using Planora Colors & Fonts
//
// ============================================================================
//
// 1) AREA CHART (AreaChartComponent)
// ----------------------------------
// ✔ Best for displaying time-series data (values over time)
// ✔ Ideal for: Bookings Over Time, Revenue Growth, Activity Tracking
//
// 🔹 Data shape:
// [
//   { day: "2025-01-01", bookings: 10 },
//   { day: "2025-01-02", bookings: 15 },
// ]
//
// 🔹 Example:
// <AreaChartComponent
//    title="Bookings Over Time"
//    data={data}
//    xKey="day"
//    yKey="bookings"
// />
//
// ============================================================================
//
// 2) LINE CHART (LineChartComponent)
// ----------------------------------
// ✔ Best for continuous trends and precise tracking
// ✔ Ideal for: Revenue Trends, Daily Active Users, Performance Evolution
//
// 🔹 Data:
// [
//   { month: "Jan", revenue: 3000 },
//   { month: "Feb", revenue: 4200 },
// ]
//
// 🔹 Example:
// <LineChartComponent
//    title="Revenue Growth"
//    data={data}
//    xKey="month"
//    yKey="revenue"
// />
//
// ============================================================================
//
// 3) BAR CHART (BarChartComponent)
// --------------------------------
// ✔ Best for comparing static categories
// ✔ Ideal for: Popular Events, Sales by Category, Top Locations
//
// 🔹 Data:
// [
//   { event_name: "Tech Expo", total_tickets: 300 },
//   { event_name: "AI Summit", total_tickets: 180 },
// ]
//
// 🔹 Example:
// <BarChartComponent
//    title="Popular Events"
//    data={data}
//    xKey="event_name"
//    yKey="total_tickets"
// />
//
// ============================================================================
//
// 4) GROUPED BAR CHART (GroupedBarChart)
// ---------------------------------------
// ✔ Best for multi-metric comparisons per category
// ✔ Ideal for: Event Performance (tickets vs attendees vs revenue)
//
// 🔹 Data:
// [
//   { event_name: "Event A", tickets: 200, attendees: 150, revenue: 5000 },
//   { event_name: "Event B", tickets: 120, attendees: 100, revenue: 3000 },
// ]
//
// 🔹 Example:
// <GroupedBarChart
//    title="Event Performance"
//    data={data}
//    xKey="event_name"
//    keys={["tickets", "attendees", "revenue"]}
// />
//
// ============================================================================
//
// 5) PIE CHART (PieChartComponent)
// --------------------------------
// ✔ Best for simple percentage distributions
// ✔ Ideal for: Ticket Type Distribution, Gender Distribution
//
// 🔹 Data:
// [
//   { name: "VIP", value: 40 },
//   { name: "Regular", value: 120 },
// ]
//
// 🔹 Example:
// <PieChartComponent
//    title="Ticket Types Distribution"
//    data={data}
// />
//
// ============================================================================
//
// 6) DONUT CHART (DonutChartComponent)
// ------------------------------------
// ✔ A more modern variation of Pie Chart
// ✔ Ideal for: User Types, Device Types, Ticket Categories
//
// 🔹 Data:
// [
//   { name: "Hosts", value: 120 },
//   { name: "Clients", value: 350 },
// ]
//
// 🔹 Example:
// <DonutChartComponent
//    title="User Types"
//    data={data}
// />
//
// ============================================================================
//
// 7) RADAR CHART (RadarChartComponent)
// -------------------------------------
// ✔ Best for multidimensional scoring (spider-web chart)
// ✔ Ideal for: Event Quality Scores, User Ratings, Feature Comparison
//
// 🔹 Data:
// [
//   { metric: "Engagement", value: 80 },
//   { metric: "Support", value: 70 },
// ]
//
// 🔹 Example:
// <RadarChartComponent
//    title="Event Quality"
//    data={data}
//    xKey="metric"
//    yKey="value"
// />
//
// ============================================================================
//
// 8) RADIAL PROGRESS (RadialProgressComponent)
// ---------------------------------------------
// ✔ Best for percentage KPIs in a clean, modern circular display
// ✔ Ideal for: Attendance Rate, Completion Percentage, Goal Tracking
//
// 🔹 Data:
// value={75} // (0–100)
//
// 🔹 Example:
// <RadialProgressComponent
//    title="Attendance Rate"
//    value={75}
//    color="var(--chart-1)"   // Optional override
// />
//
// ============================================================================
//
// ✔ All charts automatically use ChartCard UI.
// ✔ All charts support Light/Dark Mode.
// ✔ All components use Planora's color system.
// ✔ Ready to use in any Planora dashboard (Host / Client / Admin).
// ============================================================================

// ==============================================
// Charts Index File (Barrel Export)
// This file collects and exports all chart components
// so they can be easily imported from a single place.
// ==============================================

// Core UI Wrapper
import ChartCard from "./ChartCard";

// Charts
import AreaChartComponent from "./AreaChartComponent";
import LineChartComponent from "./LineChartComponent";
import BarChartComponent from "./BarChartComponent";
import GroupedBarChart from "./GroupedBarChart";
import PieChartComponent from "./PieChartComponent";
import DonutChartComponent from "./DonutChartComponent";
import RadarChartComponent from "./RadarChartComponent";
import RadialProgressComponent from "./RadialProgressComponent";

// Export everything
export {
    ChartCard,
    AreaChartComponent,
    LineChartComponent,
    BarChartComponent,
    GroupedBarChart,
    PieChartComponent,
    DonutChartComponent,
    RadarChartComponent,
    RadialProgressComponent,
};
