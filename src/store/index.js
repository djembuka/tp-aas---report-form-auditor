import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ...window.reportFormAuditorStore,
    separator: '---',
    savedTime: '',
    autosave: {
      timeoutId: null,
      time: 2 * 60 * 1000,
    },
  },
  mutations: {
    createSubmitMap(state) {
      //create controls order map
      let controlsOrderMap = [];
      state.blocks.forEach((block) => {
        block.controls.forEach((control) => {
          if (control.type === 'multyblock') {
            control.items.forEach((multyItem, multyItemIndex) => {
              control.controls.forEach((multyControl) => {
                controlsOrderMap.push(
                  `${multyControl.property}${state.separator}${multyItemIndex}`
                );
              });
            });
          } else {
            controlsOrderMap.push(String(control.property));
          }
        });
      });

      Vue.set(state, 'controlsOrderMap', controlsOrderMap);

      //create submit map
      let submitMap = {};
      let c;
      state.blocks.forEach((block) => {
        block.controls.forEach((control) => {
          if (control.type === 'multyblock') {
            control.items.forEach((multyItem, multyItemIndex) => {
              control.controls.forEach((multyControl) => {
                c = { ...multyControl };
                c[multyControl.type === 'select' ? 'selected' : 'value'] =
                  multyItem[multyControl.property];
                submitMap[
                  `${multyControl.property}${state.separator}${multyItemIndex}`
                ] = validateControl(c);
              });
            });
          } else {
            submitMap[control.property] = validateControl(control);
          }
        });
      });

      Vue.set(state, 'submitMap', submitMap);

      function validateControl(control) {
        if (control.type === 'select') {
          return control.required
            ? control.selected.code.trim()
              ? true
              : false
            : true;
        } else if (control.type === 'checkbox') {
          return control.required ? control.checked : true;
        } else {
          if (control.required) {
            return control.value && control.value.trim() !== ''
              ? control.pattern
                ? new RegExp(control.pattern, 'ig').test(control.value)
                  ? true
                  : false
                : true
              : false;
          } else {
            return control.value && control.value.trim() === ''
              ? true
              : new RegExp(control.pattern, 'ig').test(control.value)
              ? true
              : false;
          }
        }
      }
    },

    multyBlockAddItem(state, payload) {
      //create item
      const item = {
        id: payload.itemId,
      };

      //insert into controlsOrderMap
      const last = `${
        payload.multyBlock.controls[payload.multyBlock.controls.length - 1]
          .property
      }${state.separator}${payload.multyBlock.items.length - 1}`;

      const lastIndex =
        state.controlsOrderMap.findIndex((el) => el === last) + 1;

      const newArr = [];

      payload.multyBlock.controls.forEach((control) => {
        const newProp = `${control.property}${state.separator}${payload.multyBlock.items.length}`;
        //create items for controlsOrderMap
        newArr.push(newProp);

        if (control.type === 'select') {
          item[control.property] = control.selected;
          //add data to submitMap
          Vue.set(state.submitMap, newProp, Boolean(control.selected.code));
        } else {
          item[control.property] = '';
          //add data to submitMap
          Vue.set(state.submitMap, newProp, false);
        }
      });
      //add data to controlsOrderMap
      state.controlsOrderMap.splice(lastIndex, 0, ...newArr);
      //add item
      payload.multyBlock.items.push(item);
    },

    multyBlockRemoveItem(state, payload) {
      const multyBlock = state.blocks[payload.blockIndex].controls.find(
        (control) => control.property === payload.multyProp
      );
      //remove item
      multyBlock.items.splice(payload.itemIndex, 1);
      //remove data from submitMap
      multyBlock.controls.forEach((control) => {
        delete state.submitMap[
          `${control.property}${state.separator}${multyBlock.items.length}`
        ];
      });
      //remove data from controlsOrderMap
      multyBlock.controls.forEach((control) => {
        const i = state.controlsOrderMap.findIndex(
          (el) =>
            el ===
            `${control.property}${state.separator}${multyBlock.items.length}`
        );
        state.controlsOrderMap.splice(i, 1);
      });
    },

    setBlockOpen(state, payload) {
      Vue.set(state.blocks[payload.blockIndex], 'open', payload.open);
    },

    setControlValue(state, payload) {
      let control, item;
      if (payload.multyProp) {
        //form control in multyblock
        item = state.blocks[payload.blockIndex].controls.find(
          (control) => control.property === payload.multyProp
        ).items[payload.itemIndex];

        Vue.set(item, payload.property, payload.value);

        control = state.blocks[payload.blockIndex].controls
          .find((control) => control.property === payload.multyProp)
          .controls.find((control) => control.property === payload.property);
      } else {
        //simple form control
        control = state.blocks[payload.blockIndex].controls.find(
          (control) => control.property === payload.property
        );
      }

      //checkbox
      if (control && control.type === 'checkbox') {
        Vue.set(control, 'checked', payload.value);
      }
      //select
      else if (control && control.type === 'select') {
        Vue.set(control, 'selected', payload.value);
      }
      //simple text, textarea
      else if (control) {
        Vue.set(control, 'value', payload.value);
      }
    },

    setControlValid(state, payload) {
      Vue.set(
        state.submitMap,
        `${payload.property}${
          payload.itemIndex !== undefined
            ? state.separator + payload.itemIndex
            : ''
        }`,
        !payload.isInvalid
      );
    },

    setSavedTime(state, payload) {
      Vue.set(state, 'savedTime', payload);
    },

    setAutosaveTimeoutId(state, payload) {
      Vue.set(state.autosave, 'timeoutId', payload);
    },
  },
  actions: {
    async multyBlockAddItem({ commit, state }, payload) {
      const multyBlock = state.blocks[payload.blockIndex].controls.find(
        (control) => control.property === payload.multyProp
      );
      //if not highload infoblock
      const itemId = parseInt(Math.random() * 100000, 10);
      //  if it is a highload infoblock
      /*const response = await fetch(
        `${state.url.getItemId}?blockIndex=${payload.blockIndex}&multyProp=${payload.multyProp}`
      );
      const result = await response.json();
      let itemId;
      if (result.STATUS === 'Y') {
        itemId = result.ID;
      } else {
        return;
      }*/

      commit('multyBlockAddItem', { multyBlock, itemId });
    },
    autosave({ commit, dispatch, state }) {
      setTimeout(async () => {
        const form = document.getElementById('reportFormAuditor');
        const formData = new FormData(form);
        const response = await fetch(state.url.autosave, {
          method: 'POST',
          body: formData,
          headers: {
            Authentication: 'secret',
          },
        });
        const result = await response.json();
        if (result.STATUS === 'Y') {
          commit('setSavedTime', result.TIME);
        } else {
          dispatch('autosave');
        }
      }, 0);
    },
  },
});
