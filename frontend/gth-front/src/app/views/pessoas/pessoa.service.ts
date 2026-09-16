import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse, PesoIdeal, Pessoa, PessoaPayload } from './pessoa.model';

@Injectable()
export class PessoaService {
  private readonly baseUrl = '/api/pessoas';

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 10): Observable<PageResponse<Pessoa>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Pessoa>>(this.baseUrl, { params });
  }

  pesquisarPorCpf(cpf: string): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.baseUrl}/cpf/${cpf}`);
  }

  pesquisarPorCpfParcial(cpf: string, page = 0, size = 10): Observable<PageResponse<Pessoa>> {
    const params = new HttpParams()
      .set('cpf', cpf)
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Pessoa>>(this.baseUrl, { params });
  }

  incluir(payload: PessoaPayload): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.baseUrl, payload);
  }

  alterar(id: number, payload: PessoaPayload): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.baseUrl}/${id}`, payload);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  calcularPesoIdeal(id: number): Observable<PesoIdeal> {
    return this.http.get<PesoIdeal>(`${this.baseUrl}/${id}/peso-ideal`);
  }
}
