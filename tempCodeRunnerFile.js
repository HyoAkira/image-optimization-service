use("local");
const { createCanvas, loadImage } = require('canvas');
const Sharp = require('sharp');
const width = 300;
const height = 400;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

try {

    const users =  db.getCollection("users").find({}).toArray();

    for (const user of users) {

        loadImage("test.jpg").then((image) => {
            ctx.drawImage(image, 0, 0, width, height);

            // Metin stilini ayarla ve çiz
            ctx.font = "16px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(user.username, 15, 50);

            // Canvas'ı birleştir ve kaydet
            const buffer = canvas.toBuffer();
            Sharp(buffer)
                .jpeg({
                    quality: 90,
                })
                .toFile("output.jpg")
                .then(() => {
                    console.log("Resim üzerine yazı eklendi!");
                })
                .catch((err) => {
                    console.error("Hata:", err);
                });
        });

    }


} catch (error) {
   console.log(error) 
}