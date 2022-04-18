require('dotenv').config()

const { Telegraf } = require('telegraf')
const { generateCertainImage, deleteImage } = require('./imgGen');
const { facts } = require('./facts')

const bot = new Telegraf(`${process.env.BOT_TOKEN}`)

//method for invoking start command

bot.command('start', ctx => {
    console.log(ctx.from);
    bot.telegram.sendMessage(
        ctx.chat.id,
        `Hello, @${ctx.chat.username}! I'm Robert's Telegram Bot!
Here're commands available with me!
    - /animals
    - /location
    - /phone`,
        {}
    );
})


// ==============================================================================
// ================== Constructors ======================
// ==============================================================================

//constructor for providing phone number to the bot

const requestPhoneKeyboard = {
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [
            [{
                text: "My phone number",
                request_contact: true,
                one_time_keyboard: true
            }],
            ["Cancel"]
        ]
    }
};
//constructor for proving location to the bot

const requestLocationKeyboard = {
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [
            [{
                text: "My location",
                request_location: true,
                one_time_keyboard: true
            }],
            ["Cancel"]
        ]
    }

}

// ==============================================================================
// ================== Hears ======================
// ==============================================================================

//method for requesting user's phone number

bot.hears('/phone', (ctx, next) => {
    bot.telegram.sendMessage(
        ctx.chat.id, 
        'Can we get access to your phone number?', 
        requestPhoneKeyboard
    );

})

//method for requesting user's location

bot.hears("/location", (ctx) => {
    bot.telegram.sendMessage(
        ctx.chat.id, 
        'Can we access your location?', 
        requestLocationKeyboard
    );
})

//method for requesting animal's image

bot.hears('/animals', ctx => {
    
    ctx.deleteMessage();
    let animalMessage = `Great, here're pictures of animals you'd love!`

    const animal_buttons = facts.map(({desp, animal}, index) => ([{
        text: animal,
        callback_data: `animal_${animal.toLowerCase()}`
    }]))
    
    bot.telegram.sendMessage(ctx.chat.id, animalMessage, {
        reply_markup: {
            inline_keyboard: animal_buttons,
        }
    })
});


// ==============================================================================
// ================== Actions ======================
// ==============================================================================

// methods handling animal inline keyboard actions

bot.action('animal_panda', async (ctx) => {
    
    ctx.deleteMessage()

    const image = await generateCertainImage('panda')

    const data = (facts.filter(({desp, animal}) => (
        animal.toLowerCase() === 'panda'
    )))[0]

    bot.telegram.sendPhoto(
        ctx.chat.id,
        image,
        {
            caption: data.description
        }
    )

})

bot.action('animal_lion', async (ctx) => {
    
    ctx.deleteMessage()
    const image = await generateCertainImage('lion')

    const data = (facts.filter(({desp, animal}) => (
        animal.toLowerCase() === 'lion'
    )))[0]

    bot.telegram.sendPhoto(
        ctx.chat.id,
        image,
        {
            caption: data.description
        }
    )

})

bot.action('animal_elephant', async (ctx) => {
    
    ctx.deleteMessage()
    const image = await generateCertainImage('elephant')

    const data = (facts.filter(({desp, animal}) => (
        animal.toLowerCase() === 'elephant'
    )))[0]

    bot.telegram.sendPhoto(
        ctx.chat.id,
        image,
        {
            caption: data.description
        }
    )

})

bot.action('animal_dolphin', async (ctx) => {
    
    ctx.deleteMessage()
    const image = await generateCertainImage('dolphin')

    const data = (facts.filter(({desp, animal}) => (
        animal.toLowerCase() === 'dolphin'
    )))[0]

    bot.telegram.sendPhoto(
        ctx.chat.id,
        image,
        {
            caption: data.description
        }
    )

})

bot.launch()