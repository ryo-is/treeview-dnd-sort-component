<template lang="pug">
  draggable.v-treeview.v-treeview-draggable(
    :value="localValue"
    :group="group"
    :class="themeClassName"
    :disabled="disabled"
    animation=150,
    fallback-on-body=true,
    ghost-class='primary',
    swap-threshold=0.3,
    :move="onMove"
    @end="onEnd"
    @input="updateValue"
    @resetHighlight="resetHighlight"
  )
    draggable-tree-view-node(
      v-for="item in value"
      ref="treeViewNode"
      :key="item.id"
      :group="group"
      :value="item"
      :toggle="toggle"
      :disabled="disabled"
      :childKey="childKey"
      @input="updateItem"
      @resetHighlight="resetHighlight"
    )
      slot(name="prepend" v-bind="{ value, open }")
      slot(name="label" v-bind="{ value, open }")
      slot(name="append" v-bind="{ value }")
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import draggable from 'vuedraggable'
import DraggableTreeViewNode from './DraggableTreeviewNode.vue'
import { TreeItem } from '@/types'

export default Vue.extend({
  components: { draggable, DraggableTreeViewNode },
  props: {
    value: {
      type: Array as PropType<TreeItem[]>,
      default: (): TreeItem[] => {
        return []
      }
    },
    group: {
      type: String,
      default: null
    },
    toggle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: true
    },
    childKey: {
      type: String,
      default: 'children'
    }
  },
  data() {
    return {
      open: false,
      localValue: [...this.value],
      highlight: false
    }
  },
  computed: {
    themeClassName(): string {
      return this.$vuetify.theme.dark ? 'theme--dark' : 'theme--light'
    }
  },
  watch: {
    value(value: TreeItem[]) {
      this.localValue = [...value]
    }
  },
  methods: {
    onMove(e: any) {
      this.$emit('resetHighlight')
      e.to.__vue__.$parent.highlight = true
      return true
    },
    onEnd() {
      this.$emit('resetHighlight')
    },
    changeHighlight(bool: boolean) {
      this.highlight = bool
      if (this.$refs.treeViewNode) {
        const refs = this.$refs.treeViewNode as Vue[]
        refs.forEach((ref: any) => {
          ref.changeHighlight(false)
        })
      }
    },
    resetHighlight() {
      this.$emit('resetHighlight')
    },
    updateValue(value: TreeItem[]): void {
      this.localValue = value
      this.$emit('input', this.localValue)
    },
    updateItem(itemValue: TreeItem): void {
      const index = this.localValue.findIndex(v => v.id === itemValue.id)
      this.$set(this.localValue, index, itemValue)
      this.$emit('input', this.localValue)
    }
  }
})
</script>

<style lang="scss" scoped>
.primary {
  border-radius: 5px;
  opacity: 0.6;
}
</style>
