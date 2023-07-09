type TwitchVideo = {
    id: string;
    title: string;
    url: string;
    thumbnail_url: string;
    created_at: string;
    duration?: string;
};

type RefreshTokenActionProps = {
    twitchUserId: string;
    userId: string;
    refreshToken: string;
    addConnection: (connection: string, obj: { [key: string]: string }) => void;
};
