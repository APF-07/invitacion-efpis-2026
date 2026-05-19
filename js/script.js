const canvas = document.getElementById('bgc');
    const ctx = canvas.getContext('2d');
    const particles = [];
    const N = 90;
    function resize() { canvas.width = window.innerWidth; canvas.height = Math.max(document.body.scrollHeight, window.innerHeight) }
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < N; i++) { particles.push({ x: Math.random() * window.innerWidth, y: Math.random() * 3000, vx: (Math.random() - .5) * 0.28, vy: (Math.random() - .5) * 0.28, r: Math.random() * 1.4 + .3, alpha: Math.random() * 0.45 + .1, col: Math.random() > .5 ? '0,212,255' : '0,102,255', phase: Math.random() * Math.PI * 2 }) }
    let t = 0;
    function draw() {
        resize(); ctx.clearRect(0, 0, canvas.width, canvas.height);
        const g = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, canvas.height, canvas.height);
        g.addColorStop(0, '#020c1b'); g.addColorStop(1, '#010812');
        ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0,212,255,0.038)'; ctx.lineWidth = 1;
        const gs = 60;
        for (let x = 0; x < canvas.width; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke() }
        for (let y = 0; y < canvas.height; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke() }
        particles.forEach(p => {
            const a = p.alpha * (0.5 + 0.5 * Math.sin(t * 0.001 + p.phase));
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.col}, ${a})`; ctx.fill();
            particles.forEach(p2 => {
                const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (d < 95) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.strokeStyle = `rgba(0, 212, 255, ${0.025 * (1 - d / 95)})`; ctx.lineWidth = .5; ctx.stroke() }
            });
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
        t++; requestAnimationFrame(draw);
    }
    draw();
    
    function openTab(tabIndex, btnElement) {
        const tabs = document.querySelectorAll('.dcard');
        const btns = document.querySelectorAll('.tab-btn');
        
        tabs.forEach(t => t.classList.remove('active-tab'));
        btns.forEach(b => b.classList.remove('active'));
        
        if (tabs[tabIndex]) {
            tabs[tabIndex].classList.add('active-tab');
        }
        btnElement.classList.add('active');
    }

    // Funciones del Modal de Registro
    function openModal() {
        document.getElementById('regModal').classList.add('active');
    }

    function closeModal() {
        document.getElementById('regModal').classList.remove('active');
    }

    function submitForm(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const codigo = document.getElementById('codigo').value;
        const semestre = document.getElementById('semestre').value;

function submitForm(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const codigo = document.getElementById('codigo').value;
    const semestre = document.getElementById('semestre').value;

    // Aquí está la URL que acabas de generar
    const scriptURL = 'https://script.google.com/a/macros/undac.edu.pe/s/AKfycbwH3-dhB8QcDb8yGA85kZEXu-DNOcaxU-vvuYISJV3MgCjamTwtS_5DxG2HKFd8W81Q/exec';

    // Se cambia el texto del botón para mostrar que está cargando
    const btnSubmit = document.querySelector('.btn-cta[type="submit"]');
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'GUARDANDO...';
    btnSubmit.disabled = true;

    fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ nombre, codigo, semestre })
    })
    .then(response => response.json())
    .then(data => {
        alert(`¡Asistencia guardada con éxito!\nNombre: ${nombre}\nCódigo: ${codigo}\nSemestre: ${semestre}`);
        document.getElementById('regForm').reset();
        closeModal();
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('Hubo un error al guardar la asistencia. Intenta nuevamente.');
    })
    .finally(() => {
        // Restaurar el botón a la normalidad
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
    });
}
        alert(`¡Asistencia guardada!\nNombre: ${nombre}\nCódigo: ${codigo}\nSemestre: ${semestre}`);
        
        document.getElementById('regForm').reset();
        closeModal();
    }