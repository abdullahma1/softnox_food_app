import { IsString, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  assignedDriver: string;

  @IsDateString()
  deliveryTime: Date;

  @IsNumber()
  @Min(0)
  estimatedDuration: number;

  @IsNumber()
  orderId: number;
}

