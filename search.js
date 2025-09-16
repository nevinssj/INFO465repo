
(function(){
  const $ = (sel)=>document.querySelector(sel);
  const resultsBox = $('#resultsBox');
  const tbody = $('#results');
  const qDept = $('#qDept');
  const qNum = $('#qNum');
  const qInstr = $('#qInstr');
  const info = $('#info');

  function hideResults(){
    if(resultsBox) resultsBox.style.display = 'none';
    if(info) info.textContent = '—';
    if(tbody) tbody.innerHTML = '';
  }

  function showResults(){
    if(resultsBox) resultsBox.style.display = 'block';
  }

  function render(rows){
    tbody.innerHTML = '';
    if(rows.length === 0){
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="7" class="muted">No matching courses.</td>';
      tbody.appendChild(tr);
      info.textContent = '0 results';
      return;
    }
    rows.forEach(c=>{
      const tr = document.createElement('tr');
      tr.setAttribute('data-course-id', c.id);
      const seats = `${c.seatsUsed}/${c.max}`;
      tr.innerHTML = `
        <td>${c.dept}</td>
        <td>${c.number}</td>
        <td>${c.title}</td>
        <td>${c.instructor}</td>
        <td>${c.credits}</td>
        <td>${seats}</td>
        <td><button class="btn-blue" data-id="${c.id}" style="padding:6px 10px;">Details</button></td>
      `;
      tbody.appendChild(tr);
    });
    info.textContent = rows.length + ' result' + (rows.length!==1?'s':'');

    tbody.querySelectorAll('button[data-id]').forEach(btn=>{
      btn.addEventListener('click', ()=>toggleDetails(btn.getAttribute('data-id'), btn));
    });
  }

  // Independent toggle per course row (multiple can be open)
  function toggleDetails(id, buttonEl){
    const row = buttonEl.closest('tr');
    const next = row.nextElementSibling;
    if(next && next.classList.contains('details-row') && next.getAttribute('data-id') === id){
      next.remove();
      buttonEl.textContent = 'Details';
      return;
    }
    const c = window.COURSES.find(x=>x.id===id);
    if(!c) return;
    const d = document.createElement('tr');
    d.className = 'details-row';
    d.setAttribute('data-id', id);
    const used = c.seatsUsed, max = c.max;
    d.innerHTML = `<td colspan="7">
      <div class="details">
        <strong>${c.dept} ${c.number} – ${c.title}</strong><br>
        Prerequisites: <em>${c.prereq}</em> • Modality: <em>${c.modality}</em><br>
        Time/Place: ${c.when} • ${c.location}<br>
        Seats: <strong>${used}/${max}</strong>
      </div>
    </td>`;
    row.insertAdjacentElement('afterend', d);
    buttonEl.textContent = 'Hide';
  }

  function search(){
    const dept = qDept.value.trim().toUpperCase();
    const num = qNum.value.trim();
    const instr = qInstr.value.trim().toLowerCase();
    const filtered = window.COURSES.filter(c =>
      (!dept || c.dept.includes(dept)) &&
      (!num || String(c.number).includes(num)) &&
      (!instr || c.instructor.toLowerCase().includes(instr))
    );
    showResults();
    render(filtered);
  }

  $('#btnSearch').addEventListener('click', search);
  $('#btnReset').addEventListener('click', ()=>{
    qDept.value=''; qNum.value=''; qInstr.value='';
    hideResults(); // hide results until next search
  });

  // Initial state: results fully hidden
  hideResults();
})();
