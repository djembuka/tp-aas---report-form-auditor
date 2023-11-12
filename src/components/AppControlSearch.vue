<template>
  <div class="search-input">
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
        <div
          class="b-float-label"
          :class="{ invalid: isInvalid }"
          @mouseover="hover = true"
          @mouseout="hover = false"
        >
          <div
            class="b-float-label__big-label text-muted"
            v-if="fc.bigLabel"
            v-html="fc.label"
          ></div>
          <input
            :data-pattern="fc.pattern"
            :data-required="fc.required"
            ref="input"
            :id="id"
            :name="name"
            type="text"
            autocomplete="off"
            v-model="controlValue"
            @input="inputControl"
            @focus="focusControl"
            @blur="blurControl"
            @keydown.enter.prevent="enterControl"
            @keydown.up.prevent="upArrow"
            @keydown.down.prevent="downArrow"
          />
          <label
            v-if="!fc.bigLabel"
            ref="label"
            :for="id"
            :class="{ active: isActive }"
            v-html="fc.label"
          ></label>

          <div
            class="b-input-clear"
            @click.prevent="clearControl()"
            v-show="isClearable"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <line class="cls-1" x1="7.51" y1="7.53" x2="24.47" y2="24.49" />
              <line class="cls-1" x1="24.47" y1="7.53" x2="7.48" y2="24.52" />
            </svg>
          </div>
          <div class="b-input-hint">
            <div
              v-for="(user, index) in users"
              :key="user.id"
              :data-id="user.id"
              :class="{ active: activeHint[index] }"
              class="b-input-hint__item"
              @click.prevent="clickHint(user.id)"
            >
              <div
                class="b-input-hint__img"
                :style="user.img"
                v-if="user.img"
              ></div>
              <a href="" class="b-input-hint__text"
                ><span v-html="user.title"></span><br />{{ user.text }}</a
              >
            </div>
          </div>
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
      memoryValue: this.fc.value,
      isActive: this.fc.value === '' ? false : true,
      isInvalid: undefined,
      count: this.fc.count || 1,
      //hints
      users: [],
      activeUser: {},
      activeHint: [],
      hover: false,
    };
  },
  props: ['fc', 'blockIndex', 'multyProp', 'multyWord', 'itemIndex'],
  computed: {
    isClearable() {
      return this.controlValue !== '' && this.hover ? true : false;
    },
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
  methods: {
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
      this.memoryValue = this.controlValue;
      this.isActive = true;
      this.validateControl();
      //if tel
      //autosave
      this.$store.dispatch('autosave');
      this.resetAutosaveTimeoutId();
      this.bitrixLogs(6, `${this.fc.label}: ${this.controlValue}`);
    },
    inputControl() {
      this.activeHint = [];
      this.activeUser = {};

      //validate
      if (this.controlValue) {
        this.isInvalid = false;
      }

      if (this.controlValue.length >= this.count) {
        (async () => {
          const amp = String(this.fc.url).search(/\?/) === -1 ? '?' : '&';
          let response = await fetch(
            `${this.fc.url}${amp}s=${this.controlValue}`,
            {
              headers: {
                Authentication: 'secret',
              },
            }
          );
          let result = await response.json();

          //change active hint array
          this.activeHint = result.map(() => null);

          //this.$store.commit( 'changeUsers', result );
          this.users = result;
        })();
      } else {
        this.users = [];
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
    upArrow() {
      let activeIndex = this.activeHint.indexOf(true);
      let arr = this.activeHint.map(() => null);
      if (activeIndex >= 0) {
        this.activeHint[activeIndex] = null;
      }
      if (--activeIndex < 0) {
        activeIndex = this.activeHint.length - 1;
      }
      arr[activeIndex] = true;
      //lightlight hint
      this.activeHint = arr;
      //set active user
      this.activeUser =
        this.users.find((user) => user.ORNZ === this.controlValue) || {};
    },
    downArrow() {
      let activeIndex = this.activeHint.indexOf(true);
      let arr = this.activeHint.map(() => null);
      if (activeIndex >= 0) {
        this.activeHint[activeIndex] = null;
      }
      if (++activeIndex > this.activeHint.length - 1) {
        activeIndex = 0;
      }
      arr[activeIndex] = true;
      //lightlight hint
      this.activeHint = arr;
      //set active user
      this.activeUser =
        this.users.find((user) => user.ORNZ === this.controlValue) || {};
    },
    blurControl() {
      this.fc.value = this.memoryValue;
      this.controlValue = this.memoryValue;
      //clear hint
      setTimeout(() => {
        this.isActive = this.controlValue !== '' ? true : false;
        this.validateControl();
        this.users = [];
      }, 200);
      //autosave
      this.$store.dispatch('autosave');
      this.resetAutosaveTimeoutId();
      this.bitrixLogs(6, `${this.fc.label}: ${this.controlValue}`);
    },
    clickHint(id) {
      this.activeUser = this.users.find((user) => user.id === id) || {};
      this.controlValue = this.activeUser.value || '';
      this.memoryValue = this.controlValue;
      this.users = [];
      this.validateControl();

      //autocomplete
      if (this.activeUser.autocomplete) {
        if (this.multyProp) {
          this.activeUser.autocomplete.forEach((c) => {
            const mb = this.$store.state.blocks[this.blockIndex].controls.find(
              (m) => m.property === this.multyProp
            );

            if (mb) {
              const control = mb.controls.find(
                (con) => String(con.property) === String(c.property)
              );
              if (control) {
                this.$store.commit('setControlValue', {
                  blockIndex: this.blockIndex,
                  multyProp: this.multyProp,
                  itemIndex: this.itemIndex,
                  property: c.property,
                  value: c.value,
                });
                const input = this.$refs.input
                  .closest('.b-add-fieldset-block__wrapper')
                  .querySelector(`[data-id="${c.property}"]`);
                if (input) {
                  input.dispatchEvent(new CustomEvent('aasFormEvent'));
                }
              }
            }
          });
        } else {
          this.activeUser.autocomplete.forEach((c) => {
            this.$store.state.blocks.forEach((block, blockIndex) => {
              const a = block.controls.find(
                (control) => String(control.property) === String(c.property)
              );
              if (a) {
                this.$store.commit('setControlValue', {
                  blockIndex: blockIndex,
                  property: c.property,
                  value: c.value,
                });
                setTimeout(() => {
                  console.log('setTimeout');
                  const input = document.querySelector(
                    `[data-id="${c.property}"]`
                  );
                  if (input) {
                    input.dispatchEvent(new CustomEvent('aasFormEvent'));
                  }
                }, 1000);
              }
            });
          });
        }
      }
    },
    enterControl() {
      //check if there is an active hint
      let activeIndex = this.activeHint.indexOf(true);
      if (activeIndex >= 0) {
        this.activeUser = this.users[activeIndex] || {};
      } else {
        //if not
        if (this.controlValue.match(/\d+/g)) {
          this.activeUser =
            this.users.find(
              (user) => user.ORNZ.search(this.controlValue) >= 0
            ) || {};
        } else {
          this.activeUser =
            this.users.find(
              (user) => user.FIO.search(this.controlValue) >= 0
            ) || {};
        }
      }
      this.controlValue = this.activeUser.ORNZ || this.memoryValue;
      this.memoryValue = this.controlValue;
      this.users = [];
      this.validateControl();
      //autosave
      this.$store.dispatch('autosave');
      this.resetAutosaveTimeoutId();
    },
    clearControl() {
      this.controlValue = '';
      this.memoryValue = this.controlValue;
      this.activeHint = [];
      this.activeUser = {};
      this.isActive = false;
      this.validateControl();
      //autosave
      this.$store.dispatch('autosave');
      this.resetAutosaveTimeoutId();
    },
    validateControl() {
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

<style>
.b-input-clear {
  position: absolute;
  top: calc(50% - 8px);
  right: 10px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  background: none;
  margin-top: 0;
  z-index: 1;
}
.b-input-clear svg {
  width: 16px;
  height: 16px;
  display: block;
}
.b-input-clear .cls-1 {
  fill: none;
  stroke: #999;
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke-width: 1.5px;
}
.b-input-hint__text {
  width: 100%;
}
.b-input-hint__img {
  flex-shrink: 0;
}
</style>
