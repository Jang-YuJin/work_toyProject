import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwipeCore,{Navigation,Pagination,Autoplay, Scrollbar} from 'swiper';

import 'swiper/css';
import 'swiper/css/autoplay'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'

import "../css/Home.css"
import {Link} from "react-router-dom";

SwipeCore.use([Navigation,Pagination,Autoplay])

function Home() {
    return (
        <div>
            <Swiper
                className="homeBanner"
                centeredSlides={true}
                spaceBetween={50}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                autoplay={{delay: 4000}}
                loop={true}
                centeredSlidesBounds={true}>
                <SwiperSlide>
                    <Link to={"/EmpList"}>
                        <img src={process.env.PUBLIC_URL + '/banner1.png'}/>
                    </Link>
                </SwiperSlide>
                <SwiperSlide>
                    <Link to={"/EmpList"}>
                        <img src={process.env.PUBLIC_URL + '/banner2.png'}/>
                    </Link>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}

export default Home;