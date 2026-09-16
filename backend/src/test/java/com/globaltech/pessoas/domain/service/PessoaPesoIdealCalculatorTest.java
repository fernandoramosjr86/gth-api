package com.globaltech.pessoas.domain.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.globaltech.pessoas.domain.model.Pessoa;
import com.globaltech.pessoas.domain.model.Sexo;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class PessoaPesoIdealCalculatorTest {

    private final PesoIdealCalculator calculator = new PessoaPesoIdealCalculator();

    @Test
    void deveCalcularPesoIdealParaHomem() {
        BigDecimal pesoIdeal = calculator.calcular(pessoa(Sexo.M, "180"));

        assertThat(pesoIdeal).isEqualByComparingTo("72.86");
    }

    @Test
    void deveCalcularPesoIdealParaMulher() {
        BigDecimal pesoIdeal = calculator.calcular(pessoa(Sexo.F, "168"));

        assertThat(pesoIdeal).isEqualByComparingTo("59.63");
    }

    @Test
    void deveAplicarFormulasDiferentesParaMesmaAltura() {
        BigDecimal pesoIdealHomem = calculator.calcular(pessoa(Sexo.M, "170"));
        BigDecimal pesoIdealMulher = calculator.calcular(pessoa(Sexo.F, "170"));

        assertThat(pesoIdealHomem).isEqualByComparingTo("65.59");
        assertThat(pesoIdealMulher).isEqualByComparingTo("60.87");
    }

    private Pessoa pessoa(Sexo sexo, String alturaEmCentimetros) {
        Pessoa pessoa = new Pessoa();
        pessoa.setSexo(sexo);
        pessoa.setAltura(new BigDecimal(alturaEmCentimetros));
        return pessoa;
    }
}
