import { Header } from '@/widgets/header/ui/Header'
import { Footer } from '@/widgets/footer/ui/Footer'
import { RequestForm } from '@/features/request-form/ui/RequestForm'

export const RequestPage = () => {
  return (
    <div className="page">
      <Header />

      <main className="pageMain">
        <div className="container">
          <div className="card" style={{ maxWidth: 800 }}>
            <h1 className="sectionTitle">Отправить запрос</h1>
            <RequestForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}