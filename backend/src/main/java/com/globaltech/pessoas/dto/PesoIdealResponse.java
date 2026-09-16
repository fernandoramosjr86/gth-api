package com.globaltech.pessoas.dto;

import java.math.BigDecimal;

public record PesoIdealResponse(
        Long pessoaId,
        String nome,
        BigDecimal pesoIdeal
) {
}
