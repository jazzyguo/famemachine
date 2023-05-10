import React, { useState, ChangeEvent, FormEvent } from "react";
import Loading from "@/components/Loading";
import VideoContainer from "./VideoContainer";
import styles from "./FileUploader.module.scss";

type Props = {
    onFileUpload: (formData: FormData) => void;
    loading: boolean;
};

const FileUploader = ({ onFileUpload, loading }: Props) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedFile) {
            const formData = new FormData();
            formData.append("videoFile", selectedFile);
            onFileUpload(formData);
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <VideoContainer
                selectedFile={selectedFile}
                disabled={loading}
                onFileChange={onFileChange}
            />
            {loading && <Loading />}
        </form>
    );
};

export default React.memo(FileUploader);
