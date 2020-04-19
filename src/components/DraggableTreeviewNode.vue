<template lang="pug">
  .v-treeview-node.v-treeview-node--click(
      :class="{'v-treeview-node--leaf': !hasChildren}"
      :style="highlightStyle"
  )
    .v-treeview-node__root(@click="open = !open")
      .v-treeview-node__level(v-if="!hasChildren")
      i.v-icon.notranslate.v-treeview-node__toggle.v-icon--link.mdi.mdi-menu-down(
        v-if="hasChildren"
        role="button"
        :class="{'v-treeview-node__toggle--open': open, 'theme--dark': isDark, 'theme--light': !isDark}"
      )
      slot(name="prepend" v-bind="{ value, open }")
      .v-treeview-node__label
        slot(name="label" v-bind="{ value, open }")
          v-list-item(dense)
            v-list-item-content
              v-list-item-title.text-left(:class="{'font-weight-bold': highlight}") {{value.name}}
            v-spacer
          v-divider
      slot(name="append" v-bind="{ value }")
    .v-treeview-node__children.v-treeview-node__children__draggable.ml-8(
      :class="{'pb-1': hasChildren && !disabled}"
    )
      draggable(
        :group="group"
        :value="value[childKey]"
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
        treeview-node(
          ref="treeViewNode"
          v-show="open"
          v-for="child in value[childKey]"
          :key="child.id"
          :group="group"
          :value="child"
          :toggle="toggle"
          :disabled="disabled"
          :childKey="childKey"
          @input="updateChildValue"
          @resetHighlight="resetHighlight"
        )
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import draggable from 'vuedraggable'
import { TreeItem } from '@/types'

export default Vue.extend({
  name: 'TreeviewNode',
  components: { draggable },
  props: {
    value: {
      type: Object as PropType<TreeItem>,
      default: (): TreeItem => ({
        id: null,
        name: ''
      })
    },
    root: {
      type: Boolean,
      default: () => false
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
      localValue: { ...this.value },
      highlight: false
    }
  },
  computed: {
    hasChildren() {
      const value: TreeItem[] = this.value[this.childKey] as TreeItem[]
      return value !== undefined && value.length > 0
    },
    isDark(): boolean {
      return this.$vuetify.theme.dark
    },
    highlightStyle(): string {
      const primaryColor = this.$vuetify.theme.dark
        ? (this.$vuetify.theme.themes.dark.primary as string)
        : (this.$vuetify.theme.themes.light.primary as string)
      if (this.highlight) {
        return `border-left: 3px solid ${primaryColor}`
      } else {
        return ''
      }
    }
  },
  watch: {
    value(value) {
      this.localValue = { ...value }
    },
    toggle(value: boolean) {
      this.open = value
    }
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refs.forEach((ref: any) => {
          ref.changeHighlight(false)
        })
      }
    },
    resetHighlight() {
      this.$emit('resetHighlight')
    },
    updateValue(value: TreeItem[]) {
      this.open = true
      this.localValue[this.childKey] = [...value]
      this.$emit('input', this.localValue)
    },
    updateChildValue(value: TreeItem) {
      console.log('updateChildValue')
      this.open = true
      console.log(this.localValue[this.childKey])
      if (!this.localValue[this.childKey]) {
        this.localValue[this.childKey] = []
      }
      const index = (this.localValue[this.childKey] as TreeItem[]).findIndex(
        p => p.id === value.id
      )
      this.$set(this.localValue[this.childKey] as TreeItem[], index, value)
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
