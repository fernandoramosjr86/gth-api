package com.globaltech.pessoas.mapper;

import com.globaltech.pessoas.domain.model.Pessoa;
import com.globaltech.pessoas.dto.PessoaRequest;
import com.globaltech.pessoas.dto.PessoaResponse;
import com.globaltech.pessoas.validation.CpfNormalizer;
import org.springframework.stereotype.Component;

@Component
public class PessoaMapper {

    private final CpfNormalizer cpfNormalizer;

    public PessoaMapper(CpfNormalizer cpfNormalizer) {
        this.cpfNormalizer = cpfNormalizer;
    }

    public Pessoa toEntity(PessoaRequest request) {
        Pessoa pessoa = new Pessoa();
        copyToEntity(request, pessoa);
        return pessoa;
    }

    public void copyToEntity(PessoaRequest request, Pessoa pessoa) {
        pessoa.setNome(request.nome());
        pessoa.setDataNascimento(request.dataNascimento());
        pessoa.setCpf(cpfNormalizer.normalize(request.cpf()));
        pessoa.setSexo(request.sexo());
        pessoa.setAltura(request.altura());
        pessoa.setPeso(request.peso());
    }

    public PessoaResponse toResponse(Pessoa pessoa) {
        return new PessoaResponse(
                pessoa.getId(),
                pessoa.getNome(),
                pessoa.getDataNascimento(),
                pessoa.getCpf(),
                pessoa.getSexo(),
                pessoa.getAltura(),
                pessoa.getPeso()
        );
    }
}
