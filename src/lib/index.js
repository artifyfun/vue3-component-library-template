import * as plugins from './plugins'
import * as components from './components'
import * as directives from './directives'
import * as utils from './utils'
import './style.css'
import { defu } from 'defu'

const useComponentLibrary = (pluginOptions) => {
  /* ADD YOUR DEFAULT CONFIGURATION BELOW */
  const DefaultPluginOptions = {
    showLogs: true,
    components: {
      globallyRegister: false,
      exclude: [],
    },
    plugins: {
      globallyRegister: true,
      exclude: [],
    },
    directives: {
      globallyRegister: true,
      exclude: [],
    },
  }

  const PluginOptions = defu(pluginOptions, DefaultPluginOptions)

  return (app) => {
    if (PluginOptions.components?.globallyRegister) {
      for (const name in components) {
        /* Exclude Components */
        if (
          PluginOptions.components &&
          PluginOptions.components.exclude &&
          PluginOptions.components.exclude.includes(name)
        ) {
          log(name, name, false, PluginOptions.showLogs)
          continue
        }
        log(name, name, true, PluginOptions.showLogs)
        app.component(name, components[name])
      }
    } else {
      log('ALL COMPONENTS', false, false)
    }

    /* Add Plugins */
    if (PluginOptions.plugins?.globallyRegister) {
      for (const name in plugins) {
        /* Exclude Plugins */
        if (
          PluginOptions.plugins &&
          PluginOptions.plugins.exclude &&
          PluginOptions.plugins.exclude.includes(name)
        ) {
          log(name, false, false, PluginOptions.showLogs)
          continue
        }
        log(name, false, true, PluginOptions.showLogs)
        app.use(plugins[name])
      }
    } else {
      log('ALL PLUGINS', false, false)
    }

    /* Add Directives */
    if (PluginOptions.directives?.globallyRegister) {
      for (const name in directives) {
        /* Exclude Directives */
        if (
          PluginOptions.directives &&
          PluginOptions.directives.exclude &&
          PluginOptions.directives.exclude.includes(name)
        ) {
          log(name, false, false, PluginOptions.showLogs)
          continue
        }
        log(name, false, true, PluginOptions.showLogs)
        app.directive(name, directives[name])
      }
    } else {
      log('ALL DIRECTIVES', false, false)
    }
  }
}

const log = (base, as, succ, showLogs = true) => {
  if (!showLogs) return
  as = as !== false ? as : false
  let m = as ? `globally added %c as %c <${as}>` : `imported %c %c`
  if (!succ) m = `excluded in global registration %c %c`
  console.log(
    `%c${base}%c - %c ${m}`,
    `color: ${succ ? 'green' : 'red'}; font-weight: bold;font-size: 1.2em`,
    'color:gray',
    'color:orange',
    'color:gray',
    'color:teal; font-weight: bold;font-size: 1.2em'
  )
}

export * from './components'
export * from './directives'
export * from './plugins'
export * from './utils'
export { useComponentLibrary, components, directives, plugins, utils }
