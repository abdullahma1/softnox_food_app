import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 3, scale: 2 })
  popularityScore: number;

  @Column()
  isAvailable: boolean;

  @ManyToOne(() => Restaurant, restaurant => restaurant.dishes)
  restaurant: Restaurant;
}

