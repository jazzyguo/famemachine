
export const getTimeDiffInHours = (dateString: string): number => {
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    const timeDiff = Number(currentDate) - Number(givenDate);

    const timeDiffInHours = timeDiff / (1000 * 60 * 60);

    return timeDiffInHours
}
