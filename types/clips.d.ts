type SavedClip = {
    url: string;
    key: string;
    saved?: boolean;
};

type TempClip = SavedClip & {
    created_at: string;
};
v