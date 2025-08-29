'use client'
import { createContext, useState } from 'react'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { useEffect } from 'react'
import { CookiesProvider } from 'react-cookie'
import { useSearchParams } from 'next/navigation'

type CommonContextType = {
  states: { mainTitle: string }
  actions: { setMainTitle: (title: string) => void }
}

const CommonContext = createContext<CommonContextType>({
  states: { mainTitle: '' },
  actions: { setMainTitle: () => {} },
})

const CommonProvider = ({ children }) => {
  const [mainTitle, setMainTitle] = useState('vinllage')
  const value = {
    states: { mainTitle },
    actions: { setMainTitle },
  }

  const searchParams = useSearchParams()

  useEffect(() => {
    const reload = searchParams.get('reload') === 'true'
    if (reload) {
      const params = new URLSearchParams(location.search)
      params.delete('reload')
      location.search = params.toString()
    }
  }, [searchParams])

  return (
    <CommonContext.Provider value={value}>
      <CookiesProvider>
        <HelmetProvider>
          <Helmet>
            <title>{mainTitle}</title>
          </Helmet>
          {children}
        </HelmetProvider>
      </CookiesProvider>
    </CommonContext.Provider>
  )
}

const { Consumer: CommonConsumer } = CommonContext

export { CommonProvider, CommonConsumer }

export default CommonContext
