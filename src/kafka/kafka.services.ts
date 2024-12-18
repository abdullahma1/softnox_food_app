import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  private handlers = new Map<string, (value: any) => void>();

  constructor(@Inject('KAFKA_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    // List of topics to subscribe to
    const topics = ['order_created', 'order_updated', 'order-status-update'];
    
    // Subscribe to each topic
    topics.forEach((topic) => {
      this.client.subscribeToResponseOf(topic);
    });
    
    // Establish the connection to the Kafka broker
    await this.client.connect();
    console.log('Kafka client connected and subscribed to topics:', topics);
  }

  // Emit messages to Kafka topics
  async emit(topic: string, message: any) {
    try {
      console.log("emit========>")
      return this.client.emit(topic, JSON.stringify(message));
    } catch (error) {
      console.error('Error emitting message:', error);
      throw error;
    }
  }
  // Consume messages from a Kafka topic
  async consume(topic: string, groupId: string, callback: (message: any) => void) {
    // Subscribe to the topic and start consuming messages
    await this.client.subscribeToResponseOf(topic);
    this.handlers.set(topic, callback);
    console.log(`Consuming messages from topic: ${topic} with group: ${groupId}`);
    await this.client.connect();
  }

  // Subscribe to a Kafka topic with a callback handler
  async subscribe(topic: string, callback: (value: any) => void) {
    this.handlers.set(topic, callback);
    await this.client.subscribeToResponseOf(topic);
    console.log(`Subscribed to topic: ${topic}`);
  }

  // Handle incoming messages from Kafka topics
  async handleMessage(topic: string, message: any) {
    const handler = this.handlers.get(topic);
    if (handler) {
      try {
        const parsedMessage = JSON.parse(message.value);
        handler(parsedMessage);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    } else {
      console.warn(`No handler for topic: ${topic}`);
    }
  }
}


