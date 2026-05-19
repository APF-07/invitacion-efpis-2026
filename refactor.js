const fs = require('fs');
const html = fs.readFileSync('mira.html', 'utf8');

const styleRegex = /<style>([\s\S]*?)<\/style>/;
const scriptRegex = /<script>([\s\S]*?)<\/script>/;

const styleMatch = html.match(styleRegex);
const scriptMatch = html.match(scriptRegex);

let newHtml = html;
if (styleMatch) {
    fs.writeFileSync('css/styles.css', styleMatch[1].trim());
    newHtml = newHtml.replace(styleRegex, '<link rel="stylesheet" href="css/styles.css">');
}

if (scriptMatch) {
    fs.writeFileSync('js/script.js', scriptMatch[1].trim());
    newHtml = newHtml.replace(scriptRegex, '<script src="js/script.js"></script>');
}

fs.writeFileSync('index.html', newHtml);
console.log('Archivos separados exitosamente');
