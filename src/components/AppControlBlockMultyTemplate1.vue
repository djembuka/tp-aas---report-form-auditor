<template>
  <div class="b-add-fieldset-block">
    <transition-group name="list" tag="div">
      <div
        class="b-add-fieldset-block__item"
        v-for="(item, itemIndex) in multy.items"
        :key="item.id"
      >
        <h4 v-if="multy.title">{{ getItemTitle(itemIndex) }}</h4>
        <hr v-if="multy.title" />
        <div class="b-add-fieldset-block__wrapper">
          <div class="row">
            <div class="col-lg-6">
              <component
                v-if="multy.controls[0]"
                :is="`app-control-${multy.controls[0].type}`"
                :fc="getFcObject(multy.controls[0], itemIndex, true)"
                :multyProp="multy.property"
                :multyWord="multy.word"
                :itemIndex="itemIndex"
                :blockIndex="blockIndex"
              ></component>
            </div>
            <div class="col-lg-3">
              <component
                v-if="multy.controls[1]"
                :is="`app-control-${multy.controls[1].type}`"
                :fc="getFcObject(multy.controls[1], itemIndex, true)"
                :multyProp="multy.property"
                :multyWord="multy.word"
                :itemIndex="itemIndex"
                :blockIndex="blockIndex"
              ></component>
            </div>
            <hr class="d-block w-100" style="margin: 0" />
            <div class="col-lg-6">
              <component
                v-if="multy.controls[2]"
                :is="`app-control-${multy.controls[2].type}`"
                :fc="getFcObject(multy.controls[2], itemIndex, true)"
                :multyProp="multy.property"
                :multyWord="multy.word"
                :itemIndex="itemIndex"
                :blockIndex="blockIndex"
              ></component>
            </div>
            <div class="col-lg-3">
              <component
                v-if="multy.controls[3]"
                :is="`app-control-${multy.controls[3].type}`"
                :fc="getFcObject(multy.controls[3], itemIndex, true)"
                :multyProp="multy.property"
                :multyWord="multy.word"
                :itemIndex="itemIndex"
                :blockIndex="blockIndex"
              ></component>
            </div>
            <hr class="d-block w-100" style="margin: 0" />
            <div class="col-lg-12">
              <component
                v-if="multy.controls[4]"
                :is="`app-control-${multy.controls[4].type}`"
                :fc="getFcObject(multy.controls[4], itemIndex)"
                :multyProp="multy.property"
                :multyWord="multy.word"
                :itemIndex="itemIndex"
                :blockIndex="blockIndex"
              ></component>
            </div>
            <div class="col-lg-12">
              <component
                v-if="multy.controls[5]"
                :is="`app-control-${multy.controls[5].type}`"
                :fc="getFcObject(multy.controls[5], itemIndex)"
                :multyProp="multy.property"
                :multyWord="multy.word"
                :itemIndex="itemIndex"
                :blockIndex="blockIndex"
              ></component>
            </div>
            <div class="col-lg-12">
              <component
                v-if="multy.controls[6]"
                :is="`app-control-${multy.controls[6].type}`"
                :fc="getFcObject(multy.controls[6], itemIndex)"
                :multyProp="multy.property"
                :multyWord="multy.word"
                :itemIndex="itemIndex"
                :blockIndex="blockIndex"
              ></component>
            </div>
          </div>
          <hr class="hr--xl hr--line" style="margin-top: 0" />
          <a class="btn-delete" href="" @click.prevent="remove(itemIndex)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <rect
                class="cls-1"
                x="0.01"
                y="-0.01"
                width="32"
                height="32"
                rx="10"
              />
              <path
                class="cls-2"
                d="M20.86,10.45H18.32V10A1.38,1.38,0,0,0,16.94,8.6H15.09A1.38,1.38,0,0,0,13.71,10v.46H11.17A1.15,1.15,0,0,0,10,11.6v.92a.47.47,0,0,0,.47.47H21.55a.46.46,0,0,0,.46-.47V11.6A1.14,1.14,0,0,0,20.86,10.45ZM14.63,10a.47.47,0,0,1,.46-.47h1.85a.47.47,0,0,1,.46.47v.46H14.63Z"
              />
              <path
                class="cls-2"
                d="M10.89,13.91a.14.14,0,0,0-.14.15l.38,8a1.38,1.38,0,0,0,1.38,1.32h7a1.38,1.38,0,0,0,1.38-1.32l.38-8a.14.14,0,0,0-.14-.15Zm7,1.15a.47.47,0,0,1,.46-.46.46.46,0,0,1,.46.46v6a.45.45,0,0,1-.46.46.46.46,0,0,1-.46-.46Zm-2.31,0a.47.47,0,0,1,.93,0v6a.47.47,0,0,1-.93,0Zm-2.3,0a.46.46,0,0,1,.46-.46.47.47,0,0,1,.46.46v6a.46.46,0,0,1-.46.46.45.45,0,0,1-.46-.46Z"
              />
            </svg>
          </a>
          <hr class="d-block d-xl-none" />
        </div>
      </div>
    </transition-group>
    <button
      class="btn btn-success btn-md"
      :disabled="isBtnDisabled"
      @click.prevent="add"
    >
      Добавить
    </button>
  </div>
