from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "documentacao-tecnica-gth.pdf"


PRIMARY = colors.HexColor("#1A237E")
ACCENT = colors.HexColor("#2E7D32")
TEXT = colors.HexColor("#263238")
MUTED = colors.HexColor("#607D8B")
LIGHT = colors.HexColor("#F5F7FB")
BORDER = colors.HexColor("#D9E2EC")


class TechnicalDoc(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=A4,
            rightMargin=1.7 * cm,
            leftMargin=1.7 * cm,
            topMargin=1.8 * cm,
            bottomMargin=1.7 * cm,
            title="Documentação Técnica - GTH",
            author="GTH",
            subject="Documentação técnica do projeto GTH",
        )
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            id="normal",
        )
        template = PageTemplate(id="main", frames=[frame], onPage=self.draw_page)
        self.addPageTemplates([template])

    def draw_page(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(PRIMARY)
        canvas.rect(0, A4[1] - 1.05 * cm, A4[0], 1.05 * cm, stroke=0, fill=1)
        canvas.setFillColor(colors.white)
        canvas.setFont("Helvetica-Bold", 9)
        canvas.drawString(1.7 * cm, A4[1] - 0.68 * cm, "GTH - Gestão de Pessoas")
        canvas.setFont("Helvetica", 8)
        canvas.drawRightString(A4[0] - 1.7 * cm, A4[1] - 0.68 * cm, "Documentação Técnica")
        canvas.setStrokeColor(BORDER)
        canvas.line(1.7 * cm, 1.25 * cm, A4[0] - 1.7 * cm, 1.25 * cm)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(1.7 * cm, 0.75 * cm, "Projeto gth-api + gth-front")
        canvas.drawRightString(A4[0] - 1.7 * cm, 0.75 * cm, f"Página {doc.page}")
        canvas.restoreState()


def styles():
    base = getSampleStyleSheet()
    base.add(
        ParagraphStyle(
            "CoverTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=26,
            leading=31,
            textColor=PRIMARY,
            alignment=TA_CENTER,
            spaceAfter=16,
        )
    )
    base.add(
        ParagraphStyle(
            "CoverSubtitle",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=12,
            leading=17,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=22,
        )
    )
    base.add(
        ParagraphStyle(
            "Section",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=PRIMARY,
            spaceBefore=14,
            spaceAfter=8,
        )
    )
    base.add(
        ParagraphStyle(
            "Subsection",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=ACCENT,
            spaceBefore=10,
            spaceAfter=5,
        )
    )
    base.add(
        ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=13.2,
            textColor=TEXT,
            spaceAfter=6,
        )
    )
    base.add(
        ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=11,
            textColor=TEXT,
            spaceAfter=4,
        )
    )
    base.add(
        ParagraphStyle(
            "TableHeader",
            parent=base["Small"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11,
            textColor=colors.white,
        )
    )
    base.add(
        ParagraphStyle(
            "CodeBlock",
            parent=base["BodyText"],
            fontName="Courier",
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#102A43"),
            backColor=colors.HexColor("#F0F4F8"),
            borderColor=colors.HexColor("#BCCCDC"),
            borderWidth=0.25,
            borderPadding=5,
            spaceBefore=4,
            spaceAfter=7,
        )
    )
    return base


S = styles()


def p(text: str, style: str = "Body"):
    if style == "CodeBlock":
        text = text.replace("\n", "<br/>")
    return Paragraph(text, S[style])


def bullets(items):
    return ListFlowable(
        [ListItem(p(item, "Body"), leftIndent=10) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=16,
        bulletFontName="Helvetica",
        bulletFontSize=7,
        bulletColor=PRIMARY,
    )


def table(data, col_widths=None, font_size=8):
    formatted = []
    for row_index, row in enumerate(data):
        style = "TableHeader" if row_index == 0 else "Small"
        formatted.append([p(str(cell), style) for cell in row])
    t = Table(formatted, colWidths=col_widths, repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), font_size),
                ("GRID", (0, 0), (-1, -1), 0.25, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
            ]
        )
    )
    return t


