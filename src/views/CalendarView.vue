<template>
  <div class="calendar-view-box">
    <div class="form-box">
      <div class="page-title">配置项：</div>
      <el-form :model="form" label-width="auto">
        <el-form-item label="年份">
          <el-input-number v-model="form.year" :min="1980" placeholder="年份" />
        </el-form-item>
        <el-form-item label="最少几周">
          <el-input-number v-model="form.minWeek" :min="0" :max="10" placeholder="最少几周" />
        </el-form-item>
        <el-form-item label="从周几开始">
          <el-select v-model="form.weekStart" placeholder="从周几开始">
            <el-option
              v-for="item in weekNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="月格式">
          <el-select v-model="form.monthFormat" clearable placeholder="月格式">
            <el-option v-for="item in monthFormatList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="天格式">
          <el-select v-model="form.dateFormat" clearable placeholder="天格式">
            <el-option v-for="item in dateFormatList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="component-box">
      <div class="page-title">展示：</div>
      <CalendarYear
        :year="form.year"
        :min-week="form.minWeek"
        :week-start="form.weekStart"
        :month-format="form.monthFormat"
        :date-format="form.dateFormat"
        @increase-year="increaseYear"
        @reduce-year="reduceYear"
        @to-now-year="toNowYear"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarYear from '@/components/Calendar/CalendarYear.vue'
import { ref } from 'vue'
import dayjs from 'dayjs'

const form = ref({
  year: dayjs().year(),
  minWeek: 0,
  weekStart: 1,
  monthFormat: 'YYYY-MM',
  dateFormat: 'DD'
})

const weekNames = ref([
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 0 }
])
const monthFormatList = ref(['YYYY-MM', 'MM', 'M', 'MM月'])
const dateFormatList = ref(['YYYY-MM-DD', 'MM-DD', 'DD', 'D'])

function reduceYear() {
  form.value.year = form.value.year - 1
}
function increaseYear() {
  form.value.year = form.value.year + 1
}
function toNowYear() {
  form.value.year = dayjs().year()
}
</script>

<style lang="scss" scoped>
.calendar-view-box {
  padding: 12px;
  display: flex;
  align-items: flex-start;
  .form-box {
    flex: 0 0 400px;
    margin-right: 12px;
  }
  .component-box {
    flex: auto;
    padding-left: 12px;
    border-left: 1px solid var(--el-border-color);
  }
  .page-title {
    font-weight: 700;
    line-height: 40px;
  }
}
</style>
