import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { Delivery } from '../delivery/delivery.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalCost: number;

  @Column()
  orderTime: Date;

  @Column()
  status: string;

  @ManyToOne(() => Restaurant, restaurant => restaurant.orders)
  restaurant: Restaurant;

  @OneToOne(() => Delivery, delivery => delivery.order)
  delivery: Delivery;
}

