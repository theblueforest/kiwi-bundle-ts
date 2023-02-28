import { BackHandler, Platform } from "react-native"
import { AppOptions } from "./types/app"

export type Navigation = {
  bind: (updateFn: (page: string) => void) => void
  goTo: (page: string, params?: { [key: string]: string }) => void
}

export default function (
  initialName: string,
  options: AppOptions,
  forcedPath?: string,
): Navigation {
  let update: (page: string) => void = () => { }
  const history: string[] = [initialName]
  if (Platform.OS === "web") {
    const path = typeof forcedPath !== "undefined"
      ? forcedPath
      : options.routes[initialName].path
    window.history.replaceState({ page: initialName }, "", path)
    window.onpopstate = (event: any) => {
      if (event.state && event.state.page) {
        update(event.state.page)
      }
    }
  } else {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (history.length > 1) {
        history.pop()
        update(history[history.length - 1])
        return true
      }
      return false
    })
  }
  return {
    bind: updateFn => {
      update = updateFn
    },
    goTo: (page, params) => {
      if (Platform.OS === "web") {
        let prefix = ""
        if(params) {
          prefix = "?"
          for(const key in params) prefix += `${key}=${params[key]}&`
          prefix = prefix.slice(0, -1)
        }
        window.history.pushState(
          { page },
          "",
          options.routes[page].path + prefix,
        )
      } else {
        history.push(page)
      }
      update(page)
    },
  }
}