</template>

<script>
import AppControlText from './AppControlText.vue';
import AppControlTextarea from './AppControlTextarea.vue';
import AppControlNum from './AppControlNum.vue';
import AppControlCheckbox from './AppControlCheckbox.vue';
import AppControlSelect from './AppControlSelect.vue';
import AppControlOrnz from './AppControlOrnz.vue';
import AppControlOrnzStrict from './AppControlOrnzStrict.vue';
import AppControlOrnzStrictAutocomplete from './AppControlOrnzStrictAutocomplete.vue';

export default {
  data() {
    return {};
  },
  props: {
    multy: Object,
    blockIndex: Number,
  },
  computed: {
    isBtnDisabled() {
      if (this.multy.count) {
        return this.multy.items.length >= this.multy.count;
      } else {
        return false;
      }
    },
  },
  methods: {
    getItemTitle(itemIndex) {
      return `${this.multy.title} ${itemIndex + 1}`;
    },
    getFcObject(fc, itemIndex, wide) {
      let fcObj = { ...fc };
      fcObj[fcObj.type === 'select' ? 'selected' : 'value'] =
        this.multy.items[itemIndex][fcObj.property];
      fcObj.wide = wide;
      return fcObj;
    },
    add() {
      this.$store.dispatch('multyBlockAddItem', {
        blockIndex: this.blockIndex,
        multyProp: this.multy.property,
      });
      this.$emit('autosave');
    },
    remove(itemIndex) {
      this.$store.commit('multyBlockRemoveItem', {
        blockIndex: this.blockIndex,
        multyProp: this.multy.property,
        itemIndex: itemIndex,
      });
      this.$emit('autosave');
    },
  },
  components: {
    AppControlText,
    AppControlTextarea,
    AppControlNum,
    AppControlCheckbox,
    AppControlSelect,
    AppControlOrnz,
    AppControlOrnzStrict,
    AppControlOrnzStrictAutocomplete,
  },
};
</script>

<style>
.b-add-fieldset-block__wrapper {
  position: relative;
}
.b-add-fieldset-block__wrapper .btn-delete {
  position: absolute;
  top: 7px;
  right: 0;
}
@media (max-width: 1199px) {
  .b-add-fieldset-block__wrapper .btn-delete {
    position: static;
    width: 100%;
    background-size: contain;
    background-color: #f00;
    border-radius: 10px;
    text-align: center;
  }
  .b-add-fieldset-block__wrapper .btn-delete svg {
    height: 100%;
  }
}

