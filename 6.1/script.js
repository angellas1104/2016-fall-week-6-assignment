console.log('6.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

//Import data and parse
d3.csv('../data/olympic_medal_count.csv',parse,data);

function parse(d){
	return{
		country:d['Country'],
		country1900:+d['1900'],
		country1960:+d['1960'],
		country2012:+d['2012'],
	};
}
function data(err,rows){
	console.table(rows);
	
	var sortarr=rows.sort(function(a,b){
		return b.country2012-a.country2012;
	}),
		newarr=sortarr.slice(0,5);
	console.log(sortarr,newarr)

	var minY=d3.extent(newarr,function(d){return d.country2012}),
		maxY=d3.max(newarr,function(d){return d.country2012}),
		x=newarr.map(function(d){return d.country});
	var scaleY=d3.scaleLinear()
		.domain([0,maxY+20])
		.range([h,0]),
		scaleX=d3.scaleBand()
		.range([0,w])
		.domain(x)
		.paddingOuter(.3)
		.paddingInner(.6);


	var rectangle=plot.selectAll('rect')
		.data(newarr)
		.enter().append('rect')
		.attr('class','bar')
		.style('width',scaleX.bandwidth())
		.style('height',function(d){return h-scaleY(d.country2012)})
		.attr('y',function(d){return scaleY(d.country2012)})
		.attr('x',function(d){return scaleX(d.country)});

	//add axis
	var axisX=d3.axisBottom()
		.scale(scaleX),
		axisY=d3.axisLeft()
		.scale(scaleY)
		.tickSize(-w);
		
	var axisNodeX=plot.append('g')
		.attr('class','axis')
		.attr('transform','translate(' + 0 + ',' + h+ ')'),
		axisNodeY=plot.append('g')
		.attr('class','axis')
		.attr('transform','translate(' + 0 + ',' + 0+ ')');
		axisX(axisNodeX);
		axisY(axisNodeY);
}