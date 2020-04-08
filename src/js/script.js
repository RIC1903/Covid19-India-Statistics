//------------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------Main Script file for handling data fetching and chart generation--------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//

//-------------------------------------//
//------------DATA FETCH--------------//
//-----------------------------------//

//fetching data from covid19india api
var i;
var xmlhttp = new XMLHttpRequest();
var url = "https://api.covid19india.org/data.json";

xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        var data = JSON.parse(this.responseText);
        var date = []; //dates of the cases found
        var case_obj=[];//array of objects of date and cases (cummulative);
        var daily_conf =[];//daily conf cases;

        //looping across case_time_series
        for(i=0;i<data.cases_time_series.length;i++){
            date.push(data.cases_time_series[i].date);
            case_obj.push({"meta":date[i], "value":data.cases_time_series[i].totalconfirmed});
            daily_conf.push({"meta":date[i], "value":parseInt(data.cases_time_series[i].dailyconfirmed)});
        }
        // console.log(case_obj)
        //chart for cases vs days
        if(date.length !=0 && case_obj.length !=0 && daily_conf.length!=0){
        renderLineChart(date,case_obj)
        renderBarChartPeak(date,daily_conf);
        }
        // console.log(daily_conf);
        //chart caption
        loadCaption(data);

        //----------- Creating Statewise Object--------------//
        // console.log(data.statewise)
        var state = [[]]; //Object with keys as state and values as the array of active,recovered,confirmed and deceased
        for(i=0;i<data.statewise.length-1;i++)
        {
          state.push({"state":data.statewise[i].state,"confirmed":data.statewise[i].confirmed,"active":data.statewise[i].active,"recovered":data.statewise[i].recovered,"deceased":data.statewise[i].deaths});
        }
        // console.log(state[2].state)
        tableformation(state)
    }
}

xmlhttp.open("GET", url, true);
xmlhttp.send();
//------------END OF DATA FETCH--------------//
//------------------------------------------//

//--------------------------------------------//
//--------------CHART CAPTIONS---------------//
//------------------------------------------//

function loadCaption(data) {
    document.getElementById('conf-date').innerText=data.statewise[0].lastupdatedtime;
    document.getElementById('conf-value').innerText=data.statewise[0].confirmed+' cases';
}

//------------------------------------//
//--------------CHARTS---------------//
//----------------------------------//

//chart functions for line chart
function renderLineChart(label,data){
    var chartData = {
        labels: label,
        series: [
        data
        ]
    }

    var options = {
        height: '80%',
        low:0,
        showArea: true,
        plugins: [
            Chartist.plugins.tooltip()
          ],
        axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 7 === 0 ? '' + value : null;
            }
          }
    }
    var responsiveOptions = [
        ['screen and (max-width: 640px)', {
          axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 14 === 0 ? '' + value : null;
            }
          }
        }]
      ];
    var chart = new Chartist.Line('#ct-chart-conf-cumm', chartData, options, responsiveOptions);
    
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

//chart function for bar chart with peak points
// Create a simple bi-polar bar chart

function renderBarChartPeak(label,data){
    var chart = new Chartist.Bar('#ct-chart-conf-daily', {
        labels: label,
        series: [
            data
        ]
      }, {
        height: '80%',
        low:0,
        plugins: [
            Chartist.plugins.tooltip()
          ],
        axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 7 === 0 ? '' + value : null;
            }
          }
      });
      
      // Listen for draw events on the bar chart
      chart.on('draw', function(data) {
        // If this draw event is of type bar we can use the data to create additional content
        if(data.type === 'bar') {
          // We use the group element of the current series to append a simple circle with the bar peek coordinates and a circle radius that is depending on the value
          data.group.append(new Chartist.Svg('circle', {
            cx: data.x2,
            cy: data.y2,
            r: Math.abs(Chartist.getMultiValue(2)) * 1.5
          }, 'ct-slice-pie'));
        }
      });
      
}
//-------------------------------------------//
//--------------END OF CHARTS---------------//


//---------------START OF TABLE FORMATION--------------//
function tableformation(state){
  // var tbody = document.getElementById('tbody');
  // for(i=2;i<state.lenght;i++)
  // {
  //   var tr = "<tr>";
  //   tr += "<th>" + state[i].state + "</th>" + "<td>$" + state[i].confirmed + "</td>" + "<td>$" + state[i].active + "</td>" + "<td>$" + state[i].recovered + "</td>" + "<td>$" + state[i].deceased + "</td></tr>";
  //   tbody.innerHTML += tr;
  // }
  var k = '<tbody>'
    for(i = 2;i < state.length; i++){
        k+= '<tr>';
        k+= '<th>' + state[i].state + '</th>';
        k+= '<td>' + state[i].confirmed + '</td>';
        k+= '<td>' + state[i].active + '</td>';
        k+= '<td>' + state[i].recovered + '</td>';
        k+= '<td>' + state[i].deceased + '</td>';
        k+= '</tr>';
    }
    k+='</tbody>';
    document.getElementById('tbody').innerHTML = k;
}