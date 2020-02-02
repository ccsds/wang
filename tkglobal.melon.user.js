// ==UserScript==
// @name         tkglobal.melon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You 
// @match        https://tkglobal.melon.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require     https://gist.githubusercontent.com/ccsds/22cc3c03af72f39ad3977de04a8daf16/raw/792dd2bfba4f0d5f7f2bdb0ccc4725004d048c42/mywaitForKeyElements.js
// @grant        none
// ==/UserScript==
// 购买票数
var need_ctn = 1;
// 电话号码
var tel="18375965202";
// 卡类型
var cardType = "VISA";
//时间选择
var performanceData='20200222';//  等于 Sun, Feb 23, 2020
var performanceTime='07:00'          // 05:00 PM    



var st="18:25";//刷新时间




var $1;
function step1(){
    var box_btn = $1(".box_btn").find("button");
    box_btn.click();
}

function step2(){
    if(!ezCusPaper.bottom)
        return;
    var bottom = ezCusPaper.bottom;
    var next = bottom.next;
    var ctn = 0;
    while(next && ctn < need_ctn){
        if(next.events && next.events[2].name == 'click'){
            next.events[2].f.call(next);
            ctn++;
        }
        next = next.next;
    }
    $1("#nextTicketSelection")[0].click();
}

function step3(){
    $1("#payMethodCode001").attr("checked","checked");
    $1(".sel_cate.selectSeatGrade").val(need_ctn);
    $1(".sel_cate.selectSeatGrade").change();
    $1("#nextPayment")[0].click();
}

function step4(){
    $1("#payMethodCode001").click();
    $1("#payMethodCode003").click();
    $1("#tel").val(tel);
    var bankCodeOpts = $1("select[name='bankCode']").children();
    var bkValue = $1(bankCodeOpts[1]).attr("value");
    $1("select[name='bankCode']").val(bkValue);
    $1("select[name='bankCode']").change();
    $1("#cashReceiptIssueCode3").click();
    $1("#chkAgreeAll").click();

    // VISA CCXA
    var ccValue = $1('#cardCode :contains("'+cardType+'")').attr("value");
    $1("#cardCode").val(ccValue);
    $1("#cardCode").change();
    setTimeout(function(){$1("#btnFinalPayment")[0].click();},1000)
}

function list_time(){
    var listLi= $1('#list_time>li')
    for(var n=0;n<listLi.length;n++){
        if($1('#list_time>li>button>span')[n].innerHTML.indexOf(performanceTime)!=-1){
            $1('#list_time>li>button')[n].click();
        }
    } 
}
function captchaImg(){
    var imgdata= $1("#captchaImg")[0].src.split("data:image/png;base64,")[1];
    var ul=""
    $1.ajax({
        type:'post'
        ,url:"https://ocr.xinby.cn/api.php"
        ,data:{"token":"185f7afd7aaf370e0861edb5c3762b07","dev_id":14861,"act":"image","type":"shibie","typeid":"9008","image":encodeURI(imgdata)}
        ,success:function(data){
            console.log(data.data.result)
            $1('#label-for-captcha')[0].value=data.data.result;
            $1('#btnComplete')[0].click();
            setTimeout(function(){
                if(  $1('#certification')[0].style.display.indexOf("none")!=-1){
                    console.log("验证码对了");
                }else{
                    $1('#btnReload')[0].click();
                    console.log("验证码错了");
                    setTimeout(function(){
                        captchaImg();
                    },1000);
                }
            },1500)
        }
        ,error:function(){
            console.log("验证码接口异常");
        }
    })
}
function timeAdd( hm){
    hm=hm.split(':');
    if(hm[1]!='59'){
        hm[1]=hm[1]*1+1;
        if(hm[1]<10){
            hm[1]="0"+hm[1];
        }

    }else{
        hm[1]='00';
        hm[0]=hm[0]*1+1;
    }
    return hm[0]+":"+hm[1]

}
var time="";
var time6;
function chackTime(){

    // console.log('开始获取时间');
    $1.ajax({
        type:'GET'
        ,url:"https://quan.suning.com/getSysTime.do"
        ,success:function(data){
            data= $.parseJSON( data )
            time=data.sysTime2.substring(11,20)
            var   st2=":59";
            console.log('时间：'+time+"定时："+st+st2);
            if(time.indexOf(st+st2)!=-1||data.sysTime2.substring(11,16).indexOf( timeAdd(st))!=-1){
        
                      console.log("时间对了");
                setTimeout(function(){
                var btn= $1('#list_date>li')
                console.log(btn);
                if(btn.length>0){
                    for(var a=0;a<btn.length;a++){
                        if( btn.eq(a).attr('data-perfday').indexOf(performanceData)!=-1){
                            $1('#list_date>li>button')[a].click();
                            document.getElementsByClassName('btColorGreen')[0].click();
                        }
                    }
                }else{
                    console.log("刷新");
                    setTimeout(function(){  location.reload();},800);
                }
                },800)
            }else{
                  //   console.log('时间不对');
                setTimeout(chackTime,900)
                
                
            }
        

        }
    })

}
function listdate(){
    $1.ajax({
        type:'GET'
        ,url:"https://quan.suning.com/getSysTime.do"
        ,success:function(data){
            data= $.parseJSON( data )
            var strs=    timeAdd(st);
            time=data.sysTime2.substring(11,16);
            // console.log("time时间为："+time+" 获取时间："+strs);
            var btn= $1('#list_date>li')
            if(time.indexOf(strs)!=-1){
                for(var a=0;a<btn.length;a++){
                    if( btn.eq(a).attr('data-perfday').indexOf(performanceData)!=-1){
                        $1('#list_date>li>button')[a].click();
                        document.getElementsByClassName('btColorGreen')[0].click();
                    }
                }
            }
        }
    })
}
(function() {
    'use strict';
    $1=$.noConflict(true);
    // Your code here...

    waitForKeyElements('li.item_date.on', step1);
    waitForKeyElements('svg:last', step2);
    waitForKeyElements('#nextPayment', step3);
    waitForKeyElements('#btnFinalPayment', step4);
    waitForKeyElements("#captchaImg", captchaImg);//验证码
    waitForKeyElements('#list_time>li',list_time)
    // waitForKeyElements('#inputAll',step5)
    waitForKeyElements(".btn_ticketing_type",chackTime)
    //  waitForKeyElements('#list_date>li',listdate)

    window.alert=function(msg){
        if(location.href.indexOf('performance')!=-1){
            console.log('演唱会界面弹窗已拦截：'+msg);
            $1('.btColorGreen')[0].click()
        }else{
            step2();
        }
    }

})();
