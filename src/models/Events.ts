/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable quotes */
import { AxiosResponse } from "axios";
import makeId from "cuid";
// Subscribe event data
export type SubscribeEvent = {
    topic: string;

    data: {
        message: string;
    };
};

export class Publisher {
    /**
     * {
     *  topic : [subscribers]
     * }
     */
    private subscribers: any
    constructor(){
        this.subscribers = {};
    }

    /**
     * addSubscriber
     */
    public addSubscriber(topic: string, subscriber: Subscriber): void {
        if (!this.subscribers[topic]) {
            this.subscribers[topic] = [];
        }
        subscriber.subscribe(topic);
        this.subscribers[topic].push(subscriber);
    }

    /**
     * getSubscriberById(id: string): Subscriber
     */
    public getSubscriberById(id: string): Subscriber {
        const subscribers: Subscriber[] = this.getAllSubscribers();
        for (let i = 0; i < subscribers.length; i++) {
            const subscriber = subscribers[i];
            if (subscriber.getId() === id) {
                return subscriber;
            }
        }
        return null;
    }
    /**
     * getSubscribe: Subscriber[]rs
     */
    public getAllSubscribers(): Subscriber[] {
        let subscribers: Subscriber[] = [];
        const values: Subscriber[][] = Object.values(this.subscribers);
        values.forEach((subscribers_: Subscriber[]) => {
           subscribers = [ ...subscribers, ...subscribers_ ]; 
        });
        return subscribers;
    }
    /**
     * getSubscribe: Subscriber[]rs
     */
    public findSubscribersByTopic(topic: string): Subscriber[] {
        return this.subscribers[topic] || [];
    }

    /**
     * findSubscriber: boolean
     */
    public findSubscriber(topic: string, url: string): boolean {
        const subscribers: Subscriber[] = this.subscribers[topic] || [];
        for (let i = 0; i < subscribers.length; i++) {
            const subscriber = subscribers[i];
            if (subscriber.getUrl() === url) {
                return true;
            }
        }
        return false;
    }
}

export class Subscriber {

    private id: string
    private topics: string[]
    private eventStore: SubscribeEvent[]
    private url: string
    private pubsub :(url: string, data: SubscribeEvent) => Promise<AxiosResponse>
    constructor(url: string, pubsub: (url: string, data: SubscribeEvent) => Promise<AxiosResponse>){
        this.id = makeId();
        this.topics = [];
        this.eventStore = [];
        this.url = url;
        this.pubsub = pubsub;
    }

    /**
     * getId: string
     */
    public getId(): string {
        return this.id;
    }
    /**
     * getEven: SubscribeEvent[]
     */
    public getEvents(): SubscribeEvent[] {
        return this.eventStore;
    }
    /**
     * subscribe
     */
    public subscribe(topic: string): void {
        this.topics.push(topic);
    }

    /**
     * getTopic; string
     */
    public getTopic(): string[] {
        return this.topics;
    }

    /**
     * addEvent
     */
    public addEvent(event: SubscribeEvent):void {
        this.eventStore.push(event);
    }
    /**
     * getUrl: string
     */
    public getUrl(): string {
        return this.url;
    }

    /**
     * publish
     */
    public publish(message: SubscribeEvent):void {
        this.pubsub(this.url + `?id=${this.id}`, message);
    }
}