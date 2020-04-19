<template lang="pug">
   v-container.home.px-8.py-4(fluid)
    v-row(align="center", justify="center")
      v-col(cols=6)
        .title Treeview DnD Sort
      v-col.pa-0(cols=12)
      v-col(cols=6)
        v-switch.font-weight-bold.pt-0.mt-0(v-model="opened" label="Sort On / Off" hide-details, @change="sortGroups(opened)")
      v-col.pa-0(cols=12)
      v-col(cols=6)
        draggable-treeview(
          ref="treeview",
          v-model="value",
          group="group",
          :toggle="opened",
          :disabled="disabled",
          @resetHighlight="resetHighlight",
        )
</template>

<script lang="ts">
import Vue from 'vue'
import DraggableTreeview from '@/components/DraggableTreeview.vue'
import { TreeItem } from '@/types'

type DataType = {
  value: TreeItem[]
  opened: boolean
  disabled: boolean
}

export default Vue.extend({
  components: { DraggableTreeview },
  data(): DataType {
    return {
      value: [
        {
          id: 1,
          name: 'Parent1',
          children: [
            { id: 11, name: 'Children1-1', children: [] },
            { id: 12, name: 'Children1-2', children: [] }
          ]
        },
        {
          id: 2,
          name: 'Parent2',
          children: []
        },
        {
          id: 3,
          name: 'Parent1',
          children: [
            { id: 31, name: 'Children3-1', children: [] },
            {
              id: 32,
              name: 'Children3-2',
              children: [{ id: 321, name: 'Grandchild3-2-1', children: [] }]
            }
          ]
        }
      ],
      opened: false,
      disabled: true
    }
  },
  methods: {
    resetHighlight() {
      // eslint-disable-next-line prettier/prettier
      (this.$refs.treeview as InstanceType<
        typeof DraggableTreeview
      >).changeHighlight(false)
    },
    toggle(bool: boolean) {
      this.opened = bool
    },
    sortGroups(bool: boolean) {
      this.opened = bool
      this.disabled = !bool
    }
  }
})
</script>
