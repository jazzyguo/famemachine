type Published = {
    [twitter: string]: { url: string, published_at: string }[]
} | undefined

type SavedClip = {
    url: string;
    key: string;
    published: Published;
};

type TempClip = {
    created_at: string;
    url: string;
    key: string;
};
