module.exports = function() {
	return {
		restrict: 'AE',
		scope: {
			ngModel: '=',
			ngShowexam : "=",
			mouseenterPath: '&',
			mouseleavePath: '&',
			mouseoutCanvas: '&',
			getFillColor: '&'
		},
		link: function($scope, ele, attr) {
			var mouseenterPath = $scope.mouseenterPath || $.noop;
			var mouseleavePath = $scope.mouseleavePath || $.noop;
			var mouseoutCanvas = $scope.mouseoutCanvas || $.noop;
			var setColor = $scope.getFillColor || $.noop;

			var borderWidth = 2;
			var size = 8;
			var margin = 3;
			var bgHeight = 20;
			var charpterMarginLeft = 55;
			var firstCharpterMarginLeft = 40;
			var barGroupTitleWidth = 90;//90 添加内部标题，所占宽度
			if ($scope.ngShowexam){
				barGroupTitleWidth = 113; //添加内部标题，所占宽度
			}

			var exam_section_width = 179;

			//console.log("show:"+$scope.ngShowexam);

			//需要重新计算
			var widthFn = function(data) {
				var width = 0;
				var record = null;
				var firstRow = data[0];

				if ($scope.ngShowexam){
                  width =  firstRow.section_detail.length * exam_section_width;
				}else{
					data[0].forEach(function(val, i) {
						// seq 脑补的数据
						if (record !== val.seq) {
							record = val.seq;
							width += charpterMarginLeft;
						}
						if (val.sectionType){
							width += barGroupTitleWidth;
						}else
							width += size + margin;
					});
				}

				return width < 665 ? 665 : width;
			};


			var heightFn = function(data) {
				return data.length * bgHeight;
			};


			var fn = function(data) {
				var main_elem = $("#dotMatrix_main",ele);
				main_elem.empty();

				if (!angular.isDefined(data) || !data.length) {
					$('<div class="empty">暂无数据</div>').appendTo(main_elem);
					return false;
				}

				var canvas = $('<canvas/>').appendTo(main_elem)[0];
				var ctx = canvas.getContext('2d');

				canvas.width = widthFn(data);
				canvas.height = heightFn(data);

				var draw = function(clientX, clientY) {
					var width = canvas.width;
					var height = canvas.height;
					ctx.clearRect(0, 0, width, height);
					var pointX = null;
					var pointY = null;
					data.forEach(function(val, i) {
						if (i % 2 === 0) {//画背景
							ctx.beginPath();
							ctx.rect(0, i * bgHeight, width, bgHeight);
							ctx.fillStyle = '#F8FBFC';
							ctx.fill();
						}
						var record = null;
						var bigMargin = 0;
						var y = i * bgHeight + (bgHeight - size) / 2;
						var x_start = 0;
						if($scope.ngShowexam){
                            //总分数
							ctx.fillStyle = setColor({
								thisData:{
									score:val.score
								}
							});

							var score_start = 0;
							if(val.score!=100){
								score_start = 8;
							}
							ctx.font="16px num";
							ctx.fillText(val.score,score_start,y+size+2);
							if (ctx.isPointInPath(clientX, clientY)) {
								pointY = score_start;
								pointX = y;
								mouseenterPath({
									pointX: pointX,
									pointY: pointY,
									eleOffsetX: ele.offset().left,
									eleOffsetY: ele.offset().top,
									arrOutsideIndex: i,
									arrInsideIndex: 0
								});
								//ctx.shadowColor = '#999';
								//ctx.shadowBlur = 5;
								//ctx.shadowOffsetX = 0;
								//ctx.shadowOffsetY = 2;
							}

							//图标
							var img= $("#score_img",ele);
							ctx.drawImage(img[0],25,y);
							var section_img = $("#problem_img",ele)[0];
							val.section_detail.forEach(function(valCol,iCol){
								x_start = iCol * exam_section_width;
								//图标
								ctx.drawImage(section_img,x_start+78,y-2);
								//百分比
								ctx.fillStyle ="#99ABAF";
								ctx.font="12px num";
								ctx.fillText(valCol.score,x_start+95,y+size);
								//圆形图形
								//ctx.fillStyle="#FF0000";

								ctx.fillStyle = setColor({
									thisData:{
										score:valCol.score_percent
									}
								});


								ctx.beginPath();
								if(iCol ==0){
									ctx.arc(x_start+156,y+size/2,3,0,Math.PI*2,true);
								}else{
									ctx.arc(x_start+156,y+size/2,3,0,Math.PI*2,true);
								}
								ctx.closePath();
								ctx.fill();
								ctx.restore();

							});


						}else{
							val.forEach(function(valCol, iCol) {
								if (valCol.seq !== record) {
									record = valCol.seq;
									if (iCol === 0) {
										bigMargin += firstCharpterMarginLeft;
										x_start = firstCharpterMarginLeft;
									} else {
										bigMargin += charpterMarginLeft;
										x_start += charpterMarginLeft;
									}
								}
								var oneRecord = data[i][iCol];

								if (valCol.sectionType){
									ctx.beginPath();
									ctx.save();
									//画图
									var img,sColor="";
									var dy=0;
									if (valCol.sectionType=="video"){
										img= $("#vedio_img",ele);
										sColor = "#7ECDE6";
									}else if(valCol.sectionType=="problem"){
										img= $("#problem_img",ele);
										sColor = "rgb(112, 205, 67)";
										dy=-2;
									}else if(valCol.sectionType=="discussion"){
										img= $("#discussion_img",ele);
										sColor = "#009DE6";
										dy=-2;
									}else{
										img= $("#vedio_img",ele);
										sColor = "#99ABAF";
									}

									ctx.drawImage(img[0],x_start+20,y+dy);
									ctx.font="12px num";
									ctx.rect(x_start+45,y,barGroupTitleWidth-45,bgHeight);
									if (ctx.isPointInPath(clientX, clientY)) {
										pointY = y;
										pointX = x_start+45;
										mouseenterPath({
											pointX: pointX,
											pointY: pointY,
											eleOffsetX: ele.offset().left,
											eleOffsetY: ele.offset().top,
											arrOutsideIndex: i,
											arrInsideIndex: iCol
										});
										ctx.fillStyle =sColor;
										ctx.fillText(oneRecord["value"],x_start+45,y+size);
										//console.log(0);
									}else{
										//数值
										ctx.fillStyle ="#99ABAF";
										ctx.fillText(oneRecord["value"],x_start+45,y+size);
									}
									//ctx.fill();

									ctx.restore();
									x_start += barGroupTitleWidth;
									return;
								}
								//var x = iCol * (size + margin) + bigMargin;

								var rectDetail = {
									x:x_start,
									y:y,
									width:size,
									height:size
								};
								x_start += size + margin;

								function createOneRect(oneRecord,rectDetail) {
									ctx.beginPath();
									ctx.save();
									//ctx.rect(x, y, size, size);
									//微调了一下偏移，右移0个点
									ctx.rect(rectDetail.x,rectDetail.y,rectDetail.width,rectDetail.height);
									// ctx.lineWidth = borderWidth;
									// 	ctx.strokeStyle = '#FFF';
									// 	ctx.stroke();
									if (ctx.isPointInPath(clientX, clientY)) {
										pointY = rectDetail.y;
										pointX = rectDetail.x;
										mouseenterPath({
											pointX: pointX,
											pointY: pointY,
											eleOffsetX: ele.offset().left,
											eleOffsetY: ele.offset().top,
											arrOutsideIndex: i,
											arrInsideIndex: iCol
										});
										ctx.shadowColor = '#999';
										ctx.shadowBlur = 5;
										ctx.shadowOffsetX = 0;
										ctx.shadowOffsetY = 2;
									}
									ctx.fillStyle = setColor({
										thisData:oneRecord
									});

									ctx.fill();
									ctx.restore();
								}
								createOneRect(oneRecord,rectDetail);
							});
						}


					});
					pointX === null && mouseleavePath();
				};
				draw();

				var timer = null;
				canvas.addEventListener('mousemove', function(e) {
					clearTimeout(timer);
					timer = setTimeout(function() {
						var x = e.offsetX || e.layerX;
						var y = e.offsetY || e.layerY;
						draw(x, y);
					}, 100);
				});

				canvas.addEventListener('mouseout', function() {
					clearTimeout(timer);
					draw();
					mouseoutCanvas();
				});
			};

			fn($scope.ngModel);

			$scope.$watch('ngModel', function(newVal, oldVal) {
				if (newVal === oldVal) {
					return false;
				}
				fn(newVal);
			});
		}
	};
};
