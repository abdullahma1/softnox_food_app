import { IsNumber, Min, IsDateString, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  @Min(0)
  totalCost: number;

  @IsDateString()
  orderTime: Date;

  @IsString()
  status: string;

  @IsNumber()
  restaurantId: number;
}