def cover():
    return [
        Spacer(1, 3.2 * cm),
        p("Documentação Técnica", "CoverTitle"),
        p("Projeto GTH - API Java Spring Boot e Frontend Angular", "CoverSubtitle"),
        table(
            [
                ["Item", "Descrição"],
                ["Backend", "gth-api - Java 21, Spring Boot 3.3.5, PostgreSQL, Flyway"],
                ["Frontend", "gth-front - Angular 19 com template Egret"],
                ["Banco", "PostgreSQL 16 com carga inicial de 20 pessoas"],
                ["Execução", "Docker Compose para subir todo o ecossistema local"],
                ["Data", "16/09/2026"],
            ],
            [4 * cm, 11 * cm],
        ),
        PageBreak(),
    ]


def overview():
    return [
        p("1. Visão Geral", "Section"),
        p(
            "O GTH é uma aplicação para cadastro, consulta, alteração, exclusão e cálculo de peso ideal de pessoas. "
            "A solução foi organizada em dois projetos independentes: uma API backend e um frontend Angular. "
            "O ambiente local é orquestrado por Docker Compose, incluindo PostgreSQL, backend, frontend e PgAdmin opcional.",
        ),
        p("Objetivos atendidos", "Subsection"),
        bullets(
            [
                "CRUD completo de pessoas com validações obrigatórias.",
                "CPF validado no backend e formatado no frontend.",
                "Altura informada e exibida em centímetros.",
                "Cálculo de peso ideal com fórmulas diferentes para homens e mulheres.",
                "Botão Pesquisar integrado ao servidor, com busca por CPF parcial a partir do segundo dígito.",
                "Alteração e exclusão liberadas somente após pesquisar e selecionar uma pessoa.",
                "Seed inicial com 20 pessoas e CPFs válidos via migration Flyway.",
                "Testes automatizados de backend e frontend.",
            ]
        ),
        p("Arquitetura lógica", "Subsection"),
        table(
            [
                ["Camada", "Responsabilidade"],
                ["Frontend Angular", "Interface de cadastro, pesquisa, seleção, edição, exclusão e cálculo de peso ideal."],
                ["API Spring Boot", "Exposição dos endpoints REST, validações, regras de negócio e integração com persistência."],
                ["PostgreSQL", "Persistência relacional da tabela pessoas."],
                ["Flyway", "Controle versionado de schema e carga inicial."],
                ["Docker Compose", "Orquestração local dos serviços da solução."],
            ],
            [4 * cm, 11 * cm],
        ),
    ]


def stack():
    return [
        p("2. Stack Técnica", "Section"),
        table(
            [
                ["Área", "Tecnologias"],
                ["Backend", "Java 21, Spring Boot 3.3.5, Spring Web, Spring Data JPA, Bean Validation, Actuator"],
                ["Banco", "PostgreSQL 16, Flyway"],
                ["Documentação API", "Springdoc OpenAPI com Swagger UI"],
                ["Testes Backend", "JUnit 5, Mockito, MockMvc, Testcontainers, JaCoCo"],
                ["Frontend", "Angular 19, Angular Material, RxJS, template Egret"],
                ["Testes Frontend", "Karma, Jasmine, ChromeHeadless, cobertura via karma-coverage"],
                ["Infra local", "Docker, Docker Compose, Nginx para servir o frontend"],
            ],
            [4 * cm, 11 * cm],
        ),
        p("Estrutura principal", "Subsection"),
        p(
            "<font name='Courier'>backend/</font> contém a API Java. "
            "<font name='Courier'>frontend/gth-front/</font> contém a aplicação Angular. "
            "<font name='Courier'>frontend/themeforest-egret-angular/</font> preserva o template Egret como referência. "
            "<font name='Courier'>docker-compose.yml</font> sobe o ecossistema local.",
        ),
    ]


