import { useState } from 'react'
import { Header } from '@/widgets/header/ui/Header'
import { Footer } from '@/widgets/footer/ui/Footer'
import { StandFilters } from '@/widgets/stand-filters/ui/StandFilters'
import { StandList } from '@/widgets/stand-list/ui/StandList'
import { useGetMallsQuery, useGetStandsQuery } from '@/entities/stand/api/standApi'
import { Loader } from '@/shared/ui/Loader'
import { AdvantagesSection } from '@/widgets/advantages-section/AdvantagesSection'
import style from './HomePage.module.css'
import { FAQSection } from '@/widgets/faq-section/ui/FAQSection'


const capitalizeFirst = (value: string) => {
  if (!value) return ''
  return value[0].toUpperCase() + value.slice(1)
}



export const HomePage = () => {
  const [mall, setMall] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const standsQuery = {
    mall: mall || undefined,
    search: search ? capitalizeFirst(search) : undefined,
    page: page || undefined,
}



  const { data: malls = [] } = useGetMallsQuery()
  const {data:{meta, data: stands = []}={} , isLoading } = useGetStandsQuery(standsQuery)

  return (
    <div className="page">
      <Header />
     <main className="pageMain">
        <div className="container">
          <AdvantagesSection/>
           <FAQSection />
              <div className={style.wrap}>
                          <div className="stack24">
            <h1 className="sectionTitle">Рекламные точки</h1>
            <StandFilters
              mall={mall}
              search={search}
              malls={malls.map((item
      ) => item.mallName)}
              onMallChange = {(value)=>{
                setMall(value)
                setPage(1)
              }}
              onSearchChange={setSearch}
            />
           {isLoading ? (
  <Loader />
) : (
  <>
    <StandList totalPages={meta?.totalPages || 0} stands={stands} page = {page} setPage = {setPage} />
  </>
)}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}