package com.globaltech.pessoas.service;

import com.globaltech.pessoas.domain.model.Pessoa;
import com.globaltech.pessoas.domain.service.PesoIdealCalculator;
import com.globaltech.pessoas.dto.PageResponse;
import com.globaltech.pessoas.dto.PesoIdealResponse;
import com.globaltech.pessoas.dto.PessoaRequest;
import com.globaltech.pessoas.dto.PessoaResponse;
import com.globaltech.pessoas.exception.CpfJaCadastradoException;
import com.globaltech.pessoas.exception.RecursoNaoEncontradoException;
import com.globaltech.pessoas.mapper.PessoaMapper;
import com.globaltech.pessoas.task.PessoaTask;
import com.globaltech.pessoas.validation.CpfNormalizer;
import com.globaltech.pessoas.validation.CpfUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PessoaService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PessoaService.class);

    private final PessoaTask task;
    private final PessoaMapper mapper;
    private final PesoIdealCalculator pesoIdealCalculator;
    private final CpfNormalizer cpfNormalizer;

    public PessoaService(
            PessoaTask task,
            PessoaMapper mapper,
            PesoIdealCalculator pesoIdealCalculator,
            CpfNormalizer cpfNormalizer
    ) {
        this.task = task;
        this.mapper = mapper;
        this.pesoIdealCalculator = pesoIdealCalculator;
        this.cpfNormalizer = cpfNormalizer;
    }

    @Transactional
    public PessoaResponse criar(PessoaRequest request) {
        String cpf = cpfNormalizer.normalize(request.cpf());

        if (task.cpfExiste(cpf)) {
            throw new CpfJaCadastradoException("CPF ja cadastrado.");
        }

        Pessoa pessoa = mapper.toEntity(request);
        Pessoa pessoaSalva = task.salvar(pessoa);
        LOGGER.info("Pessoa criada com id={}", pessoaSalva.getId());
        return mapper.toResponse(pessoaSalva);
    }

    @Transactional(readOnly = true)
    public PageResponse<PessoaResponse> listar(Pageable pageable) {
        return PageResponse.from(task.listar(pageable).map(mapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PageResponse<PessoaResponse> pesquisarPorCpf(String cpf, Pageable pageable) {
        return PageResponse.from(task.pesquisarPorCpf(cpfNormalizer.normalize(cpf), pageable).map(mapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PessoaResponse buscarPorId(Long id) {
        return mapper.toResponse(obterPessoa(id));
    }

    @Transactional(readOnly = true)
    public PessoaResponse buscarPorCpf(String cpf) {
        if (!CpfUtils.isValid(cpf)) {
            throw new IllegalArgumentException("CPF invalido.");
        }

        Pessoa pessoa = task.buscarPorCpf(cpfNormalizer.normalize(cpf))
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pessoa nao encontrada."));

        return mapper.toResponse(pessoa);
    }

    @Transactional
    public PessoaResponse atualizar(Long id, PessoaRequest request) {
        Pessoa pessoa = obterPessoa(id);
        String cpf = cpfNormalizer.normalize(request.cpf());

        if (task.cpfExisteParaOutraPessoa(cpf, id)) {
            throw new CpfJaCadastradoException("CPF ja cadastrado para outra pessoa.");
        }

        mapper.copyToEntity(request, pessoa);
        Pessoa pessoaSalva = task.salvar(pessoa);
        LOGGER.info("Pessoa atualizada com id={}", pessoaSalva.getId());
        return mapper.toResponse(pessoaSalva);
    }

    @Transactional
    public void excluir(Long id) {
        Pessoa pessoa = obterPessoa(id);
        task.excluir(pessoa);
        LOGGER.info("Pessoa excluida com id={}", id);
    }

    @Transactional(readOnly = true)
    public PesoIdealResponse calcularPesoIdeal(Long id) {
        Pessoa pessoa = obterPessoa(id);
        return new PesoIdealResponse(pessoa.getId(), pessoa.getNome(), pesoIdealCalculator.calcular(pessoa));
    }

    private Pessoa obterPessoa(Long id) {
        return task.buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pessoa nao encontrada."));
    }
}
