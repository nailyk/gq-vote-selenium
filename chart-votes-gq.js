// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleUtc().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var lineKanye = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.scoreKanye); });

// define the line
var lineZayn = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.scoreZayn); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

function updateCurrentScore(data) {
    var last = data.slice(-1)[0];
    document.getElementById("currentScore").innerHTML = "Current score: " + last.scoreKanye + "% (" + last.date + ")";
}

function init() {

    // Get the data
    d3.csv("scores.csv", function (error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function (d) {
            d.date = new Date(d.date);
            d.scoreKanye = d.score;
            d.scoreZayn = 100.0 - d.score;
        });

        updateCurrentScore(data);

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, 100]);

        // Add the lineKanye path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", lineKanye(data));

        svg.append("path")
        .attr("class", "line2")
        .attr("d", lineZayn(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));

    });
}

function updateChart() {

    // Get the data
    d3.csv("scores.csv", function (error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function (d) {
            d.date = new Date(d.date);
            d.scoreKanye = d.score;
            d.scoreZayn = 100.0 - d.score;
        });

        updateCurrentScore(data);

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, 100]);

        var svg = d3.select("body").transition();

        svg.select(".line")
            .duration(750)
            .attr("d", lineKanye(data));

            svg.select(".line2")
            .duration(750)
            .attr("d", lineZayn(data));

        svg.select(".x.axis")
            .duration(750)
            .call(d3.axisBottom(x));

        svg.select(".y.axis")
            .duration(750)
            .call(d3.axisLeft(y));

    });
}


init();
setInterval(updateChart, 2000);
