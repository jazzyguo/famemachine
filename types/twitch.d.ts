type TwitchVideo = {
    id: string;
    title: string;
    url: string;
    thumbnail_url: string;
    created_at: string;
    duration?: string;
};

type RefreshTokenActionProps = {
    userId: string;
    refreshToken: string;
    addConnection: (connection: string, obj: { [key: string]: string }) => void;
};

type Actions = {
    fetchTwitchVideos: ({
        twitchUserId,
        twitchAccessToken,
        addConnection,
        userId,
        refreshToken,
    }: RefreshTokenActionProps & {
        twitchUserId: string;
        twitchAccessToken: string;
    }) => void;
    fetchTwitchVideo: ({
        twitchAccessToken,
        videoId,
        addConnection,
        userId,
        refreshToken,
    }: RefreshTokenActionProps & {
        twitchAccessToken: string;
        videoId: string;
    }) => void;
    reset: () => void;
};
