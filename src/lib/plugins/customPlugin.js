const helloPlugin = () => {
  console.log('hello from custom plugin!')
}

const customDirective = () => {
  helloPlugin()
  return (app) => {
    // app.component(..)
    // app.directive(..)
    // app.use(..)
  }
}

export default customDirective
