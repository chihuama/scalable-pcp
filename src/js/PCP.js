
//var top = {};
//var buttom = {};
var axes = {};


//Called onload
function init(){

  // Load data from the files
	d3.csv("./data/SurvivalProbability.csv",function(error,data){

		PCP(data);

		var filteredData = data;

		// fake max/min data points
		// var addData = {};
		// addData[1] = Object.assign({}, data[1]);
		// addData[2] = Object.assign({}, data[1]);
		// console.log(addData);
		//
		// addData[1].AgeAtTx = 90;
		// addData[2].AgeAtTx = 30;
		//
		// addData[1].Survival = 1;
		// addData[2].Survival = 0.0;
		//
		// data.push(addData);

		var top = Object.assign({}, data[1]);
		var bottom = Object.assign({}, data[1]);

		top.AgeAtTx = 90;
		bottom.AgeAtTx = 30;

		top.Survival = 1;
		bottom.Survival = 0.0;

		data.push(top);
		data.push(bottom);

		console.log(data);

		Object.keys(data[0]).forEach((el) => {
			axes[el] = true;
		});


    // slider for changing the axis scale
		var slider = d3.slider()
		  .min(0).max(100)
			.value([30,90])
			.axis(true)
			//.orientation("vertical")
			.on("slideend", function(evt, value) {
				//console.log(value);
				bottom.AgeAtTx = value[0];
				top.AgeAtTx = value[1];
				// addData[1].AgeAtTx = value[1];
				// addData[2].AgeAtTx = value[0];
				updateData();
				updatePCP(filteredData);
			});

    var sliderSurvival = d3.slider()
		  .min(0).max(1.5)
			.value([0,1])
			.on("slideend", function(evt, value) {
				bottom.Survival = value[0];
				top.Survival = value[1];
				// addData[1].Survival = value[1];
				// addData[2].Survival = value[0];
				updateData();
				updatePCP(filteredData);
			});

		d3.select('#slider1').call(slider);
		//d3.select('#slider2').call(sliderCat);
		d3.select('#slider3').call(sliderSurvival);

    // update button
		d3.select("#updateAxes").on("click", function() {

			d3.select("#slider1").style("visibility", "visible");
			d3.select("#slider2").style("visibility", "visible");
			d3.select("#slider3").style("visibility", "visible");

			updateData();
			updatePCP(filteredData);
		});


		d3.select("#resetAxes").on("click", function() {

      d3.select("#slider1").style("visibility", "hidden");
			d3.select("#slider2").style("visibility", "hidden");
			d3.select("#slider3").style("visibility", "hidden");

			Object.keys(data[0]).forEach((el) => {
				axes[el] = true;
		    d3.select("#" + el).property("checked", true);
			});

			updateData();
			updatePCP(filteredData);
		});


		// data update and filtering methods
		function updateData() {
			//console.log(axes);
			filteredData = data.filter(filterFunc);
			//console.log(filteredData);
			filteredData = filteredData.map(mapFunc);
			//console.log(filteredData);
		}

		function filterFunc(obj) {
			if (obj.AgeAtTx <= top.AgeAtTx && obj.AgeAtTx >= bottom.AgeAtTx
				&& obj.Survival <= top.Survival && obj.Survival >= bottom.Survival
			) {
				return true;
			} else {
				return false;
			}
		}

		function mapFunc(obj) {
			var newObj = {};

			Object.keys(axes).forEach((el) => {
				if(axes[el]){
					newObj[el] = obj[el];
				}
			});

			return newObj;
		}

	}); // d3.csv() end

} // init() end


function checkbox(id, val) {
	axes[id] = val;
	console.log(axes);
}


function PCP(data){
	var pcps = d3.parcoords()("#PCP")
		.data(data)
		.margin({top: 40, left: 30, bottom: 40, right: 0})
		.alpha(0.6)
		.mode("queue")
		.color("lightblue")
		.render()
		.brushMode("1D-axes")
		.interactive();
}

function updatePCP(data){
	//d3.selectAll("svg").remove();
  d3.select("#PCP").selectAll("*").remove();

	var pcps = d3.parcoords()("#PCP")
		.data(data)
		.margin({top: 30, left: 30, bottom: 40, right: 0})
		.alpha(0.6)
		.mode("queue")
		.color("lightblue")
		// .color(function(d) {
		// 	if (d.Survival == 0.0) {
		// 		console.log(d);
		// 		return "white";
		// 	} else {
		// 		return "lightblue";
		// 	}
		// })
		// .alpha(function(d) {
		// 	console.log(d);
		// 	if (d.Survival == 0.0) {
		// 		console.log(d);
		// 		return Number(0);
		// 	} else {
		// 		return Number(0.6);
		// 	}
		// })
		.render()
		.brushMode("1D-axes")
		.interactive();
}



// function filterSlider() {
// 	var x = d3.linearScale()
// 	  .domain([30, 90])
// 		.range([0, 100])
//
// 	var svg = d3.select('#slider').append("svg")
// 	  .attr("width", 100)
// 		.attr("height", 20)
// 		.append("g");
//
// 	svg.append("g")
// 	  .attr()
//
// }