def backend():
    return [
        p("3. Backend - gth-api", "Section"),
        p(
            "A API segue uma separação simples por responsabilidade: controller para HTTP, service para regras de negócio, "
            "task/repository para persistência, mapper para conversão entre entidade e DTO, validation para validações específicas "
            "e domain.service para cálculo de peso ideal.",
        ),
        p("Principais endpoints", "Subsection"),
        table(
            [
                ["Método", "Endpoint", "Descrição"],
                ["GET", "/api/pessoas?page=0&size=10", "Lista pessoas de forma paginada."],
                ["GET", "/api/pessoas?cpf=10&page=0&size=10", "Pesquisa paginada por trecho do CPF."],
                ["GET", "/api/pessoas/cpf/{cpf}", "Busca exata por CPF válido."],
                ["GET", "/api/pessoas/{id}", "Busca pessoa por ID."],
                ["POST", "/api/pessoas", "Cria pessoa."],
                ["PUT", "/api/pessoas/{id}", "Atualiza pessoa."],
                ["DELETE", "/api/pessoas/{id}", "Remove pessoa."],
                ["GET", "/api/pessoas/{id}/peso-ideal", "Consulta peso ideal."],
                ["POST", "/api/pessoas/{id}/peso-ideal", "Calcula peso ideal."],
            ],
            [2 * cm, 6 * cm, 7 * cm],
            font_size=7,
        ),
        p("Validações e regras", "Subsection"),
        bullets(
            [
                "Nome obrigatório com até 120 caracteres.",
                "Data de nascimento obrigatória e anterior à data atual.",
                "CPF obrigatório, único e validado pelos dígitos verificadores.",
                "Sexo obrigatório com valores M ou F.",
                "Altura obrigatória entre 50 e 280 cm.",
                "Peso obrigatório entre 1 e 500 kg.",
                "CPF é normalizado para dígitos antes de persistir e consultar.",
            ]
        ),
        p("Fórmula de peso ideal", "Subsection"),
        table(
            [
                ["Sexo", "Fórmula aplicada"],
                ["Masculino", "Peso ideal = (72,7 x altura em metros) - 58"],
                ["Feminino", "Peso ideal = (62,1 x altura em metros) - 44,7"],
            ],
            [4 * cm, 11 * cm],
        ),
        p("Virtual Threads", "Subsection"),
        p(
            "O backend está preparado para Java Virtual Threads. O recurso permanece desligado por padrão e pode ser ativado "
            "por variável de ambiente: <font name='Courier'>SPRING_THREADS_VIRTUAL_ENABLED=true</font>.",
        ),
    ]


def database():
    return [
        p("4. Banco de Dados e Seed", "Section"),
        p(
            "O banco usa PostgreSQL com migrations Flyway. O schema é validado pelo Hibernate com "
            "<font name='Courier'>ddl-auto=validate</font>, evitando criação automática não versionada.",
        ),
        p("Migrations", "Subsection"),
        table(
            [
                ["Arquivo", "Função"],
                ["V1__create_pessoas_table.sql", "Cria a tabela pessoas e restrições iniciais."],
                ["V2__altura_em_centimetros.sql", "Ajusta altura para centímetros e atualiza constraint."],
                ["V3__seed_pessoas.sql", "Insere 20 pessoas com CPFs válidos para carga inicial."],
            ],
            [6 * cm, 9 * cm],
        ),
        p("Tabela pessoas", "Subsection"),
        table(
            [
                ["Coluna", "Tipo", "Observação"],
                ["id", "BIGSERIAL", "Chave primária."],
                ["nome", "VARCHAR(120)", "Obrigatório."],
                ["data_nascimento", "DATE", "Obrigatório."],
                ["cpf", "VARCHAR(14)", "Único; armazenado normalizado com dígitos."],
                ["sexo", "CHAR(1)", "M ou F."],
                ["altura", "NUMERIC(5,2)", "Centímetros."],
                ["peso", "NUMERIC(5,2)", "Quilogramas."],
            ],
            [4 * cm, 4 * cm, 7 * cm],
        ),
        p("Seed inicial", "Subsection"),
        p(
            "A migration V3 insere 20 registros usando <font name='Courier'>ON CONFLICT (cpf) DO NOTHING</font>, "
            "tornando a carga idempotente para CPFs já existentes.",
        ),
    ]


