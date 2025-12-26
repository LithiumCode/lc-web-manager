import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = false;
  public isSaving = false

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true }; 
  }

  async onSubmit() {
    this.error = '';
    this.success = false;

    if (this.form.invalid) return;
    const newPassword = this.form.value.newPassword;

    try {
      this.isSaving = true;
      await this.authService.updateUserPassword(newPassword);
      this.success = true;
      this.form.reset();
      this.isSaving = false;
    } catch (err: any) {
      this.error = err.message || 'Erro ao atualizar a senha.';
    } finally {
      this.isSaving = false;
    }
  }
}
