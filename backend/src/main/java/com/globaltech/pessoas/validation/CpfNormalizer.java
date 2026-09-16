package com.globaltech.pessoas.validation;

import org.springframework.stereotype.Component;

@Component
public class CpfNormalizer {

    public String normalize(String cpf) {
        return CpfUtils.digitsOnly(cpf);
    }
}
