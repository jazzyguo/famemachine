type SavedClip = {
    url: string;
    key: string;
};

type TempClip = SavedClip & {
    created_at: string;
};
v