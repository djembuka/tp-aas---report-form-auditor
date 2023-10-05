<template>
  <div class="b-collapse-vc" :class="{ slide: block.open, invalid: isInvalid }">
    <div class="b-collapse-vc__head" @click.stop.prevent="toggleBody()">
      <a href="" @click.prevent>
        <i class="b-collapse-vc__title">{{ block.title }}</i>
        <i class="b-collapse-vc__danger text-danger" v-if="isInvalid"
          >Не заполнены обязательные поля</i
        >
      </a>
      <span></span>
    </div>
    <transition @enter="enter" @leave="leave" :css="false">
      <div class="b-collapse-vc__body" v-show="block.open">
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
      </div>
    </transition>
  </div>
</template>

<script>
import AppControlText from './AppControlText.vue';
import AppControlNum from './AppControlNum.vue';
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
  methods: {
    enter: function (el) {
      let velocity = window.Velocity || jQuery.Velocity;
      if (!velocity) return;

      velocity(el, 'slideDown', {
        easing: 'ease',
        duration: 500,
      });
    },
    leave: function (el) {
      let velocity = window.Velocity || jQuery.Velocity;
      if (!velocity) return;

      velocity(el, 'slideUp', {
        easing: 'ease',
        duration: 500,
      });
    },
    toggleBody() {
      //set slide class for the main div
      //set to local storage
      //set to vuex
      this.$store.commit('setBlockOpen', {
        blockIndex: this.blockIndex,
        open: !this.block.open,
      });
    },
  },
  mounted() {
    this.block.controls.forEach((control) => {
      if (control.type !== 'multyblock') {
        this.controlProperties.push(control.property);
      }
    });
  },
  components: {
    AppControlText,
    AppControlNum,
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
.b-collapse-vc {
  display: block;
  border-bottom: 1px solid #f2f2f2;
}
.b-collapse-vc__head {
  font-size: 1.5rem;
  font-weight: bold;
  font-family: Roboto, sans-serif;
  line-height: 1.2;
  padding: 25px 0;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.b-collapse-vc__head a {
  width: calc(100% - 32px - 15px);
  display: flex;
  justify-content: space-between;
}
.b-collapse-vc.slide .b-collapse-vc__head a,
.b-collapse-vc.slide .b-collapse-vc__head a:hover,
.b-collapse-vc.slide .b-collapse-vc__head a:focus,
.b-collapse-vc.slide .b-collapse-vc__head a:active {
  color: #3b3b3b;
}
.b-collapse-vc__head a strong {
  display: inline-block;
  vertical-align: top;
  width: 22px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  margin-right: 20px;
}
.b-collapse-vc__head a em {
  width: calc(100% - 22px);
}
.b-collapse-vc__title {
  font-style: normal;
  margin-right: 12px;
}
.b-collapse-vc__danger {
  font-size: 0.88rem;
  font-style: normal;
  color: #c0cad6;
  white-space: nowrap;
}
.b-collapse-vc__head span {
  display: inline-block;
  width: 32px;
  height: 32px;
  background-color: #f2f2f2;
  border-radius: 5px;
  position: relative;
}
.b-collapse-vc__head span:before,
.b-collapse-vc__head span:after {
  content: '';
  position: absolute;
  top: 8px;
  left: 15px;
  width: 0;
  height: 16px;
  border-right: 1px solid #666;
  transition: transform 0.5s ease;
  -webkit-transition: transform 0.5s ease;
}
.b-collapse-vc.slide .b-collapse-vc__head span:before {
  transform: rotate(270deg);
  -webkit-transform: rotate(270deg);
}
.b-collapse-vc__head span:after {
  transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
}
.b-collapse-vc.slide .b-collapse-vc__head span:after {
  transform: rotate(450deg);
  -webkit-transform: rotate(450deg);
}
.b-collapse-vc__body {
  padding-bottom: 2rem;
}
.b-collapse-vc.invalid {
  border-bottom-color: #f00;
}
.b-collapse-vc__head {
  font-family: Roboto, sans-serif;
}
.b-collapse-vc__head a {
  justify-content: flex-start;
  align-items: center;
}
.b-collapse-vc__head a i {
  font-style: normal;
}
.b-collapse-vc__title {
  margin-right: 50px;
}
.b-collapse-vc__danger {
  font-size: 0.88rem;
  font-weight: normal;
}
.b-collapse-vc__body {
  padding-top: 2rem;
}
@media (max-width: 991px) {
  .b-collapse-vc__head a {
    display: block;
  }
  .b-collapse-vc__title {
    margin-right: 0;
  }
  .b-collapse-vc__danger {
    margin-top: 10px;
  }
}
@media (max-width: 991px) {
  .b-collapse-vc .b-collapse-vc__danger {
    display: block;
  }
}
</style>
