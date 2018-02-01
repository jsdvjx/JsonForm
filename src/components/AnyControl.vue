<script>
let getTag = name => {
  return name
    .replace(/([A-Z])/g, "-$1")
    .replace(/^-/, "")
    .toLowerCase();
};
export default {
  name: "AnyControl",
  props: {
    param: {
      type: Object,
      required: true
    },
    props: {
      type: [Object, Boolean],
      default: false
    },
    tag: {
      type: String,
      required: true
    }
  },
  render(h) {
    let self = this;
    if (this.props) {
        return h(getTag(this.tag),{
            props:this.props
        })
    } else {
      return h(
        getTag(this.tag),
        {
          props: {
            value: self.param.value
          },
          on: {
            input: e => {
              self.param.value = e;
              self.$emit('paramChange')
            }
          }
        },
        this.$slots.default
      );
    }
  }
};
</script>
