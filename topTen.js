var width = 1100, height = 610, margin ={b:0, t:40, l:170, r:50};

var bsvg = d3.select(".bipartite")
    .append("svg").attr('width',width).attr('height',(height+margin.b+margin.t))
    .append("g").attr("transform","translate("+ margin.l+","+margin.t+")");

var data = [ 
    {data:bP.partData(indata,2), id:'SalesAttempts', header:["Market","State", "Company by Market"]}
];


d3.csv("Top10.csv", function(error, csv) {
    var indata = [];
    var i = 0;
    csv.forEach(function(item) {
        indata[i] = [csv[i]["Market"], csv[i]["state_code"], +csv[i]["Count_of_market"], 0];
        i++;
    })
    console.log(indata);
    console.log(i);
    

    bP.draw(data, svg);
})   