<template>
  <div class="table-example">
    <WaterMark />
    表格例子，支持多级表头，固定行固定列，虚拟滚动，复制粘贴(excel)，排序等
    预计添加：
    1.动态配置表格结构
    <CrabTable
      style="width:100%;height:80vh;overflow: hidden;"
      :virtual-col="9"
      :column-list="columnList"
      :data-list="dataList"
    >
      <!-- future example -->
      <TableBody :data-list="dataList.slice(0,2)">
        <TableChunk scroll-bind="1" />
        <TableChunk scroll-bind="2" />
      </TableBody>
      <TableBody :data-list="dataList.slice(2,4)">
        <TableChunk scroll-bind="1" />
        <TableChunk scroll-bind="2" />
      </TableBody>
      <!-- future example end-->
      <template #test4:head>
        333
      </template>
      <template #test5:head>
        321
      </template>
    </CrabTable>
    <CrabTable
      style="width:100%;height:80vh;overflow: hidden;"
      :virtual-col="9"
      :column-list="columnList"
      :data-list="dataList"
      :sticky-rows="3"
    >
      <template #row:0="{row}">
        这行我说了算{{ row.test1 }}
      </template>
      <template #row:1="{row}">
        这行我说了算{{ row.test1 }}
      </template>
      <template #test4="{rowIndex}">
        {{ rowIndex }}
      </template>
      <template #test10="{row}">
        <input v-model="row.test10">
      </template>
      <template #test11="{row}">
        {{ row.test10 }}
      </template>
      <template #test12="{row}">
        <Button>{{ row.test12 || '按钮' }}</Button>
      </template>
    </CrabTable>
  </div>
</template>

<script>
import CrabTable from '../components/Table'
import Button from '../components/Button'
import WaterMark from '@/components/WaterMark'
export default {
  name: 'TableExample',
  label: '表格',
  components: { CrabTable, Button, WaterMark },
  data () {
    return {
      columnList: [
        {
          field: 'test1',
          name: '测试1',
          children: [
            { field: 'test1', name: '测试2' },
            { field: 'test2', name: '测试3', align: 'right', headAlign: 'right' }
          ]
        },
        {
          field: 'test4',
          name: '测试4',
          children: [
            {
              field: 'test3',
              name: '测试5',
              children: [
                { field: 'test5', name: '测试6', fixed: 'left' }
              ]
            }
          ]
        },
        {
          field: 'test7',
          name: '测试7',
          children: [
            ...new Array(1000).fill(0).map((a, i) => {
              return { field: 't' + i, name: '测试' + i }
            }),
            {
              field: 'test17',
              name: '测试17',
              children: [
                { field: 'test16', name: '测试16' }
              ]
            }
          ]
        }
      ],
      dataList: []
    }
  },
  created () {
    this.dataList = new Array(1000000).fill(
      { test1: 1, test2: 'asdasdafwafa', test3: 3, test4: 4, test5: 5, test6: 6, test7: 7, test8: 8, test9: 9 }
    )
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.table-example{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 20px;
  box-sizing: border-box;
}
</style>
