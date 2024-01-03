<template>
    <section class="markdown-viewer" v-html="mark(props.string)">

    </section>
</template>
<script setup>
import { marked }  from 'marked';

const props = defineProps({
      string: String
    })

function mark(str){
    return marked(str)
}


</script>
<style>
.markdown-viewer{
    --grey50: #f9fafb;
    --grey100: #f2f4f6;
    --grey200: #e5e8eb;
    --grey300: #d1d6db;
    --grey400: #b0b8c1;
    --grey500: #8b95a1;
    --grey600: #6b7684;
    --grey700: #4e5968;
    --grey800: #333d4b;
    --grey900: #191f28;
    --greyOpacity50: rgba(0,23,51,0.02);
    --greyOpacity100: rgba(2,32,71,0.05);
    --greyOpacity200: rgba(0,27,55,0.1);
    --greyOpacity300: rgba(0,29,58,0.18);
    --greyOpacity400: rgba(0,29,54,0.31);
    --greyOpacity500: rgba(3,24,50,0.46);
    --greyOpacity600: rgba(0,19,43,0.58);
    --greyOpacity700: rgba(3,18,40,0.7);
    --greyOpacity800: rgba(0,12,30,0.8);
    --greyOpacity900: rgba(2,9,19,0.91);
    --white: #fff;
    --black: #000;
    --blue50: #e8f3ff;
    --blue200: #90c2ff;
    --blue100: #c9e2ff;
    --blue300: #64a8ff;
    --blue400: #4593fc;
    --blue500: #3182f6;
    --blue600: #2272eb;
    --blue700: #1b64da;
    --blue800: #1957c2;
    --blue900: #194aa6;
    --red50: #fee;
    --red100: #ffd4d6;
    --red200: #feafb4;
    --red300: #fb8890;
    --red400: #f66570;
    --red500: #f04452;
    --red600: #e42939;
    --red700: #d22030;
    --red800: #bc1b2a;
    --red900: #a51926;
    --orange50: #fff3e0;
    --orange100: #ffe0b2;
    --orange200: #ffcc80;
    --orange300: #ffbd51;
    --orange400: #ffa927;
    --orange500: #fe9800;
    --orange600: #fb8800;
    --orange700: #f57800;
    --orange800: #ed6700;
    --orange900: #e45600;
    --yellow50: #fff9e7;
    --yellow100: #ffefbf;
    --yellow200: #ffe69b;
    --yellow300: #ffdd78;
    --yellow400: #ffd158;
    --yellow500: #ffc342;
    --yellow600: #ffb331;
    --yellow700: #faa131;
    --yellow800: #ee8f11;
    --yellow900: #dd7d02;
    --purple50: #f9f0fc;
    --purple100: #edccf8;
    --purple200: #da9bef;
    --purple300: #c770e4;
    --purple400: #b44bd7;
    --purple500: #a234c7;
    --purple600: #9128b4;
    --purple700: #8222a2;
    --purple800: #73228e;
    --purple900: #65237b;
    --teal50: #edf8f8;
    --teal100: #bce9e9;
    --teal200: #89d8d8;
    --teal300: #58c7c7;
    --teal400: #30b6b6;
    --teal500: #18a5a5;
    --teal600: #109595;
    --teal700: #0c8585;
    --teal800: #097575;
    --teal900: #076565;
    --green50: #f0faf6;
    --green100: #aeefd5;
    --green200: #76e4b8;
    --green300: #3fd599;
    --green400: #15c47e;
    --green500: #03b26c;
    --green600: #02a262;
    --green700: #029359;
    --green800: #028450;
    --green900: #027648;
    --whiteOpacity50: rgba(209,209,253,0.05);
    --whiteOpacity100: rgba(217,217,255,0.11);
    --whiteOpacity200: rgba(222,222,255,0.19);
    --whiteOpacity300: rgba(224,224,255,0.27);
    --whiteOpacity400: rgba(232,232,253,0.36);
    --whiteOpacity500: rgba(242,242,255,0.47);
    --whiteOpacity600: rgba(248,248,255,0.6);
    --whiteOpacity700: rgba(253,253,255,0.75);
    --whiteOpacity800: rgba(253,253,254,0.89);
    --whiteOpacity900: #fff;
    --inverseGrey50: #202027;
    --inverseGrey100: #2c2c35;
    --inverseGrey200: #3c3c47;
    --inverseGrey300: #4d4d59;
    --inverseGrey400: #62626d;
    --inverseGrey500: #7e7e87;
    --inverseGrey600: #9e9ea4;
    --inverseGrey700: #c3c3c6;
    --inverseGrey800: #e4e4e5;
    --inverseGrey900: #fff;
    --background: #fff;
    --darkBackground: #17171c;
    --greyBackground: #f2f4f6;
    --darkGreyBackground: #101013;
    --layeredBackground: #fff;
    --darkLayeredBackground: #202027;
    --floatBackground: #fff;
    --darkFloatBackground: #2c2c35;

    --line-height-base: 1.6;
    --line-height-adjust: 1.3;
    --font-size-h1: 36px;
    --font-size-h2: 32px;
    --font-size-h3: 32px;
    --font-size-h4: 32px;
    --font-size-h5: 24px;
    --font-size-h6: 20px;
    --font-size-h7: 17px;
    --font-size-p: 15px;
    --font-size-sm: 13px;
    --font-size-small: 13px;
    --font-size-xsmall: 11px;
    --font-weight-bold: bold;
    --font-weight-semibold: 600;
    --font-weight-medium: 500;
    --font-weight-regular: normal;

    line-height: var(--line-height-base);
}




