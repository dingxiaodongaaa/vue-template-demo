<template>
  <div class="app-container">
    <div class="filter-container query-info">
      <el-form ref="form" :inline="true">
        <el-form-item label="内容名称" prop="name">
          <el-input
            v-model="listQuery.listParam.content"
            placeholder="请输入内容名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <el-form class="table-control">
      <el-form-item>
        <el-button class="filter-item tableCtr" type="primary" plain style="margin-left: 10px;" icon="el-icon-plus" @click="addTextTemplate">
          添加文字模板
        </el-button>
        <el-button class="filter-item tableCtr" type="primary" plain style="margin-left: 10px;" icon="el-icon-plus" @click="addVideoTemplate">
          添加语音模板
        </el-button>
        <el-button class="filter-item tableCtr" type="danger" plain style="margin-left: 10px;" icon="el-icon-delete" @click="delSomeTemplate">
          删除
        </el-button>
        <el-button class="filter-item tableCtr" type="warning" plain style="margin-left: 10px;" icon="el-icon-refresh" @click="refreshTemplate">
          刷新
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="tableSelected"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="板卡内容名称" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center">
        <template slot-scope="{row}">
          <span v-show="row.templateType === '1'">{{ row.templateType === '1' ? '文字':'语音' }}内容{{ row.contentFirst === '1' ? '(一行)':'2'?'(二行)':'3'?'(三行)':'(四行)' }}</span>
          <span v-show="row.templateType === '2'">{{ row.templateType === '1' ? '文字':'语音' }}内容</span>
        </template>
      </el-table-column>
      <el-table-column label="操作项" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleSee(row)">查看</el-button>
          <el-button type="success" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.listParam.baseRequest.pageNum"
      :limit.sync="listQuery.listParam.baseRequest.pageSize"
      @pagination="getList"
    />
    <!-- 新增文字模板弹窗 -->
    <el-dialog class="pop-module" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="closeDialog">
      <p class="tips-info">注：显示内容，其中大括号配相应字母，显示指定内容，如：{P}表示车牌。有效的字母含义：P车牌号码、T车卡类型（包月车\临时车）、L停车时长、A费用、ZS总车位、SS剩余车位、N当前时间、D根据会员卡剩余天数播放</p>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示内容:" prop="templateName">
              <el-input v-model="temp.templateName" :disabled="editStatus" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内容名称:" prop="type">
              <el-select v-model="temp.lineNum" class="filter-item" placeholder="请选择展示行数" :disabled="editStatus" @change="onSelectRowN($event)">
                <el-option v-for="item in rowsNumOptions" :key="item.key" :label="item.display_name" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-for="(item,index) in temp.broadCastDetailList" :key="item.value" :span="24">
            <el-col :span="18">
              <el-form-item
                :label="item.text"
                :prop="'broadCastDetailList.' + index + '.content'"
                :rules="{
                  required: true, message: '文本内容为必填项', trigger: 'blur'
                }"
              >
                <el-input v-model="item.content" :disabled="editStatus" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label=""
                :class="['colorSelect', item.textColor === 'GREEN' ? 'greenSty' : '' , item.textColor === 'YELLOW' ? 'yelSty' : '', item.textColor === 'RED' ? 'redSty':'']"
              >
                <el-select ref="colorSel" v-model="item.textColor" class="filter-item" placeholder="请选择文字颜色" :disabled="editStatus" @change="onChangeColor($event,item.lineNo)">
                  <el-option v-for="itemCor in statusOptions" :key="itemCor.value" :label="itemCor.label" :value="itemCor.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <p class="tips-info"> 示例：车牌号码{P}{T} 或  总车位{ZS}剩余车位{SS}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-show="buttonStatus" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 新增语音弹窗 -->
    <el-dialog class="pop-module" :title="textMap[dialogStatus]" :visible.sync="dialogFormVideoVisible" :close-on-click-modal="false" @close="closeDialog">
      <p class="tips-info">注：显示内容，其中大括号配相应字母，显示指定内容，如：{P}表示车牌。有效的字母含义：P车牌号码、T车卡类型（包月车\临时车）、L停车时长、D剩余天数、A费用、ZS总车位、SS剩余车位、N当前时间</p>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容名称:" prop="templateName">
              <el-input v-model="temp.templateName" :disabled="editStatus" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="语音模板类型:" prop="subType">
              <el-select v-model="temp.subType" class="filter-item templateType" placeholder="请选择语音类型" :disabled="editStatus">
                <el-option v-for="item in subTypeList" :key="item.type" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-for="(item,index) in temp.broadCastDetailList" :key="item.value" :span="24">
            <el-form-item
              label="播报内容:"
              :prop="'broadCastDetailList.' + index + '.content'"
              :rules="{
                required: true, message: '播报内容为必填项', trigger: 'blur'
              }"
            >
              <el-input v-model="item.content" :disabled="editStatus" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <p class="tips-info"> 示例：{P}{T}欢迎光临   或    {P}{T}收费{A}元</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVideoVisible = false">
          取消
        </el-button>
        <el-button v-show="buttonStatus" type="primary" @click="dialogStatus==='createVideo'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryTemplateList, createTemplate, deleteTemplate, deleteSomeTemplate, seeTemplateInfo, updateTemplateInfo, getsubType } from '@/api/article'
