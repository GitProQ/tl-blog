<template>
  <div class="form-para">
    <el-form-item label="放映日期" prop="showtime">
      <el-date-picker
        v-model="params.showtime"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
    <el-form-item label="总集数" prop="total">
      <el-input-number v-model="params.total" controls-position="right" :min="0" />
    </el-form-item>
    <el-form-item label="进度" prop="current">
      <el-input-number v-model="params.current" controls-position="right" :min="0" :max="params.total" />
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="params.status" placeholder="请选择状态">
        <el-option label="未上映" :value="0" />
        <el-option label="连载中" :value="1" />
        <el-option label="已完结" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="推荐指数">
      <el-input-number v-model="params.ratings" controls-position="right" :min="5" :max="10" :step="0.1" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
