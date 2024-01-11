import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormsModule,ReactiveFormsModule} from '@angular/forms';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  regForm: FormGroup;

  title = 'buzzboarTask';
  submitted: boolean;
  canAddForm: boolean;
  usersArray: any[];
  editedUser: any = {};

  constructor(private fb: FormBuilder) {
    this.submitted = false;
    this.canAddForm = true;
    this.usersArray = [];
    this.editedUser = {};
  
  }

  ngOnInit() {
    this.regForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/[0-9]{10}/g)]],
      company: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  get formValues() {
    return this.regForm.controls;
  }

  submitForm() {
    this.submitted = true;
    console.log(this.regForm);
    console.log(this.formValues);
    Object.keys(this.regForm.controls).forEach(field => {
      const control = this.regForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    if (this.regForm.invalid) {
      return;
    }
    if (this.canAddForm) {
      let newCreatedUser = this.regForm.value;
      console.log(this.regForm)
      let tempDob = this.regForm.value.dob.split('-');
      console.log(tempDob)

      let newGenratedId = this.generateIdFromDateOfBirth(tempDob);
      console.log(newGenratedId);
      newCreatedUser.id = newGenratedId;
      this.usersArray.push(newCreatedUser);
      console.log(newCreatedUser)
    }
    else if (this.editedUser) {
      let userIndex = this.usersArray.findIndex(item => item.id === this.editedUser.id);
      if (userIndex != -1) {
        this.usersArray[userIndex] = this.regForm.value;
      }
    }
    this.canAddForm = true;
    this.submitted = false;
    this.regForm.reset();
  }
  addUser() {
    this.canAddForm = true;
    this.editedUser = {};
    this.submitted = false;
    console.log(this.regForm)
    this.regForm.reset();
  }

  editRow(row, i) {
    this.canAddForm = false;
    console.log(row);
    this.editedUser = row;
    this.regForm.patchValue({
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      mobile: row.mobile,
      company: row.company,
      gender: row.gender,
      dob: row.dob,
      password: row.password,
      confirmPassword: row.confirmPassword
    });
  }

  generateIdFromDateOfBirth(dob: string): string {
    const dobDate = new Date(dob);
    const year = dobDate.getFullYear().toString().slice(-2);
    const month = ('0' + (dobDate.getMonth() + 1)).slice(-2); 
    const day = ('0' + dobDate.getDate()).slice(-2);
  
    return `DOB_${day}${month}${year}`;
  }
  deleteRow(row) {
    console.log(row.id)
     this.usersArray = this.usersArray.filter(ele => ele.id != row.id);
     console.log(this.usersArray)
    this.canAddForm = true;
     this.regForm.reset();
  }
  cancelForm() {
    this.canAddForm = true;
    this.regForm.reset();
    this.editedUser = {};
  }


}
