import { IsString, IsNumber, Min, Max, IsBoolean } from 'class-validator';

export class CreateDishDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  popularityScore: number;

  @IsBoolean()
  isAvailable: boolean;

  @IsNumber()
  restaurantId: number;
}

