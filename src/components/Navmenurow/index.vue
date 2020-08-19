<template>
  <div class="menu-row">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="item in routes"
        :key="item.index"
        :index="item.index"
      >{{ item.meta.title }}</el-menu-item>
    </el-menu>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeIndex: '1'
    }
  },
  computed: {
    routes() {
      const showingChildren = this.$store.state.permission.routes.filter((item) => {
        if (item.alwaysShow) {
          return item
        }
      })
      console.log(this.$store.state.permission)
      return showingChildren
    }
  },
  methods: {
    handleSelect(key) {
      this.$store.state.permission.menuRoutes = []
      const firstMenuType = this.$store.state.permission.routes.filter((item) => {
        if (item.index === key) {
          return item
        }
      })
      this.$store.state.permission.menuRoutes = firstMenuType[0].children
    }
  }
}
</script>

<style lang="scss">
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
.menu-row .el-menu-item {
  height: 50px;
  line-height: 50px;
}
</style>
