<template>
  <h4 class="title" style="margin-bottom: 10px">Duties by person</h4>
  <div style="margin-left: 10px">
    <label for="people">
      <span class="mdi mdi-account-group label-icon"></span>
      People number:</label
    >
    <input
      type="number"
      @keyup="changeNumberOfPeople"
      id="people"
      default="1"
      min="1"
      required
      @blur="
        () => {
          if (!numberOfPeople) {
            numberOfPeople = 1;
          }
        }
      "
      v-model="numberOfPeople"
    />
    <br />
    <label for="total-value"> <span class="mdi mdi-hospital-box label-icon"></span>Goods total value (CHF):</label>
    <input type="number" @keyup="changeTotalGoodsCHF" id="total-value" v-model="totalGoodsValueCHF" />

    <div style="position: relative">
      <label for="total-value-eur"><span class="mdi mdi-currency-eur label-icon"></span>Goods total value (EUR):</label>
      <input type="number" id="total-value-eur" @keyup="changeTotalGoodsEUR" v-model="totalGoodsValueEUR" />
      <span class="exchange-rate">
        [ Exchange rate: {{ exchangeRate }} ]
        <span class="mdi mdi-pencil edit-icon" @click="showEditExchangeRate = !showEditExchangeRate"></span
      ></span>

      <BaseTooltip :show="showEditExchangeRate" :left="333">
        <span class="mdi mdi-close close-icon" @click="showEditExchangeRate = false"></span>
        <label for="exchange-rate">Exchange rate:</label>
        <br />
        <input type="number" id="exchange-rate" @keyup="changeTotalGoodsCHF" v-model="exchangeRate" />
      </BaseTooltip>
    </div>
    <hr style="margin: 5px 0px" />
    <div>
      <div>
        <label for="total-value">Goods with VAT 7.7%:</label>
        <input
          type="number"
          @keyup="
            () => {
              if (amountToTax_7 <= totalGoodsValueCHF) {
                amountToTax_2 = totalGoodsValueCHF - amountToTax_7;
              } else {
                amountToTax_7 = totalGoodsValueCHF;
                amountToTax_2 = 0;
              }
            }
          "
          id="total-value"
          v-model="amountToTax_7"
        />
      </div>
      <div>
        <label for="total-value">Goods with VAT 2.5%:</label>
        <input
          type="number"
          @keyup="
            () => {
              if (amountToTax_2 <= totalGoodsValueCHF) {
                amountToTax_7 = totalGoodsValueCHF - amountToTax_2;
              } else {
                amountToTax_2 = totalGoodsValueCHF;
                amountToTax_7 = 0;
              }
            }
          "
          id="total-value"
          v-model="amountToTax_2"
        />
      </div>
    </div>
  </div>

  <div class="results">
    <small><label class="semibold">Amount to tax:</label> {{ amountToTax.toFixed(2) }} .-</small>
    <br />
    <hr style="margin: 5px 0px" />
    <label class="semibold">Tax to pay:</label> <strong>{{ taxToPay.toFixed(2) }} .-</strong>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import BaseTooltip from "@/components/shared/BaseTooltip.vue";
import { VAT_RATE_2, VAT_RATE_7 } from "./constants";

const emit = defineEmits(["changeNumberOfPeople", "changePersonDuty"]);

const numberOfPeople = ref<number | undefined>(1);
const totalGoodsValueCHF = ref(0);
const totalGoodsValueEUR = ref(0);

const showEditExchangeRate = ref<boolean>(false);

const exchangeRate = ref(1.0);

const amountToTax = ref(0);
const amountToTax_2 = ref(0);
const amountToTax_7 = ref(0);

const taxToPay = computed(() => {
  if (amountToTax.value === 0) {
    return 0;
  }
  return amountToTax_2.value * VAT_RATE_2 + amountToTax_7.value * VAT_RATE_7;
});

watch(
  () => taxToPay.value,
  () => {
    emit("changePersonDuty", taxToPay.value);
  }
);

const changeNumberOfPeople = () => {
  emit("changeNumberOfPeople", numberOfPeople.value || 1);
  calculateDuties();
};

const changeTotalGoodsEUR = () => {
  totalGoodsValueCHF.value = totalGoodsValueEUR.value / exchangeRate.value;
  amountToTax_7.value = totalGoodsValueCHF.value;
  amountToTax_2.value = 0;
  calculateDuties();
};

const changeTotalGoodsCHF = () => {
  totalGoodsValueEUR.value = totalGoodsValueCHF.value * exchangeRate.value;
  amountToTax_7.value = totalGoodsValueCHF.value;
  amountToTax_2.value = 0;
  calculateDuties();
};

const calculateDuties = () => {
  let toTax = (totalGoodsValueCHF.value || 0) - 300 * (numberOfPeople.value || 1);
  if (toTax > 0) {
    toTax += 300;
  }
  if (toTax > 0) {
    amountToTax.value = toTax;
    return;
  }
  amountToTax.value = 0;
};

enum Currencies {
  EUR = "EUR",
  CHF = "CHF",
}
</script>

<style scoped>
label {
  width: 250px;
  display: inline-flex;
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

.label-icon {
  margin-right: 5px;
}

.exchange-rate {
  font-size: var(--small-font-size);
  opacity: 0.9;
  margin-left: 5px;
}

.edit-icon {
  padding: 2px;
  height: 15px;
  width: 15px;
  background-color: rgb(237, 237, 237);
  border-radius: 5px;
}

.edit-icon:hover {
  background-color: rgb(207, 207, 207);
  cursor: pointer;
}

.close-icon {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0px;
  padding: 2px;
}
</style>
