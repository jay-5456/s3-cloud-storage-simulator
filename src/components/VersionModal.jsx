import api from "../services/api";

function VersionModal({
    fileName,
    versions,
    onClose,
    onRestore
}) {

    return (

        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >

            <div
                style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    width: "700px",
                    maxWidth: "90%"
                }}
            >

                <h2>
                    Version History
                </h2>

                <h3>
                    {fileName}
                </h3>


                {versions.length === 0 ? (

                    <p>
                        No versions found.
                    </p>

                ) : (

                    <table
                        border="1"
                        cellPadding="10"
                        width="100%"
                    >

                        <thead>

                            <tr>

                                <th>
                                    Version
                                </th>

                                <th>
                                    Size
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {versions.map((file) => (

                                <tr key={file._id}>

                                    <td>
                                        v{file.version}
                                    </td>

                                    <td>
                                        {file.size} bytes
                                    </td>

                                    <td>
                                        {new Date(
                                            file.createdAt
                                        ).toLocaleString()}
                                    </td>

                                    <td>

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


                                        <button
                                            onClick={() =>
                                                onRestore(file._id)
                                            }
                                        >
                                            Restore
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}


                <br />

                <button onClick={onClose}>
                    Close
                </button>

            </div>

        </div>

    );

}

export default VersionModal;
