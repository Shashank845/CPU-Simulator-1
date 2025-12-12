function srtf() {
    let n = Number(document.getElementById("num").value);
    let procs = [];

    for (let i = 0; i < n; i++) {
        let at = Number(document.getElementById(`P${i}at`).value);
        let bt = Number(document.getElementById(`P${i}bt`).value);
        procs.push({
            id: i,
            arrival: at,
            burst: bt,
            remaining: bt
        });
    }

    let currTime = 0;
    let completed = 0;

    while (completed < n) {
        let available = procs.filter(p => p.arrival <= currTime && p.remaining > 0);

        if (available.length === 0) {
            let future = procs.filter(p => p.remaining > 0 && p.arrival > currTime);
            let nextArrival = Math.min(...future.map(p => p.arrival));
            currTime = nextArrival;
            continue;
        }

        available.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival || a.id - b.id);
        let cur = available[0];

        if (cur.start === undefined) cur.start = currTime;

        cur.remaining--;
        currTime++;

        if (cur.remaining === 0) {
            cur.completion = currTime;
            cur.turnaround = cur.completion - cur.arrival;
            cur.waiting = cur.turnaround - cur.burst;
            completed++;
        }
    }

    procs.sort((a, b) => a.id - b.id);

    let table = `
<table border="1" cellspacing="0" cellpadding="8">
<tr>
<td>ID</td><td>Arrival</td><td>Burst</td><td>TAT</td><td>WT</td><td>CT</td>
</tr>
`;

    procs.forEach(p => {
        table += `
<tr>
<td>P${p.id}</td>
<td>${p.arrival}</td>
<td>${p.burst}</td>
<td>${p.turnaround}</td>
<td>${p.waiting}</td>
<td>${p.completion}</td>
</tr>
`;
    });

    table += "</table>";

    document.getElementById("output").innerHTML = table;
}
