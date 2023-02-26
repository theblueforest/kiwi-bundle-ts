import React from "react"
import { Platform } from "react-native"
import { Language, LanguagesObject } from "./types/names"
import { Context } from "./context"
import { CURRENT_LANGUAGE } from "./language"
import { AppOptions, AppOptionsRoute } from "./types/app"
import { i18n } from "./i18n"
import initNavigation, { Navigation } from "./navigation"

function Page (props: {
  name: string,
  navigation: Navigation,
  getComponent: (name: string) => any,
  getTitle: (name: string) => string | LanguagesObject<string> | undefined,
  props: { [key: string]: string },
  init?: (name: string) => AppOptionsRoute["init"],
}) {
  //console.log("PAGE", props.name)
  const [language, setLanguage] = React.useState<Language>(CURRENT_LANGUAGE.get())
  const [page, setPage] = React.useState<string>(props.name)
  props.navigation.bind(newPage => setPage(newPage))

  const Component = props.getComponent(page)

  let redirect: string | undefined

  if(typeof Component === "string") redirect = Component

  if(typeof redirect === "undefined" && typeof props.init !== "undefined") {
    const init = props.init(page)
    if(typeof init !== "undefined") {
      redirect = init()
    }
  }

  if(typeof redirect !== "undefined") {
    props.navigation.goTo(Component)
    return null
  }

  const title = props.getTitle(page)
  if(Platform.OS === "web" && typeof title !== "undefined") {
    document.title = i18n(title)
  }

  return <Context.Provider
    value={{
      language,
      page,
      setLanguage: lang => {
        CURRENT_LANGUAGE.set(lang)
        setLanguage(lang)
      },
      goTo: props.navigation.goTo,
      web: {
        updateTitle: title => {
          if(Platform.OS === "web") {
            document.title = title
          }
        },
        updateParameter(name, value) {
          const url = new URL(window.location.href)
          if(value.length === 0) {
            url.searchParams.delete(name)
          } else {
            url.searchParams.set(name, value)
          }
          window.history.replaceState(
            window.history.state,
            "",
            url.pathname + url.search,
          )
        },
      },
    }}
  >
    <Component {...props.props}/>
  </Context.Provider>
}

export default async function(
  initialName: string,
  options: AppOptions,
  forcedPath?: string,
  props: { [key: string]: string } = {},
) {
  const navigation = initNavigation(initialName, options, forcedPath)

  const components: { [name: string]: any } = {}
  for(const name of Object.keys(options.routes)) {
    const route = options.routes[name]
    if(typeof route.component !== "undefined") {
      components[name] = (await route.component).default
    } else {
      components[name] = route.redirect
    }
  }

  return () => <Page
    name={initialName}
    navigation={navigation}
    getComponent={name => components[name]}
    init={name => options.routes[name]?.init}
    getTitle={name => {
      let title = options.routes[name]?.title
      if(typeof options?.web?.title !== "undefined") {
        title = options.web.title(title as any)
      }
      return title
    }}
    props={props}
  />
}
