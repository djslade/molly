import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one each of lowercase, uppercase, numbers and special characters',
    },
  )
  password: string;
}
