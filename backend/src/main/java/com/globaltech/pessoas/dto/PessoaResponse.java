package com.globaltech.pessoas.dto;

import com.globaltech.pessoas.domain.model.Sexo;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PessoaResponse(
        Long id,
        String nome,
        LocalDate dataNascimento,
        String cpf,
        Sexo sexo,
        BigDecimal altura,
        BigDecimal peso
) {
}
