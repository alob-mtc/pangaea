import { PublishEvent, SubscribeEvent, Publisher, Subscriber} from "../models/Events";
import { Request, Response } from "express";



export const root = (req: Request, res: Response)=> {
    res.status(200).json({ message: "/api" });
};
/**
 * get event.
 * @route GET /login
 */
export const getEvent = (req: Request, res: Response) => {
    
};

/**
 * added event .
 * @route GET /login
 */
export const addEvent = (req: Request, res: Response) => {
    
};

/**
 * Sign in using email and password.
 * @route POST /login
 */
export const subscribe = async (req: Request, res: Response) => {
    
};

/**
 * Update profile information.
 * @route POST /account/profile
 */
export const publish = async (req: Request, res: Response) => {
    
};