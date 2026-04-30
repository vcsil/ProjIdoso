CREATE TABLE pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    idade INTEGER,
    sexo CHAR(1) CHECK (sexo IN ('F', 'M')),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE aga_avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,

    data_avaliacao DATE,
    avaliador TEXT,

    escolaridade TEXT CHECK (
    escolaridade IN ('analfabeto', '1_4', '5_8', 'maior_8')
    ),

    situacao_conjugal TEXT CHECK (
        situacao_conjugal IN (
            'casado_uniao',
            'desquitado_separado_judicial',
            'divorciado',
            'viuvo',
            'solteiro',
            'separado'
            )
    ),

    ocupacao TEXT CHECK (
        ocupacao IN (
            'aposentado_com_outra_ocupacao',
            'aposentado_sem_outra_ocupacao',
            'trabalhos_domesticos',
            'trabalho_fora_domicilio'
            )
    ),

    renda_aposentadoria BOOLEAN,
    renda_pensao BOOLEAN,
    renda_mesada_filhos BOOLEAN,
    renda_aluguel BOOLEAN,
    renda_trabalho BOOLEAN,
    renda_outras BOOLEAN,
    renda_outras_texto TEXT,

    local_residencia TEXT CHECK (
        local_residencia IN ('casa_terrea', 'casa_duplex', 'apartamento', 'ilp', 'outros')
    ),
    local_residencia_outros TEXT,

    reside_sozinho BOOLEAN,
    reside_com_filhos BOOLEAN,
    reside_com_outros_familiares BOOLEAN,
    reside_com_empregada_domestica BOOLEAN,
    reside_com_cuidadores BOOLEAN,
    reside_com_outros BOOLEAN,
    reside_com_outros_texto TEXT,

    religiao TEXT CHECK (
        religiao IN ('catolica', 'evangelica', 'espirita', 'budista', 'outra')
    ),
    religiao_outra_texto TEXT,

    atividades_sociais BOOLEAN,
    atividades_sociais_texto TEXT,

    visao_status TEXT CHECK (
        visao_status IN ('normal', 'deficit')
    ),
    visao_usa_corretores BOOLEAN,

    audicao_status TEXT CHECK (
        audicao_status IN ('normal', 'deficit')
    ),
    audicao_usa_corretores BOOLEAN,

    continencia_fecal_status TEXT CHECK (
        continencia_fecal_status IN ('continente', 'incontinente')
    ),
    continencia_fecal_tempo TEXT,

    continencia_urinaria_status TEXT CHECK (
        continencia_urinaria_status IN ('continente', 'incontinente')
    ),
    continencia_urinaria_tempo TEXT,

    sono_status TEXT CHECK (
        sono_status IN ('normal', 'disturbio')
    ),
    sono_qual TEXT,

    doenca_cardiovascular BOOLEAN,
    doenca_osteoarticular BOOLEAN,

    uso_orteses TEXT,
    uso_proteses TEXT,

    vacina_influenza BOOLEAN,
    vacina_pneumococo BOOLEAN,
    vacina_tetano BOOLEAN,
    vacina_hepatite_b BOOLEAN,
    vacina_febre_amarela BOOLEAN,

    data_ultima_vacina_influenza TEXT,
    data_ultima_vacina_tetano TEXT,
    data_ultima_vacina_pneumococo TEXT,

    quedas_ultimos_12_meses BOOLEAN,
    quantidade_quedas INTEGER,

    polifarmacia BOOLEAN,

    tabagismo_status TEXT CHECK (
        tabagismo_status IN ('fumante', 'nao_fumante', 'ex_fumante')
    ),
    tabagismo_tempo_parou TEXT,

    alcool_status TEXT CHECK (
        alcool_status IN ('uso_seguro', 'uso_nocivo', 'dependencia', 'nao_bebe')
    ),
    alcool_tempo_parou TEXT,

    atividade_fisica_nao_faz BOOLEAN,
    atividade_fisica_caminhadas BOOLEAN,
    atividade_fisica_musculacao BOOLEAN,
    atividade_fisica_hidroginastica BOOLEAN,
    atividade_fisica_outras BOOLEAN,
    atividade_fisica_outras_texto TEXT,
    atividade_fisica_vezes_semana INTEGER,

    equilibrio_mobilidade_score TEXT,
    equilibrio_mobilidade_interpretacao TEXT CHECK (
        equilibrio_mobilidade_interpretacao IN ('baixo_risco_quedas', 'risco_aumentado_quedas')
    ),

    gug_score TEXT,
    gug_interpretacao TEXT CHECK (
        gug_interpretacao IN ('normal', 'leve', 'media', 'moderada', 'grave')
    ),

    abvd_score TEXT,
    abvd_interpretacao TEXT CHECK (
        abvd_interpretacao IN ('independente', 'dependente')
    ),

    barthel_score TEXT,
    barthel_interpretacao TEXT CHECK (
        barthel_interpretacao IN (
            'dependencia_total',
            'dependencia_grave',
            'dependencia_moderada',
            'dependencia_leve',
            'independente'
        )
    ),

    aivd_score TEXT,
    aivd_interpretacao TEXT CHECK (
        aivd_interpretacao IN ('independente', 'dependente')
    ),

    pfeffer_score TEXT,
    pfeffer_interpretacao TEXT CHECK (
        pfeffer_interpretacao IN ('normal', 'comprometido')
    ),

    cognicao_score TEXT,
    cognicao_status TEXT CHECK (
        cognicao_status IN ('normal', 'deficit')
    ),

    meem_score TEXT,
    meem_interpretacao TEXT CHECK (
        meem_interpretacao IN ('normal_para_escolaridade', 'alterada_para_escolaridade')
    ),

    fluencia_verbal_score TEXT,
    fluencia_verbal_interpretacao TEXT CHECK (
        fluencia_verbal_interpretacao IN ('normal_para_escolaridade', 'diminuida_para_escolaridade')
    ),

    relogio_score TEXT,
    relogio_interpretacao TEXT CHECK (
        relogio_interpretacao IN ('normal', 'comprometido')
    ),

    humor_score TEXT,
    humor_status TEXT CHECK (
        humor_status IN ('normal', 'alterado')
    ),

    yesavage_score TEXT,
    yesavage_interpretacao TEXT CHECK (
        yesavage_interpretacao IN ('normal', 'depressao', 'depressao_moderada_grave')
    ),

    estado_nutricional_score TEXT,
    estado_nutricional_status TEXT CHECK (
        estado_nutricional_status IN ('ausencia_risco', 'presenca_risco')
    ),

    man_score TEXT,
    man_interpretacao TEXT CHECK (
        man_interpretacao IN ('desnutrido', 'risco_desnutricao', 'nutrido')
    ),

    suporte_social_score TEXT,
    suporte_social_status TEXT CHECK (
        suporte_social_status IN ('adequado', 'nao_adequado')
    ),

    apgar_score TEXT,
    apgar_interpretacao TEXT CHECK (
        apgar_interpretacao IN ('acentuada_disfuncao', 'moderada_disfuncao', 'leve_disfuncao')
    ),

    cuidador_score TEXT,
    cuidador_tipo TEXT CHECK (
        cuidador_tipo IN ('formal', 'informal_familiar', 'informal_amigos_outros')
    ),

    outras_avaliacoes TEXT,
    observacoes TEXT,

    final_funcionalidade TEXT CHECK (
        final_funcionalidade IN ('independente', 'dependente')
    ),
    final_fragilidade TEXT CHECK (
        final_fragilidade IN ('fragil', 'nao_fragil')
    ),
    final_risco_quedas TEXT CHECK (
        final_risco_quedas IN ('baixo', 'alto')
    ),
    final_cognicao TEXT CHECK (
        final_cognicao IN ('deficit', 'sem_deficit')
    ),
    final_nutricao TEXT CHECK (
        final_nutricao IN ('sem_risco', 'risco')
    ),
    final_suporte_social TEXT CHECK (
        final_suporte_social IN ('adequado', 'inadequado')
    ),

    raw_payload JSONB,

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE aga_medicamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avaliacao_id UUID NOT NULL REFERENCES aga_avaliacoes(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL,
    doenca TEXT,
    medicamento TEXT,
    como_usa TEXT,
    tempo_uso TEXT,

    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT aga_medicamentos_ordem_check CHECK (ordem BETWEEN 1 AND 7),
    CONSTRAINT aga_medicamentos_avaliacao_ordem_unique UNIQUE (avaliacao_id, ordem)
);