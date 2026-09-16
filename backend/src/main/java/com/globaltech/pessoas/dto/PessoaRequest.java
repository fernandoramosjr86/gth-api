package com.globaltech.pessoas.dto;

import com.globaltech.pessoas.domain.model.Sexo;
import com.globaltech.pessoas.validation.Cpf;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PessoaRequest(
        @NotBlank(message = "Nome e obrigatorio")
        @Size(max = 120, message = "Nome deve ter no maximo 120 caracteres")
        String nome,

        @NotNull(message = "Data de nascimento e obrigatoria")
        @Past(message = "Data de nascimento deve ser anterior a data atual")
        LocalDate dataNascimento,

        @NotBlank(message = "CPF e obrigatorio")
        @Size(max = 14, message = "CPF deve ter no maximo 14 caracteres")
        @Cpf(message = "CPF invalido")
        String cpf,

        @NotNull(message = "Sexo e obrigatorio")
        Sexo sexo,

        @NotNull(message = "Altura e obrigatoria")
        @DecimalMin(value = "50.00", message = "Altura deve ser maior ou igual a 50 cm")
        @DecimalMax(value = "280.00", message = "Altura deve ser menor ou igual a 280 cm")
        BigDecimal altura,

        @NotNull(message = "Peso e obrigatorio")
        @DecimalMin(value = "1.00", message = "Peso deve ser maior ou igual a 1 kg")
        @DecimalMax(value = "500.00", message = "Peso deve ser menor ou igual a 500 kg")
        BigDecimal peso
) {
}
