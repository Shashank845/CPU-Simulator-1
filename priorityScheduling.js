function priorityScheduling() {
    let n = Number(document.getElementById("num").value);
    let p = [];

    for (let i = 0; i < n; i++) {
        p.push({
            id: i,
            arrival: Number(document.getElementById(`P${i}at`).value),
            burst: Number(document.getElementById(`P${i}bt`).value),
            priority: Number(document.getElementById(`P${i}pr`).value),
            done: false
        });
    }

    let currTime = 0, completed = 0, result = [];

    while (completed < n) {
        let available = p.filter(x => !x.done && x.arrival <= currTime);

        if (available.length === 0) {
            currTime++;
            continue;
        }

        available.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);

        let cur = available[0];

        cur.start = currTime;
        cur.completion = currTime + cur.burst;
        cur.turnaround = cur.completion - cur.arrival;
        cur.waiting = cur.start - cur.arrival;

        currTime = cur.completion;
        cur.done = true;
        completed++;
        result.push(cur);
    }

    let table = `
<table border="1" cellspacing="0" cellpadding="8">
<tr>
<td>ID</td><td>Prio</td><td>Arrival</td><td>Burst</td><td>TAT</td><td>WT</td><td>CT</td>
</tr>`;

    result.forEach(pr => {
        table += `
<tr>
<td>P${pr.id}</td>
<td>${pr.priority}</td>
<td>${pr.arrival}</td>
<td>${pr.burst}</td>
<td>${pr.turnaround}</td>
<td>${pr.waiting}</td>
<td>${pr.completion}</td>
</tr>`;
    });

    table += `</table>`;
    document.getElementById("output").innerHTML = table;
}
