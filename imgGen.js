
require('dotenv').config()

const { createClient } = require('pexels')
const Jimp = require('jimp')
const fs = require('fs')
const { facts } = require('./facts')
const { calculateTxid } = require('metaversejs/src/transaction')

const pexelsClient = createClient(process.env.PEXELS_API_KEY)

const randomRange = (from, end) => {    // [from, end)
    return Math.floor((Math.random() * (end-from) + from))
}

const randomChoose = ( arr ) => {
    const rand = randomRange(0, arr.length);
    return arr[rand];
}

const fetchImage = async (keyword) => {
    const randomness = 10;
    let img;

    try {

        await pexelsClient.photos.search({
            query: keyword,
            per_page: randomness,
        }).then(res => {
            const images = res.photos;
            img = randomChoose(images);
        })
    } catch (error) {
        console.log('error downloading image...', error);
        fetchImage(keyword)
    }

    return img;
}

const editImage = async (image, fact) => {
    try {
        let imgURL = image.src.medium
        return imgURL;

        let animalImage = await Jimp.read(imgURL).catch(error => console.log('error ', error))
        let animalImageWidth = animalImage.bitmap.width
        let animalImageHeight = animalImage.bitmap.height
        let imgDarkener = await new Jimp(animalImageWidth, animalImageHeight, '#000000')
        imgDarkener = await imgDarkener.opacity(0.5)
        animalImage = await animalImage.composite(imgDarkener, 0, 0);

        let posX = animalImageWidth / 15
        let posY = animalImageHeight / 15
        let maxWidth = animalImageWidth - (posX * 2)
        let maxHeight = animalImageHeight - posY

        let font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
        await animalImage.print(font, posX, posY, {
            text: fact,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, maxWidth, maxHeight)

        return animalImage;

    } catch (error) {
        console.log("error editing image", error)
    }

    return null;
}


const generateCertainImage = async (animalToGenerate) => {

    const data = (facts.filter(({desp, animal}) => (
        animal.toLowerCase() === animalToGenerate.toLowerCase()
    )))[0]

    if ( !data )    {
        console.log(`Cannot find data for ${animalToGenerate}`);
        return;
    }

    const photo = await fetchImage(data.animal)
    return (await editImage(photo, data.description))
}

const generateImage = async () => {

    const chosenAnimal = randomChoose(facts);

    return(await generateCertainImage(chosenAnimal.animal));

}

module.exports = { generateImage, generateCertainImage }