<template>
  <component class="viewport" :is="tag" ref="el" @touchstart="onTouchstart" @mousedown="onMousedown" @wheel.prevent="onWheel">
    <slot v-bind="{transform:computedTransform}"></slot>
  </component>
</template>
<script>
import { computed } from '@vue/runtime-core';
import {shallowReactive,shallowRef} from '@vue/reactivity';
export default {
  props:{
    tag:{type:String,default:'div'},
    transform:{type:Object,default:()=>shallowReactive({})},
    minScale:{type:Number,default:0.2},
    maxScale:{type:Number,default:2},
  },
  emits:['update:transform'],
  setup(props,{emit,expose}){
    const el=shallowRef(null),
    // 起始状态缓存
    origin={
      translateX:0,
      translateY:0,
      scale:0,

      x:0,y:0, // 单点起始坐标

      rectX:0,rectY:0, // 容器相对视口的起始坐标
      centerX:0,centerY:0, // 两点中心相对视口的起始坐标
      offsetX:0,offsetY:0, // 两点中心相对移动目标左上角的坐标，即相对容器坐标减去translate偏移距离
      length:0, // 两点起始长度
    },
    setCentre=touches=>{
      origin.translateX=props.transform.translateX;
      origin.translateY=props.transform.translateY;
      origin.scale=props.transform.scale;
      const rect=el.value.getBoundingClientRect();
      origin.rectX=rect.x;
      origin.rectY=rect.y;
      origin.centerX=(touches[0].clientX+touches[1].clientX)/2;
      origin.centerY=(touches[0].clientY+touches[1].clientY)/2;
      origin.offsetX=(origin.centerX-origin.rectX-origin.translateX);
      origin.offsetY=(origin.centerY-origin.rectY-origin.translateY);
      origin.length=Math.sqrt(Math.pow(touches[0].clientX-touches[1].clientX,2)+Math.pow(touches[0].clientY-touches[1].clientY,2));
    };
    expose({el});
    if([props.transform.translateX,props.transform.translateY,props.transform.scale].includes(undefined)){
      if(props.transform.translateX===undefined) props.transform.translateX=0;
      if(props.transform.translateY===undefined) props.transform.translateY=0;
      if(props.transform.scale===undefined) props.transform.scale=props.minScale<=1&&1<=props.maxScale?1:(props.minScale+props.maxScale)/2;
      emit('update:transform',{...props.transform});
    }
    return {
      el,
      computedTransform:computed(()=>Object.entries(props.transform).map(([k,v])=>k+'('+v+(k.startsWith('translate')?'px':'')+')').join(' ')),
      onWheel(e){
        if(!e.deltaY) return;
        const old=props.transform.scale;
        if(e.deltaY>0){
          if(props.transform.scale<=props.minScale) return;
          props.transform.scale-=0.1;
        }else if(props.transform.scale<props.maxScale){
          props.transform.scale+=0.1;
        }else return;
        /**
         * offsetX和offsetY是相对于当前元素的位置，
         * 但是只有在svg中参照对象是父元素，否则参照子元素
         * 因此会导致缩放中心偏移，估不能采用，而要改用rect坐标
         */
        const rect=el.value.getBoundingClientRect();
        props.transform.translateX+=(e.clientX-rect.x-props.transform.translateX)*(1-props.transform.scale/old);
        props.transform.translateY+=(e.clientY-rect.y-props.transform.translateY)*(1-props.transform.scale/old);
        emit('update:transform',{...props.transform});
      },
      onMousedown(e){
      	origin.translateX=props.transform.translateX;
        origin.translateY=props.transform.translateY;
        origin.x=e.clientX;
        origin.y=e.clientY;
        const onMove=eve=>{
          eve.preventDefault();
          props.transform.translateX=eve.clientX-origin.x+origin.translateX;
          props.transform.translateY=eve.clientY-origin.y+origin.translateY;
          emit('update:transform',{...props.transform});
        },
        onEnd=()=>{
          el.value.removeEventListener('mousemove',onMove);
          el.value.removeEventListener('mouseup',onEnd);
          el.value.style.removeProperty('cursor');
        };
        el.value.addEventListener('mousemove',onMove);
        el.value.addEventListener('mouseup',onEnd);
        el.value.style.setProperty('cursor','move');
      },
      onTouchstart(e){
        switch(e.touches.length){
          case 1:
            document.body.style.setProperty('overflow','hidden');
            origin.translateX=props.transform.translateX;
            origin.translateY=props.transform.translateY;
            origin.x=e.touches[0].clientX;
            origin.y=e.touches[0].clientY;
            const onMove_1=eve=>{
              eve.preventDefault();
              eve.stopPropagation();
              if(eve.touches.length!==1) return;
              props.transform.translateX=eve.touches[0].clientX-origin.x+origin.translateX;
              props.transform.translateY=eve.touches[0].clientY-origin.y+origin.translateY;
              emit('update:transform',{...props.transform});
            },
            onEnd_1=eve=>{
              if(eve.touches.length) return;
              el.value.removeEventListener('touchmove',onMove_1);
              el.value.removeEventListener('touchend',onEnd_1);
              document.body.style.removeProperty('overflow');
            };
            el.value.addEventListener('touchmove',onMove_1);
            el.value.addEventListener('touchend',onEnd_1);
            break;
          case 2:
            e.preventDefault();
            setCentre(e.touches);
            const onMove_2=eve=>{
              if(eve.touches.length!==2) return;
              let scale=origin.scale*Math.sqrt(
                Math.pow(eve.touches[0].clientX-eve.touches[1].clientX,2)
                +
                Math.pow(eve.touches[0].clientY-eve.touches[1].clientY,2)
              )/origin.length;
              if(scale<props.minScale) scale=props.minScale;
              else if(scale>props.maxScale) scale=props.maxScale;
              props.transform.scale=scale;
              const center={
                x:(eve.touches[0].clientX+eve.touches[1].clientX)/2,
                y:(eve.touches[0].clientY+eve.touches[1].clientY)/2
              },
              rect=el.value.getBoundingClientRect();
              props.transform.translateX=origin.offsetX*(1-scale/origin.scale)+origin.translateX+(center.x-origin.centerX)-(rect.x-origin.rectX);
              props.transform.translateY=origin.offsetY*(1-scale/origin.scale)+origin.translateY+(center.y-origin.centerY)-(rect.y-origin.rectY);
              emit('update:transform',{...props.transform});
            },
            onEnd_2=eve=>{
              if(eve.touches.length!==1){
                if(eve.touches.length===2) setCentre(eve.touches);
                return;
              }
              origin.translateX=props.transform.translateX;
              origin.translateY=props.transform.translateY;
              origin.x=eve.touches[0].clientX;
              origin.y=eve.touches[0].clientY;
              el.value.removeEventListener('touchmove',onMove_2);
              el.value.removeEventListener('touchend',onEnd_2);
            };
            el.value.addEventListener('touchmove',onMove_2);
            el.value.addEventListener('touchend',onEnd_2);
            break;
        }
      },
    }
  },
};
</script>
<style lang="scss" scoped>
// 普通元素默认transform原点是中心，需要改成左上角
:slotted(*){ transform-origin:left top; }
</style>
