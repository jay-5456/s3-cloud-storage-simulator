import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import api from "../services/api";

// Colors for charts
const PIE_COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#db2777"
];

function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = async () => {
        try {
            const response = await api.get("/analytics");
            setData(response.data);
        } catch (error) {
            console.error("Analytics error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    const formatSize = (bytes) => {
        if (!bytes) return "0 Bytes";

        const sizes = ["Bytes", "KB", "MB", "GB"];

        const i = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, i)).toFixed(2) +
            " " +
            sizes[i]
        );
    };

    if (loading) {
        return <h2>Loading analytics...</h2>;
    }

    if (!data) {
        return <h2>Unable to load analytics.</h2>;
    }

    return (
        <div className="analytics-page">

            {/* PAGE HEADER */}

            <div className="page-header">
                <div>
                    <h1>Analytics</h1>
                    <p>
                        Storage and object usage analysis
                    </p>
                </div>
            </div>


            {/* TOP CHARTS */}

            <div className="analytics-grid">

                {/* OBJECTS BY FILE TYPE */}

                <div className="card analytics-card">

                    <div className="analytics-card-header">
                        <div>
                            <h2>Objects by File Type</h2>
                            <p>
                                Distribution of stored objects
                            </p>
                        </div>
                    </div>

                    {data.fileTypes.length === 0 ? (

                        <div className="empty-chart">
                            <p>No data available.</p>
                        </div>

                    ) : (

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >
                            <PieChart>

                                <Pie
                                    data={data.fileTypes}
                                    dataKey="objects"
                                    nameKey="type"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={115}
                                    innerRadius={55}
                                    paddingAngle={3}
                                    label
                                >

                                    {data.fileTypes.map(
                                        (entry, index) => (

                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    PIE_COLORS[
                                                        index %
                                                        PIE_COLORS.length
                                                    ]
                                                }
                                            />

                                        )
                                    )}

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>
                        </ResponsiveContainer>

                    )}

                </div>


                {/* STORAGE BY FILE TYPE */}

                <div className="card analytics-card">

                    <div className="analytics-card-header">
                        <div>
                            <h2>Storage by File Type</h2>
                            <p>
                                Storage consumed by each type
                            </p>
                        </div>
                    </div>

                    {data.fileTypes.length === 0 ? (

                        <div className="empty-chart">
                            <p>No data available.</p>
                        </div>

                    ) : (

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >
                            <BarChart
                                data={data.fileTypes}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 10,
                                    bottom: 10
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="type"
                                />

                                <YAxis />

                                <Tooltip
                                    formatter={(value) =>
                                        formatSize(value)
                                    }
                                />

                                <Legend />

                                <Bar
                                    dataKey="storage"
                                    name="Storage"
                                    fill="#2563eb"
                                    radius={[
                                        6,
                                        6,
                                        0,
                                        0
                                    ]}
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    )}

                </div>

            </div>


            {/* VERSION ANALYSIS */}

            <div className="card analytics-card analytics-section">

                <div className="analytics-card-header">

                    <div>
                        <h2>Object Version Analysis</h2>

                        <p>
                            Number of versions stored for each object
                        </p>
                    </div>

                </div>

                {data.versions.length === 0 ? (

                    <div className="empty-chart">
                        <p>No version data available.</p>
                    </div>

                ) : (

                    <ResponsiveContainer
                        width="100%"
                        height={400}
                    >

                        <BarChart
                            data={data.versions}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 10,
                                bottom: 50
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="name"
                                angle={-25}
                                textAnchor="end"
                                height={80}
                            />

                            <YAxis
                                allowDecimals={false}
                            />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="versions"
                                name="Versions"
                                fill="#7c3aed"
                                radius={[
                                    6,
                                    6,
                                    0,
                                    0
                                ]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );
}

export default Analytics;