.markdown-viewer strong{
    font-weight: 600;
    color : rgb(25, 31, 40);
}
.markdown-viewer h1,
.markdown-viewer h2,
.markdown-viewer h3 {
    color : var(--grey800);
}
.markdown-viewer h1{
    font-size : var(--font-size-h1);
}
.markdown-viewer h2{
    font-weight: 500;
    font-size : var(--font-size-h2);
    text-align: center;
    line-height: 50px;
    margin-bottom: 50px;
}
.markdown-viewer h3{
    font-weight: 500;
    margin : 62px 0 12px;
    font-size : var(--font-size-h3);
}
.markdown-viewer h4{
    margin : 62px 0 12px;
    font-weight: 500;
    color : rgb(25, 31, 40);
    font-size : var(--font-size-h4);
}
.markdown-viewer p{
    font-weight: 300;
    color : var(--grey700);
    font-size: var(--font-size-h7);
    margin-bottom: 30px;
}
.markdown-viewer li{
    color : var(--grey700);
    font-size: var(--font-size-h7);
}
.markdown-viewer img {
    width : 100%;
    margin-bottom: 30px;
}
.markdown-viewer ol,
.markdown-viewer ul {
    margin-bottom: 30px;
}
.markdown-viewer li {
    padding-left: 0em;
    margin-bottom : 12px;
    font-weight: 400;
    line-height: 30px;
    color : rgb(51, 61, 75);
}
.markdown-viewer pre{
    color : #818181;
    font-size : 14px;
    border : 0px;
    padding : 1em 1.2em;
    white-space: pre-line;
    border-radius : 6px;
    background-color : var(--greyOpacity100);
    line-height: 30px;
    font-weight: 300;
}

.markdown-viewer > blockquote{
    margin: 0 0 50px 0;
}

.markdown-viewer > blockquote > p {
    font-size: 18px;
    line-height: 30px;
    display: block;
    position: relative;
    padding: 0.2em 1.4em;
    text-decoration: none;
    background: transparent;
    white-space: pre-line;
    margin:  0;
    color: rgb(49, 130, 246);
}
.markdown-viewer > blockquote > p > strong{
    color: rgb(49, 130, 246);
    font-weight: 600;
}
.markdown-viewer > blockquote > p::before{
   content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 6px;
    height: 100%;
    background-color: rgb(49, 130, 246);
    border-radius: 50px;
    margin: 0px;
}

.markdown-viewer > blockquote > blockquote{ 
    margin: 0;
}
.markdown-viewer > blockquote > blockquote > p {
    margin: 0;
    background: rgb(232, 243, 255);
    padding : 1em 1.2em;
    border-radius: 6px;
    white-space: pre-line ;
    font-size : 1em;
}
.markdown-viewer > blockquote > blockquote > p > strong {
    color: rgb(25, 31, 40);
    line-height: 32px;
    font-size: 1.25em;
    box-sizing: border-box;
    font-weight: 500;
}

.markdown-viewer hr {
    border-color: var(--greyOpacity100);
    margin : 0 0 24px;
}

.markdown-viewer br{
   display: block;
   margin: 10px 0;
}

</style>