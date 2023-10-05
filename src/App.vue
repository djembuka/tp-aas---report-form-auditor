<template>
  <div class="container">
    {{ $store.state.savedTime }}
    <form
      :action="$store.state.form.action"
      :method="$store.state.form.method"
      id="reportFormAuditor"
    >
      <input
        v-for="fc in $store.state.hidden"
        :key="fc.name"
        type="hidden"
        :name="fc.name"
        :value="fc.value"
      />
      <component
        :is="getAppName(block.type)"
        v-for="(block, blockIndex) in $store.state.blocks"
        :block="block"
        :blockIndex="blockIndex"
        :key="block.id"
      ></component>
      <app-button-submit></app-button-submit>
    </form>
  </div>
</template>

<script>
import AppBlock from './components/AppBlock.vue';
import AppBlockCollapse from './components/AppBlockCollapse.vue';
import AppButtonSubmit from './components/AppButtonSubmit.vue';

export default {
  name: 'App',
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
    getAppName(type) {
      return `app-block${type === 'collapse' ? '-collapse' : ''}`;
    },
    resetAutosaveTimeoutId() {
      clearTimeout(this.$store.state.autosave.timeoutId);
      const id = setTimeout(() => {
        this.$store.dispatch('autosave');
      }, this.$store.state.autosave.time);
      this.$store.commit('setAutosaveTimeoutId', id);
    },
  },
  components: {
    AppBlock,
    AppBlockCollapse,
    AppButtonSubmit,
  },
  mounted() {
    //create submit in storage
    //create valid map in submit
    this.$store.commit('createSubmitMap');
    //start autosave counter
    this.resetAutosaveTimeoutId();
    //modal submit button
    document
      .querySelectorAll('#submitConfirmModal .modal-buttons .btn')
      .forEach((button, i) => {
        button.addEventListener('click', () => {
          let id = i === 0 ? 14 : 15;
          this.bitrixLogs(id, button.innerHTML);
        });
      });
  },
};
</script>

<style>
.b-tab {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.b-tab .cls-1 {
  fill: #353535;
}
.b-tab svg {
  width: 18px;
  margin-right: 15px;
}
</style>
