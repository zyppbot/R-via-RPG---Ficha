# Rúvia RPG • Fichas

Gerenciador de fichas de personagem e nave para o sistema Rúvia RPG. Fichas e pastas ficam salvas localmente no navegador. Cada suplemento usa tipografia temática incluída no site para manter a aparência consistente entre dispositivos. O compartilhamento simultâneo por link está em desenvolvimento.

## Executar localmente

Requer Node.js.

```sh
npm install
npm run dev
```

## Publicar no GitHub Pages

O workflow [Deploy to GitHub Pages](.github/workflows/deploy.yml) publica o site após alterações na branch `main`. Antes do primeiro deploy:

1. Em **Settings → Pages**, escolha **GitHub Actions** como origem de publicação.
2. Integre as alterações à branch `main`. O workflow executa a checagem de tipos e a compilação, e publica o site se ambas passarem.

Como o repositório usa GitHub Pages de projeto, o endereço publicado fica sob `https://zyppbot.github.io/Ruvia-RPG-Ficha/`.

## Verificações

```sh
npm run lint
npm run build
```
