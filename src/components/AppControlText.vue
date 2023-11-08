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
        <div class="b-float-label" :class="{ invalid: isInvalid }">
          <div
            class="b-float-label__big-label text-muted"
            v-if="fc.bigLabel"
            v-html="fc.label"
          ></div>
          <input
            :data-pattern="fc.pattern"
            :data-required="fc.required"
            :id="id"
            :name="name"
            ref="input"
            type="text"
            autocomplete="off"
            @focus="focusControl"
            @blur="blurControl"
            @input="inputControl"
            v-model="controlValue"
          />
          <label
            v-if="!fc.bigLabel"
            ref="label"
            :for="id"
            :class="{ active: isActive }"
            v-html="fc.label"
          ></label>
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
        <span
          class="text-muted"
          v-if="fc.completeBlock && fc.completeBlock.title"
          v-html="fc.completeBlock.title"
        ></span>
        <span v-if="fc.completeBlock && fc.completeBlock.title">
          <a
            v-if="fc.completeBlock.value"
            class="b-complete-link"
            ref="link"
            href=""
            @click.prevent="clickLink"
            >&nbsp;
            <span v-html="fc.completeBlock.value"></span>
            <span
              class="icon"
              style="background-image: url('/template/images/copy.svg')"
            ></span>
          </a>
          <span v-else class="text-muted">Пусто.</span>
        </span>
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
      controlValue: this.fc.value,
      isActive: !!this.fc.value,
      isInvalid: undefined,
    };
  },
  props: ['fc', 'blockIndex', 'multyProp', 'multyWord', 'itemIndex'],
  watch: {
    controlValue(val) {
      this.$store.commit('setControlValue', {
        blockIndex: this.blockIndex,
        multyProp: this.multyProp,
        itemIndex: this.itemIndex,
        property: this.fc.property,
        value: val,
      });
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
      this.controlValue = this.fc.value;
      this.isActive = !!this.fc.value;
      this.inputControl();
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
    clickLink() {
      this.controlValue = this.fc.completeBlock.value;
      this.isActive = true;
      this.validate();
      //autosave
      this.$store.dispatch('autosave');
      this.resetAutosaveTimeoutId();

      this.bitrixLogs(6, `${this.fc.label}: ${this.controlValue}`);
    },
    inputControl() {
      //validate
      if (this.controlValue) {
        this.isInvalid = false;
      }
      //restart autosave
      this.resetAutosaveTimeoutId();
    },
    focusControl() {
      if (
        this.$refs.input.closest('.b-float-label').className.includes('invalid')
      ) {
        this.isInvalid = true;
      }
    },
    blurControl() {
      this.isActive = this.controlValue !== '' ? true : false;
      this.validate();
      //autosave
      this.$store.dispatch('autosave');
      this.resetAutosaveTimeoutId();
      this.bitrixLogs(6, `${this.fc.label}: ${this.controlValue}`);
    },
    validate() {
      if (
        (this.fc.required && this.controlValue === '') ||
        (this.fc.pattern &&
          this.controlValue !== '' &&
          !new RegExp(this.fc.pattern, 'ig').test(this.controlValue))
      ) {
        this.isInvalid = true;
      } else {
        this.isInvalid = false;
      }
    },
  },
};
</script>

<style></style>
