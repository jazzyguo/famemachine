type Published = {
    [twitter: string]: { url: string, published_at: string }[]
} | undefined

type SavedClip = {
    url: string;
    key: string;
    saved?: boolean;
    published: Published;
};

type TempClip = SavedClip & {
    created_at: string;
};
v