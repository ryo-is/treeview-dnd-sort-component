import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import ja from 'vuetify/src/locale/ja'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    dark: false
  },
  lang: {
    locales: { ja },
    current: 'ja'
  }
})
