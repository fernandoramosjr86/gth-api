import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { Pessoa, PessoaPayload } from './pessoa.model';
import { PessoaService } from './pessoa.service';

@Component({
  selector: 'app-pessoas',
  standalone: false,
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.scss']
})
export class PessoasComponent implements OnInit {
  @ViewChild('pesoIdealDialog') pesoIdealDialog?: TemplateRef<unknown>;

  displayedColumns = ['id', 'nome', 'cpf', 'sexo', 'altura', 'peso', 'acoes'];
  pessoas: Pessoa[] = [];
  pessoaSelecionada: Pessoa | null = null;
  pessoaLiberadaPorPesquisa = false;
  loading = false;
  pesoIdealTexto = '';
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  readonly pageSizeOptions = [5, 10, 20];
  readonly hoje = new Date().toISOString().slice(0, 10);

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    dataNascimento: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    sexo: ['F', Validators.required],
    altura: [null as number | null, [Validators.required, Validators.min(50), Validators.max(280)]],
    peso: [null as number | null, [Validators.required, Validators.min(1), Validators.max(500)]]
  });

  filtroCpf = this.fb.control('');

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private snackBar: MatSnackBar,
    private confirmService: AppConfirmService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  atualizar(): void {
    this.filtroCpf.setValue('', { emitEvent: false });
    this.pessoaLiberadaPorPesquisa = false;
    this.listar(0, this.pageSize);
  }

  listar(page = this.pageIndex, size = this.pageSize): void {
    this.pageIndex = page;
    this.pageSize = size;
    this.pessoaLiberadaPorPesquisa = false;
    this.loading = true;
    this.pessoaService.listar(page, size)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: resultado => {
          this.pessoas = resultado.content;
          this.totalElements = resultado.totalElements;
          this.sincronizarSelecao();
        },
        error: error => this.notificar(this.mensagemErro(error, 'Não foi possível listar as pessoas.'))
      });
  }

  mudarPagina(event: PageEvent): void {
    const cpf = this.filtroCpf.value || '';

    if (cpf.replace(/\D/g, '').length >= 2) {
      this.executarPesquisa(cpf, event.pageIndex, event.pageSize, this.pessoaLiberadaPorPesquisa);
      return;
    }

    this.listar(event.pageIndex, event.pageSize);
  }

  incluir(): void {
    if (!this.prepararValidacao()) {
      this.notificar('Confira os campos obrigatórios antes de incluir.');
      return;
    }

    this.loading = true;
    this.pessoaService.incluir(this.payload())
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: pessoa => {
          this.pessoas = [pessoa, ...this.pessoas].slice(0, this.pageSize);
          this.totalElements += 1;
          this.selecionar(pessoa, false);
          this.notificar('Pessoa incluída com sucesso.');
        },
        error: error => this.notificar(this.mensagemErro(error, 'Não foi possível incluir a pessoa.'))
      });
  }

  pesquisar(): void {
    this.executarPesquisa(this.filtroCpf.value || this.form.value.cpf || '', 0, this.pageSize, true);
  }

  pesquisarEnquantoDigita(): void {
    const cpf = this.formatarCpf(this.filtroCpf.value || '');
    this.filtroCpf.setValue(cpf, { emitEvent: false });
    this.pessoaLiberadaPorPesquisa = false;
  }

  alterar(): void {
    if (!this.pessoaSelecionada || !this.pessoaLiberadaPorPesquisa) {
      this.notificar('Pesquise e selecione uma pessoa antes de alterar.');
      return;
    }

    if (!this.prepararValidacao()) {
      this.notificar('Confira os campos antes de alterar.');
      return;
    }

    this.loading = true;
    this.pessoaService.alterar(this.pessoaSelecionada.id, this.payload())
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: pessoa => {
          this.pessoas = this.pessoas.map(item => item.id === pessoa.id ? pessoa : item);
          this.selecionar(pessoa, true);
          this.notificar('Pessoa alterada com sucesso.');
        },
        error: error => this.notificar(this.mensagemErro(error, 'Não foi possível alterar a pessoa.'))
      });
  }

  excluir(): void {
    if (!this.pessoaSelecionada || !this.pessoaLiberadaPorPesquisa) {
      this.notificar('Pesquise e selecione uma pessoa antes de excluir.');
      return;
    }

    const pessoa = this.pessoaSelecionada;
    this.confirmService.confirm({
      title: 'Excluir pessoa',
      message: `Confirma a exclusão de ${pessoa.nome}?`,
      confirmText: 'Excluir'
    }).subscribe(confirmado => {
      if (!confirmado) {
        return;
      }

      this.loading = true;
      this.pessoaService.excluir(pessoa.id)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.pessoas = this.pessoas.filter(item => item.id !== pessoa.id);
            this.totalElements = Math.max(this.totalElements - 1, 0);
            this.limpar();
            this.notificar('Pessoa excluída com sucesso.');
          },
          error: error => this.notificar(this.mensagemErro(error, 'Não foi possível excluir a pessoa.'))
        });
    });
  }

  calcularPesoIdeal(pessoa?: Pessoa): void {
    const pessoaParaCalculo = pessoa || this.pessoaSelecionada;

    if (!pessoaParaCalculo) {
      this.notificar('Pesquise ou selecione uma pessoa antes de calcular.');
      return;
    }

    if (!this.pessoaSelecionada || this.pessoaSelecionada.id !== pessoaParaCalculo.id) {
      this.selecionar(pessoaParaCalculo, this.pessoaLiberadaPorPesquisa);
    }

    this.loading = true;
    this.pessoaService.calcularPesoIdeal(pessoaParaCalculo.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: resultado => {
          this.pesoIdealTexto = `${resultado.nome}: ${resultado.pesoIdeal.toFixed(2)} kg`;
          if (this.pesoIdealDialog) {
            this.dialog.open(this.pesoIdealDialog, {
              width: '420px',
              panelClass: 'peso-ideal-dialog-panel'
            });
          }
        },
        error: error => this.notificar(this.mensagemErro(error, 'Não foi possível calcular o peso ideal.'))
      });
  }

  selecionar(pessoa: Pessoa, liberadaPorPesquisa = false): void {
    this.pessoaSelecionada = pessoa;
    this.pessoaLiberadaPorPesquisa = liberadaPorPesquisa;
    this.pesoIdealTexto = '';
    this.form.patchValue({
      nome: pessoa.nome,
      dataNascimento: pessoa.dataNascimento,
      cpf: this.formatarCpf(pessoa.cpf),
      sexo: pessoa.sexo,
      altura: pessoa.altura,
      peso: pessoa.peso
    });
  }

  limpar(): void {
    this.pessoaSelecionada = null;
    this.pessoaLiberadaPorPesquisa = false;
    this.pesoIdealTexto = '';
    this.filtroCpf.setValue('');
    this.form.reset({
      nome: '',
      dataNascimento: '',
      cpf: '',
      sexo: 'F',
      altura: null,
      peso: null
    });
  }

  aplicarMascaraCpf(campo: 'form' | 'filtro'): void {
    if (campo === 'form') {
      const cpf = this.formatarCpf(this.form.controls.cpf.value || '');
      this.form.controls.cpf.setValue(cpf, { emitEvent: false });
      return;
    }

    const cpf = this.formatarCpf(this.filtroCpf.value || '');
    this.filtroCpf.setValue(cpf, { emitEvent: false });
  }

  campoInvalido(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.dirty || control.touched);
  }

  erroCampo(campo: keyof typeof this.form.controls): string {
    const control = this.form.controls[campo];

    if (control.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (control.hasError('futura')) {
      return 'A data não pode ser futura';
    }

    if (control.hasError('maxlength')) {
      return 'Valor muito longo';
    }

    if (control.hasError('pattern')) {
      return 'Informe no formato 000.000.000-00';
    }

    if (control.hasError('cpfInvalido')) {
      return 'Informe um CPF válido';
    }

    if (control.hasError('min') || control.hasError('max')) {
      return 'Valor fora da faixa permitida';
    }

    return '';
  }

  sexoLabel(sexo: Pessoa['sexo']): string {
    return sexo === 'M' ? 'Masculino' : 'Feminino';
  }

  formatarCpf(valor: string): string {
    const digitos = valor.replace(/\D/g, '').slice(0, 11);

    if (digitos.length <= 3) {
      return digitos;
    }

    if (digitos.length <= 6) {
      return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
    }

    if (digitos.length <= 9) {
      return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
    }

    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
  }

  private payload(): PessoaPayload {
    const value = this.form.getRawValue();
    return {
      nome: (value.nome || '').trim(),
      dataNascimento: value.dataNascimento || '',
      cpf: this.formatarCpf(value.cpf || ''),
      sexo: value.sexo as 'M' | 'F',
      altura: Number(value.altura),
      peso: Number(value.peso)
    };
  }

  private prepararValidacao(): boolean {
    const cpf = this.formatarCpf(this.form.controls.cpf.value || '');
    this.form.controls.cpf.setValue(cpf, { emitEvent: false });

    if (cpf && !this.cpfValido(cpf)) {
      this.form.controls.cpf.setErrors({ cpfInvalido: true });
    }

    if (!this.dataNascimentoValida()) {
      this.form.controls.dataNascimento.setErrors({ futura: true });
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    return true;
  }

  private dataNascimentoValida(): boolean {
    const dataNascimento = this.form.controls.dataNascimento.value;
    return !dataNascimento || dataNascimento <= this.hoje;
  }

  private cpfValido(cpf: string): boolean {
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
      return false;
    }

    const digitos = cpf.replace(/\D/g, '');

    if (digitos.length !== 11 || /^(\d)\1+$/.test(digitos)) {
      return false;
    }

    const calcularDigito = (tamanho: number): number => {
      let soma = 0;

      for (let i = 0; i < tamanho; i++) {
        soma += Number(digitos[i]) * (tamanho + 1 - i);
      }

      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    return calcularDigito(9) === Number(digitos[9]) && calcularDigito(10) === Number(digitos[10]);
  }

  private sincronizarSelecao(): void {
    if (!this.pessoaSelecionada) {
      return;
    }

    const pessoaAtualizada = this.pessoas.find(pessoa => pessoa.id === this.pessoaSelecionada?.id);

    if (!pessoaAtualizada) {
      this.limpar();
      return;
    }

    this.selecionar(pessoaAtualizada, this.pessoaLiberadaPorPesquisa);
  }

  private executarPesquisa(valor: string, page = 0, size = this.pageSize, liberarAlteracao = false): void {
    const cpf = this.formatarCpf(valor || '');
    const digitos = cpf.replace(/\D/g, '');

    this.filtroCpf.setValue(cpf, { emitEvent: false });

    if (digitos.length < 2) {
      this.pessoaLiberadaPorPesquisa = false;
      this.listar(0, size);
      return;
    }

    this.pageIndex = page;
    this.pageSize = size;
    this.loading = true;
    this.pessoaService.pesquisarPorCpfParcial(cpf, page, size)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: resultado => {
          this.pessoas = resultado.content;
          this.totalElements = resultado.totalElements;
          this.pessoaLiberadaPorPesquisa = liberarAlteracao && digitos.length >= 2;
          this.sincronizarSelecao();
        },
        error: error => this.notificar(this.mensagemErro(error, 'Não foi possível pesquisar as pessoas.'))
      });
  }

  private mensagemErro(error: any, fallback: string): string {
    const messages = error?.error?.messages;

    if (Array.isArray(messages) && messages.length) {
      return messages[0];
    }

    return error?.error?.message || fallback;
  }

  private notificar(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
