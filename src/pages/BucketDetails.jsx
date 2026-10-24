import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import VersionModal from "../components/VersionModal";

function BucketDetails() {

    const { id } = useParams();

    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Versioning states
    const [showVersions, setShowVersions] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [selectedVersions, setSelectedVersions] = useState([]);


    // ==========================================
    // LOAD FILES
    // ==========================================

    const loadFiles = async () => {

        try {

            const response = await api.get(
                `/files/bucket/${id}`
            );

            setFiles(response.data);

        } catch (error) {

            console.error(error);

        }

    };


    useEffect(() => {

        loadFiles();

    }, [id]);


    // ==========================================
    // UPLOAD FILE
    // ==========================================

    const uploadFile = async () => {

        if (!selectedFile) {

            alert("Please select a file");

            return;

        }

        const formData = new FormData();

        formData.append("file", selectedFile);

        try {

            setUploading(true);

            await api.post(
                `/files/upload/${id}`,
                formData
            );

            alert("File uploaded successfully");

            setSelectedFile(null);

            document.getElementById("fileInput").value = "";

            loadFiles();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Upload failed"
            );

        } finally {

            setUploading(false);

        }

    };


    // ==========================================
    // DELETE FILE
    // ==========================================

    const deleteFile = async (fileId) => {

        if (!window.confirm("Delete this file?")) {

            return;

        }

        try {

            await api.delete(
                `/files/${fileId}`
            );

            loadFiles();

        } catch (error) {

            console.error(error);

            alert("Delete failed");

        }

    };


    // ==========================================
    // VIEW VERSION HISTORY
    // ==========================================

    const viewVersions = (fileName) => {

        const versions = files
            .filter(
                (file) =>
                    file.originalName === fileName
            )
            .sort(
                (a, b) =>
                    b.version - a.version
            );

        setSelectedFileName(fileName);
        setSelectedVersions(versions);
        setShowVersions(true);

    };
    // ==========================================
// RESTORE VERSION
// ==========================================

const restoreVersion = async (fileId) => {

    try {

        const response = await api.post(
            `/files/restore/${fileId}`
        );

        alert(response.data.message);

        setShowVersions(false);

        loadFiles();

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Restore failed"
        );

    }

};

    // ==========================================
    // FORMAT FILE SIZE
    // ==========================================

    const formatSize = (bytes) => {

        if (!bytes) return "0 Bytes";

        const sizes = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];

        const i = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, i)).toFixed(2)
            + " "
            + sizes[i]
        );

    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div>

            <h1>Bucket Objects</h1>

            <p>
                Bucket ID: {id}
            </p>


            {/* =====================================
                UPLOAD
            ====================================== */}

            <div>

                <h2>Upload Object</h2>

                <input
                    id="fileInput"
                    type="file"
                    onChange={(e) =>
                        setSelectedFile(e.target.files[0])
                    }
                />

                <button
                    onClick={uploadFile}
                    disabled={uploading}
                >

                    {uploading
                        ? "Uploading..."
                        : "Upload File"}

                </button>

            </div>


            <hr />


            {/* =====================================
                OBJECTS
            ====================================== */}

            <h2>
                Objects ({files.length})
            </h2>


            {files.length === 0 ? (

                <p>
                    No objects in this bucket.
                </p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                >

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Type</th>

                            <th>Size</th>

                            <th>Version</th>

                            <th>Actions</th>

                        </tr>

                    </thead>


                    <tbody>

                        {files.map((file) => (

                            <tr key={file._id}>

                                <td>
                                    {file.originalName}
                                </td>

                                <td>
                                    {file.type}
                                </td>

                                <td>
                                    {formatSize(file.size)}
                                </td>

                                <td>
                                    v{file.version}
                                </td>

                                <td>

                                    {/* Download */}

                                    <button
                                        onClick={() =>
                                            window.open(
                                                `http://localhost:5000/api/files/download/${file._id}`,
                                                "_blank"
                                            )
                                        }
                                    >
                                        Download
                                    </button>


                                    {/* Version History */}

                                    <button
                                        onClick={() =>
                                            viewVersions(
                                                file.originalName
                                            )
                                        }
                                    >
                                        Versions
                                    </button>


                                    {/* Delete */}

                                    <button
                                        onClick={() =>
                                            deleteFile(file._id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}


            {/* =====================================
                VERSION MODAL
            ====================================== */}

            {showVersions && (

                <VersionModal
    fileName={selectedFileName}
    versions={selectedVersions}
    onClose={() =>
        setShowVersions(false)
    }
    onRestore={restoreVersion}
/>

            )}

        </div>

    );

}

export default BucketDetails;
