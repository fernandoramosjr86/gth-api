package com.globaltech.pessoas.task;

import com.globaltech.pessoas.domain.model.Pessoa;
import com.globaltech.pessoas.repository.PessoaRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class PessoaTask {

    private final PessoaRepository repository;

    public PessoaTask(PessoaRepository repository) {
        this.repository = repository;
    }

    public Pessoa salvar(Pessoa pessoa) {
        return repository.save(pessoa);
    }

    public Page<Pessoa> listar(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<Pessoa> pesquisarPorCpf(String cpf, Pageable pageable) {
        return repository.findByCpfContaining(cpf, pageable);
    }

    public Optional<Pessoa> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Optional<Pessoa> buscarPorCpf(String cpf) {
        return repository.findByCpf(cpf);
    }

    public void excluir(Pessoa pessoa) {
        repository.delete(pessoa);
    }

    public boolean cpfExiste(String cpf) {
        return repository.existsByCpf(cpf);
    }

    public boolean cpfExisteParaOutraPessoa(String cpf, Long id) {
        return repository.existsByCpfAndIdNot(cpf, id);
    }
}
