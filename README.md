# ytsm-project-romeo

## initial setup

- `docker-compose up -d`
- `npm i`

Docker üzerinden mongoDB replicaSet (transaction için gerekli) ayarları yapılmış olarak başlayacak. Port 27017

`npm run start|dev`
Server 3000 portu üzerinde çalışıyor.

- http://localhost:3000/users/Kristina26
- http://localhost:3000/users/Minerva_Monahan96

Dataset link: upload ettikten sonra ekleyeceğim.
MongoDB'de ytsm adıyla veritabanı otomatik açılacak.

Dataseti aktarmak için MongoDB Compass üzerinden `mongodb://localhost:27017` üzerinden bağlantı yapıldıktan sonra
ytsm veritabanında yeni collection oluşturduktan sonra "add data" butonuna basıp "import json file" seçilmeli ve dosya
yüklenmeli.
