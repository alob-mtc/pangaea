/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SubscribeEvent, Publisher, Subscriber} from "../models/Events";
import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

// create a new publisher
const MyPublisher = new Publisher();

export const root = (_req: Request, res: Response)=> {
    res.status(200).json({ message: "/api" });
};
/**
 * get all consumed evnent from the subscriber event store
 * @route GET /event
 */
export const getEvent = (_req: Request, res: Response) => {
    let events: SubscribeEvent[] = [];
    const subscribers: Subscriber[] = MyPublisher.getAllSubscribers();
    if (subscribers.length === 0) {
        return res.status(400).json({ 
            message: "There are no registered subscribers",
            events: null
         });
    }
    subscribers.forEach((subscriber: Subscriber) => {
        events = [...events, ...subscriber.getEvents()];
    });
    const responseData = { message: "", events, subscription: subscribers.map((subscriber: Subscriber )=> ({
        topic: subscriber.getTopic(),
        url: subscriber.getUrl()
    }))};
    console.log(responseData);
    res.status(200).json(responseData);
};

/**
 * consume event event => the subsciber consumer event handler 
 * this is responsible for consuming event from the publisher
 * @route POST /
 */
export const consumeEvent = (req: Request, res: Response) => {
    const data: SubscribeEvent = req.body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscriberId: any = req.query.id;
    const subscriber: Subscriber = MyPublisher.getSubscriberById(subscriberId);
    subscriber.addEvent(data);
    res.status(200).json({ message: "Event has beeen Consumed by subscriber Id["+ subscriberId +"]" });
};

/**
 * subsciber to topic
 * @route POST /subscribe/:topic
 */
export const subscribe = (req: Request, res: Response) => {
    const url = req.body.url;
    const topic = req.params.topic;
    if (!url) {
        return res.status(400).json({ message: "you must provide the url location of the subscriber" });
    }
    const found: boolean = MyPublisher.findSubscriber(topic, url);
    if (found) {
        return res.status(200).json({ message: "The subcriber has already been subscribed" });
    }
    const newSubscriber = new Subscriber(url, pubsub);
    MyPublisher.addSubscriber(topic, newSubscriber);
    res.status(200).json({ message: "Successfully Subscribed" });
};

/**
 * pulish event to the publisher
 * @route POST /publish/:topic
 */
export const publish = async (req: Request, res: Response) => {
    const topic: string = req.params.topic;
    const message: string = req.body.message;
    if (!message) {
        return res.send(400).json({ message: "event must contain a [message]" });
    }
    const data: SubscribeEvent = { topic, data: { message} };
    const subscribers: Subscriber[] = MyPublisher.findSubscribersByTopic(topic);
    if (subscribers.length === 0) {
        return res.status(400).json({  message: "There are no subscibers registered to this topic ["+ topic +"]"});
    }
    // broadcast event to all subscribers of the topic
    subscribers.forEach((subscriber: Subscriber) => subscriber.publish(data));
    res.status(200).json({ message: `Event Published to ${subscribers.length} subscriber` });
};


async function pubsub(url: string, data: SubscribeEvent): Promise<AxiosResponse> {
    return axios.post(url, data).then(res => res).catch(error => {
        // TODO: if failed to send request: implemnt a retry logic for the event propergation
        console.log(error);
        return error;
    });
}