# Pangaea BE Coding Challenge
For this challenge we'll be recreating a pub / sub system using HTTP requests. Feel free to use whatever langauges or frameworks you wish.

![PUB/SUB](https://pangaea-interviews.now.sh/_next/static/images/pubsub-diagram-15a833df7c2a0fd11cade0630fe8e8ba.png)

## Publisher Server Requirements
#### Setting up a subscription
> POST /subscribe/{TOPIC}
BODY { url: "http://localhost:8000/event"}

The above code would create a subscription for all events of {TOPIC} and forward data to http://localhost:8000/event

#### Publishing an event
> POST /publish/{TOPIC}
BODY { "message": "hello"}

The above code would publish on whatever is passed in the body (as JSON) to the supplied topic in the URL. This endpoint should trigger a forwarding of the data in the body to all of the currently subscribed URL's for that topic.

#### Testing it all out Publishing an event 
##### The content type must be set to => 'Content-Type: application/json' for it to work properly 
```sh
$ ./start-server.sh
$ curl -X POST -d '{ "url": "http://localhost:8000"}' -H 'Content-Type: application/json' http://localhost:8000/subscribe/topic1
$ curl -X POST -H "Content-Type: application/json" -d '{"message": "hello"}' -H 'Content-Type: application/json' http://localhost:8000/publish/topic1
$ curl http://localhost:8000/event
```

The above code would set up a subscription between topic1 and http://localhost:8000/event. When the event is published in line 3, it would send both the topic and body as JSON to http://localhost:8000

The /event endpoint is just used to print the data and verify everything is working.

