<template>
  <div class='componentsBuilder'>
      <el-row>
          <el-col :span='12'>
          <el-select @change="makeControl" v-model='selected' filterable placeholder='请选择'>
            <el-option v-for='(control,key) in controls' :key='key' :label='key' :value='key' />
          </el-select>
          <div v-for="(param,pname) in params">
            {{pname}}:<any-control @paramChange='paramChange' :param='param' :tag='param.tag'></any-control>{{param}}
          </div>
        </el-col>
        <el-col :span='12'>
          <any-control :tag='selected' :param='childProps' :props='childProps'></any-control>
          <p v-for="(v,k) in childProps">{{k}}:{{v}}</p>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import types from "../types.json";
import AnyControl from "./AnyControl.vue";
let typeToElement = {
  Number: "ElInputNumber",
  Boolean: "ElSwitch",
  String: "ElInput"
};
let gettype = obj => {
    let reg = /^function (.+)?\(.+}/,
      _os = obj.constructor.toString();
    if (reg.test(_os)) {
      return _os.match(reg)[1].trim();
    }
    return null;
  },
  dcopy = obj => {
    return JSON.parse(JSON.stringify(obj));
  },
  _typename = type => {
    let reg = /^function (.+)?\(.+}/,
      _os = type.toString();
    if (reg.test(_os)) {
      return _os.match(reg)[1].trim();
    }
    return null;
  },
  pcopy = obj => {
    let ntypes = {};
    Object.keys(obj).forEach(key => {
      let type = obj[key].type,
        _type;
      if (!type) {
        _type = null;
      } else {
        if (gettype(type) == "Array") {
          _type = type.map(t => {
            return _typename(t);
          });
        } else {
          _type = _typename(type);
        }
      }
      ntypes[key] = _type;
    });
    let result = JSON.parse(JSON.stringify(obj));
    Object.keys(result).forEach(key => {
      result[key].type = ntypes[key];
      result[key].value = result[key].default || null;
    });
    return result;
  };
let eui = null;
const data = {
  selected: "ElSwitch",
  controls: {},
  eui: null,
  params: {},
  childProps:{},
};
export default {
  name: "ComponentsBuilder",
  data() {
    return data;
  },
  computed: {
    control() {
      return "";
    }
  },
  methods: {
    makeControl(cname) {
      let params = {};
      for (const name in this.controls) {

          let tmpType=types[name];
        if (this.controls.hasOwnProperty(name) && cname == name) {
          const control = this.controls[name];
          for (const paramName in control) {
            if (control.hasOwnProperty(paramName)) {
              const param = control[paramName];
              
              params[paramName] = this.$_paramToControl(param,tmpType,paramName);
            }
          }
        }
      }
      this.params = params;
    },
    paramChange(){
      let childProps={}
      for (const key in this.params) {
        if (this.params.hasOwnProperty(key)) {
          const param = this.params[key];

          if(param.value!=null)childProps[key]=param.value;
        }
      }
      this.childProps=childProps;
    },
    $_paramToControl(param,type,name) {
      let tmp = dcopy(param),_type=dcopy(type.params);
      console.log(_type,tmp,name)

      tmp.tag = typeToElement[tmp.type] ? typeToElement[tmp.type] : "div";

      return tmp;
    }
  },
  created() {
    eui = this.$getEUI();
    for (const ctr in eui) {
      if (eui.hasOwnProperty(ctr)) {
        const element = eui[ctr];
        if (element.name && element.props) {
          this.$set(this.controls, element.name, pcopy(element.props));
        }
      }
    }
  },
  components: {
    AnyControl
  },
  props: {}
};
</script>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
li {
  list-style: none;
}
.string {
  color: aqua;
}
.number {
  color: rgb(0, 92, 72);
}
.object {
  color: blueviolet;
}
.boolean {
  color: red;
}
</style>
