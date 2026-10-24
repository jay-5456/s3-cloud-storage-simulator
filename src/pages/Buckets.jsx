import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Buckets() {

    const [buckets, setBuckets] = useState([]);

    const [name, setName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        loadBuckets();
    }, []);

    const loadBuckets = async () => {
        const response = await api.get("/buckets");
        setBuckets(response.data);
    };

    const createBucket = async () => {

        if (!name.trim()) {
            alert("Enter bucket name");
            return;
        }

        try {

            await api.post("/buckets", {
                name,
                region: "ap-south-1"
            });

            setName("");

            loadBuckets();

        } catch (error) {
            alert(error.response?.data?.message || "Error");
        }
    };

    const deleteBucket = async (id) => {

        if (!window.confirm("Delete this bucket?")) {
            return;
        }

        await api.delete(`/buckets/${id}`);

        loadBuckets();
    };

    return (
        <div>

            <h1>Buckets</h1>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bucket name"
            />

            <button onClick={createBucket}>
                Create Bucket
            </button>

            <hr />

            {buckets.map((bucket) => (

                <div key={bucket._id}>

                    <h3>{bucket.name}</h3>

                    <p>
                        Region: {bucket.region}
                    </p>

                    <button
                        onClick={() =>
                            navigate(`/bucket/${bucket._id}`)
                        }
                    >
                        Open
                    </button>

                    <button
                        onClick={() =>
                            deleteBucket(bucket._id)
                        }
                    >
                        Delete
                    </button>

                </div>

            ))}

        </div>
    );
}

export default Buckets;