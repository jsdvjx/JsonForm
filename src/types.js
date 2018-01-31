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
fs.readdirSync(path).map((file)=>{
    //console.log();
    
    let str = toCamalCase(file.replace(".d.ts", '')), p = new RegExp(`export declare class (El${str}).*{([\\w\\W]+?)}`);
    let content =fs.readFileSync(`${path}\\${file}`).toString();
    let tmp={
        file:file,
        name:'El'+str,
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
                            return {name:_n,value:_v};
                        }
                    });
                    return {
                        desc: __t[0],
                        name: __t[1].name,
                        type: __t[1].value,
                    }
                })
                tmp.params=_tmp;
            }else{
                //console.log(_tmp);
                console.log(file);
            }
        }
        console.log(tmp);
    }else{
        console.log('err',file);
    }
    
})