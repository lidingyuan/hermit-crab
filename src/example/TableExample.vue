<template>
  <div class="table-example">
    <WaterMark />
    表格例子，支持多级表头，固定行固定列，虚拟滚动，复制粘贴(excel)，排序等
    预计添加：
    1.动态配置表格结构
    <ZlExcel
      style="width:100%;height:80vh;overflow: hidden;"
      :virtual-col="9"
      :columns="columnList"
      :data="dataList"
    >
      <!-- future example -->
      <!-- <TableBody :data-list="dataList.slice(0,2)">
        <TableChunk scroll-bind="1" />
        <TableChunk scroll-bind="2" />
      </TableBody>
      <TableBody :data-list="dataList.slice(2,4)">
        <TableChunk scroll-bind="1" />
        <TableChunk scroll-bind="2" />
      </TableBody> -->
      <!-- future example end-->
    </ZlExcel>
    <ZlTable
      style="width:100%;height:80vh;overflow: hidden;"
      :virtual-col="9"
      :columns="columnList"
      :data="dataList"
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
    </ZlTable>
  </div>
</template>

<script>
import ZlTable from '../components/ZlTable'
import Button from '../components/Button'
import WaterMark from '@/components/WaterMark'
export default {
  name: 'TableExample',
  label: '表格',
  components: { ZlTable, Button, WaterMark },
  data () {
    return {
      columnList: [
        {
          field: 'test1',
          title: '测试1',
          children: [
            { field: 'test1', title: '测试2' },
            { field: 'test2', title: '测试3', align: 'right', headAlign: 'right' }
          ]
        },
        {
          field: 'test4',
          title: '测试4',
          children: [
            {
              field: 'test3',
              title: '测试5',
              children: [
                { field: 'test5', title: '测试6', fixed: 'left' }
              ]
            }
          ]
        },
        {
          field: 'test7',
          title: '测试7',
          children: [
            { field: 'test8', title: '测试8' },
            { field: 'test9', title: '测试9' },
            { field: 'test10', title: '测试10' },
            { field: 'test11', title: '测试11' },
            { field: 'test12', title: '测试12' },
            { field: 'test13', title: '测试13' },
            { field: 'test14', title: '测试14' },
            { field: 'test15', title: '测试15' },
            {
              field: 'test17',
              title: '测试17',
              children: [
                { field: 'test16', title: '测试16' }
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
