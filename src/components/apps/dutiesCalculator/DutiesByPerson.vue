<template>
  <h4 class="title" style="margin-bottom: 10px">Duties by person</h4>
  <div style="margin-left: 10px">
    <label for="people">
      <span class="mdi mdi-account-group label-icon"></span>
      People number:</label
    >
    <input
      type="number"
      @keyup="changeNumberOfPeople(numberOfPeople)"
      id="people"
      default="1"
      min="1"
      v-model="numberOfPeople"
    />
    <br />
    <label for="total-value"> <span class="mdi mdi-hospital-box label-icon"></span>Goods total value (CHF):</label>
    <input
      type="number"
      @keyup="
        ($event) => {
          changeTotalGoodsCHF();
          changeTotalGoodsHandler($event);
        }
      "
      id="total-value"
      v-model="totalGoodsValueCHF"
    />

    <div style="position: relative">
      <label for="total-value-eur"><span class="mdi mdi-currency-eur label-icon"></span>Goods total value (EUR):</label>
      <input type="number" id="total-value-eur" @keyup="changeTotalGoodsEUR" v-model="totalGoodsValueEUR" />
      <span class="exchange-rate">
        [ Exchange rate: {{ exchangeRate }} ]
        <span class="mdi mdi-pencil edit-icon" @click="showEditExchangeRate = !showEditExchangeRate"></span
      ></span>

      <div class="absolute-pos-dialog" v-if="showEditExchangeRate">
        <label for="exchange-rate">Exchange rate:</label>
        <br />
        <input type="number" id="exchange-rate" @keyup="changeTotalGoodsCHF" v-model="exchangeRate" />
      </div>
    </div>

    <!-- <br />
        <div style="margin-left: 30px; font-size: 12px; margin-top: 5px">
          <label for="total-value-eur">VAT 7.7% :</label>
          <input type="number" id="total-value-eur" v-model="goodsWith7VAT" />
          <br />
          <label for="total-value-eur" style="margin-top: 5px">VAT 2.5% :</label>
          <input type="number" id="total-value-eur" v-model="goodsWith2VAT" />
        </div> -->
  </div>

  <div class="results">
    <small><label class="semibold">Amount to tax:</label> {{ amountToTax }} .-</small>
    <br />
    <hr style="margin: 5px 0px" />
    <label class="semibold">Tax to pay:</label> <strong>{{ taxToPay }} .-</strong>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

const emit = defineEmits(["changeNumberOfPeople", "changePersonDuty"]);

const numberOfPeople = ref(1);
const totalGoodsValueCHF = ref(0);
const totalGoodsValueEUR = ref(0);

const showEditExchangeRate = ref<boolean>(false);

const exchangeRate = ref(1.0);

// const goodsWith7VAT = ref(0);
// const goodsWith2VAT = ref(0);

const amountToTax = ref(0);

watch(
  () => amountToTax.value,
  () => {
    emit("changePersonDuty", taxToPay);
  }
);

const taxToPay = computed(() => {
  return amountToTax.value * 0.077;
});

const changeTotalGoodsHandler = (_: any) => {
  calculateDuties();

  //goodsWith7VAT.value = amountToTax.value;
};

const changeNumberOfPeople = (peopleNumber: number) => {
  emit("changeNumberOfPeople", peopleNumber);
  calculateDuties();
};

const changeTotalGoodsEUR = () => {
  totalGoodsValueCHF.value = totalGoodsValueEUR.value / exchangeRate.value;
  calculateDuties();
};

const changeTotalGoodsCHF = () => {
  totalGoodsValueEUR.value = totalGoodsValueCHF.value * exchangeRate.value;
};

const calculateDuties = () => {
  let toTax = totalGoodsValueCHF.value - 300 * numberOfPeople.value;
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

.absolute-pos-dialog {
  position: absolute;
  top: 20;
  left: 333px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px;
  border-radius: 5px;
  z-index: 1;
  padding: 10px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  width: 200px;
}
</style>
