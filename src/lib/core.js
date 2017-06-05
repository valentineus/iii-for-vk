/**
 * @project iii-for-vk
 * @author Valentin Popov <info@valentineus.link>
 * @license See LICENSE.md file included in this distribution.
 */
import urlParseLax from 'url-parse-lax';
import queryString from 'querystring';
import iiiClient from 'iii-client';
import EventEmitter from 'events';
import inherits from 'inherits';
import https from 'https';
import SDK from 'vksdk';

inherits(Bot, EventEmitter);
module.exports = Bot;

/**
 * Class representing a Bot.
 * @class
 */
function Bot(opts) {
    opts = opts || {};
    var self = this;

    self.uuid = opts.uuid;
    self.token = opts.token;
    self.appID = opts.appID;
    self.appSecret = opts.appSecret;
}

/**
 * Initial initialization of all systems and services.
 * @param {requestCallback} callback - The callback that handles the response.
 */
Bot.prototype.init = function(callback) {
    var self = this;

    // Initialize the connection to the social network
    self._vk = new SDK({
        appId: self.appID,
        appSecret: self.appSecret,
        https: true,
        secure: true
    });

    // Setting the user's token
    self._vk.setToken(self.token);

    // Starting services
    self._eventLoop();
    // Connecting filters
    self._filterMessages();

    // Connecting to the bot server
    iiiClient.connect(self.uuid, (raw) => callback(raw.cuid));
};

/**
 * Receive a message by its ID.
 * @param {Number} id - The message ID.
 * @param {requestCallback} callback - The callback that handles the response.
 */
Bot.prototype.getMessageByID = function(id, callback) {
    id = id || false;
    var self = this;

    self._vk.request('messages.getById', {
        message_ids: id,
        preview_length: 0
    }, (raw) => {
        if (raw.error) throw new Error(raw.error.error_msg);
        callback(raw.response.items.shift());
    });
};

/**
 * Simplifies the sending of a message to the user.
 * The social network API is used.
 * More information: https://vk.com/dev/messages.send
 * @param {Object} options - Object with parameters.
 * @param {Object} options.user_id - User ID.
 * @param {Object} options.message - Message text.
 * @param {requestCallback} callback - The callback that handles the response.
 */
Bot.prototype.sendMessageToVK = function(options) {
    options = options || {};
    var self = this;
    self._vk.request('messages.send', options, () => {});
};

/**
 * Simplifies sending a message to the bot.
 * @param {Object} options - Object with parameters.
 * @param {Object} options.cuid - Session identifier.
 * @param {Object} options.text - Message text.
 * @param {requestCallback} callback - The callback that handles the response.
 */
Bot.prototype.sendMessageToBot = function(options, callback) {
    options = options || {};
    iiiClient.send(options, (answer) => callback(answer));
};

/**
 * The event startup service.
 */
Bot.prototype._eventLoop = function() {
    var self = this;

    self._getEvents();
    self.on('events', (data) => {
        self._getEvents(data.ts);
    });
};

/**
 * Filter events for incoming messages.
 * @fires: Bot#messages
 */
Bot.prototype._filterMessages = function() {
    var self = this;

    self.on('events', function(data) {
        data.updates.filter(function(item) {
            if (item[0] == 4) self.emit('messages', item);
        });
    });
};

/**
 * Obtaining the Long Poll server address.
 * @param {requestCallback} callback - The callback that handles the response.
 */
Bot.prototype._getLongPollServer = function(callback) {
    var self = this;

    self._vk.request('messages.getLongPollServer', {
        need_pts: false
    }, (raw) => {
        if (raw.error) throw new Error(raw.error.error_msg);
        callback(raw.response);
    });
};

/**
 * Waiting and returning the event.
 * @fires: Bot#events
 * @param {String=} [ts] - The ID of the last event.
 */
Bot.prototype._getEvents = function(ts) {
    var self = this;

    // Server address request
    self._getLongPollServer(function(raw) {
        ts = ts || raw.ts;

        // Analysis of the connection address
        var url = urlParseLax(raw.server);

        // Details: https://vk.com/dev/using_longpoll
        var options = queryString.stringify({
            act: 'a_check',
            key: raw.key,
            ts: ts,
            wait: 25,
            mode: 2,
            version: 1
        });

        // Configuring the connection
        var query = {
            hostname: url.hostname,
            path: url.pathname + '?' + options
        };

        https.get(query, function(response) {
            var answer = {};
            response.setEncoding('utf8');
            response.on('data', (data) => answer = data);
            response.on('end', () => {
                answer = JSON.parse(answer);
                self.emit('events', answer);
            });
        }).on('error', (error) => Error(error));
    });
};
