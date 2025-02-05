function runBlocking() {
    const duration =
        parseFloat(document.getElementById("duration").value) * 1000;
    const progressBar = document.getElementById("progressBar");
    const startTime = performance.now();

    let elapsedTimespan;
    let percentage = 0;
    progressBar.style.width = "0%";
    renderTimespan("-");

    do {
        elapsedTimespan = performance.now() - startTime;
        percentage = (elapsedTimespan / duration) * 100;
        progressBar.style.width = percentage + "%";
    } while (percentage < 100);

    renderTimespan(elapsedTimespan);
}

function runMacroTask() {
    const duration =
        parseFloat(document.getElementById("duration").value) * 1000;
    const progressBar = document.getElementById("progressBar");
    const startTime = performance.now();

    let elapsedTimespan;
    let percentage = 0;
    progressBar.style.width = "0%";
    renderTimespan("-");

    const updateProgressBar = () => {
        elapsedTimespan = performance.now() - startTime;
        percentage = (elapsedTimespan / duration) * 100;
        progressBar.style.width = percentage + "%";
        renderTimespan(elapsedTimespan);

        if (percentage < 100) setTimeout(updateProgressBar, 0);
    };

    updateProgressBar();
}

function runMicroTask() {
    /*
    Erklärung: Nix geht, weil nach Microtasks nicht re-rendered wird.
    */

    const duration =
        parseFloat(document.getElementById("duration").value) * 1000;
    const progressBar = document.getElementById("progressBar");
    const startTime = performance.now();

    let elapsedTimespan;
    let percentage = 0;
    progressBar.style.width = "0%";
    renderTimespan("-");

    const updateProgressBar = () => {
        elapsedTimespan = performance.now() - startTime;
        percentage = (elapsedTimespan / duration) * 100;
        progressBar.style.width = percentage + "%";
        renderTimespan(elapsedTimespan);

        if (percentage < 100) setImmediate(updateProgressBar);
    };

    updateProgressBar();
}

function runRequestAnimationFrame() {
    const duration =
        parseFloat(document.getElementById("duration").value) * 1000;
    const progressBar = document.getElementById("progressBar");
    const startTime = performance.now();

    let elapsedTimespan;
    let percentage = 0;
    progressBar.style.width = "0%";
    renderTimespan("-");

    const updateProgressBar = () => {
        elapsedTimespan = performance.now() - startTime;
        percentage = (elapsedTimespan / duration) * 100;
        progressBar.style.width = percentage + "%";
        renderTimespan(elapsedTimespan);

        if (percentage < 100) requestAnimationFrame(updateProgressBar);
    };

    updateProgressBar();
}

function runWebWorker() {
    const worker = new Worker("worker.js");
    worker.onmessage = (event) => {
        const { percentage, elapsedTimespan } = event.data;
        const progressBar = document.getElementById("progressBar");
        progressBar.style.width = percentage + "%";
        renderTimespan(elapsedTimespan);
    };
    worker.postMessage({
        duration: parseFloat(document.getElementById("duration").value) * 1000,
    });
}

function renderTimespan(elapsedTime) {
    const elapsedTimeContainer = document.getElementById("elapsedTime");
    elapsedTimeContainer.textContent = `elapsed time: ${elapsedTime} milliseconds`;
}

function initTrackingArea() {
    const trackingArea = document.getElementById("trackingArea");

    trackingArea.addEventListener("mousemove", (event) => {
        const rect = trackingArea.getBoundingClientRect();
        const dot = document.createElement("div");
        dot.classList.add("dot");
        // -5px width/height of dot
        dot.style.left = `${event.clientX - rect.left - 5}px`;
        dot.style.top = `${event.clientY - rect.top - 5}px`;
        trackingArea.appendChild(dot);
    });
}
