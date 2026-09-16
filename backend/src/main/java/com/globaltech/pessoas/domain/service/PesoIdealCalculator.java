package com.globaltech.pessoas.domain.service;

import com.globaltech.pessoas.domain.model.Pessoa;
import java.math.BigDecimal;

public interface PesoIdealCalculator {

    BigDecimal calcular(Pessoa pessoa);
}
