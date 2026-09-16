package com.globaltech.pessoas.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.globaltech.pessoas.domain.model.Sexo;
import com.globaltech.pessoas.dto.PageResponse;
import com.globaltech.pessoas.dto.PesoIdealResponse;
import com.globaltech.pessoas.dto.PessoaRequest;
import com.globaltech.pessoas.dto.PessoaResponse;
import com.globaltech.pessoas.exception.CpfJaCadastradoException;
import com.globaltech.pessoas.exception.RecursoNaoEncontradoException;
import com.globaltech.pessoas.service.PessoaService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PessoaController.class)
class PessoaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PessoaService service;

    @Test
    void deveCriarPessoa() throws Exception {
        when(service.criar(any(PessoaRequest.class))).thenReturn(response(1L, "Maria Silva", "52998224725"));

        mockMvc.perform(post("/api/pessoas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Maria Silva", "52998224725")))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/api/pessoas/1")))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("Maria Silva"));
    }

    @Test
    void deveListarPessoas() throws Exception {
        when(service.listar(any())).thenReturn(new PageResponse<>(
                List.of(response(1L, "Maria Silva", "52998224725")),
                0,
                10,
                1,
                1
        ));

        mockMvc.perform(get("/api/pessoas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].cpf").value("52998224725"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void devePesquisarPorCpf() throws Exception {
        when(service.pesquisarPorCpf(any(), any())).thenReturn(new PageResponse<>(
                List.of(response(1L, "Maria Silva", "52998224725")),
                0,
                10,
                1,
                1
        ));

        mockMvc.perform(get("/api/pessoas").param("cpf", "52"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].cpf").value("52998224725"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void devePesquisarPorCpfEmEndpointExplicito() throws Exception {
        when(service.buscarPorCpf("52998224725")).thenReturn(response(1L, "Maria Silva", "52998224725"));

        mockMvc.perform(get("/api/pessoas/cpf/52998224725"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.cpf").value("52998224725"));
    }

    @Test
    void deveBuscarPessoaPorId() throws Exception {
        when(service.buscarPorId(1L)).thenReturn(response(1L, "Maria Silva", "52998224725"));

        mockMvc.perform(get("/api/pessoas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Maria Silva"));
    }

    @Test
    void deveAtualizarPessoa() throws Exception {
        when(service.atualizar(any(Long.class), any(PessoaRequest.class)))
                .thenReturn(response(1L, "Maria Atualizada", "52998224725"));

        mockMvc.perform(put("/api/pessoas/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Maria Atualizada", "52998224725")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Maria Atualizada"));
    }

    @Test
    void deveExcluirPessoa() throws Exception {
        doNothing().when(service).excluir(1L);

        mockMvc.perform(delete("/api/pessoas/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deveCalcularPesoIdealPorGet() throws Exception {
        when(service.calcularPesoIdeal(1L)).thenReturn(new PesoIdealResponse(1L, "Maria Silva", new BigDecimal("59.63")));

        mockMvc.perform(get("/api/pessoas/1/peso-ideal"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pessoaId").value(1))
                .andExpect(jsonPath("$.pesoIdeal").value(59.63));
    }

    @Test
    void deveRetornarBadRequestParaPayloadInvalido() throws Exception {
        mockMvc.perform(post("/api/pessoas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void deveRetornarNotFoundQuandoPessoaNaoExiste() throws Exception {
        when(service.buscarPorId(99L)).thenThrow(new RecursoNaoEncontradoException("Pessoa nao encontrada."));

        mockMvc.perform(get("/api/pessoas/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.messages[0]").value("Pessoa nao encontrada."));
    }

    @Test
    void deveRetornarConflictParaCpfDuplicado() throws Exception {
        when(service.criar(any(PessoaRequest.class))).thenThrow(new CpfJaCadastradoException("CPF ja cadastrado."));

        mockMvc.perform(post("/api/pessoas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Maria Silva", "52998224725")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.messages[0]").value("CPF ja cadastrado."));
    }

    @Test
    void deveRetornarBadRequestParaCpfInvalido() throws Exception {
        mockMvc.perform(post("/api/pessoas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Maria Silva", "abc123")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    private PessoaResponse response(Long id, String nome, String cpf) {
        return new PessoaResponse(
                id,
                nome,
                LocalDate.of(1990, 5, 10),
                cpf,
                Sexo.F,
                new BigDecimal("168.00"),
                new BigDecimal("62.50")
        );
    }

    private String payload(String nome, String cpf) {
        return """
                {
                  "nome": "%s",
                  "dataNascimento": "1990-05-10",
                  "cpf": "%s",
                  "sexo": "F",
                  "altura": 168,
                  "peso": 62.50
                }
                """.formatted(nome, cpf);
    }
}
