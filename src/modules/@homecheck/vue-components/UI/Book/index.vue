<template>
<div class="book">
  <div class="book-back book-inner"></div>
  <div class="book-pages book-inner"></div>
  <div class="book-pages book-inner"></div>
  <div class="book-cover book-inner">
    <slot/>
      
  </div>
</div>
</template>



<style scoped>
.book {
	 position: relative;
	 perspective: 1000px;
}
 .book-image {
	 width: 100%;
	 height: auto;
	 display: block;
}
 .book-back {
    
    border-radius: 0 0.4rem 0.4rem 0px;
	 background: #fff;
     filter: brightness(0.93);
}
 .book-inner, .book-pages::before, .book-pages::after {
	 position: absolute;
	 top: 0;
	 left: 0;
	 right: 0;
	 bottom: 0;
	 transform-origin: left center;
	 transition: transform 0.2s ease-in;
}
 .book-cover {
    
    overflow: hidden;
    border-radius: 0 0.4rem 0.4rem 0px;
	 background: #fff;
}
 .book-cover, .book-pages {
	 transform-style: preserve-3d;
}
 .book-pages {
	 transform: scale(0.97, 0.92);
	 perspective: 2000px;
}
 .book-pages::before, .book-pages::after {
	 background-color: #fff;
	 /*
     background-image: linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.075) 97%, transparent);
	 box-shadow: 1px 4px 5px 0 rgba(0, 0, 0, 0.05);
     */
     border : 0.5px solid #eaeaea;
	 content: "";
}
 .book-cover::before {
	 content: "";
	 position: absolute;
	 top: 0;
	 left: 0;
	 right: 0;
	 bottom: 0;
}
 .book-back, .book-pages {
	 right: 0;
	 bottom: 0;
	 
	 transition: all 0.2s ease-in;
}
/*
 .book-pages::after {
	 transition-delay: 0.12s;
}
 .book-pages::before {
	 transition-delay: 0.105s;
}
 .book-pages + .book-pages::after {
	 transition-delay: 0.09s;
}
 .book-pages + .book-pages::before {
	 transition-delay: 0.075s;
}
 .book-pages + .book-pages + .book-pages::after {
	 transition-delay: 0.06s;
}
 .book-pages + .book-pages + .book-pages::before {
	 transition-delay: 0.045s;
}
 .book-pages + .book-pages + .book-pages + .book-pages::after {
	 transition-delay: 0.03s;
}
 .book-pages + .book-pages + .book-pages + .book-pages::before {
	 transition-delay: 0.015s;
}
*/
/*.book-cover::before  */








 .book:hover .book-back, .book:hover  {
	 box-shadow: inset -2px 0 1px rgba(0, 0, 0, 0.075);
}
 .book:hover .book-cover {
	 transform: rotateY(-22deg);
	 transform-timing-function: ease-out;
	 transition-delay: 0s;
}
 .book:hover .book-pages::after {
	 transform: rotateY(-12deg) translateX(1.5%);
}
 .book:hover .book-pages::before {
	 transform: rotateY(-8deg) translateX(1.5%);
}
 .book:hover .book-pages + .book-pages::after {
	 transform: rotateY(-20deg) translateX(1.5%);
}
 .book:hover .book-pages + .book-pages::before {
	 transform: rotateY(-16deg) translateX(2%);
}
 .book:hover .book-pages + .book-pages + .book-pages::after {
	 transform: rotateY(-28deg) translateX(2%);
}
 .book:hover .book-pages + .book-pages + .book-pages::before {
	 transform: rotateY(-24deg) translateX(5px);
}
 .book:hover .book-pages + .book-pages + .book-pages + .book-pages::after {
	 transform: rotateY(-36deg) translateX(5px);
}
 .book:hover .book-pages + .book-pages + .book-pages + .book-pages::before {
	 transform: rotateY(-32deg) translateX(10px);
}

 
</style>