<template>
  <div>
    <h4 class="title" style="margin-bottom: 10px">Duties by quantity</h4>

    <div style="margin-left: 10px" v-for="(catDuties, index) in dutiesByCategory" :key="index">
      <small
        ><strong>{{ catDuties[0] }}</strong></small
      >
      <div v-for="(duty, index) in catDuties[1]" :key="index" style="display: flex; align-items: center">
        <label :for="duty.name">{{ duty.name }}</label>
        <div style="position: relative">
          <div class="unit">
            {{ duty.units.join("/") }}
          </div>
          <input @keyup="calculateDuty(($event.target as any).value, duty)" type="number" id="people" />
        </div>

        <span class="note-text">
          [ {{ dutiesByQuantity[duty.name] ? dutiesByQuantity[duty.name].duty : 0 || 0 }}.- ]
        </span>
        <br />
      </div>
    </div>

    <div class="results">
      <label class="semibold">Total quantity duty to pay:</label>
      <strong>{{ totalQuantityDuty }} .-</strong>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DutyFreeAllowance from "@/models/DutyFreeAllowance";
import { computed, reactive, watch } from "vue";

import { dutyFreeAllowances } from "./DutyFreeAllowances";

const emit = defineEmits(["changeQuantityDuty"]);

const props = defineProps<{
  numberOfPeople: number;
}>();

const dutiesByQuantity = reactive<{
  [key: string]: { duty: number; quantity: number };
}>({});

const totalQuantityDuty = computed(() => {
  return Object.values(dutiesByQuantity).reduce((acc, curr) => acc + curr.duty, 0);
});

const dutiesByCategory = computed(() => {
  const result: { [key: string]: DutyFreeAllowance[] } = {};
  dutyFreeAllowances.forEach((duty) => {
    if (result[duty.category]) {
      result[duty.category].push(duty);
    } else {
      result[duty.category] = [duty];
    }
  });

  return Object.entries(result);
});

watch(
  () => totalQuantityDuty.value,
  () => {
    emit("changeQuantityDuty", totalQuantityDuty.value);
  }
);

watch(
  () => props.numberOfPeople,
  () => {
    updateQuantityDuty();
  }
);

const updateQuantityDuty = () => {
  Object.entries(dutiesByQuantity).forEach((dutyItem) => {
    const dutyObject = dutyFreeAllowances.find((duty) => duty.name === dutyItem[0]);
    if (dutyObject) {
      calculateDuty(dutyItem[1].quantity, dutyObject);
    }
  });
};

const calculateDuty = (quantity: number, dutyItem: DutyFreeAllowance) => {
  let dutyUptoPerUnit = null;
  if (dutyItem.dutyUptoPerUnit) {
    dutyItem.dutyUptoPerUnit.forEach((dutyUpto) => {
      if (quantity <= dutyUpto.upTo) {
        dutyUptoPerUnit = dutyUpto.duty;
      }
    });
  }
  if (!dutyUptoPerUnit) {
    dutyUptoPerUnit = dutyItem.dutyPerUnit;
  }

  const dutyForItem =
    quantity > dutyItem.allowedQuantityPerPerson * props.numberOfPeople
      ? (quantity - props.numberOfPeople * dutyItem.allowedQuantityPerPerson) * dutyUptoPerUnit
      : 0;
  dutiesByQuantity[dutyItem.name] = { duty: dutyForItem, quantity: quantity };
};
</script>

<style scoped>
label {
  width: 250px;
  display: inline-flex;
}

.unit {
  position: absolute;
  right: 19px;
  top: 5px;
  font-size: var(--small-font-size);
  color: #4a4a4a;
}

.results {
  border-radius: 10px;
  background-color: rgba(79, 219, 219, 0.171);
  padding: 5px 10px;
  margin-top: 5px;
  width: 415px;
}

.semibold {
  font-weight: 600;
}

.title {
  font-size: var(--large-font-size);
  background-color: rgba(255, 0, 0, 0.083);
  width: fit-content;
  border-radius: 5px;
  padding: 2px 10px;
}

.note-text {
  font-size: var(--small-font-size);
  margin-left: 5px;
}
</style>
