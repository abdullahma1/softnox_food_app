import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Dish } from '../dish/dish.entity';
import { Order } from '../orders/order.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column('decimal', { precision: 2, scale: 1 })
  rating: number;

  @OneToMany(() => Dish, dish => dish.restaurant)
  dishes: Dish[];

  @OneToMany(() => Order, order => order.restaurant)
  orders: Order[];
}

