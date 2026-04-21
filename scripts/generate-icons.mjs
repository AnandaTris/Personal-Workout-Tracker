import sharp from 'sharp'

// Dark slate background (#0f172a) with a bold blue "W" (#3b82f6)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0f172a"/>
  <text
    x="256"
    y="375"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="310"
    font-weight="800"
    fill="#3b82f6"
    text-anchor="middle"
    dominant-baseline="auto"
  >W</text>
</svg>`

const buf = Buffer.from(svg)

await sharp(buf).resize(192, 192).png().toFile('public/icon-192.png')
await sharp(buf).resize(512, 512).png().toFile('public/icon-512.png')

console.log('Icons generated: public/icon-192.png, public/icon-512.png')
