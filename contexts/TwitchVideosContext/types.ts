export type Video = {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    createdAt: string;
};

export type State = {
    videos: Video[];
    loading: boolean;
    error: string | null;
    pagination: {
        cursor: string | null;
        isLastPage: boolean;
    };
};

export type Action =
    | { type: "FETCH_VIDEOS_REQUEST" }
    | {
          type: "FETCH_VIDEOS_SUCCESS";
          payload: { videos: Video[]; pagination: { cursor: string } };
      }
    | { type: "FETCH_VIDEOS_FAILURE"; payload: { error: string } };
