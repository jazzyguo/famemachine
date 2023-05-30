type Published = {
    twitter?: { tweet_url: string, published_at: string }[]
}

type SavedClip = {
    url: string;
    key: string;
    saved?: boolean;
    published: Published | undefined;
};

type TempClip = SavedClip & {
    created_at: string;
};
v