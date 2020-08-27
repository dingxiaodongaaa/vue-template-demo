<template>
  <div class="menu-row">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#2c4158"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="item in routes"
        :key="item.index"
        :index="item.index"
      >{{ item.meta[0].title }}</el-menu-item>
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
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.activeIndex = showingChildren[0].index
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
