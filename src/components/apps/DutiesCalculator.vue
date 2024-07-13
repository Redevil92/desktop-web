<template>
  <div :style="`height: ${height - 4}px; width: calc(100% -4px); `" class="duties-calculator">
    <div style="margin-bottom: 30px">
      <div style="display: flex">
        <img :src="taxCalculatorIcon" style="height: 25px; margin-right: 10px" />
        <div>
          <h3>Duties calculator</h3>
          <small>
            <span>
              To have more information about the calculation click
              <a :href="linkMoreInformation" target="_blank">here</a>
            </span>
          </small>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 50px">
      <DutiesByPerson
        @changePersonDuty="dutiesByPerson = $event"
        @changeNumberOfPeople="numberOfPeople = $event"
      ></DutiesByPerson>
    </div>
    <DutiesByQuantity
      @changeQuantityDuty="dutiesByQuantity = $event"
      :numberOfPeople="numberOfPeople"
    ></DutiesByQuantity>

    <div class="total-duties">
      Total duties to pay:
      <strong style="margin-left: 10px"
        >{{ (dutiesByPerson + dutiesByQuantity).toFixed(2) }} .-</strong
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import ItemDialog from '@/models/ItemDialog'
import { PropType, ref } from 'vue'
import DutiesByPerson from './dutiesCalculator/DutiesByPerson.vue'
import DutiesByQuantity from './dutiesCalculator/DutiesByQuantity.vue'

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: { type: Number, required: true }
})

const taxCalculatorIcon = new URL('/src/assets/fileIcons/taxCalculator.svg', import.meta.url).href

const linkMoreInformation =
  'https://www.bazg.admin.ch/bazg/en/home/information-individuals/travel-and-purchases--allowances-and-duty-free-limit/importation-into-switzerland/duty-free-allowances--foodstuffs--alcohol-and-tobacco.html'

const numberOfPeople = ref(1)

const dutiesByPerson = ref(0)
const dutiesByQuantity = ref(0)
</script>

<style scoped>
.duties-calculator {
  background-color: white;
  padding-top: 20px;
  text-align: left;
  padding-left: 20px;
  border-radius: 10px;
  overflow-y: auto;
}

.total-duties {
  padding: 15px;
  margin-top: 25px;
  margin-bottom: 10px;
  font-size: var(--x-large-font-size);
  border: 1px solid #5d5d5d;
  width: fit-content;
}
</style>
