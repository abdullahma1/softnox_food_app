import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Message, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
    private readonly kafka = new Kafka({
        brokers:['localhost:9092'],
    })
    
    private readonly producer = this.kafka.producer();

    async onModuleInit(){
        await this.producer.connect();
    }


  async produce(record:ProducerRecord) {
    await this.producer.send(record)
  }

 
  async onApplicationShutdown() {
    await this.producer.disconnect();
    
  }
}