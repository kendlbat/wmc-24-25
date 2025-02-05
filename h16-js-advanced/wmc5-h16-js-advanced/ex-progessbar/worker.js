self.onmessage = function (event) {
    const duration = event.data.duration;
    const startTime = performance.now();
    let elapsedTimespan;
    let percentage = 0;

    const updateProgressBar = () => {
        elapsedTimespan = performance.now() - startTime;
        percentage = (elapsedTimespan / duration) * 100;
        self.postMessage({ percentage, elapsedTimespan });

        if (percentage < 100) requestAnimationFrame(updateProgressBar);
    };
    updateProgressBar();
};
