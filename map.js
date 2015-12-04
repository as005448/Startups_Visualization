var margin = {top: 50, right: 0, bottom: 40, left: 20};
var width = 520 - margin.left - margin.right;
var height = 420 - margin.top - margin.bottom;

var svg = d3.select(".scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        
        
        //manipulate data
          

        var map = new Datamap({
            element: document.getElementById('container'),
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
