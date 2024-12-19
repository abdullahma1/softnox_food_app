import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @CreateDateColumn()
  orderTime: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ 
    type: 'varchar',
    default: 'pending'
  })
  status: string;

  @Column({ nullable: true })
  estimatedDeliveryTime: Date;

  @ManyToOne(() => Restaurant, restaurant => restaurant.orders)
  restaurant: Restaurant;

  @OneToOne(() => Delivery, delivery => delivery.order)
  delivery: Delivery;
}

