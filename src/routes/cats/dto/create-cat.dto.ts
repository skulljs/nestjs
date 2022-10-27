import { IsString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly color: string;

  @IsString()
  readonly weight: string;

  @IsString()
  readonly eyes_color: string;
}
