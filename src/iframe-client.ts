import type { Ref } from 'vue'
import { shallowRef, triggerRef } from 'vue'
import type { NuxtDevtoolsIframeClient } from './types'

let clientRef: Ref<NuxtDevtoolsIframeClient | undefined> | undefined

export function useDevtoolsClient() {
  if (!clientRef) {
    clientRef = shallowRef<NuxtDevtoolsIframeClient | undefined>()

    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore injection
    if (window.__NUXT_DEVTOOLS__) {
      // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore injection
      setup(window.__NUXT_DEVTOOLS__)
    }
    else {
      Object.defineProperty(window, '__NUXT_DEVTOOLS__', {
        set(value) {
          if (value)
            setup(value)
        },
        get() {
          return clientRef!.value
        },
      })
    }
  }

  function setup(client: NuxtDevtoolsIframeClient) {
    clientRef!.value = client
    client.host.hooks.hook('host:update:reactivity', () => {
      triggerRef(clientRef!)
    })
  }

  return clientRef
}
