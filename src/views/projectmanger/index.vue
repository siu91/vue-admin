<template>
  <div class="app-container">
    <div class="filter-container">
      <!--  <el-input v-model="listQuery.terms.userName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select -->
      <el-select v-model="projectConnect.ztProductId" placeholder="禅道产品" clearable class="filter-item" style="width: 230px" @change="selectProduct">
        <el-option v-for="item in ztProductList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="projectConnect.ztProjectId" placeholder="禅道项目" clearable class="filter-item" style="width: 230px">
        <el-option v-for="item in ztProductProjectList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="projectConnect.glProjectId" placeholder="Gitlab项目" clearable class="filter-item" style="width: 200px">
        <el-option v-for="item in gitlabProjectList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleConnenctProject">
        关联
      </el-button>
      <!--  <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button> -->
      <!--  <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
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
      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="禅道/Gitlab用户名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userType == 1 ? '管理员':'普通用户' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.activeStatus == 1 ? '正常':row.activeStatus == -1 ? '黑名单' : '未激活' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="230px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <!--   <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.userName | typeFilter }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="电话" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <!--  <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!--   <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button> -->
          <el-button v-if="row.activeStatus==1 " size="mini" type="danger" @click="handleDelete(row,$index)">
            拉黑
          </el-button>
          <el-button v-if="row.activeStatus==-1 " size="mini" type="danger" @click="handleDelete(row,$index)">
            移除黑名单
          </el-button>
          <el-button v-if="row.activeStatus==0 " size="mini" type="danger" @click="handleDelete(row,$index)">
            激活
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类型" prop="userType">
          <el-select v-model="temp.userType" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" :disabled="inputDisable" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" :disabled="inputDisable" />
        </el-form-item>
        <el-form-item label="内部系统用户名" prop="realName">
          <el-input v-model="temp.realName" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.activeStatus" placeholder="请选择" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in userActiveStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createArticle, updateArticle } from '@/api/article'
import { usePageList } from '@/api/user'
import { ztProductList, ztProductProjectList } from '@/api/zentao'
import { gitlabProjectList } from '@/api/gitlab'
import { connectProject } from '@/api/hsync'
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
        terms: {
          userName: undefined,
          userType: undefined
        }
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      userActiveStatusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
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
      usePageList(q).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        console.log('ss:' + this.total)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleConnenctProject() {
      // const { limit, page, terms } = this.listQuery
      // { limit: limit, page: page, terms: terms }
      const q = Object.assign({}, this.projectConnect)
      connectProject(q).then(response => {
        this.$message({
          message: '项目关联成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
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
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
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
