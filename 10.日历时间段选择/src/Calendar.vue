<template>
  <div class="calendar">
    <!-- 月 -->
    <div class="calendar_m">
      <div class="m-tab">
        <div class="left m-item">
          <div v-if="showYear" @click="handleChangeYear('subtract')">&lt;&lt;</div>
          <div v-if="!showYear && !showMonth" @click="handleChangeMonth('subtract')">&lt;</div>
        </div>
        <div class="center m-item">
          <div @click="handleChangeState('m')">{{ displayMonths[month] }}</div>
          <div @click="handleChangeState('y')">{{ year }}</div>
        </div>
        <div class="right m-item">
          <div v-if="showYear" @click="handleChangeYear('add')">&gt;&gt;</div>
          <div v-if="!showYear && !showMonth" @click="handleChangeMonth('add')">&gt;</div>
        </div>
      </div>
    </div>
    <div class="calendar_pop">
      <div v-if="showMonth" class="pop-flex">
        <span v-for="(it, idx) in displayMonths" :key="idx" @click="handleSelectMonth(idx)">
          {{ it }}
        </span>
      </div>
      <div v-if="showYear" class="pop-flex">
        <span v-for="(it, idx) in displayYears" :key="idx" @click="handleSelectYear(it)">
          {{ it }}
        </span>
      </div>
    </div>
    <!-- 周 -->
    <div class="calendar_w">
      <div v-for="(it, idx) in displayWeeks" :key="idx" class="d-cell">
        <span>{{ it }}</span>
      </div>
    </div>
    <!-- 天 -->
    <div class="calendar_d">
      <div class="d-inner">
        <div
          class="d-cell"
          v-for="(it, idx) in displayDays"
          :key="idx"
          :class="[...it.classes]"
          @click="handleSelectDate(it.origin)"
        >
          <span>{{ it.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 日历
 */
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import isBetween from 'dayjs/plugin/isBetween';
import { ref, computed, reactive, toRefs, watch, toRaw } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: Date[] | string[];
    format?: string | null;
  }>(),
  {
    modelValue: () => [],
    format: null
  }
);
const emit = defineEmits<{
  (e: 'update:model-value', value: (Date | string)[]): void;
}>();

dayjs.locale('zh-cn');
dayjs.extend(isBetween);
defineOptions({ name: 'Calendar' });

// 字符串转换为 dayjs 对象
const localDays = computed(() => props.modelValue.map((it) => dayjs(it)));
/**
 * 当前日期显示
 * [日期1] 以"日期1"作为当前日期
 * [日期1, 日期2]: curIsFirst标记为ture 以"日期1"作为当前日期，false 则以"日期2"作为当前日期
 */
const curIsFirst = ref(true);// true 第一个 false 第二个

const currentDay = computed(() => {
  const _days = localDays.value;
  if (_days.length > 1) {
    return curIsFirst.value ? _days[0] : _days[_days.length - 1];
  } else if (_days.length > 0) {
    return _days[0];
  } else {
    return dayjs();
  }
});

const state = reactive({
  year: currentDay.value.year(),
  month: currentDay.value.month()
});
const { year, month } = toRefs(state);

/* 比较两个日期的年月日是否相同 */
function isSame(d1: Dayjs, d2: Dayjs) {
  return dayjs(d1.format('YYYY-MM-DD')).isSame(d2.format('YYYY-MM-DD'));
}
function formatDayItem(_day: Dayjs, _is_current_month: boolean, _select: Dayjs[]) {
  const _current_day = currentDay.value;
  const classes = [];
  let class1 = '';
  if (_select.length === 1) {
    const [first] = _select;
    if (isSame(first, _day)) class1 = 'select-only';
  } else if (_select.length === 2) {
    const [first, second] = _select;
    if (isSame(first, _day)) {
      class1 = 'select-prev';
    } else if (isSame(second, _day)) {
      class1 = 'select-next';
    } else if (_day.isBetween(first, second)) {
      class1 = 'select-between';
    }
  }
  classes.push(class1);
  if (isSame(_day, _current_day)) classes.push('current-date');
  classes.push(_is_current_month ? 'current-month' : 'not-current-month');
  return {
    year: _day.year(),
    month: _day.month(),
    date: _day.date(),
    origin: _day,
    isCurrentMonth: _is_current_month,
    isCurrentDate: isSame(_day, _current_day),
    classes
  };
}
/**
 * 更新要显示的天数
 * @param _month 显示的月份
 * @param _year  显示的年份
 * @param _select 显示用户选中的日期
 */
