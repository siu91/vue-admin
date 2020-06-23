<template>
  <el-form>
    <el-form-item label="原密码">
      <el-input v-model="updatePass.password" />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model="updatePass.newPassword" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="changePass">修改密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data() {
    return {
      updatePass: {
        password: '',
        newPassword: ''
      }}
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    },
    changePass() {
      if (this.updatePass.newPassword.length > 6) {
        this.$store.dispatch('user/updatePass', this.updatePass).then(() => {
          this.$message({
            message: '密码修改成功',
            type: 'success',
            duration: 5 * 1000
          })
          // this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }).catch(() => { this.loading = false })
      } else {
        this.$message({
          message: '密码不能小于6位',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>
