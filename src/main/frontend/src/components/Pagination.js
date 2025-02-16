import React, { useState } from "react";
import '../css/Pagination.css';
import Pagination from "react-js-pagination";

function BasicPagination({ currentPage, itemsCountPerPage, totalItemsCount, onPageChange }) {



    return (
        <Pagination
            activePage={currentPage} // 현재 페이지
            itemsCountPerPage={itemsCountPerPage} // 한 페이지당 아이템 수
            totalItemsCount={totalItemsCount} // 전체 데이터 수
            pageRangeDisplayed={5} // 보여줄 페이지 범위
            onChange={onPageChange} // 페이지 변경 핸들러
            innerClass="pagination" // 커스텀 클래스 이름 (CSS 스타일링 가능)
            itemClass="page-item"
            linkClass="page-link"
            prevPageText={"<"} // 이전 페이지 버튼 텍스트
            nextPageText={">"} // 다음 페이지 버튼 텍스트
            firstPageText={"<<"} // 첫 페이지 버튼 텍스트
            lastPageText={">>"} // 마지막 페이지 버튼 텍스트
        />
    );
}

export default BasicPagination;