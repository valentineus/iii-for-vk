# iii-for-vk
[![npm](https://img.shields.io/npm/v/iii-for-vk.svg)](https://www.npmjs.com/package/iii-for-vk)
[![dependencies Status](https://david-dm.org/valentineus/iii-for-vk/status.svg)](https://david-dm.org/valentineus/iii-for-vk)
[![devDependencies Status](https://david-dm.org/valentineus/iii-for-vk/dev-status.svg)](https://david-dm.org/valentineus/iii-for-vk?type=dev)

## Description
This package contains a minimalistic and simple API for the rapid deployment of the bot under the social network VK.
Created to demonstrate the possibilities of using the `iii-client` package.

The functionality of the existing API is easily extended to the needs of the developer.

Want to own a bot under the social network? Take my package and expand it, as you wish.

## Installation and usage example
Installation is performed by the command:
```bash
npm install --save iii-for-vk
```

A simple example that implements an answering machine is at the root of the repository.
This is the file `example.js`.
In the NPM package it is not included to reduce the volume:
```bash
$ npm init
$ npm install --save iii-for-vk
$ curl -L -o index.js https://raw.githubusercontent.com/valentineus/iii-for-vk/master/example.js
// Edit the file index.js
$ node ./index.js
```

## Expanding functionality
### Events
There is an event channel called `events`.
All incoming account events pass through it.
Event details: https://vk.com/dev/using_longpoll

An example of a filter for certain events can be seen in the example of the `_filterMessages` function.

### Social Network API
After declaring the main class and executing the `init` function, you can use the inner class` _vk` to work with the social network API.

Work Details: [nodejs-vksdk](https://github.com/57uff3r/nodejs-vksdk)

Example:
```javascript
var bot = new ChatBot({
    // Variables
});

// Request 'users.get' method
bot._vk.request('users.get', {'user_id' : 1}, function(_o) {
    console.log(_o);
});
```

## API

### new Bot()
Class representing a Bot.

### bot.init(callback)
Initial initialization of all systems and services.

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>requestCallback</code> | The callback that handles the response. |

### bot.getMessageByID(id, callback)
Receive a message by its ID.

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | The message ID. |
| callback | <code>requestCallback</code> | The callback that handles the response. |

### bot.sendMessageToVK(options, callback)
Simplifies the sending of a message to the user.
The social network API is used.
More information: https://vk.com/dev/messages.send

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Object with parameters. |
| options.user_id | <code>Object</code> | User ID. |
| options.message | <code>Object</code> | Message text. |
| callback | <code>requestCallback</code> | The callback that handles the response. |

### bot.sendMessageToBot(options, callback)
Simplifies sending a message to the bot.

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Object with parameters. |
| options.cuid | <code>Object</code> | Session identifier. |
| options.text | <code>Object</code> | Message text. |
| callback | <code>requestCallback</code> | The callback that handles the response. |

### bot._eventLoop()
The event startup service.

### bot._filterMessages()
Filter events for incoming messages.

*Fires:**: Bot#messages  

### bot._getLongPollServer(callback)
Obtaining the Long Poll server address.

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>requestCallback</code> | The callback that handles the response. |

### bot._getEvents([ts])
Waiting and returning the event.

*Fires:**: Bot#events  

| Param | Type | Description |
| --- | --- | --- |
| [ts] | <code>String</code> | The ID of the last event. |

## License
[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/eslint/eslint)

[MIT](LICENSE.md).
Copyright (c) [Valentin Popov](https://valentineus.link/).