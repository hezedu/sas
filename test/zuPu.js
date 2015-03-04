function zupu(a) {
    var mod = {
        first: '<div class="dw_zupu_first">',
        suoyin: function(qian, id, hou) {
            return '<span class="dw_zupu_zu1">' + qian + '</span><span style="color:black">[' + (id) + ']' + hou + '</span>';
        },
        type: function(type) { 
            return '=&gt;<b class="dw_zupu_' + type + '">' + type + '</b>';
        },
        other: function(type, ot, i) {

            if (ot.toString().substr(0, 8) !== '[object ') {
                return '=&gt;<b class="dw_zupu_Other">' + type + '</b>= ' + zupu.toTXT(ot.toString());
            } else {
                if (typeof i === 'undefined' || typeof window === 'undefined') {
                    return '=&gt;<b class="dw_zupu_Other">' + type + '</b>';
                } else {
                    return '<a  class="dw_zupu_funb" style="color:red" onclick=\"zupu.otherShow(\'' + i + '\')\"  target="_blank">=&gt;<b class="dw_zupu_Other">' + type + '</b><span class="dw_zupu_funj">?</span></a><div class="dw_zupu_fund"></div>';
                }
            }
        },
        wai: "<span class='dw_zupu_wai'><外></span>",
        count: function(c) {
            return '<span class="dw_zupu_count" id="dw_zupu_' + c + '">' + idarr2 + '<span style="font-size:14px">[' + c + ']</span></span>';
        },
        native: ' = <span style="color:lime">[native scode]</span>',
        end: '</div>'
    }
    var zu = ['this'],
        point = [
            [a, 'this', 0]
        ],
        dump = '<pre class="dw_zupu_show">',
        tmp, id2 = 0,
        zu1 = '',
        zu2 = 'this',
        count = 0,
        notxt = '<span noTtxt="1"',
        wai = false,
        idarr = [0],
        idarr2 = 0;
    (function quchong(a) {
        var ty = zupu.is(a),
            y = zupu.isyinyong(ty),
            id = 0,
            zj = '<span class="dw_zupu_zu1">' + zu1 + '</span><span style="color:black">[' + (id2) + ']' + zu2 + '</span>';
        dump += mod.first + mod.count(count, idarr2) + zj;
        if (wai) {
            dump += mod.wai;
        }
        switch (ty) {
        case 'String':
            if (a.substr(0, 16) === notxt) {
                dump += a;
            } else {
                var len = a.length;
                dump += mod.type(ty) + ' = "' + zupu.strHide(a) + '"';
            }
            break;
        case 'Number':
        case 'Boolean':
            dump += mod.type(ty) + ' = ' + a;
            break;
        case 'Null':
        case 'Undefined':
        case 'Object':
        case 'Array':
            dump += mod.type(ty);
            break;
        case 'Function':
            var funtoStr = a.toString(),
                fin = funtoStr.search(/^function([\s\S]*?)\(([\s\S]*?)\)\s*\{\s*\[native\scode\]\s*\}\s*$/);
            if (fin == 0) {
                dump += mod.type(ty) + mod.native;
            } else {
                var text = zupu.toTXT(a.toString());
                text=zupu.color(text);
                dump += '<span  class="dw_zupu_funb"  onclick="zupu.showChild(this)">' + mod.type(ty) + '<span class="dw_zupu_funj">+</span></span><div class="dw_zupu_fund">' + text + '</div>';
            }
            break;
        default:
            dump += mod.other(ty, a);
            break;
        }
        dump += mod.end;
        count = count + 1;
        if (y > 0 && zupu.isforin(a)) {
            for (var i in a) {
                if (a.hasOwnProperty(i)) {
                    wai = false;
                } else {
                    wai = true;
                }
                var ty = zupu.is(a[i]),
                    y = zupu.isyinyong(ty);
                id2 = id;
                zu2 = i;
                zu1 = zu.join('.') + '.';

                tmp = (y > 0) ? points(a[i], zu1 + i, count, y) : a[i];
                if (tmp === 'GODMOD_ZHUANGYONG' && y === 2) {
                    tmp = '<span noTtxt="1">' + mod.other(zupu.is(a[i]), a[i], zu2) + '</span>';
                }
                zu.push(i);
                idarr.push(id);
                idarr2 = idarr.join('-');
                quchong(tmp);
                zu.pop();
                idarr.pop(id);
                id++;
            }
        }
    })(a);

    function points(o, z, ic, y) {
        var len = point.length,
            i = 0;
        for (; i < len; i = i + 1) {
            if (point[i][0] === o) {
                return '<span noTtxt="1"> = <a style="cursor:pointer;text-decoration:underline;color:royalblue" onclick="zupu.href(\'dw_zupu_' + point[i][2] + '\')">' + point[i][1] + ' [' + point[i][2] + '</a></span>';
            }
        }
        point[len] = [o, z, ic];
        if (y === 2) {
            return 'GODMOD_ZHUANGYONG';
        }
        return o;
    }
    dump += '</pre>';
    return dump;
}
//族谱用到的函数/////////////////////////////////////////////////
var zupu = zupu ||
function() {};

