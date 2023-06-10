import ReactPaginate from "react-paginate";

function Pagination({ pageCount, currentPage = 1, handlePageClick }) {
  return (
    <ReactPaginate
      breakLabel="..."
      pageLinkClassName="py-2 px-4"
      nextLabel="Next"
      disableInitialCallback={true}
      nextClassName="flex justify-center items-center"
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      // initialPage={currentPage-1}
      previousLabel="Prev"
      previousClassName="flex justify-center items-center"
      className="flex justify-end space-x-2 md:space-x-1 flex-wrap "
      activeClassName="bg-color-one"
      pageClassName="w-10 md:w-6 items-center flex justify-center rounded-md border border-border-color-one"
      activeLinkClassName="text-white"
      disabledClassName="text-gray-300 focus:outline-none"
    />
  );
}

export default Pagination;
