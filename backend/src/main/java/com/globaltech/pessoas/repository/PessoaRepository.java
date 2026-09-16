package com.globaltech.pessoas.repository;

import com.globaltech.pessoas.domain.model.Pessoa;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

    Optional<Pessoa> findByCpf(String cpf);

    Page<Pessoa> findByCpfContaining(String cpf, Pageable pageable);

    boolean existsByCpf(String cpf);

    boolean existsByCpfAndIdNot(String cpf, Long id);
}
