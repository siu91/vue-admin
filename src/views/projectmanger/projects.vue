<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="projectConnect.ztProductId" placeholder="禅道产品" clearable class="filter-item" style="width: 230px" @change="selectProduct">
        <el-option v-for="item in ztProductList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="projectConnect.ztProjectId" placeholder="禅道项目" clearable class="filter-item" style="width: 230px">
        <el-option v-for="item in ztProductProjectList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="projectConnect.glProjectId" placeholder="Gitlab Project" clearable class="filter-item" style="width: 200px" @focus="getGitlabProjectList">
        <el-option v-for="item in gitlabProjectList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleFilter">
        查询
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="禅道项目" width="180px" align="center">
        <template slot-scope="{row}">
          <span><a :href="'http://192.168.5.137/zentao/project-task-'+row.ztProjectId+'.html'" target="_blank"> {{ row.ztProjectName }} </a></span>
        </template>
      </el-table-column>
      <el-table-column label="禅道产品" width="180px" align="center">
        <template slot-scope="{row}">
          <span><a :href="'http://192.168.5.137/zentao/product-view-'+row.ztProductId+'.html'" target="_blank"> {{ row.ztProductName }} </a></span>
        </template>
      </el-table-column>
      <el-table-column label="Gitlab Project" width="180px" align="center">
        <template slot-scope="{row}">
          <span><a :href="'http://192.168.1.23/'+row.glProjectName" target="_blank"> {{ row.glProjectName }} </a></span>
        </template>
      </el-table-column>
      <el-table-column label="是否同步" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sync == 1 ? '是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同步时间" width="230px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.syncTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="230px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.sync!=1" size="mini" type="success" @click="handleModifySync(row,1)">
            开启同步
          </el-button>
          <el-button v-if="row.sync==1" size="mini" type="danger" @click="handleModifySync(row,0)">
            关闭同步
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { createArticle, updateArticle } from '@/api/article'
import { ztProductList, ztProductProjectList } from '@/api/zentao'
import { gitlabProjectList } from '@/api/gitlab'
import { syncProjectList, deleteProjectSync, updateProjectSync } from '@/api/hsync'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '1', display_name: '管理员' },
  { key: '0', display_name: '普通用户' }
]

const userActiveStatusOptions = [
  { key: '-1', display_name: '黑名单' },
  { key: '0', display_name: '未激活' },
  { key: '1', display_name: '激活' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      if (status === 0) {
        return '未激活'
      }
      const statusMap = {
        active: '1',
        unactive: '0',
        deleted: '-1',
        '0': 'unactive'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      ztProductList: [
      ],
      ztProductProjectList: [
      ],
      gitlabProjectList: [
      ],
      projectConnect: {
        ztProductId: '',
        ztProjectId: '',
        glProjectId: ''
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: ['id'],
        terms: {
          userName: undefined,
          userType: undefined
        }
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      userActiveStatusOptions,
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        userType: undefined,
        userName: undefined,
        password: undefined,
        realName: undefined,
        phone: undefined,
        activeStatus: '激活',
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      inputDisable: false,
      textMap: {
        update: '编辑用户信息',
        create: '添加用户'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        userName: [{ required: true, message: '用户名必须填写', trigger: 'blur' }],
        password: [{ required: true, message: '用户密码必须填写', trigger: 'blur' }],
        userType: [{ required: true, message: '用户类型必填', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  computed() {
    this.isdisabledInput()
  },
  watch() {
    console.log('watch')
  },
  created() {
    console.log('create')
    this.getList()
    // 加载禅道产品下拉列表
    this.getZentaoProductList()
    // 加载gitlab项目下拉列表
    this.getGitlabProjectList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    selectProduct(val) {
      console.log('select val:' + val)
      console.log('select product:' + this.projectConnect.ztProductId)
      this.projectConnect.ztProjectId = ''
      this.ztProductProjectList = []
      this.getZentaoProductProjectList()
    //  console.log('select' + e.target.selectedIndex) // 选择项的index索引
    // console.log(e.target.value) // 选择项的value
    },
    isdisabledInput() {
      if (this.dialogStatus === 'update') {
        return 'disabled'
      }
      return ''
    },
    getGitlabProjectList() {
      gitlabProjectList().then(response => {
        this.gitlabProjectList = response.data.items
        console.log('加载gitlab 项目下拉列表')
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getZentaoProductList() {
      ztProductList().then(response => {
        this.ztProductList = response.data.items

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getZentaoProductProjectList() {
      console.log('加载产品的项目下拉列表：' + this.projectConnect.ztProductId)
      ztProductProjectList(this.projectConnect.ztProductId).then(response => {
        this.ztProductProjectList = response.data.items

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      // const { limit, page, terms } = this.listQuery
      // { limit: limit, page: page, terms: terms }
      const q = Object.assign({}, this.listQuery)
      syncProjectList(q).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        console.log('ss:' + this.total)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleModifySync(row, status) {
      row.sync = status
      updateProjectSync(row).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.sync = status
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = ['id']
      } else {
        this.listQuery.sort = ['-id']
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.inputDisable = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.inputDisable = true
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      console.log('删除同步：' + row.id)
      deleteProjectSync(row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

