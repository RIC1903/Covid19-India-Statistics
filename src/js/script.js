//Main Script file for handling data fetching and chart generation
//fetching data from covid19india api
var i;
var xmlhttp = new XMLHttpRequest();
var url = "https://api.covid19india.org/raw_data.json";

xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        var data = JSON.parse(this.responseText).raw_data;
        var date = []; //dates of the cases found
	var num_of_cases = new Array(2); //2d aray with date,no.of.cases
        for (i=0;i<data.length;i++){
            if (date.indexOf(data[i].dateannounced) == -1){
                date.push(data[i].dateannounced);
            }
        }
        // console.log(date);
        
        for (i=0;i<date.length; i++){
            num_of_cases[i] = new Array(2);
            num_of_cases[i][0]=date[i];
            num_of_cases[i][1]=0;
        }
        
        for (i=0;i<data.length;i++){
            var j = date.indexOf(data[i].dateannounced);
            for (var x = j; x<date.length; x++){
            num_of_cases[x][1]+=1;
            }
        }
        console.log(num_of_cases)
        //chart for cases vs days
        renderLineChart(date,num_of_cases[1])
    }
}

xmlhttp.open("GET", url, true);
xmlhttp.send();

//chart functions for above data
function renderLineChart(label,data){
    var chartData = {
        labels: label,
        series: [
        data
        ]
    }

    var options = {
        low:0,
        showArea: true,
        axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 8 === 0 ? '' + value : null;
            }
          }
    }
    var responsiveOptions = [
        ['screen and (min-width: 640px)', {
          axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 4 === 0 ? '' + value : null;
            }
          }
        }]
      ];
    var chart = new Chartist.Line('.ct-chart', chartData, options, responsiveOptions);
    
    // Let's put a sequence number aside so we can use it in the event callbacks
    var seq = 0,
        delays = 20,
        durations = 1500;
    
    // Once the chart is fully created we reset the sequence
    chart.on('created', function() {
        seq = 0;
    });
    
    // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
    chart.on('draw', function(data) {
        seq++;
    
        if(data.type === 'line') {
        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
        data.element.animate({
            opacity: {
            // The delay when we like to start the animation
            begin: seq * delays + 1000,
            // Duration of the animation
            dur: durations,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
            }
        });
        } else if(data.type === 'label' && data.axis === 'x') {
        data.element.animate({
            y: {
            begin: seq * delays,
            dur: durations,
            from: data.y + 100,
            to: data.y,
            // We can specify an easing function from Chartist.Svg.Easing
            easing: 'easeOutQuart'
            }
        });
        } else if(data.type === 'label' && data.axis === 'y') {
        data.element.animate({
            x: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 100,
            to: data.x,
            easing: 'easeOutQuart'
            }
        });
        } else if(data.type === 'point') {
        data.element.animate({
            x1: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
            },
            x2: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
            },
            opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'easeOutQuart'
            }
        });
        } else if(data.type === 'grid') {
        // Using data.axis we get x or y which we can use to construct our animation definition objects
        var pos1Animation = {
            begin: seq * delays,
            dur: durations,
            from: data[data.axis.units.pos + '1'] - 30,
            to: data[data.axis.units.pos + '1'],
            easing: 'easeOutQuart'
        };
    
        var pos2Animation = {
            begin: seq * delays,
            dur: durations,
            from: data[data.axis.units.pos + '2'] - 100,
            to: data[data.axis.units.pos + '2'],
            easing: 'easeOutQuart'
        };
    
        var animations = {};
        animations[data.axis.units.pos + '1'] = pos1Animation;
        animations[data.axis.units.pos + '2'] = pos2Animation;
        animations['opacity'] = {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'easeOutQuart'
        };
    
        data.element.animate(animations);
        }
    });
    
    // For the sake of the example we update the chart every time it's created with a delay of 10 seconds
    chart.on('created', function() {
        if(window.__exampleAnimateTimeout) {
        clearTimeout(window.__exampleAnimateTimeout);
        window.__exampleAnimateTimeout = null;
        }
        // window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 5000);
    });
}