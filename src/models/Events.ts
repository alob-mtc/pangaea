// Plublish Event data
export type PublishEvent = {
    message: string;
};

// Subscribe event data
export type SubscribeEvent = {
    topic: string;

    data: {
        message: string;
    };
};

export class Publisher {
    constructor(){}
}

export class Subscriber {
    constructor(){}

}