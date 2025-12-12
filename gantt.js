
// gantt.js - improved robust Gantt renderer with defensive loading and verbose console logs
(function(){
  function log(...args){
    if(window.console) console.log("[gantt] ", ...args);
  }
  function warn(...args){
    if(window.console) console.warn("[gantt] ", ...args);
  }
  function error(...args){
    if(window.console) console.error("[gantt] ", ...args);
  }

  function findOutput(){
    return document.getElementById("output") || document.querySelector(".output") || document.body;
  }

  function parseTable(){
    const out = document.getElementById("output");
    if(!out){
      warn("No #output element found.");
      return null;
    }
    const table = out.querySelector("table");
    if(!table){
      warn("#output exists but no <table> found inside yet.");
      return null;
    }
    // header mapping tolerant to many names
    const headerRow = table.querySelector("tr");
    if(!headerRow){
      warn("Table has no rows.");
      return null;
    }
    const headerCells = Array.from(headerRow.children).map(h=>h.textContent.trim().toLowerCase());
    const idx = {
      id: headerCells.findIndex(h => /\b(id|process|p)\b/.test(h) || /^p\d+$/i.test(h)),
      arrival: headerCells.findIndex(h => /(arrival|at|arrive|arrival time)/.test(h)),
      burst: headerCells.findIndex(h => /(burst|bt|b|burst time|service)/.test(h)),
      completion: headerCells.findIndex(h => /(completion|ct|end|finish|completion time)/.test(h))
    };
    // fallback guesses if not found
    if(idx.id < 0) idx.id = 0;
    const rows = Array.from(table.querySelectorAll("tr")).slice(1);
    const procs = rows.map((r, i)=>{
      const cells = Array.from(r.children).map(c=>c.textContent.trim());
      const idRaw = cells[idx.id] || ("P"+(i+1));
      const id = idRaw.replace(/^P/i, "").trim();
      const arrival = (idx.arrival>=0 && cells[idx.arrival] !== "") ? Number(cells[idx.arrival]) : 0;
      const burst = (idx.burst>=0 && cells[idx.burst] !== "") ? Number(cells[idx.burst]) : 0;
      const completion = (idx.completion>=0 && cells[idx.completion] !== "" && cells[idx.completion] !== "-") ? Number(cells[idx.completion]) : null;
      const start = (completion !== null && !Number.isNaN(completion)) ? (completion - burst) : null;
      return { id: id, arrival: arrival, burst: burst, start: start, completion: completion };
    });
    log("Parsed processes:", procs);
    return procs;
  }

  function drawGantt(procs, container){
    container.innerHTML = ""; // clear
    if(!procs || procs.length===0){
      container.textContent = "No Gantt data found.";
      return;
    }
    let minStart = Infinity, maxEnd = -Infinity;
    procs.forEach(p=>{
      const s = (p.start !== null && !Number.isNaN(p.start)) ? p.start : (p.arrival || 0);
      const e = (p.completion !== null && !Number.isNaN(p.completion)) ? p.completion : (s + (p.burst || 0));
      if(s < minStart) minStart = s;
      if(e > maxEnd) maxEnd = e;
      p._computedStart = s;
      p._computedEnd = e;
    });
    if(minStart === Infinity) minStart = 0;
    if(maxEnd === -Infinity) maxEnd = minStart + procs.reduce((a,b)=>a+ (b.burst||0),0) || minStart+1;
    const range = Math.max(1, maxEnd - minStart);

    const ruler = document.createElement("div");
    ruler.className = "gantt-ruler";
    for(let t = minStart; t <= maxEnd; t++){
      const tick = document.createElement("div");
      tick.className = "gantt-tick";
      tick.textContent = t;
      ruler.appendChild(tick);
    }
    container.appendChild(ruler);

    const list = document.createElement("div");
    list.className = "gantt-list";
    procs.forEach(p=>{
      const row = document.createElement("div");
      row.className = "gantt-row";
      const label = document.createElement("div");
      label.className = "gantt-label";
      label.textContent = "P" + p.id;
      const barWrap = document.createElement("div");
      barWrap.className = "gantt-bar-wrap";
      const bar = document.createElement("div");
      bar.className = "gantt-bar";
      const leftPercent = ((p._computedStart - minStart) / range) * 100;
      const widthPercent = ((p._computedEnd - p._computedStart) / range) * 100;
      bar.style.left = leftPercent + "%";
      bar.style.width = Math.max(0.5, widthPercent) + "%";
      bar.title = `P${p.id}: start=${p._computedStart}, end=${p._computedEnd}, burst=${p.burst}`;
      bar.textContent = p.burst;
      barWrap.appendChild(bar);
      row.appendChild(label);
      row.appendChild(barWrap);
      list.appendChild(row);
    });
    container.appendChild(list);
  }

  function ensureContainer(){
    let container = document.getElementById("gantt");
    if(!container){
      container = document.createElement("div");
      container.id = "gantt";
      const out = findOutput();
      if(out){
        out.insertAdjacentElement("afterend", container);
      } else {
        document.body.appendChild(container);
      }
    }
    return container;
  }

  function drawGanttFromTable(){
    const procs = parseTable();
    const container = ensureContainer();
    if(!procs || procs.length===0){
      container.innerHTML = "<em>No Gantt data found — ensure your algorithm writes a table inside &lt;div id='output'&gt; with Arrival/Burst/Completion columns.</em>";
      return;
    }
    drawGantt(procs, container);
  }

  // Observe #output or body for table insertion
  function observeAndDraw(){
    const out = findOutput();
    if(!out){
      warn("No output target found to observe.");
      return;
    }
    const container = ensureContainer();
    const obs = new MutationObserver((mutations)=>{
      // slight debounce
      clearTimeout(window.__ganttDrawTimer);
      window.__ganttDrawTimer = setTimeout(()=>{
        try {
          drawGanttFromTable();
        } catch(e){
          error("Error drawing Gantt:", e);
        }
      }, 30);
    });
    obs.observe(out, { childList: true, subtree: true, characterData: true });
    // initial attempt
    setTimeout(drawGanttFromTable, 50);
    log("Gantt observer attached to", out);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", observeAndDraw);
  } else {
    observeAndDraw();
  }

  // expose for debugging
  window.drawGanttFromTable = drawGanttFromTable;
  log("gantt.js loaded (improved).");
})();
