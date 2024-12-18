import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assignedDriver: string;

  @Column()
  deliveryTime: Date;

  @Column()
  estimatedDuration: number;

  @OneToOne(() => Order, order => order.delivery)
  @JoinColumn()
  order: Order;
}

