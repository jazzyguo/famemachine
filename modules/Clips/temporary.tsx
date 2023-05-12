import React from "react";
import { useGetTemporaryClipsQuery } from "@/api/clips";
import { useAuth } from "@/contexts/AuthContext";

const TemporaryClipsModule = () => {
    const { user } = useAuth();

    const { data, error, isLoading, isSuccess } = useGetTemporaryClipsQuery(
        user.uid
    );

    console.log({ data, error, isLoading, isSuccess });
    return <div>clips</div>;
};

export default TemporaryClipsModule;
