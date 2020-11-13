/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SubscribeEvent, Publisher, Subscriber} from "../models/Events";
import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

const MyPublisher = new Publisher();

export const root = (_req: Request, res: Response)=> {
    res.status(200).json({ message: "/api" });
};
/**
 * get event.
 * @route GET /login
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
    res.status(200).json({ message: "", events, subscribers: subscribers.map((subscriber: Subscriber )=> ({
        topic: subscriber.getTopic(),
        url: subscriber.getUrl()
    }))});
};

/**
 * added event .
 * @route GET /login
 */
export const addEvent = (req: Request, res: Response) => {
    const data: SubscribeEvent = req.body;
    const subscribers: Subscriber[] = MyPublisher.findSubscribersByTopic(data.topic);
    subscribers.forEach((subscriber: Subscriber) => subscriber.addEvent(data));
    res.status(200).json({ message: "Event has beeen Consumed by subscriber" });
};

/**
 * Sign in using email and password.
 * @route POST /login
 */
export const subscribe = (req: Request, res: Response) => {
    const url = req.body.url;
    const topic = req.params.topic;
    const found: boolean = MyPublisher.findSubscriber(topic, url);
    if (found) {
        return res.status(200).json({ message: "The subcriber has already been subscribed" });
    }
    const newSubscriber = new Subscriber(url, pubsub);
    MyPublisher.addSubscriber(topic, newSubscriber);
    res.status(200).json({ message: "Successfully Subscribed" });
};

/**
 * Update profile information.
 * @route POST /account/profile
 */
export const publish = async (req: Request, res: Response) => {
    const topic: string = req.params.topic;
    const message: string = req.body.message;
    const data: SubscribeEvent = { topic, data: { message} };
    const subscribers: Subscriber[] = MyPublisher.findSubscribersByTopic(topic);
    if (subscribers.length === 0) {
        return res.status(400).json({  message: "There are no subscibers registered to this topic ["+ topic +"]"});
    }
    subscribers.forEach((subscriber: Subscriber) => subscriber.publish(data));
    res.status(200).json({ message: `Event Published to ${subscribers.length}` });
};


async function pubsub(url: string, data: SubscribeEvent): Promise<AxiosResponse> {
    return axios.post(url, data);
}