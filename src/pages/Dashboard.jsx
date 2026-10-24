import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await api.get("/stats");
            setStats(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatSize = (bytes) => {

        if (!bytes) {
            return "0 Bytes";
        }

        const sizes = ["Bytes", "KB", "MB", "GB"];

        const i = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, i)).toFixed(2)
            + " "
            + sizes[i]
        );
    };

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    if (!stats) {
        return <h2>Unable to load dashboard.</h2>;
    }

    return (
        <div>

            <h1>Dashboard</h1>

            <p>
                S3 Cloud Storage Simulator
            </p>

            <div className="stats-grid">

                <div className="card">
                    <h3>Total Buckets</h3>
                    <h2>{stats.totalBuckets}</h2>
                </div>

                <div className="card">
                    <h3>Total Objects</h3>
                    <h2>{stats.totalObjects}</h2>
                </div>

                <div className="card">
                    <h3>Total Storage</h3>
                    <h2>
                        {formatSize(stats.totalStorage)}
                    </h2>
                </div>

                <div className="card">
                    <h3>Total Versions</h3>
                    <h2>{stats.totalVersions}</h2>
                </div>

            </div>

            <div className="card">

                <h2>Recent Buckets</h2>

                {stats.recentBuckets.length === 0 ? (

                    <p>No buckets created yet.</p>

                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>Bucket Name</th>
                                <th>Region</th>
                                <th>Created</th>
                            </tr>
                        </thead>

                        <tbody>

                            {stats.recentBuckets.map((bucket) => (

                                <tr key={bucket._id}>

                                    <td>{bucket.name}</td>

                                    <td>{bucket.region}</td>

                                    <td>
                                        {new Date(
                                            bucket.createdAt
                                        ).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default Dashboard;