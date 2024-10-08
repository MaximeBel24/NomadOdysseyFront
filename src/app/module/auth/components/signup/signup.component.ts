import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../state/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  @Input() changeTemplate : any;

  constructor(private formBuilder : FormBuilder, private store : Store, private authService : AuthService){}

  registerForm : FormGroup = this.formBuilder.group({
    firstName:["",[Validators.required]],
    lastName:["",[Validators.required]],
    email: ["",[Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]]
  })

  submitForm(): void{
    if(this.registerForm.valid){
      console.log("register req data ", this.registerForm.value);
      this.authService.register(this.registerForm.value);
    }
  }


}
