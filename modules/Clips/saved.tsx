import React from "react";
import { useGetSavedClipsQuery } from "@/api/clips";
import { useAuth } from "@/contexts/AuthContext";

const SavedClipsModule = () => {
    const { user } = useAuth();

    const { data, error, isLoading, isSuccess } = useGetSavedClipsQuery(
        user.uid
    );

    console.log({ data, error, isLoading, isSuccess });
    return <div>clips</div>;
};

export default SavedClipsModule;
