import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "@/package.json";
import { Express } from "express";
import { join } from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: `3.0.0`,
    info: {
      title: "IMG BILECIK",
      version,
      description: `
swagger için: sunucu/docs\n
json file için: sunucu/docs.json\n\n
Her iki endpoint de ip koruması içeriyor. Veritabanımızda kayıtlı olmayan ipler sayfayı göremiyor!\n
Endpointler api ve users olmak üzere 2 kategoride sınıflandırıldı.\n
Yetkilendirilmiş istek: header içerisinde apikey değişkeni içeren ve isteği gönderen tarafın ip adresinin veritabanımızda kayıtlı olup apikey ile eşleştirilmiş olduğu istektir.\n
api kategorisindeki endpointleri kullanabilmek için yetklendirilmiş istek gönderilmelidir.\n\n
users/:uuid endpointine gelen istekler yetkilendirilmiş istek ise kullanıcı ayarlarında isPublic false olsa bile kullanıcı resmini render eder.\n
users/:uuid endpointine gelen istekler kullanıcının resmini doğrudan render eder.\n
Eğer kullanıcı ayarlarında isPublic property değeri false ve yetkilendirilmiş bir istek değilse blank profile image render olur.

      `,
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "apikey",
          description: "API key required for authentication",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: [join(__dirname, "../**/*.controller.ts")],
};

const openapiSpecification = swaggerJSDoc(options);

export default openapiSpecification;
