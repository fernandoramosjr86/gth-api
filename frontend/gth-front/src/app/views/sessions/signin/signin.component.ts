import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: egretAnimations,
    standalone: false
})
export class SigninComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  isLoading = false;

  signupForm: UntypedFormGroup;
  hidePassword = true;
  errorMsg = '';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jwtAuth: JwtAuthService,
    private egretLoader: AppLoaderService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['support@ui-lib.com', [Validators.required, Validators.email]],
      password: ['12345678', Validators.required],
      remember: [false]
    });
  }

  ngAfterViewInit() {
    // Uncomment if you want auto sign-in
    // this.autoSignIn();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(1);
    this._unsubscribeAll.complete();
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const signinData = this.signupForm.value;
      
      this.submitButton.disabled = true;
      this.progressBar.mode = 'indeterminate';
      this.isLoading = true;
      this.jwtAuth.signin(signinData.email, signinData.password)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl(this.jwtAuth.return);
          this.isLoading = false;
        },
        error: (err) => {
          this.submitButton.disabled = false;
          this.progressBar.mode = 'determinate';
          this.errorMsg = err.message;
          this.isLoading = false;
        }
      });
    }
  }

  autoSignIn() {
    if (this.jwtAuth.return === '/') {
      return;
    }
    this.egretLoader.open(`Automatically Signing you in! \n Return url: ${this.jwtAuth.return.substring(0, 20)}...`, {width: '320px'});
    setTimeout(() => {
      this.onSubmit();
      this.egretLoader.close();
    }, 2000);
  }
}
