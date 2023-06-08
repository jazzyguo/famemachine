
export const getTimeDiffInSeconds = (dateString: string): number => {
    const date = new Date(dateString)
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDiff = currentDate.getTime() - date.getTime();

    // Convert time difference to seconds
    const timeDiffInSeconds = timeDiff / 1000;

    return timeDiffInSeconds
}
