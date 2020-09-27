import { Component } from '@angular/core';
import { FormGroup, FormControl, FormControlName, FormBuilder, Validators, FormArray } from '@angular/forms';
import { forbiddenNameValidator } from './shared/username.validator';
import { passwordValidator } from './shared/password.validator';
import { Cartoon } from './cartoon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

cartoonsData:Cartoon[] =  [
    { id: 0, name: 'Tom and Jerry', selected: false },
    { id: 1, name: 'Rick and Morty',selected: false },
    { id: 2, name: 'Ben 10', selected: false},
    { id: 3, name: 'Batman: The Animated Series', selected: false},
  
  ];

  City: any = ['Ahmedabad', 'Anand', 'Surat', 'Mumbai'];

  registrationForm: FormGroup;

  changeCity(e) {
    // console.log(e.value)
    this.cityName.setValue(e.target.value, {
      onlySelf: true
    })
  }

  get cityName() {
    return this.registrationForm.get('cityName');
  }

  get username(){
    return this.registrationForm.get('username');
  }

  get email(){
    return this.registrationForm.get('email');
  }

  get alternateHobbies(){
    return this.registrationForm.get('alternateHobbies') as FormArray;
  }

  addAlternateHobbies(arr?: any[]){
    if (arr) this.alternateHobbies.push(this.fb.control(arr));
    else this.alternateHobbies.push(this.fb.control(''));
  }

  deleteAlternateHobbies(i){
    this.alternateHobbies.removeAt(i);
  }

  constructor(private fb: FormBuilder){}

  onChange(name: string, isChecked: boolean) {
    const cartoons = (this.registrationForm.controls.name as FormArray);

    if (isChecked) {
      cartoons.push(new FormControl(name));
    } else {
      const index = cartoons.controls.findIndex(x => x.value === name);
      cartoons.removeAt(index);
    }
  }

  addCartoon(arr?: any[]) {
    this.cartoonsData.forEach(data => {
      if (arr.includes(data.name)) {
        data.selected = true;
       // console.log(data.selected)
       this.onChange(data.name, data.selected)
      }
    })
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required,Validators.minLength(3), forbiddenNameValidator(/password/)]],
      email: [''],
      subscribe: [false],
      password: [''],
      confirmPassword: [''],
      gender: ['male', [Validators.required]],
      hobbies:[''],
      address: this.fb.group({
        cityName: ['', [Validators.required]],
        state: [''],
        postalCode: ['']
      }),
      alternateHobbies: this.fb.array([]),
      name: this.fb.array([]),
    },{validator: passwordValidator});
    
    this.registrationForm.get('subscribe').valueChanges
        .subscribe(checkedValue => {
          const email = this.registrationForm.get('email');
          if(checkedValue){
            email.setValidators(Validators.required);
          }else{
            email.clearValidators();
          }
          email.updateValueAndValidity();
        });

        this.getData();
  }

 localData:any = [];

 getData(){
   this.localData = JSON.parse(localStorage.getItem('registrationForm'));
 }
  
 
  loadApiData(){
    this.registrationForm.patchValue({
      username:'Abc',
      email:'abc@gmail.com',
      subscribe:true,
      password:'123',
      confirmPassword:'123',
      hobbies:'Cricket',
      address:{
        city:'abc',
        state:'abc',
        postalCode:'123456'
      },
      // alternateHobbies:['Hocky']
    })
  }

  editData(){
    if(localStorage.getItem('registrationForm') === null){
      alert("no data found");
    }else{
      this.registrationForm.patchValue(this.localData)
      this.localData.alternateHobbies.forEach(data => this.addAlternateHobbies(data))
      this.localData.name.forEach(data => this.addCartoon(data))
    }
  }

  onSubmit(){
    console.log(this.registrationForm.value);
    localStorage.setItem('registrationForm', JSON.stringify(this.registrationForm.value));
  }
}
