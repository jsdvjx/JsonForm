let fs= require('fs');
let path = `C:\\project\\node\\JsonForm\\node_modules\\element-ui\\types`;
toCamalCase=function(str){
    if (str.indexOf('-')>=0){
        return str.split('-').map(sub => {
            return toCamalCase(sub);
        }).join('');
    }else{
        return str.split('').map((s,idx)=>{
            return idx==0?s.toUpperCase():s
        }).join('');
    }
}
let enmus = {}
fs.readdirSync(path).map((file)=>{
    let content = fs.readFileSync(`${path}\\${file}`).toString(), p = new RegExp(`export type (.+)`);
    let result= content.match(p);
    if(result){
        let tmp= result[1].split('=').map((v)=>v.trim());
        enmus[tmp[0]]=tmp[1].split('|').map((v)=>{
            return v.trim().replace(/\'/g,'')
        })
    }
    return false;
})
let types= fs.readdirSync(path).map((file)=>{
    //console.log();
    
    let str = toCamalCase(file.replace(".d.ts", '')), p = new RegExp(`export declare class (El${str}).*{([\\w\\W]+?)}`);
    let content =fs.readFileSync(`${path}\\${file}`).toString();
    let tmp={
        file:file,
        name:'El'+str,
    },gettype=(str)=>{
        if (str.indexOf('(') >= 0) {
            return 'function'
        }
        return str.trim();
    }
    if (p.test(content)){
        let output = p.exec(content),_p=(new RegExp(`/\\*\\*(.+)\\*.+?\n(.+)?:(.+)`,'g'));
        if (_p.test(output[2])){
            let _tmp = output[2].match(_p);
            if (_tmp){
                _tmp= _tmp.map((_s)=>{
                    let __t= _s.split('\n').map((_sub, idx) => {
                        if(idx==0){
                            return _sub.replace(/[\/\\*\\*]{3}|[\\*\/]/g, '').trim()
                        }else{
                            let pos = _sub.indexOf(':'),_n=_sub.substr(0,pos).trim(),_v=_sub.substr(pos+1).trim();
                            let bfun=/^\(.+?\).+?\=\>.+/;
                            let tmp_t=_v,multiple=false,enmu=false;
                            if (/^\(.+\=\>/.test(_v)&&_v.indexOf("|")>=0){
                                //绝对是函数
                                tmp_t='function'
                            }else{
                                let b = bfun.test(_v);
                                if(b){
                                    //绝对是函数
                                    tmp_t='function'
                                }else{
                                    if(_v.indexOf("|")>=0){
                                        multiple = true;
                                        if(_v.indexOf("\'")>=0){
                                            //console.log(_v)
                                            //逆天的分支，枚举型
                                            multiple=false;
                                            tmp_t='string';
                                            enmu=_v.replace(/\'/g,'').split('|').map(v=>v.trim())
                                        }else{
                                            //多类型
                                            tmp_t = _v.split("|").map(gettype)
                                            //console.log(tmp_t)
                                        }
                                        
                                        //console.log(tmp_t,_n,file);
                                    }else{
                                        //单类型
                                        tmp_t=gettype(_v)
                                    }
                                    
                                }
                            }
                            return { name: _n, value: _v, type: tmp_t, multiple,enmu};
                        }
                    });
                    let ret= {
                        desc: __t[0],
                        ...__t[1]
                    }
                    if(!ret.multiple){
                        Object.keys(enmus).forEach((type)=>{
                            if(ret.type.indexOf(type)>=0){
                                ret.enmu = enmus[type];
                            }
                        })
                    }else{

                    }
                    return ret;
                })
                tmp.params=_tmp;
            }else{
                //console.log(_tmp);
                console.log(file);
            }
        }
    }else{
    }
    return tmp;
})
let out={}
types.forEach((t)=>{
    out[t.name]=t;
})
//fs.writeFileSync(path, data)
fs.writeFileSync('./types.json',JSON.stringify(out));