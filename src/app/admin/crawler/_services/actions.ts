'use server'

import { fetchSSR } from '@/app/_global/libs/utils'
import type { CrawlerConfigType } from '../_types'

export async function getCrawlerConfigs(): Promise<CrawlerConfigType[]> {
  try {
    const res = await fetchSSR('/crawler/configs')
    if (res.ok) {
      const data = await res.json()
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : []
      return list.map((cfg: any) => ({
        url: cfg.url ?? '',
        keywords: Array.isArray(cfg.keywords)
          ? cfg.keywords.join('\n')
          : cfg.keywords ?? '',
        linkSelector: cfg.linkSelector ?? '',
        titleSelector: cfg.titleSelector ?? '',
        dateSelector: cfg.dateSelector ?? '',
        contentSelector: cfg.contentSelector ?? '',
        urlPrefix: cfg.urlPrefix ?? '',
      }))
    }
  } catch (err) {
    console.error(err)
  }
  return []
}

export async function getCrawlerScheduler(): Promise<boolean> {
  try {
    const res = await fetchSSR('/crawler/scheduler')
    if (res.ok) {
      const data = await res.json()
      return data.enabled ?? false
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

export async function saveCrawlerConfigs(
  configs: CrawlerConfigType[],
): Promise<Record<string, string> | null> {
  const payload = configs.map((config) => ({
    ...config,
    keywords: config.keywords
      ? config.keywords
          .split('\n')
          .map((k) => k.trim())
          .filter(Boolean)
      : [],
  }))

  const res = await fetchSSR('/crawler/configs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (res.ok) {
    return null
  }

  const { messages } = await res.json().catch(() => ({}))
  return messages ?? null
}

export async function setCrawlerScheduler(enabled: boolean) {
  await fetchSSR(`/crawler/scheduler?enabled=${enabled}`, { method: 'POST' })
}

export async function testCrawler(
  config: CrawlerConfigType,
): Promise<any> {
  try {
    const body = {
      url: config.url,
      keywords: config.keywords
        ? config.keywords
            .split('\n')
            .map((k) => k.trim())
            .filter(Boolean)
        : [],
      linkSelector: config.linkSelector,
      titleSelector: config.titleSelector,
      dateSelector: config.dateSelector,
      contentSelector: config.contentSelector,
      urlPrefix: config.urlPrefix,
    }
    const res = await fetchSSR('/crawler/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      return await res.json()
    }

    const { messages } = await res.json().catch(() => ({}))
    return { messages }
  } catch (err) {
    console.error(err)
    return null
  }
}