.b-add-fieldset-block__item.show {
  height: calc(481px + 20px);
}
@media (max-width: 1199px) {
  .b-add-fieldset-block__item.show {
    height: calc(820px + 0.5rem + 1px);
  }
}
.b-add-fieldset-block__item.height-auto {
  height: auto !important;
}
.b-add-fieldset-block__item.visible {
  opacity: 1;
}
.b-add-fieldset-block__item input:not([type='checkbox']),
.b-add-fieldset-block__item input:not([type='radio']),
.b-add-fieldset-block__item textarea,
.b-add-fieldset-block__item .ik_select_link_text {
  transition: background-color 1s ease;
  -webkit-transition: background-color 1s ease;
}
.b-add-fieldset-block__item label {
  transition: all 0.2s ease;
  -webkit-transition: all 0.2s ease;
}
.b-add-fieldset-block__item.new input:not([type='checkbox']),
.b-add-fieldset-block__item.new input:not([type='radio']),
.b-add-fieldset-block__item.new textarea,
.b-add-fieldset-block__item.new .ik_select_link_text {
  background-color: #e7f8e8;
}
.b-add-fieldset-block__item.new label {
  color: #74c37a;
}

/*Button SVG*/
.btn-delete .cls-1 {
  fill: #e03e41;
}
.btn-delete .cls-2 {
  fill: #fff;
}

/*transition-group*/
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.list-enter {
  opacity: 0;
  color: #74c37a;
}
.list-enter .b-float-label label,
.list-enter .b-float-label--file label a,
.list-enter .vs__selected,
.list-enter .b-float-label-select-vc label {
  color: #74c37a;
}
.list-enter .b-float-label input:not([type='checkbox']),
.list-enter .b-float-label input:not([type='radio']),
.list-enter .b-float-label textarea,
.list-enter .b-float-label--file label,
.list-enter .vs__dropdown-toggle,
.list-enter [type='checkbox'].filled-in:not(:checked) + span:after {
  background-color: #e7f8e8;
}
.list-enter .b-float-label--file .a {
  fill: #aedeb1;
}
.list-enter .b-float-label--file .b {
  fill: #87c38a;
}
.list-enter .b-float-label--file .c {
  fill: #d4f5d6;
}
.list-enter .b-float-label--file .d {
  fill: #fff;
}
.list-enter-to {
  opacity: 1;
  color: #2b2b2b;
}
.list-enter-to .b-float-label label,
.list-enter-to .vs__selected,
.list-enter-to .b-float-label-select-vc label {
  color: #2b2b2b;
}
.list-enter-to .b-float-label--file label a {
  color: #06417c;
}
.list-enter-to .b-float-label input:not([type='checkbox']),
.list-enter-to .b-float-label input:not([type='radio']),
.list-enter-to .b-float-label textarea,
.list-enter-to .b-float-label--file label,
.list-enter-to .vs__dropdown-toggle,
.list-enter-to [type='checkbox'].filled-in:not(:checked) + span:after {
  background-color: #f0f5fc;
}
.list-enter-to .b-float-label--file .a {
  fill: #c3cfdd;
}
.list-enter-to .b-float-label--file .b {
  fill: #a3b2c1;
}
.list-enter-to .b-float-label--file .c {
  fill: #d3e0ea;
}
.list-enter-to .b-float-label--file .d {
  fill: #fff;
}
/*.list-enter-active {
  transition: opacity .3s ease-in, color 5s linear;
}
.list-enter-active .b-float-label label,*/
.list-enter-active .b-float-label--file label a,
.list-enter-active .vs__selected,
.list-enter-active .b-float-label-select-vc label {
  transition: color 5s linear;
}
.list-enter-active .b-float-label input:not([type='checkbox']),
.list-enter-active .b-float-label input:not([type='radio']),
.list-enter-active .b-float-label textarea,
.list-enter-active .b-float-label--file label,
.list-enter-active .vs__dropdown-toggle,
.list-enter-active [type='checkbox'].filled-in:not(:checked) + span:after {
  transition: background-color 5s ease;
}
.list-enter-active .b-float-label--file .a,
.list-enter-active .b-float-label--file .b,
.list-enter-active .b-float-label--file .c,
.list-enter-active .b-float-label--file .d {
  transition: fill 5s ease;
}
.list-leave {
  opacity: 1;
  margin-top: 0;
}
.list-leave-to {
  opacity: 0;
  margin-top: -70px;
}
.list-leave-active {
  transition: all 0.3s linear;
}
</style>
