<template>
  <fieldset :class="{ invalid: isInvalid }">
    <legend v-if="block.title">
      <span>{{ block.title }}</span>
      <i class="text-danger" v-if="isInvalid">Не заполнены обязательные поля</i>
    </legend>
    <div v-for="fc in block.controls" :key="fc.property || fc.id">
      <component
        v-if="fc.type === 'multyblock'"
        :is="`app-control-block-multy${
          fc.template ? '-template' + fc.template : ''
        }`"
        :multy="fc"
        :blockIndex="blockIndex"
      ></component>
      <component
        v-else
        :is="`app-control-${fc.type}`"
        :fc="fc"
        :blockIndex="blockIndex"
      ></component>
    </div>
  </fieldset>
</template>

<script>
import AppControlText from './AppControlText.vue';
import AppControlRubles from './AppControlRubles.vue';
import AppControlCheckbox from './AppControlCheckbox.vue';
import AppControlSelect from './AppControlSelect.vue';
import AppControlOrnz from './AppControlOrnz.vue';
import AppControlOrnzStrict from './AppControlOrnzStrict.vue';
import AppControlBlockMulty from './AppControlBlockMulty.vue';
import AppControlBlockMultyTemplate1 from './AppControlBlockMultyTemplate1.vue';

export default {
  data() {
    return {
      controlProperties: [],
    };
  },
  props: {
    block: Object,
    blockIndex: Number,
  },
  computed: {
    isInvalid() {
      /*return this.controlProperties.some(
        (prop) => !this.$store.state.submitMap[prop]
      );*/
      return false;
    },
  },
  methods: {},
  mounted() {
    this.block.controls.forEach((control) => {
      if (control.type !== 'multyblock') {
        this.controlProperties.push(control.property);
      }
    });
  },
  components: {
    AppControlText,
    AppControlRubles,
    AppControlCheckbox,
    AppControlSelect,
    AppControlOrnz,
    AppControlOrnzStrict,
    AppControlBlockMulty,
    AppControlBlockMultyTemplate1,
  },
};
</script>

<style scoped>
fieldset {
  border: 0;
  padding: 35px 0 0;
  margin: 0;
}
legend {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: Roboto, sans-serif;
  padding: 25px 0;
}
legend span {
  display: inline-block;
  margin-right: 50px;
}
legend i {
  display: inline-block;
  font-size: 0.88rem;
  font-weight: normal;
  font-style: normal;
}
fieldset.invalid {
  border-bottom: 1px solid #f00;
}
</style>
