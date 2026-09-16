package com.globaltech.pessoas.domain.service;

import com.globaltech.pessoas.domain.model.Pessoa;
import com.globaltech.pessoas.domain.model.Sexo;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.EnumMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class PessoaPesoIdealCalculator implements PesoIdealCalculator {

    private static final BigDecimal CENTIMETERS_PER_METER = new BigDecimal("100");
    private static final int SCALE = 2;
    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;
    private static final Map<Sexo, Formula> FORMULAS = formulas();

    @Override
    public BigDecimal calcular(Pessoa pessoa) {
        Formula formula = FORMULAS.get(pessoa.getSexo());

        if (formula == null) {
            throw new IllegalArgumentException("Sexo invalido para calculo do peso ideal.");
        }

        return formula.calcular(alturaEmMetros(pessoa.getAltura()));
    }

    private static BigDecimal alturaEmMetros(BigDecimal alturaEmCentimetros) {
        return alturaEmCentimetros.divide(CENTIMETERS_PER_METER, 4, ROUNDING_MODE);
    }

    private static Map<Sexo, Formula> formulas() {
        Map<Sexo, Formula> formulas = new EnumMap<>(Sexo.class);
        formulas.put(Sexo.M, new Formula("72.7", "58"));
        formulas.put(Sexo.F, new Formula("62.1", "44.7"));
        return Map.copyOf(formulas);
    }

    private record Formula(BigDecimal fator, BigDecimal ajuste) {

        private Formula(String fator, String ajuste) {
            this(new BigDecimal(fator), new BigDecimal(ajuste));
        }

        private BigDecimal calcular(BigDecimal alturaEmMetros) {
            return fator.multiply(alturaEmMetros)
                    .subtract(ajuste)
                    .setScale(SCALE, ROUNDING_MODE);
        }
    }
}
