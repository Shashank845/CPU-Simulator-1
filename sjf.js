function sjt() {
    let n = Number(document.getElementById("num").value);
    let process = [];

    for (let i = 0; i < n; i++) {
        process.push({
            id: i,
            arrival: Number(document.getElementById(`P${i}at`).value),
            burst: Number(document.getElementById(`P${i}bt`).value),
            done: false
        });
    }

    let currTime = 0, completed = 0;
    let result = [];

    while (completed < n) {
        let available = process.filter(p => !p.done && p.arrival <= currTime);

        if (available.length === 0) {
            currTime++;
            continue;
        }

        available.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
        let p = available[0];

        p.start = currTime;
        p.completion = currTime + p.burst;
        p.turnaround = p.completion - p.arrival;
        p.waiting = p.start - p.arrival;

        currTime = p.completion;
        p.done = true;
        completed++;
        result.push(p);
    }

    let table = `
<table border="1" cellspacing="0" cellpadding="8">
<tr>
<td>ID</td><td>Arrival</td><td>Burst</td><td>TAT</td><td>WT</td><td>CT</td>
</tr>
`;

    result.forEach(p => {
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
