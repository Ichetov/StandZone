

type Props = {
    page: number
    setPage: (value: number | ((prev: number) => number)) => void
    totalPages: number
}

export const Pagination = ({page, setPage, totalPages}: Props)=>{

  

    return (
        <>
    {totalPages > 1 && (
     <div className="pagination">
    <button
      className="paginationButton"
      disabled={page === 1}
      onClick={() => setPage((prev) => prev - 1)}
    >
      Назад
    </button>

    <div className="paginationPages">
      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1

        return (
          <button
            key={pageNumber}
            className={
              page === pageNumber
                ? 'paginationPage paginationPageActive'
                : 'paginationPage'
            }
            onClick={() => setPage(pageNumber)}
            disabled={page === pageNumber}
          >
            {pageNumber}
          </button>
        )
      })}
    </div>

    <button
      className="paginationButton"
      disabled={page === totalPages}
      onClick={() => setPage((prev) => prev + 1)}
    >
      Вперёд
    </button>
  </div>
)}
        </>
    )
}