var margin = {top: 50, right: 0, bottom: 40, left: 20};
var width = 520 - margin.left - margin.right;
var height = 420 - margin.top - margin.bottom;

var svg = d3.select(".scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function validData(datum) {
              return (datum["founded_year"] != null
                                &&datum["founded_year"] != 0
                                && datum["funding_total_usd"] != ' -   '
                                && datum["market"] != null);
            }

d3.csv("Funding.csv", function(error, csv) {

        var dataset = {};
        var colorSet = {};
        var indata;
        
        indata = csv;

         indata=d3.nest()
        .key(function(d) {return d.state_code;})
        .rollup(function(d) {return {
            "length": d.length, "total_funding": d3.sum(d, function(g) {
                return parseInt(g.funding_total_usd);
            })
        }})
        .entries(indata);

        var onlyValues = indata.map(function(obj){ return obj.values.length; });
        
        var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

        var paletteScale = d3.scale.log()
            .domain([minValue,maxValue])
            .range(["#feb24c","#800026"]);


        indata.forEach(function(item){ //
        // item example value ["USA", 70]
            var iso = item.key,
                value = item.values.length,
                fundingTotal = item.values.total_funding;
            dataset[iso] = { numberOfThings: value, fillKey: paletteScale(value),
                            fundingTotal: fundingTotal };
            colorSet[paletteScale(value)] = paletteScale(value);
        });
        
        
        //top10
        var thedata = csv;

        thedata = thedata.filter(validData);

        var companies;

       companies=d3.nest()
            .key(function(d) {return d.state_code;})
            //.key(function(d) {return parseFloat(d.funding_total_usd);})
            // .sortKeys(d3.descending)
            .sortValues(function(a,b) { return ((parseFloat(a["funding_total_usd"]) > parseFloat(b["funding_total_usd"]))
            ? -1
            : 1);
            return 0;})
            .entries(thedata);
        console.log(companies);
             
          

        var map = new Datamap({
            element: document.getElementById('container'),
            done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                var index = -1;
                for (var i = 0; i <= 50; i++) {
                    if (stateTable[i] == geography.id) {
                        index = i;
                    }
                }
                    bP.selectSegment(bpdata, 1, index);

                    var topList;
                    var l = -1;
                    
                    for (var i = 0; i < companies.length; i++) {
                        if (companies[i].key == geography.id) {
                            topList = companies[i].values;
                            l = topList.length;
                        }
                    }
                    document.getElementById("top1").innerHTML = topList[0].name;
                    document.getElementById("top2").innerHTML = topList[1].name;
                    document.getElementById("top3").innerHTML = topList[2].name;
                    document.getElementById("top4").innerHTML = topList[3].name;
                    document.getElementById("top5").innerHTML = topList[4].name;
                    document.getElementById("top6").innerHTML = topList[5].name;
                    document.getElementById("top7").innerHTML = topList[6].name;
                    document.getElementById("top8").innerHTML = topList[7].name;
                    document.getElementById("top9").innerHTML = topList[8].name;
                    document.getElementById("top10").innerHTML = topList[9].name;
                    
                });
            },
            scope: 'usa',
            fills: colorSet,
            // fills: { defaultFill: '#F5F5F5'},
            data: dataset,
            geographyConfig: {
                borderColor: '#DEDEDE',
                highlightBorderWidth: 4,
                // don't change color on mouse hover
                // highlightFillColor: function(geo) {
                //     return geo['fillKey'] || '#addd8e';
                // },
                // only change border
                highlightBorderColor: '#FFFFFF',
                

                // show desired information in tooltip
                popupTemplate: function(geo, data) {
                    // don't show tooltip if country don't present in dataset
                    if (!data) { return ; }
                    // tooltip content
                    var t = data.fundingTotal/1000000;
                    return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>Number of Startups: <strong>', data.numberOfThings, '</strong>',
                        '<br>Total Fundings: <strong>', t.toFixed(2), 'M</strong>',
                        '</div>'].join('');
                }
            }

        });

        



    //time slide bar on call
   	d3.select("#nRadius").on("input", function() {
        var year = +this.value;
         d3.select("#nRadius-value").text(+this.value);
         
         indata = csv.filter(filterData);

        function filterData(datum) {
            return +datum["founded_year"] >= year;
        }

         indata=d3.nest()
        .key(function(d) {return d.state_code;})
        .rollup(function(d) {return {
            "length": d.length, "total_funding": d3.sum(d, function(g) {
                return parseFloat(g.funding_total_usd);
            })
        }})
        .entries(indata);

        indata.forEach(function(item){ //
        // item example value ["USA", 70]
            var iso = item.key,
                value = item.values.length,
                fundingTotal = item.values.total_funding;
            dataset[iso] = { numberOfThings: value, fillKey: paletteScale(value),
                        totalOfThings: fundingTotal };
            colorSet[paletteScale(value)] = paletteScale(value);
        });   

        map.updateChoropleth(dataset);
    });

})
