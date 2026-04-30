// Build inventory rows
(function () {
	const tb = document.getElementById("invBody");
	for (let i = 0; i < 7; i++) {
		const tr = document.createElement("tr");
		["doenca", "medicamento", "como_usa", "tempo"].forEach((k) => {
			const td = document.createElement("td");
			const inp = document.createElement("input");
			inp.type = "text";
			inp.name = `inv_${k}_${i + 1}`;
			td.appendChild(inp);
			tr.appendChild(td);
		});
		tb.appendChild(tr);
	}
})();

// Toast
const toast = document.getElementById("toast");
function showToast(msg) {
	toast.textContent = msg;
	toast.classList.add("show");
	clearTimeout(showToast._t);
	showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
}

// Capture form data
function captureData() {
	const form = document.getElementById("agaForm");
	const fd = new FormData(form);
	const out = {};
	// group multi-checkbox values into arrays
	const multi = [
		"escolaridade",
		"conjugal",
		"ocupacao",
		"renda",
		"local",
		"residencia",
		"religiao",
		"vacina",
		"tabagismo",
		"alcool",
		"atvfis",
		"visao",
		"audicao",
		"cont_fecal",
		"cont_urin",
		"sono",
	];
	for (const [k, v] of fd.entries()) {
		if (multi.includes(k)) {
			out[k] = out[k] || [];
			out[k].push(v);
		} else {
			out[k] = v;
		}
	}
	// inventory rows
	out.inventario = [];
	for (let i = 1; i <= 7; i++) {
		out.inventario.push({
			doenca: out[`inv_doenca_${i}`] || "",
			medicamento: out[`inv_medicamento_${i}`] || "",
			como_usa: out[`inv_como_usa_${i}`] || "",
			tempo: out[`inv_tempo_${i}`] || "",
		});
		delete out[`inv_doenca_${i}`];
		delete out[`inv_medicamento_${i}`];
		delete out[`inv_como_usa_${i}`];
		delete out[`inv_tempo_${i}`];
	}
	return out;
}

function save() {
	const data = captureData();
	console.log("AGA — dados capturados:", data);
	console.log(JSON.stringify(data, null, 2));
	showToast("Avaliação salva — verifique o console");
}
function clearAll() {
	if (!confirm("Limpar todos os campos da avaliação?")) return;
	document.getElementById("agaForm").reset();
	showToast("Formulário limpo");
}

document.getElementById("btnSave").addEventListener("click", save);
document.getElementById("btnSave2").addEventListener("click", save);
document.getElementById("btnClear").addEventListener("click", clearAll);
document.getElementById("btnClear2").addEventListener("click", clearAll);
