import fs from 'fs'
import pkg from '../package.json' assert { type: "json" };

const componentsPath = 'scripts/materials/components'
const componentFiles = fs.readdirSync(componentsPath).map(file => ({
  source: `${componentsPath}/${file}`,
  destination: `../tiny-engine/materials/components/${file}`
}))

componentFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(file.source, 'utf8').toString())
  data.version = pkg.version
  data.npm.version = pkg.version
  data.npm.package = pkg.name
  data.npm.script = `/lib/${pkg.name}@${pkg.version}/dist/index.js`
  data.npm.css = `/lib/${pkg.name}@${pkg.version}/dist/style.css`
  fs.writeFileSync(file.source, JSON.stringify(data, null, 2))
})

const files = [
  {
    source: 'dist',
    destination: `../tiny-engine-webservice/app/public/lib/${pkg.name}@${pkg.version}/dist`
  },
  ...componentFiles
]

files.forEach(file => {
  try {
    fs.rmSync(file.destination, { recursive: true })
  } catch (e) {
    console.log('No such directory: ' + file.destination + ', skip it.')
  }

  fs.cpSync(file.source, file.destination, { recursive: true })
})

console.log('Deployed successfully!')
