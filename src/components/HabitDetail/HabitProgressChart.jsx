import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { parseLocalDate } from "../../utils/dateKey.js"; // FIX: consistent local-date parsing
import styles from "./HabitDetail.module.css";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getDateKey(date) {
  // FIX: `date` here may already be a Date object or a "YYYY-MM-DD" string;
  // normalize both through local-time math (no behavior change for Date
  // objects, but avoids ever routing a string through UTC parsing).
  const d = date instanceof Date ? date : parseLocalDate(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getRangeWindow(range) {
  const rangeMap = {
    week: 7,
    month: 30,
    quarter: 90,
    "half-year": 180,
    year: 365,
  };

  return rangeMap[range] ?? 7;
}

function groupByWeek(logs) {
  const totals = new Map();

  logs.forEach((entry) => {
    const date = parseLocalDate(entry.date); // FIX: local, not UTC, parse
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    weekStart.setDate(date.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);

    const key = getDateKey(weekStart);
    totals.set(key, (totals.get(key) ?? 0) + Number(entry.amount ?? 0));
  });

  return Array.from(totals.entries())
    .map(([date, amount]) => ({
      date,
      amount,
      label: parseLocalDate(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    }))
    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
}

function groupByMonth(logs) {
  const totals = new Map();

  logs.forEach((entry) => {
    const date = parseLocalDate(entry.date); // FIX: local, not UTC, parse
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    totals.set(key, (totals.get(key) ?? 0) + Number(entry.amount ?? 0));
  });

  return Array.from(totals.entries())
    .map(([key, amount]) => ({
      date: `${key}-01`,
      amount,
      label: parseLocalDate(`${key}-01`).toLocaleDateString(undefined, {
        month: "short",
      }),
    }))
    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
}

function HabitProgressChart({ logs = [], target = 0, range = "week" }) {
  const normalizedLogs = logs.filter((log) =>
    Number.isFinite(Number(log.amount)),
  );

  // FIX: memoize the chart-data pipeline so it doesn't rebuild Maps/sort
  // arrays on every unrelated re-render — only when logs/target/range change.
  const { chartData, hasDataInRange } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const cutoff = new Date(now.getTime() - getRangeWindow(range) * DAY_IN_MS);

    const filteredLogs = normalizedLogs.filter((entry) => {
      const entryDate = parseLocalDate(entry.date); // FIX: local, not UTC, parse
      return entryDate >= cutoff && entryDate <= now;
    });

    let data = filteredLogs.map((entry) => ({
      date: getDateKey(entry.date),
      amount: Number(entry.amount ?? 0),
      label: parseLocalDate(entry.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    }));

    if (range === "quarter" || range === "half-year") {
      data = groupByWeek(filteredLogs);
    }

    if (range === "year") {
      data = groupByMonth(filteredLogs);
    }

    return { chartData: data, hasDataInRange: filteredLogs.length > 0 };
  }, [normalizedLogs, range]);

  // FIX: check for "no data in the SELECTED RANGE" after filtering, not just
  // "no data at all". Previously a habit with old logs but nothing in the
  // last 7 days would render a broken/empty chart instead of this message.
  if (!hasDataInRange) {
    return <div className={styles.emptyChart}>No data in this range yet.</div>;
  }

  return (
    <div className={styles.chartCard}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 18, right: 12, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(139, 92, 246, 0.12)"
          />
          <XAxis
            dataKey="label"
            stroke="#6B7280"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6B7280"
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip
            formatter={(value) => [`${value}`, "Amount"]}
            labelFormatter={(label) => `Period: ${label}`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e9d5ff",
              borderRadius: "12px",
              color: "#2d1b4e",
            }}
          />
          <ReferenceLine
            y={target}
            stroke="#EC4899"
            strokeDasharray="4 4"
            ifOverflow="extendDomain"
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ r: 3, fill: "#8B5CF6" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HabitProgressChart;
