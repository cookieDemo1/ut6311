const fs = require('fs')
const path = require('path')

let html = path.resolve(__dirname, './build/index.html')
let htmlData = fs.readFileSync(html, 'utf-8');

let css = path.resolve(__dirname, './build/bundle.css')
let cssData = fs.readFileSync(css, 'utf-8');
htmlData = htmlData.replace("<link href=\"/bundle.css\" rel=\"stylesheet\">", `<style>${cssData}</style>`)


let polyfills = path.resolve(__dirname, './build/polyfills.js')
let polyfillsData = fs.readFileSync(polyfills, 'utf-8');
htmlData = htmlData.replace("<script src=\"/polyfills.js\"></script>", `<script>${polyfillsData}</script>`)

let bundle = path.resolve(__dirname, './build/bundle.js')
let bundleData = fs.readFileSync(bundle, 'utf-8');
htmlData = htmlData.replace("<script src=\"/bundle.js\"></script>", `<script>${bundleData}</script>`)


htmlData = htmlData.replace(/\\/g, "\\\\").replace(/[\s\S]{0,300}/g, function(text) {
    return `${text}\\\r`
}).replace(/\"/g, "\\\"")
fs.writeFileSync(html, htmlData);