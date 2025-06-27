"use client";

import React, { useMemo, useState } from "react";
import {
  ComposedChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { elements } from "../../AtomModel/elementsData";
import styles from "./DataCharts.module.css";

const COLORS = [
  "#3bc3e2",
  "#60a5fa",
  "#2dd4bf",
  "#a78bfa",
  "#5eead4",
  "#7dd3fc",
  "#818cf8",
  "#22d3ee",
];
const STATE_COLORS = { Gas: "#a78bfa", Solid: "#60a5fa", Liquid: "#2dd4bf" };

interface TooltipPayload {
  name: NameType;
  value: ValueType;
  color: string;
  payload: {
    fullName?: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

const FullscreenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const fullName = payload[0].payload.fullName;
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>
          {label} {fullName ? `(${fullName})` : ""}
        </p>
        {payload.map((pld, index: number) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name} : ${pld.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderLegendText = (value: string) => {
  return (
    <span
      style={{ color: "#e2e8f0", paddingLeft: "5px", paddingRight: "15px" }}
    >
      {value}
    </span>
  );
};

export const DataCharts = () => {
  const [fullscreenChart, setFullscreenChart] =
    useState<React.ReactNode | null>(null);

  const nucleonsVsElectronsData = useMemo(
    () =>
      elements.map((el) => ({
        name: el.symbol,
        fullName: el.name,
        "Total Nucleons": el.protons + el.neutrons,
        "Number of Electrons": el.protons,
      })),
    []
  );

  const meltingBoilingData = useMemo(
    () =>
      elements
        .filter((el) => el.meltingPointK !== null && el.boilingPointK !== null)
        .map((el) => ({
          name: el.symbol,
          fullName: el.name,
          "Melting Point (K)": el.meltingPointK,
          "Boiling Point (K)": el.boilingPointK,
        })),
    []
  );

  const stateOfMatterData = useMemo(() => {
    const states = elements.reduce((acc, el) => {
      acc[el.stateAtSTP] = (acc[el.stateAtSTP] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(states).map(([name, value]) => ({ name, value }));
  }, []);

  const stableIsotopesData = useMemo(
    () =>
      elements.map((el) => ({
        name: el.symbol,
        fullName: el.name,
        "Stable Isotopes": el.stableNeutrons.length,
      })),
    []
  );

  const liquidRangeData = useMemo(
    () =>
      elements
        .filter((el) => el.meltingPointK && el.boilingPointK)
        .map((el) => ({
          name: el.symbol,
          fullName: el.name,
          x: el.meltingPointK,
          y: el.boilingPointK,
        })),
    []
  );

  const shellCountData = useMemo(
    () =>
      elements.map((el) => ({
        name: el.symbol,
        fullName: el.name,
        "Electron Shells": el.shells.length,
      })),
    []
  );

  const neutronToProtonRatioData = useMemo(
    () =>
      elements
        .filter((el) => el.protons > 0)
        .map((el) => ({
          name: el.symbol,
          fullName: el.name,
          "N/Z Ratio": parseFloat((el.neutrons / el.protons).toFixed(3)),
        })),
    []
  );

  const valenceElectronsData = useMemo(
    () =>
      elements.map((el) => ({
        name: el.symbol,
        fullName: el.name,
        "Valence Electrons": el.shells[el.shells.length - 1],
      })),
    []
  );

  const nuclearStabilityData = useMemo(
    () =>
      elements.map((el) => ({
        name: el.symbol,
        fullName: el.name,
        protons: el.protons,
        neutrons: el.neutrons,
      })),
    []
  );

  const nzLineData = useMemo(
    () => [
      { neutrons: 0, protons: 0 },
      { neutrons: 180, protons: 180 },
    ],
    []
  );

  const shellFillingData = useMemo(
    () =>
      elements.map((el) => ({
        name: el.symbol,
        fullName: el.name,
        "Shell K (n=1)": el.shells[0] || 0,
        "Shell L (n=2)": el.shells[1] || 0,
        "Shell M (n=3)": el.shells[2] || 0,
        "Shell N (n=4)": el.shells[3] || 0,
        "Shell O (n=5)": el.shells[4] || 0,
        "Shell P (n=6)": el.shells[5] || 0,
        "Shell Q (n=7)": el.shells[6] || 0,
      })),
    []
  );

  const chartsData = [
    {
      id: "nucleonsVsElectrons",
      title: "Nucleons vs. Electrons",
      component: (
        <ResponsiveContainer>
          <ComposedChart data={nucleonsVsElectronsData}>
            <defs>
              <linearGradient id="colorNucleons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} interval={9} />
            <YAxis tick={{ fill: "#94a3b8" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={renderLegendText}
            />
            <Area
              type="natural"
              dataKey="Total Nucleons"
              stroke={COLORS[1]}
              strokeWidth={2}
              fill="url(#colorNucleons)"
            />
            <Line
              type="natural"
              dataKey="Number of Electrons"
              stroke={COLORS[3]}
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "neutronToProtonRatio",
      title: "Neutron to Proton (N/Z) Ratio",
      component: (
        <ResponsiveContainer>
          <AreaChart data={neutronToProtonRatioData}>
            <defs>
              <linearGradient id="colorNZ" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} interval={5} />
            <YAxis tick={{ fill: "#94a3b8" }} domain={[0.8, 1.6]} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={renderLegendText}
            />
            <Area
              type="monotone"
              dataKey="N/Z Ratio"
              stroke={COLORS[0]}
              strokeWidth={2}
              fill="url(#colorNZ)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "meltingBoilingPoints",
      title: "Melting & Boiling Points (K)",
      component: (
        <ResponsiveContainer>
          <LineChart data={meltingBoilingData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} interval={9} />
            <YAxis tick={{ fill: "#94a3b8" }} domain={[0, 6000]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={renderLegendText}
            />
            <Line
              type="monotone"
              dataKey="Melting Point (K)"
              stroke={COLORS[1]}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Boiling Point (K)"
              stroke={COLORS[2]}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "liquidRange",
      title: "Liquid Range (Boiling vs Melting)",
      component: (
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis
              type="number"
              dataKey="x"
              name="Melting Point"
              unit="K"
              tick={{ fill: "#94a3b8" }}
              domain={[0, 4000]}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Boiling Point"
              unit="K"
              tick={{ fill: "#94a3b8" }}
              domain={[0, 6000]}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<CustomTooltip />}
            />
            <Scatter name="Elements" data={liquidRangeData} fill={COLORS[5]} />
          </ScatterChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "nuclearStability",
      title: "Map of Nuclear Stability",
      component: (
        <ResponsiveContainer>
          <ComposedChart>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis
              type="number"
              dataKey="neutrons"
              name="Neutrons"
              tick={{ fill: "#94a3b8" }}
              domain={[0, 180]}
            />
            <YAxis
              type="number"
              dataKey="protons"
              name="Protons"
              tick={{ fill: "#94a3b8" }}
              domain={[0, 120]}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<CustomTooltip />}
            />
            <Legend
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={renderLegendText}
            />
            <Scatter
              name="Stable Nuclides"
              data={nuclearStabilityData}
              fill={COLORS[6]}
            />
            <Line
              name="N=Z Line"
              data={nzLineData}
              dataKey="protons"
              stroke="#e2e8f0"
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "shellFilling",
      title: "Electron Shell Filling",
      component: (
        <ResponsiveContainer>
          <LineChart data={shellFillingData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} interval={9} />
            <YAxis tick={{ fill: "#94a3b8" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={renderLegendText}
            />
            <Line
              type="monotone"
              dataKey="Shell K (n=1)"
              stroke={COLORS[0]}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Shell L (n=2)"
              stroke={COLORS[1]}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Shell M (n=3)"
              stroke={COLORS[2]}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Shell N (n=4)"
              stroke={COLORS[3]}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Shell O (n=5)"
              stroke={COLORS[4]}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Shell P (n=6)"
              stroke={COLORS[5]}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Shell Q (n=7)"
              stroke={COLORS[6]}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "stateOfMatter",
      title: "State of Matter at STP",
      component: (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={stateOfMatterData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={150}
              label
            >
              {stateOfMatterData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATE_COLORS[entry.name as keyof typeof STATE_COLORS]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={renderLegendText}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "valenceElectrons",
      title: "Valence Electrons",
      component: (
        <ResponsiveContainer>
          <BarChart data={valenceElectronsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} interval={5} />
            <YAxis tick={{ fill: "#94a3b8" }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={renderLegendText}
            />
            <Bar dataKey="Valence Electrons" fill={COLORS[5]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "stableIsotopes",
      title: "Number of Stable Isotopes",
      component: (
        <ResponsiveContainer>
          <BarChart data={stableIsotopesData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} interval={5} />
            <YAxis tick={{ fill: "#94a3b8" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={renderLegendText}
            />
            <Bar dataKey="Stable Isotopes" fill={COLORS[4]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "electronShells",
      title: "Number of Electron Shells",
      component: (
        <ResponsiveContainer>
          <LineChart data={shellCountData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} interval={5} />
            <YAxis
              tick={{ fill: "#94a3b8" }}
              allowDecimals={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "30px" }}
              formatter={renderLegendText}
            />
            <Line
              type="step"
              dataKey="Electron Shells"
              stroke={COLORS[6]}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <>
      <div className={styles.chartsGrid}>
        {chartsData.map((chart) => (
          <div key={chart.id} className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>{chart.title}</h3>
            <button
              onClick={() => setFullscreenChart(chart.component)}
              className={styles.fullscreenButton}
              aria-label={`View ${chart.title} in fullscreen`}
            >
              <FullscreenIcon />
            </button>
            <div className={styles.chartContent}>{chart.component}</div>
          </div>
        ))}
      </div>

      {fullscreenChart && (
        <div className={styles.modal}>
          <button
            onClick={() => setFullscreenChart(null)}
            className={styles.closeButton}
            aria-label="Close fullscreen view"
          >
            &times;
          </button>
          <div className={styles.modalContent}>{fullscreenChart}</div>
        </div>
      )}
    </>
  );
};
