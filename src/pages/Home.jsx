import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>☁ S3 Cloud Storage Simulator</h1>

            <p>
                A dynamic simulation of Amazon S3
                bucket and object management.
            </p>

            <button onClick={() => navigate("/dashboard")}>
                Launch Simulator
            </button>
        </div>
    );
}

export default Home;