<template>
<label
class="button"  
:class="[type ? type : '', disabled ? 'disabled' : '', size ? size : '', size=='md' ? 'common-border-8' : '' ]"
@click="disabled ? null : click_event(click)" 
 :to="to ? to : '' " 
v-wave="waveeffect">
<span>
    <slot/>
</span>
</label>
</template>

<script>
export default {
    props:['type','to' ,'size','click', 'disabled'],
    computed:{
        waveeffect(){
            switch(this.type)
            {
                case 'white':
                return {
                    color:'#aaa'
                }
                case 'primary' :
                case 'primary-in':
                return {
                    color : '#050507'
                }
                case 'link-primary':
                case 'link':
                return {
                    color : '#a8c1ea'
                }
                default :
                return {}
            } 
        }
    },
        methods:{
        click_event(fun){
            if(fun instanceof Function){
              fun()
            }
        }
    }

}
</script>
<style scoped>

.common-border-8{
    border-radius: 8px;
}

.button{
    user-select: none;
  font-family: NotoSansKR;
    font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  display: inline-block;
  text-decoration: none;
  white-space : nowrap;
  text-overflow : ellipsis;
  overflow : hidden;
  text-align: center;
}

.button.primary{
    background-color: var(--primary);
    color: #fff;
    font-weight: 500;
}

.button.primary-in{
    background-color: var(--primary-deep);
    color: #fff;
    font-weight: 500;
}
.button.danger{
    background-color : #fff;
    border : 1px solid #CC0000;
    color : #CC0000;
    font-weight: 500;
}


.button.white{
    background: #fff;
  font-weight: 500;
  color: #2f2f2f;
  border: solid 1px #e0e8eb;
}

.button.black {
    background: #0f0f0f;
    color : #fff;
    border : 1px solid #0f0f0f;
    font-weight: 500;
}

.button.black-out {
    background: transparent;
    color : #0f0f0f;
    font-weight: 700;
    border : 1px solid #0f0f0f
}

.button.selection{
    background: #fff;
    padding: 12px 16px;
  font-weight: 500;
  color: #2f2f2f;
  border: solid 1px #e0e8eb;
  font-size: 13.5px;
}

.button.link-primary{
      flex-grow: 0;
  line-height: 1.5;
  font-family: NotoSansKR;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: var(--primary);
  text-decoration: none;
  position: inherit;
  border-radius: 8px;
  padding : 6px 10px;
  transition: background 0.3s ease;
}
.button.link-danger{
      flex-grow: 0;
  line-height: 1.5;
  font-family: NotoSansKR;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: indianred;
  text-decoration: none;
  position: inherit;
  border-radius: 8px;
  padding : 6px 10px;
  transition: background 0.3s ease;
}
.button.link{
      flex-grow: 0;
  line-height: 1.5;
  font-family: NotoSansKR;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: var(--font);
  text-decoration: none;
  position: inherit;
  border-radius: 8px;
  padding : 6px 10px;
  transition: background 0.3s ease;
}
.button.link-primary:hover
{
    background-color: var(--button-primary-hover);
}
.button.link:hover
{
    background-color: var(--button-hover);
}
.button.link-danger:hover{
    background-color : rgba(255,0,0,0.06)
}


.xs{
    padding: 4px 6px !important;
 border-radius: 4px !important;
  font-size: 0.75rem !important;
}
.sm{
padding: 6px 10px !important;
 border-radius: 6px !important;
  font-size: 0.8rem !important;
}
.md{
    padding: 6px 20px !important;
     font-size: 1rem !important;
}
.lg{
    padding: 14px 20px !important;
    border-radius: 6px !important;
     font-size: 14px !important;
}

.full{
    padding: 6px 20px;
    border-radius: 6px;
    font-size: 12px;
    justify-content: center;
    display: flex;
}

.button.disabled{
    background: #e2e2e2;
    color:#a2a2a2;
}
.button.circle  {
    border-radius: 100rem!important;
}
.button.circle.sm {
    padding : 0.4rem 1rem !important;
}


</style>