/*javascript document */
function id(obj){
    return document.getElementById(obj);
}

function bind(obj, ev, fn){
    if(addEventListener){
        obj.addEventListener(ev, fn, false);
    }else{
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}

function view(){
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}

function addClass(obj, sClass){
    var aClass=obj.className.split(' ');
    if(!obj.className){
        obj.className=sClass;
        return;
    }
    for(var i=0; i<aClass.length; i++){
        if(aClass[i]===sClass){
            return;
        }
    }
    obj.className+=' '+sClass;
}

function removeClass(obj,sClass){
    var aClass=obj.className.split(' ');
    if(!obj.className){
        return;
    }
    for(var i=0; i < aClass.length; i++){
        if(aClass[i] === sClass){
            aClass.splice(i,1);
            obj.className=aClass.join(' ');
            break;
        }
    }
}


function fnLoad(){
    var iTime=new Date().getTime();
    var oW=id("welcome");
    var arr=[""];
    //判断图片加载
    var bImgLoad=true;
    //判断动画时间
    var bTime=false;
    var oTimer=0;
    bind(oW,"webkitTransitionEnd",end);
    bind(oW,"transitionend",end);
    oTimer=setInterval(function(){
        if(new Date().getTime()-iTime>=4000){
            bTime=true;
        }
        if(bImgLoad&&bTime){
            clearInterval(oTimer);
            oW.style.opacity=0;
        }
    },1000);
    function end(){
        removeClass(oW,'pageShow');
        fnTab();
    }
    /*for(var i=0; i<arr.length; i++){
        var oImg=new Image();
        oImg.src=arr[i];
        oImg.onload=function(){

        }
    }*/
}

function fnTab(){
    var oTab=id("tabPic");
    var oList=id("picList");
    var aNav=oTab.getElementsByTagName('nav')[0].children;
    //当前选中的第几个；
    var iNow=0;
    //记录transform的距离
    var iX=0;
    var iW=view().w;
    var iStartTouchX=0;
    var iStartX=0;

    //自动播放
    var oTimer=0;
    auto();
    function auto(){
        oTimer=setInterval(function(){
            iNow++;
            iNow=iNow%aNav.length;
            tab()
        },2000);

    }

    bind(oTab,"touchstart",fnStart);
    bind(oTab,"touchmove",fnMove);
    bind(oTab,"touchend",fnEnd);
    function fnStart(ev){
        //解决拖动时卡顿的问题
        oList.style.transition='none';
        ev=ev.changedTouches[0];
        iStartX=iX;
        iStartTouchX=ev.pageX;
        clearInterval(oTimer);
    }
    function fnMove(ev){
        ev=ev.changedTouches[0];
        var iDis=ev.pageX-iStartTouchX;
        iX=iStartX+iDis;
        oList.style.WebkitTransform=oList.style.transform='translateX('+iX+'px)';
    }

    function fnEnd(){
        iNow=iX/iW;
        iNow=-Math.round(iNow);
        if(iNow<0){
            iNow=0;
        }
        if(iNow>aNav.length-1){
            iNow=aNav.length-1;
        }
        tab();
        auto();
    }
    function tab(){
        iX=-iNow*iW;
        oList.style.transition='0.5s';
        oList.style.WebkitTransform=oList.style.transform='translateX('+iX+'px)';
        for(var i=0; i<aNav.length; i++){
            removeClass(aNav[i],"active");
        }
        addClass(aNav[iNow],"active");
    }
}

//
function fnScore(){
    var oScore=id("score");
    var aLi=oScore.getElementsByTagName("li");
    var arr=["好失望","没有想象那么差","很一般","良好","棒极了"];

    for(var i=0; i<aLi.length; i++){
        fn(aLi[i]);
    }
    function fn(oLi){
        var aNav=oLi.getElementsByTagName("a");
        var oInput=oLi.getElementsByTagName("input")[0];
        for(var i=0; i<aNav.length; i++){
            aNav[i].index=i;
            //点击星星，当前星星的左边都加class，右边不加class
            bind(aNav[i],"touchstart",function(){
                for(var i=0; i<aNav.length; i++){
                    if(i<=this.index){
                        addClass(aNav[i],"active");
                    }else{
                        removeClass(aNav[i],"active");
                    }
                }
                oInput.value=arr[this.index];
            });
        }
    }
    //点击提交时验证信息
fnIndex();
}

//点击提交验证不成功时，出现的信息框；
function fnInfo(oInfo,sInfo){
    oInfo.innerHTML=sInfo;
    oInfo.style.WebkitTransform="scale(1)";
    oInfo.style.opacity=1;
    //展示完以后消失
    setTimeout(function(){
        oInfo.style.WebkitTransform="scale(0)";
        oInfo.style.opacity=0;
    },1000);
}

//提交按钮，验证页面信息
function fnIndex(){
    var bScore=true;
    var oIndex=id("index");
    var oBtn=oIndex.getElementsByClassName("btn")[0];
    var oInfo=oIndex.getElementsByClassName("info")[0];
    bind(oBtn,"touchend",fnEnd);
    fnNews();
    function fnEnd(){
        bScore=fnScoreChecked();
        if(bScore){
            //评分验证通过
            if(fnTags()){
                //评分、标签都选中；
                fnIndexOut();
            }else{
                fnInfo(oInfo,"还没给景区添加标签");
            }
        }else{
            //验证不通过，调用.info
            fnInfo(oInfo,"给景区评分");
        }
    }
    //判断评分是否为空
    function fnScoreChecked(){
        var oScore=id("score");
        var aInput=oScore.getElementsByTagName("input");
        for(var i=0; i<aInput.length; i++){
            if(aInput[i].value==0){
                return false;
            }
        }
        return true;
    }

    //单选评分是否被选中；
    function fnTags(){
        var oTag=id("indexTag");
        var aInput=oTag.getElementsByTagName("input");
        for(var i=0; i<aInput.length; i++){
            if(aInput[i].checked){
                return true;
            }
        }
        return false;
    }
}

//执行首页的跳出
function fnIndexOut(){
    var oMask=id("mask");
    var oIndex=id("index");
    var oNew=id("news");
    addClass(oMask,"pageShow");
    addClass(oNew,"pageShow");
    //元素渲染过程中，即display：none--》display：block； transition是不起作用的，用定时器解决

    setTimeout(function(){
        oMask.style.opacity=1;
        //首页变模糊
        oIndex.style.WebkitFilter=oIndex.style.filter="blur(5px)";
    },14);

    setTimeout(function(){
        oNew.style.transition="0.5s";
        oMask.style.opacity=0;
        //首页变模糊
        oIndex.style.WebkitFilter=oIndex.style.filter="blur(0px)";
        oNew.style.opacity=1;
        removeClass(oMask,"pageShow");
    },3000);
}


/*news*/
function fnNews(){
    var oNews=id("news");
    var oInfo=oNews.getElementsByClassName("info")[0];
    var aInput=oNews.getElementsByTagName("input");
    aInput[0].onchange=function(){
        if(this.files[0].type.split("/")[0]=="video"){
            fnNewsOut();
            this.value="";
        }else{
            fnInfo(oInfo,"请上传视频");
        }
    };

    aInput[1].onchange=function(){

        if(this.files[0].type.split("/")[0]=="image"){

            fnNewsOut();
            this.value="";
        }else{
            fnInfo(oInfo,"请上传图片");
        }
    };
}

function fnNewsOut(){
    var oNews=id("news");
    var oForm=id("form");
    addClass(oForm,"pageShow");
    oNews.style.cssText="";
    removeClass(oNews,"pageShow");
    formIn();
}

function formIn(){
    var oForm=id("form");
    var oOver=id("over");
    var aFormTag=id("formTag").getElementsByTagName("label");
    var oBtn=oForm.getElementsByClassName("btn")[0];
    var bOff=false;
    for(var i=0; i<aFormTag.length; i++){
        bind(aFormTag[i],"touchend",function(){
            bOff=true;
            addClass(oBtn,"submit");
        })
    }
    bind(oBtn,"touchend",function(){
       if(bOff=true){
           addClass(oOver,"pageShow");
           fnOver();
           removeClass(oForm,"pageShow");
       }
    })
}

function fnOver(){
    var oOver=id("over");
    var oBtn=oOver.getElementsByClassName("btn")[0];

    bind(oBtn,"touchend",function(){
        removeClass(oOver,"pageShow");
    })

}