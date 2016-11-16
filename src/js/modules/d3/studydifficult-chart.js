/**
 * Created by yanguoxu on 15/8/13.
 */
var d3Cloud = require("d3Cloud");
var xuetangX_chart = require("d3XtChart");
var nvToolTip = require('nvToolTip');

module.exports = function(data, ele) {
	//console.log("studyDifficultChart");
	//console.log(data);
	var colors = ["#FF6C5B","#8DCAEA","#FB8E3A","#1195D4"];
	var minfontSize = 8, maxfontSize=30;
	var fill = d3.scale.category20();

	//var layout = d3.layout.cloud()
	//		.size([200, 175])
	//		.words([
	//			"Hello", "world", "normally", "you", "want", "more", "words",
	//			"than", "this"].map(function(d) {
	//					return {text: d, size: 10 + Math.random() * 90, test: "haha"};
	//				}))
	//		.padding(5)
	//		.rotate(function() { return ~~(Math.random() * 2) * 90; })
	//		.font("Impact")
	//		.fontSize(function(d) { return 10;//d.size;
	//		 })
	//		.on("end", draw);

	//sum
	var num_sum = d3.sum(data.keywords,function(d){ return d.num;});
	//console.log(num_sum);
	var FontSize_sum = 200;
	var font_name = 'Microsoft YaHei';

	var map_keywords={};
	for(var i=0;i<data.keywords.length;i++){
		var d= data.keywords[i];
		map_keywords[d.wid] = d;
	}

	function getFontSize(d){
			var fontsize = ((d.num)/(num_sum)) * FontSize_sum;
			fontsize = fontsize>maxfontSize?maxfontSize:fontsize;
			return fontsize<=minfontSize?minfontSize:fontsize;
			//return d.size;
	}
	function getFontSize2(d){
		return  getFontSize(d) + "px";
	}


	var layout = d3.layout.cloud()
			.size([212, 175])
			.words(data.keywords)
			.padding(1)
			.rotate(function(d,i) {//-90到90
				return (90 * (i % 2)) * (-1);
				//return ((Math.random()*1000) % 360);
				//return (~~(Math.random()*2) *90 - 45) * (-1) ;
				return 0;
			})
			.font(font_name)
			.fontSize(function(d){
				return getFontSize(d);
			})
			.on("end", draw);

	layout.start();

	function draw(words) {
		var svg = d3.select(ele).append("svg")
				.attr("width", layout.size()[0])
				.attr("height", layout.size()[1]);
		 var g_all = svg.append("g")
				.attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
				.selectAll("text")
				.data(words)
				.enter().append("g");
		g_all.append("text")
				.attr("font-size", function(d) {
					return getFontSize(d);
					//return 10; // d.size + "px";
				})
				.style("font-family", font_name + ",SimHei")
				.style("font-weight", "bold")
				.style("fill", function(d, i) {
					return colors[(i % colors.length)]; })
				.attr("stroke","#EEE")
				.attr("stroke-width","2px")
				.attr("text-anchor", "middle")
				.attr("transform", function(d) {
					return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				})
				.text(function(d) { return d.word; });

		//svg.append("g")
		//		.attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
		//		.selectAll("text")
		//		.data(words)
		//		.enter().append("text")

		g_all.append("text")
				.attr("class",function(d){
					return "c_"+d.wid + " factText";
				})
				.attr("font-size", function(d) {
					return getFontSize(d);
					//return 10; // d.size + "px";
				})
				.style("font-family", font_name + ",SimHei")
				.style("font-weight", "bold")
				.style("fill", function(d, i) {
					return colors[(i % colors.length)]; })
				.attr("text-anchor", "middle")
				.attr("transform", function(d) {
					return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				})
				.text(function(d) { return d.word; })
				.on("mouseover",function(d,d_index){
					//var  linkData = {};
					var linkdata= data.relation.filter(function(tmpd){
						return tmpd["wid1"] == d["wid"];
					});
					var html = "<div class='keyword_tooltip'><p><span class='chapter_name'>{chapter_name}</span></p>" +
							"<p class='word' style='color: "+colors[(d_index % colors.length)]+";'>{word}</p><p>学习瓶颈人数:{num}</p>"
							;
					html = xuetangX_chart.base.format(html,d);
					var tmpColor = colors[(d_index % colors.length)];
					if (linkdata.length>0){
						html += "<p class='p_br'></p>" +
						"<p><span class='chapter_name'>相关难点</span></p>";
					}

					svg.selectAll("text.factText").style("fill", function(d, i) {
						if (i!=d_index){//其他置灰
							return "#91A6AC";
						}else{
							return tmpColor;
						}

					});

					for (var i=0;i<linkdata.length;i++){
						var wid2 = linkdata[i]["wid2"];
						var linkObj = map_keywords[wid2];
						var html2="<p><span class='word' style='color: "+colors[(d_index % colors.length)]+";'>"+linkdata[i]["rel_word"]+"</span></p>" +
								"<p class='bottomP'>瓶颈关联度:"+((linkdata[i]["value"]*100).toFixed(2))+"%,"+linkdata[i]["num_common"]+"人</p>";
						if (linkObj){
							html2 = xuetangX_chart.base.format(html2,linkObj);
							html += html2;
						}
						svg.selectAll("text.c_"+wid2).style("fill",tmpColor);
					}
					html += "</div>";

					nvToolTip(html,{"showAngle":true,"offsetLeft":125,"event":d3.event});
				})
				.on("mouseleave",function(){
					nvToolTip.removeToolTip();
					svg.selectAll("text.factText").style("fill", function(d, i) {
								return colors[(i % colors.length)];
					});
				});
	}

}
