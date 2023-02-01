import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss']
})
export class PasswordFormComponent implements OnInit, OnDestroy {

  myForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  isLetters: boolean;
  isDigits: boolean;
  isSymbols: boolean;
  passwordLevel: number = 0;

  private unsubscribingData$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.passwordTesting();
  }

  passwordTesting(): void {
    this.myForm.get('password')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.unsubscribingData$)
    ).subscribe((password: string) => {
      this.isDigits, this.isLetters, this.isSymbols = false;
      this.passwordLevel = 0;
      this.isDigitChecking(password);
      this.isLettersChecking(password);
      this.isSymbolsChecking(password);
    })
  }

  isDigitChecking(password: string): void {
    let numbers = /[0-9]/g;
    if (password.match(numbers)) {
      this.passwordLevel++;
    }
  }

  isLettersChecking(password: string): void {
    let upperCaseLetters = /[a-zа-я]/gi;
    if (password.match(upperCaseLetters)) {
      this.passwordLevel++;
    }
  }

  isSymbolsChecking(password: string): void {
    let symbols = /[`!@#$%^&*()_/|}{}/-]/g;
    if (password.match(symbols)) {
      this.passwordLevel++;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribingData$.next();
    this.unsubscribingData$.complete();
  }
}
