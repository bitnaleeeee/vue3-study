<template>
     <UIAccordion style=" width: calc(85% - 60px );
                margin: 0px 6px 0px 6px;"
                type="primary" v-for="(item,i) in [1,2,3,4]" :key="i">
                    <template #preview>
                        <span class="accordion-date">2021.12.2</span>
                    </template>
                    <template #inner>
                        <div>
                        <div v-wave v-for="(item,i) in [1,2,3,4]" :key="i" class="accordion-inner -6">
                            <div class="tag">
                                <span>매니저</span>
                                <span>유류비포함</span>
                                <span>베테랑</span>
                            </div>
                            <div class="en ">
                                <div>
                            <span class="accordion-title">
                                가산동 푸르지오 아파트
                            </span>
                            <span class="accordion-comment">
                                10:00~12:00
                            </span>
                                </div>
                                <div class="align-self-center">
                                   <img class="icon-more white"/>
                                </div>
                            </div>
                        </div>
                        </div>
                    </template>




                    <template #thumnail_footer>
                        <div class="">
                            <span class="accordion-title">
                                가산동 푸르지오 아파트
                            </span>
                            <span class="accordion-comment">
                                외 4건
                            </span>
                        </div>
                    </template>
                </UIAccordion>
</template>