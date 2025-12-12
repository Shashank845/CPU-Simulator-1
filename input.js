function geninput(){
  let n = Number(document.getElementById("num").value) || 0;
  let area = document.getElementById("inputArea");
  area.innerHTML = "";

  for (let i = 0; i < n; i++) {
    area.innerHTML += `
    <div class="f">
      <div class="sectionInputLabel">
        <label>P ${i} Arrival Time of a process:-</label>
        <input type="number" id="P${i}at" min="0" value="0">
        <label>P ${i} Burst Time of a process:-</label>
        <input type="number" id="P${i}bt" min="0" value="0">
      </div>
      <div class="sectionInputLabel priorityInput">
        Priority: <input id="P${i}pr" type="number" min="0" value="0">
      </div></div>
    `;
  }
}
