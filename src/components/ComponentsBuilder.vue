<template>
  <div class='componentsBuilder'>
      <el-switch />
  </div>
</template>

<script>
const data = {
  valueType: 'string',
  valueTypes: ['string', 'number', 'enum', 'boolean'],
  componentType: 'input',
  componentTypeEnum: ['input', 'switch'],
  name: '',
  default: ''
}
export default {
  name: 'ComponentsBuilder',
  data () {
    return data
  },
  created () {},
  props: {
    type: {
      type: [String, Boolean, Array, Number],
      default: false
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
