<template>
  <div>
    <h4 class="title" style="margin-bottom: 10px">Duties by quantity</h4>

    <div style="margin-left: 10px" v-for="(catDuties, index) in dutiesByCategory" :key="index">
      <small
        ><strong>{{ catDuties[0] }}</strong></small
      >
      <div v-for="(duty, index) in catDuties[1]" :key="index" style="display: flex; align-items: center">
        <label :for="duty.name">
          <div style="position: relative">
            <span
              class="mdi mdi-information info-icon"
              :ref="
                (el) => {
                  infoIconRefs.push(el);
                }
              "
              @click="showDutyInfo = duty.name"
            >
            </span>
            <BaseTooltip :show="showDutyInfo === duty.name">
              <div class="item-info">
                {{ duty.description }} <br v-if="duty.description" />
                <div>
                  Allowed quantity pp: <strong>{{ duty.allowedQuantityPerPerson }} {{ duty.units.join("/") }}</strong>
                </div>
                <br />
                <div v-if="duty.dutyUptoPerUnit.length > 1">
                  Duty per excess unit up to: <br />
                  <div v-for="(item, index) in duty.dutyUptoPerUnit" :key="`${index}-${duty.name}-upto`">
                    <li v-if="item.upTo !== Infinity">
                      up to {{ item.upTo }} {{ duty.units.join("/") }}: <strong>{{ item.duty }} .-</strong>
                    </li>
                    <li v-else>
                      more than {{ duty.dutyUptoPerUnit[duty.dutyUptoPerUnit.length - 2].upTo }}
                      {{ duty.units.join("/") }}:
                      <strong>{{ duty.dutyUptoPerUnit[duty.dutyUptoPerUnit.length - 1].duty }}.-</strong>
                    </li>
                  </div>
                </div>
                <div v-else-if="duty.dutyUptoPerUnit.length === 1">
                  Duty per excess unit:
                  <strong>{{ duty.dutyUptoPerUnit[duty.dutyUptoPerUnit.length - 1].duty }}.-</strong>
                </div>
              </div>
            </BaseTooltip>
          </div>
          {{ duty.name }}</label
        >
        <div style="position: relative">
          <div class="unit">
            {{ duty.units.join("/") }}
          </div>
          <input @keyup="calculateDuty(($event.target as any).value, duty)" type="number" id="people" />
        </div>

        <span class="note-text">
          [ {{ dutiesByQuantity[duty.name] ? dutiesByQuantity[duty.name].duty.toFixed(2) : 0 || 0 }}.- ]
        </span>
        <br />
      </div>
    </div>

    <div class="results">
      <label class="semibold">Total quantity duty to pay:</label>
      <strong>{{ totalQuantityDuty.toFixed(2) }} .-</strong>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseTooltip from "@/components/shared/BaseTooltip.vue";
import DutyFreeAllowance from "@/models/DutyFreeAllowance";
import { computed, onBeforeMount, onUnmounted, reactive, ref, watch } from "vue";

import { dutyFreeAllowances } from "./DutyFreeAllowances";

const emit = defineEmits(["changeQuantityDuty"]);

const showDutyInfo = ref<string>("");

const infoIconRefs = ref<any[]>([]);

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
  let duty = 0;
  const excessQuantity = quantity - dutyItem.allowedQuantityPerPerson * props.numberOfPeople;

  if (excessQuantity > 0) {
    const sortedDutiesPerQuantity = dutyItem.dutyUptoPerUnit.sort((a, b) => a.upTo - b.upTo);
    for (let i = 0; i < sortedDutiesPerQuantity.length; i++) {
      const dutyUpTo = sortedDutiesPerQuantity[i];
      const previousUpTo = i > 0 ? sortedDutiesPerQuantity[i - 1].upTo : 0;

      if (excessQuantity <= dutyUpTo.upTo) {
        duty += (excessQuantity - previousUpTo) * dutyUpTo.duty;
        break;
      } else {
        duty += (dutyUpTo.upTo - previousUpTo) * dutyUpTo.duty;
      }
    }
  }

  dutiesByQuantity[dutyItem.name] = { duty: duty, quantity: quantity };
};

const closeInfo = (event: any) => {
  let clickOnInfoIcon = false;
  (infoIconRefs.value as HTMLElement[]).forEach((ref) => {
    if (ref && ref.contains(event.target as Node)) {
      clickOnInfoIcon = true;
    }
  });

  if (!clickOnInfoIcon) {
    showDutyInfo.value = "";
  }
};

onBeforeMount(() => {
  window.addEventListener("click", closeInfo);
});

onUnmounted(() => {
  window.removeEventListener("click", closeInfo);
});
</script>

<style scoped>
label {
  width: 250px;
  display: inline-flex;
}

.item-info {
  font-size: var(--small-font-size);
}

.unit {
  position: absolute;
  right: 19px;
  top: 5px;
  font-size: var(--small-font-size);
  color: #4a4a4a;
}

.results {
  background-color: rgb(181 222 222 / 17%);
  padding: 5px 10px;
  margin-top: 5px;
  width: 445px;
  border: 1px solid #e4e4e4;
}

.semibold {
  font-weight: 600;
}

.title {
  font-size: var(--x-large-font-size);
  width: fit-content;
  border-radius: 5px;
  padding: 2px 10px;
}

.note-text {
  font-size: var(--small-font-size);
  margin-left: 5px;
}

.info-icon {
  margin-right: 5px;
  font-size: var(--medium-font-size);
  cursor: pointer;
  opacity: 0.3;
}
</style>
