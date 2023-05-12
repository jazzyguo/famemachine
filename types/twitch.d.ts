type TwitchVideo = {
    id: string;
    title: string;
    url: string;
    thumbnail_url: string;
    created_at: string;
    duration?: string;
};

interface TwitchState {
    videos: TwitchVideo[];
    loading: boolean;
    error: any;
    pagination: {
        cursor: string | null;
        isLastPage: boolean;
    };
}

type RefreshTokenActionProps = {
    userId: string;
    refreshToken: string;
    addConnection: (connection: string, obj: { [key: string]: string }) => void;
};

type Actions = {
    fetchTwitchVideos: ({
        paginateTo,
        twitchUserId,
        twitchAccessToken,
        addConnection,
        userId,
        refreshToken,
    }: RefreshTokenActionProps & {
        paginateTo?: "before" | "after" | undefined;
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
};
