<template>
  <div class="b-form__submit">
    <a
      href="#"
      class="btn btn-secondary btn-lg"
      data-toggle="modal"
      data-target="#submitConfirmModal"
      :disabled="isDisabled"
      @click="clickSubmit"
      >Отправить</a
    >
    <small class="text-muted" v-if="isDisabled"
      >Вы не закончили заполнение обязательных полей.
      <a href="#" @click.prevent="clickContinue">Продолжить</a></small
    >
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isDisabled() {
      return !this.$store.state.submitMap
        ? true
        : Object.entries(this.$store.state.submitMap).some((entry) => {
            return typeof entry[1] === 'object'
              ? entry[1].some((valid) => !valid)
              : !entry[1];
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
    clickSubmit(e) {
      this.bitrixLogs(13, e.target.innerHTML);
    },
    clickContinue() {
      //find form control
      let firstControlProperty = this.$store.state.controlsOrderMap.find(
        (property) => !this.$store.state.submitMap[property]
      );

      let a = firstControlProperty.split(this.$store.state.separator);
      let blockIndex, fc, multyWord, multyProp, itemIndex;
      firstControlProperty = a[0];
      itemIndex = a[1];

      this.$store.state.blocks.forEach((block, i) => {
        block.controls.forEach((control) => {
          if (control.type === 'multyblock') {
            control.controls.forEach((c) => {
              if (String(c.property) === String(firstControlProperty)) {
                fc = c;
                blockIndex = i;
                multyWord = control.word;
                multyProp = control.property;
              }
            });
          } else {
            if (String(control.property) === String(firstControlProperty)) {
              fc = control;
              blockIndex = i;
            }
          }
        });
      });

      //highlight and scroll to the form control
      if (fc) {
        if (blockIndex !== undefined) {
          this.$store.commit('setBlockOpen', {
            blockIndex,
            open: true,
          });

          setTimeout(() => {
            const controlNode = document.getElementById(
              itemIndex !== undefined
                ? `${multyWord}_${multyProp}_${fc.word ? fc.word + '_' : ''}${
                    fc.property
                  }_${itemIndex}`
                : `${fc.word}_${fc.property}`
            );

            window.scrollTo({
              top:
                controlNode.parentNode.getBoundingClientRect().top +
                window.scrollY -
                120,
              behavior: 'smooth',
            });

            setTimeout(() => {
              if (controlNode.closest('.b-float-label')) {
                controlNode.closest('.b-float-label').classList.add('invalid');
                controlNode.focus();
              } else if (controlNode.closest('.b-float-label-select-vc')) {
                controlNode
                  .closest('.b-float-label-select-vc')
                  .classList.add('invalid');
                controlNode.click();
              } else if (controlNode.closest('.b-checkbox')) {
                controlNode.closest('.b-checkbox').classList.add('invalid');
              }
            }, 500);
          }, 100);
        }
      }
    },
  },
};
</script>

<style>
.b-form__submit .btn {
  margin-right: 20px;
}
</style>
