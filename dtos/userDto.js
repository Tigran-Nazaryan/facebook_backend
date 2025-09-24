export class UserDto {
  email;
  id;
  firstName;
  lastName;
  birthday;
  gender;
  isVerified;

  constructor(model) {
    this.email = model.email;
    this.id = model.id;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.birthday = model.birthday;
    this.gender = model.gender;
    this.isVerified  = model.isVerified;
  }
}
