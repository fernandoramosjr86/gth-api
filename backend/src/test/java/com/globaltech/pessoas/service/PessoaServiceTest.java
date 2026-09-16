package com.globaltech.pessoas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.globaltech.pessoas.domain.model.Pessoa;
import com.globaltech.pessoas.domain.model.Sexo;
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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class PessoaServiceTest {

    @Mock
    private PessoaTask task;

    @Mock
    private PesoIdealCalculator pesoIdealCalculator;

    private CpfNormalizer cpfNormalizer;

    private PessoaService service;

    @BeforeEach
    void setUp() {
        cpfNormalizer = new CpfNormalizer();
        service = new PessoaService(task, new PessoaMapper(cpfNormalizer), pesoIdealCalculator, cpfNormalizer);
    }

    @Test
    void deveListarPessoasPaginadas() {
        PageRequest pageable = PageRequest.of(0, 10);
        Pessoa pessoa = pessoa(1L, "Maria Silva", "52998224725", Sexo.F);
        when(task.listar(pageable)).thenReturn(new PageImpl<>(List.of(pessoa), pageable, 1));

        PageResponse<PessoaResponse> response = service.listar(pageable);

        assertThat(response.content()).hasSize(1);
        assertThat(response.totalElements()).isEqualTo(1);
        assertThat(response.content().getFirst().nome()).isEqualTo("Maria Silva");
    }

    @Test
    void devePesquisarPessoasPorCpfParcial() {
        PageRequest pageable = PageRequest.of(0, 10);
        Pessoa pessoa = pessoa(1L, "Maria Silva", "52998224725", Sexo.F);
        when(task.pesquisarPorCpf("529", pageable)).thenReturn(new PageImpl<>(List.of(pessoa), pageable, 1));

        PageResponse<PessoaResponse> response = service.pesquisarPorCpf("529.", pageable);

        assertThat(response.content()).hasSize(1);
        assertThat(response.totalElements()).isEqualTo(1);
        assertThat(response.content().getFirst().cpf()).isEqualTo("52998224725");
    }

    @Test
    void deveCriarPessoaQuandoCpfNaoExiste() {
        PessoaRequest request = request("Maria Silva", "529.982.247-25");
        Pessoa pessoaSalva = pessoa(1L, "Maria Silva", "52998224725", Sexo.F);

        when(task.cpfExiste("52998224725")).thenReturn(false);
        when(task.salvar(org.mockito.ArgumentMatchers.any(Pessoa.class))).thenReturn(pessoaSalva);

        PessoaResponse response = service.criar(request);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Maria Silva");
        assertThat(response.cpf()).isEqualTo("52998224725");
    }

    @Test
    void deveBloquearCriacaoComCpfDuplicado() {
        PessoaRequest request = request("Maria Silva", "529.982.247-25");
        when(task.cpfExiste("52998224725")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(request))
                .isInstanceOf(CpfJaCadastradoException.class)
                .hasMessage("CPF ja cadastrado.");
    }

    @Test
    void deveAtualizarPessoaExistente() {
        PessoaRequest request = request("Maria Atualizada", "529.982.247-25");
        Pessoa pessoa = pessoa(1L, "Maria Silva", "52998224725", Sexo.F);

        when(task.buscarPorId(1L)).thenReturn(Optional.of(pessoa));
        when(task.cpfExisteParaOutraPessoa("52998224725", 1L)).thenReturn(false);
        when(task.salvar(pessoa)).thenReturn(pessoa);

        PessoaResponse response = service.atualizar(1L, request);

        assertThat(response.nome()).isEqualTo("Maria Atualizada");
        verify(task).salvar(pessoa);
    }

    @Test
    void deveRetornarErroQuandoPessoaNaoExiste() {
        when(task.buscarPorId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99L))
                .isInstanceOf(RecursoNaoEncontradoException.class)
                .hasMessage("Pessoa nao encontrada.");
    }

    @Test
    void deveCalcularPesoIdeal() {
        Pessoa pessoa = pessoa(1L, "Joao Silva", "52998224725", Sexo.M);
        when(task.buscarPorId(1L)).thenReturn(Optional.of(pessoa));
        when(pesoIdealCalculator.calcular(pessoa)).thenReturn(new BigDecimal("72.86"));

        PesoIdealResponse response = service.calcularPesoIdeal(1L);

        assertThat(response.pessoaId()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Joao Silva");
        assertThat(response.pesoIdeal()).isEqualByComparingTo("72.86");
    }

    private PessoaRequest request(String nome, String cpf) {
        return new PessoaRequest(
                nome,
                LocalDate.of(1990, 5, 10),
                cpf,
                Sexo.F,
                new BigDecimal("168.00"),
                new BigDecimal("62.50")
        );
    }

    private Pessoa pessoa(Long id, String nome, String cpf, Sexo sexo) {
        Pessoa pessoa = new Pessoa();
        pessoa.setId(id);
        pessoa.setNome(nome);
        pessoa.setDataNascimento(LocalDate.of(1990, 5, 10));
        pessoa.setCpf(cpf);
        pessoa.setSexo(sexo);
        pessoa.setAltura(new BigDecimal("180.00"));
        pessoa.setPeso(new BigDecimal("82.00"));
        return pessoa;
    }
}
