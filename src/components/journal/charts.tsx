import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { money } from "@/lib/journal/format";
import type { EquityPoint } from "@/lib/journal/stats";

function ChartTip({
  active,
  payload,
  label,
  labelFmt,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color?: string }[];
  label?: string | number;
  labelFmt?: (v: string | number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]">
      <p className="mb-1 text-muted-foreground">
        {labelFmt ? labelFmt(label ?? "") : label}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="tabular text-foreground">
          {money(p.value, { sign: true })}
        </p>
      ))}
    </div>
  );
}

export function EquityChart({ data }: { data: EquityPoint[] }) {
  const points = data.map((d) => ({
    t: d.t,
    equity: Math.round(d.equity * 100) / 100,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-win)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-win)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="t"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(v) => format(v, "MMM d")}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={28}
        />
        <YAxis
          tickFormatter={(v) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
          }
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={52}
          domain={["auto", "auto"]}
        />
        <Tooltip
          content={
            <ChartTip labelFmt={(v) => format(Number(v), "MMM d, yyyy")} />
          }
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke="var(--color-win)"
          strokeWidth={1.6}
          fill="url(#eqFill)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DailyBarChart({
  data,
}: {
  data: { date: string; pnl: number }[];
}) {
  const last = data.slice(-40);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={last} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => format(new Date(v), "d")}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<ChartTip labelFmt={(v) => format(new Date(String(v)), "EEE, MMM d")} />} />
        <Bar dataKey="pnl" radius={[3, 3, 0, 0]} isAnimationActive={false}>
          {last.map((d) => (
            <Cell
              key={d.date}
              fill={d.pnl >= 0 ? "var(--color-win)" : "var(--color-loss)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GroupBarChart({
  data,
  labelWidth = 72,
}: {
  data: { key: string; pnl: number }[];
  labelWidth?: number;
}) {
  const rows = [...data].slice(0, 8);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="key"
          width={labelWidth}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTip />} />
        <Bar dataKey="pnl" radius={[0, 3, 3, 0]} isAnimationActive={false}>
          {rows.map((d) => (
            <Cell
              key={d.key}
              fill={d.pnl >= 0 ? "var(--color-win)" : "var(--color-loss)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