def frontend():
    return [
        p("5. Frontend - gth-front", "Section"),
        p(
            "O frontend Angular foi estruturado como projeto separado dentro de "
            "<font name='Courier'>frontend/gth-front</font>, usando o template Egret como base visual. "
            "A tela principal é <font name='Courier'>/pessoas</font>.",
        ),
        p("Funcionalidades da tela Pessoas", "Subsection"),
        bullets(
            [
                "Formulário com todos os campos obrigatórios.",
                "Máscara de CPF nos campos de cadastro e pesquisa.",
                "Grid paginado com seleção visual da pessoa escolhida.",
                "Botões Incluir, Alterar, Excluir e Pesquisar, todos integrados ao servidor.",
                "Alterar e Excluir permanecem bloqueados até uma pessoa ser selecionada após uma pesquisa.",
                "Cálculo de peso ideal por ação no grid.",
                "Rota raiz e /home redirecionam para /pessoas.",
                "Rota inexistente exibe tela 404 amigável em português.",
            ]
        ),
        p("Integração com a API", "Subsection"),
        p(
            "O serviço Angular centraliza as chamadas HTTP em <font name='Courier'>PessoaService</font>. "
            "Em desenvolvimento local, o proxy encaminha <font name='Courier'>/api</font> para "
            "<font name='Courier'>http://localhost:8080</font>. No Docker, o Nginx serve o build estático do Angular.",
        ),
    ]


def operations():
    return [
        p("6. Execução Local", "Section"),
        p("Subir todo o ecossistema", "Subsection"),
        p("docker compose up --build -d", "CodeBlock"),
        p("Acessos", "Subsection"),
        table(
            [
                ["Serviço", "Endereço"],
                ["Frontend", "http://localhost:4200"],
                ["API", "http://localhost:8080"],
                ["Swagger", "http://localhost:8080/swagger-ui.html"],
                ["Health", "http://localhost:8080/actuator/health"],
                ["PostgreSQL", "localhost:5432"],
                ["PgAdmin", "http://localhost:5050 - profile tools"],
            ],
            [4 * cm, 11 * cm],
        ),
        p("Credenciais locais", "Subsection"),
        table(
            [
                ["Recurso", "Valor"],
                ["Database", "gth_db"],
                ["Usuário", "gth_user"],
                ["Senha", "gth_pass"],
                ["PgAdmin email", "admin@gth.local"],
                ["PgAdmin senha", "admin"],
            ],
            [4 * cm, 11 * cm],
        ),
        p("Comandos úteis", "Subsection"),
        p("docker compose ps\n"
          "docker compose logs -f backend\n"
          "docker compose down\n"
          "docker compose down -v", "CodeBlock"),
    ]


def tests_and_delivery():
    return [
        p("7. Testes, Qualidade e Entrega", "Section"),
        p("Testes Backend", "Subsection"),
        p("cd backend\nmvn -B verify", "CodeBlock"),
        p(
            "A suíte inclui testes unitários, testes web com MockMvc e teste de integração preparado com Testcontainers "
            "para PostgreSQL real. O relatório JaCoCo é gerado em "
            "<font name='Courier'>backend/target/site/jacoco/index.html</font>.",
        ),
        p("Testes Frontend", "Subsection"),
        p("cd frontend/gth-front\nnpm run test:ci", "CodeBlock"),
        p(
            "A suíte Angular roda em ChromeHeadless e gera cobertura em "
            "<font name='Courier'>frontend/gth-front/coverage/gth-front/index.html</font>.",
        ),
        p("Critérios de entrega", "Subsection"),
        bullets(
            [
                "API sobe em Java 21 com PostgreSQL e migrations aplicadas.",
                "Frontend separado e integrado à API.",
                "Tela web possui Incluir, Alterar, Excluir e Pesquisar chamando endpoints REST.",
                "Alterar e Excluir só ficam disponíveis após Pesquisa e seleção.",
                "Carga inicial de 20 usuários disponível via Flyway.",
                "Swagger disponível para inspeção dos endpoints.",
                "Documentação técnica entregue em PDF.",
            ]
        ),
        p("8. Decisões Técnicas", "Section"),
        bullets(
            [
                "Separação entre backend e frontend para preservar independência de build e deploy.",
                "Flyway como fonte de verdade para schema e seed.",
                "Validação de CPF no backend para impedir dados inválidos independentemente do frontend.",
                "Busca parcial paginada por CPF mantendo botão Pesquisar para aderência literal ao desafio.",
                "Virtual Threads preparados, mas desligados por padrão para manter comportamento previsível.",
                "Testcontainers adotado para validar integração com PostgreSQL real no ciclo de verificação.",
            ]
        ),
    ]


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = TechnicalDoc(str(OUTPUT))
    story = []
    story.extend(cover())
    for section in [overview, stack, backend, database, frontend, operations, tests_and_delivery]:
        story.extend(section())
        story.append(Spacer(1, 0.25 * cm))
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
