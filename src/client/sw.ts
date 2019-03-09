import { WorkerChangeMessage, WorkerMessageType, WorkerMessageChangeType, WorkerCacheMessage } from "../sw/types"
import logger from "./logger"

type Hook<Entity> = { [databaseAndStore: string]: (entity: Entity) => void }

class ServiceWorkerClient {
  private isCompatible: boolean = "serviceWorker" in navigator
  private changesHooks: Hook<any> = {}

  constructor() {
    if(this.isCompatible) {
      navigator.serviceWorker.onmessage = (event: any) => {
        const message: WorkerChangeMessage = event.data

        if(message.type === WorkerMessageType.CACHE) {
          // window.location.reload() // TODO : soft reload

        } else if(message.type === WorkerMessageType.CHANGE) {
          const hook = this.changesHooks[`${message.database}-${message.store}`]
          if(typeof hook !== "undefined") hook(message.entity)
        }
      }

      navigator.serviceWorker.oncontrollerchange = () => {
        this.forceCacheUpdate()
      }
    }

    this.load()
  }

  load() {
    if(this.isCompatible) {
      navigator.serviceWorker.register((window as any).kiwi.sw, { scope: "/" }).then(() => {
        navigator.serviceWorker.ready.then(() => {
          logger.logSuccess("ServiceWorker", "Ready")
        })
      })
    }
  }

  forceCacheUpdate() {
    const scripts: string[] = []
    document.querySelectorAll("script").forEach(script => {
      if(script.src.length !== 0) scripts.push(script.src)
    })
    this.postMessage<WorkerCacheMessage>({
      type: WorkerMessageType.CACHE,
      files: scripts,
    })
  }

  private postMessage<Type>(message: Type) {
    const controller = navigator.serviceWorker.controller
    if(controller !== null) {
      return controller.postMessage(message)
    } else {
      return null
    }
  }

  propagateChanges<Entity>(type: WorkerMessageChangeType, databaseName: string, storeName: string, entity: Entity) {
    this.postMessage<WorkerChangeMessage>({
      type: WorkerMessageType.CHANGE,
      change: type,
      database: databaseName,
      store: storeName,
      entity,
    })
  }

  addChangesHook<Entity>(database: string, store: string, action: (entity: Entity) => void) {
    this.changesHooks[`${database}-${store}`] = action
  }

}

export default new ServiceWorkerClient()
