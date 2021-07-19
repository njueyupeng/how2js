---
title: 记录一种将原生js项目改成react项目的方案
date: "2021-07-19T23:46:37.121Z"
---

最近参与了一个老项目的改造，该项目使用原生js操作dom生成各种页面的，甚至连jquery都没有使用举例如下：

```javascript
// detail.js

class Detail {
    constructor(parent){
        this.parent = parent;
        this.draw()
    }
    
    draw(){
        const detail = this.detail = document.createElement('div')
        detail.innerHtml = "detail"  
        parent.addendChild(detail)
    }
    
    // 其他业务逻辑
    
}
```

```javascript
// parent

class Parent{
    constructor(){
        this.init();
    }
    init(){
        const Dom = document.createElement('div')
        this.Detail = new Detail(Dom)
        // ... 其他操作逻辑
    }
}
```

## 问题分析：

1. 需要将原有通过原生操作dom的方式改成使用react进行开发
2. 原有的类中包含大量业务逻辑，如果迁移业务逻辑到react组件中，会带来巨大的工作量。

## 目标：
复用原有的业务逻辑，只抽离dom渲染的部分。

## 最终实现：

### 1. 改造原有的类，使之具有state状态

```javascript
// StateFul
import { Mixin } from "./mixin";
import { waitLoopEnd } from "./wait_loop";

export const stateFulMixin = {
    constructor:function() {
        this.state = {}
        this._stateHooks = [];
        this._actionHooks = [];
        this._actionHooksMap = {};
        this._waitingUpdate = false;
        this._waitingDispatch = {};
    },
    setState: function(newState) {
        let state = { ...this.state };
        for(let key in newState) {
            state[key] = newState[key];
            if(!this._waitingDispatch[key]) {
                this._waitingDispatch[key] = true;
                waitLoopEnd(() => this._dispatchAction(key));
            }
        }
        this.state = state;
        if(!this._waitingUpdate) {
            this._waitingUpdate = true;
            waitLoopEnd(() => this._updateState());
        }
    },
    _dispatchAction: function(key) {
        this._waitingDispatch[key] = false;
        let action = { name:key, value: this.state[key] };
        let hookList = this._actionHooksMap[key];
        if(hookList) hookList.forEach(h => h(action));
        this._actionHooks.forEach(h => h(action));
    },
    _updateState:function() {
        this._waitingUpdate = false;
        this._stateHooks.forEach(h => h(this.state));
    },
    addHook: function(h) {
        let i = this._stateHooks.indexOf(h);
        if(i<0) this._stateHooks.push(h);
        return () => {
            let i = this._stateHooks.indexOf(h);
            if(i>=0) this._stateHooks.splice(i, 1);
        }
    },

    addActionHook: function(h, acNames=[]) {
        if(acNames.length==0) {
            let i = this._actionHooks.indexOf(h);
            if(i<0) this._actionHooks.push(h);
            return () => {
                let i = this._actionHooks.indexOf(h);
                if(i>=0) this._actionHooks.splice(i, 1);
            }
        }
        else {
            for(let name of acNames) {
                let hookList = this._actionHooksMap[name];
                if(!hookList) {
                    hookList = this._actionHooksMap[name] = []
                }
                let i = hookList.indexOf(h);
                if(i<0) hookList.push(h);
            }
            return () => {
                for(let key in this._actionHooksMap) {
                    let list = this._actionHooksMap[key];
                    let i = list.indexOf(h);
                    if(i>=0) list.splice(i, 1);
                }
            }
        }
    }
}

export const StateFul = Mixin(class {}, stateFulMixin);

```

```javascript
export function Mixin(targetClass, mixObject, prototypes=[]) {

    const newClass = class extends targetClass{
        constructor(args1=[], args2=[]) {
            super(...args1);
            mixObject.constructor && mixObject.constructor.call(this, ...args2);
        }
    }
    const _prototype = newClass.prototype;
    if(prototypes.length) {
        for(let name of prototypes) {
            if(mixObject[name]) _prototype[name] = mixObject[name];
        }
    }
    else {
        for(let name in mixObject) {
            if(!_prototype.hasOwnProperty(name)) {
                _prototype[name] = mixObject[name];
            } 
        }
    }
    return newClass;
}
```

```javascript
export const waitLoopEnd = (() => {
    let loopEndPromise = null;
    let workBuffer = [];
    return (callback) => {
        if(loopEndPromise == null) {
            workBuffer = [];
            loopEndPromise = Promise.resolve();
            loopEndPromise.then(()=> {
                loopEndPromise = null;
                /**
                 * 防止在loopEnd 的时候又遇到 执行 waitLoopEnd
                 * 所以不能在works执行完成之后将workBuffer清空, 必须在执行works之前就把buffer清空
                 * 在执行works过程中遇到的 waitLoopEnd, 等待下一个 loopEndPromise
                 */
                 
                let works = [...workBuffer]
                workBuffer = [];
                works.forEach(cb =>{
                    try{
                        cb();
                    }
                    catch(e) {
                        console.log("test: loop ended cb error")
                    }
                });
            })
        }
        workBuffer.push(callback);
    }
})();
```

```javascript
class Detail Extends StateFul {
    constructor(parent){
        super()
        this.state = {detail:''}
        this.parent = parent;
        this.draw()
    }
    
    draw(){
        const detail = this.detail = document.createElement('div')
        detail.innerHtml = "detail"  
        parent.addendChild(detail)
    }
    
    // 其他业务逻辑
    
}
```

### 2. 构造页面组件，来监听原有类的state,渲染页面

```javascript
import React, { useState, useEffect } from 'react'

export function useConState(container, stateKey) {

    const [state, setState] = useState(stateKey == undefined ? container.state : container.state[stateKey]);

    useEffect(() => {
        if (stateKey !== undefined) {
            return container.addActionHook(({ value }) => setState(value), [stateKey]);
        }
        setState(container.state)
        return container.addHook(setState)
    }, [])


    return state
}

```

```javascript
 export default function DetailDIV (){
     const {detail} = useConState(detailInstanceF)
     return <div>{detail}</div>
 }
```