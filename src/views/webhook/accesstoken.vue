<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-input v-model="inputData" placeholder="点击生成AccessToken,成功后请自行保存token" style="width:400px;max-width:100%;" />
      <el-button type="primary" icon="el-icon-success" @click="getAccessToken">
        生成AccessToken
      </el-button>
      <el-button type="primary" icon="el-icon-document" @click="handleCopy(inputData,$event)">
        复制
      </el-button>
      <!-- <el-tab-pane label="use clipboard by v-directive" name="v-directive">
        <el-input v-model="inputData" placeholder="Please input" style="width:400px;max-width:100%;" />
        <el-button v-clipboard:copy="inputData" v-clipboard:success="clipboardSuccess" type="primary" icon="el-icon-document">
          copy
        </el-button>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import { accessToken } from '@/api/user'
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'ClipboardDemo',
  directives: {
    clipboard
  },
  data() {
    return {
      activeName: 'directly',
      inputData: ''
    }
  },
  methods: {
    getAccessToken() {
      accessToken().then(response => {
        this.$message({
          message: '获取AccessToken 成功',
          type: 'success'
        })
        this.inputData = response.data
      })
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

