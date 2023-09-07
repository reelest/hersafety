class RunningStat {
    count = 0;
    total = 0;
    min = 0;
    max = 0;
    avg = 0;
    sd = 0;
    variance = 0;
    update(newElement) {
        const stats = this;
        const newStats = new RunningStat();
        newStats.count = stats.count + 1;
        newStats.total = stats.total + newElement;
        newStats.min = Math.min(stats.min, newElement);
        newStats.max = Math.max(stats.max, newElement);
        newStats.avg = (stats.total + newElement) / newStats.count;

        newStats.variance =
            ((newStats.count - 1) * stats.variance +
                (newElement - newStats.avg) * (newElement - stats.avg)) /
            newStats.count;

        newStats.sd = Math.sqrt(newStats.variance);

        return newStats;
    }
}
