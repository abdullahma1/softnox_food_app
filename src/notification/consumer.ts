import { Logger, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopic,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import { sleep } from '../utils/sleep';

export class ConsumerService implements OnApplicationShutdown  {
  private readonly kafka = new Kafka({
    brokers:['localhost:9092']}
  );
  private readonly consumers: Consumer[] = [];
  private readonly logger: Logger;

  async consume(topic: ConsumerSubscribeTopic, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    await this.consumers.push(consumer);
  }
  
  

 

  async onApplicationShutdown() {
    for(const consumer of this.consumers){
        await consumer.disconnect();
    }
    
  }
}