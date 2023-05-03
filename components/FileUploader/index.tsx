import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./FileUploader.module.css";

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedFile) {
            const formData = new FormData();
            formData.append("videoFile", selectedFile);

            // fetch("", {
            //     method: "POST",
            //     body: formData,
            // });
        }
    };

    return (
        <div>
            {selectedFile && (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {selectedFile.name}</p>
                    <p>File Type: {selectedFile.type}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label>
                    Choose a file:
                    <input
                        type="file"
                        accept="video/*"
                        onChange={onFileChange}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FileUploader;
