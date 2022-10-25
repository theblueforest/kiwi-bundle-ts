import { AppConfig } from "./config"
import { ArchitectComponent } from "../architect/component"
import { AppTheme } from "./theme"
import { NavigationActions } from "../provider/navigation"
import { React } from "../vendors"

export type AppLinksCustom<Config extends AppConfig, Props> = (
  props: Props,
  params: {
    page: keyof Config["navigation"]["routes"]
    navigation: NavigationActions<Config>
  },
) => React.ReactNode

export type AppLinksImports<Config extends AppConfig> = {
  pages: { [name in keyof Config["navigation"]["routes"]]: Promise<any> }
  //stores?: { [store: string]: Promise<any> }
  themes?: { [theme: string]: Promise<any> }
  custom?: {
    header?: {
      left?: Promise<any>
      right?: Promise<any>
    }
  }
}

export type AppLinksResolve = {
  pages: { [page: string]: Promise<{ default: ArchitectComponent }> }
  //stores?: { [store: string]: Promise<{ default: AppStore<string, any> }> }
  themes?: { [theme: string]: Promise<{ default: AppTheme<any> }> }
  custom?: {
    header?: {
      left?: Promise<{ default: AppLinksCustom<any, {}> }>
      right?: Promise<{ default: AppLinksCustom<any, {}> }>
    }
  }
}

export type AppLinks<Config extends AppConfig> = {
  pages: { [name in keyof Config["navigation"]["routes"]]: ArchitectComponent }
  //stores?: { [store: string]: AppStore<string, any> }
  themes?: { [theme: string]: AppTheme<Config> }
  custom?: {
    header?: {
      left?: AppLinksCustom<Config, {}>
      right?: AppLinksCustom<Config, {}>
    }
  }
}
