"use client"

import { createBrowserClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'

// Client-side Supabase client
export const createClientComponentClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
        set(name, value, options) {
          let cookie = `${name}=${value}`
          if (options.expires) {
            cookie += `; expires=${options.expires.toUTCString()}`
          }
          if (options.path) {
            cookie += `; path=${options.path}`
          }
          if (options.domain) {
            cookie += `; domain=${options.domain}`
          }
          if (options.sameSite) {
            cookie += `; samesite=${options.sameSite}`
          }
          if (options.secure) {
            cookie += '; secure'
          }
          document.cookie = cookie
        },
        remove(name, options) {
          const opts = { ...options, maxAge: -1 }
          this.set(name, '', opts)
        },
      },
    }
  )
}

// Export a direct instance for use in API routes
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    cookies: {
      get: () => '',
      set: () => {},
      remove: () => {},
    },
  }
)