function updateDisplayDays(_year: number, _month: number, _select: Dayjs[] = []) {
  // 月的第一天
  const firstDayOfMonth = dayjs().year(_year).month(_month).date(1);
  // 日 一 二 三 四 五 六
  //    1
  const prevDays = firstDayOfMonth.day();
  const daysInMonth = firstDayOfMonth.daysInMonth();
  const nextDays = 42 - daysInMonth - prevDays;
  const prev = [];
  for (let i = prevDays; i > 0; i--) {
    const day = firstDayOfMonth.subtract(i, 'days');
    prev.push(formatDayItem(day, false, _select));
  }
  const cur = [];
  for (let i = 0; i < daysInMonth; i++) {
    const day = firstDayOfMonth.add(i, 'days');
    cur.push(formatDayItem(day, true, _select));
  }
  const lastDayOfMonth = firstDayOfMonth.date(daysInMonth);
  const next = [];
  for (let i = 1; i <= nextDays; i++) {
    const day = lastDayOfMonth.add(i, 'days');
    next.push(formatDayItem(day, false, _select));
  }
  return [...prev, ...cur, ...next];
}
// 更新要显示的年数
function updateDisplayYear(_year: number) {
  const result = [];
  const y = dayjs().year(_year);
  for (let i = 0; i < 12; i++) {
    result.push(y.add(i, 'year').year());
  }
  return result;
}
const displayDays = ref(updateDisplayDays(currentDay.value.year(), currentDay.value.month(), localDays.value));
watch(() => localDays.value, (newDays) => {
  if (newDays.length) {
    const _year = currentDay.value.year();
    const _month = currentDay.value.month();
    year.value = _year; // 同步更新面板显示的年、月
    month.value = _month;
    displayDays.value = updateDisplayDays(_year, _month, newDays);
  } else {
    console.error(`localDays 等于 ${JSON.stringify(newDays)}`)
  }
});

const cloneYear = ref(year.value); // 用于锚定year
const displayYears = computed(() => updateDisplayYear(cloneYear.value));
const displayMonths = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
];
const displayWeeks = ['日', '一', '二', '三', '四', '五', '六'];
/* 控制月、年选择框 */
const prevCode = ref<'y' | 'm' | null>(null);
const showMonth = computed(() => prevCode.value === 'm');
const showYear = computed(() => prevCode.value === 'y');
function handleChangeState(newState: 'y' | 'm') {
  const oldState = prevCode.value;
  if (oldState === null) {
    prevCode.value = newState;
  } else {
    prevCode.value = oldState === newState ? null : newState;
  }
}
function handleSelectMonth(newMonth: number) {
  month.value = newMonth;
  prevCode.value = null;
  displayDays.value = updateDisplayDays(year.value, month.value, localDays.value);
}
function handleSelectYear(newYear: number) {
  year.value = newYear;
  cloneYear.value = newYear;
  prevCode.value = null;
  displayDays.value = updateDisplayDays(year.value, month.value, localDays.value);
}
function handleSelectDate(origin: Dayjs) {
  const day = toRaw(origin);
  let select = toRaw(localDays.value);
  if (select.length === 0) {
    select.push(day);
  } else if (select.length === 1 && !isSame(select[0], day)) {
    // 0是否在it之后
    if (select[0].isAfter(day)) {
      // 当前选中的值在前
      select.unshift(day);
      curIsFirst.value = true;
    } else {
      // 当前选中的值在后
      select.push(day);
      curIsFirst.value = false;
    }
  } else {
    select = [day];
  }
  const result = select.map((it: Dayjs) =>
    props.format ? it.format(props.format) : it.toDate()
  );
  emit('update:model-value', [...result]);
}

function handleChangeMonth(desc: 'add' | 'subtract') {
  const old = dayjs().year(year.value).month(month.value);
  const newDay = desc === 'add' ? old.add(1, 'month') : old.subtract(1, 'month');
  year.value = newDay.year();
  month.value = newDay.month();
  displayDays.value = updateDisplayDays(year.value, month.value, localDays.value);
}
function handleChangeYear(desc: 'add' | 'subtract') {
  const old = dayjs().year(cloneYear.value);
  const newDay = desc === 'add' ? old.add(12, 'year') : old.subtract(12, 'year');
  cloneYear.value = newDay.year();
}
</script>
<style lang="scss" scoped>
$primary: #409eff;
$text-color1: #303133;
$text-color2: #606266;
$text-color3: #a8abb2;
$white: #fff;
$between-bg: #f2f6fc;
.calendar {
  background-color: $white;
  position: relative;
}
.calendar_m {
  .m-tab {
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: $text-color2;
    font-size: 24px;
    padding: 10px 0;
  }
  .m-item > div {
    cursor: pointer;
    &:hover {
      color: $primary;
    }
  }
  .left,
  .right {
    text-align: center;
  }
  .center {
    display: flex;
    font-weight: bold;
    & > div {
      margin: 0 20px;
    }
  }
}
.calendar_pop {
  position: absolute;
  top: 100px;
  color: $text-color1;
  background-color: $white;
  height: calc(100% - 100px);
  z-index: 11;
  .pop-flex {
    display: flex;
    flex-wrap: wrap;
    & > span {
      flex: 1 1 50%;
      font-size: 24px;
      text-align: center;
      &:hover {
        color: $primary;
        cursor: pointer;
      }
    }
  }
}
.calendar_w,
.calendar_d {
  .d-cell {
    color: $text-color1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.calendar_w {
  cursor: default;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 100%;
  padding-bottom: 10px;
}
.calendar_d {
  position: relative;
  width: 100%;
  padding-top: 100%;
  z-index: 10;
  .d-inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(7, 1fr);
    font-size: 24px;
    cursor: pointer;
  }
  .current-month {
    color: $text-color2;
    &:not(.select-only, .select-prev, .select-next):hover {
      color: $primary;
    }
  }
  .not-current-month {
    color: $text-color3;
  }
  .current-date {
    color: $primary;
  }
  .select-only {
    background-color: $primary;
    color: $white;
    border-radius: 999px;
  }
  .select-prev {
    background-color: $primary;
    color: $white;
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
  }
  .select-next {
    background-color: $primary;
    color: $white;
    border-top-right-radius: 999px;
    border-bottom-right-radius: 999px;
  }
  .select-between {
    background-color: $between-bg;
  }
}
</style>
