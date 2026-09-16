package com.globaltech.pessoas.controller;

import com.globaltech.pessoas.dto.PesoIdealResponse;
import com.globaltech.pessoas.dto.PessoaRequest;
import com.globaltech.pessoas.dto.PessoaResponse;
import com.globaltech.pessoas.service.PessoaService;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {

    private final PessoaService service;

    public PessoaController(PessoaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PessoaResponse> criar(@Valid @RequestBody PessoaRequest request) {
        PessoaResponse response = service.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @GetMapping
    public ResponseEntity<?> pesquisar(
            @RequestParam(required = false) String cpf,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (cpf != null && !cpf.isBlank()) {
            return ResponseEntity.ok(service.pesquisarPorCpf(cpf, PageRequest.of(page, size)));
        }

        return ResponseEntity.ok(service.listar(PageRequest.of(page, size)));
    }

    @GetMapping("/cpf/{cpf}")
    public PessoaResponse buscarPorCpf(@PathVariable String cpf) {
        return service.buscarPorCpf(cpf);
    }

    @GetMapping("/{id}")
    public PessoaResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public PessoaResponse atualizar(@PathVariable Long id, @Valid @RequestBody PessoaRequest request) {
        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/peso-ideal")
    public PesoIdealResponse calcularPesoIdeal(@PathVariable Long id) {
        return service.calcularPesoIdeal(id);
    }

    @GetMapping("/{id}/peso-ideal")
    public PesoIdealResponse consultarPesoIdeal(@PathVariable Long id) {
        return service.calcularPesoIdeal(id);
    }
}