import Pagination from '@/components/Pagination'

export default {
  name: 'BroadcastTemplate',
  components: {
    Pagination
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        title: undefined,
        listParam: {
          baseRequest: {
            pageNum: 1,
            pageSize: 10
          },
          content: ''
        }
      },
      rowsNumOptions: [{
        key: 'fir',
        value: 1,
        display_name: '一行(文字)'
      },
      {
        key: 'sec',
        value: 2,
        display_name: '二行(文字)'
      },
      {
        key: 'thd',
        value: 3,
        display_name: '三行(文字)'
      },
      {
        key: 'for',
        value: 4,
        display_name: '四行(文字)'
      }
      ],
      statusOptions: [{
        label: '红色',
        value: 'RED'
      }, {
        label: '绿色',
        value: 'GREEN'
      }, {
        label: '黄色',
        value: 'YELLOW'
      }],
      delsId: '',
      queryId: '',
      subTypeList: '',
      temp: {
        id: undefined,
        templateName: '',
        title: '',
        type: '',
        lineNum: 1,
        // 模板类型
        templateType: '',
        subType: '0',
        broadCastDetailList: [{
          lineNo: 1,
          text: '第一行显示',
          status: '红色',
          textColor: 'RED',
          content: ''
        }]
      },
      wordCon: ['一', '二', '三', '四'],
      dialogStatus: '',
      editStatus: false,
      buttonStatus: false,
      dialogFormVisible: false,
      dialogFormVideoVisible: false,
      textMap: {
        update: '修改板卡内容信息',
        create: '新增文字内容',
        createVideo: '新增语音内容',
        see: '查看板卡内容信息'
      },
      rules: {
        templateName: [{
          required: true,
          message: '显示内容为必填项',
          trigger: 'blur'
        }],
        subType: [{
          required: true,
          message: '语音模板类型为必填项',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getList()
    // 获取语音类型
    this.getsubTypeFun()
  },
  methods: {
    // ====== 获取语音模板类型 ======
    getsubTypeFun() {
      var typeObj = { 'type': 'VOICE_TEMPLATE_TYPE' }
      getsubType(typeObj).then(response => {
        this.subTypeList = response.data
      })
    },
    // ====== 关闭弹窗 ======
    closeDialog(val) {
      this.editStatus = false
    },
    // ====== 表格多选 ======
    tableSelected(val) {
      this.delsId = []
      val.forEach((item) => {
        this.delsId.push(item.id)
      })
    },
    // ====== 内容名称选择 ======
    onSelectRowN(e) {
      // 新增文字行
      if (e > this.temp.broadCastDetailList.length) {
        var addCon = []
        for (let i = 0; i < (e - this.temp.broadCastDetailList.length); i++) {
          addCon.push({
            lineNo: this.temp.broadCastDetailList.length + i + 1,
            text: '第' + this.wordCon[this.temp.broadCastDetailList.length + i] + '行显示：',
            status: '红色',
            textColor: 'RED',
            content: ''
          })
        }
        this.temp.broadCastDetailList = this.temp.broadCastDetailList.concat(addCon)
      } else if (e < this.temp.broadCastDetailList.length) {
        // 减少文字行
        this.temp.broadCastDetailList.splice(e)
      } else {
        return
      }
    },
    //  ====== 文字颜色修改 ======
    onChangeColor(e, value) {
      // eslint-disable-next-line no-constant-condition
      var colorVal = e === 'GREEN' ? 'greenSty' : 'YELLOW' ? 'yelSty' : 'redSty'
      // 设置样式
      this.$refs.colorSel[value - 1].$el.setAttribute('class', 'el-select filter-item ' + colorVal)
      // 存储颜色类型
      this.temp.broadCastDetailList[value - 1].textColor = e
    },
    //  ====== 获取查询数据 ======
    getList() {
      this.listLoading = true
      queryTemplateList(this.listQuery.listParam).then(response => {
        this.list = response.data.list
        this.total = response.data.totalCount
        // 关闭加载动画
        this.listLoading = false
      })
    },
    //  ====== 查询 ======
    handleFilter() {
      this.listQuery.listParam.baseRequest.pageNum = 1
      this.getList()
    },
    //  ====== 重置 ======
    handleReset() {
      this.listQuery.listParam.baseRequest.pageNum = 1
      this.listQuery.listParam.content = ''
      this.getList()
    },
    //  ====== 重置temp数据 ======
    resetTemp() {
      this.temp = {
        id: undefined,
        templateName: '',
        templateType: '',
        title: '',
        lineNum: 1,
        subType: '0',
        broadCastDetailList: [{
          lineNo: 1,
          text: '第一行显示',
          status: '红色',
          textColor: 'RED',
          content: ''
        }],
        type: ''
      }
    },
    //  ====== 添加文字模板 ======
    addTextTemplate() {
      this.resetTemp()
      this.temp.templateType = 1
      this.dialogStatus = 'create'
      this.dialogFormVideoVisible = false
      this.dialogFormVisible = true
      this.buttonStatus = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //  ====== 添加语音模板 ======
    addVideoTemplate() {
      this.resetTemp()
      this.temp.templateType = 2
      this.dialogStatus = 'createVideo'
      this.dialogFormVisible = false
      this.dialogFormVideoVisible = true
      this.buttonStatus = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //  ====== 确定新增模板 -- 按钮点击 ======
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            'broadCastDetailList': [],
            'id': '',
            'subType': this.temp.subType,
            'templateName': this.temp.templateName,
            'templateType': this.temp.templateType
          }
          this.temp.broadCastDetailList.forEach(element => {
            params.broadCastDetailList.push(
              {
                'content': element.content,
                'lineNo': element.lineNo,
                'textColor': element.textColor,
                'id': '',
                'templateId': '',
                'templateName': ''
              })
          })
          createTemplate(params).then(() => {
            this.dialogFormVisible = false
            this.dialogFormVideoVisible = false
            this.$notify({
              title: '保存成功',
              message: '保存板卡内容成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    //  ====== 查看信息 ======
    handleSee(row) {
      seeTemplateInfo(row.id).then((row) => {
        // 做了类型转换，是因为后台传入的数据格式问题
        if (typeof (row.data.subType) === 'number') {
          row.data.subType = row.data.subType.toString()
        }
        this.temp = Object.assign({}, row.data)
        // 根据返回的数据设置要展示的文字（第x行显示：）
        this.temp.broadCastDetailList.forEach((item) => {
          item.text = '第' + this.wordCon[item.lineNo - 1] + '行显示：'
        })
        if (this.temp.templateType !== '1') {
          this.dialogFormVideoVisible = true
          this.dialogFormVisible = false
        } else {
          this.dialogFormVisible = true
          this.dialogFormVideoVisible = false
        }
        this.buttonStatus = false
        this.dialogStatus = 'see'
        this.editStatus = true
        this.$nextTick(() => {
          // 移除表单项的校验结果
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    //  ====== 修改信息 ======
    handleUpdate(row) {
      var _this = this
      _this.queryId = row.id
      seeTemplateInfo(row.id).then((row) => {
        // 做了类型转换，是因为后台传入的数据格式问题
        if (typeof (row.data.subType) === 'number') {
          row.data.subType = row.data.subType.toString()
        }
        _this.temp = Object.assign({}, row.data)
        // 根据返回的数据设置要展示的文字（第x行显示：）
        this.temp.broadCastDetailList.forEach((item) => {
          item.text = '第' + this.wordCon[item.lineNo - 1] + '行显示：'
        })
        _this.dialogStatus = 'update'
        if (this.temp.templateType !== '1') {
          this.dialogFormVideoVisible = true
          this.dialogFormVisible = false
        } else {
          this.dialogFormVisible = true
          this.dialogFormVideoVisible = false
        }
        this.buttonStatus = true
        _this.$nextTick(() => {
          _this.$refs['dataForm'].clearValidate()
        })
      })
    },
    //  ====== 修改更新 ======
    updateData() {
      var _this = this
      _this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            'broadCastDetailList': [],
            'id': _this.queryId,
            'subType': _this.temp.subType,
            'templateName': _this.temp.templateName,
            'templateType': _this.temp.templateType
          }
          _this.temp.broadCastDetailList.forEach(element => {
            params.broadCastDetailList.push(
              {
                'content': element.content,
                'lineNo': element.lineNo,
                'textColor': element.textColor,
                'id': '',
                'templateId': '',
                'templateName': ''
              })
          })
          updateTemplateInfo(params).then(() => {
            _this.dialogFormVisible = false
            _this.dialogFormVideoVisible = false
            _this.$notify({
              title: '修改成功',
              message: '板卡内容信息修改成功',
              type: 'success',
              duration: 2000
            })
            _this.getList()
          })
        }
      })
    },
    //  ====== 刷新 ======
    refreshTemplate() {
      this.getList()
    },
    //  ====== 删除多个个模板 ======
    delSomeTemplate() {
      var params = this.delsId
      if (params.length <= 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定的删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSomeTemplate(params).then(() => {
          this.$notify({
            title: '删除',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {

      })
    },
    //  ====== 删除单个模板 ======
    handleDelete(row) {
      var params = row.id
      this.$confirm('确定的删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTemplate(params).then(() => {
          this.$notify({
            title: '删除',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {

      })
    }
  }
}
</script>
<style scoped>
.el-form-item {
  margin-right: 40px;
}
.table-control {
  float: right;
}
.table-control .el-form-item{
    margin-right: 0;
    margin-bottom: 10px;
}

.tips-info{
  font-size: 14px;
  color: red;
  line-height: 1.5em;
}
.tableCtr{
  padding: 11px 14px;
}
</style>
<style>
/* 弹窗样式修改 */
  .pop-module .el-dialog__body {
      padding: 5px 20px;
  }
  .pop-module .el-dialog__body .el-form{
      width: 100% !important;
      margin-left: 0 !important;
  }
  .pop-module .el-dialog__header {
    border-bottom: 1px solid #EBEEF5;
    padding: 15px;
  }
  .pop-module .el-dialog__headerbtn {
    top: 18px;
  }
  .pop-module .el-form-item__label {
    width: 110px !important;
  }
  .pop-module .el-form-item__content {
    margin-left: 110px !important;
  }
  .colorSelect .el-form-item__content{
    margin-left: 0 !important;
  }
  .colorSelect .el-form-item__content .el-input__inner,.colorSelect .el-form-item__content .el-select__caret{
    color: red;
  }
  .greenSty .el-input__inner,.greenSty .el-select__caret{
    color: green!important;
  }
  .redSty .el-input__inner,.redSty .el-select__caret{
    color: red!important;
  }
  .yelSty .el-input__inner,.yelSty .el-select__caret{
    color: #ffbc00!important;
  }
  /* 语音播报模板 */
  .templateType{
    width: 100%;
  }
</style>
