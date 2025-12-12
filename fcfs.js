    function fcfs(){
        let n = Number(document.getElementById("num").value);
        let process = [];

        for(let i=0;i<n;i++){
            let at = Number(document.getElementById(`P${i}at`).value);
            let bt = Number(document.getElementById(`P${i}bt`).value);

            process.push({
                id : i,
                arrival: at,
                burst: bt,
            });
        }

        process.sort((a,b)=>a.arrival - b.arrival);

        let currTime = 0;
        process.forEach(p=>{
            if(currTime < p.arrival){
                currTime = p.arrival;
            }
            p.start = currTime;
            p.completion = currTime + p.burst;
            p.turnaround = p.completion - p.arrival;
             p.waiting = p.start - p.arrival;
            currTime = p.completion;
        });

        let table = `
<table border="1" cellspacing="0" cellpadding="8">
    <tr>
        <th>ID</th>
        <th>Arrival</th>
        <th>Burst</th>
        <th>Turnaround</th>
        <th>Waiting</th>
        <th>Completion</th>
    </tr>
`;

process.forEach(p => {
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

table += `</table>`;

        document.getElementById("output").innerHTML = table;
    }