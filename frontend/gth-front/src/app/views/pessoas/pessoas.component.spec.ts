import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { PessoasComponent } from './pessoas.component';
import { PessoaService } from './pessoa.service';

describe('PessoasComponent', () => {
  let component: PessoasComponent;
  let pessoaService: jasmine.SpyObj<PessoaService>;
  let confirmService: jasmine.SpyObj<AppConfirmService>;
  let dialog: jasmine.SpyObj<any>;

  beforeEach(() => {
    pessoaService = jasmine.createSpyObj<PessoaService>('PessoaService', [
      'listar',
      'pesquisarPorCpf',
      'pesquisarPorCpfParcial',
      'incluir',
      'alterar',
      'excluir',
      'calcularPesoIdeal'
    ]);
    pessoaService.listar.and.returnValue(of({
      content: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    }));
    pessoaService.pesquisarPorCpfParcial.and.returnValue(of({
      content: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    }));

    confirmService = jasmine.createSpyObj<AppConfirmService>('AppConfirmService', ['confirm']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    component = new PessoasComponent(
      new FormBuilder(),
      pessoaService,
      jasmine.createSpyObj('MatSnackBar', ['open']),
      confirmService,
      dialog
    );
  });

  it('deve aplicar mascara de CPF', () => {
    expect(component.formatarCpf('52998224725')).toBe('529.982.247-25');
    expect(component.formatarCpf('529.982.247-25')).toBe('529.982.247-25');
    expect(component.formatarCpf('123456')).toBe('123.456');
  });

  it('deve selecionar pessoa e preencher formulario', () => {
    component.selecionar({
      id: 1,
      nome: 'Joao Silva',
      dataNascimento: '1985-05-10',
      cpf: '52998224725',
      sexo: 'M',
      altura: 180,
      peso: 85
    });

    expect(component.pessoaSelecionada?.id).toBe(1);
    expect(component.form.controls.nome.value).toBe('Joao Silva');
    expect(component.form.controls.cpf.value).toBe('529.982.247-25');
    expect(component.filtroCpf.value).toBe('');
  });

  it('deve aguardar pelo menos dois digitos para pesquisar', () => {
    component.filtroCpf.setValue('1');

    component.pesquisar();

    expect(pessoaService.pesquisarPorCpfParcial).not.toHaveBeenCalled();
  });

  it('deve pesquisar por CPF ao clicar no botao pesquisar', () => {
    component.filtroCpf.setValue('52');
    pessoaService.pesquisarPorCpfParcial.and.returnValue(of({
      content: [{
        id: 1,
        nome: 'Maria Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        sexo: 'F',
        altura: 165,
        peso: 62
      }],
      page: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1
    }));

    component.pesquisar();

    expect(pessoaService.pesquisarPorCpfParcial).toHaveBeenCalledOnceWith('52', 0, 10);
    expect(component.pessoas.length).toBe(1);
    expect(component.pessoaLiberadaPorPesquisa).toBeTrue();
  });

  it('deve apenas formatar CPF enquanto digita, sem pesquisar no servidor', () => {
    component.filtroCpf.setValue('52998224725');
    component.pessoaLiberadaPorPesquisa = true;

    component.pesquisarEnquantoDigita();

    expect(component.filtroCpf.value).toBe('529.982.247-25');
    expect(component.pessoaLiberadaPorPesquisa).toBeFalse();
    expect(pessoaService.pesquisarPorCpfParcial).not.toHaveBeenCalled();
  });

  it('deve limpar o CPF da pesquisa ao atualizar', () => {
    component.filtroCpf.setValue('529.982.247-25');

    component.atualizar();

    expect(component.filtroCpf.value).toBe('');
    expect(pessoaService.listar).toHaveBeenCalledWith(0, 10);
  });

  it('deve carregar lista paginada', () => {
    pessoaService.listar.and.returnValue(of({
      content: [{
        id: 1,
        nome: 'Maria Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        sexo: 'F',
        altura: 165,
        peso: 62
      }],
      page: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1
    }));

    component.listar(0, 10);

    expect(component.pessoas.length).toBe(1);
    expect(component.totalElements).toBe(1);
    expect(pessoaService.listar).toHaveBeenCalledWith(0, 10);
  });

  it('deve confirmar antes de excluir pessoa selecionada apos pesquisa', () => {
    component.selecionar({
      id: 1,
      nome: 'Maria Silva',
      dataNascimento: '1990-01-01',
      cpf: '52998224725',
      sexo: 'F',
      altura: 165,
      peso: 62
    }, true);
    confirmService.confirm.and.returnValue(of(false));

    component.excluir();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(pessoaService.excluir).not.toHaveBeenCalled();
  });

  it('deve alterar pessoa selecionada apos pesquisa', () => {
    component.selecionar({
      id: 1,
      nome: 'Maria Silva',
      dataNascimento: '1990-01-01',
      cpf: '52998224725',
      sexo: 'F',
      altura: 165,
      peso: 62
    }, true);
    pessoaService.alterar.and.returnValue(of({
      id: 1,
      nome: 'Maria Atualizada',
      dataNascimento: '1990-01-01',
      cpf: '52998224725',
      sexo: 'F',
      altura: 165,
      peso: 62
    }));

    component.form.controls.nome.setValue('Maria Atualizada');
    component.alterar();

    expect(pessoaService.alterar).toHaveBeenCalled();
  });

  it('nao deve alterar pessoa selecionada sem pesquisa previa', () => {
    component.selecionar({
      id: 1,
      nome: 'Maria Silva',
      dataNascimento: '1990-01-01',
      cpf: '52998224725',
      sexo: 'F',
      altura: 165,
      peso: 62
    });

    component.alterar();

    expect(pessoaService.alterar).not.toHaveBeenCalled();
  });

  it('nao deve excluir pessoa selecionada sem pesquisa previa', () => {
    component.selecionar({
      id: 1,
      nome: 'Maria Silva',
      dataNascimento: '1990-01-01',
      cpf: '52998224725',
      sexo: 'F',
      altura: 165,
      peso: 62
    });

    component.excluir();

    expect(confirmService.confirm).not.toHaveBeenCalled();
    expect(pessoaService.excluir).not.toHaveBeenCalled();
  });
});
