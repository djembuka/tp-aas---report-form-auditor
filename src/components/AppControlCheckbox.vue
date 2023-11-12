<template>
  <div :data-id="fc.property" @aasFormEvent="rerender">
    <div class="b-checkbox" :class="{ invalid: isInvalid }">
      <label>
        <input
          class="filled-in"
          type="checkbox"
          required=""
          :id="id"
          :name="name"
          :value="fc.value"
          :checked="fc.checked"
          v-model="checked"
        /><span v-html="fc.label"></span>
      </label>
    </div>
    <hr class="hr--sl" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: this.fc.checked,
      isInvalid: undefined,
    };
  },
  props: ['fc', 'blockIndex', 'multyProp', 'multyWord', 'itemIndex'],
  watch: {
    checked(val) {
      this.$store.commit('setControlValue', {
        blockIndex: this.blockIndex,
        multyProp: this.multyProp,
        itemIndex: this.itemIndex,
        property: this.fc.property,
        value: val,
      });
      this.validate();
      this.bitrixLogs(12, `${this.fc.label}: ${val}`);
    },
    isInvalid(val) {
      this.$store.commit('setControlValid', {
        blockIndex: this.blockIndex,
        multyProp: this.multyProp,
        itemIndex: this.itemIndex,
        property: this.fc.property,
        isInvalid: val,
      });
    },
  },
  computed: {
    id() {
      return this.multyWord !== undefined
        ? `${this.multyWord}_${this.multyProp}_${
            this.fc.word ? this.fc.word + '_' : ''
          }${this.fc.property}_${this.itemIndex}`
        : `${this.fc.word}_${this.fc.property}`;
    },
    name() {
      return this.multyWord !== undefined
        ? `${this.multyWord}[${this.multyProp}]${
            this.fc.word ? '[' + this.fc.word + ']' : ''
          }[${this.fc.property}][${this.itemIndex}]`
        : `${this.fc.word}[${this.fc.property}]`;
    },
  },
  methods: {
    rerender() {
      if (this.multyProp) {
        const multy = this.$store.state.blocks[this.blockIndex].controls.find(
          (m) => m.property === this.multyProp
        );
        const items = multy.items;
        const value = items[this.itemIndex][String(this.fc.property)];

        this.checked = value;
      } else {
        this.checked = this.fc.checked;
      }
    },
    bitrixLogs(id, message) {
      //AJAX Bitrix
      if (window.BX) {
        BX.ajax.post(
          '/local/ajax/logs.php',
          {
            id,
            el: this.$store.state.hidden[1].value,
            message,
            level: 1,
            object: 16,
          },
          (result) => {}
        );
      }
    },
    resetAutosaveTimeoutId() {
      clearTimeout(this.$store.state.autosave.timeoutId);
      const id = setTimeout(() => {
        this.$store.dispatch('autosave');
      }, this.$store.state.autosave.time);
      this.$store.commit('setAutosaveTimeoutId', id);
    },
    validate() {
      this.isInvalid = this.fc.required && !this.checked ? true : false;
      //autosave
      this.$store.dispatch('autosave');
      this.resetAutosaveTimeoutId();
    },
  },
};
</script>

<style scoped></style>
