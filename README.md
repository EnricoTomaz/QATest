# QATest
Neste projeto desenvolvi uma api e seus cenários de testes conforme especificado em
```
https://documenter.getpostman.com/view/14414241/TW77f3WE#439bc391-9197-48cf-8fa0-bd1d2490ebdc
```

#### Para rodar o projeto execute
instale as dependências
```
npm install
```

Para subir o mongodb execute:
```
docker-compose up
```

crie um arquivo chamado .env na raiz do projeto com as seguintes informações
```
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/QATest
```

Abra uma nova guia do terminal e execute o comando abaixo para subir a api
```
npm run start
```

Abra uma nova guia do terminal e execute o comando abaixo para rodar os testes
```
npm run test
```