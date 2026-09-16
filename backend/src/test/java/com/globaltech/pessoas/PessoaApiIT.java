package com.globaltech.pessoas;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globaltech.pessoas.domain.model.Sexo;
import com.globaltech.pessoas.dto.PessoaRequest;
import com.globaltech.pessoas.dto.PessoaResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PessoaApiIT {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("gth_it")
            .withUsername("gth_user")
            .withPassword("gth_pass");

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Test
    void devePersistirPesquisarEListarPessoaComPostgresReal() throws Exception {
        PessoaRequest request = new PessoaRequest(
                "Maria Integracao",
                LocalDate.of(1990, 1, 1),
                "529.982.247-25",
                Sexo.F,
                new BigDecimal("168.00"),
                new BigDecimal("62.00")
        );

        ResponseEntity<PessoaResponse> created = restTemplate.postForEntity(url("/api/pessoas"), request, PessoaResponse.class);

        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(created.getBody()).isNotNull();
        assertThat(created.getBody().id()).isNotNull();
        assertThat(created.getBody().cpf()).isEqualTo("52998224725");

        ResponseEntity<PessoaResponse> foundByCpf = restTemplate.getForEntity(
                url("/api/pessoas/cpf/52998224725"),
                PessoaResponse.class
        );

        assertThat(foundByCpf.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(foundByCpf.getBody()).isNotNull();
        assertThat(foundByCpf.getBody().nome()).isEqualTo("Maria Integracao");

        ResponseEntity<String> page = restTemplate.getForEntity(url("/api/pessoas?page=0&size=10"), String.class);
        JsonNode pageJson = objectMapper.readTree(page.getBody());

        assertThat(page.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(pageJson.get("totalElements").asLong()).isEqualTo(1);
        assertThat(pageJson.get("content").get(0).get("cpf").asText()).isEqualTo("52998224725");
    }

    private String url(String path) {
        return "http://localhost:" + port + path;
    }
}
