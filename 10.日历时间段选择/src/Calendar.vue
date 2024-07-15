<template>
  <div class="calendar">
    <div class="month">
      <div class="month-tab">
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
    <div class="month-pop">
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
    <div class="week">
      <div v-for="(it, idx) in displayWeeks" :key="idx">
        <span>{{ it }}</span>
      </div>
    </div>
    <div class="date">
      <div
        v-for="(it, idx) in displayDays"
        :key="idx"
        :class="[...it.classes]"
        @click="handleSelectDate(it.origin)"
      >
        <span>{{ it.date }}</span>
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

const currentDate = Object.freeze(dayjs()); // 当前日期
const state = reactive({
  year: currentDate.year(),
  month: currentDate.month()
});
const { year, month } = toRefs(state);

let localSelect: Dayjs[] = []; // 选中的日期
if (props.modelValue.length) {
  localSelect = props.modelValue.map((it) => dayjs(it));
}
/* 比较两个日期的年月日是否相同 */
function isSame(d1: Dayjs, d2: Dayjs) {
  return dayjs(d1.format('YYYY-MM-DD')).isSame(d2.format('YYYY-MM-DD'));
}
function formatDayItem(day: Dayjs, _current_month: boolean, _select: Dayjs[]) {
  const _current_date = currentDate;
  const classes = [];
  let class1 = '';
  if (_select.length === 1) {
    const [first] = _select;
    if (isSame(first, day)) class1 = 'select-only';
  } else if (_select.length === 2) {
    const [first, second] = _select;
    if (isSame(first, day)) {
      class1 = 'select-prev';
    } else if (isSame(second, day)) {
      class1 = 'select-next';
    } else if (day.isBetween(first, second)) {
      class1 = 'select-between';
    }
  }
  classes.push(class1);
  if (isSame(day, _current_date)) classes.push('current-date');
  classes.push(_current_month ? 'current-month' : 'not-current-month');
  return {
    year: day.year(),
    month: day.month(),
    date: day.date(),
    origin: day,
    isCurrentMonth: _current_month,
    isCurrentDate: isSame(day, _current_date),
    classes
  };
}
// 更新要显示的天数
function updateDisplayDays(_month: number, _year?: number, _select: Dayjs[] = []) {
  const _current_date = currentDate;
  const y = _year || _current_date.year();
  // 月的第一天
  const firstDayOfMonth = _current_date.year(y).month(_month).date(1);
  // 日 一 二 三 四 五 六
  //    1
  const prevDays = firstDayOfMonth.day();
  const daysInMonth = firstDayOfMonth.daysInMonth();
  const nextDays = 42 - daysInMonth - prevDays;
  const prev = [];
  for (let i = prevDays; i > 0; i--) {
    const item = firstDayOfMonth.subtract(i, 'days');
    prev.push(formatDayItem(item, false, _select));
  }
  const cur = [];
  for (let i = 0; i < daysInMonth; i++) {
    const item = firstDayOfMonth.add(i, 'days');
    cur.push(formatDayItem(item, true, _select));
  }
  const lastDayOfMonth = firstDayOfMonth.date(daysInMonth);
  const next = [];
  for (let i = 1; i <= nextDays; i++) {
    const item = lastDayOfMonth.add(i, 'days');
    next.push(formatDayItem(item, false, _select));
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
const displayDays = ref(updateDisplayDays(month.value, year.value, localSelect));
watch(
  state,
  (newState) => {
    displayDays.value = updateDisplayDays(newState.month, newState.year, localSelect);
  },
  { deep: true }
);
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
}
function handleSelectYear(newYear: number) {
  year.value = newYear;
  cloneYear.value = newYear;
  prevCode.value = null;
}
function handleSelectDate(origin: Dayjs) {
  const day = toRaw(origin);
  const select = localSelect;
  if (select.length === 0) {
    localSelect.push(day);
  } else if (select.length === 1 && !isSame(select[0], day)) {
    // 0是否在it之后
    if (select[0].isAfter(day)) {
      localSelect.unshift(day);
    } else {
      localSelect.push(day);
    }
  } else {
    localSelect = [day];
  }
  displayDays.value = updateDisplayDays(month.value, year.value, localSelect);
  const result = localSelect.map((it: Dayjs) =>
    props.format ? it.format(props.format) : it.toDate()
  );
  emit('update:model-value', [...result]);
}

function handleChangeMonth(desc: 'add' | 'subtract') {
  const old = dayjs().year(year.value).month(month.value);
  const newDay = desc === 'add' ? old.add(1, 'month') : old.subtract(1, 'month');
  year.value = newDay.year();
  month.value = newDay.month();
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
.month {
  height: 100px;
  line-height: 100px;
  .month-tab {
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: $text-color2;
    font-size: 36px;
  }
  .m-item > div {
    cursor: pointer;
    &:hover {
      color: $primary;
    }
  }
  .left,
  .right {
    width: 90px;
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
.month-pop {
  position: absolute;
  top: 100px;
  color: $text-color1;
  background-color: $white;
  height: calc(100% - 100px);
  .pop-flex {
    display: flex;
    flex-wrap: wrap;
    & > span {
      flex: 1 1 50%;
      font-size: 42px;
      text-align: center;
      &:hover {
        color: $primary;
        cursor: pointer;
      }
    }
  }
}
.week,
.date {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: minmax(100px, auto);
  font-size: 32px;
  cursor: default;
  & > div {
    color: $text-color1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.date {
  cursor: pointer;
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
