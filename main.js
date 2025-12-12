function togglePriorityInputs() {
  const algo = document.getElementById("algo").value;
  const priInputs = document.querySelectorAll(".priorityInput");
  if (algo === "priority" || algo === "priority_preemptive") {
    priInputs.forEach(p => p.style.display = "block");
  } else {
    priInputs.forEach(p => p.style.display = "none");
  }
}

function runAlgo() {
    const algo = document.getElementById("algo").value;

    if (algo === "fcfs") fcfs();
    else if (algo === "sjf") sjt();
    else if (algo === "srtf") srtf();
    else if (algo === "priority") priorityScheduling();
    else if (algo === "priority_preemptive") priority_preemptive();
    else if (algo === "rr") rr();
    else document.getElementById("output").textContent = "Algorithm not implemented.";
}

window.addEventListener("load", () => {
    geninput();
    togglePriorityInputs();

    const algoSelect = document.getElementById("algo");
    if (algoSelect) {
        algoSelect.addEventListener("change", togglePriorityInputs);
    }

    const numInput = document.getElementById("num");
    if (numInput) {
        numInput.addEventListener('input', () => {
            geninput();
            togglePriorityInputs();
        });
    }

    const runBtn = document.getElementById("runBtn");
    if (runBtn) runBtn.addEventListener('click', runAlgo);
});
window.addEventListener("load", () => {
  // initial generation
  geninput();
  togglePriorityInputs();

  // when Algo changes, toggle immediately
  const algoSelect = document.getElementById("algo");
  if (algoSelect) algoSelect.addEventListener("change", togglePriorityInputs);

  // Generate button: regenerate inputs AND toggle visibility
  const genBtn = document.getElementById("genBtn");
  if (genBtn) genBtn.addEventListener("click", () => {
    geninput();
    // small timeout to ensure DOM insertion finished (safe)
    setTimeout(togglePriorityInputs, 0);
  });

  // optional: react to number changes too
  const numInput = document.getElementById("num");
  if (numInput) numInput.addEventListener("input", () => {
    geninput();
    setTimeout(togglePriorityInputs, 0);
  });

  // run button
  const runBtn = document.getElementById("runBtn");
  if (runBtn) runBtn.addEventListener("click", runAlgo);
});
