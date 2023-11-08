<template>
  <div :data-id="fc.property" @aasFormEvent="rerender">
    <div class="row align-items-center">
      <div
        class="col-12"
        :class="{ 'b-tab-block': fc.tab, 'col-lg-6': !fc.wide }"
      >
        <div v-if="fc.tab" class="b-tab" :class="`tab-${fc.tab}`">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path
              class="cls-1"
              d="M27,17.48l-7.42-3.72a.84.84,0,0,0-1.22.75v2.7H6.58V9.81a1,1,0,0,0-2,0v9.4H18.35v2.62a.84.84,0,0,0,1.22.75L27,18.86A.77.77,0,0,0,27,17.48Z"
            />
          </svg>
        </div>
        <div class="b-float-label-select-vc" :class="{ invalid: isInvalid }">
          <div
            class="b-float-label__big-label text-muted"
            v-if="fc.bigLabel"
            v-html="fc.label"
          ></div>
          <label class="active" v-else v-html="fc.label"></label>
          <v-select
            :searchable="false"
            :options="options"
            class="form-control-select"
            @input="onSelect()"
            v-model="selectedOption"
          ></v-select>
          <input
            type="hidden"
            :id="id"
            :name="name"
            :value="selectedOption.code"
            ref="hiddenInput"
            @click="click"
          />
        </div>
      </div>
      <hr
        class="hr--xs d-block d-lg-none w-100"
        v-if="fc.completeBlock || fc.wide"
      />
      <div
        class="col-lg-6 col-12 small"
        :class="{ 'b-tab-block': fc.tab }"
        v-if="fc.completeBlock || fc.wide"
      >
        <div
          v-if="fc.tab"
          class="b-tab d-block d-lg-none"
          :class="`tab-${fc.tab}`"
        ></div>
        <div
          v-if="fc.completeBlock && fc.completeBlock.comment"
          class="text-muted b-complete-comment"
          v-html="fc.completeBlock.comment"
        ></div>
      </div>
    </div>
    <hr class="hr--sl" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: this.fc.options || [
        {
          label: '',
          code: '',
        },
      ],
      selectedOption: this.fc.selected || this.fc.options[0],
      isInvalid: undefined,
    };
  },
  props: ['fc', 'blockIndex', 'multyProp', 'multyWord', 'itemIndex'],
  watch: {
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
      this.selectedOption = this.fc.selected;
      this.onSelect();
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
    click() {
      if (
        this.$refs.hiddenInput
          .closest('.b-float-label-select-vc')
          .className.includes('invalid')
      ) {
        this.isInvalid = true;
      }
    },
    onSelect() {
      //set select
      this.$store.commit('setControlValue', {
        blockIndex: this.blockIndex,
        multyProp: this.multyProp,
        itemIndex: this.itemIndex,
        property: this.fc.property,
        value: this.selectedOption,
      });
      this.validate();
      //autosave
      this.$store.dispatch('autosave');
      this.resetAutosaveTimeoutId();
      this.bitrixLogs(6, `${this.fc.label}:`);
    },
    validate() {
      this.isInvalid =
        this.fc.required && this.selectedOption.code === '' ? true : false;
    },
  },
};
</script>

<style>
.form-control-select .vs__dropdown-toggle {
  background-color: #f0f5fc;
  border: 0;
  border-radius: 3px;
}

.form-control-select .vs__search,
.form-control-select .vs__search:focus {
  height: 48px;
  margin: 0;
  padding: 0 15px;
  border: 0;
}

.form-control-select .vs__dropdown-toggle {
  padding: 0;
}

.form-control-select .vs__selected-options {
  padding: 0;
}

.form-control-select .vs__selected {
  position: absolute;
  pointer-events: none;
  margin: 0;
  padding: 0;
  border: 0;
  height: 48px;
  line-height: 48px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
  padding: 0 15px;
  z-index: 1;
}

.form-control-select input[type='search']:focus:not([readonly]) {
  border: 0 !important;
}

.form-control-select .vs__dropdown-menu {
  padding: 0;
  box-shadow: 0 5px 5px #eee;
  border: 0;
  border-radius: 0 0 5px 5px;
}

.form-control-select .vs__dropdown-option {
  line-height: 1.2;
  padding: 12px 15px;
  white-space: normal;
  color: #3b3b3b;
  margin: 0;
}

.form-control-select .vs__dropdown-option:hover {
  cursor: pointer;
}

.form-control-select .vs__dropdown-option--highlight {
  background: #f0f5fc;
  color: #5f7696;
}

.form-control-select .vs__clear {
  display: none !important;
}

.form-control-select input[type='search'] {
  width: 0;
}

.form-control-select .vs__open-indicator {
  fill: transparent;
  width: 16px;
  height: 16px;
  background: url('../assets/arrow-drop-down.svg') no-repeat center;
  background-size: cover;
}

.form-control-select .vs__actions {
  padding: 0 15px 0 3px;
}

.b-float-label-select-vc {
  position: relative;
  width: 100%;
}

.b-float-label-select-vc label {
  color: #2b2b2b;
  position: absolute;
  top: 0;
  left: 15px;
  font-size: 0.69rem;
  cursor: text;
  -webkit-transition: color 0.2s ease-out, -webkit-transform 0.2s ease-out;
  transition: color 0.2s ease-out, transform 0.2s ease-out;
  -webkit-transform-origin: 0% 100%;
  transform-origin: 0% 100%;
  text-align: initial;
  transform: translateY(1rem);
  -webkit-transform: translateY(1rem);
}

.b-float-label-select-vc label:not(.label-icon).active {
  transform: translateY(-22px);
  -webkit-transform: translateY(-22px);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
/*Invalid*/
.b-float-label-select-vc.invalid .form-control-select .vs__dropdown-toggle {
  background-color: #ffe5e5;
}
.b-float-label-select-vc.invalid .vs__selected {
  color: #ff0000;
}
</style>
