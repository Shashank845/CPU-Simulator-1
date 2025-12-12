function priority_preemptive() {
    let n = Number(document.getElementById("num").value) || 0;
    let p = [];
    for (let i = 0; i < n; i++) {
        let at = Number(document.getElementById(`P${i}at`).value);
        let bt = Number(document.getElementById(`P${i}bt`).value);
        let pr = Number(document.getElementById(`P${i}pr`)?.value);
        if (!Number.isFinite(at)) at = 0;
        if (!Number.isFinite(bt) || bt <= 0) bt = 0;
        if (!Number.isFinite(pr)) pr = 0;
        p.push({ id: i, arrival: at, burst: bt, priority: pr, remaining: bt });
    }

    let currTime = 0, completed = 0, safe = 0;
    while (completed < n && safe < 1000000) {
        safe++;
        let available = p.filter(x => x.remaining > 0 && x.arrival <= currTime);
        if (available.length === 0) {
            let future = p.filter(x => x.remaining > 0 && x.arrival > currTime);
            if (future.length === 0) break;
            let nextArrival = Math.min(...future.map(x => x.arrival));
            currTime = nextArrival;
            continue;
        }
        available.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival || a.id - b.id);
        let cur = available[0];
        if (cur.remaining === cur.burst) cur.start = currTime;
        cur.remaining--;
        currTime++;
        if (cur.remaining === 0) {
            cur.completion = currTime;
            cur.turnaround = cur.completion - cur.arrival;
            cur.waiting = cur.turnaround - cur.burst;
            completed++;
        }
    }

    p.sort((a, b) => a.id - b.id);

    let table = `
<table border="1" cellspacing="0" cellpadding="8">
<tr>
<td>ID</td><td>Prio</td><td>Arrival</td><td>Burst</td><td>TAT</td><td>WT</td><td>CT</td>
</tr>
`;
    p.forEach(pr => {
        let tat = pr.turnaround !== undefined ? pr.turnaround : "-";
        let wt = pr.waiting !== undefined ? pr.waiting : "-";
        let ct = pr.completion !== undefined ? pr.completion : "-";
        table += `
<tr>
<td>P${pr.id}</td>
<td>${pr.priority}</td>
<td>${pr.arrival}</td>
<td>${pr.burst}</td>
<td>${tat}</td>
<td>${wt}</td>
<td>${ct}</td>
</tr>
`;
    });
    table += "</table>";
    document.getElementById("output").innerHTML = table;
}