zupu.toTXT = function(str) {
    //Html结构转字符串形式显示
    //var RexStr = /\<|\>|\"|\'|\&|　| /g;
    var RexStr = /\<|\>/g;
    str = str.replace(RexStr, function(MatchStr) {
        switch (MatchStr) {
        case "<":
            return "&lt;";
            break;
        case ">":
            return "&gt;";
            break;
/*case "\"":
                return "&quot;";
                break;
            case "'":
                return "&#39;";
                break;
            case "&":
                return "&amp;";
                break;
            case " ":
                return "&ensp;";
                break;
            case "　":
                return "&emsp;";
                break;*/
        default:
            return MatchStr;
        }
    });
    return str;
}
zupu.is = function(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}
zupu.isyinyong = function(ty) {
    if (ty === 'String' || ty === 'Number' || ty === 'Undefined' || ty === 'Null' || ty === 'Boolean') return 0;
    if (ty === 'Function' || ty === 'Object' || ty === 'Array') return 1;
    return 2;
}
zupu.isforin = function(obj) {
    try {
        for (var i in obj) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}
zupu.strHide = function(a, L, s) {
    s = s || 20;
    L = L || 200;
    var len = a.length,
        len1 = len - s - s;
    if (len > L && L > s + s) {
        return '<span class="dw_zupu_funj" style="cursor:pointer;margin-right:10px;color:#FFF;background:yellowgreen;" onclick="zupu.showNext(this)">+</span><span>' + zupu.toTXT(a.substr(0, s)) + '</span><span style="color:yellowgreen;display:inline;">...(' + len1 + ')...</span><span style="display:none">' + zupu.toTXT(a.substr(s, len1)) + '</span>' + zupu.toTXT(a.substr(-s, s));
    } else {
        return zupu.toTXT(a);
    }
}
zupu.color = function(str) {
        var RexStr = /\/\/([\s\S]*?)\n+|\/\*([\s\S]*?)\*\/+|'([\s\S]*?)'+|"([\s\S]*?)"+/g;
        str = str.replace(RexStr,
            function(MatchStr) {
                if (MatchStr.substr(0, 2) === '//' || MatchStr.substr(0, 2) === '/*') {
                    return "<span style='color:mediumseagreen'>" + MatchStr + "</span>";
                } else if (MatchStr[0] === "'" || MatchStr[0] === '"') {
                    return "<span style='color:#808080'>" + MatchStr + "</span>";
                }
                /*else{
                        switch (MatchStr.match(/\S+/g).toString()) {
                            case "this":
                                return MatchStr.fontcolor('red');
                                break;            
                                case "new":
                                case "with":
                                return MatchStr.fontcolor('red').bold().big();
                                break;
                                case "typeof":
                                return "<i style='color:#darkslategray;font-weight:bold'>"+MatchStr+"</i>";
                                break;
                               case "return":
                               return "<b style='color:blue'>"+MatchStr+"</b>";
                                break;

                            default:
                            return "<b style='color:dodgerblue'>"+MatchStr+"</b>";
                            //return test.match(/\S+/g);
                                break;
                        }
                    }*/
            }
        );
        return str;
    }
//只在前端用
if (typeof(window) !== 'undefined') {
    zupu.head = (function() {
        document.write("<style>.dw_zupu_show{padding:10px;font-family:'Courier new','微软雅黑';\
word-wrap:break-word;font-size:16px;}\
.dw_zupu_first:hover{background:#FFEBCD;}\
.dw_zupu_wai{background:fuchsia;font-size:12px}\
.dw_zupu_Function , .dw_same{color:blue}\
.dw_zupu_same1{color:darkgoldenrod}.dw_zupu_Object{color:red}\
.dw_zupu_Array{color:orangered}.dw_zupu_String{color:yellowgreen}.dw_zupu_Number{color:green}\
.dw_zupu_Boolean{color:darkgoldenrod}\
.dw_zupu_Undefined , .dw_zupu_Null{color:silver}.dw_zupu_zu1{color:#fff;}\
.dw_zupu_first:hover .dw_zupu_zu1{color:#999}\
.dw_zupu_count{float:right;color:dimgray;font-size:12px;font-family:'Georgia'}\
.dw_zupu_fund{display:none;font-size:14px;color:#001432;}\
.dw_zupu_funb{cursor:pointer}\
.dw_zupu_funj{display:inline-block;height:14px;width:14px;border:1px solid #666;line-height:14px;text-align:center;margin:1px}\
</style>");
    })();
    zupu.href = function(b) {
        var a = document.getElementById(b);
        var top = a.offsetTop;
        document.documentElement.scrollTop = document.body.scrollTop = top - 200;
        a.parentNode.style.backgroundColor = 'yellow';
        setTimeout("document.getElementById(\'" + b + "\').parentNode.removeAttribute('style')", 3000);
    }
    zupu.showChild = function(a) {
        var last = a.lastChild;
        last.innerHTML = (last.innerHTML != '+') ? '+' : '-';
        a = a.nextSibling;
        a.style.display = (a.style.display != 'block') ? 'block' : "none";
    }
    zupu.otherShow = function(zu) {
        if (isNaN(zu)) {
            location = location + '.' + zu;
        } else {
            location = location + '[' + zu + ']';
        }
    }
    zupu.showNext = function(a) {
        a.innerHTML = (a.innerHTML != '+') ? '+' : '-';
        var a1 = a.nextSibling.nextSibling,
            a2 = a1.nextSibling;
        dis0 = a1.style.display;
        a1.style.display = a2.style.display;
        a2.style.display = dis0;
    }
    zupu.search = function() {
        var v1 = document.getElementById("input2"),
            v3 = document.getElementById("search"),
            show = document.getElementById("show"),
            v2 = v1.nextSibling.value;
        v1 = v1.value;
        if (v3.src === v2) {
            setTimeout("show.innerHTML='<h1>" + v1 + "</h1>'+zupu(" + v1 + ")", 1);
        } else {
            v3.src = v2;
            v3.onload = function() {
                setTimeout("show.innerHTML='<h1>" + v1 + "</h1>'+zupu(" + v1 + ")", 1);
            }
        }
    }
    //前端end
}else if(typeof module !== 'undefined' && module.exports){
    zupu.init=function(res){
        var fs = require('fs');
        var zupu_init=fs.readFileSync(__dirname+'/zupu.js', '').toString();
        res.write('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <scr'+'ipt>' + zupu_init + '</scr'+'ipt>'); 

    }
    //2015.1.24 19:34
    module.exports=zupu;
}