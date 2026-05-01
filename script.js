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

const SUPABASE_URL = window.ENV?.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY;

const supabaseClient =
	SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase
		? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
		: null;

// Toast
const toast = document.getElementById("toast");
function showToast(msg) {
	toast.textContent = msg;
	toast.classList.add("show");
	clearTimeout(showToast._t);
	showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
}

function generateUUID() {
	if (window.crypto?.randomUUID) return window.crypto.randomUUID();
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

function toNull(value) {
	if (value === undefined || value === null) return null;
	const normalized = String(value).trim();
	return normalized === "" ? null : normalized;
}

function toNumberOrNull(value) {
	const v = toNull(value);
	if (v === null) return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}

function toBooleanSimNao(value) {
	if (value === undefined || value === null || value === "") return null;
	const v = String(value).trim().toLowerCase();
	if (v === "sim") return true;
	if (v === "não" || v === "nao") return false;
	return null;
}

function getCheckedValues(name) {
	return Array.from(
		document.querySelectorAll(`input[name="${name}"]:checked`),
		(el) => el.value
	);
}

function getRadioValue(name) {
	return document.querySelector(`input[name="${name}"]:checked`)?.value || null;
}

function captureRawFormData() {
	const form = document.getElementById("agaForm");
	const fd = new FormData(form);
	const out = {};
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

	out.inventario = [];
	for (let i = 1; i <= 7; i++) {
		out.inventario.push({
			doenca: out[`inv_doenca_${i}`] || "",
			medicamento: out[`inv_medicamento_${i}`] || "",
			como_usa: out[`inv_como_usa_${i}`] || "",
			tempo_uso: out[`inv_tempo_${i}`] || "",
		});
		delete out[`inv_doenca_${i}`];
		delete out[`inv_medicamento_${i}`];
		delete out[`inv_como_usa_${i}`];
		delete out[`inv_tempo_${i}`];
	}
	return out;
}

function includesAny(values, expected) {
	return expected.some((e) => values.includes(e));
}

function mapToDatabasePayload(raw) {
	const pacienteId = generateUUID();
	const avaliacaoId = generateUUID();

	const escolaridadeMap = {
		Analfabeto: "analfabeto",
		"1-4": "1_4",
		"5-8": "5_8",
		">8": "maior_8",
	};

	const singleMap = (arr, map) => {
		if (!Array.isArray(arr) || arr.length === 0) return null;
		return map[arr[0]] ?? null;
	};

	const paciente = {
		id: pacienteId,
		nome: toNull(raw.nome),
		idade: toNumberOrNull(raw.idade),
		sexo: raw.sexo === "F" || raw.sexo === "M" ? raw.sexo : null,
	};

	const avaliacao = {
		id: avaliacaoId,
		paciente_id: pacienteId,
		data_avaliacao: toNull(raw.final_data),
		avaliador: toNull(raw.final_avaliador),
		escolaridade: singleMap(raw.escolaridade, escolaridadeMap),
		situacao_conjugal: singleMap(raw.conjugal, {
			"Casado/União": "casado_uniao",
			Desquitado: "desquitado_separado_judicial",
			Divorciado: "divorciado",
			Viúvo: "viuvo",
			Solteiro: "solteiro",
			Separado: "separado",
		}),
		ocupacao: singleMap(raw.ocupacao, {
			"Aposentado com outra": "aposentado_com_outra_ocupacao",
			"Aposentado sem outra": "aposentado_sem_outra_ocupacao",
			"Trabalhos domésticos": "trabalhos_domesticos",
			"Fora do domicílio": "trabalho_fora_domicilio",
		}),
		renda_aposentadoria: includesAny(raw.renda || [], ["Aposentadoria"]),
		renda_pensao: includesAny(raw.renda || [], ["Pensão"]),
		renda_mesada_filhos: includesAny(raw.renda || [], ["Mesada"]),
		renda_aluguel: includesAny(raw.renda || [], ["Aluguel"]),
		renda_trabalho: includesAny(raw.renda || [], ["Trabalho"]),
		renda_outras: includesAny(raw.renda || [], ["Outras"]),
		renda_outras_texto: toNull(raw.renda_outras),
		local_residencia: singleMap(raw.local, {
			"Casa térrea": "casa_terrea",
			"Casa duplex": "casa_duplex",
			Apartamento: "apartamento",
			ILP: "ilp",
			Outros: "outros",
		}),
		local_residencia_outros: toNull(raw.local_outros),
		reside_sozinho: includesAny(raw.residencia || [], ["Sozinho"]),
		reside_com_filhos: includesAny(raw.residencia || [], ["Filhos"]),
		reside_com_outros_familiares: includesAny(raw.residencia || [], ["Outros familiares"]),
		reside_com_empregada_domestica: includesAny(raw.residencia || [], ["Empregada"]),
		reside_com_cuidadores: includesAny(raw.residencia || [], ["Cuidadores"]),
		reside_com_outros: includesAny(raw.residencia || [], ["Outros"]),
		reside_com_outros_texto: toNull(raw.residencia_outros),
		religiao: singleMap(raw.religiao, {
			Católica: "catolica",
			Evangélica: "evangelica",
			Espírita: "espirita",
			Budista: "budista",
			Outra: "outra",
		}),
		religiao_outra_texto: toNull(raw.religiao_outra),
		atividades_sociais: toBooleanSimNao(raw.atv_social),
		atividades_sociais_texto: toNull(raw.atv_social_desc),
		visao_status: includesAny(raw.visao || [], ["normal"]) ? "normal" : includesAny(raw.visao || [], ["deficit"]) ? "deficit" : null,
		visao_usa_corretores: includesAny(raw.visao || [], ["corretores"]),
		audicao_status: includesAny(raw.audicao || [], ["normal"]) ? "normal" : includesAny(raw.audicao || [], ["deficit"]) ? "deficit" : null,
		audicao_usa_corretores: includesAny(raw.audicao || [], ["corretores"]),
		continencia_fecal_status: includesAny(raw.cont_fecal || [], ["normal"]) ? "continente" : includesAny(raw.cont_fecal || [], ["incont"]) ? "incontinente" : null,
		continencia_fecal_tempo: toNull(raw.cont_fecal_tempo),
		continencia_urinaria_status: includesAny(raw.cont_urin || [], ["normal"]) ? "continente" : includesAny(raw.cont_urin || [], ["incont"]) ? "incontinente" : null,
		continencia_urinaria_tempo: toNull(raw.cont_urin_tempo),
		sono_status: includesAny(raw.sono || [], ["normal"]) ? "normal" : includesAny(raw.sono || [], ["disturbio"]) ? "disturbio" : null,
		sono_qual: toNull(raw.sono_qual),
		doenca_cardiovascular: toBooleanSimNao(raw.cardio),
		doenca_osteoarticular: toBooleanSimNao(raw.osteo),
		uso_orteses: toNull(raw.orteses),
		uso_proteses: toNull(raw.proteses),
		vacina_influenza: includesAny(raw.vacina || [], ["Influenza"]),
		vacina_pneumococo: includesAny(raw.vacina || [], ["Pneumococo"]),
		vacina_tetano: includesAny(raw.vacina || [], ["Tétano"]),
		vacina_hepatite_b: includesAny(raw.vacina || [], ["Hepatite B"]),
		vacina_febre_amarela: includesAny(raw.vacina || [], ["Febre amarela"]),
		data_ultima_vacina_influenza: toNull(raw.vac_inf_data),
		data_ultima_vacina_tetano: toNull(raw.vac_tet_data),
		data_ultima_vacina_pneumococo: toNull(raw.vac_pneu_data),
		quedas_ultimos_12_meses: toBooleanSimNao(raw.quedas),
		quantidade_quedas: toNumberOrNull(raw.quedas_qtd),
		polifarmacia: toBooleanSimNao(raw.polifarm),
		tabagismo_status: singleMap(raw.tabagismo, { Fumante: "fumante", "Não fumante": "nao_fumante", "Ex-fumante": "ex_fumante" }),
		tabagismo_tempo_parou: toNull(raw.tab_tempo),
		alcool_status: singleMap(raw.alcool, { "Uso seguro": "uso_seguro", "Uso nocivo": "uso_nocivo", Dependência: "dependencia", "Não bebe": "nao_bebe" }),
		alcool_tempo_parou: toNull(raw.alcool_tempo),
		atividade_fisica_nao_faz: includesAny(raw.atvfis || [], ["Não faz"]),
		atividade_fisica_caminhadas: includesAny(raw.atvfis || [], ["Caminhadas"]),
		atividade_fisica_musculacao: includesAny(raw.atvfis || [], ["Musculação"]),
		atividade_fisica_hidroginastica: includesAny(raw.atvfis || [], ["Hidroginástica"]),
		atividade_fisica_outras: includesAny(raw.atvfis || [], ["Outras"]),
		atividade_fisica_outras_texto: toNull(raw.atvfis_outras),
		atividade_fisica_vezes_semana: toNumberOrNull(raw.atvfis_freq),
		equilibrio_mobilidade_score: toNull(raw.eq_score),
		equilibrio_mobilidade_interpretacao: raw.eq_int === "baixo" ? "baixo_risco_quedas" : raw.eq_int === "aumentado" ? "risco_aumentado_quedas" : null,
		gug_score: toNull(raw.gug_score),
		gug_interpretacao: toNull(raw.gug_int),
		abvd_score: toNull(raw.abvd_score),
		abvd_interpretacao: raw.abvd_int === "indep" ? "independente" : raw.abvd_int === "dep" ? "dependente" : null,
		barthel_score: toNull(raw.barthel_score),
		barthel_interpretacao: ({"<20":"dependencia_total","20-35":"dependencia_grave","40-55":"dependencia_moderada","60-95":"dependencia_leve","100":"independente"})[raw.barthel_int] || null,
		aivd_score: toNull(raw.aivd_score),
		aivd_interpretacao: raw.aivd_int === "indep" ? "independente" : raw.aivd_int === "dep" ? "dependente" : null,
		pfeffer_score: toNull(raw.pfeffer_score),
		pfeffer_interpretacao: raw.pfeffer_int === "<6" ? "normal" : raw.pfeffer_int === ">=6" ? "comprometido" : null,
		cognicao_score: toNull(raw.cog_score),
		cognicao_status: toNull(raw.cog_int),
		meem_score: toNull(raw.meem_score),
		meem_interpretacao: raw.meem_int === "normal" ? "normal_para_escolaridade" : raw.meem_int === "alterada" ? "alterada_para_escolaridade" : null,
		fluencia_verbal_score: toNull(raw.flu_score),
		fluencia_verbal_interpretacao: raw.flu_int === "normal" ? "normal_para_escolaridade" : raw.flu_int === "diminuida" ? "diminuida_para_escolaridade" : null,
		relogio_score: toNull(raw.relogio_score),
		relogio_interpretacao: toNull(raw.relogio_int),
		humor_score: toNull(raw.humor_score),
		humor_status: toNull(raw.humor_int),
		yesavage_score: toNull(raw.yesavage_score),
		yesavage_interpretacao: raw.yesavage_int === "<=5" ? "normal" : raw.yesavage_int === ">=7" ? "depressao" : raw.yesavage_int === ">=11" ? "depressao_moderada_grave" : null,
		estado_nutricional_score: toNull(raw.nut_score),
		estado_nutricional_status: raw.nut_int === "ausencia" ? "ausencia_risco" : raw.nut_int === "presenca" ? "presenca_risco" : null,
		man_score: toNull(raw.man_score),
		man_interpretacao: raw.man_int === "<17" ? "desnutrido" : raw.man_int === "17-23.5" ? "risco_desnutricao" : raw.man_int === ">=24" ? "nutrido" : null,
		suporte_social_score: toNull(raw.sup_score),
		suporte_social_status: raw.sup_int === "adequado" ? "adequado" : raw.sup_int === "nao" ? "nao_adequado" : null,
		apgar_score: toNull(raw.apgar_score),
		apgar_interpretacao: raw.apgar_int === "<3" ? "acentuada_disfuncao" : raw.apgar_int === "4-6" ? "moderada_disfuncao" : raw.apgar_int === ">6" ? "leve_disfuncao" : null,
		cuidador_score: toNull(raw.cuid_score),
		cuidador_tipo: raw.cuid_int === "formal" ? "formal" : raw.cuid_int === "inf-fam" ? "informal_familiar" : raw.cuid_int === "inf-out" ? "informal_amigos_outros" : null,
		outras_avaliacoes: toNull(raw.outras_aval),
		observacoes: toNull(raw.observacoes),
		representacao_saude_cidadania_propria: toNull(raw.representacao_saude_cidadania_propria),
		representacao_saude_cidadania_outros: toNull(raw.representacao_saude_cidadania_outros),
		final_funcionalidade: raw.f_indep === "indep" ? "independente" : raw.f_indep === "dep" ? "dependente" : null,
		final_fragilidade: raw.f_fragil === "fragil" ? "fragil" : raw.f_fragil === "nao-fragil" ? "nao_fragil" : null,
		final_risco_quedas: toNull(raw.f_quedas),
		final_cognicao: raw.f_cog === "deficit" ? "deficit" : raw.f_cog === "sem" ? "sem_deficit" : null,
		final_nutricao: raw.f_nut === "sem" ? "sem_risco" : raw.f_nut === "risco" ? "risco" : null,
		final_suporte_social: toNull(raw.f_sup),
		final_local: toNull(raw.final_local),
		final_preenchedor: toNull(raw.final_preenchedor),
		raw_payload: raw,
	};

	const medicamentos = (raw.inventario || [])
		.map((linha, index) => ({
			id: generateUUID(),
			avaliacao_id: avaliacaoId,
			ordem: index + 1,
			doenca: toNull(linha.doenca),
			medicamento: toNull(linha.medicamento),
			como_usa: toNull(linha.como_usa),
			tempo_uso: toNull(linha.tempo_uso),
		}))
		.filter((linha) => linha.doenca || linha.medicamento || linha.como_usa || linha.tempo_uso);

	return { paciente, avaliacao, medicamentos };
}

async function saveEvaluation() {
	try {
		if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !supabaseClient) {
			showToast("Erro: configure SUPABASE_URL e SUPABASE_ANON_KEY no env.js");
			return;
		}

		const raw = captureRawFormData();
		const payload = mapToDatabasePayload(raw);

		const { error: pacienteError } = await supabaseClient.from("pacientes").insert([payload.paciente]);
		if (pacienteError) throw pacienteError;

		const { error: avaliacaoError } = await supabaseClient.from("aga_avaliacoes").insert([payload.avaliacao]);
		if (avaliacaoError) throw avaliacaoError;

		if (payload.medicamentos.length > 0) {
			const { error: medError } = await supabaseClient.from("aga_medicamentos").insert(payload.medicamentos);
			if (medError) throw medError;
		}

		showToast("Avaliação salva com sucesso");
	} catch (error) {
		console.error("Erro ao salvar avaliação:", error);
		showToast("Erro ao salvar avaliação");
	}
}

function clearAll() {
	if (!confirm("Limpar todos os campos da avaliação?")) return;
	document.getElementById("agaForm").reset();
	showToast("Formulário limpo");
}

document.getElementById("btnSave")?.addEventListener("click", saveEvaluation);
document.getElementById("btnSave2")?.addEventListener("click", saveEvaluation);
document.getElementById("btnClear")?.addEventListener("click", clearAll);
document.getElementById("btnClear2")?.addEventListener("click", clearAll);
