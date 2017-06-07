var ChatBot = require('iii-for-vk');

var bot = new ChatBot({
    appID: "id",         // The application ID
    appSecret: "secret", // Secret application key
    uuid: "uuid",        // Bot 's ID
    token: "token"       // The authorization key for the user profile
});

bot.init(function(cuid) {
    // We view all events with messages
    bot.on('messages', function(raw) {
        // We receive the message by ID
        bot.getMessageByID(raw[1], function(message) {
            if (!message.out) {
                answer({
                    cuid: cuid,
                    message: message
                });
            }
        });
    });
});

/**
 * We respond to the user with a delay.
 * @param {Object} options - Object with parameters.
 * @param {Object} options.cuid - Session ID
 * @param {Object} options.message - Incoming message.
 */
function answer(options) {
    setTimeout(function() {
        var text = options.message.body || ':-|';
        // Sending a message to the bot
        bot.sendMessageToBot({
            cuid: options.cuid,
            text: text
        }, function(message) {
            // Sending a response to the user
            bot.sendMessageToVK({
                user_id: options.message.user_id,
                message: message.text.tts
            });
        });
    }, random(1000, 5000));
}

/**
 * Returns a random number in the specified range.
 * @param {Number} min - Minimum value.
 * @param {Number} max - Maximum value.
 * @returns {Number} - Random number.
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}