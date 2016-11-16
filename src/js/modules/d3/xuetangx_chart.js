/*!
 * xuetangx-chart - JS for Debug
 * @licence xuetangx-chart - v0.1.0 (2015-09-11) */
//
//
/**
 * Created by yanguoxu on 15/4/13.
 * 提供基本方法
 *
 */
require('d3');

var xuetangX_chart = {};

module.exports = xuetangX_chart;

var base = {};

xuetangX_chart.base = base;

base.extendClass = function(subClass,superClass){
	var F = function(){};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	// subClass.superClass = superClass.prototype;
	subClass.prototype.superClass = superClass.prototype;
	if (superClass.prototype.constructor == Object.prototype.constructor){
		superClass.prototype.constructor = superClass;
	}
}
base.isFunction = function(){
	return false
};
base.isPlainObject = function(){
	return false;
};
base.isArray  = Array.isArray;

base.extend  = function(){
	var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	//如果第一个值为bool值，那么就将第二个参数作为目标参数，同时目标参数从2开始计数
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	// 当目标参数不是object 或者不是函数的时候，设置成object类型的
	if ( typeof target !== "object" && !base.isFunction(target) ) {
		target = {};
	}
	//如果extend只有一个函数的时候，那么将跳出后面的操作
	if ( length === i ) {
		target = this;
		--i;
	}
	for ( ; i < length; i++ ) {
		// 仅处理不是 null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// 扩展options对象
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				// 如果目标对象和要拷贝的对象是恒相等的话，那就执行下一个循环。
				if ( target === copy ) {
					continue;
				}
				// 如果我们拷贝的对象是一个对象或者数组的话
				if ( deep && copy && ( base.isPlainObject(copy) || (copyIsArray = base.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && base.isArray(src) ? src : [];
					} else {
						clone = src && base.isPlainObject(src) ? src : {};
					}
					//不删除目标对象，将目标对象和原对象重新拷贝一份出来。
					target[ name ] = base.extend( deep, clone, copy );
					// 如果options[name]的不为空，那么将拷贝到目标对象上去。
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	// 返回修改的目标对象
	return target;
}
base.proxy = function(func,context){
	return function(){
		func.apply(context,arguments);
	}

}
base.replaceReg = function(reg,str){
	return str.replace(reg,function(m){return m.toUpperCase()})
}
//首字母大写
base.firstUpperCase = function(str){
	var reg = /\b(\w)|\s(\w)/g;
	return base.replaceReg(reg,str);
}

//深度克隆
base.deepClone = function(obj){
	var result,oClass=base.isClass(obj);
	//确定result的类型
	if(oClass==="Object"){
		result={};
	}else if(oClass==="Array"){
		result=[];
	}else{
		return obj;
	}
	for(var key in obj){
		var copy=obj[key];
		if(base.isClass(copy)=="Object"){
			result[key]=arguments.callee(copy);//递归调用
		}else if(base.isClass(copy)=="Array"){
			result[key]=arguments.callee(copy);
		}else{
			result[key]=obj[key];
		}
	}
	return result;
}
//返回传递给他的任意对象的类
base.isClass = function(o){
	if(o===null) return "Null";
	if(o===undefined) return "Undefined";
	return Object.prototype.toString.call(o).slice(8,-1);
}
base.formatDate = function(format,date){
	var o = {
		"M+" : date.getMonth()+1, //month
		"d+" : date.getDate(), //day
		"h+" : date.getHours(), //hour
		"m+" : date.getMinutes(), //minute
		"s+" : date.getSeconds(), //second
		"q+" : Math.floor((date.getMonth()+3)/3), //quarter
		"S" : date.getMilliseconds() //millisecond
	}

	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
	}

	for(var k in o) {
		if(new RegExp("("+ k +")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	return format;
}

//字符串格式化函数
//str要格式化的字符串，args替换的实际字符串
base.format = function(str,args){
	if (arguments.length>1) {
		var result = str;
		if (arguments.length == 2 && typeof (args) == "object") {
			for (var key in args) {
				var reg=new RegExp ("({"+key+"})","g");
				result = result.replace(reg, args[key]);
			}
		}
		else {
			for (var i = 1; i < arguments.length; i++) {
				if(arguments[i]==undefined)
				{
					return "";
				}
				else
				{
					var reg=new RegExp ("({["+(i-1)+"]})","g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
		return result;
	}
	else {
		return str;
	}
}
base.formatTime = function(value){
	value = value.toFixed(0);
	var iMinutes = Math.floor(value/60);
	var seconds = value-iMinutes*60;
	var hour = Math.floor(iMinutes/60);
	iMinutes = iMinutes - hour * 60;
	iMinutes = iMinutes>9?iMinutes:("0"+iMinutes);
	seconds = seconds>9?seconds:("0"+seconds);
	if (hour>0){
		return hour + ":" + iMinutes +":" + seconds;
	}
	return iMinutes +":" + seconds;
};




/**
 * Created by yanguoxu on 15/4/16.
 */
xuetangX_chart.basePie = function(data,config){

}

xuetangX_chart.basePie.prototype = {
	_init:function(){

	},
	_setBoxSize:function(){
		var container = d3.select(this.config.container)[0][0];
		this._width = this.config.width?this.config.width:container.offsetWidth;
		this._height = this.config.height?this.config.height:container.offsetHeight;
	},
	_setRadius:function(){
		this.radius = Math.min(this._width,this._height)/2-10;
	},
	//更新源数据，刷新图表
	setData:function(data){
		this.config.data = data;
		this.config.data = this.sort(data,this.config["colors"],this.config.valueKey);
		this.drawChart();
	},
	resize:function(obj){
		this.config.width = obj.width;
		this.config.height = obj.height;
		this._setBoxSize();
		this._setRadius();
		this.drawChart();
	},
	sort:function(data,colors,keyValue){

	},
	//计算最大值、最小值
	getRange:function(data,keyValue){
		var maxValue = d3.max(data,function(d){ return d[keyValue]});
		var minValue = d3.min(data, function (d) {
			return d[keyValue];
		});
		var result = [];
		result.push(minValue,maxValue);
		return result;
	},
	//鼠标移动事件
	_mouseOver:function(d){
		if(this.config.onMouseOver!=undefined){
			this.config.onMouseOver.call(this,d,d3.event);
		}
	},
	_mouseLeave:function(d){
		if(this.config.onMouseLeave){
			this.config.onMouseLeave.call(this,d,d3.event);
		}
	},
	destroy:function(){
		this.svgParent.remove();
	},
	on:function(type,callback){
		this.config["on"+base.firstUpperCase(type)] = callback;
	}
};
/**
 * Created by yanguoxu on 15/4/27.
 * 时间轴显示chart
 */
xuetangX_chart.dateRange = function(data,config){
	//如果不提供高度，则自动设置为父容器的高度
	this.config = base.extend({
		width: 600,
		height:75,
		data:data,
		valueKey:"value",
		dateKey:"date",
		container:"",
		margin:{left:0,right:0,top:0,bottom:0}
	},config);
	this._init();
}

xuetangX_chart.dateRange.create = function(data,config){
	return new xuetangX_chart.dateRange(data,config);
}

xuetangX_chart.dateRange.prototype = {
	_init:function(){
		var me=this;

		this.parse = d3.time.format('%Y-%m-%d').parse;
		this.data = this.config.data.map(function (datum) {
			datum._dateX = me.parse(datum[me.config.dateKey]);
			return datum;
		});
		this._svgWidth = this.config.width - this.config.margin.left - this.config.margin.right;
		this._svgHeight = this.config.height - this.config.margin.top - this.config.margin.bottom-30;
		this.drawChart();
	},
	_drawAxis: function (x) {
		var monthFormat = d3.time.format("%m");
		var dayFormat = d3.time.format("%d");
		var xAxis = d3.svg.axis().scale(x).ticks(d3.time.month, 1).tickSize(-this._svgHeight).outerTickSize(0).tickFormat(
						function (d) {
							return parseInt(monthFormat(d), 10) + "月";
						}).tickPadding(10),
				xAxisTicks = d3.svg.axis().scale(x).ticks(d3.time.day, 4).tickSize(-8).outerTickSize(0)
					//.tickFormat(function(d){return dayFormat(d);});
						.tickFormat("");

		if (this.config.dateDomain){
			x.domain([
				this.parse(this.config.dateDomain[0]),
				this.parse(this.config.dateDomain[1])
			]);
		}else{
			x.domain(d3.extent(this.data,function(d){return d._dateX;}));
		}

		//画出X轴线
		this.svg.append('g').attr('class', 'lineChart--xAxisTicks').
				attr('transform', 'translate(0,' + this._svgHeight + ')').call(xAxisTicks);
		//画出顶部X轴线
		var topAxis = d3.svg.axis().orient("top").scale(x);
		this.svg.append("g").attr('class',"top--xAxisTicks").call(topAxis);
		this.svg.append('g').attr('class', 'lineChart--xAxis').
				attr('transform', 'translate(0,' + this._svgHeight + ')').call(xAxis);
	},
	drawChart:function(){
		if (this.svgParent){
			this.svgParent.remove();
		}
		var me=this;
		this.svgParent = d3.select(this.config.container).append("svg").attr("class","chart_dateRang");
		this.svg = this.svgParent
				.attr("width",this.config.width)
				.attr("height",this.config.height)
				.append("g")
				.attr("transform","translate("+this.config.margin.left+","+this.config.margin.top+")");
		var x = d3.time.scale().range([
			0,this._svgWidth
		]);
		this.scale_x = x;
		this._drawAxis(x);
		this.drawData(x);
		this._drawSlider(x);
	},
	//画一个数据折线
	drawData:function(x){
		var me=this;
		//计算数据的value范围
		var dataMin = d3.min(this.data,function(d){return d[me.config.valueKey];}),
				dataMax = d3.max(this.data,function(d){return d[me.config.valueKey];});
		dataMin = dataMin * 0.5;
		dataMax = dataMax *1.2;
		var y_scale = d3.scale.linear()
				.range([this._svgHeight,0])
				.domain([dataMin,dataMax]);
		var line =  d3.svg.line()
				.x(function(d,i){ return x(d._dateX)})
				.y(function(d,i){ return y_scale(d[me.config.valueKey])});
		if (this.dataPath){
			this.dataPath.remove();
		}
		this.dataPath = this.svg.append("path").attr("class","data_path");
		this.dataPath.data([this.data]).attr("d",line);
	},

	_drawSlider:function(x){
		var me=this;
		//开始坐标，宽度、高度、innerHeight、innerTop
		if (!this.config.sliderDate) return;
		var startDate = this.config.sliderDate[0],
				endDate=this.config.sliderDate[1];
		this.sliderStart ={
			position:"start",
			X:x(this.parse(startDate)),
			height:this._svgHeight,
			width:5,
			innerTop : 5,
			innerWidth:7
		};
		this.sliderEnd = {
			position:"end",
			X:x(this.parse(endDate)),
			height:this._svgHeight,
			width:-5,
			innerTop : 5,
			innerWidth:-7
		};
		//拖拽
		var drag = d3.behavior.drag()
				.origin(function(d){
					return d;})
				.on("drag",function(d){
					var endX =  d.X + d3.event.dx;
					if (d.position=="start"){
						if (endX<12 || endX >= me.sliderEnd.X)
							return;
					}else{
						if (endX>me._svgWidth-12 || endX<= me.sliderStart.X)
							return;
					}
					d.X = endX;
					var newlideAry= me._createSliderData(d);
					d3.select(this).attr("points",newlideAry);
					me._updateRect(d);
					me._onChange();
				});

		this.leftRect = this._drawRect(0,this.sliderStart.X);
		var leftSlideAry = this._createSliderData(this.sliderStart);
		this.leftSlider =  this.svg.append("polygon").data([this.sliderStart]).attr("points",leftSlideAry).attr("class","leftSlide").call(drag);

		this.rightRect = this._drawRect(this.sliderEnd.X,this._svgWidth-this.sliderEnd.X);
		var rightSlideAry = this._createSliderData(this.sliderEnd);
		this.rightSlider = this.svg.append("polygon").data([this.sliderEnd]).attr("points",rightSlideAry).attr("class","rightSlide").call(drag);

	},

	//画出rect，设置滑块左、右侧背景色
	_drawRect : function(iStart,iWidth){
		var g =  this.svg.append("g").
				attr("transform","translate("+iStart+",0)").style("opacity",0.2);
		g.append("rect").attr("width",iWidth)
				.attr("height",this._svgHeight-1);
		return g;
	},
	_updateRect : function(slideData){
		if (slideData.position=="start"){
			this.leftRect.select("rect").attr("width", slideData.X);
		}else{
			this.rightRect.attr("transform","translate("+slideData.X+",0)");
			this.rightRect.select("rect").attr("width",this._svgWidth- slideData.X);

		}
	},

	_onChange:function(){
		if (this.config.onChange){
			this.config.onChange(this.getSliderDate());
		}
	},

	_createSliderData:function(data){
		var aData = [];
		var height = this._svgHeight;
		var aPoint=[data.X,height];
		aData.push(aPoint);
		aData.push([data.X,0]);
		aData.push([data.X-data.width,0]);
		aData.push([data.X-data.width,data.innerTop]);
		aData.push([data.X-data.width-data.innerWidth,data.innerTop]);
		aData.push([data.X-data.width-data.innerWidth,height-data.innerTop]);
		aData.push([data.X-data.width,height-data.innerTop]);
		aData.push([data.X-data.width,height]);
		return aData;
	},

	setData:function(data){
		this.config.data = data;
		var me = this;
		this.data = this.config.data.map(function (datum) {
			datum._dateX = me.parse(datum[me.config.dateKey]);
			return datum;
		});
		this.drawData(this.scale_x);
	},

	setSliderDate:function(value){
		this.config.sliderDate = value;
		var startDate = this.config.sliderDate[0],
				endDate=this.config.sliderDate[1];
		this.sliderStart.X =  this.scale_x(this.parse(startDate));
		this.sliderEnd.X = this.scale_x(this.parse(endDate));
		var leftSlideAry = this._createSliderData(this.sliderStart);
		var rightSlideAry = this._createSliderData(this.sliderEnd);

		this.leftSlider.attr("points",leftSlideAry);
		this._updateRect(this.sliderStart);
		this.rightSlider.attr("points",rightSlideAry);
		this._updateRect(this.sliderEnd);

		this._onChange();
	},
	setDateDomain:function(value){
		this.config.dateDomain = value;
		this.drawChart();
	},
	getSliderDate:function(){
		var format = d3.time.format("%Y-%m-%d");
		var startDate = this.scale_x.invert(this.sliderStart.X),
				endDate = this.scale_x.invert(this.sliderEnd.X);
		return [format(startDate),format(endDate)];
	},
	destroy:function(){
		this.svgParent.remove();
	}

}

/**
 * Created by yanguoxu on 15/6/15.
 * 难点分析组件
 */

xuetangX_chart.difficultyAny = function(data,config){
	this.config = base.extend({
		margin:{left:0,top:20,right:0,bottom:0},
		data:data,
		x_key:"date",
		y_key:"size",
		container:"",
		x_start:40,
		y_start:50,
		y2_text_anchor:"end",
		line_circleRadius:4,
		x_ordinalInterval:1,
		minWidth:479,
		symbol_r:4,
		totalNum:0
	},config);
	this._init();
};

xuetangX_chart.difficultyAny.create = function(data,config){
	return new xuetangX_chart.difficultyAny(data,config);
};

xuetangX_chart.difficultyAny.prototype = {
	_init:function(){
		this._interval_x = 40/2;
		var maxNum = this._getTotalLength();
		var totalWidth = maxNum + this.config.margin.left + this.config.margin.right + this.config.x_start;
		if (totalWidth<this.config.minWidth){
			totalWidth = this.config.minWidth;
		}
		this.config.width = totalWidth;


		this._svgWidth = this.config.width - this.config.margin.left - this.config.margin.right-this.config.x_start;
		this._svgHeight = this.config.height - this.config.margin.top - this.config.margin.bottom-this.config.y_start;
		this.svgParent = d3.select(this.config.container).append("svg")
				.attr("class","xueTang_Chart xueTang_difficultyAny")
				.attr("width", this.config.width)
				.attr("height", this.config.height);

		this.svg = this.svgParent.append("g")
				.attr("class","xueTang_difficultyAny_container")
				.attr("transform", "translate(" + this.config.margin.left + "," + this.config.margin.top+ ")");


		this._createYAxis();
		this._createXAxis();
		this._createSectionLine();
		this._createArea();
		this._createEqualCircle();
		//this._addTimeSymbol(this.svg);
	},
	_translateValue:function(value){
		return value;
	},
	//计算X轴总长度和SVG总宽度
	_getTotalLength:function(){
		var article_interval = this._interval_x,article_num = this.config.data.length;
		var section_interval = this._interval_x,section_num = 0;
		this.tickValues = [];

		this._maxCount = 0,this._maxSecondCount=0,
				this._maxThirdCount=0,this._forthCount=0,
				this._maxSumCount=0;


		var last_section_num = 0;
		var start_x = this._interval_x;

		for(var i=0;i<article_num;i++){
			this.tickValues.push(start_x);
			last_section_num = this.config.data[i]["sections"].length;
			start_x += (last_section_num+1) * this._interval_x;
			section_num += last_section_num;

			for(var j=0;j<last_section_num;j++){
				var video_d= this.config.data[i]["sections"][j];
				if (!video_d.data) continue;
				for (var m=0;m< video_d.data.length; m++){
					var tmpD = video_d.data[m];
					//console.log(tmpD);
					var iMax= 0,iSumMax=0;
					if (tmpD.type==0){
						iMax = Math.max(tmpD["secondCount"],tmpD["thirdCount"],tmpD["forthCount"]);
						iSumMax= tmpD["secondCount"] + tmpD["thirdCount"] + tmpD["forthCount"];
						this._maxSecondCount = (this._maxSecondCount>tmpD["secondCount"]?this._maxSecondCount:tmpD["secondCount"]);
						this._maxThirdCount = (this._maxThirdCount>tmpD["thirdCount"]?this._maxThirdCount:tmpD["thirdCount"]);
						this._forthCount = (this._forthCount>tmpD["forthCount"]?this._forthCount:tmpD["forthCount"]);
					}else if(tmpD.type==1){
						iMax = tmpD.errorCount;
					}
					this._maxCount = (this._maxCount>iMax?this._maxCount:iMax);
					this._maxSumCount = (this._maxSumCount>iSumMax?this._maxSumCount:iSumMax);
				}

			}
		}

		//console.log("this._maxCount:"+this._maxCount);
		this._error_scale = d3.scale.linear()
				.domain([0,Math.sqrt(this._maxCount)])
				.range([0,10]);

		if (this.config.totalNum>0){
			this._maxCount = this.config.totalNum;
		}
		//半径调整系数
		this._third_tidy_k = (this._maxSecondCount * 0.6) / this._maxThirdCount;
		this._forth_tidy_k = (this._maxSecondCount * 0.6 * 0.6) / this._maxThirdCount;

		this._circle_R_scale = d3.scale.linear()
				.domain([0,this._translateValue(this._maxCount)])
				.range([0,10]);
		this._area_R_scale = d3.scale.linear()
				.domain([0,this._maxSumCount])
				.range([0,10]);

		var maxNum = section_interval +  article_interval * article_num + section_interval * (section_num);
		return maxNum;
	},

	_createXAxis:function(){
		var me = this;
		//计算X轴总长度
		var maxNum = this._getTotalLength();
		this._x = d3.scale.linear()
				.domain([0,this._svgWidth]) //maxNum
				.range([0,this._svgWidth]);

		if(this.config.hideXAxis){
			return;
		}
		var article_index = 0;
		var xAxis = d3.svg.axis()
				.scale(this._x)
				.tickSize(0)
				.tickPadding(10)
				.orient("bottom")
				.tickFormat(function(d){
					return ++article_index;
					// return d;
				});


		var xAxis2 = d3.svg.axis()
				.scale(this._x)
				.tickSize(0)
				.tickPadding(0)
				.orient("top")
				.tickFormat(function(d){
					return "";
				});

		xAxis.tickValues(this.tickValues);


		this.svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate("+this.config.x_start+"," + this._svgHeight + ")")
				.call(xAxis);
		this.svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate("+this.config.x_start+",0)")
				.call(xAxis2);

	},
	_createYAxis:function(){
		this._y = d3.scale.linear()
				.domain([0,1])
				.range([this._svgHeight,0]);

		if(this.config.hideYAxis){
			return;
		}
		var yAxis = d3.svg.axis()
						.scale(this._y)
						.innerTickSize(-this._svgWidth)
						.outerTickSize(0)
						.tickPadding(5)
						.orient("left")
						.ticks(5,"%")
						.tickFormat(function(d){
							if (d==1){
								return "100% · 时间轴";
							}else{
								return (d*100) + "%";
							};
						})
				;
		//if (this.config.y1_format){
		//    yAxis.tickFormat(this.config.y1_format);
		//}

		var svg_yAxis= this.svg.append("g")
				.attr("class", "y1 axis")
				.attr("transform", "translate("+this.config.x_start+",0)")
				.call(yAxis);



		//去掉Y轴线条的影响
		svg_yAxis.select("path").remove();
		svg_yAxis.selectAll("text").style("text-anchor","start")
				.attr("dx",-35).attr("dy",-5)
		;

		//var yAxis2 = d3.svg.axis()
		//				.scale(this._y)
		//				.innerTickSize(-this.config.x_start)
		//				.outerTickSize(0)
		//				.tickPadding(0)
		//				.orient("left")
		//				.ticks(5,"%")
		//				.tickFormat(function(d){
		//					return "";
		//				})
		//		;
		//var svg_yAxis2= this.svg.append("g")
		//		.attr("class", "y1 axis")
		//		.attr("transform", "translate(0,0)")
		//		.call(yAxis2);
		//
		//svg_yAxis2.select("path").remove();

	},
	/**
	 *生成章节线
	 */
	_createSectionLine:function(){
		var me = this;
		var start_x = this._interval_x;
		var line = d3.svg.line()
				.x(function(d) { return me._x(d.x); })
				.y(function(d) { return me._y(d.y); });
		var g= this.svg.append("g")
				.attr("transform", "translate("+this.config.x_start+",0)")
				.attr("class","chart_line");

		for(var i=0;i<this.config.data.length;i++){
			var sections = this.config.data[i]["sections"];
			for(var j=0;j<sections.length;j++){
				//记录下X轴位置
				sections[j]._x = start_x;
				//划线
				var data= [];
				data.push({x:start_x,y:0});
				data.push({x:start_x,y:1});
				g.append("path").attr("class","data_path_section")
						.data([data])
						.attr("d", line);
				start_x += this._interval_x;
			}
			start_x += this._interval_x;
		}
	},
	_getMinutes:function(stime){
		//var ary = stime.split(":");
		//var hour = parseInt(ary[0],10),
		//    minutes = parseInt(ary[1],10);
		//return minutes * 60 + hour;
		return stime;
	},
	/**
	 * 生成堆叠图
	 */
	_createArea:function(){
		var me = this;
		var g= this.svg.append("g")
				.attr("transform", "translate("+this.config.x_start+",0)")
				.attr("class","chart_line");

		//组织数据
		var  keys = ["forthCount","thirdCount","secondCount"];

		for(var i=0;i<this.config.data.length;i++){
			var sections = this.config.data[i]["sections"];
			for(var j=0;j<sections.length;j++) {
				//获取柱状图数据
				var start_x = sections[j]._x;
				var totalTime = this._getMinutes(sections[j].times);
				var tmp_y = d3.scale.linear()
						.domain([0,totalTime])
						.range([0,1]);

				if (!sections[j].data) continue;

				var layer = sections[j].data.filter(function (d) {
					return d.type == 0;
				});
				var seriesData = keys.map(function (name) {
					return {
						name: name,
						values: layer.map(function (d,i) {
							var middleTime =
									(me._getMinutes(d.times[0]) + me._getMinutes(d.times[1])) >> 1;
							if (d.times[0]==0){
								middleTime = 0;
							}else if(d.times[1]==totalTime){
								middleTime = totalTime;
							}
							return {time: middleTime, y: me._area_R_scale(me._translateValue(d[name]*1.6))};
						})
					}
				});
				var seriesData2 = keys.map(function (name) {
					return {
						name: name,
						values: layer.map(function (d) {
							var middleTime =
									(me._getMinutes(d.times[0]) + me._getMinutes(d.times[1])) >> 1;
							if (d.times[0]==0){
								middleTime = 0;
							}else if(d.times[1]==totalTime){
								middleTime = totalTime;
							}
							return {time: middleTime, y: me._area_R_scale(me._translateValue(d[name]*(-1)*1.6))};
						})
					}
				});
				var area = d3.svg.area()
						.interpolate("basis")
						.y(function (d) {
							return me._y(tmp_y(d.time));
						})
						.x0(function (d) {
							return d.y0;
						})
						.x1(function (d) {
							return d.y0 + d.y;
						});

				var stack = d3.layout.stack()
								.values(function (d) {
									return d.values;
								})
						;
				var stackData = stack(seriesData);
				var stackData2 = stack(seriesData2);
				var stackData = stackData.concat(stackData2);
				//console.dir(stackData);

				var parentArea = g.selectAll(".parentArea_" + i+"_"+j)
						.data(stackData)
						.enter().append("g")
						.attr("transform", function (d) {
							//var middleTime =
							//    (me._getMinutes(d.times[0])+ me._getMinutes(d.times[1]))>>1;
							//d._x = me._x(start_x);
							//d._y = me._y(tmp_y(middleTime));
							//d._totalTime = totalTime;
							//d._owner = this;
							//var y= me._y(0);
							return "translate(" + me._x(start_x) + ",0)";
						})
						.attr("class", "parentArea_" + i + "_"+j);
				parentArea.append("path")
						.attr("class", "area")
						.attr("d", function (d) {
							return area(d.values);
						})
						.style("fill", function (d) {
							if(d.name == "secondCount"){
								return "rgb(254, 206, 51)";
							}else if(d.name == "thirdCount"){
								return "rgb(254,157,51)";
							}else{
								return "#FB8E3A";
							}
							//return "red";
						})
						.attr("opacity",function(d){
							if(d.name == "secondCount"){
								return 0.55;
							}else if(d.name == "thirdCount"){
								return 0.75;
							}else{
								return 0.9;
							}
						});



			}
		}
		//使用Stack生成堆叠图

		//var stack = d3.layout.stack()
		//    //.offset("wiggle")
		//    .values(function(d){return d.data;})
		//    .x(function(d,i){ return d[me.config.x_key];})
		//    .y(function(d){ return d[me.config.y_key]})
		//    .out(function(d,y0,y){d.size0 = y0;});


	},

	/**
	 * 生成等高线
	 */
	_createEqualCircle:function(){
		var me = this;
		var g= this.svg.append("g")
				.attr("transform", "translate("+this.config.x_start+",0)")
				.attr("class","chart_line");

		//var line = d3.svg.line()
		//    .x(function(d) { return me._x(d.x); })
		//    .y(function(d) { return me._y(d.y); });

		for(var i=0;i<this.config.data.length;i++){
			var sections = this.config.data[i]["sections"];
			for(var j=0;j<sections.length;j++){
				if (!sections[j].data || (sections[j].data.length<=0)) continue;
				var data = sections[j].data,
						start_x = sections[j]._x;
				var totalTime = this._getMinutes(sections[j].times);
				var tmp_y = d3.scale.linear()
						.domain([0,totalTime])
						.range([0,1]);

				var tmpClass = "circleEqual"+"_"+i+"_"+j;
				var oneG =  g.selectAll("."+tmpClass)
								.data(data)
								.enter().append("g")
								.attr("class", tmpClass + " circleEqual")
								.attr("type",function(d){
									return d.type;
								})
								.attr("transform",function(d){
									var middleTime =
											(me._getMinutes(d.times[0])+ me._getMinutes(d.times[1]))>>1;
									d._x = me._x(start_x);
									d._y = me._y(tmp_y(middleTime));
									d._totalTime = totalTime;
									d._owner = this;
									return "translate("+me._x(start_x)+","+ d._y +")";
								})
								.on("mouseover",base.proxy(me._mouseOver,me))
								.on("mousemove",base.proxy(me._mouseMove,me))
								.on("mouseleave",base.proxy(me._mouseLeave,me))
						;

				oneG.each(function(d,i){
					var d3_one = d3.select(this);
					if (d.type==0){

						//第二遍
						d3_one.append("circle").
								attr("r",function(d){
									return me._area_R_scale(me._translateValue((d.secondCount+ d.thirdCount+ d.forthCount)*1.6))
								})
								.attr("opacity",0);
						//d3_one.append("circle")
						//		.attr("r", function(d){
						//			//根据面积，计算半径
						//			return me._circle_R_scale(me._translateValue(d.secondCount));
						//		})
						//		.attr("opacity",0)
						//		.attr("fill","#FFCB1E");
                        //
						//d3_one.append("circle")
						//		.attr("r", function(d){
						//			return me._circle_R_scale(me._translateValue(me._third_tidy_k * d.thirdCount));
						//		})
						//		.attr("opacity",0)
						//		.attr("fill","#FDA700");
                        //
						//d3_one.append("circle")
						//		.attr("r", function(d){
						//			return me._circle_R_scale(me._translateValue(me._forth_tidy_k * d.forthCount));
						//		})
						//		.attr("opacity",0)
						//		.attr("fill","#F26F0B");
					}else if(d.type ==1){
						//对应习题答错人数
						d3_one.append("circle")
								.attr("class","xueTang_chart_errorCircle")
								.attr("r", function(d){
									return me._error_scale(Math.sqrt(d.errorCount));
								})
								.attr("opacity",1);
					}else if (d.type==2){
						//难点标记
						var symbol =  d3_one.append("g")
										.attr("transform",function(d){
											return "translate(0,-"+(me.config.symbol_r*2+4)+")"
										})
										.attr("class",function(d){
											return "xueTang_chart_imageLocate";
										})
						//.on("mouseover",base.proxy(me._mouseOver,me))
						//.on("mousemove",base.proxy(me._mouseMove,me))
								;
						symbol.append("circle").attr("r",function(d){
							return me.config.symbol_r;
						});
						symbol.append("g").attr("transform",function(d){
							return "translate(0,7)";
						})
								.append("path")
								.attr("d",d3.svg.symbol().size(function(d){
									return 20;
								}).type("triangle-down"));
					}
				});


			}
		}
	},

	_addTimeSymbol:function(g,time_s){
		var time_g = g.append("g")
				.attr("class","timeSymbol")
				.attr("transform","translate(20,0)");
		time_g.append("rect")
				.attr("fill-opacity","0.7")
				.attr("fill","#000000")
			//.attr("filter","")
				.attr("width",35)
				.attr("height",14)
				.attr("rx",8)
		;
		var textg= time_g.append("text")
						.attr("font-family","Bebas Neue")
						.attr("font-size",10)
						.attr("fill","#ffffff")
				;
		textg.append("tspan").attr("x",6).attr("y",10).text(time_s);
		var rightG = time_g.append("g")
				.attr("transform","translate(23,2)");
		rightG.append("circle").attr("stroke","#ffffff").attr("cx",5)
				.attr("cy",5)
				.attr("r",5)
				.attr("fill","none");
		rightG.append("path").attr("d","M4,7 L4,3 L8,5 L4,7 Z");
		return time_g;

	},

	//hover时效果变化
	_mouseOver:function(d,index){
		//console.log(d3.event);
		//console.log(d);
		var ownerG = d3.select(d._owner);

		if(d.type==1){
			if(this._showBlueCircle) return;
			this._showBlueCircle = true;
			this._blue_circle_g= ownerG.append("g")
					.attr("class","hover_container")
			;
			var tmp_y = d3.scale.linear()
					.domain([0, d._totalTime])
					.range([0,1]);
			var endY = this._y(tmp_y(this._getMinutes(d.times[1])));
			var startY = this._y(tmp_y(this._getMinutes(d.times[0])));
			var r = (startY-endY)>>1;//难点范围
			if (r<=18) r=18;
			//console.log(r);
			this._blue_circle_g.append("circle").attr("r",r).attr("class","hoverCircle_error");

		}
		if (d.type==2) {
			//console.log("ok");
			//画一个蓝色的圆
			if(this._showBlueCircle) return;
			this._showBlueCircle = true;


			this._blue_circle_g= ownerG.append("g")
					.attr("class","hover_container")
			;
			var tmp_y = d3.scale.linear()
					.domain([0, d._totalTime])
					.range([0,1]);
			var endY = this._y(tmp_y(this._getMinutes(d.times[1])));
			var startY = this._y(tmp_y(this._getMinutes(d.times[0])));
			var r = (startY-endY)>>1;//难点范围
			if (r<=18) r=18;
			//console.log(r);
			this._blue_circle_g.append("circle").attr("r",r).attr("class","hoverCircle");
		}

		//if (!this._showTimeSymbol){
		//	this._showTimeSymbol = true;
		//	var middleTime =
		//			(this._getMinutes(d.times[0])+ this._getMinutes(d.times[1]))>>1;
		//	var time_s = base.formatTime(middleTime);
		//	this._timeSymbol_g = this._addTimeSymbol(ownerG,time_s);
		//}


		if(this.config.onMouseOver!=undefined){
			this.config.onMouseOver.call(this,d,index,d3.event);
		}
	},
	_mouseMove:function(d,index){
		if(this.config.onMouseMove){
			this.config.onMouseMove.call(this,d,index,d3.event);
		}
	},
	_mouseLeave:function(d,index){
		//console.log("leave");
		if (this._blue_circle_g)
			this._blue_circle_g.remove();
		if (this._timeSymbol_g)
			this._timeSymbol_g.remove();
		this._showTimeSymbol = false;
		this._showBlueCircle = false;
		if(this.config.onMouseLeave){
			this.config.onMouseLeave.call(this,d,index,d3.event);
		}
	}
}
/**
 * Created by yanguoxu on 15/6/2.
 */

/**
 * Class xuetangX_chart.multiChart
 * @param data {array} 对象数组，指定图表需要的数据
 * @param config {object} - 配置选项(下面的参数为配置项)
 * @param config.margin {object} - 边缘偏离值
 * @param config.x_key {array} -  X轴对应数据中的关键字
 * @param config.y_key {string} - Y轴对应数据中的关键字
 * @param config.container {string} - 要载入图形的容器选择符，必填
 * @param config.x_start {boolean} - X轴起始位置，为Y轴标签等内容留出显示空间
 * @param config.y_start {string} - Y轴起始位置，为X轴标签等内容留出显示空间
 * @param config.y1_rang {boolean} - Y1轴范围，默认会根据数据计算上下范围
 * @param config.y1_format {integer} - 自定义Y1轴标签显示格式化函数
 * @param config.y2_rang {boolean} - Y2轴范围，默认会根据数据计算上下范围
 * @param config.y2_format {boolean} - 自定义Y2轴标签显示格式化函数
 * @param config.line_circleRadius {boolean} - 折线内部圆圈的半径大小
 * @constructor
 */
xuetangX_chart.multiChart = function(data,config){
	this.config = base.extend({
		margin:{left:20,top:20,right:0,bottom:0},
		data:data,
		x_key:"date",
		y_key:"size",
		container:"",
		x_start:40,
		y_start:50,
		y1_rang:undefined,
		y1_format:undefined,
		y2_rang:undefined,
		y2_format:undefined,
		y2_text_anchor:"end",
		line_circleRadius:4,
		x_ordinalInterval:1
	},config);
	this._init();
};

xuetangX_chart.multiChart.create = function(data,config){
	return new xuetangX_chart.multiChart(data,config);
};

xuetangX_chart.multiChart.prototype = {
	_init:function(){
		this._svgWidth = this.config.width - this.config.margin.left - this.config.margin.right-this.config.x_start*2;
		this._svgHeight = this.config.height - this.config.margin.top - this.config.margin.bottom-this.config.y_start;

		this.svgParent = d3.select(this.config.container).append("svg")
				.attr("class","xueTang_multiChart")
				.attr("width", this.config.width)
				.attr("height", this.config.height);

		this.svg = this.svgParent.append("g")
				.attr("class","xueTang_multiChart_container")
				.attr("transform", "translate(" + this.config.margin.left + "," + this.config.margin.top+ ")");

		this._createXAxis();
		this._createYAxis();
		this._createBackGround();
		this._createRect();
		this._createLine();
		this._bindEvent();
	},
	//生成X轴
	_createXAxis:function(){
		var me = this;
		var x_domainAry = this.config.data[0]["data"].map(function(d){return d[me.config.x_key];});
		this._x = d3.scale.ordinal()
				.domain(x_domainAry) //获取日期
				.rangeRoundBands([0, this._svgWidth], .1);

		if(this.config.hideXAxis){
			return;
		}
		var xAxis = d3.svg.axis()
				.scale(this._x)
				.tickSize(0)
				.tickPadding(6)
				.orient("bottom");

		if (this.config.x_ordinalInterval>1){
			var ticksValue = x_domainAry.filter(function(d,i){
				return (i % me.config.x_ordinalInterval) == 0;
			});
			xAxis.tickValues(ticksValue);
		}


		this.svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate("+this.config.x_start+"," + this._svgHeight + ")")
				.call(xAxis);

	},

	_getMaxValue:function(data_axis){
		var dataMax= 0,dataMin=0;
		var me = this;
		for (var i= 0;i<data_axis.length;i++){
			var numMax = d3.max(data_axis[i]["data"],function(d){return d[me.config.y_key];});
			var numMin = d3.min(data_axis[i]["data"],function(d){return d[me.config.y_key];});
			dataMax= dataMax > numMax ? dataMax : numMax;
			dataMin = dataMin < numMin ? dataMin : numMin;
		}
		return [dataMin,dataMax];
	},
	_getMaxValue_stack:function(data_axis){
		//使用Stack生成堆叠图的最大值
		var me = this;
		var stack = d3.layout.stack()
				.values(function(d){return d.data;})
				.x(function(d,i){ return d[me.config.x_key];})
				.y(function(d){ return d[me.config.y_key]})
				.out(function(d,y0,y){d.size0 = y0;});
		//获取柱状图数据
		var layer = data_axis.filter(function(d){
			return d.type == 'bar';
		});
		if (layer.length<=0) return false;
		var data = stack(layer);

		var dataMax= 0,dataMin=0;

		for (var i= 0;i<data.length;i++){
			var numMax = d3.max(data[i]["data"],function(d){return d.size0 + d[me.config.y_key];});
			dataMax= dataMax > numMax ? dataMax : numMax;
			var numMin = d3.min(data_axis[i]["data"],function(d){
				if (d.size0*d[me.config.y_key]>0){
					return d.size0 + d[me.config.y_key];
				}else
					return d[me.config.y_key];
			});
			//if (numMin<=0) continue;
			dataMin = dataMin < numMin ? dataMin : numMin;
		}

		return [dataMin,dataMax];
	},

	//生成Y轴
	_createYAxis:function(){
		//获取Y轴区间
		var data_axis1 = this.config.data.filter(function(d){
			return d.yAxis == 1;
		});

		var data_axis2 = this.config.data.filter(function(d){
			return d.yAxis == 2;
		});

		var dataRange1 = this._getMaxValue(data_axis1),
				dataRange2 = this._getMaxValue(data_axis2);


		var dataRang_bar = this._getMaxValue_stack(data_axis1);
		var dataRang_bar2 = this._getMaxValue_stack(data_axis2);
		if (dataRang_bar !== false){
			dataRange1[0] = Math.min(dataRange1[0],dataRang_bar[0]);
			dataRange1[1] = Math.max(dataRange1[1],dataRang_bar[1])
		}
		if (dataRang_bar2 !==false){
			dataRange2[0] = Math.min(dataRange2[0],dataRang_bar2[0]);
			dataRange2[1] = Math.max(dataRange2[1],dataRang_bar2[1])
		}

		this._getMaxValue_stack(data_axis2);
		this._y = d3.scale.linear();
		if (this.config.y1_rang){
			this._y.domain(this.config.y1_rang);
		}else{
			this._y.domain(dataRange1);
		}

		this._y.range([this._svgHeight, 0]);

		this._y2 = d3.scale.linear();
		if (this.config.y2_rang){
			this._y2.domain(this.config.y2_rang);
		}else{
			this._y2.domain(dataRange2);
		}

		this._y2.range([this._svgHeight, 0]);


		if(this.config.hideYAxis){
			return;
		}
		var yAxis = d3.svg.axis()
				.scale(this._y)
				.tickSize(-this._svgWidth)
				.tickPadding(5)
				.orient("left")
		
		// 制定y轴
		if(this.config.y1_tickValues){
			yAxis.tickValues(this.config.y1_tickValues)
		}

		if (this.config.y1_format){
			yAxis.tickFormat(this.config.y1_format);
		}

		this.svg.append("g")
				.attr("class", "y1 axis")
				.attr("transform", "translate("+this.config.x_start+",0)")
				.call(yAxis);

		var yAxis2 = d3.svg.axis()
				.scale(this._y2)
				.tickSize(1)
				.tickPadding(this.config.y2_text_anchor=="end"?36:5)
				.orient("right")
		if (this.config.y2_format){
			yAxis2.tickFormat(this.config.y2_format)
		}

		this.svg.append("g")
				.attr("class", "y2_axis")
				.attr("transform", "translate("+(this._svgWidth+this.config.x_start)+",0)")
				.call(yAxis2);
		if (this.config.y2_text_anchor=="end"){
			this.svg.selectAll(".y2_axis text").style("text-anchor","end");
		}

	},
	_createBackGround:function(){
		var data = this.config.backGroundData;
		if (!data) return;
		var me = this;
		for (var i=0; i<= data.length-1;i++){
			//生成一个柱状图
			var tmpData = data[i]["data"];
			var styleClass = (data[i].styleClass?data[i].styleClass:"");
			var  bar = this.svg.selectAll(".backGroundBar"+i)
					.data([tmpData])
					.enter().append("g")
					.attr("class","backGroundBar"+i)
					.attr("transform",function(d){ return "translate("+(me.config.x_start + me._x(d[0]))+",0)"});
			bar.append("rect")
					.attr("class",function(d){ return styleClass})
					.attr("y",function(d){
						return 0;})
					.attr("height",function(d){
						return me._svgHeight;
					})
					.attr("width",function(d){ return me._x(d[1])-me._x(d[0]) + me._x.rangeBand();})
					.attr("fill",data[i].color);
		}
	},
	//生成堆叠柱状图
	_createRect:function(){
		//return;
		var me =this;
		var barWidth = this._x.rangeBand();

		//使用Stack生成堆叠图
		var stack = d3.layout.stack()
			//.offset("wiggle")
				.values(function(d){return d.data;})
				.x(function(d,i){ return d[me.config.x_key];})
				.y(function(d){ return d[me.config.y_key]})
				.out(function(d,y0,y){d.size0 = y0;});
		//获取柱状图数据
		var layer = this.config.data.filter(function(d){
			return d.type == 'bar';
		});
		if (layer.length<=0) return;
		//console.dir(layer);
		//return;
		var data = stack(layer);


		//console.dir(data);

		for (var i=0; i<= layer.length-1;i++){
			//生成一个柱状图
			var tmpData = layer[i]["data"];
			var styleClass = (layer[i].styleClass?layer[i].styleClass:"");
			var  bar = this.svg.selectAll(".bar"+i)
					.data(tmpData)
					.enter().append("g")
					.attr("class","bar"+i)
					.attr("transform",function(d){ return "translate("+(me.config.x_start + me._x(d[me.config.x_key]))+",0)"})
			bar.append("rect")
					.attr("class",function(d){ return styleClass+ (d.styleClass?d.styleClass:"");})
					.attr("y",function(d){
						if (d[me.config.y_key]<0){
							return me._y(0);
						}
						return me._y(d["size0"] + d[me.config.y_key]);})
					.attr("height",function(d){
						return Math.abs(me._y(0) - me._y(d[me.config.y_key]));
					})
					.attr("width", this._x.rangeBand())
					.attr("fill",function(d){ return d.color? d.color:layer[i].color})
					.on("mouseover",base.proxy(this._mouseOver,this))
					.on("mousemove",base.proxy(this._mouseMove,this));
			bar.append("text")
					.attr("x",barWidth>>1)
					.attr("y",function(d){
						if(d[me.config.y_key]>0){
							return me._y(d[me.config.y_key])-3;
						}
						else {
							return me._y(d[me.config.y_key])+3;
						}
					})
					.attr("dy",".75em")
					.text(function(d){ return d.text? d.text:"";});
		}


	},
	//生成折线
	_createLine:function(){
		var me=this;
		var lineAry = this.config.data.filter(function(d){
			return d.type == "line";
		});

		for(var i= 0; i<= lineAry.length-1;i++){
			var line = d3.svg.line()
					.x(function(d) { return  (me._x.rangeBand()>>1) + me._x(d[me.config.x_key]); }) //离散性数据，偏移到X轴标签中间
					.y(function(d) { return me._y2(d[me.config.y_key]); });
			//.interpolate("basis");
			var data = lineAry[i].data;
			//console.log(data);
			var g= this.svg.append("g")
					.attr("transform", "translate("+this.config.x_start+",0)")
					.attr("class","chart_line");
			g.append("path").attr("class","data_path_out")
					.data([data])
					.attr("d", line);
			g.append("path").attr("class","data_path "
			+ (lineAry[i].styleClass?lineAry[i].styleClass:""))
					.data([data])
					.attr("d", line)
					.on("mouseover",base.proxy(this._mouseOver,this))
					.on("mousemove",base.proxy(this._mouseMove,this));

			this._createCircleOfLine(g,line,data);
		}

	},
	//生成折线上的圆圈
	_createCircleOfLine:function(g,line,data){
		g.selectAll(".circleOut")
				.data(data)
				.enter().append("circle")
				.attr("class", "circleOut")
				.attr("cx", line.x())
				.attr("cy", line.y())
				.attr("r", this.config.line_circleRadius+2);

		g.selectAll(".circleDot")
				.data(data)
				.enter().append("circle")
				.attr("class", "circleDot")
				.attr("cx", line.x())
				.attr("cy", line.y())
				.attr("r", this.config.line_circleRadius)
				.on("mouseover",base.proxy(this._mouseOver,this))
				.on("mousemove",base.proxy(this._mouseMove,this));
	},
	//生成hover等事件
	_bindEvent:function(){
		this.svgParent.select(".xueTang_multiChart_container").on("mouseleave",base.proxy(this._mouseLeave,this));
	},

	//更新数据，重新绘制图形
	updateData:function(data){
		this.svgParent.remove();
		this.config.data = data;
		this._init();
	},
	//鼠标移动事件
	_mouseOver:function(d,index){
		if(this.config.onMouseOver!=undefined){
			this.config.onMouseOver.call(this,d,index,d3.event);
		}
	},
	_mouseLeave:function(d,index){
		if(this.config.onMouseLeave){
			this.config.onMouseLeave.call(this,d,index,d3.event);
		}
	},
	_mouseMove:function(d,index){
		if(this.config.onMouseMove){
			this.config.onMouseMove.call(this,d,index,d3.event);
		}
	},
	/**
	 * 绑定事件
	 * @param type {string} - 事件名称
	 * @param callback {function} - 回调函数
	 */
	on:function(type,callback){
		this.config["on"+base.firstUpperCase(type)] = callback;
	},
	/**
	 * 移除该组件
	 */
	destroy:function(){
		this.svgParent.remove();
	}

};


/**
 * Created by yanguoxu on 15/4/13.
 * 提供多层饼状，下层通过树形下级数据提供
 */
xuetangX_chart.multiPie = function(data,config){
	this.config = base.extend({
		margin:{left:0,top:0,right:0,bottom:0},
		data:data,
		valueKey:"value",
		colorKey:"color",
		childrenKey : "children",
		container:"",
		depth:3
	},config);
	this._init();
}

base.extendClass(xuetangX_chart.multiPie,xuetangX_chart.basePie);

base.extend(xuetangX_chart.multiPie.prototype,/** @lends xuetangX_chart.multiPie.prototype */{
	_init : function(){
		var me=this;
		this._setBoxSize();
		this._setRadius();

		this.colors = d3.scale.category10();
		//计算亮度
		this.luminance = d3.scale.sqrt()
				.domain([0, 1e6])
				.clamp(true)
				.range([90, 20]);

		this.arc = d3.svg.arc()
				.startAngle(function(d) { return d.x; })
				.endAngle(function(d) { return d.x + d.dx - .01 / (d.depth + .5); })
				.innerRadius(function(d) { return me.radius / (me.config.depth+1) * d.depth; })
				.outerRadius(function(d) { return me.radius / (me.config.depth+1) * (d.depth + 1) - 1; });

		this.drawChart();
	},

	_fill :function(d){
		var p = d;
		while (p.depth > 1) p = p.parent;
		//console.log(this.colors(p.name));
		var c = d3.lab(this.colors(p.name));
		c.l = this.luminance(d.value);
		return c;
	},
	drawChart:function(){
		if(this.svgParent){
			this.svgParent.remove();
		}

		var me= this;
		this.svgParent = d3.select(this.config.container).append("svg")
				.attr("width", this._width)
				.attr("height", this._height);

		this.svg = this.svgParent.append("g")
				.attr("class","container")
				.attr("transform", "translate(" + this._width/2 + "," + this._height/2 + ")");

		this.partition = d3.layout.partition()
				.sort(null)
				.size([2 * Math.PI, this.radius]);

		this.partition
				.value(function(d) { return d[me.config.valueKey]; })
				.nodes(this.config.data)
				.forEach(function(d) {
					d._children = d[me.config.childrenKey];
					d.fill = me._fill(d);

				});

		this.partition
				.children(function(d, depth) { return depth < me.config.depth ? d._children : null; });

		//中心圆
		var center = this.svg.append("circle")
				.attr("r", this.radius / (this.config.depth+1))
				.style("fill","white");

		//路径绘制
		var path = this.svg.selectAll("path")
				.data(this.partition.nodes(this.config.data).slice(1))
				.enter().append("path")
				.attr("d", this.arc)
				.style("fill", function(d,i) { return d.fill; })
				.on("mouseover",base.proxy(this._mouseOver,this));
		this.svgParent.select(".container").on("mouseleave",base.proxy(this._mouseLeave,this));

	}
});
/**
 * Created by yanguoxu on 15/4/13.
 */

/**
 * 提供单层饼状显示效果，中间为空和不为空两种效果
 * donut 甜甜圈
 * annulus环型
 */

xuetangX_chart.Pie = function(data,config){
	//如果不提供高度，则自动设置为父容器的高度
	this.config = base.extend({
		// width: 300,
		//height:300,
		data:data,
		valueKey:"value",
		container:"",
		mode:"pie" //[donut,pie]
	},config);
	this.config.data = this.sort(data,this.config["colors"],this.config.valueKey);
	//设置高度，宽度
	this._setBoxSize();


	this._init();

};

xuetangX_chart.Pie.create = function(data,config){
	return new xuetangX_chart.Pie(data,config);
}

base.extendClass(xuetangX_chart.Pie,xuetangX_chart.basePie);

base.extend(xuetangX_chart.Pie.prototype,/** @lends xuetangX_chart.Pie.prototype */{
	_init:function(){
		var me= this;
		var data_key = this.config.valueKey;
		this.pie = d3.layout.pie()
				.value(function(d) { return data_key?d[data_key]:d })
				.sort(null);//取消默认排序，默认讲叙

		//计算亮度
		//this.luminance = d3.scale.sqrt()
		//    .domain([me._minValue,me._maxValue])
		//    .clamp(true)
		//    .range([90, 20]);

		var a = d3.rgb(255,210,56);
		var b = d3.rgb(255,245,212);
		b = this.config.colorRange?d3.rgb(this.config.colorRange[1]):b;
		a = this.config.colorRange?d3.rgb(this.config.colorRange[0]):a;
		this.luminance = d3.scale.linear()
				.domain(this.config.colorDomain?this.config.colorDomain:[me._minValue,me._maxValue])
				.range([b,a]);

		this.drawChart();

	},
	_calculateRadius:function(){
		this.radius = Math.min(this._width,this._height)/2-10;

		this._outerRadius = this.config.outerRadius? this.config.outerRadius:
		this.radius - 20,
				this._innerRadius= this.config.innerRadius?this.config.innerRadius :this._outerRadius/2;
		//设置内圈半径
		if(this.config.mode=="pie"){
			this._innerRadius = 0;
		}
	},
	//排序，第一个为最大值，后面以降序排列，同步调整colors数组属性顺序。
	sort:function(data,colors,keyValue){
		var isObject = false;
		if (typeof data[0]== "object"){
			isObject = true;
		}
		if (colors && isObject){
			for (var i= 0;i<data.length;i++){
				data[i]["_color"] = colors[i]?colors[i]:undefined;
			}
		}
		data.sort(function(a,b){
			if (isObject){
				return a[keyValue]>b[keyValue];
			}
			return a<b;
		});

		var maxObj = data.pop();
		var ilen = data.length;
		if(isObject){
			this._maxValue =maxObj[keyValue];
			this._minValue= data[0][keyValue];
		}else{
			this._maxValue = maxObj;
			this._minValue = data[0];
		}
		data.splice(0,0,maxObj);


		return data;
	},
	_fill :function(d){
		//var c = d3.lab(this.config.mainColor);
		//c.l = this.luminance(d.value);
		//return c;
		return this.luminance(d.value);
	},

	drawChart:function(){
		if (this.svgParent){
			this.svgParent.remove();
		}
		this._calculateRadius();
		this.arc = d3.svg.arc()
				.innerRadius(this._innerRadius)
				.outerRadius(this._outerRadius);
		var me=this;
		this.svgParent = d3.select(this.config.container).append("svg");
		this.svg =   this.svgParent.attr("width", this._width)
				.attr("height", this._height)
				.append("g")
				.attr("class","container")
				.attr("transform", "translate(" + this._width / 2 + "," + this._height / 2 + ")");

		var color = d3.scale.category20();
		var colorKey= this.config.colorKey;
		this.path = this.svg.datum(this.config.data).selectAll("path")
				.data(this.pie)
				.enter().append("path")
				.attr("fill", function(d, i) {
					return (d.data["_color"])? d.data["_color"]:
							(me.config.colorRange?me._fill(d):color(i));
				})
				.attr("d", this.arc)
				.on("mouseover",base.proxy(this._mouseOver,this));
		this.svgParent.select(".container").on("mouseleave",base.proxy(this._mouseLeave,this));

	}

});




/**
 * Created by yanguoxu on 15/5/12.
 * 显示力导图、边缘捆绑图，并提供相互切换的动画功能
 */
xuetangX_chart.relationChart = function(data,links,config){
	//如果不提供高度，则自动设置为父容器的高度
	this.config = base.extend({
		// width: 300,
		//height:300,
		data:data,
		links:links,
		valueKey:"name",
		IndexKey:"name",
		group_Key:"group",
		disc_key:"", //实心关键字
		circle_key:"", //空心圆关键字
		container:"",
		mode:"pie", //[donut,pie]
		showText:false,
		textKey:"name",
		tension:0.85,
		linkWidthMax:1,
		linkDistance:180,
		linkCharge:-100,
		linkOpacity:0.1,
		linkDefaultColor:"#bebebe",
		circleMaxR:40,
		circleMaxR_1:5,
		circleMinR:0,
		rotate:180,
		margin:{left:0,right:0,top:0,bottom:0}
	},config);

	this._init();

};
xuetangX_chart.relationChart.create = function(data,links,config){
	return new xuetangX_chart.relationChart(data,links,config);
}

xuetangX_chart.relationChart.prototype = {
	_init:function(){
		//复制data
		var me = this;

		this._circle_key_max = d3.max(this.config.data.children,function(d){
			return d[me.config.circle_key];
		});

		this._disc_key_max = d3.max(this.config.data.children,function(d){
			return d[me.config.disc_key];
		});

		this._both_circle_key_maxValue = Math.max(this._circle_key_max,this._disc_key_max);


		this._data_bunlde = this.config.data;
		this._data_force = base.deepClone(this.config.data);

		this.isCurrent = "bundle";

		this._svgWidth = this.config.width - this.config.margin.left - this.config.margin.right;
		this._svgHeight = this.config.height - this.config.margin.top - this.config.margin.bottom;


		//实现边缘绑定
		var diameter = Math.min(this._svgWidth,this._svgHeight),
				radius = diameter / 2,
				innerRadius = this.config.showText? radius - 120:radius-10;
		this.radius = radius;

		this._setCircleMax(this.config.data.children);


		this.cluster = d3.layout.cluster()
				.size([360, innerRadius])
				.sort(null)
				.value(function(d,i) { return Math.max(d[me.config.disc_key],d[me.config.circle_key]);
				});

		this.bundle = d3.layout.bundle();

		this.line = d3.svg.line.radial()
				.interpolate("bundle")
				.tension(this.config.tension)  //.85
				.radius(function(d) { return d.y; })
				.angle(function(d) { return (d.x-(me.config.rotate-90)) / 180 * Math.PI; });


		this.svgParent = d3.select(this.config.container).append("svg").attr("class","xueTang_relationChart")
				.on("click",base.proxy(this._svgClick,this));
		this.svg = this.svgParent
				.attr("width",this.config.width)
				.attr("height",this.config.height)
				.append("g")
				.attr("class","")
				.attr("transform","translate("+this.config.margin.left+","+this.config.margin.top+")");


		this.innerSvg= this.svg.append("g")
				.attr("transform", "translate(" + radius + "," + radius + ")");

		//继承关系的数组，转化成1维数组
		this._data_bundle_after =  this.cluster.nodes(this._data_bunlde);

		//console.log(this._data_bundle_after);

		this._update_bundle_data(this._data_bundle_after);

		var ilength = this.config.data.children.length;
		//console.log(ilength);

		//根据数据数量，重新计算属性值
		this.config.linkDistance = this.radius * (Math.sqrt(Math.PI*4/(Math.sqrt(3)*ilength)));
		//console.log(this.config.linkDistance);
		this.config.linkDistance = this.config.linkDistance*Math.sqrt(2);
		this.config.linkCharge = this.config.linkDistance * (-1);
		this.force = d3.layout.force()
				.charge(this.config.linkCharge)
				.linkDistance(this.config.linkDistance)
				.linkStrength(function(d,index){
					//console.log(1-(d.value/me.links_maxValue));
					return 1-(d.value/me.links_maxValue);
				})
				.size([diameter, diameter]);//diameter


		this._processLinkData(this.config.links);

		this.force.nodes(this._data_force["children"])
				.links(this._link_force)
				.start();
		//console.dir(this._data_force["children"]);
		//console.dir(this._link_force);
		//计算边界
		var _minX = 0,_maxX = 0,_minY = 0,_maxY =0;
		var maxCircle = 0;
		this.maxCircle_index = 0;
		this._data_force["children"].forEach(function(d,i){
			if(d.x<_minX) _minX = d.x;
			if (d.x>_maxX) _maxX = d.x;
			if (d.y<_minY) _minY = d.y;
			if (d.y>_maxY) _maxY = d.y;
			var bigCount = Math.max(d[me.config.disc_key],d[me.config.circle_key]);
			if (bigCount>maxCircle){
				maxCircle = bigCount;
				me.maxCircle_index = i;
			}

		});
        //var middle_X = (_minX+_maxX) >>1;
		//var middle_Y = (_minY+_maxY) >>1;

		//力导图位置偏移量，为了最大的圆在中心
		this._force_offset_x = 0;
		this._force_offset_y = 0;

		this._scale_postion_X = d3.scale.linear()
				.range([_minX,_maxX])
				.domain([0,diameter]);

		this._scale_postion_Y = d3.scale.linear()
				.range([_minY,_maxY])
				.domain([0,diameter]);

		this.changeBundle(true);
		//this.changeForce();
	},
	_update_bundle_data:function(data){
		var  sum = 0;
		for(var i=0;i<this.config.data.children.length;i++){
			var item = this.config.data.children[i];
			//console.log(item);
			var bigCount = Math.max(item[this.config.disc_key],item[this.config.circle_key]);
			if (bigCount < 2){ bigCount =2;}
			sum += Math.sqrt(bigCount);
		}
		//console.log(sum);
		var startX = 0;
		for(var i=0;i<data.length;i++){
			var item = data[i];
			if (item.children) continue;
			var tmpValue = item.value;
			if (tmpValue < 2){ tmpValue =2;}
			var  addX = 360 * (Math.sqrt(tmpValue))/sum;
			startX += addX;
			item.x = startX-(addX>>1);
		}
	},
	//转换关联数据
	_processLinkData:function(linkAry){
		var me = this;
		var link_force = [],link_bundle = [];
		var map_force = {},map_bundle={};
		//console.log(this._data_force_nodes);
		this._data_force.children.forEach(function(d){
			map_force[d[me.config.IndexKey]] = d;
		});
		this._data_bunlde.children.forEach(function(d){
			map_bundle[d[me.config.IndexKey]] = d;
		});

		this.links_maxValue = d3.max(linkAry, function (d) {
			return d[me.config.links_key["value"]];
		});

		var s= "";
		for (var i=0;i<linkAry.length;i++){
			var curObj = linkAry[i];
			var sourceName = curObj[this.config.links_key["source"]],
					targetName = curObj[this.config.links_key["target"]];
			if (sourceName == targetName) continue;
			if((!map_force[sourceName]) || (!map_force[targetName])){
				if (!map_force[sourceName]){
					s =s + ","+ sourceName;
				}
				if (!map_force[targetName]){
					s =s + ","+ targetName;
				}
			}
			if (map_force[sourceName] && map_force[targetName]){
				link_force.push({source: map_force[sourceName],target:map_force[targetName],value:curObj[this.config.links_key["value"]]});
				link_bundle.push({source: map_bundle[sourceName],target:map_bundle[targetName],value:curObj[this.config.links_key["value"]]});
			}
		}
		//console.log(s);
		//关联数据，力导图
		this._link_force = link_force;

		//console.log(link_force);
		//关联数据，边缘捆绑
		this._link_bundle = link_bundle;

	},

	_getStrokeWidth:function(d){
		if (this.config.linkWidthMax==1){
			return 1;
		}
		return d.value?Math.sqrt(d.value)/ Math.sqrt(this.links_maxValue) * this.config.linkWidthMax:1;
	},

	_setCircleMax:function(data){
		var  sum = 0;
		for(var i=0;i<data.length-1;i++){
			var bigCount = Math.max(data[i][this.config.disc_key],data[i][this.config.circle_key]);
			//console.log(bigCount);
			sum += Math.sqrt(bigCount);
		}

		var maxR = Math.PI * this.radius / sum * Math.sqrt(this._both_circle_key_maxValue);
		//console.log(maxR);
		if (maxR>this.config.circleMaxR)
			maxR = this.config.circleMaxR;
		if (maxR<this.config.circleMaxR_1){
			maxR = this.config.circleMaxR_1;
		}
		this.maxR = maxR;
		this._scale_R = d3.scale.linear()
				.range([this.config.circleMinR,maxR])
				.domain([0,Math.sqrt(this._both_circle_key_maxValue)]);
	},

	createCircle: function (g, me) {
		g.append("circle")
				.attr("class", "disc_circle")
				.attr("r", function (d) {
					//return d[me.config.disc_key];
					var value = d[me.config.disc_key];
					if (value==0){
						return 0;
					}
					return me._scale_R(Math.sqrt(value));
					//return Math.sqrt(value)/ Math.sqrt(me._disc_key_max) * me.config.circleMaxR;
				})
				.attr("fill", function (d) {
					return me.config.groups[d[me.config.group_Key]];
				});
		g.append("circle")
				.attr("class", "circle_circle")
				.attr("r", function (d) {
					//return d[me.config.circle_key];
					var value = d[me.config.circle_key];
					if (value==0){
						return 0;
					}
					return me._scale_R(Math.sqrt(value));
					//return Math.sqrt(value)/ Math.sqrt(me._circle_key_max) * me.config.circleMaxR;
				})
				.attr("stroke", function (d) {
					return me.config.groups[d[me.config.group_Key]];
				});

		if (this.config.showText) {
			g.append("text")
					.attr("dx", function (d) {
						return d.x < 180 ? 12 : -12;
					})
					.attr("dy", ".31em")
					.attr("text-anchor", function (d) {
						return d.x < 180 ? "start" : "end";
					})
					.attr("transform", function (d) {
						return d.x < 180 ? null : "rotate(180)";
					})
					.text(function (d) {
						return d[me.config.textKey];
					});
		}
	},
	changeBundle : function(isInit){
		var me = this;

		this.innerSvg.selectAll(".link")
				.data(this.bundle(this._link_bundle))
				.enter().append("path")
				.attr("class", "link")
				.attr("link_name1",function(d){
					return d[0][me.config.IndexKey];})
				.attr("link_name2",function(d){
					return d[2][me.config.IndexKey];
				})
				.attr("stroke",function(d){
					return  me.config.linkDefaultColor;  //me.config.groups[d[0][me.config.group_Key]];
				})
				.style("stroke-width", function(d,i) {
					return me._getStrokeWidth(me._link_bundle[i]);
				})
				.attr("opacity",this.config.linkOpacity)
				.on("mouseover",function(d,index){
					d3.select(this).attr("opacity",1);
					if (me.config.onLineMouseOver){
						me.config.onLineMouseOver.call(me,d,index,d3.event);
					}
				})
				.on("mouseleave",function(d,index){
					d3.select(this).attr("opacity",me.config.linkOpacity);
					if (me.config.onLineMouseLeave){
						me.config.onLineMouseLeave.call(me,d,index,d3.event);
					}
				});;
		if(isInit){
			this.innerSvg.selectAll(".link").attr("d", function(d){ return me.line(d)});

		}else{
			//线得动画
			this.innerSvg.selectAll(".link").transition().duration(3000)
					.attrTween("d",function(d){
						var old_obj;
						var endObj = {
							source :me.translatePosition(d[0], {isXY:false}),
							target: me.translatePosition(d[2], {isXY:false})
						};

						this._current = this._current?this._current:endObj;

						var interpolate = d3.interpolate(
								this._current,endObj);
						this._current = interpolate(0);
						var radius = this.radius;
						return function(t) {
							var tt = interpolate(t);
							if (t==1){
								return me.line(d);
							}else
								return "M"+ (tt.source.x-me.radius)+"," + (tt.source.y-me.radius)
										+" L"+ (tt.target.x -me.radius)+ ","+ (tt.target.y-me.radius);
						};
					});
		}


		var g = this.innerSvg.selectAll(".node")
				.data(this._data_bundle_after.filter(function(n) { return !n.children; }))
				.enter().append("g")
				.attr("class", "node")
				.attr("node_name",function(d){
					d.domNode = this;
					return d[me.config.IndexKey];})
				.on("click",base.proxy(this._nodeClick,this))
				.on("mouseover",base.proxy(this._mouseOver,this))
				.on("mousemove",base.proxy(this._mouseMove,this))
				.on("mouseleave",base.proxy(this._mouseLeave,this));

		//var node = innerSvg.selectAll(".node").
		//    attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
		var node = this.innerSvg.selectAll(".node");


		node.transition().duration(3000)
				.attrTween("transform",function(d){
					var oldObj;
					if (this._current){
						//坐标转换
						oldObj=me.translatePosition(this._current,{isXY:true});
					}

					this._current = oldObj || d;
					var interpolate = d3.interpolate(
							{x:this._current.x,y:this._current.y}, {
								x: d.x,y: d.y
							});
					this._current = interpolate(0);
					return function(t) {
						//t =0;
						var tt = interpolate(t);
						return "rotate(" + (tt.x - me.config.rotate) + ")translate(" +tt.y + ")";
					};
				});
		this.createCircle(g, me);
		this.innerSvg.selectAll("text").attr("opacity",1);
	},
	translatePosition : function(oldPos,optional){
		if (optional.isXY){//x,y坐标
			var newPos={};
			newPos.x =  (Math.atan2(oldPos.y- this.radius,oldPos.x-this.radius)/Math.PI)*180 +this.config.rotate;
			newPos.y = Math.sqrt(Math.pow(oldPos.x- this.radius,2)+Math.pow(oldPos.y-this.radius,2));
			return newPos;

		}else{//极坐标
			var newRole = (oldPos.x-this.config.rotate)/180 * Math.PI;
			var c_Y = oldPos.y * Math.sin(newRole);
			var c_X = oldPos.y * Math.cos(newRole);

			var newPos = {};
			newPos.x = c_X+ this.radius;
			newPos.y = c_Y+ this.radius;
			return newPos;
		}
	},
	//实现力导图
	update : function (){
		if (this.isCurrent=="bundle"){
			this.isCurrent= "force";
			this.changeForce();
		}else{
			this.isCurrent="bundle";
			this.force.stop();
			this.changeBundle();
		}
	},
	changeForce : function(){
		var me= this;
		var color = d3.scale.category20();

		//this.innerSvg.selectAll(".node")
		//		.data(this._data_force["children"]).enter().append("g").attr("class","node");
		//this.innerSvg.selectAll(".link")
		//		.data(this._link_force).enter().append("path").attr("class","link");

		var node = this.innerSvg.selectAll(".node")
				.data(this._data_force["children"])
				.attr("node_name",function(d){
					d.domNode = this;
					return d[me.config.IndexKey];});



		//new
		//this.createCircle(node, me);

		this.innerSvg.selectAll("text").attr("opacity",0);

		var link = this.innerSvg.selectAll(".link")
				.data(this._link_force)
				.style("stroke-width", function(d) { return me._getStrokeWidth(d); });
		//this.force.resume();
		this.force.start();
		this.force.stop();

		var maxR_d = this._data_force["children"][me.maxCircle_index];
		this._force_offset_x =me.radius - me._scale_postion_X(maxR_d.x);
		this._force_offset_y =me.radius - me._scale_postion_Y(maxR_d.y);


		this._data_force["children"].forEach(function(d){
			d.x = me._scale_postion_X(d.x) + me._force_offset_x;
			d.y = me._scale_postion_Y(d.y) + me._force_offset_y;
		});


		//console.log(this.force.size());

		//首先曲线变直线，再执行动画
		link.transition().duration(1000)
				.attrTween("d",function(d){
					var endObj = {
						source :{
							x: d.source.x,
							y: d.source.y
						},
						target:{
							x: d.target.x,
							y: d.target.y
						}};
					this._current = this._current?this._current:endObj;

					var interpolate = d3.interpolate(
							this._current,endObj);
					this._current = interpolate(0);
					return function(t) {
						var tt = interpolate(t);
						return "M"+ (tt.source.x-me.radius)+"," + (tt.source.y-me.radius)
								+" L"+ (tt.target.x -me.radius)+ ","+ (tt.target.y-me.radius);
					};
				});

		node.transition().duration(1000)
				.attrTween("transform",function(d,i){

					var old_obj ;
					if (this._current){
						old_obj = me.translatePosition(this._current,{isXY:false});
					}

					this._current = old_obj || d;
					var interpolate = d3.interpolate(
							{x:this._current.x,y:this._current.y}, {
								x: d.x,y: d.y
							});
					this._current = interpolate(0);
					return function(t) {
						var tt = interpolate(t);
						return "translate(" + (tt.x-me.radius) + ","+ (tt.y-me.radius)+")"; };
				});

		this.force.on("tick", function() {
			link.attr("d",function(d){
				return "M"+ (d.source.x- me.radius)+"," + (d.source.y-me.radius)+
						" L"+ (d.target.x -me.radius)+ ","+ (d.target.y-me.radius);
			});
			node.attr("transform", function(d) {
				//this._current = {x:d.x,y:d.y};
				return "translate(" + (d.x-me.radius) + ","+ (d.y-me.radius)+")"; });
		});
	},
	_svgClick:function(d){
		this._resetLight();
	},
	_nodeClick:function(d){
		//d3.event.stopPropagation();
		//this._highLight(d);
	},
	_resetLight:function(){
		this.innerSvg.selectAll("path").attr("opacity",this.config.linkOpacity);
		this.innerSvg.selectAll(".node").attr("opacity",1);
		this.innerSvg.selectAll(".link").attr("stroke",this.config.linkDefaultColor);
	},
	_highLight:function(d){
		this.innerSvg.selectAll("path").attr("opacity",this.config.linkOpacity);
		this.innerSvg.selectAll(".node").attr("opacity",0.3);
		//console.log(d.domNode);
		d3.select(d.domNode).attr("opacity",1);
		//查找关联的node、link
		var linkNodes = this.innerSvg.selectAll("[link_name1='"+ d[this.config.IndexKey]+"']").attr("opacity",1);
		var color = this.config.groups[d[this.config.group_Key]];
		linkNodes.attr("stroke",color);

		this._showEachNode(linkNodes);
		var linkNodes2 = this.innerSvg.selectAll("[link_name2='"+ d[this.config.IndexKey]+"']").attr("opacity",1);
		linkNodes2.attr("stroke",color);

		this._showEachNode(linkNodes2);

	},
	_showEachNode:function(linkNodes){
		if (linkNodes.length<=0) return;
		//console.log(linkNodes[0]);
		linkNodes[0].forEach(function(linkNode){
			var data = linkNode.__data__;
			//console.log(data);
			if (data[0]){
				d3.select(data[0].domNode).attr("opacity",1);
				d3.select(data[2].domNode).attr("opacity",1);
			}else{
				d3.select(data.source.domNode).attr("opacity",1);
				d3.select(data.target.domNode).attr("opacity",1);
			}
		});
	},
	//鼠标移动事件
	_mouseOver:function(d){
		this._highLight(d);
		if(this.config.onMouseOver!=undefined){

			this.config.onMouseOver.call(this,d,d3.event);
		}
	},
	_mouseLeave:function(d){
		this._resetLight();
		if(this.config.onMouseLeave){

			this.config.onMouseLeave.call(this,d,d3.event);
		}
	},
	_mouseMove:function(d){
		if(this.config.onMouseMove!=undefined){
			this.config.onMouseMove.call(this,d,d3.event);
		}
	}
	//_lineMouseOver:function(d,index){
	//	d3.select(this).attr("opacity",1);
	//	if (this.config.onLineMouseOver){
	//		this.config.onLineMouseOver.call(this,d,index,d3.event);
	//	}
	//},
	//_lineMouseLeave:function(d,index){
	//	d3.select(this).attr("opacity",this.config.linkOpacity);
	//	if (this.config.onLineMouseLeave){
	//		this.config.onLineMouseLeave.call(this,d,index,d3.event);
	//	}
	//}

}
/**
 * Created by yanguoxu on 15/7/9.
 */
xuetangX_chart.SpeakBar = function(data,config){
	this.config = base.extend({
		width: 300,
		height:175,
		data:data,
		valueKey:"value",
		dateKey:"date",
		container:"",
		y_key:"",
		x_key1:"",
		x_key2:"",
		x_start:70,
		tickPadding:5,
		colors:[],
		secBarOpacity:0.3,
		margin:{left:0,right:0,top:0,bottom:0}
	},config);
	this._init();
}

xuetangX_chart.SpeakBar.create = function(data,config){
	return new xuetangX_chart.SpeakBar(data,config);
}

xuetangX_chart.SpeakBar.prototype ={
	_init:function(){
		this._svgWidth = this.config.width - this.config.margin.left - this.config.margin.right;
		this._svgHeight = this.config.height - this.config.margin.top - this.config.margin.bottom;
		this.drawChart();
	},
	drawChart:function(){
		if (this.svgParent){
			this.svgParent.remove();
		}
		var me=this;
		this.svgParent = d3.select(this.config.container).append("svg").attr("class","chart_speakBar");
		this.svg = this.svgParent
				.attr("width",this.config.width)
				.attr("height",this.config.height)
				.append("g")
				.attr("class","chart_container")
				.attr("transform","translate("+this.config.margin.left+","+this.config.margin.top+")");

		var y_domainAry = this.config.data.map(function(d){return d[me.config.y_key];});
		this._y = d3.scale.ordinal()
				.domain(y_domainAry)
				.rangeRoundBands([0, this._svgHeight], .1);
		var maxCount = d3.max(this.config.data,function(d){return d[me.config.x_key1]});
		var maxCount2 = d3.max(this.config.data,function(d){return d[me.config.x_key2]});
		maxCount = Math.max(maxCount,maxCount2);
		this._x1 = d3.scale.linear()
				.domain([0,maxCount])
				.range([0,this._svgWidth-this.config.x_start]);

		this._x2 = d3.scale.linear()
				.domain([0,maxCount])
				.range([0,this._svgWidth-this.config.x_start]);

		var yAxis = d3.svg.axis()
				.scale(this._y)
				.tickSize(0)
				.tickPadding(this.config.tickPadding)
				.orient("left");
		this.svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate("+this.config.x_start+",0)")
				.call(yAxis);
		this.svg.selectAll("text").attr("font-size",10);
		this._createRect();
	},
	_createRect:function(){
		var me=this;
		var  bar = this.svg.selectAll(".bar")
				.data(this.config.data)
				.enter().append("g")
				.attr("class","bar")
				.attr("transform",function(d){
					return "translate("+me.config.x_start+","+me._y(d[me.config.y_key])+")";
				});
		bar.append("rect")
				.attr("y",0)
				.attr("height",function(d){
					return  me._y.rangeBand()*0.55;
				})
				.attr("width",function(d){
					return me._x1(d[me.config.x_key1]);
				} )
				.attr("fill",function(d,i){ return me.config.colors[i];})
				.on("mouseover",base.proxy(this._mouseOver,this))
				.on("mousemove",base.proxy(this._mouseMove,this))
		;

		bar.append("rect")
				.attr("y",5)
				.attr("height",function(d){
					return  me._y.rangeBand()*0.55;
				})
				.attr("width",function(d){
					return me._x2(d[me.config.x_key2]);
				} )
				.attr("fill",function(d,i){ return me.config.colors[i];})
				.attr("opacity",this.config.secBarOpacity)
				.on("mouseover",base.proxy(this._mouseOver,this))
				.on("mousemove",base.proxy(this._mouseMove,this));
		this.svgParent.select(".chart_container").on("mouseleave",base.proxy(this._mouseLeave,this));

	},
	//鼠标移动事件
	_mouseOver:function(d,index){
		if(this.config.onMouseOver!=undefined){
			this.config.onMouseOver.call(this,d,index,d3.event);
		}
	},
	_mouseLeave:function(d,index){
		if(this.config.onMouseLeave){
			this.config.onMouseLeave.call(this,d,index,d3.event);
		}
	},
	_mouseMove:function(d,index){
		if(this.config.onMouseMove!=undefined){
			this.config.onMouseMove.call(this,d,index,d3.event);
		}
	}
}
/**
 * Created by yanguoxu on 15/7/10.
 */
xuetangX_chart.StackArea = function(data,config){
	this.config = base.extend({
		width: 300,
		height:175,
		data:data,
		valueKey:"value",
		dateKey:"date",
		container:"",
		y_key:"",
		x_key1:"",
		x_key2:"",
		x_start:0,
		NegativeOpacity:0.3,
		colors:[],
		seriesName:[],
		seriesName2:[],
		hideBarWidth:10,
		margin:{left:20,right:0,top:20,bottom:0}
	},config);
	this._init();
}

xuetangX_chart.StackArea.create = function(data,config){
	return new xuetangX_chart.StackArea(data,config);
}

xuetangX_chart.StackArea.prototype = {
	_init: function () {
		this._svgWidth = this.config.width - this.config.margin.left - this.config.margin.right;
		this._svgHeight = this.config.height - this.config.margin.top - this.config.margin.bottom;
		this.drawChart();
	},
	_startDraw:function(aClass){
		if (this.svgParent){
			this.svgParent.remove();
		}
		var me=this;
		this.svgParent = d3.select(this.config.container).append("svg").attr("class",aClass);
		this.svg = this.svgParent
				.attr("width",this.config.width)
				.attr("height",this.config.height)
				.append("g")
				.attr("class","chart_container")
				.attr("transform","translate("+this.config.margin.left+","+this.config.margin.top+")");
	},
	drawChart:function(){
		this._startDraw("chart_stackArea");
		var me= this;
		var parseDate = d3.time.format("%Y-%m-%d").parse,
				formatPercent = d3.format(".0%");
		var x = d3.time.scale()
				.range([0, this._svgWidth]);
		var y = d3.scale.linear()
						.range([this._svgHeight, 0])
				;
		var color = d3.scale.category20();
		var dateFormat = d3.time.format("%m.%d");
		var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.ticks(d3.time.week, 1)
				.tickFormat(
				function (d) {
					return dateFormat(d);
				});


		var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");

		var area = d3.svg.area()
				.interpolate("basis")
				.x(function(d) { return x(d.date); })
				.y0(function(d) {
					return  y(d.y0);
				})
				.y1(function(d) {

					return y(d.y0 + d.y);
				});


		var stack = d3.layout.stack()
				.values(function(d) { return d.values; });

		this.config.data.forEach(function(d) {
			d.date = parseDate(d.date);
		});

		//获取keys
		//var keys = d3.keys(this.config.data[0]).filter(function(key){ return key!=="date"});
		var keys = me.config.seriesName.concat(this.config.seriesName2);

		var seriesData = keys.map(function(name){
			return {
				name:name,
				values:me.config.data.map(function(d){
					return {date: d.date,y:d[name]};
				})
			}
		});

		var seriesData1 = seriesData.filter(function(d){
			for(var i=0;i<me.config.seriesName.length;i++){
				if (d.name == me.config.seriesName[i])
					return true;
			}
			return false;
		});

		var seriesData2 = seriesData.filter(function(d){
			for(var i=0;i<me.config.seriesName2.length;i++){
				if (d.name == me.config.seriesName2[i]){
					d.opacity= me.config.NegativeOpacity;
					return true;
				}

			}
			return false;
		});

		//console.log(seriesData1);
		var stackData1 = stack(seriesData1),
				stackData2 = stack(seriesData2);
		var stackData = stackData1.concat(stackData2);
		var stackDomain = [];
		for(var i=0;i<stackData.length;i++){
			var tmpAry =  d3.extent(stackData[i]["values"],function(d){ return d.y+ d.y0;});
			stackDomain = stackDomain.concat(tmpAry);
		}
		stackDomain = d3.extent(stackDomain);
		if (stackDomain[0]>0){
			stackDomain[0] = 0;
		}
		y.domain(stackDomain);
		//console.log(stackDomain);
		//console.dir(stackData);

		x.domain(d3.extent(me.config.data,function(d){ return d.date}));

		var parentArea =  this.svg.selectAll(".parentArea")
				.data(stackData)
				.enter().append("g")
				.attr("class","parentArea");

		color.domain(keys);
		parentArea.append("path")
				.attr("class","area")
				.attr("d",function(d){ return area(d.values);})
				.style("fill",function(d){ return  me.config.colors[d.name]?me.config.colors[d.name]: color(d.name)})
				.style("opacity",function(d){ return d.opacity? d.opacity:1;})
				.on("mouseover",base.proxy(this._mouseOver,this))
				.on("mousemove",base.proxy(this._mouseMove,this));


		this.svg.append("g")
				.attr("class","x axis")
				.attr("transform", "translate("+this.config.x_start+"," + (y(0)) + ")")
				.call(xAxis);

		//生成一个隐藏的Bar，用于支持hover状态，得到对应日期
		var g = this.svg.append("g")
				.attr("transform", "translate("+this.config.x_start+",0)");

		if (this.config.data.length>2){
			this.config.hideBarWidth = x(new Date(this.config.data[0]["date"].valueOf()+1* 24 * 60 * 60 * 1000))
			-x(this.config.data[0]["date"]);
			this.config.hideBarWidth *=0.8;
		}

		var hideBar_g = g.selectAll(".hideBar")
				.data(this.config.data)
				.enter().append("g")
				.attr("transform",function(d){ return "translate("+x(d["date"])+","+0+")"})
				.on("mouseover",function(d){
					d3.select(this).select(".hideBar_line").attr("opacity",1);
					if(me.config.onHideBarmouseOver!=undefined){
						me.config.onHideBarmouseOver(d,d3.event,this);
					}
				})
				.on("mousemove",function(d){
					if(me.config.onHideBarmouseMove!=undefined){
						me.config.onHideBarmouseMove(d,d3.event,this);
					}
				})
				.on("mouseleave",function(d){
					d3.select(this).select(".hideBar_line").attr("opacity",0);
					if(me.config.onHideBarmouseLeave!=undefined){
						me.config.onHideBarmouseLeave(d,d3.event,this);
					}
				});



		hideBar_g.append("rect")
				.attr("class","hideBar")
				.attr("transform",function(d,i){ return i==0?"translate(0,0)":"translate("+(-(me.config.hideBarWidth>>1))+","+0+")"})
				.attr("width",function(d,i){ return i==0?me.config.hideBarWidth>>1:me.config.hideBarWidth;})
				.attr("height",function(d){ return  me._svgHeight;})
			//.attr("fill","#009DE6")
				.attr("opacity",0);

		hideBar_g.append("path").attr("class","hideBar_line")
				.attr("opacity",0)
				.attr("d",function(d){
					return "m0,0"+"v"+me._svgHeight;
				});


		this.svgParent.select(".chart_container").on("mouseleave",base.proxy(this._mouseLeave,this));
	},
	//鼠标移动事件
	_mouseOver:function(d){
		if(this.config.onMouseOver!=undefined){
			this.config.onMouseOver.call(this,d,d3.event);
		}
	},
	_mouseLeave:function(d){
		if(this.config.onMouseLeave){
			this.config.onMouseLeave.call(this,d,d3.event);
		}
	},
	_mouseMove:function(d){
		if(this.config.onMouseMove!=undefined){
			this.config.onMouseMove.call(this,d,d3.event);
		}
	}
}
