import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}

