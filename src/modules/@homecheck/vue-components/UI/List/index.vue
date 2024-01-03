<template>
    <div class="list">
        <div class="list-items">
            <UIListItem v-for="(item, i) in items" :key="i"
            :item="item"
            @onChanged="onChanged"/>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'

export default{
    props : ["items"],
    setup(props){
        function onChanged(received){
        }
        return {onChanged}
    },
}

</script>

<style scoped>
.list {
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
}
.list .grid{
  display: grid;
  grid-template-columns : repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 12px;
  padding: 20px;
  overflow : auto;
}
.list-items{
    height: 100%;
    overflow: scroll;
}

</style>