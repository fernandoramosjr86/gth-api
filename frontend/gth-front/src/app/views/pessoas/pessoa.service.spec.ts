import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PessoaPayload } from './pessoa.model';
import { PessoaService } from './pessoa.service';

describe('PessoaService', () => {
  let service: PessoaService;
  let httpMock: HttpTestingController;

  const payload: PessoaPayload = {
    nome: 'Maria Silva',
    dataNascimento: '1990-01-01',
    cpf: '529.982.247-25',
    sexo: 'F',
    altura: 165,
    peso: 62
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PessoaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PessoaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar pessoas', () => {
    service.listar().subscribe();

    const req = httpMock.expectOne('/api/pessoas?page=0&size=10');
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 });
  });

  it('deve pesquisar por CPF usando endpoint explicito', () => {
    service.pesquisarPorCpf('529.982.247-25').subscribe();

    const req = httpMock.expectOne('/api/pessoas/cpf/529.982.247-25');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1, ...payload });
  });

  it('deve pesquisar por CPF parcial', () => {
    service.pesquisarPorCpfParcial('52', 0, 10).subscribe();

    const req = httpMock.expectOne('/api/pessoas?cpf=52&page=0&size=10');
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 });
  });

  it('deve incluir pessoa', () => {
    service.incluir(payload).subscribe();

    const req = httpMock.expectOne('/api/pessoas');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 1, ...payload });
  });

  it('deve alterar pessoa', () => {
    service.alterar(1, payload).subscribe();

    const req = httpMock.expectOne('/api/pessoas/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 1, ...payload });
  });

  it('deve excluir pessoa', () => {
    service.excluir(1).subscribe();

    const req = httpMock.expectOne('/api/pessoas/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deve calcular peso ideal', () => {
    service.calcularPesoIdeal(1).subscribe();

    const req = httpMock.expectOne('/api/pessoas/1/peso-ideal');
    expect(req.request.method).toBe('GET');
    req.flush({ pessoaId: 1, nome: 'Maria Silva', pesoIdeal: 57.765 });
  });
});
